const express = require('express');
const router = express.Router();
const llmService = require('../services/llm-service');
const ttsService = require('../services/tts-service');

// Health check route
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Chat routes
router.post('/chat', async (req, res) => {
  try {
    const { message, context = [], preferredProvider } = req.body;
    
    const response = await llmService.processMessage(
      message, 
      context, 
      preferredProvider
    );
    
    res.status(200).json({
      response: response.content,
      provider: response.provider,
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to process chat message',
      response: "I'm sorry, I couldn't process your request. Please try again later."
    });
  }
});

// Text-to-Speech routes
router.post('/tts', async (req, res) => {
  try {
    const { text, preferredProvider } = req.body;
    
    const response = await ttsService.generateSpeech(
      text, 
      preferredProvider
    );
    
    // If there was an error but it was handled gracefully
    if (response.provider === 'fallback') {
      return res.status(200).json({
        audioData: '',
        provider: 'fallback',
        format: 'none',
        message: response.message || 'Text-to-speech conversion is currently unavailable.'
      });
    }
    
    res.status(200).json({
      audioData: response.audioData,
      provider: response.provider,
      format: response.format,
    });
  } catch (error) {
    console.error('Error in TTS endpoint:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate speech',
      message: "Text-to-speech conversion failed. Please try again later."
    });
  }
});

// Podcast routes (mock data for now)
router.get('/podcasts/featured', (req, res) => {
  res.status(200).json({
    podcasts: [
      {
        id: '1',
        title: 'The Daily Insight',
        description: 'Daily news and analysis',
        coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618',
        creator: 'News Network',
      },
      {
        id: '2',
        title: 'Tech Frontiers',
        description: 'Exploring the cutting edge of technology',
        coverImage: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74',
        creator: 'Future Labs',
      },
      // More podcasts...
    ]
  });
});

router.get('/podcasts/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({
    id,
    title: 'The Daily Insight',
    description: 'Daily news and analysis',
    coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618',
    creator: 'News Network',
    episodes: [
      {
        id: 'ep1',
        title: 'Episode 1: Introduction',
        description: 'An introduction to the podcast',
        duration: 1800, // 30 minutes in seconds
        publishedAt: '2023-01-01T12:00:00Z',
      },
      // More episodes...
    ],
  });
});

router.get('/podcasts/:podcastId/episodes/:episodeId', (req, res) => {
  const { podcastId, episodeId } = req.params;
  res.status(200).json({
    id: episodeId,
    podcastId,
    title: 'Episode 1: Introduction',
    description: 'An introduction to the podcast',
    audioUrl: 'https://example.com/audio.mp3', // This would be a real URL in production
    duration: 1800,
    publishedAt: '2023-01-01T12:00:00Z',
  });
});

// User routes (would require authentication in production)
router.get('/user/profile', (req, res) => {
  // This would normally verify the user's token
  res.status(200).json({
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    subscription: 'free',
  });
});

router.get('/user/favorites', (req, res) => {
  // This would normally verify the user's token
  res.status(200).json({
    favorites: [
      {
        id: '1',
        type: 'podcast',
        title: 'The Daily Insight',
        coverImage: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618',
      },
      // More favorites...
    ]
  });
});

module.exports = router;