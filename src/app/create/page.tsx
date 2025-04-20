'use client';

import { Card } from '@/app/components/ui/Card';
import CreateTripForm from '../components/CreateTripForm';
import Link from 'next/link';
import { Button } from '../components/ui/Button';

export default function CreateTripPage() {
  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 4rem)',
        width: '100%',
        padding: '2rem 1rem',
        background: 'rgb(249, 250, 251)'
      }}
    >
      <div style={{ width: '100%', maxWidth: '32rem' }}>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Create New Trip
          </h2>
          <Link href="/dashboard">
            <Button variant="secondary">
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <Card className="py-8 px-6 shadow-lg sm:rounded-xl">
          <CreateTripForm />
        </Card>
      </div>
    </div>
  );
} 