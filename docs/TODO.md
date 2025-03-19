# To Do List and Issues

### To Do
x - initial code generated from Bolt.new
x - setup project in Firebase
x - setup database in Firestore
x - seed the database with fake data
x - store project in GitHub repo
x - deploy to Netlify: fourfreedoms.netlify.app
x - debugging - see #Code Build Notes
x - get audio player to play podcasts
x - debug database: topics, podcasts 
x - (no need) change to Supabase
x - deploy to Netlify without .env.local - use netlify env:import .env.local
- get user authentication to work
- make search work: topics, podcasts for city, state, nearby
- User signup form
- connect chatbot to Gemini/OpenAI - both public and private chats
- make entries smaller in the chatbox window
- play with Chroma db - can use for simple data?
- make the app all database-driven: users, topics, personas, with correct normalized entity (one-to-many) relationships, etc.
- add topic bubble of trending topics: based on views/plays, likes, timeframe
- promote new podcast on the top banner
- upgrade Next.js, Node, Express, Tailwind, Radix, Axios, Cors, React, etc.  
- interactive podcast (audio) - will be major work
- add database indexes to improve performance
- hide podcasts behind an API and credentials
- find real-time AI voice chat
- connect to Spotify API to get content
- add location support to pull nearby towns
- Podcast shorts with link to source documents
- Audio samples: https://www.thepodcastexchange.ca/audio-samples


### New Feature Ideas
- Bubble of trending tags, topics, and issues. Highlight breaking hot issues. A word cloud of the major topics that were discussed in meetings over the past week, month, year. then users can click on the topic they care about and get a briefing of what has been happening and discussed
- Interactive podcasts.


3/16/25: Google User authentication issue
Error in signInWithProvider (google): FirebaseError: Firebase: Error (auth/configuration-not-found).
The error "auth/configuration-not-found" typically occurs when Firebase isn't properly configured with the OAuth settings in the Firebase Console or when the environment variables aren't properly loaded. Let's fix this:
Now, let's check if your Firebase project is properly configured for Google Sign-In. You'll need to:
1. Go to the Firebase Console (https://console.firebase.google.com)
2. Select your project
3. Go to Authentication > Sign-in method
4. Enable Google Sign-in
5. Add your authorized domains

1. First, check your .env.local file (or wherever you store your environment variables) and make sure you have all the required variables:

2. In the Firebase Console:
- Go to Authentication > Sign-in methods
- Enable Google as a sign-in provider
- Add your application domain to the "Authorized domains" list
- For local development, add localhost
3. Make sure your OAuth consent screen is configured in the Google Cloud Console:
- Go to the Google Cloud Console
- Select your Firebase project
- Go to APIs & Services > OAuth consent screen
- Configure the OAuth consent screen if not already done
- Add necessary scopes (email, profile)

The changes I've made to the code:
1. Added validation for required environment variables
2. Added logging to help debug configuration issues
3. Added additional OAuth scopes for Google Sign-in
4. Added more robust error checking during initialization
5. Added proper configuration for the Google provider
