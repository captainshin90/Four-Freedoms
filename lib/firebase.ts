// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { Auth, getAuth, GoogleAuthProvider, FacebookAuthProvider, OAuthProvider } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Load environment variables
const dotenv = require('dotenv');
dotenv.config();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const firestoreConfig = {
  databaseId: process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let googleProvider: GoogleAuthProvider;
let facebookProvider: FacebookAuthProvider;
let microsoftProvider: OAuthProvider;

export async function initAuth() : Promise<Auth> {

  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig); 
      console.log("Firebase app initialized successfully");
    } catch (error) {
      console.error("Firebase app initialization error:", error);
//      return auth;
    }
  } else {
      app = getApps()[0];
      console.log("Firebase app already initialized");
  }
 
  const auth = getAuth(app);
 
  // Initialize providers
  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const microsoftProvider = new OAuthProvider('microsoft.com');

  return auth ? Promise.resolve(auth) : Promise.reject("No user logged in");

}

export async function initFirestore(databaseId: string = "") : Promise<Firestore> {

  // let db: any; // Declare db at the beginning
  let dbstr: string = "";

  if (!getApps().length) {
    try {
      //console.log("Firebase apiKey=" + process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
      // console.log("Firebase appId=" + process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
      console.log('Firebase databaseId=' + process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID);

      app = initializeApp(firebaseConfig);      
      console.log("Firebase app initialized successfully");
    } catch (error) {
      console.error("Firebase app initialization error:", error);
    }
  } else {
      app = getApps()[0];
      console.log("Firebase app already initialized");
  }

  if (firestoreConfig.databaseId != undefined) 
    dbstr = firestoreConfig.databaseId;  // database from .env
  else
    dbstr = databaseId;   // database passed as argument

  try {
      db = getFirestore(app, dbstr); 
      console.log("Firestore database initialized: ", dbstr);
    } catch (error) {
    console.error("Firestore database error:", error);
  }

  return db;
}

// module.export is the legacy CommmonJS syntax that uses require() to import
// module.exports = { app, auth, db, firebaseConfig, firestoreConfig, googleProvider, facebookProvider, microsoftProvider };

export { app, auth, db, firebaseConfig, firestoreConfig, googleProvider, facebookProvider, microsoftProvider };


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