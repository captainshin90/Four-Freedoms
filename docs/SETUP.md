# Four Freedoms - Setup Guide

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- Firebase account
- API keys for:
  - OpenAI
  - Google Gemini (optional)
  - ElevenLabs (optional)
  - Play.ai (optional)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/four-freedoms.git
cd four-freedoms
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   - Fill in the required environment variables in `.env.local`:
     - Firebase configuration
     - API keys for OpenAI, Gemini, ElevenLabs, and Play.ai
     - Server configuration

## Firebase Setup

1. Create a new Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)

2. Enable Authentication:
   - Go to Authentication > Sign-in method
   - Enable Email/Password authentication
   - Enable Google, Facebook, and Microsoft authentication (optional)
   - Configure the OAuth redirect domains

3. Create a Firestore database:
   - Go to Firestore Database
   - Create a new database in production mode
   - Choose a location close to your users

4. Set up Firebase Admin SDK:
   - Go to Project Settings > Service accounts
   - Generate a new private key
   - Save the JSON file securely
   - Add the necessary environment variables from this file

5. Configure Firebase in the application:
   - Update the Firebase configuration in `.env.local` with your project details

## Running the Application

1. Start the development server:
```bash
npm run dev
```
This will start both the Next.js frontend and the Express.js backend concurrently.

2. Seed the database with initial data:
   - Navigate to `http://localhost:3000/api/seed` in your browser
   - This will populate the database with sample data

3. Access the application:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:3001/api](http://localhost:3001/api)

## Building for Production

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Folder Structure

- `/app`: Next.js application routes and pages
- `/components`: React components
- `/hooks`: Custom React hooks
- `/lib`: Utility functions and services
  - `/lib/schemas`: TypeScript interfaces for database models
  - `/lib/services`: Service layer for API and database operations
- `/public`: Static assets
- `/server`: Express.js backend
  - `/server/routes`: API routes
  - `/server/services`: Backend services
- `/docs`: Documentation files

## Configuration Options

### Environment Variables

- `NEXT_PUBLIC_FIREBASE_*`: Firebase configuration
- `OPENAI_API_KEY`: API key for OpenAI
- `GEMINI_API_KEY`: API key for Google Gemini
- `ELEVENLABS_API_KEY`: API key for ElevenLabs
- `PLAYAI_API_KEY`: API key for Play.ai
- `PORT`: Port for the Express.js server

### Firebase Configuration

The Firebase configuration is stored in `lib/firebase.ts`. This file initializes the Firebase app and exports the necessary services:

- `auth`: Firebase Authentication
- `db`: Firestore database
- `googleProvider`: Google authentication provider
- `facebookProvider`: Facebook authentication provider
- `microsoftProvider`: Microsoft authentication provider

## Troubleshooting

### Common Issues

1. **Firebase Authentication Issues**
   - Ensure that the authentication providers are properly configured in the Firebase console
   - Check that the redirect domains are correctly set up
   - Verify that the Firebase configuration in `.env.local` is correct

2. **API Connection Issues**
   - Verify that the API keys are correctly set in `.env.local`
   - Check that the server is running on the expected port
   - Ensure that CORS is properly configured if accessing from a different domain

3. **Database Issues**
   - Check Firestore security rules to ensure proper access
   - Verify that the database has been seeded with initial data
   - Check for any errors in the database service layer

### Getting Help

If you encounter any issues not covered in this guide, please:

1. Check the Firebase documentation: [https://firebase.google.com/docs](https://firebase.google.com/docs)
2. Check the Next.js documentation: [https://nextjs.org/docs](https://nextjs.org/docs)
3. Open an issue in the project repository