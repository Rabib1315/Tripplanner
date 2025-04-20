import { Timestamp } from 'firebase/firestore';

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Timestamp;
}

export interface Trip {
  id: string;
  creatorId: string;
  name: string;
  description?: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  participants: string[]; // user IDs
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Availability {
  id: string;
  tripId: string;
  userId: string;
  userName: string;
  dates: string[]; // Array of date strings in ISO format
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DateSuggestion {
  date: string;
  availableCount: number;
  availablePeople: string[];
  percentage: number;
} 