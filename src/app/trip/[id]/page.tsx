'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from '../../auth/AuthContext';
import { getTrip, getTripAvailabilities, setAvailability } from '../../utils/db';
import { Trip, Availability, DateSuggestion } from '../../types';

export default function TripView() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    const fetchTripData = async () => {
      try {
        const tripData = await getTrip(params.id as string);
        if (!tripData) {
          setError('Trip not found');
          return;
        }
        setTrip(tripData);

        const tripAvailabilities = await getTripAvailabilities(params.id as string);
        setAvailabilities(tripAvailabilities);

        // Check if current user has already submitted availability
        const userAvailability = tripAvailabilities.find(a => a.userId === user?.uid);
        if (userAvailability) {
          setSelectedDates(userAvailability.dates);
          setIsSubmitted(true);
        }
      } catch (error) {
        setError('Failed to load trip data');
      } finally {
        setLoading(false);
      }
    };

    fetchTripData();
  }, [params.id, user, router]);

  const analyzeDates = (): DateSuggestion[] => {
    if (!trip) return [];

    const analysis: { [key: string]: DateSuggestion } = {};
    const totalPeople = availabilities.length;

    // Initialize analysis for all dates in range
    let currentDate = new Date(trip.dateRange.start);
    const endDate = new Date(trip.dateRange.end);
    
    while (currentDate <= endDate) {
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      analysis[dateStr] = {
        date: dateStr,
        availableCount: 0,
        availablePeople: [],
        percentage: 0,
      };
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Count availability for each date
    availabilities.forEach(person => {
      person.dates.forEach(date => {
        if (analysis[date]) {
          analysis[date].availableCount++;
          analysis[date].availablePeople.push(person.userName);
          analysis[date].percentage = (analysis[date].availableCount / totalPeople) * 100;
        }
      });
    });

    return Object.values(analysis)
      .sort((a, b) => b.availableCount - a.availableCount || a.date.localeCompare(b.date));
  };

  const handleDateSelect = (date: Date | null) => {
    if (!date) return;
    const dateStr = format(date, 'yyyy-MM-dd');
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter(d => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr].sort());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip || !user || selectedDates.length === 0) return;

    try {
      await setAvailability({
        tripId: trip.id,
        userId: user.uid,
        userName: user.displayName || 'Anonymous',
        dates: selectedDates,
      });

      // Refresh availabilities
      const updatedAvailabilities = await getTripAvailabilities(trip.id);
      setAvailabilities(updatedAvailabilities);
      setIsSubmitted(true);
    } catch (error: any) {
      setError(error.message || 'Failed to submit availability');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !trip || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error || 'Trip not found'}</p>
        </div>
      </div>
    );
  }

  const dateAnalysis = analyzeDates();
  const bestDates = dateAnalysis.filter(d => d.availableCount === availabilities.length && d.availableCount > 0);
  const goodDates = dateAnalysis.filter(d => d.percentage >= 75 && d.availableCount < availabilities.length);

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{trip.name}</h1>
          {trip.description && (
            <p className="text-xl text-gray-700 mb-4">{trip.description}</p>
          )}
          <p className="text-lg text-gray-600">
            Created by {trip.creatorId === user.uid ? 'you' : availabilities.find(a => a.userId === trip.creatorId)?.userName || 'Unknown'}
          </p>
        </div>

        {(bestDates.length > 0 || goodDates.length > 0) && (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Suggested Dates</h2>
            
            {bestDates.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-green-700 mb-3">
                  Perfect Matches (Everyone Available)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {bestDates.map(analysis => (
                    <div key={analysis.date} className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">
                        {format(new Date(analysis.date), 'EEEE, MMMM d, yyyy')}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        All {analysis.availableCount} people available
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {goodDates.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-blue-700 mb-3">
                  Good Options (75%+ Available)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {goodDates.map(analysis => (
                    <div key={analysis.date} className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">
                        {format(new Date(analysis.date), 'EEEE, MMMM d, yyyy')}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {analysis.availableCount} out of {availabilities.length} people available
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Available: {analysis.availablePeople.join(', ')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!isSubmitted ? (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Your Available Dates</h2>
            
            <div className="mb-8">
              <ReactDatePicker
                inline
                selected={null}
                onChange={handleDateSelect}
                minDate={trip.dateRange.start}
                maxDate={trip.dateRange.end}
                monthsShown={2}
                highlightDates={selectedDates.map(d => new Date(d))}
                dayClassName={date => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  const analysis = dateAnalysis.find(a => a.date === dateStr);
                  if (selectedDates.includes(dateStr)) {
                    return 'bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-semibold';
                  }
                  if (analysis && analysis.availableCount > 0) {
                    return 'bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg font-medium';
                  }
                  return 'hover:bg-gray-50 rounded-lg';
                }}
              />
              <div className="mt-4 text-lg text-gray-700">
                {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''} selected
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={selectedDates.length === 0}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg text-xl font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Submit Availability
            </button>
            {selectedDates.length === 0 && (
              <p className="text-sm text-red-600 text-center font-medium mt-2">Please select at least one date</p>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Response</h2>
            <p className="text-lg text-gray-700 mb-6">
              You're available on {selectedDates.length} date{selectedDates.length !== 1 ? 's' : ''}
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Update my availability
            </button>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Responses</h2>
          <div className="space-y-4">
            {availabilities.map((availability, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div>
                  <div className="text-xl font-semibold text-gray-900">
                    {availability.userId === user.uid ? 'You' : availability.userName}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Available on: {availability.dates.map(d => format(new Date(d), 'MMM d')).join(', ')}
                  </div>
                </div>
                <div className="text-lg font-medium text-gray-900">
                  {availability.dates.length} date{availability.dates.length !== 1 ? 's' : ''} selected
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
} 