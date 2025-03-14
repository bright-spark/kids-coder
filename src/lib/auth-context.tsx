'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, FirebaseError } from 'firebase/auth';
import { auth, createUserWithEmailAndPassword } from './firebase';

// Map Firebase error codes to user-friendly messages
const getErrorMessage = (error: FirebaseError) => {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'The email address is not valid.',
    'auth/user-disabled': 'This user account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/weak-password': 'The password is too weak.',
    'auth/invalid-credential': 'Invalid login credentials.',
    'auth/invalid-api-key': 'Firebase API key is missing or invalid. Please contact support.',
    'auth/operation-not-allowed': 'This operation is not allowed.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
  };

  return errorMessages[error.code] || `Authentication error: ${error.message}`;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  authError: string | null;
  signUpWithEmail?: (email: string, password: string) => Promise<User>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  authError: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe = () => {};
    
    try {
      if (!auth) {
        throw new Error('Firebase auth is not initialized. Check your Firebase configuration.');
      }
      
      unsubscribe = auth.onAuthStateChanged(
        (user) => {
          setUser(user);
          setLoading(false);
          setAuthError(null);
        },
        (error) => {
          console.error('Auth state change error:', error);
          setAuthError(error instanceof FirebaseError ? getErrorMessage(error) : error.message);
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Auth initialization error:', error);
      setAuthError(error instanceof Error ? error.message : 'Failed to initialize authentication');
      setLoading(false);
    }

    return () => unsubscribe();
  }, []);

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      if (!auth) {
        throw new Error('Firebase auth is not initialized. Check your Firebase configuration.');
      }
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await result.user.sendEmailVerification({
        url: window.location.origin,
      });
      setAuthError(null);
      return result.user;
    } catch (error) {
      console.error('Error in email sign up:', error);
      const errorMessage = error instanceof FirebaseError ? getErrorMessage(error) : 'Failed to sign up. Please try again.';
      setAuthError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, authError, signUpWithEmail }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);