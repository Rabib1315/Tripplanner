import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

// Debug logging - remove in production
if (typeof window !== 'undefined') {
  console.log('Environment Variables Check:');
  console.log('API KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  console.log('AUTH DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  console.log('PROJECT ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log('STORAGE BUCKET:', process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
  console.log('MESSAGING SENDER ID:', process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
  console.log('APP ID:', process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
  console.log('MEASUREMENT ID:', process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID);
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Debug logging - remove in production
console.log('Firebase Config:', firebaseConfig);

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export { app, db, auth, analytics }; 