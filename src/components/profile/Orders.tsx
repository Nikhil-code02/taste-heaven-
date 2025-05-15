import React, { useState, useEffect, useCallback } from 'react';
import { Clock, ChevronDown, ChevronUp, ExternalLink, ShoppingBag } from 'lucide-react';
import { Order, orderService } from '../../services/orderService';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ProfileComponents.module.css';
import toast from 'react-hot-toast';

const Orders: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  const loadOrders = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const userOrders = await orderService.getUserOrders(currentUser.uid);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);
  
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);
  
  const toggleOrderDetails = (orderId: string) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };
  
  const handleReorder = async (orderId: string) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const newOrderId = await orderService.reorder(currentUser.uid, orderId);
      toast.success('Order placed successfully!');
      
      // Navigate to order confirmation page
      navigate(`/order-confirmation/${newOrderId}`);
    } catch (error) {
      console.error('Error reordering:', error);
      toast.error('Failed to place order');
      setLoading(false);
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return styles.statusCompleted;
      case 'delivered':
        return styles.statusDelivered;
      case 'preparing':
        return styles.statusPreparing;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return styles.statusPending;
    }
  };
  
  const formatDate = (date: Date | any) => {
    if (!date) return '';
    
    // If date is a Firestore timestamp, convert to JS Date
    const jsDate = date.toDate ? date.toDate() : new Date(date);
    
    return jsDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const formatTime = (date: Date | any) => {
    if (!date) return '';
    
    // If date is a Firestore timestamp, convert to JS Date
    const jsDate = date.toDate ? date.toDate() : new Date(date);
    
    return jsDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }
  
  return (
    <div className={styles.ordersContainer}>
      <h2 className={styles.sectionTitle}>Your Orders</h2>
      
      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <ShoppingBag size={48} className={styles.emptyIcon} />
          <p>You haven't placed any orders yet.</p>
          <Link to="/menu" className={styles.actionButton}>
            Browse Menu
          </Link>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader} onClick={() => toggleOrderDetails(order.id!)}>
                <div className={styles.orderInfo}>
                  <div className={styles.orderRestaurant}>
                    <h3>{order.restaurant}</h3>
                    <span className={`${styles.orderStatus} ${getStatusClass(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className={styles.orderMeta}>
                    <span className={styles.orderDate}>
                      <Clock size={14} />
                      {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                    </span>
                    <span className={styles.orderNumber}>Order #{order.id?.slice(-6)}</span>
                  </div>
                </div>
                <div className={styles.orderSummary}>
                  <span className={styles.orderTotal}>${order.total.toFixed(2)}</span>
                  <button className={styles.expandButton}>
                    {expandedOrderId === order.id ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </button>
                </div>
              </div>
              
              {expandedOrderId === order.id && (
                <div className={styles.orderDetails}>
                  <div className={styles.orderItems}>
                    <h4>Items</h4>
                    <ul className={styles.itemsList}>
                      {order.items.map((item, index) => (
                        <li key={index} className={styles.orderItem}>
                          <div className={styles.itemInfo}>
                            <span className={styles.itemQuantity}>{item.quantity}x</span>
                            <span className={styles.itemName}>{item.item.name}</span>
                          </div>
                          <span className={styles.itemPrice}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className={styles.orderTotals}>
                    <div className={styles.totalLine}>
                      <span>Subtotal</span>
                      <span>${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className={styles.totalLine}>
                      <span>Tax</span>
                      <span>${order.tax.toFixed(2)}</span>
                    </div>
                    {order.deliveryFee && (
                      <div className={styles.totalLine}>
                        <span>Delivery Fee</span>
                        <span>${order.deliveryFee.toFixed(2)}</span>
                      </div>
                    )}
                    {order.tip && (
                      <div className={styles.totalLine}>
                        <span>Tip</span>
                        <span>${order.tip.toFixed(2)}</span>
                      </div>
                    )}
                    <div className={`${styles.totalLine} ${styles.grandTotal}`}>
                      <span>Total</span>
                      <span>${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {order.address && (
                    <div className={styles.orderAddress}>
                      <h4>Delivery Address</h4>
                      <p>{order.address}</p>
                    </div>
                  )}
                  
                  <div className={styles.orderActions}>
                    <Link 
                      to={`/order/${order.id}`} 
                      className={`${styles.orderButton} ${styles.viewButton}`}
                    >
                      <ExternalLink size={16} />
                      View Details
                    </Link>
                    
                    {['completed', 'delivered'].includes(order.status) && (
                      <button 
                        onClick={() => handleReorder(order.id!)}
                        className={`${styles.orderButton} ${styles.reorderButton}`}
                      >
                        <ShoppingBag size={16} />
                        Reorder
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders; 