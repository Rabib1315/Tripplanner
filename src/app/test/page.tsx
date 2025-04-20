'use client';

import { useEffect } from 'react';
import { auth } from '../../../firebase/config';

export default function TestPage() {
  useEffect(() => {
    console.log('Current Firebase Config:', {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    });
  }, []);

  return (
    <div>
      <h1>Firebase Test Page</h1>
      <p>Check the console for Firebase configuration details</p>
    </div>
  );
} 