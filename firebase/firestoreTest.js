const { initializeApp } = require('firebase/app');
const { getAuth, signInAnonymously } = require('firebase/auth');
const { 
  getFirestore, 
  collection, 
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs 
} = require('firebase/firestore');

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
const auth = getAuth(app);
const db = getFirestore(app);

// Test function to login and verify collection writes
async function testFirestoreCollections() {
  try {
    console.log('Testing Firestore collections...');
    
    // First try to sign in anonymously
    console.log('Signing in anonymously...');
    
    try {
      await signInAnonymously(auth);
      console.log('Successfully signed in anonymously!');
    } catch (error) {
      console.error('Anonymous sign in failed:', error.message);
      process.exit(1);
    }
    
    const userId = auth.currentUser ? auth.currentUser.uid : 'test-user-id';
    console.log('Using user ID:', userId);
    
    // Test reading users collection
    console.log('\n--- Testing Users Collection ---');
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      console.log(`Found ${usersSnapshot.size} users in the database`);
    } catch (error) {
      console.error('Error reading users:', error);
    }
    
    // Test Favorites (known working collection)
    console.log('\n--- Testing Favorites Collection (Should Work) ---');
    try {
      const favRef = doc(db, 'favorites', userId);
      const favDoc = await getDoc(favRef);
      
      if (favDoc.exists()) {
        console.log('Favorites document exists:', favDoc.data());
      } else {
        console.log('Creating new favorites document');
        await setDoc(favRef, {
          userId,
          restaurants: [],
          menuItems: []
        });
        console.log('Favorites document created successfully');
      }
    } catch (error) {
      console.error('Error with favorites:', error);
    }
    
    // Test Addresses collection 
    console.log('\n--- Testing Addresses Collection ---');
    try {
      const addressesRef = collection(db, 'addresses');
      const testAddress = {
        userId,
        label: 'Test Address',
        name: 'Test User',
        streetAddress: '123 Test St',
        city: 'Test City',
        state: 'TS',
        postalCode: '12345',
        country: 'Test Country',
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const addressDoc = await addDoc(addressesRef, testAddress);
      console.log('Successfully added address with ID:', addressDoc.id);
    } catch (error) {
      console.error('Error adding address:', error);
    }
    
    // Test Orders collection
    console.log('\n--- Testing Orders Collection ---');
    try {
      const ordersRef = collection(db, 'orders');
      const testOrder = {
        userId,
        items: [{
          item: {
            id: 'test-item',
            name: 'Test Item',
            price: 9.99,
            category: 'test'
          },
          quantity: 1,
          price: 9.99
        }],
        restaurant: 'Test Restaurant',
        status: 'pending',
        subtotal: 9.99,
        tax: 0.80,
        total: 10.79,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const orderDoc = await addDoc(ordersRef, testOrder);
      console.log('Successfully added order with ID:', orderDoc.id);
    } catch (error) {
      console.error('Error adding order:', error);
    }
    
    // Test Payment Methods collection
    console.log('\n--- Testing Payment Methods Collection ---');
    try {
      const paymentMethodsRef = collection(db, 'paymentMethods');
      const testPayment = {
        userId,
        type: 'credit',
        cardType: 'visa',
        nameOnCard: 'Test User',
        last4: '1234',
        expiryMonth: '12',
        expiryYear: '25',
        isDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const paymentDoc = await addDoc(paymentMethodsRef, testPayment);
      console.log('Successfully added payment method with ID:', paymentDoc.id);
    } catch (error) {
      console.error('Error adding payment method:', error);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testFirestoreCollections()
  .then(() => console.log('Test completed'))
  .catch(error => console.error('Test error:', error)); 