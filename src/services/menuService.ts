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
  id?: string;
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
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const menuService = {
  async getAllItems(): Promise<MenuItem[]> {
    const menuRef = collection(db, 'menu');
    const q = query(menuRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MenuItem[];
  },

  async getItemsByCategory(category: string): Promise<MenuItem[]> {
    const menuRef = collection(db, 'menu');
    const q = query(
      menuRef,
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as MenuItem[];
  },

  async getItemById(id: string): Promise<MenuItem | null> {
    const docRef = doc(db, 'menu', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as MenuItem;
    }
    return null;
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