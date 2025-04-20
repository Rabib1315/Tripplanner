'use client';

import { useState } from 'react';
import DatePicker from './DatePicker';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Participant {
  email: string;
  id: string;
}

export default function CreateTripForm() {
  const [tripName, setTripName] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState('');

  const handleDateChange = (dates: Date[]) => {
    setSelectedDates(dates);
  };

  const addParticipant = () => {
    if (newParticipant && newParticipant.includes('@')) {
      setParticipants([...participants, { email: newParticipant, id: Date.now().toString() }]);
      setNewParticipant('');
    }
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here we'll handle saving the trip data
    const [startDate, endDate] = selectedDates.length ? [selectedDates[0], selectedDates[selectedDates.length - 1]] : [null, null];
    console.log({ tripName, startDate, endDate, participants });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div>
        <label htmlFor="tripName" className="block text-sm font-medium text-gray-700">
          Trip Name
        </label>
        <input
          type="text"
          id="tripName"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Dates
        </label>
        <DatePicker
          selectedDates={selectedDates}
          onChange={handleDateChange}
          minDate={new Date()}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add Participants
        </label>
        <div className="flex gap-2">
          <input
            type="email"
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            placeholder="Enter email address"
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={addParticipant}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>

        <ul className="mt-4 space-y-2">
          {participants.map((participant) => (
            <li
              key={participant.id}
              className="flex items-center justify-between px-3 py-2 bg-gray-50 rounded-md"
            >
              <span>{participant.email}</span>
              <button
                type="button"
                onClick={() => removeParticipant(participant.id)}
                className="text-red-500 hover:text-red-700"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Create Trip
      </button>
    </form>
  );
}
