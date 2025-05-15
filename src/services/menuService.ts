import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDoc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  course: string;
  image: string;
  availability: boolean;
  preparationTime: number;
  ingredients: string[];
  allergens: string[];
  specialLabels: string[];
  popularity: number;
  isSpicy?: boolean;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
}

export type Course = 
  | 'Appetizer' 
  | 'Soup' 
  | 'Salad' 
  | 'Main Course' 
  | 'Pizza' 
  | 'Pasta' 
  | 'Seafood'
  | 'Rice & Noodles'
  | 'Sandwich'
  | 'Platter' 
  | 'Side' 
  | 'Dessert' 
  | 'Beverage';

export type Cuisine = 
  | 'Indian' 
  | 'Italian' 
  | 'Chinese' 
  | 'Mexican' 
  | 'Mediterranean' 
  | 'American' 
  | 'Thai' 
  | 'Japanese'
  | 'Lebanese'
  | 'French'
  | 'Fusion';

// Singleton instance to avoid duplicate menu loads
let cachedMenuItems: MenuItem[] | null = null;

export const menuService = {
  // Get all menu items
  async getAllMenuItems(): Promise<MenuItem[]> {
    if (cachedMenuItems) {
      return cachedMenuItems;
    }
    
    try {
      const menuCollection = collection(db, 'menu');
      const menuSnapshot = await getDocs(menuCollection);
      const menuList = menuSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as MenuItem[];
      
      // Cache the result
      cachedMenuItems = menuList;
      
      return menuList;
    } catch (error) {
      console.error('Error getting menu items:', error);
      return [];
    }
  },
  
  // Get menu item by ID
  async getMenuItem(id: string): Promise<MenuItem | null> {
    try {
      const docRef = doc(db, 'menu', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as MenuItem;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting menu item:', error);
      return null;
    }
  },
  
  // Get menu items by course
  async getMenuItemsByCourse(course: Course): Promise<MenuItem[]> {
    const allItems = await this.getAllMenuItems();
    return allItems.filter(item => item.course === course);
  },
  
  // Get menu items by category (cuisine type)
  async getMenuItemsByCategory(category: Cuisine): Promise<MenuItem[]> {
    const allItems = await this.getAllMenuItems();
    return allItems.filter(item => item.category === category);
  },
  
  // Get special items (platters, chef's specials, etc.)
  async getSpecialItems(): Promise<MenuItem[]> {
    const allItems = await this.getAllMenuItems();
    return allItems.filter(item => 
      item.course === 'Platter' || 
      item.specialLabels.includes('Chef\'s Special')
    );
  },
  
  // Get vegetarian items
  async getVegetarianItems(): Promise<MenuItem[]> {
    const allItems = await this.getAllMenuItems();
    return allItems.filter(item => item.isVegetarian);
  },
  
  // Get vegan items
  async getVeganItems(): Promise<MenuItem[]> {
    const allItems = await this.getAllMenuItems();
    return allItems.filter(item => item.isVegan);
  },
  
  // Get gluten-free items
  async getGlutenFreeItems(): Promise<MenuItem[]> {
    const allItems = await this.getAllMenuItems();
    return allItems.filter(item => item.isGlutenFree);
  },
  
  // Get spicy items
  async getSpicyItems(): Promise<MenuItem[]> {
    const allItems = await this.getAllMenuItems();
    return allItems.filter(item => item.isSpicy);
  },
  
  // Get popular items
  async getPopularItems(limit: number = 10): Promise<MenuItem[]> {
    const allItems = await this.getAllMenuItems();
    return [...allItems]
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
  },
  
  // Get all available courses
  async getAvailableCourses(): Promise<Course[]> {
    const allItems = await this.getAllMenuItems();
    const coursesSet = new Set<Course>();
    
    allItems.forEach(item => {
      coursesSet.add(item.course as Course);
    });
    
    return Array.from(coursesSet);
  },
  
  // Get all available cuisines
  async getAvailableCuisines(): Promise<Cuisine[]> {
    const allItems = await this.getAllMenuItems();
    const cuisinesSet = new Set<Cuisine>();
    
    allItems.forEach(item => {
      cuisinesSet.add(item.category as Cuisine);
    });
    
    return Array.from(cuisinesSet);
  },
  
  // Search menu items by query
  async searchMenuItems(query: string): Promise<MenuItem[]> {
    const allItems = await this.getAllMenuItems();
    const lowercaseQuery = query.toLowerCase();
    
    return allItems.filter(item => 
      item.name.toLowerCase().includes(lowercaseQuery) ||
      item.description.toLowerCase().includes(lowercaseQuery) ||
      item.ingredients.some(ingredient => 
        ingredient.toLowerCase().includes(lowercaseQuery)
      )
    );
  },

  async addItem(item: Omit<MenuItem, 'id'>, imageFile?: File): Promise<string> {
    let imageUrl = item.image;
    
    if (imageFile) {
      const storageRef = ref(storage, `menu/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    const menuRef = collection(db, 'menu');
    const docRef = await addDoc(menuRef, {
      ...item,
      image: imageUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return docRef.id;
  },

  async updateItem(id: string, item: Partial<MenuItem>, imageFile?: File): Promise<void> {
    const docRef = doc(db, 'menu', id);
    let updateData = { ...item, updatedAt: new Date().toISOString() };

    if (imageFile) {
      const storageRef = ref(storage, `menu/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      updateData.image = await getDownloadURL(storageRef);
    }

    await updateDoc(docRef, updateData);
  },

  async deleteItem(id: string): Promise<void> {
    const docRef = doc(db, 'menu', id);
    await deleteDoc(docRef);
  }
};

export default menuService; 