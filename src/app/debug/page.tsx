'use client';

import { useEffect } from 'react';
import { app, auth } from '../../../firebase/config';

export default function DebugPage() {
  useEffect(() => {
    // Test environment variables
    const envVars = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    };

    console.log('Debug Info:');
    console.log('Environment Variables:', envVars);
    console.log('Firebase App:', app);
    console.log('Auth Object:', auth);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Firebase Debug Page</h1>
      <p className="mb-2">Check the browser console for debug information.</p>
      <p className="text-sm text-gray-600">This page helps debug Firebase configuration and environment variables.</p>
    </div>
  );
} 