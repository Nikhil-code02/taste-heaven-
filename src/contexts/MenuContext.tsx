import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  availability: boolean;
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  specialLabels: string[];
}

interface MenuContextType {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  categories: string[];
  getItemsByCategory: (category: string) => MenuItem[];
  getItemById: (id: string) => MenuItem | undefined;
}

const MenuContext = createContext<MenuContextType | null>(null);

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const menuRef = collection(db, 'menu');
        const snapshot = await getDocs(menuRef);
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as MenuItem[];
        setMenuItems(items);
      } catch (err) {
        setError('Failed to fetch menu items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  const getItemsByCategory = (category: string) => {
    return menuItems.filter(item => item.category === category);
  };

  const getItemById = (id: string) => {
    return menuItems.find(item => item.id === id);
  };

  const value = {
    menuItems,
    loading,
    error,
    categories,
    getItemsByCategory,
    getItemById
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
}; 