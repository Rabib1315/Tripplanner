import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { Trip, Availability, User } from '../types';

// User Operations
export const createUser = async (userId: string, userData: Partial<User>) => {
  await setDoc(doc(db, 'users', userId), {
    ...userData,
    createdAt: serverTimestamp(),
  });
};

export const getUser = async (userId: string) => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  return userDoc.exists() ? { id: userDoc.id, ...userDoc.data() } as User : null;
};

// Trip Operations
export const createTrip = async (tripData: Omit<Trip, 'id' | 'createdAt' | 'updatedAt'>) => {
  const tripRef = doc(collection(db, 'trips'));
  const trip: Trip = {
    ...tripData,
    id: tripRef.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  await setDoc(tripRef, trip);
  return trip;
};

export const getTrip = async (tripId: string) => {
  const tripDoc = await getDoc(doc(db, 'trips', tripId));
  return tripDoc.exists() ? { id: tripDoc.id, ...tripDoc.data() } as Trip : null;
};

export const getUserTrips = async (userId: string) => {
  const q = query(
    collection(db, 'trips'),
    where('participants', 'array-contains', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Trip);
};

export const updateTrip = async (tripId: string, updates: Partial<Trip>) => {
  const tripRef = doc(db, 'trips', tripId);
  await updateDoc(tripRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
};

// Availability Operations
export const setAvailability = async (availabilityData: Omit<Availability, 'id' | 'createdAt' | 'updatedAt'>) => {
  const availabilityRef = doc(collection(db, 'availability'));
  const availability: Availability = {
    ...availabilityData,
    id: availabilityRef.id,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
  await setDoc(availabilityRef, availability);
  return availability;
};

export const getTripAvailabilities = async (tripId: string) => {
  const q = query(
    collection(db, 'availability'),
    where('tripId', '==', tripId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Availability);
};

export const updateAvailability = async (availabilityId: string, updates: Partial<Availability>) => {
  const availabilityRef = doc(db, 'availability', availabilityId);
  await updateDoc(availabilityRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}; 