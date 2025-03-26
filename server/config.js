// server-side configuration
const dotenv = require('dotenv');
dotenv.config();

// Configuration object for all API keys and settings

const config = {
  port: process.env.PORT || 3000,
  apiPort: process.env.API_PORT || 3001,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api', 
  
  defaultLlmProvider: process.env.DEFAULT_LLM_PROVIDER || 'gemini',
  defaultTtsProvider: process.env.DEFAULT_TTS_PROVIDER || 'elevenlabs',

  // OpenAI configuration
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    llmModel: process.env.OPENAI_LLM_MODEL || 'gpt-3.5-turbo',
    maxTokens: process.env.OPENAI_MAX_TOKENS || 1000,
    temperature: process.env.OPENAI_TEMPERATURE || 0.7,
  },
  
  // Google Gemini configuration
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    llmModel: process.env.GEMINI_LLM_MODEL || 'gemini-pro',
    maxTokens: process.env.GEMINI_MAX_TOKENS || 1000,
    temperature: process.env.GEMINI_TEMPERATURE || 0.7,
  },

  // Anthropic   configuration
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    llmModel: process.env.ANTHROPIC_LLM_MODEL || 'claude-3-5-sonnet',
    maxTokens: process.env.ANTHROPIC_MAX_TOKENS || 1000,
    temperature: process.env.ANTHROPIC_TEMPERATURE || 0.7,
  },

  // Deepseek configuration
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    apiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com/v1',
    llmModel: process.env.DEEPSEEK_LLM_MODEL || 'deepseek-chat',
    maxTokens: process.env.DEEPSEEK_MAX_TOKENS || 1000,
    temperature: process.env.DEEPSEEK_TEMPERATURE || 0.7,
  },

  // ElevenLabs configuration
  elevenLabs: {
    apiKey: process.env.ELEVENLABS_API_KEY || '',
    voiceId: process.env.ELEVENLABS_VOICE_ID || 'default',
  },
  
  // Play.ai configuration
  playAi: {
    apiKey: process.env.PLAYAI_API_KEY || '',
  },
  
  // Firebase configuration 
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
  },

// Firestore configuration
  firestore: {
    databaseId: process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID || '',
  },

}; 

module.exports = config;