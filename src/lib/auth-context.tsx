'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { auth, createUserWithEmailAndPassword } from './firebase'; // Added import

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
}>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await result.user.sendEmailVerification({
        url: window.location.origin, // Redirect URL after email verification
      });
      return result.user;
    } catch (error) {
      console.error('Error in email sign up:', error);
      throw error;
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, signUpWithEmail }}> {/* Added signUpWithEmail to context */}
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);