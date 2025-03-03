# Four Freedoms - API Documentation

## Backend API Endpoints

### Health Check
```
GET /api/health
```
Returns the status of the API server.

**Response:**
```json
{
  "status": "ok",
  "message": "API is running"
}
```

### Chat Endpoints

#### Send Message
```
POST /api/chat
```
Sends a message to the LLM service and returns a response.

**Request Body:**
```json
{
  "message": "What are the key points from this podcast?",
  "context": [
    {
      "sender": "user",
      "content": "Hello, I'm listening to the education reform podcast."
    },
    {
      "sender": "assistant",
      "content": "Great! How can I help you with that podcast?"
    }
  ],
  "preferredProvider": "openai"
}
```

**Response:**
```json
{
  "response": "The key points from the education reform podcast include...",
  "provider": "openai"
}
```

### Text-to-Speech Endpoints

#### Generate Speech
```
POST /api/tts
```
Converts text to speech using the configured TTS provider.

**Request Body:**
```json
{
  "text": "This is the text to convert to speech",
  "preferredProvider": "elevenlabs"
}
```

**Response:**
```json
{
  "audioData": "base64-encoded-audio-data",
  "provider": "elevenlabs",
  "format": "mp3"
}
```

### Podcast Endpoints

#### Get Featured Podcasts
```
GET /api/podcasts/featured
```
Returns a list of featured podcasts.

**Response:**
```json
{
  "podcasts": [
    {
      "id": "1",
      "title": "The Daily Insight",
      "description": "Daily news and analysis",
      "coverImage": "https://example.com/image.jpg",
      "creator": "News Network"
    },
    ...
  ]
}
```

#### Get Podcast Details
```
GET /api/podcasts/:id
```
Returns details for a specific podcast.

**Response:**
```json
{
  "id": "1",
  "title": "The Daily Insight",
  "description": "Daily news and analysis",
  "coverImage": "https://example.com/image.jpg",
  "creator": "News Network",
  "episodes": [
    {
      "id": "ep1",
      "title": "Episode 1: Introduction",
      "description": "An introduction to the podcast",
      "duration": 1800,
      "publishedAt": "2023-01-01T12:00:00Z"
    },
    ...
  ]
}
```

#### Get Episode Details
```
GET /api/podcasts/:podcastId/episodes/:episodeId
```
Returns details for a specific episode.

**Response:**
```json
{
  "id": "ep1",
  "podcastId": "1",
  "title": "Episode 1: Introduction",
  "description": "An introduction to the podcast",
  "audioUrl": "https://example.com/audio.mp3",
  "duration": 1800,
  "publishedAt": "2023-01-01T12:00:00Z"
}
```

### User Endpoints

#### Get User Profile
```
GET /api/user/profile
```
Returns the profile of the authenticated user.

**Response:**
```json
{
  "id": "123",
  "name": "John Doe",
  "email": "john@example.com",
  "subscription": "free"
}
```

#### Get User Favorites
```
GET /api/user/favorites
```
Returns the favorites of the authenticated user.

**Response:**
```json
{
  "favorites": [
    {
      "id": "1",
      "type": "podcast",
      "title": "The Daily Insight",
      "coverImage": "https://example.com/image.jpg"
    },
    ...
  ]
}
```

## Firebase Authentication API

The application uses Firebase Authentication for user management. The following methods are available through the `authService`:

### Sign Up with Email
```javascript
signUpWithEmail(email, password, userData)
```

### Sign In with Email
```javascript
signInWithEmail(email, password)
```

### Sign In with Provider
```javascript
signInWithProvider(provider) // 'google', 'facebook', or 'microsoft'
```

### Sign Out
```javascript
signOut()
```

### Reset Password
```javascript
resetPassword(email)
```

## Firebase Firestore API

The application uses Firebase Firestore for data storage. The following services are available for database operations:

### Generic Database Service
```javascript
// Create a document with a specific ID
createWithId(collection, id, data)

// Create a document with auto-generated ID
create(collectionName, data)

// Get a document by ID
getById(collectionName, id)

// Update a document
update(collectionName, id, data)

// Delete a document
delete(collectionName, id)

// Get all documents from a collection
getAll(collectionName)

// Query documents with filters
query(collectionName, conditions, orderByField, orderDirection, limitCount)
```

### Specific Collection Services
Each collection has its own service with specialized methods:

- usersService
- subscriptionsService
- personasService
- documentsService
- topicsService
- transcriptsService
- promptsService
- podcastsService
- episodesService
- questionsService
- chatsService

These services provide methods for creating, reading, updating, and deleting documents in their respective collections, as well as specialized query methods.