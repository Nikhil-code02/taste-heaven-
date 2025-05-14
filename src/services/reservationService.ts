import { collection, addDoc, getDocs, query, where, doc, updateDoc, deleteDoc, getDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from './firebase';

export interface Reservation {
  id?: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  date: Date;
  time: string;
  guests: number;
  occasion?: string;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'canceled';
  createdAt?: Date;
  updatedAt?: Date;
}

export const reservationService = {
  // Create a new reservation
  async createReservation(reservationData: Omit<Reservation, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const reservationWithMetadata = {
        ...reservationData,
        status: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const docRef = await addDoc(collection(db, 'reservations'), reservationWithMetadata);
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
        const data = doc.data();
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
        const data = docSnap.data();
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
        updatedAt: new Date()
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
      await updateDoc(docRef, { 
        ...data,
        updatedAt: new Date()
      });
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
      
      const reservationsQuery = query(
        collection(db, 'reservations'),
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay),
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