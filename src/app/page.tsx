'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth/AuthContext';
import { getUserTrips } from './utils/db';
import { Trip } from './types';
import { format } from 'date-fns';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loadingTrips, setLoadingTrips] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    const fetchTrips = async () => {
      if (user) {
        try {
          const userTrips = await getUserTrips(user.uid);
          setTrips(userTrips);
        } catch (error) {
          console.error('Error fetching trips:', error);
        } finally {
          setLoadingTrips(false);
        }
      }
    };

    fetchTrips();
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-blue-600">Your Trips</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user.displayName || 'Friend'}!</p>
        </div>
        <div className="flex gap-4">
          <Link
            href="/create"
            className="inline-flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
          >
            Create New Trip
          </Link>
          <button
            onClick={() => logout()}
            className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {loadingTrips ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : trips.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No trips yet. Create your first trip to get started!</p>
          <Link
            href="/create"
            className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Create New Trip
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{trip.name}</h2>
                  {trip.description && (
                    <p className="text-gray-600 mt-1">{trip.description}</p>
                  )}
                </div>
                <Link
                  href={`/trip/${trip.id}`}
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                >
                  View Details
                </Link>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <div className="flex items-center">
                  <span className="font-medium">Participants:</span>
                  <div className="ml-2 flex items-center">
                    <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded">
                      You {trip.participants.length > 1 ? `+${trip.participants.length - 1}` : ''}
                    </span>
                  </div>
                </div>
                <div className="ml-6">
                  <span className="font-medium">Matching Dates:</span>
                  <div className="ml-2 bg-green-100 text-green-600 px-2 py-0.5 rounded">
                    {format(trip.dateRange.start, 'MMM d')} - {format(trip.dateRange.end, 'MMM d, yyyy')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
