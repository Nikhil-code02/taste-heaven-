import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import CartIcon from '../components/cart/CartIcon';
import Cart from '../components/cart/Cart';
import styles from './Header.module.css';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { currentUser, logout, loading } = useAuth();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  
  // Debug auth state
  useEffect(() => {
    console.log('Auth state in Header:', { currentUser, loading });
  }, [currentUser, loading]);
  
  // Handle scroll effect
  useEffect(() => {
    // Add scroll event listener
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Clean up listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Add body scroll lock when cart is open
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [cartOpen]);

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      console.log('Attempting to log out...');
      await logout();
      setMobileMenuOpen(false);
      console.log('Logout successful');
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
      toast.error('Failed to log out');
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${mobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.container}>
          <div className={styles.navContainer}>
            <Link to="/" className={styles.logo}>Taste Haven</Link>
            
            {/* Mobile menu button */}
            <div className={styles.mobileMenuBtn} onClick={toggleMobileMenu}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className={styles.navLinks}>
              <Link to="/">Home</Link>
              {!loading && (
                <>
                  {currentUser ? (
                    <>
                      <Link to="/reservation">Reservations</Link>
                      <Link to="/menu">Menu</Link>
                      <Link to="/profile">Profile</Link>
                      <button 
                        onClick={handleLogout}
                        className={styles.navButton}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/menu">Menu</Link>
                      <Link to="/login">Login</Link>
                    </>
                  )}
                </>
              )}
              <Link to="/contact">Contact</Link>
              
              {/* Cart Icon */}
              <div className={styles.cartIconWrapper}>
                <CartIcon onClick={toggleCart} />
              </div>
            </nav>
            
            {/* Mobile Navigation */}
            <nav className={`${styles.mobileNav} ${mobileMenuOpen ? styles.open : ''}`}>
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              {!loading && (
                <>
                  {currentUser ? (
                    <>
                      <Link to="/reservation" onClick={() => setMobileMenuOpen(false)}>Reservations</Link>
                      <Link to="/menu" onClick={() => setMobileMenuOpen(false)}>Menu</Link>
                      <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                      <button 
                        onClick={handleLogout}
                        className={styles.navButton}
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/menu" onClick={() => setMobileMenuOpen(false)}>Menu</Link>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                    </>
                  )}
                </>
              )}
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
              
              {/* Mobile Cart Icon */}
              <div className={styles.mobileCartIcon} onClick={() => { 
                setMobileMenuOpen(false);
                setCartOpen(true);
              }}>
                <CartIcon />
              </div>
            </nav>
          </div>
        </div>
      </header>
      
      {/* Cart component */}
      <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header; 