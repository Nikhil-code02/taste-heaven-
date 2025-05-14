import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCMFZQgHzhkC8KNGL8Z6j-WgfB1Y1tcDTM",
  authDomain: "restro-16862.firebaseapp.com",
  projectId: "restro-16862",
  storageBucket: "restro-16862.appspot.com",
  messagingSenderId: "521226547019",
  appId: "1:521226547019:web:8b33658d6d9bb3a05182ce",
  measurementId: "G-SB6JJ3SE4T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Configure GoogleAuthProvider to request additional permissions
googleProvider.addScope('profile');
googleProvider.addScope('email');

export default app; 