// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

// Interface for Firestore data (using Timestamps)
interface FirestoreReservation {
  id?: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  date: Timestamp;
  time: string;
  guests: number;
  occasion?: string | null;
  specialRequests?: string | null;
  status: 'pending' | 'confirmed' | 'canceled';
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Interface for application use (using JavaScript Date)
export interface Reservation {
  id?: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
  occasion?: string | null;
  specialRequests?: string | null;
  status: 'pending' | 'confirmed' | 'canceled';
  createdAt?: Date;
  updatedAt?: Date;
}

// Helper function to remove undefined values from an object
const removeUndefinedValues = (obj: Record<string, any>): Record<string, any> => {
  const result: Record<string, any> = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const reservationService = {
  // Create a new reservation
  async createReservation(reservationData: Omit<Reservation, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Convert JavaScript Date objects to Firestore Timestamps
      const sanitizedData = {
        ...reservationData,
        // Remove empty strings and convert them to null (which Firestore accepts)
        occasion: reservationData.occasion || null,
        specialRequests: reservationData.specialRequests || null
      };

      const reservationWithMetadata: Record<string, any> = {
        ...sanitizedData,
        // Convert date to Firestore Timestamp before storing
        date: Timestamp.fromDate(sanitizedData.date),
        status: 'pending',
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date())
      };

      // Remove any undefined values before sending to Firestore
      const cleanedData = removeUndefinedValues(reservationWithMetadata);
      console.log('Cleaned data for Firestore:', cleanedData);

      const docRef = await addDoc(collection(db, 'reservations'), cleanedData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating reservation:', error);
      throw error;
    }
  },

  // Get all reservations for a user
  async getUserReservations(userId: string): Promise<Reservation[]> {
    try {
      const reservationsQuery = query(
        collection(db, 'reservations'),
        where('userId', '==', userId)
      );

      const querySnapshot = await getDocs(reservationsQuery);
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreReservation;
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate(), // Convert Firestore Timestamp to JavaScript Date
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Reservation;
      });
    } catch (error) {
      console.error('Error getting user reservations:', error);
      throw error;
    }
  },

  // Get reservation by ID
  async getReservationById(id: string): Promise<Reservation | null> {
    try {
      const docRef = doc(db, 'reservations', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as FirestoreReservation;
        return {
          id: docSnap.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as Reservation;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting reservation:', error);
      throw error;
    }
  },

  // Update reservation status
  async updateReservationStatus(id: string, status: Reservation['status']): Promise<void> {
    try {
      const docRef = doc(db, 'reservations', id);
      await updateDoc(docRef, { 
        status,
        updatedAt: Timestamp.fromDate(new Date())
      });
    } catch (error) {
      console.error('Error updating reservation status:', error);
      throw error;
    }
  },

  // Update reservation details
  async updateReservation(id: string, data: Partial<Reservation>): Promise<void> {
    try {
      const docRef = doc(db, 'reservations', id);
      
      // Create a new object for Firestore update
      const updateData: Record<string, any> = {};
      
      // Copy all fields except date
      Object.keys(data).forEach(key => {
        if (key !== 'date' && key !== 'createdAt' && key !== 'updatedAt') {
          const value = data[key as keyof Partial<Reservation>];
          // Only add non-undefined values, convert empty strings to null
          if (value !== undefined) {
            updateData[key] = value === '' ? null : value;
          }
        }
      });
      
      // Handle date conversion separately
      if (data.date) {
        updateData.date = Timestamp.fromDate(data.date);
      }
      
      // Always update the updatedAt timestamp
      updateData.updatedAt = Timestamp.fromDate(new Date());
      
      await updateDoc(docRef, updateData);
    } catch (error) {
      console.error('Error updating reservation:', error);
      throw error;
    }
  },

  // Cancel/delete reservation
  async cancelReservation(id: string): Promise<void> {
    try {
      await this.updateReservationStatus(id, 'canceled');
    } catch (error) {
      console.error('Error canceling reservation:', error);
      throw error;
    }
  },

  // Check availability for a given date and time
  async checkAvailability(date: Date, time: string): Promise<boolean> {
    try {
      // Convert JavaScript Date to Firestore Timestamp for query
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      // Convert to Firestore Timestamps
      const startTimestamp = Timestamp.fromDate(startOfDay);
      const endTimestamp = Timestamp.fromDate(endOfDay);
      
      const reservationsQuery = query(
        collection(db, 'reservations'),
        where('date', '>=', startTimestamp),
        where('date', '<=', endTimestamp),
        where('time', '==', time),
        where('status', '==', 'confirmed')
      );

      const querySnapshot = await getDocs(reservationsQuery);
      
      // Simple logic - if we have less than 5 reservations for this time slot, it's available
      // In a real app, you'd need more sophisticated logic based on restaurant capacity
      return querySnapshot.size < 5;
    } catch (error) {
      console.error('Error checking availability:', error);
      throw error;
    }
  }
}; 