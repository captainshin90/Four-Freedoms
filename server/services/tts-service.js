const axios = require('axios');
const config = require('../config');

// Text-to-Speech Service for handling different TTS providers
class TTSService {
  // Generate speech with ElevenLabs
  async generateWithElevenLabs(text, voiceId = config.elevenLabs.voiceId) {
    try {
      if (!config.elevenLabs.apiKey) {
        console.warn('ElevenLabs API key is not configured');
        throw new Error('ElevenLabs API key is not configured');
      }
      
      const response = await axios({
        method: 'POST',
        url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': config.elevenLabs.apiKey,
        },
        data: {
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        },
        responseType: 'arraybuffer',
      });
      
      // Return audio data as base64
      return {
        audioData: Buffer.from(response.data).toString('base64'),
        provider: 'elevenlabs',
        format: 'mp3',
      };
    } catch (error) {
      console.error('Error calling ElevenLabs:', error);
      throw new Error('Failed to generate speech with ElevenLabs: ' + (error.message || 'Unknown error'));
    }
  }
  
  // Generate speech with Play.ai (placeholder for now)
  async generateWithPlayAi(text) {
    try {
      if (!config.playAi.apiKey) {
        console.warn('Play.ai API key is not configured');
        throw new Error('Play.ai API key is not configured');
      }
      
      // This would be implemented when the Play.ai API is available
      // For now, return a placeholder response
      return {
        audioData: 'placeholder-audio-data',
        provider: 'playai',
        format: 'mp3',
      };
    } catch (error) {
      console.error('Error calling Play.ai:', error);
      throw new Error('Failed to generate speech with Play.ai: ' + (error.message || 'Unknown error'));
    }
  }
  
  // Generate speech with Gemini (placeholder for now)
  async generateWithGemini(text) {
    try {
      if (!config.gemini.apiKey) {
        console.warn('Gemini API key is not configured');
        throw new Error('Gemini API key is not configured');
      }
      
      // This would be implemented when the Gemini TTS API is available
      // For now, return a placeholder response
      return {
        audioData: 'placeholder-audio-data',
        provider: 'gemini',
        format: 'mp3',
      };
    } catch (error) {
      console.error('Error calling Gemini TTS:', error);
      throw new Error('Failed to generate speech with Gemini: ' + (error.message || 'Unknown error'));
    }
  }
  
  // Generate speech with the best available provider
  async generateSpeech(text, preferredProvider = 'elevenlabs') {
    try {
      // Use the preferred provider if available
      if (preferredProvider === 'elevenlabs' && config.elevenLabs.apiKey) {
        return await this.generateWithElevenLabs(text);
      } else if (preferredProvider === 'playai' && config.playAi.apiKey) {
        return await this.generateWithPlayAi(text);
      } else if (preferredProvider === 'gemini' && config.gemini.apiKey) {
        return await this.generateWithGemini(text);
      }
      
      // Fallback to any available provider
      if (config.elevenLabs.apiKey) {
        return await this.generateWithElevenLabs(text);
      } else if (config.playAi.apiKey) {
        return await this.generateWithPlayAi(text);
      } else if (config.gemini.apiKey) {
        return await this.generateWithGemini(text);
      }
      
      // No providers available
      console.warn('No TTS providers are configured');
      return {
        audioData: '',
        provider: 'fallback',
        format: 'none',
        message: 'Text-to-speech functionality is currently unavailable due to missing API configuration.'
      };
    } catch (error) {
      console.error('Error generating speech:', error);
      return {
        audioData: '',
        provider: 'fallback',
        format: 'none',
        message: error.message || 'Failed to generate speech'
      };
    }
  }
}

module.exports = new TTSService();