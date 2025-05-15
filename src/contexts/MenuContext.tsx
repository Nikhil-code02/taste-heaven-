import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, Course, Cuisine } from '../services/menuService';
import { menuItems as menuData } from '../data/menuData';

interface MenuContextType {
  menuItems: MenuItem[];
  loading: boolean;
  error: string | null;
  courses: Course[];
  cuisines: Cuisine[];
  getItemsByCourse: (course: Course) => MenuItem[];
  getItemsByCategory: (category: Cuisine) => MenuItem[];
  getSpecialItems: () => MenuItem[];
  getVegetarianItems: () => MenuItem[];
  getVeganItems: () => MenuItem[];
  getGlutenFreeItems: () => MenuItem[];
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
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        
        // In a production app, you would fetch from Firebase 
        // For now, we'll use our local data
        const fetchedItems = menuData;
        
        // Extract available courses and cuisines
        const courseSet = new Set<string>();
        const cuisineSet = new Set<string>();
        
        fetchedItems.forEach(item => {
          if (item.course) courseSet.add(item.course);
          if (item.category) cuisineSet.add(item.category);
        });
        
        setItems(fetchedItems);
        setCourses(Array.from(courseSet) as Course[]);
        setCuisines(Array.from(cuisineSet) as Cuisine[]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu. Please try again later.');
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  const getItemsByCourse = (course: Course) => {
    return items.filter(item => item.course === course);
  };

  const getItemsByCategory = (category: Cuisine) => {
    return items.filter(item => item.category === category);
  };

  const getSpecialItems = () => {
    return items.filter(item => 
      item.course === 'Platter' || 
      (item.specialLabels && item.specialLabels.includes('Chef\'s Special'))
    );
  };

  const getVegetarianItems = () => {
    return items.filter(item => item.isVegetarian);
  };

  const getVeganItems = () => {
    return items.filter(item => item.isVegan);
  };

  const getGlutenFreeItems = () => {
    return items.filter(item => item.isGlutenFree);
  };

  const getItemById = (id: string) => {
    return items.find(item => item.id === id);
  };

  const value = {
    menuItems: items,
    loading,
    error,
    courses,
    cuisines,
    getItemsByCourse,
    getItemsByCategory,
    getSpecialItems,
    getVegetarianItems,
    getVeganItems,
    getGlutenFreeItems,
    getItemById
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
}; 