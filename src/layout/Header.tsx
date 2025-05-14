import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import styles from './Header.module.css';
import toast from 'react-hot-toast';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout, loading } = useAuth();
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

  return (
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
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 