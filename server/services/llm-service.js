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
    apiKey: process.env.OPENAI_API_KEY || config.openai.apiKey,
    model: process.env.OPENAI_LLM_MODEL || config.openai.llmModel,
  });
  console.log('OpenAI client initialized successfully');
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
}

// Initialize Gemini client
let gemini;
try {
  const apiKey = process.env.GEMINI_API_KEY || config.gemini.apiKey;
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
  const apiKey = process.env.DEEPSEEK_API_KEY || config.deepseek.apiKey;
  console.log('DeepSeek API Key available:', !!apiKey);
  if (!apiKey) {
    console.error('DeepSeek API key is missing. Please check your environment variables.');
  }
  deepseek = {
    apiKey,
    baseUrl: process.env.DEEPSEEK_API_URL || config.deepseek.apiUrl || 'https://api.deepseek.com/v1',
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
  // Add conversation history storage
  conversationHistory = new Map();

  // Generate a new conversation ID
  generateConversationId() {
    return `conv-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
  }

  // TODO: should reset conversationId when user clicks on a new episode?
  // Initialize a new conversation and return its ID
  initializeConversation() {
    const conversationId = this.generateConversationId();
    // Blank message must be passed to the conversation history
    this.conversationHistory.set(conversationId, []);  
    return conversationId;                             
  }

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

  // Get conversation history
  getConversationHistory(conversationId) {
    return this.conversationHistory.get(conversationId) || [];
  }

  // Update conversation history
  updateConversationHistory(conversationId, message) {
    const history = this.getConversationHistory(conversationId);
    history.push(message);
    this.conversationHistory.set(conversationId, history);
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Process a message with OpenAI
  ///////////////////////////////////////////////////////////////////////////////
  async processWithOpenAI(message, conversationId = null, context = [], episode = null) {
    try {
      if (!openai) {
        console.warn('OpenAI client is not initialized');
        return {
          content: "I'm sorry, the OpenAI service is currently unavailable. Please try again later.",
          provider: 'fallback',
        };
      }

      // Generate new conversation ID if none exists
      if (!conversationId) {
        conversationId = this.initializeConversation();
      }

      // Get conversation history
      const history = this.getConversationHistory(conversationId);

      // Format the messages for OpenAI
      const messages = [
        { 
          role: 'system', 
          content: `You are a helpful podcast assistant. ${episode ? this.formatPodcastContext(episode) : ''} 
                   ${conversationId ? `This is part of conversation ${conversationId}. Please maintain context from previous messages.` : ''}` 
        },
        ...history.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })),
        { role: 'user', content: message },
      ];

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        messages,
        model: process.env.OPENAI_LLM_MODEL || config.openai.llmModel,
        temperature: process.env.OPENAI_TEMPERATURE || config.openai.temperature,
        max_tokens: process.env.OPENAI_MAX_TOKENS || config.openai.maxTokens,
      });

      const response = {
        content: completion.choices[0].message.content,
        provider: 'openai',
        conversation_id: conversationId
      };

      // Update conversation history
      this.updateConversationHistory(conversationId, { sender: 'user', content: message });
      this.updateConversationHistory(conversationId, { sender: 'assistant', content: response.content });

      return response;
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
  async processWithGemini(message, conversationId = null, context = [], episode = null) {
    try {
      if (!gemini) {
        console.warn('Gemini client is not initialized');
        return {
          content: "I'm sorry, the Gemini service is currently unavailable. Please try again later.",
          provider: 'fallback',
        };
      }

      // Generate new conversation ID if none exists
      if (!conversationId) {
        conversationId = this.initializeConversation();
      }

      const model = gemini.getGenerativeModel({ model: process.env.GEMINI_LLM_MODEL || config.gemini.llmModel });

      // Get conversation history if conversationId exists, otherwise use context
      const history = this.getConversationHistory(conversationId);

      // Format the conversation history
      const formattedHistory = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      }));

      // Start a chat
      const chat = model.startChat({
        history: formattedHistory,
        generationConfig: {
          temperature: process.env.GEMINI_TEMPERATURE || config.gemini.temperature,
          maxOutputTokens: process.env.GEMINI_MAX_TOKENS || config.gemini.maxTokens,
        },
      });

      // Send message with podcast context if available
      const result = await chat.sendMessage(message + " " + this.formatPodcastContext(episode));

      const response = result.response;

      const responseObj = {
        content: response.text(),
        provider: 'gemini',
        conversation_id: conversationId  // Return the conversation ID in the response
      };

      // Update conversation history
      this.updateConversationHistory(conversationId, { sender: 'user', content: message });
      this.updateConversationHistory(conversationId, { sender: 'assistant', content: responseObj.content });

      return responseObj;
    } catch (error) {
      console.error('Error calling Gemini:', error);
      return {
        content: "I'm sorry, I couldn't process your request with Gemini. Please try again later.",
        provider: 'fallback',
      };
    }
  }

  ///////////////////////////////////////////////////////////////////////////////
  // Process a message with DeepSeek
  ///////////////////////////////////////////////////////////////////////////////
  async processWithDeepSeek(message, conversationId = null, context = [], episode = null) {
    try {
      if (!deepseek) {
        console.warn('DeepSeek client is not initialized');
        return {
          content: "I'm sorry, the DeepSeek service is currently unavailable. Please try again later.",
          provider: 'fallback',
        };
      }

      // TODO: should reset conversationId when user clicks on a new episode?
      // Generate new conversation ID if none exists
      if (!conversationId) {
        conversationId = this.initializeConversation();
      }

      // Get conversation history
      const history = this.getConversationHistory(conversationId);

      // Format the messages for DeepSeek
      const prompt = [
        { 
          role: 'system', 
          content: `You are a helpful podcast assistant. ${episode ? this.formatPodcastContext(episode) : ''}
                   ${conversationId ? `This is part of conversation ${conversationId}. Please maintain context from previous messages.` : ''}` 
        },
        ...history.map(msg => ({
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
          model: process.env.DEEPSEEK_LLM_MODEL || config.deepseek.llmModel,
          temperature: process.env.DEEPSEEK_TEMPERATURE || config.deepseek.temperature,
          max_tokens: process.env.DEEPSEEK_MAX_TOKENS || config.deepseek.maxTokens,
        },
        {
          headers: {
            'Authorization': `Bearer ${deepseek.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const responseObj = {
        content: response.data.choices[0].message.content,
        provider: 'deepseek',
        conversation_id: conversationId
      };

      // Update conversation history
      this.updateConversationHistory(conversationId, { sender: 'user', content: message });
      this.updateConversationHistory(conversationId, { sender: 'assistant', content: responseObj.content });

      return responseObj;
    } catch (error) {
      console.error('Error calling DeepSeek:', error);
      return {
        content: "I'm sorry, I couldn't process your request with DeepSeek. Please try again later.",
        provider: 'fallback',
      };
    }
  }

  // Process a message with the best available provider
  async processMessage(message, conversationId = null, context = [], episode = null, preferredProvider = config.defaultLlmProvider) {
    try {
      // Use the preferred provider if available
      if (preferredProvider === 'openai' && openai) {
        return await this.processWithOpenAI(message, conversationId, context, episode);
      } else if (preferredProvider === 'gemini' && gemini) {
        return await this.processWithGemini(message, conversationId, context, episode);
      } else if (preferredProvider === 'deepseek' && deepseek) {
        return await this.processWithDeepSeek(message, conversationId, context, episode);
      }

      // Fallback to any available provider
      if (openai) {
        return await this.processWithOpenAI(message, conversationId, context, episode);
      } else if (gemini) {
        return await this.processWithGemini(message, conversationId, context, episode);
      } else if (deepseek) {
        return await this.processWithDeepSeek(message, conversationId, context, episode);
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