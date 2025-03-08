const { OpenAI } = require('openai');
const config = require('../config');

// Initialize OpenAI client with proper error handling
let openai;
try {
  if (config.openai.apiKey) {
    openai = new OpenAI({
      apiKey: config.openai.apiKey,
    });
    console.log('OpenAI client initialized successfully');
  } else {
    console.warn('OpenAI API key is missing, creating fallback client');
    // Create a fallback client that will provide meaningful error messages
    openai = {
      chat: {
        completions: {
          create: async () => {
            return {
              choices: [
                {
                  message: {
                    content: "I'm sorry, the AI service is currently unavailable due to a configuration issue. Please try again later."
                  }
                }
              ]
            };
          }
        }
      }
    };
  }
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
  // Create a fallback client that will provide meaningful error messages
  openai = {
    chat: {
      completions: {
        create: async () => {
          return {
            choices: [
              {
                message: {
                  content: "I'm sorry, the AI service is currently unavailable due to a configuration issue. Please try again later."
                }
              }
            ]
          };
        }
      }
    }
  };
}

// LLM Service for handling different LLM providers
class LLMService {
  // Process a message with OpenAI
  async processWithOpenAI(message, context = []) {
    try {
      if (!config.openai.apiKey && !process.env.OPENAI_API_KEY) {
        console.warn('OpenAI API key is not configured');
        return {
          content: "I'm sorry, the AI service is currently unavailable due to a configuration issue. Please try again later.",
          provider: 'fallback',
        };
      }
      
      // Format the messages for OpenAI
      const messages = [
        ...context.map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.content,
        })),
        { role: 'user', content: message },
      ];
      
      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        messages,
        model: config.openai.model || 'gpt-3.5-turbo',
      });
      
      return {
        content: completion.choices[0].message.content,
        provider: 'openai',
      };
    } catch (error) {
      console.error('Error calling OpenAI:', error);
      return {
        content: "I'm sorry, I couldn't process your request due to an API configuration issue. Please try again later or contact support.",
        provider: 'fallback',
      };
    }
  }
  
  // Process a message with Google Gemini (placeholder for now)
  async processWithGemini(message, context = []) {
    try {
      if (!config.gemini.apiKey) {
        console.warn('Gemini API key is not configured');
        return {
          content: "I'm sorry, the Gemini AI service is currently unavailable due to a configuration issue. Please try again later.",
          provider: 'fallback',
        };
      }
      
      // This would be implemented when the Gemini API is available
      // For now, return a placeholder response
      return {
        content: "This is a placeholder response from Gemini. The actual implementation would use the Gemini API.",
        provider: 'gemini',
      };
    } catch (error) {
      console.error('Error calling Gemini:', error);
      return {
        content: "I'm sorry, I couldn't process your request with Gemini. Please try again later.",
        provider: 'fallback',
      };
    }
  }
  
  // Process a message with the best available provider
  async processMessage(message, context = [], preferredProvider = 'openai') {
    try {
      // Use the preferred provider if available
      if (preferredProvider === 'openai' && (config.openai.apiKey || process.env.OPENAI_API_KEY)) {
        return await this.processWithOpenAI(message, context);
      } else if (preferredProvider === 'gemini' && config.gemini.apiKey) {
        return await this.processWithGemini(message, context);
      }
      
      // Fallback to any available provider
      if (config.openai.apiKey || process.env.OPENAI_API_KEY) {
        return await this.processWithOpenAI(message, context);
      } else if (config.gemini.apiKey) {
        return await this.processWithGemini(message, context);
      }
      
      // No providers available
      console.warn('No LLM providers are configured');
      return {
        content: "I'm sorry, no language model providers are currently configured. The chat functionality is limited at this time.",
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
}

module.exports = new LLMService();