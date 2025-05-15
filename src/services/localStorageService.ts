import { Address } from './addressService';
import { MenuItem } from './menuService';

// Keys for localStorage
const SAVED_ADDRESSES_KEY = 'saved_addresses';
const FAVORITE_MENU_ITEMS_KEY = 'favorite_menu_items';

interface LocalAddress extends Address {
  isFavorite: boolean;
}

interface LocalFavoriteMenuItem {
  itemId: string;
  name: string;
  price: number;
  image?: string;
  category?: string;
  course?: string;
  addedAt: Date;
}

export const localStorageService = {
  // Addresses
  getSavedAddresses: (): LocalAddress[] => {
    try {
      const addresses = localStorage.getItem(SAVED_ADDRESSES_KEY);
      return addresses ? JSON.parse(addresses) : [];
    } catch (error) {
      console.error('Error retrieving saved addresses:', error);
      return [];
    }
  },

  saveAddress: (address: Address, isFavorite: boolean = false): void => {
    try {
      const addresses = localStorageService.getSavedAddresses();
      const localAddress: LocalAddress = { ...address, isFavorite };

      // Check if address already exists by id
      const existingIndex = addresses.findIndex(a => a.id === address.id);
      
      if (existingIndex >= 0) {
        // Update existing address
        addresses[existingIndex] = localAddress;
      } else {
        // Add new address
        addresses.push(localAddress);
      }

      localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(addresses));
    } catch (error) {
      console.error('Error saving address:', error);
    }
  },

  removeAddress: (addressId: string): void => {
    try {
      const addresses = localStorageService.getSavedAddresses();
      const updatedAddresses = addresses.filter(a => a.id !== addressId);
      localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updatedAddresses));
    } catch (error) {
      console.error('Error removing address:', error);
    }
  },

  markAddressAsFavorite: (addressId: string, isFavorite: boolean): void => {
    try {
      const addresses = localStorageService.getSavedAddresses();
      const updatedAddresses = addresses.map(a => 
        a.id === addressId ? { ...a, isFavorite } : a
      );
      localStorage.setItem(SAVED_ADDRESSES_KEY, JSON.stringify(updatedAddresses));
    } catch (error) {
      console.error('Error marking address as favorite:', error);
    }
  },

  // Favorite Menu Items
  getFavoriteMenuItems: (): LocalFavoriteMenuItem[] => {
    try {
      const favoriteItems = localStorage.getItem(FAVORITE_MENU_ITEMS_KEY);
      return favoriteItems ? JSON.parse(favoriteItems) : [];
    } catch (error) {
      console.error('Error retrieving favorite menu items:', error);
      return [];
    }
  },

  addFavoriteMenuItem: (item: MenuItem): void => {
    try {
      const favoriteItems = localStorageService.getFavoriteMenuItems();
      
      // Check if already favorited
      if (!favoriteItems.some(i => i.itemId === item.id)) {
        const localFavorite: LocalFavoriteMenuItem = {
          itemId: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          category: item.category,
          course: item.course,
          addedAt: new Date()
        };
        
        favoriteItems.push(localFavorite);
        localStorage.setItem(FAVORITE_MENU_ITEMS_KEY, JSON.stringify(favoriteItems));
      }
    } catch (error) {
      console.error('Error adding favorite menu item:', error);
    }
  },

  removeFavoriteMenuItem: (itemId: string): void => {
    try {
      const favoriteItems = localStorageService.getFavoriteMenuItems();
      const updatedItems = favoriteItems.filter(i => i.itemId !== itemId);
      localStorage.setItem(FAVORITE_MENU_ITEMS_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Error removing favorite menu item:', error);
    }
  },

  isMenuItemFavorite: (itemId: string): boolean => {
    try {
      const favoriteItems = localStorageService.getFavoriteMenuItems();
      return favoriteItems.some(i => i.itemId === itemId);
    } catch (error) {
      console.error('Error checking if menu item is favorite:', error);
      return false;
    }
  }
}; 