import { db } from './firebase';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, query, where, orderBy, limit, deleteDoc, writeBatch, arrayUnion } from 'firebase/firestore';

export interface PaymentMethod {
  id?: string;
  userId: string;
  type: 'credit' | 'debit' | 'paypal' | 'applepay' | 'googlepay';
  cardType?: 'visa' | 'mastercard' | 'amex' | 'discover';
  nameOnCard?: string;
  last4: string;
  expiryMonth?: string;
  expiryYear?: string;
  billingAddressId?: string;
  isDefault: boolean;
  email?: string; // For PayPal
  createdAt: Date;
  updatedAt: Date;
}

export const paymentService = {
  async addPaymentMethod(userId: string, paymentMethod: Omit<PaymentMethod, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // If this is the first payment method or marked as default, make sure it's set as default
      let isDefault = paymentMethod.isDefault;
      
      // Check if user has any payment methods
      const existingPaymentMethods = await this.getUserPaymentMethods(userId);
      if (existingPaymentMethods.length === 0) {
        isDefault = true;
      }
      
      // If this is set as default, unset other default payment methods
      if (isDefault) {
        await this.clearDefaultPaymentMethod(userId);
      }
      
      // Create a unique ID for this payment method
      const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Create the payment method object
      const newPaymentMethod: PaymentMethod = {
        id: paymentId,
        userId,
        ...paymentMethod,
        isDefault,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Check if user payments document exists
      const userPaymentsRef = doc(db, 'userPayments', userId);
      const userPaymentsDoc = await getDoc(userPaymentsRef);
      
      if (userPaymentsDoc.exists()) {
        // Add to existing document
        await updateDoc(userPaymentsRef, {
          paymentMethods: arrayUnion(newPaymentMethod)
        });
      } else {
        // Create new document
        await setDoc(userPaymentsRef, {
          userId,
          paymentMethods: [newPaymentMethod]
        });
      }
      
      return paymentId;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  },
  
  async updatePaymentMethod(userId: string, paymentMethodId: string, paymentMethod: Partial<PaymentMethod>): Promise<void> {
    try {
      const userPaymentsRef = doc(db, 'userPayments', userId);
      const userPaymentsDoc = await getDoc(userPaymentsRef);
      
      if (!userPaymentsDoc.exists()) {
        throw new Error('User payment methods not found');
      }
      
      const paymentMethods = userPaymentsDoc.data().paymentMethods || [];
      const paymentIndex = paymentMethods.findIndex((payment: PaymentMethod) => payment.id === paymentMethodId);
      
      if (paymentIndex === -1) {
        throw new Error('Payment method not found');
      }
      
      // If updating to make this payment method default, clear other defaults
      if (paymentMethod.isDefault && !paymentMethods[paymentIndex].isDefault) {
        await this.clearDefaultPaymentMethod(userId);
      }
      
      // Create updated payment method
      const updatedPayment = {
        ...paymentMethods[paymentIndex],
        ...paymentMethod,
        updatedAt: new Date()
      };
      
      // Update the payment methods array
      const updatedPaymentMethods = [...paymentMethods];
      updatedPaymentMethods[paymentIndex] = updatedPayment;
      
      // Update the document
      await setDoc(userPaymentsRef, {
        userId,
        paymentMethods: updatedPaymentMethods
      });
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  },
  
  async deletePaymentMethod(userId: string, paymentMethodId: string): Promise<void> {
    try {
      const userPaymentsRef = doc(db, 'userPayments', userId);
      const userPaymentsDoc = await getDoc(userPaymentsRef);
      
      if (!userPaymentsDoc.exists()) {
        throw new Error('User payment methods not found');
      }
      
      const paymentMethods = userPaymentsDoc.data().paymentMethods || [];
      const paymentToDelete = paymentMethods.find((payment: PaymentMethod) => payment.id === paymentMethodId);
      
      if (!paymentToDelete) {
        throw new Error('Payment method not found');
      }
      
      // Filter out the payment method to delete
      const updatedPaymentMethods = paymentMethods.filter((payment: PaymentMethod) => payment.id !== paymentMethodId);
      
      // Update the document
      await setDoc(userPaymentsRef, {
        userId,
        paymentMethods: updatedPaymentMethods
      });
      
      // If the deleted payment method was the default, set another payment method as default
      if (paymentToDelete.isDefault && updatedPaymentMethods.length > 0) {
        const newDefaultPayment = updatedPaymentMethods[0];
        await this.updatePaymentMethod(userId, newDefaultPayment.id!, { isDefault: true });
      }
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw error;
    }
  },
  
  async getUserPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      const userPaymentsRef = doc(db, 'userPayments', userId);
      const userPaymentsDoc = await getDoc(userPaymentsRef);
      
      if (userPaymentsDoc.exists()) {
        const paymentMethods = userPaymentsDoc.data().paymentMethods || [];
        
        // Sort payment methods: default first, then by creation date
        return paymentMethods.sort((a: PaymentMethod, b: PaymentMethod) => {
          if (a.isDefault && !b.isDefault) return -1;
          if (!a.isDefault && b.isDefault) return 1;
          
          // If same default status, sort by creation date (newest first)
          const dateA = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt);
          const dateB = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt);
          return dateB.getTime() - dateA.getTime();
        });
      }
      
      return [];
    } catch (error) {
      console.error('Error getting user payment methods:', error);
      throw error;
    }
  },
  
  async getPaymentMethod(userId: string, paymentMethodId: string): Promise<PaymentMethod | null> {
    try {
      const userPaymentsRef = doc(db, 'userPayments', userId);
      const userPaymentsDoc = await getDoc(userPaymentsRef);
      
      if (userPaymentsDoc.exists()) {
        const paymentMethods = userPaymentsDoc.data().paymentMethods || [];
        const paymentMethod = paymentMethods.find((payment: PaymentMethod) => payment.id === paymentMethodId);
        
        return paymentMethod || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting payment method:', error);
      throw error;
    }
  },
  
  async getDefaultPaymentMethod(userId: string): Promise<PaymentMethod | null> {
    try {
      const userPaymentsRef = doc(db, 'userPayments', userId);
      const userPaymentsDoc = await getDoc(userPaymentsRef);
      
      if (userPaymentsDoc.exists()) {
        const paymentMethods = userPaymentsDoc.data().paymentMethods || [];
        const defaultPayment = paymentMethods.find((payment: PaymentMethod) => payment.isDefault);
        
        return defaultPayment || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting default payment method:', error);
      throw error;
    }
  },
  
  async clearDefaultPaymentMethod(userId: string): Promise<void> {
    try {
      const userPaymentsRef = doc(db, 'userPayments', userId);
      const userPaymentsDoc = await getDoc(userPaymentsRef);
      
      if (userPaymentsDoc.exists()) {
        const paymentMethods = userPaymentsDoc.data().paymentMethods || [];
        
        // Set all payment methods to non-default
        const updatedPaymentMethods = paymentMethods.map((payment: PaymentMethod) => ({
          ...payment,
          isDefault: false,
          updatedAt: new Date()
        }));
        
        // Update the document
        await setDoc(userPaymentsRef, {
          userId,
          paymentMethods: updatedPaymentMethods
        });
      }
    } catch (error) {
      console.error('Error clearing default payment method:', error);
      throw error;
    }
  }
};