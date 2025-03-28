# To Do List and Issues

### Completed
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
x - cloned repo to Google Cloud Shell
x - create index for chat history - no need
x - make entries smaller in the chatbox window
x - make search work: topics, podcasts for city, state, nearby
x - get user authentication to work: sign in, sign out
x - connect chatbot to Gemini/OpenAI/Deekseek - both public/private 
x - add transcript_id to episodes documents in Firestore
x - display markdown text from AI response in the chatbox
x - add button under user menu to clear chat history
x - show suggested questions to the right of the audio player
x - Define gemini model in a config
x - For Topics panel, have tabs for "Topics", "Podcasts" that the user is following
x - use font-family: "Clarkson", "Proxima Nova", "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
x - add hover on podcasts in Topic Panel
x - deploy to Fly.io: fourfreedoms.fly.dev
x - load .env to Fly.io
x - add See All button to reset podcast list
x - Implement "following_podcasts" for a user
x - Make the Add Topic + button handle both topics and podcasts
x - run npm audit fix --force
x - upgrade to Next.js 15.2.3 
x - move database_seed to a server script
x - created Firebase composite indexes for questions and chats
x - deploy to Fly.io
x - added fourfreedoms-polished-butterfly-4117.fly.dev/ domain to Firebase project settings:
https://console.firebase.google.com/u/0/project/four-freedoms-451318/authentication/settings


### Bug Fixes
x - Play/add to favorites overlay on podcast not working
x - suggested questions not displaying
x - user chat history not loading: returning no records
x - add is_deleted field to all the collections and documents.
x - check all the schemas: is_active, is_deleted, created_at vs created_datetime?
x - add id field to all the schmas, collections, and documents
x - Firebase doesn't update updated_at and created_id field
x - TopicPanel: Need slide in for topic-panel
x - search doesn't work
x - if search has no results, show defaults
x - Chat interface not working: Gemini, pass the podcast to the LLM
x - index.js - call to dotenv.config() doesn't read it. when is .env read in?
x - browser side: firestoreConfig is blank 
x - OPENAI_API_KEY undefined?
x - server side: config.js > config is not loaded
x - index.js -> config.js > (databaseId = "'') > start-server.js
x - Test if chat is sending episode context to AI
x - chat collection doesn't need updated_at, is_user
x - podcast audio player controls not working 
x - why the audio element defined in page.tsx?
x - Topic list is the mock list, not actual from the database
x - chat responses not being stored in history correctly
x - Add "following_podcasts" field to users collection
x - when updating, creating, or getting by Id, it needs to be Firestore Document Id. If need to find a user_id, topic_id, etc. it needs to pass a where condition.
x - Add and remove topics. Click on Add topic does nothing (see topic-panel.tsx "handleAddTopic"). Issue with "topic" being text, not id?
x - Topic list icons are cut off
x - podcast-list: handleAddToTopics - needs rework. should be handleAddtoPodcasts. 
x - Topic tags should be just unique names (#soccer), not Ids?
x - seed-data.ts updated
x - index.js: should user auth happen before database init (so it doesn't try to fetch topics, podcasts multiple times)? - it breaks the server
x - deploy to fly.io not working yet: see fly.io log	
x - run npm audit to check warnings and notices on packages and npm fix
x - App: topics, podcasts not displaying at first launch, needs to reload
x - click podcast play from PodcastList now not working
x - only allow one podcst to be played
x - suggested questions should wrap around in the button
x - bottom player controls are not working
x - bug when playing podcasts from different panels (podcast list, topic panel)
x - autoplay podcast
x - graceful error handling if the audio file doesn't exist (or typo)
x - it's sending the entire chat history
x - bug when selecting another podcast. Infinite loop?
x - conversation_id is not being set with a value in chats collection 
x - Fly.dev site not working on port 3001 (fixed itself next day)
x - understand conversation ID, is it similar to session ID? when do you start a new conversation ID?
x - user profile settings page: add home and cancel buttons
x - signed-in avatar is not visible
x - Gemini always requires the first context item to be "user" role.
x - Does Gemini accept "assistant" as well as "model"?  OpenAI and Deepseek use assistant, system.  Gemini doesn't seem to recognize "assistant".
x - podcast episode play events are not saved to chat history: mark as "podcast" or "content", convert to episode info to markdown text (with a link to play it again)? 

### To Do
- see Google Keep notes

Gemini models:
https://ai.google.dev/gemini-api/docs/models#gemini-2.0-flash-lite


Later (rearchitect, cleanup):
x - Need to configure NEXT_PUBLIC_API_URL in production?
- remove created_datetime from all documents in the database
- move database access from client-side to server-side
- move user messages to a config
- play with Chroma db - can use for simple data?
- cookies or offline json for user preferences
- hide podcasts behind an API and credentials
- upgrade Node/Bun, Express, Tailwind, Radix, Axios, Cors, React, etc.  
- add database indexes to improve performance

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
