import { db } from './firebase';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, query, where, orderBy, limit, Timestamp, arrayUnion } from 'firebase/firestore';
import { MenuItem } from './menuService';
import { CartItem } from '../contexts/CartContext';

export interface OrderItem {
  item: MenuItem;
  quantity: number;
  price: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'delivered' 
  | 'completed' 
  | 'cancelled';

export interface Order {
  id?: string;
  userId: string;
  items: OrderItem[];
  restaurant: string;
  restaurantId?: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  tax: number;
  deliveryFee?: number;
  tip?: number;
  address?: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
  estimatedDeliveryTime?: Timestamp | Date;
  actualDeliveryTime?: Timestamp | Date;
}

export const orderService = {
  async createOrder(userId: string, cartItems: CartItem[], orderDetails: Partial<Order>): Promise<string> {
    try {
      // Calculate order totals
      const subtotal = cartItems.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
      const tax = subtotal * 0.08; // Assuming 8% tax
      const total = subtotal + tax + (orderDetails.deliveryFee || 0) + (orderDetails.tip || 0);
      
      // Convert cart items to order items
      const orderItems: OrderItem[] = cartItems.map(cartItem => ({
        item: cartItem.item,
        quantity: cartItem.quantity,
        price: cartItem.item.price
      }));
      
      // Create unique order ID
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Create the order object
      const order: Order = {
        id: orderId,
        userId,
        items: orderItems,
        restaurant: "Taste Haven", // Default restaurant name, can be changed
        restaurantId: "main", // Default restaurant ID
        status: 'pending',
        subtotal,
        tax,
        total,
        ...orderDetails,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Check if user orders document exists
      const userOrdersRef = doc(db, 'userOrders', userId);
      const userOrdersDoc = await getDoc(userOrdersRef);
      
      if (userOrdersDoc.exists()) {
        // Get existing orders
        const orders = userOrdersDoc.data().orders || [];
        
        // Add new order to array
        orders.push(order);
        
        // Update the document with the new array
        await setDoc(userOrdersRef, {
          userId,
          orders
        });
      } else {
        // Create new document
        await setDoc(userOrdersRef, {
          userId,
          orders: [order]
        });
      }
      
      // Update the user's order history
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          orderHistory: [...(userDoc.data().orderHistory || []), orderId]
        });
      }
      
      return orderId;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  async getOrder(userId: string, orderId: string): Promise<Order | null> {
    try {
      const userOrdersRef = doc(db, 'userOrders', userId);
      const userOrdersDoc = await getDoc(userOrdersRef);
      
      if (userOrdersDoc.exists()) {
        const orders = userOrdersDoc.data().orders || [];
        const order = orders.find((order: Order) => order.id === orderId);
        
        return order || null;
      }
      
      return null;
    } catch (error) {
      console.error('Error getting order:', error);
      throw error;
    }
  },
  
  async getUserOrders(userId: string, limitCount = 10): Promise<Order[]> {
    try {
      const userOrdersRef = doc(db, 'userOrders', userId);
      const userOrdersDoc = await getDoc(userOrdersRef);
      
      if (userOrdersDoc.exists()) {
        const orders = userOrdersDoc.data().orders || [];
        
        // Sort by creation date (newest first)
        return orders
          .sort((a: Order, b: Order) => {
            // Handling Timestamp objects properly
            let dateA: Date;
            if (a.createdAt instanceof Date) {
              dateA = a.createdAt;
            } else if (typeof a.createdAt === 'object' && a.createdAt !== null && 'toDate' in a.createdAt) {
              dateA = a.createdAt.toDate();
            } else {
              dateA = new Date(a.createdAt as any);
            }
            
            let dateB: Date;
            if (b.createdAt instanceof Date) {
              dateB = b.createdAt;
            } else if (typeof b.createdAt === 'object' && b.createdAt !== null && 'toDate' in b.createdAt) {
              dateB = b.createdAt.toDate();
            } else {
              dateB = new Date(b.createdAt as any);
            }
            
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, limitCount);
      }
      
      return [];
    } catch (error) {
      console.error('Error getting user orders:', error);
      throw error;
    }
  },
  
  async updateOrderStatus(userId: string, orderId: string, status: OrderStatus): Promise<void> {
    try {
      const userOrdersRef = doc(db, 'userOrders', userId);
      const userOrdersDoc = await getDoc(userOrdersRef);
      
      if (!userOrdersDoc.exists()) {
        throw new Error('User orders not found');
      }
      
      const orders = userOrdersDoc.data().orders || [];
      const orderIndex = orders.findIndex((order: Order) => order.id === orderId);
      
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }
      
      // Create updated order
      const updatedOrder = {
        ...orders[orderIndex],
        status,
        updatedAt: new Date()
      };
      
      // Update the orders array
      const updatedOrders = [...orders];
      updatedOrders[orderIndex] = updatedOrder;
      
      // Update the document
      await setDoc(userOrdersRef, {
        userId,
        orders: updatedOrders
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  },
  
  async cancelOrder(userId: string, orderId: string): Promise<void> {
    try {
      await this.updateOrderStatus(userId, orderId, 'cancelled');
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  },
  
  // Method to reorder a previous order
  async reorder(userId: string, orderId: string): Promise<string> {
    try {
      const originalOrder = await this.getOrder(userId, orderId);
      
      if (!originalOrder) {
        throw new Error('Order not found');
      }
      
      // Create a new order ID
      const newOrderId = `order_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      
      // Create a new order with the same items
      const newOrder: Order = {
        id: newOrderId,
        userId,
        items: originalOrder.items,
        restaurant: originalOrder.restaurant,
        restaurantId: originalOrder.restaurantId,
        status: 'pending',
        subtotal: originalOrder.subtotal,
        tax: originalOrder.tax,
        total: originalOrder.total,
        deliveryFee: originalOrder.deliveryFee,
        address: originalOrder.address,
        paymentMethod: originalOrder.paymentMethod,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Check if user orders document exists
      const userOrdersRef = doc(db, 'userOrders', userId);
      const userOrdersDoc = await getDoc(userOrdersRef);
      
      if (userOrdersDoc.exists()) {
        // Get existing orders
        const orders = userOrdersDoc.data().orders || [];
        
        // Add new order to array
        orders.push(newOrder);
        
        // Update the document with the new array
        await setDoc(userOrdersRef, {
          userId,
          orders
        });
      } else {
        // Create new document
        await setDoc(userOrdersRef, {
          userId,
          orders: [newOrder]
        });
      }
      
      // Update the user's order history
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          orderHistory: [...(userDoc.data().orderHistory || []), newOrderId]
        });
      }
      
      return newOrderId;
    } catch (error) {
      console.error('Error reordering:', error);
      throw error;
    }
  }
}; 