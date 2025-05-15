import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import styles from './CartIcon.module.css';

interface CartIconProps {
  onClick?: () => void;
}

const CartIcon: React.FC<CartIconProps> = ({ onClick }) => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <div className={styles.cartIconContainer} onClick={onClick}>
      <ShoppingCart className={styles.cartIcon} size={24} />
      {itemCount > 0 && (
        <div className={styles.badge}>{itemCount}</div>
      )}
    </div>
  );
};

export default CartIcon; 