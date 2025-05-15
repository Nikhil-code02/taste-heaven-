import { db } from './firebase';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, query, where, orderBy, limit, deleteDoc, writeBatch, arrayUnion, arrayRemove } from 'firebase/firestore';

export interface Address {
  id?: string;
  userId: string;
  label: string; // Home, Work, etc.
  name: string; // Recipient name
  phoneNumber?: string;
  streetAddress: string;
  apartment?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const addressService = {
  async addAddress(userId: string, address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // If this is the first address or marked as default, make sure it's set as default
      let isDefault = address.isDefault;
      
      // Check if user has any addresses
      const existingAddresses = await this.getUserAddresses(userId);
      if (existingAddresses.length === 0) {
        isDefault = true;
      }
      
      // If this is set as default, unset other default addresses
      if (isDefault) {
        await this.clearDefaultAddress(userId);
      }
      
      // Create the address object with a unique ID
      const addressId = `addr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const newAddress: Address = {
        id: addressId,
        userId,
        ...address,
        isDefault,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Check if user addresses document exists
      const userAddressesRef = doc(db, 'userAddresses', userId);
      const userAddressesDoc = await getDoc(userAddressesRef);
      
      if (userAddressesDoc.exists()) {
        // Get existing addresses
        const addresses = userAddressesDoc.data().addresses || [];
        
        // Add new address to array
        addresses.push(newAddress);
        
        // Update the document with the new array
        await setDoc(userAddressesRef, {
          userId,
          addresses
        });
      } else {
        // Create new document
        await setDoc(userAddressesRef, {
          userId,
          addresses: [newAddress]
        });
      }
      
      return addressId;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  },
  
  async updateAddress(userId: string, addressId: string, address: Partial<Address>): Promise<void> {
    try {
      const userAddressesRef = doc(db, 'userAddresses', userId);
      const userAddressesDoc = await getDoc(userAddressesRef);
      
      if (!userAddressesDoc.exists()) {
        throw new Error('User addresses not found');
      }
      
      const addresses = userAddressesDoc.data().addresses || [];
      const addressIndex = addresses.findIndex((addr: Address) => addr.id === addressId);
      
      if (addressIndex === -1) {
        throw new Error('Address not found');
      }
      
      // If updating to make this address default, clear other defaults
      if (address.isDefault && !addresses[addressIndex].isDefault) {
        await this.clearDefaultAddress(userId);
      }
      
      // Create updated address
      const updatedAddress = {
        ...addresses[addressIndex],
        ...address,
        updatedAt: new Date()
      };
      
      // Remove old address and add updated one
      const updatedAddresses = [...addresses];
      updatedAddresses[addressIndex] = updatedAddress;
      
      // Update the document
      await setDoc(userAddressesRef, {
        userId,
        addresses: updatedAddresses
      });
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },
  
  async deleteAddress(userId: string, addressId: string): Promise<void> {
    try {
      const userAddressesRef = doc(db, 'userAddresses', userId);
      const userAddressesDoc = await getDoc(userAddressesRef);
      
      if (!userAddressesDoc.exists()) {
        throw new Error('User addresses not found');
      }
      
      const addresses = userAddressesDoc.data().addresses || [];
      const addressToDelete = addresses.find((addr: Address) => addr.id === addressId);
      
      if (!addressToDelete) {
        throw new Error('Address not found');
      }
      
      // Filter out the address to delete
      const updatedAddresses = addresses.filter((addr: Address) => addr.id !== addressId);
      
      // Update the document
      await setDoc(userAddressesRef, {
        userId,
        addresses: updatedAddresses
      });
      
      // If the deleted address was the default, set another address as default
      if (addressToDelete.isDefault && updatedAddresses.length > 0) {
        const newDefaultAddress = updatedAddresses[0];
        await this.updateAddress(userId, newDefaultAddress.id!, { isDefault: true });
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },
  
  async getUserAddresses(userId: string): Promise<Address[]> {
    try {
      const userAddressesRef = doc(db, 'userAddresses', userId);
      const userAddressesDoc = await getDoc(userAddressesRef);
      
      if (userAddressesDoc.exists()) {
        const addresses = userAddressesDoc.data().addresses || [];
        
        // Sort addresses: default first, then by creation date
        return addresses.sort((a: Address, b: Address) => {
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
      console.error('Error getting user addresses:', error);
      throw error;
    }
  },
  
  async getAddress(userId: string, addressId: string): Promise<Address | null> {
    try {
      const userAddressesRef = doc(db, 'userAddresses', userId);
      const userAddressesDoc = await getDoc(userAddressesRef);
      
      if (userAddressesDoc.exists()) {
        const addresses = userAddressesDoc.data().addresses || [];
        const address = addresses.find((addr: Address) => addr.id === addressId);
        
        return address || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting address:', error);
      throw error;
    }
  },
  
  async getDefaultAddress(userId: string): Promise<Address | null> {
    try {
      const userAddressesRef = doc(db, 'userAddresses', userId);
      const userAddressesDoc = await getDoc(userAddressesRef);
      
      if (userAddressesDoc.exists()) {
        const addresses = userAddressesDoc.data().addresses || [];
        const defaultAddress = addresses.find((addr: Address) => addr.isDefault);
        
        return defaultAddress || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting default address:', error);
      throw error;
    }
  },
  
  async clearDefaultAddress(userId: string): Promise<void> {
    try {
      const userAddressesRef = doc(db, 'userAddresses', userId);
      const userAddressesDoc = await getDoc(userAddressesRef);
      
      if (userAddressesDoc.exists()) {
        const addresses = userAddressesDoc.data().addresses || [];
        
        // Set all addresses to non-default
        const updatedAddresses = addresses.map((addr: Address) => ({
          ...addr,
          isDefault: false,
          updatedAt: new Date()
        }));
        
        // Update the document
        await setDoc(userAddressesRef, {
          userId,
          addresses: updatedAddresses
        });
      }
    } catch (error) {
      console.error('Error clearing default address:', error);
      throw error;
    }
  }
}; 