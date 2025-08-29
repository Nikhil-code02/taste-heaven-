const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

// Firebase configuration
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
const db = getFirestore(app);

// Test Firebase connection
async function testFirebaseConnection() {
  console.log('Testing Firebase connection...');
  
  try {
    // Test Firestore
    console.log('Testing Firebase Firestore connection...');
    const snapshot = await getDocs(collection(db, 'users'));
    console.log(`Firestore connection successful! Found ${snapshot.size} documents in 'users' collection.`);
    
    // Test another collection to further validate
    const reservationsSnapshot = await getDocs(collection(db, 'reservations'));
    console.log(`Found ${reservationsSnapshot.size} documents in 'reservations' collection.`);
    
    console.log('Firebase connection test complete - SUCCESS');
  } catch (error) {
    console.error('Firebase connection test failed:', error);
  }
}

// Run the test
testFirebaseConnection(); 