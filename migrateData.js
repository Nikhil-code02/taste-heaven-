const { initializeApp } = require('firebase/app');
const { 
  getFirestore, 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where
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

// Function to migrate data from old structure to new structure
async function migrateData() {
  try {
    console.log('Starting data migration...');
    
    // Get all users
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const users = [];
    
    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`Found ${users.length} users to migrate data for.`);
    
    // Process each user
    for (const user of users) {
      const userId = user.id;
      console.log(`\nMigrating data for user: ${userId}`);
      
      // Migrate addresses
      await migrateAddresses(userId);
      
      // Migrate orders
      await migrateOrders(userId);
      
      // Migrate payment methods
      await migratePaymentMethods(userId);
    }
    
    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Error migrating data:', error);
  }
}

// Migrate user addresses
async function migrateAddresses(userId) {
  try {
    console.log(`Migrating addresses for user: ${userId}`);
    
    // Check if user already has addresses in the new structure
    const userAddressesRef = doc(db, 'userAddresses', userId);
    const userAddressesDoc = await getDoc(userAddressesRef);
    
    if (userAddressesDoc.exists()) {
      console.log('User already has addresses in the new structure, skipping...');
      return;
    }
    
    // Get addresses from old structure
    const addressesRef = collection(db, 'addresses');
    const q = query(addressesRef, where('userId', '==', userId));
    const addressesSnapshot = await getDocs(q);
    
    if (addressesSnapshot.empty) {
      console.log('No addresses found for this user.');
      return;
    }
    
    // Collect all addresses
    const addresses = [];
    addressesSnapshot.forEach(doc => {
      addresses.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`Found ${addresses.length} addresses to migrate.`);
    
    // Create new document with all addresses
    await setDoc(userAddressesRef, {
      userId,
      addresses
    });
    
    console.log('Addresses migrated successfully!');
  } catch (error) {
    console.error(`Error migrating addresses for user ${userId}:`, error);
  }
}

// Migrate user orders
async function migrateOrders(userId) {
  try {
    console.log(`Migrating orders for user: ${userId}`);
    
    // Check if user already has orders in the new structure
    const userOrdersRef = doc(db, 'userOrders', userId);
    const userOrdersDoc = await getDoc(userOrdersRef);
    
    if (userOrdersDoc.exists()) {
      console.log('User already has orders in the new structure, skipping...');
      return;
    }
    
    // Get orders from old structure
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, where('userId', '==', userId));
    const ordersSnapshot = await getDocs(q);
    
    if (ordersSnapshot.empty) {
      console.log('No orders found for this user.');
      return;
    }
    
    // Collect all orders
    const orders = [];
    ordersSnapshot.forEach(doc => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`Found ${orders.length} orders to migrate.`);
    
    // Create new document with all orders
    await setDoc(userOrdersRef, {
      userId,
      orders
    });
    
    console.log('Orders migrated successfully!');
  } catch (error) {
    console.error(`Error migrating orders for user ${userId}:`, error);
  }
}

// Migrate user payment methods
async function migratePaymentMethods(userId) {
  try {
    console.log(`Migrating payment methods for user: ${userId}`);
    
    // Check if user already has payment methods in the new structure
    const userPaymentsRef = doc(db, 'userPayments', userId);
    const userPaymentsDoc = await getDoc(userPaymentsRef);
    
    if (userPaymentsDoc.exists()) {
      console.log('User already has payment methods in the new structure, skipping...');
      return;
    }
    
    // Get payment methods from old structure
    const paymentMethodsRef = collection(db, 'paymentMethods');
    const q = query(paymentMethodsRef, where('userId', '==', userId));
    const paymentMethodsSnapshot = await getDocs(q);
    
    if (paymentMethodsSnapshot.empty) {
      console.log('No payment methods found for this user.');
      return;
    }
    
    // Collect all payment methods
    const paymentMethods = [];
    paymentMethodsSnapshot.forEach(doc => {
      paymentMethods.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`Found ${paymentMethods.length} payment methods to migrate.`);
    
    // Create new document with all payment methods
    await setDoc(userPaymentsRef, {
      userId,
      paymentMethods
    });
    
    console.log('Payment methods migrated successfully!');
  } catch (error) {
    console.error(`Error migrating payment methods for user ${userId}:`, error);
  }
}

// Run the migration
migrateData()
  .then(() => console.log('Migration script completed.'))
  .catch(error => console.error('Migration script error:', error)); 