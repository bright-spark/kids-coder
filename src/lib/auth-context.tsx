import { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { auth, createUserWithEmailAndPassword } from './firebase';
import { useRouter } from 'next/navigation';

const AuthContext = createContext<{ user: User | null; loading: boolean; error: FirebaseError | null; login: (email: string, password: string) => Promise<{ success: boolean; error?: FirebaseError }>; logout: () => void; } | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirebaseError | null>(null);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
      return { success: true };
    } catch (error) {
      handleError(error as FirebaseError);
      return { success: false, error };
    }
  };

  const handleLogout = () => {
    // Implement logout logic here using auth.signOut()
    auth.signOut();
    setUser(null);

  };


  const handleError = (error: FirebaseError) => {
    setError(error);
    setLoading(false);
    //Add error handling here.  e.g., show alert
    console.error("Login Error:", error);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const value = { user, loading, error, login: handleLogin, logout: handleLogout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};