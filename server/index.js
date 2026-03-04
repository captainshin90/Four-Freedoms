// Leave this file alone.
// keep as CommonJS for now. Changing to ES modules breaks the server
const config = require('./config');
const express = require('express');  // middleware
const cors = require('cors');        // middleware
const apiRoutes = require('./routes/api');

// Verify environment variables are loaded  
console.log('Environment variables loaded:', {
   hasGeminiKey: !!process.env.GEMINI_API_KEY,
   hasOpenAIKey: !!process.env.OPENAI_API_KEY,
   nodeEnv: process.env.NODE_ENV,
   port: process.env.PORT,
   apiPort: process.env.API_PORT,
   apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL
});

// Initialize Express middleware
const app = express();
app.use(cors());              // Enable CORS for all origins
app.use(express.json());      // Parse JSON bodies
app.use('/api', apiRoutes);   // API routes after middleware

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// console.log(`Index.js: Port: ${config.apiPort}`);
// console.log(`Index.js: Database id: ${config.firestore.databaseId}`);
// console.log(`Index.js: Gemini key: ${config.gemini.apiKey}`);

// Start server with error handling
const api_port = process.env.API_PORT || 3001;
const server = app.listen(api_port, "0.0.0.0", () => {
  console.log(`Server running on port ${api_port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${api_port} is already in use. Please try a different port or kill the existing process.`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});