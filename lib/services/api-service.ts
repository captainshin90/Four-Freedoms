import axios from 'axios';
import { episodesService, transcriptsService } from './database-service';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://fourfreedoms.fly.dev:3001'  // Production API URL
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',  // Development API URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add timeout
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Error:', error.message);
    }
    return Promise.reject(error);
  }
);

///////////////////////////////////////////////////////////////////////////////
// chatAPIService API service for chat/LLM
///////////////////////////////////////////////////////////////////////////////
export const chatAPIService = {

  // Send message to LLM
  // Parameters: message, conversationId, podcastContext
  sendMessage: async (
    message: string, 
    conversationId?: string,
    podcastContext?: {
    episodeId: string;
    }
  ) => {
    try {
      let episodeContext = null;
      
      // If podcast context is provided, fetch the episode details
      if (podcastContext) {
        try {
          const episode = await episodesService.getEpisodeById(podcastContext.episodeId);
          const transcript = await transcriptsService.getTranscriptById(episode?.transcript_id);
          if (episode) {
            episodeContext = {   
              // be careful as this must match formatPodcastContext in server/services/llm-service.js
              // episode_id: episode.id,  // no need to send this to LLM
              episode_title: episode.episode_title,
              episode_desc: episode.episode_desc,
              content_duration: episode.content_duration,
              transcript_type: transcript?.transcript_type,
              transcript_text: transcript?.transcript_text,   // should be full source transcript document
              // documents:[transcript?.documents]       // TODO: can have multiple documents
              // topic_tags: episode.topic_tags          // TODO: can have multiple topic tags
              topic_tags: ['townhall', 'politics', 'election']  // hard code for now
            };
          }
        } catch (error) {
          console.error('Error fetching episode context:', error);
          // Continue without episode context if fetch fails
        }
      }
      
      // Context array for additional context (not needed with conversationId)
      const context: any[] = [];
      // TODO: should reset conversationId when user clicks on a new episode?      
      // send message to LLM service server-side (must match the route in server/routes/api.js)
      // Parameters: message, conversationId, context, episodeContext (must match the route in server/routes/api.js)
      const response = await apiClient.post('/chat', { 
        message, 
        conversationId,                  // conversationId needed for LLM service
        context,                         // context not needed with conversationId
        episodeContext                   // episodeContext needed for LLM service
      });

      // response must match the format in server/routes/api.js
      // response: response.content,
      // provider: response.provider,
      // conversationId: response.conversation_id
      if (!response.data) {
        throw new Error('No data received from API');
      }

      return response.data;
    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error; // Re-throw to be handled by the caller
    }
  },

  
  // TODO: These should be client side calls to databaseService?

  // Get conversation history
  getConversationHistory: async (conversationId: string) => {
    const response = await apiClient.get(`/chat/conversations/${conversationId}`);
    return response.data;
  },
  
  // Get all conversations
  getConversations: async () => {
    const response = await apiClient.get('/chat/conversations');
    return response.data;
  },
};


///////////////////////////////////////////////////////////////////////////////
// podcastService API service for podcasts to server-side API points
///////////////////////////////////////////////////////////////////////////////
// TODO: These should be client side calls to databaseService?

export const podcastService = {
  // Get featured podcasts
  getFeaturedPodcasts: async () => {
    const response = await apiClient.get('/podcasts/featured');
    return response.data;
  },
  
  // Get podcast by ID
  getPodcast: async (id: string) => {
    const response = await apiClient.get(`/podcasts/${id}`);
    return response.data;
  },
  
  // Get podcast episodes
  getPodcastEpisodes: async (podcastId: string) => {
    const response = await apiClient.get(`/podcasts/${podcastId}/episodes`);
    return response.data;
  },
  
    // Get episode by ID
    getEpisode: async (podcastId: string, episodeId: string) => {
      const response = await apiClient.get(`/podcasts/${podcastId}/episodes/${episodeId}`);
      return response.data;
    },

    // Get transcript by ID
    getTranscript: async (transcriptId: string) => {
      const response = await apiClient.get(`/transcripts/${transcriptId}`);
      return response.data;
    },
  
  // Search podcasts
  searchPodcasts: async (query: string) => {
    const response = await apiClient.get(`/podcasts/search?q=${query}`);
    return response.data;
  },
};


///////////////////////////////////////////////////////////////////////////////
// userService API service for user preferences
///////////////////////////////////////////////////////////////////////////////
// TODO: These should be client side calls to databaseService?

export const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  },
  
  // Update user profile
  updateProfile: async (profileData: any) => {
    const response = await apiClient.put('/user/profile', profileData);
    return response.data;
  },
  
  // Get user favorites
  getFavorites: async () => {
    const response = await apiClient.get('/user/favorites');
    return response.data;
  },
  
  // Add to favorites
  addToFavorites: async (itemId: string, itemType: 'podcast' | 'episode') => {
    const response = await apiClient.post('/user/favorites', { itemId, itemType });
    return response.data;
  },
  
  // Remove from favorites
  removeFromFavorites: async (itemId: string) => {
    const response = await apiClient.delete(`/user/favorites/${itemId}`);
    return response.data;
  },
  
  // Get recently played
  getRecentlyPlayed: async () => {
    const response = await apiClient.get('/user/recently-played');
    return response.data;
  },
};