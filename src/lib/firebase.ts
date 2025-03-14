
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) throw new Error('Missing Firebase API Key');
if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) throw new Error('Missing Firebase Auth Domain');
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) throw new Error('Missing Firebase Project ID');
if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) throw new Error('Missing Firebase Storage Bucket');
if (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) throw new Error('Missing Firebase Messaging Sender ID');
if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) throw new Error('Missing Firebase App ID');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  
  export { 
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
  };
} catch (error) {
  console.error('Firebase initialization error:', error);
  throw error;
}
