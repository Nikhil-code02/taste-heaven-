// MongoDB Configuration
// This file contains MongoDB connection configuration
// Note: MongoDB is not currently used in this application

export const mongoConfig = {
  // MongoDB connection URI (placeholder - replace with actual connection string)
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/restro',
  
  // Database name
  dbName: 'restro',
  
  // Connection options
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Add other MongoDB connection options as needed
  }
};

// MongoDB collections configuration
export const mongoCollections = {
  users: 'users',
  menuItems: 'menu_items',
  orders: 'orders',
  reservations: 'reservations',
  addresses: 'addresses',
  payments: 'payments',
  favorites: 'favorites'
};

// Export types for MongoDB documents (optional)
export interface MongoUser {
  _id?: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MongoMenuItem {
  _id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
