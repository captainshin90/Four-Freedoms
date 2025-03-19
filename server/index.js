const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/api');
const config = require('./config');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
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
dotenv.config();

const PORT = process.env.PORT || 3001;
const dbid = config.firestore.databaseId;
const geminikey = config.gemini.apiKey;

console.log(`Index.js: Port: ${PORT}`);
console.log(`Index.js: Port: ${process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID}`);
console.log(`Index.js: Database id: ${dbid}`);
console.log(`Index.js: Database id: ${process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID}`);
console.log(`Index.js: Gemini key: ${geminikey}`);

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