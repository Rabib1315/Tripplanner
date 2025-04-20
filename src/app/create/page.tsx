'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DatePicker from '../components/DatePicker';
import { format } from 'date-fns';

export default function CreateTrip() {
  const router = useRouter();
  const [tripName, setTripName] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [yourName, setYourName] = useState('');
  const [yourEmail, setYourEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // For now, we'll just generate a random trip ID
    // In a real app, this would be handled by the backend
    const tripId = Math.random().toString(36).substring(2, 15);
    router.push(`/trip/${tripId}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Create Your Trip
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          <div>
            <label htmlFor="tripName" className="block text-xl font-semibold text-gray-900 mb-2">
              Trip Name
            </label>
            <input
              type="text"
              id="tripName"
              value={tripName}
              onChange={(e) => setTripName(e.target.value)}
              className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="e.g., Summer Beach Vacation"
              required
            />
          </div>

          <div>
            <label htmlFor="yourName" className="block text-xl font-semibold text-gray-900 mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="yourName"
              value={yourName}
              onChange={(e) => setYourName(e.target.value)}
              className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label htmlFor="yourEmail" className="block text-xl font-semibold text-gray-900 mb-2">
              Your Email
            </label>
            <input
              type="email"
              id="yourEmail"
              value={yourEmail}
              onChange={(e) => setYourEmail(e.target.value)}
              className="w-full px-4 py-3 text-lg rounded-lg border-2 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-xl font-semibold text-gray-900 mb-4">
              Select Possible Dates
            </label>
            <p className="text-gray-600 mb-4">
              Click on dates to select or deselect them. You can select multiple dates.
            </p>
            <div className="border-2 border-gray-200 rounded-lg p-4 bg-white">
              <DatePicker
                selectedDates={selectedDates}
                onChange={setSelectedDates}
                minDate={new Date()}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={selectedDates.length === 0}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Create and Share Trip
          </button>
          {selectedDates.length === 0 && (
            <p className="text-sm text-red-600 text-center">Please select at least one date</p>
          )}
        </form>
      </div>
    </main>
  );
} 