// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { Auth, getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
// let app: FirebaseApp | undefined;
// let db: Firestore | undefined;
// let auth: Auth | undefined;
let app: FirebaseApp | null;
let db: Firestore | null;
let auth: Auth | null;
let googleProvider: GoogleAuthProvider;
let facebookProvider: FacebookAuthProvider;
let microsoftProvider: OAuthProvider;

export async function initFirebase(databaseId: string | null) : Promise<Firestore | null> {

  if (!getApps().length) {
    try {
      //console.log("Firebase apiKey=" + process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
      // console.log("Firebase appId=" + process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
      console.log('Firebase Emulator=' + process.env.USE_FIREBASE_EMULATOR);

      app = initializeApp(firebaseConfig);      
      console.log("Firebase app initialized successfully");
    } catch (error) {
      console.error("Firebase app initialization error:", error);
      return null;
    }
  } else {
      app = getApps()[0];
      console.log("Firebase app already initialized");
  }

  if (databaseId) {
    db = getFirestore(app, databaseId);
  }
  else {
    db = getFirestore(app);  // default database
  }
  auth = getAuth(app);

  // Initialize providers
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const microsoftProvider = new OAuthProvider('microsoft.com');

  return db;
  
}

export { app, auth, db, googleProvider, facebookProvider, microsoftProvider };


// To add App Check (recaptcha) to your app, import the following functions
/***** Firebase App Check *****
import { initializeApp } from "firebase/app";
import { getAppCheck, getToken } from "firebase/app-check";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "four-freedoms-451318", //Your Project ID
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize App Check.  Replace "recaptcha" with your chosen provider if needed.
const appCheck = getAppCheck(app);

// Example of getting an App Check token (replace 'YOUR_BACKEND_ENDPOINT' with the actual URL.)
async function getAndUseToken(){
    try {
        const token = await getToken(appCheck);
        //Send this token to your backend along with other request parameters
        const response = await fetch('YOUR_BACKEND_ENDPOINT', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Firebase-AppCheck': token //Add the token to the request header
            },
            body: JSON.stringify({data: 'your data here'})
        });
        const data = await response.json();
        console.log(data);
    } catch (error){
        console.error("Error getting token or sending request:", error);
    }
}

getAndUseToken();
******/