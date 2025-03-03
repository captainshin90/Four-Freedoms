"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { User } from 'firebase/auth';
import { authService } from '@/lib/services/auth-service';
import { usersService } from '@/lib/services/database-service';
import { User as UserType } from '@/lib/schemas/users';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  userProfile: UserType | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signInWithProvider: (provider: 'google' | 'facebook' | 'microsoft') => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: Partial<UserType>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user profile from Firestore
  const fetchUserProfile = async (userId: string) => {
    try {
      const profile = await usersService.getUserById(userId);
      if (profile) {
        setUserProfile(profile as UserType);
      } else {
        console.log(`No profile found for user ${userId}`);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = authService.onAuthStateChanged((user) => {
      console.log("Auth state changed:", user ? `User ${user.uid} logged in` : "User logged out");
      setUser(user);
      
      if (user) {
        fetchUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authService.signInWithEmail(email, password);
      console.log("Sign in successful:", result.user.uid);
      return result;
    } catch (error: any) {
      console.error('Error signing in:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = "Failed to sign in. Please check your credentials and try again.";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Invalid email or password. Please try again.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later or reset your password.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection and try again.";
      }
      
      throw new Error(errorMessage);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const result = await authService.signUpWithEmail(email, password, userData);
      console.log("Sign up successful:", result.user.uid);
      return result;
    } catch (error: any) {
      console.error('Error signing up:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = "Failed to create account. Please try again.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "This email is already in use. Please try a different email or sign in.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak. Please use a stronger password.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address. Please check and try again.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection and try again.";
      }
      
      throw new Error(errorMessage);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'facebook' | 'microsoft') => {
    try {
      console.log(`Attempting to sign in with ${provider}`);
      // First try with popup
      try {
        const result = await authService.signInWithProvider(provider, 'popup');
        console.log(`${provider} sign in successful:`, result?.user?.uid);
        return result;
      } catch (error: any) {
        console.warn(`Popup sign in failed:`, error);
        // If popup is blocked, try with redirect
        if (error.code === 'auth/popup-blocked' || error.code === 'auth/popup-closed-by-user') {
          toast({
            title: "Popup blocked",
            description: "Redirecting to login page...",
          });
          await authService.signInWithProvider(provider, 'redirect');
        } else {
          throw error;
        }
      }
    } catch (error: any) {
      console.error(`Error signing in with ${provider}:`, error);
      
      // Provide more user-friendly error messages
      let errorMessage = `Failed to sign in with ${provider}. Please try again.`;
      if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = "An account already exists with the same email address but different sign-in credentials. Please sign in using the original provider.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "The sign-in process was cancelled. Please try again.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection and try again.";
      }
      
      throw new Error(errorMessage);
    }
  };

  const signOutUser = async () => {
    try {
      await authService.signOut();
      console.log("User signed out successfully");
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await authService.resetPassword(email);
      console.log("Password reset email sent to:", email);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      
      // Provide more user-friendly error messages
      let errorMessage = "Failed to send password reset email. Please try again.";
      if (error.code === 'auth/user-not-found') {
        errorMessage = "No account found with this email address.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "Invalid email address. Please check and try again.";
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = "Network error. Please check your internet connection and try again.";
      }
      
      throw new Error(errorMessage);
    }
  };

  const updateUserProfile = async (data: Partial<UserType>) => {
    try {
      if (user && userProfile) {
        await usersService.updateUser(user.uid, data);
        console.log("User profile updated successfully");
        // Refresh the profile
        await fetchUserProfile(user.uid);
      } else {
        throw new Error("No authenticated user found");
      }
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    signInWithProvider,
    signOut: signOutUser,
    resetPassword,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}