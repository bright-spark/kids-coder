
import { initializeApp } from 'firebase/app';
import { 
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';

// Check if Firebase config is available
const missingEnvVars = [];
if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) missingEnvVars.push('NEXT_PUBLIC_FIREBASE_API_KEY');
if (!process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) missingEnvVars.push('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) missingEnvVars.push('NEXT_PUBLIC_FIREBASE_PROJECT_ID');
if (!process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) missingEnvVars.push('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
if (!process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) missingEnvVars.push('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
if (!process.env.NEXT_PUBLIC_FIREBASE_APP_ID) missingEnvVars.push('NEXT_PUBLIC_FIREBASE_APP_ID');

if (missingEnvVars.length > 0) {
  console.error(`Firebase initialization error: Missing environment variables: ${missingEnvVars.join(', ')}`);
  console.error('Please add these variables to Replit Secrets (Tools → Secrets)');
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

let app;
let auth;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (error) {
  console.error('Firebase initialization error:', error);
  if (error.code === 'auth/invalid-api-key') {
    console.error('ERROR: Invalid Firebase API key. Please check your NEXT_PUBLIC_FIREBASE_API_KEY in Replit Secrets.');
  } else if (error.code === 'app/duplicate-app') {
    console.error('Firebase app already exists. Using existing instance.');
  } else {
    console.error(`Firebase error code: ${error.code}. Please check your Firebase configuration.`);
  }
}

export { 
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
};
