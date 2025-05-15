import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { auth, db } from './services/firebase';

// Test Firebase connection
async function testFirebaseConnection() {
  console.log('Testing Firebase connection...');
  
  try {
    // Test Auth
    console.log('Testing Firebase Authentication...');
    const authResult = await signInAnonymously(auth);
    console.log('Auth connection successful!', authResult.user.uid);
    
    // Test Firestore
    console.log('Testing Firebase Firestore...');
    const snapshot = await getDocs(collection(db, 'users'));
    console.log(`Firestore connection successful! Found ${snapshot.size} users.`);
    
    console.log('Firebase connection test complete - SUCCESS');
  } catch (error) {
    console.error('Firebase connection test failed:', error);
  }
}

// Run the test
testFirebaseConnection(); 