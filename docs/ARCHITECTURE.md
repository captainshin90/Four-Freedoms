# Four Freedoms - Architecture Documentation

## System Architecture

The Four Freedoms application follows a client-server architecture with the following components:

### Frontend (Client)
- **Framework**: Next.js with React
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React hooks and context
- **Authentication**: Firebase Authentication
- **API Communication**: Axios for HTTP requests

### Backend (Server)
- **Framework**: Node.js with Express.js
- **API Integrations**:
  - OpenAI for LLM capabilities
  - Google Gemini for alternative LLM
  - ElevenLabs for text-to-speech
  - Play.ai for alternative TTS
- **Database**: Firebase Firestore

### Database
Firebase Firestore is used as the primary database with the following collections:
- Users
- Subscriptions
- Personas
- Documents
- Topics
- Transcripts
- Prompts
- Podcasts
- Episodes
- Questions
- Chats

## Component Structure

### Frontend Components
1. **Layout Components**
   - Header: App title, search, user authentication status
   - Sidebar: Topic navigation and user options
   - Content Panel: Main content area for podcasts and chat
   - Bottom Bar: Minimized podcast player

2. **Feature Components**
   - PodcastList: Displays available podcasts
   - PodcastPlayer: Controls for podcast playback
   - ChatBox: Interface for AI assistant interaction
   - TopicPanel: Navigation and management of topics
   - UserProfile: User information and preferences

3. **UI Components**
   - Buttons, inputs, cards, etc. from shadcn/ui library
   - Custom components for specific UI needs

### Backend Services
1. **Authentication Service**
   - User registration and login
   - Social authentication providers
   - Session management

2. **Database Service**
   - CRUD operations for all collections
   - Query functions for specific data needs
   - Data validation and transformation

3. **LLM Service**
   - Integration with OpenAI and Gemini
   - Message processing and context management
   - Fallback mechanisms between providers

4. **TTS Service**
   - Integration with ElevenLabs and Play.ai
   - Audio generation and format handling
   - Provider selection and fallback

## Data Flow

1. **Authentication Flow**
   - User enters credentials or selects social provider
   - Firebase Authentication validates credentials
   - User profile is fetched from Firestore
   - Authentication state is maintained in React context

2. **Podcast Discovery Flow**
   - User selects a topic or browses featured content
   - Frontend requests podcasts from backend
   - Backend queries Firestore for matching podcasts
   - Results are displayed in the content panel

3. **Podcast Playback Flow**
   - User selects a podcast to play
   - Audio is loaded and controlled via HTML5 audio API
   - Playback state is managed in React state
   - Minimized player appears in bottom bar when navigating

4. **Chat Interaction Flow**
   - User types a question or selects a suggested question
   - Question is sent to backend LLM service
   - LLM processes the question and generates a response
   - Response is displayed in the chat interface
   - For logged-in users, the conversation is saved to Firestore

## Security Considerations

1. **Authentication Security**
   - Firebase Authentication handles secure credential storage
   - JWT tokens for session management
   - HTTPS for all communications

2. **Data Access Control**
   - Firestore security rules restrict access based on user ID
   - Premium content is protected based on subscription status
   - API keys are stored securely in environment variables

3. **Payment Information**
   - Sensitive payment data is tokenized
   - PCI compliance for payment processing
   - Minimal storage of payment details

## Scalability Considerations

1. **Frontend Scalability**
   - Component-based architecture for reusability
   - Code splitting for optimized loading
   - Static generation where possible

2. **Backend Scalability**
   - Stateless API design
   - Caching strategies for frequent queries
   - Load balancing capability

3. **Database Scalability**
   - Efficient indexing for common queries
   - Pagination for large result sets
   - Denormalization where appropriate for read performance