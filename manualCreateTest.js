const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  addDoc, 
  doc, 
  setDoc,
  getDoc 
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
const db = getFirestore(app);

// Test data
const TEST_USER_ID = '26uCdcrhqkgD1Yf8rPnwHCMKGPt2'; // Replace with a valid user ID from your Firebase Auth

async function createTestData() {
  try {
    console.log('Creating test data...');
    
    // Check if user exists
    const userRef = doc(db, 'users', TEST_USER_ID);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      console.log('Creating test user...');
      await setDoc(userRef, {
        uid: TEST_USER_ID,
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'customer',
        createdAt: new Date().toISOString()
      });
      console.log('Test user created');
    } else {
      console.log('Test user exists:', userDoc.data().displayName);
    }
    
    // Create test favorites document
    console.log('\nCreating test favorites...');
    const favRef = doc(db, 'favorites', TEST_USER_ID);
    const favDoc = await getDoc(favRef);
    
    if (!favDoc.exists()) {
      await setDoc(favRef, {
        userId: TEST_USER_ID,
        restaurants: [
          {
            id: 'rest1',
            name: 'Test Restaurant',
            cuisine: 'Test Cuisine',
            rating: 4.5
          }
        ],
        menuItems: [
          {
            id: 'item1',
            favoriteId: 'item1_fav',
            name: 'Test Item',
            price: 9.99,
            category: 'Test Category'
          }
        ]
      });
      console.log('Test favorites created');
    } else {
      console.log('Favorites already exist for user');
    }
    
    // Create test address
    console.log('\nCreating test address...');
    const addressesRef = collection(db, 'addresses');
    const testAddress = {
      userId: TEST_USER_ID,
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
    console.log('Test address created with ID:', addressDoc.id);
    
    // Create test order
    console.log('\nCreating test order...');
    const ordersRef = collection(db, 'orders');
    const testOrder = {
      userId: TEST_USER_ID,
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
      status: 'completed',
      subtotal: 9.99,
      tax: 0.80,
      total: 10.79,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const orderDoc = await addDoc(ordersRef, testOrder);
    console.log('Test order created with ID:', orderDoc.id);
    
    // Create test payment method
    console.log('\nCreating test payment method...');
    const paymentMethodsRef = collection(db, 'paymentMethods');
    const testPayment = {
      userId: TEST_USER_ID,
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
    console.log('Test payment method created with ID:', paymentDoc.id);
    
    console.log('\nAll test data created successfully!');
  } catch (error) {
    console.error('Error creating test data:', error);
  }
}

// Run the function
createTestData()
  .then(() => console.log('Test completed'))
  .catch(error => console.error('Test error:', error)); 