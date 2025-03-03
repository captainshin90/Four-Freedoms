import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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

// API service for podcasts
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
  
  // Search podcasts
  searchPodcasts: async (query: string) => {
    const response = await apiClient.get(`/podcasts/search?q=${query}`);
    return response.data;
  },
};

// API service for chat/LLM
export const chatService = {
  // Send message to LLM
  sendMessage: async (message: string, conversationId?: string) => {
    const response = await apiClient.post('/chat', { message, conversationId });
    return response.data;
  },
  
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

// API service for user preferences
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