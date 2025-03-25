// keep as CommonJS for now. Changing to ES modules breaks the server
const { OpenAI } = require('openai');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');
const config = require('../config');

///////////////////////////////////////////////////////////////////////////////
// Initialize LLM clients
///////////////////////////////////////////////////////////////////////////////

// Initialize OpenAI client
let openai;
try {
  openai = new OpenAI({
    apiKey: config.openai.apiKey,
    model: config.openai.llmModel,
  });
  console.log('OpenAI client initialized successfully');
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
}

// Initialize Gemini client
let gemini;
try {
  const apiKey = config.gemini.apiKey;
  console.log('Gemini API Key available:', !!apiKey); // Log if key exists without exposing it
  if (!apiKey) {
    console.error('Gemini API key is missing. Please check your environment variables.');
  }
  gemini = new GoogleGenerativeAI(apiKey);
  console.log('Gemini client initialized successfully');
} catch (error) {
  console.error('Error initializing Gemini client:', error);
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    config: {
      hasEnvKey: !!process.env.GEMINI_API_KEY,
      hasModel: !!process.env.GEMINI_LLM_MODEL,
      hasConfigKey: !!config.gemini.apiKey
    }
  });
}  // initializeGemini

// Initialize DeepSeek client
let deepseek;
try {
  const apiKey = config.deepseek.apiKey;
  console.log('DeepSeek API Key available:', !!apiKey);
  if (!apiKey) {
    console.error('DeepSeek API key is missing. Please check your environment variables.');
  }
  deepseek = {
    apiKey,
    baseUrl: config.deepseek.apiUrl || 'https://api.deepseek.com/v1',
  };
  console.log('DeepSeek client initialized successfully');
} catch (error) {
  console.error('Error initializing DeepSeek client:', error);
  console.error('Error details:', {
    message: error.message,
    stack: error.stack,
    config: {
      hasEnvKey: !!process.env.DEEPSEEK_API_KEY,
      hasModel: !!process.env.DEEPSEEK_LLM_MODEL,
      hasConfigKey: !!config.deepseek.apiKey
    }
  });
}  // initializeDeepSeek


///////////////////////////////////////////////////////////////////////////////
// LLM Service for handling different LLM providers
///////////////////////////////////////////////////////////////////////////////

class LLMService {
  // Format podcast context for LLMs
  formatPodcastContext(episode) {
    if (!episode) return ''; 
    
    return `
Context: You are answering questions about the following podcast episode:
Title: ${episode.episode_title}
Type: ${episode.transcript_type}
Description: ${episode.episode_desc}
Topics: ${episode.topic_tags?.join(', ') || 'No topics available'}
Duration: ${episode.content_duration} seconds
${episode.transcript_text ? `Transcript excerpt: ${episode.transcript_text.substring(0, 1000)}...` : 'No transcript available'}

Please use this context to provide relevant and informed responses about the podcast content.
`;
  }

