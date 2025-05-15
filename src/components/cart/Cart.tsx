import React from 'react';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import styles from './Cart.module.css';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  
  if (!isOpen) return null;
  
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, newQuantity);
  };
  
  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };
  
  const handleClearCart = () => {
    clearCart();
  };
  
  const handleCheckout = () => {
    // Implement checkout functionality
    alert('Checkout functionality will be implemented soon!');
  };
  
  return (
    <div className={styles.cartOverlay}>
      <div className={styles.cartContainer}>
        <div className={styles.cartHeader}>
          <h2>Your Cart</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        
        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <ShoppingBag size={64} />
            <p>Your cart is empty</p>
            <button className={styles.continueShoppingButton} onClick={onClose}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className={styles.cartItems}>
              {cartItems.map(({ item, quantity }) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img 
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop'} 
                      alt={item.name} 
                    />
                  </div>
                  
                  <div className={styles.itemDetails}>
                    <h3>{item.name}</h3>
                    <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                  </div>
                  
                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <button 
                        onClick={() => handleQuantityChange(item.id, quantity - 1)}
                        disabled={quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span>{quantity}</span>
                      <button onClick={() => handleQuantityChange(item.id, quantity + 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    <button 
                      className={styles.removeButton}
                      onClick={() => handleRemoveItem(item.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  
                  <div className={styles.itemTotal}>
                    ${(item.price * quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.cartFooter}>
              <div className={styles.cartTotal}>
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              
              <div className={styles.cartButtons}>
                <button 
                  className={styles.clearButton}
                  onClick={handleClearCart}
                >
                  Clear Cart
                </button>
                
                <button 
                  className={styles.checkoutButton}
                  onClick={handleCheckout}
                >
                  Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart; 