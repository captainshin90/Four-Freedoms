require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const config = require('./config');

// Verify environment variables are loaded
console.log('Environment variables loaded:', {
   hasGeminiKey: !!process.env.GEMINI_API_KEY,
   hasOpenAIKey: !!process.env.OPENAI_API_KEY,
   nodeEnv: process.env.NODE_ENV
});

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes - must be after middleware
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Load environment variables - it doesn't load properly here, it's done in firebase.js
// none of the .env parameters are ready properly here - why?
const PORT = process.env.PORT || 3001;
// const dbid = config.firestore.databaseId;
// const geminikey = config.gemini.apiKey;

console.log(`Index.js: Port: ${PORT}`);
// console.log(`Index.js: Database id: ${process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID}`);
// console.log(`Index.js: Database id: ${dbid}`);
// console.log(`Index.js: Gemini key: ${geminikey}`);

// initialize Firebase - done by DatabaseService and AuthService
// initFirebase();

// Start server with error handling
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Please try a different port or kill the existing process.`);
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