  // Format conversation history for system prompt
  formatConversationHistory(context) {
    if (!context || context.length === 0) return '';
    
    return `
This is part of an ongoing conversation. Here is the relevant history:
${context.map(msg => `${msg.sender}: ${msg.content}`).join('\n')}

Please maintain context from these previous messages in your response.
`;
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Process a message with OpenAI
  ///////////////////////////////////////////////////////////////////////////////
  async processWithOpenAI(message, context = [], episode = null) {
    try {
      if (!openai) {
        console.warn('OpenAI client is not initialized');
        return {
          content: "I'm sorry, the OpenAI service is currently unavailable. Please try again later.",
          provider: 'fallback',
        };
      }

      // Format the messages for OpenAI
      const messages = [
        { 
          role: 'system', 
          content: `You are a helpful podcast assistant. 
                   ${episode ? this.formatPodcastContext(episode) : ''}
                   ${this.formatConversationHistory(context)}` 
        },
        ...context.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })),
        { role: 'user', content: message },
      ];

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        messages,
        model: config.openai.llmModel,
        temperature: config.openai.temperature,
        max_tokens: config.openai.maxTokens,
      });

      return {
        content: completion.choices[0].message.content,
        provider: 'openai'
      };
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      return {
        content: "I'm sorry, I couldn't process your request with OpenAI. Please try again later.",
        provider: 'fallback',
      };
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Process a message with Google Gemini
  ///////////////////////////////////////////////////////////////////////////////
  async processWithGemini(message, context = [], episode = null) {
    try {
      if (!gemini) {
        console.warn('Gemini client is not initialized');
        return {
          content: "I'm sorry, the Gemini service is currently unavailable. Please try again later.",
          provider: 'fallback',
        };
      }

      const model = gemini.getGenerativeModel({ model: config.gemini.llmModel });

      // Format the conversation history
      const formattedHistory = context.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      // Start a chat
      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          temperature: config.gemini.temperature,
          maxOutputTokens: config.gemini.maxTokens,
        },
      });

      // Prepare the message with context
      let fullMessage = message;
      
      // Add podcast context if available
      if (episode) {
        const podcastContext = this.formatPodcastContext(episode);
        if (podcastContext) {
          fullMessage = `Context about the current podcast: ${podcastContext}\n\nUser question: ${message}`;
        }
      }

      // Send message
      const result = await chat.sendMessage(fullMessage);

      return {
        content: result.response.text(),
        provider: 'gemini'
      };
    } catch (error) {
      console.error('Error calling Gemini:', {
        message: error.message,
        stack: error.stack,
        context: {
          messageLength: message?.length,
          contextLength: context?.length,
          hasEpisode: !!episode
        }
      });
      return {
        content: "I'm sorry, I couldn't process your request with Gemini. Please try again later.",
        provider: 'fallback',
      };
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Process a message with DeepSeek
  ///////////////////////////////////////////////////////////////////////////////
  async processWithDeepSeek(message, context = [], episode = null) {
    try {
      if (!deepseek) {
        console.warn('DeepSeek client is not initialized');
        return {
          content: "I'm sorry, the DeepSeek service is currently unavailable. Please try again later.",
          provider: 'fallback',
        };
      }

      // Format the messages for DeepSeek
      const prompt = [
        { 
          role: 'system', 
          content: `You are a helpful podcast assistant. 
                   ${episode ? this.formatPodcastContext(episode) : ''}
                   ${this.formatConversationHistory(context)}` 
        },
        ...context.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })),
        { role: 'user', content: message },
      ];

      // Call DeepSeek API
      const response = await axios.post(
        `${deepseek.baseUrl}/chat/completions`,
        {
          prompt,
          model: config.deepseek.llmModel,
          temperature: config.deepseek.temperature,
          max_tokens: config.deepseek.maxTokens,
        },
        {
          headers: {
            'Authorization': `Bearer ${deepseek.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        content: response.data.choices[0].message.content,
        provider: 'deepseek'
      };
    } catch (error) {
      console.error('Error calling DeepSeek:', error);
      return {
        content: "I'm sorry, I couldn't process your request with DeepSeek. Please try again later.",
        provider: 'fallback',
      };
    }
  }

  // Process a message with the best available provider
  async processMessage(message, context = [], episode = null, preferredProvider = config.defaultLlmProvider) {
    try {
      // Use the preferred provider if available
      if (preferredProvider === 'openai' && openai) {
        return await this.processWithOpenAI(message, context, episode);
      } else if (preferredProvider === 'gemini' && gemini) {
        return await this.processWithGemini(message, context, episode);
      } else if (preferredProvider === 'deepseek' && deepseek) {
        return await this.processWithDeepSeek(message, context, episode);
      }

      // Fallback to any available provider
      if (openai) {
        return await this.processWithOpenAI(message, context, episode);
      } else if (gemini) {
        return await this.processWithGemini(message, context, episode);
      } else if (deepseek) {
        return await this.processWithDeepSeek(message, context, episode);
      }

      // No providers available
      console.warn('No LLM providers are configured');
      return {
        content: "I'm sorry, no language model providers are currently configured. Please try again later.",
        provider: 'fallback',
      };
    } catch (error) {
      console.error('Error processing message:', error);
      return {
        content: "I'm sorry, there was an error processing your message. Please try again later.",
        provider: 'fallback',
      };
    }
  }
}  // LLMService class

module.exports = new LLMService();