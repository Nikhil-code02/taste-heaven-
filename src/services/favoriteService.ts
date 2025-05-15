import { db } from './firebase';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { doc, getDoc, setDoc, arrayUnion, arrayRemove, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { MenuItem } from './menuService';

export interface FavoriteRestaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  image?: string;
}

export interface FavoriteMenuItem extends MenuItem {
  favoriteId: string; // Unique ID for the favorite entry
}

export const favoriteService = {
  async addFavoriteRestaurant(userId: string, restaurant: FavoriteRestaurant): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Check if favorites collection exists for this user
        const favoritesRef = doc(db, 'favorites', userId);
        const favoritesDoc = await getDoc(favoritesRef);
        
        if (favoritesDoc.exists()) {
          // Update existing favorites document
          await updateDoc(favoritesRef, {
            restaurants: arrayUnion(restaurant)
          });
        } else {
          // Create new favorites document
          await setDoc(favoritesRef, {
            userId,
            restaurants: [restaurant],
            menuItems: []
          });
        }
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error adding favorite restaurant:', error);
      throw error;
    }
  },
  
  async removeFavoriteRestaurant(userId: string, restaurantId: string): Promise<void> {
    try {
      const favoritesRef = doc(db, 'favorites', userId);
      const favoritesDoc = await getDoc(favoritesRef);
      
      if (favoritesDoc.exists()) {
        const data = favoritesDoc.data();
        const restaurants = data.restaurants || [];
        
        // Find the restaurant to remove
        const updatedRestaurants = restaurants.filter(
          (rest: FavoriteRestaurant) => rest.id !== restaurantId
        );
        
        // Update the document
        await updateDoc(favoritesRef, {
          restaurants: updatedRestaurants
        });
      }
    } catch (error) {
      console.error('Error removing favorite restaurant:', error);
      throw error;
    }
  },
  
  async getFavoriteRestaurants(userId: string): Promise<FavoriteRestaurant[]> {
    try {
      const favoritesRef = doc(db, 'favorites', userId);
      const favoritesDoc = await getDoc(favoritesRef);
      
      if (favoritesDoc.exists()) {
        const data = favoritesDoc.data();
        return data.restaurants || [];
      }
      
      return [];
    } catch (error) {
      console.error('Error getting favorite restaurants:', error);
      throw error;
    }
  },
  
  async addFavoriteMenuItem(userId: string, menuItem: MenuItem): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        // Generate a unique ID for this favorite
        const favoriteId = `${menuItem.id}_${Date.now()}`;
        const favoriteMenuItem: FavoriteMenuItem = {
          ...menuItem,
          favoriteId
        };
        
        // Check if favorites collection exists for this user
        const favoritesRef = doc(db, 'favorites', userId);
        const favoritesDoc = await getDoc(favoritesRef);
        
        if (favoritesDoc.exists()) {
          // Update existing favorites document
          await updateDoc(favoritesRef, {
            menuItems: arrayUnion(favoriteMenuItem)
          });
        } else {
          // Create new favorites document
          await setDoc(favoritesRef, {
            userId,
            restaurants: [],
            menuItems: [favoriteMenuItem]
          });
        }
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      console.error('Error adding favorite menu item:', error);
      throw error;
    }
  },
  
  async removeFavoriteMenuItem(userId: string, favoriteId: string): Promise<void> {
    try {
      const favoritesRef = doc(db, 'favorites', userId);
      const favoritesDoc = await getDoc(favoritesRef);
      
      if (favoritesDoc.exists()) {
        const data = favoritesDoc.data();
        const menuItems = data.menuItems || [];
        
        // Find the menu item to remove
        const updatedMenuItems = menuItems.filter(
          (item: FavoriteMenuItem) => item.favoriteId !== favoriteId
        );
        
        // Update the document
        await updateDoc(favoritesRef, {
          menuItems: updatedMenuItems
        });
      }
    } catch (error) {
      console.error('Error removing favorite menu item:', error);
      throw error;
    }
  },
  
  async getFavoriteMenuItems(userId: string): Promise<FavoriteMenuItem[]> {
    try {
      const favoritesRef = doc(db, 'favorites', userId);
      const favoritesDoc = await getDoc(favoritesRef);
      
      if (favoritesDoc.exists()) {
        const data = favoritesDoc.data();
        return data.menuItems || [];
      }
      
      return [];
    } catch (error) {
      console.error('Error getting favorite menu items:', error);
      throw error;
    }
  }
}; 