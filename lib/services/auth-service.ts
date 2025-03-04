import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  sendPasswordResetEmail,
  User,
  UserCredential,
  onAuthStateChanged
} from "firebase/auth";
import { 
  auth,
  googleProvider, 
  facebookProvider, 
  microsoftProvider 
} from "@/lib/firebase";
import { usersService } from "./database-service";

export type AuthProvider = 'google' | 'facebook' | 'microsoft';
export type AuthMethod = 'popup' | 'redirect';

class AuthService {
  // Get the current user

  getCurrentUser(): User | null {
    return auth ? auth.currentUser : null;
  }

  // Sign up with email and password
  async signUpWithEmail(email: string, password: string, userData: any): Promise<UserCredential> {
    try {

      if (!auth) { 
        return Promise.reject(new Error("Firebase Auth is not initialized."));
      }
    
      console.log("Attempting to create user with email:", email);
      
      // Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log("User created successfully:", userCredential.user.uid);
      
      // Create the user profile in Firestore
      await usersService.createUser(userCredential.user.uid, {
        login_id: email,
        email1: email,
        first_name: userData.first_name || '',
        last_name: userData.last_name || '',
        subscription_type: 'free', // Default subscription
        ...userData
      });
      console.log("User profile created in Firestore");
      
      return userCredential;
    } catch (error) {
      console.error("Error in signUpWithEmail:", error);
      throw error;
    }
  }

  // Sign in with email and password
  async signInWithEmail(email: string, password: string): Promise<UserCredential> {
    try {
      if (!auth) { 
        return Promise.reject(new Error("Firebase Auth is not initialized."));
      }

      console.log("Attempting to sign in with email:", email);
      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Email sign in successful:", result.user.uid);
      return result;
    } catch (error) {
      console.error("Error in signInWithEmail:", error);
      throw error;
    }
  }

  // Sign in with a social provider
  async signInWithProvider(providerName: AuthProvider, method: AuthMethod = 'popup'): Promise<UserCredential | void> {
    let provider;
    
    switch (providerName) {
      case 'google':
        provider = googleProvider;
        break;
      case 'facebook':
        provider = facebookProvider;
        break;
      case 'microsoft':
        provider = microsoftProvider;
        break;
      default:
        throw new Error(`Unsupported provider: ${providerName}`);
    }
    
    try {
      console.log(`Attempting to sign in with ${providerName} using ${method} method`);
      
      if (!auth) { 
        return Promise.reject(new Error("Firebase Auth is not initialized."));
      }

      // Sign in with the provider using the specified method
      let userCredential;
      
      if (method === 'popup') {
        userCredential = await signInWithPopup(auth, provider);
        console.log(`${providerName} popup sign in successful:`, userCredential.user.uid);
      } else {
        // For redirect method, we initiate the redirect and don't get a result immediately
        console.log(`Redirecting to ${providerName} sign in page...`);
        await signInWithRedirect(auth, provider);
        return; // The function will return here, and the page will redirect
      }
      
      // Check if the user exists in Firestore
      const userDoc = await usersService.getUserById(userCredential.user.uid);
      
      // If the user doesn't exist, create a profile
      if (!userDoc) {
        console.log("User doesn't exist in Firestore, creating profile...");
        const user = userCredential.user;
        await usersService.createUser(user.uid, {
          login_id: user.email,
          email1: user.email,
          first_name: user.displayName?.split(' ')[0] || '',
          last_name: user.displayName?.split(' ').slice(1).join(' ') || '',
          avatar: user.photoURL,
          subscription_type: 'free' // Default subscription
        });
        console.log("User profile created in Firestore");
      }
      
      return userCredential;
    } catch (error) {
      console.error(`Error in signInWithProvider (${providerName}):`, error);
      throw error;
    }
  }

  // Get the result of a redirect sign-in
  async getRedirectResult(): Promise<UserCredential | null> {
    try {
      console.log("Getting redirect result...");

      if (!auth) { 
        return Promise.reject(new Error("Firebase Auth is not initialized."));
      }

      const result = await getRedirectResult(auth);
      
      if (result) {
        console.log("Redirect sign in successful:", result.user.uid);
        
        // Check if the user exists in Firestore
        const userDoc = await usersService.getUserById(result.user.uid);
        
        // If the user doesn't exist, create a profile
        if (!userDoc) {
          console.log("User doesn't exist in Firestore, creating profile...");
          const user = result.user;
          await usersService.createUser(user.uid, {
            login_id: user.email,
            email1: user.email,
            first_name: user.displayName?.split(' ')[0] || '',
            last_name: user.displayName?.split(' ').slice(1).join(' ') || '',
            avatar: user.photoURL,
            subscription_type: 'free' // Default subscription
          });
          console.log("User profile created in Firestore");
        }
      } else {
        console.log("No redirect result");
      }
      
      return result;
    } catch (error) {
      console.error('Error in getRedirectResult:', error);
      throw error;
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      if (!auth) { 
        return Promise.reject(new Error("Firebase Auth is not initialized."));
      }

      console.log("Attempting to sign out user");
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error in signOut:", error);
      throw error;
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<void> {
    try {
      if (!auth) { 
        return Promise.reject(new Error("Firebase Auth is not initialized."));
      }

      console.log("Sending password reset email to:", email);
      await sendPasswordResetEmail(auth, email);
      console.log("Password reset email sent successfully");
    } catch (error) {
      console.error("Error in resetPassword:", error);
      throw error;
    }
  }

  // Subscribe to auth state changes
  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    if (!auth) {
      throw new Error("Firebase Auth is not initialized.");
    }
    return onAuthStateChanged(auth, callback);
  }
}

export const authService = new AuthService();