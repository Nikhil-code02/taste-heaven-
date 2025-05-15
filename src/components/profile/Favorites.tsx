import React, { useState, useEffect, useCallback } from 'react';
import { Star, Heart, Trash2, ExternalLink } from 'lucide-react';
import { FavoriteRestaurant, FavoriteMenuItem, favoriteService } from '../../services/favoriteService';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import styles from './ProfileComponents.module.css';
import toast from 'react-hot-toast';

const Favorites: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [favoriteRestaurants, setFavoriteRestaurants] = useState<FavoriteRestaurant[]>([]);
  const [favoriteMenuItems, setFavoriteMenuItems] = useState<FavoriteMenuItem[]>([]);
  const [activeTab, setActiveTab] = useState('restaurants');
  
  const loadFavorites = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const restaurants = await favoriteService.getFavoriteRestaurants(currentUser.uid);
      const menuItems = await favoriteService.getFavoriteMenuItems(currentUser.uid);
      
      setFavoriteRestaurants(restaurants);
      setFavoriteMenuItems(menuItems);
    } catch (error) {
      console.error('Error loading favorites:', error);
      toast.error('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);
  
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);
  
  const handleRemoveRestaurant = async (restaurantId: string) => {
    if (!currentUser) return;
    
    try {
      await favoriteService.removeFavoriteRestaurant(currentUser.uid, restaurantId);
      setFavoriteRestaurants(prevRestaurants => 
        prevRestaurants.filter(restaurant => restaurant.id !== restaurantId)
      );
      toast.success('Restaurant removed from favorites');
    } catch (error) {
      console.error('Error removing restaurant from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };
  
  const handleRemoveMenuItem = async (favoriteId: string) => {
    if (!currentUser) return;
    
    try {
      await favoriteService.removeFavoriteMenuItem(currentUser.uid, favoriteId);
      setFavoriteMenuItems(prevItems => 
        prevItems.filter(item => item.favoriteId !== favoriteId)
      );
      toast.success('Item removed from favorites');
    } catch (error) {
      console.error('Error removing menu item from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }
  
  return (
    <div className={styles.favoritesContainer}>
      <div className={styles.favoritesTabs}>
        <button 
          className={`${styles.favoritesTab} ${activeTab === 'restaurants' ? styles.active : ''}`}
          onClick={() => setActiveTab('restaurants')}
        >
          Restaurants <span className={styles.count}>{favoriteRestaurants.length}</span>
        </button>
        <button 
          className={`${styles.favoritesTab} ${activeTab === 'menuItems' ? styles.active : ''}`}
          onClick={() => setActiveTab('menuItems')}
        >
          Menu Items <span className={styles.count}>{favoriteMenuItems.length}</span>
        </button>
      </div>
      
      {activeTab === 'restaurants' && (
        <>
          {favoriteRestaurants.length === 0 ? (
            <div className={styles.emptyState}>
              <p>You haven't added any favorite restaurants yet.</p>
              <Link to="/restaurants" className={styles.actionButton}>
                Browse Restaurants
              </Link>
            </div>
          ) : (
            <div className={styles.favoritesList}>
              {favoriteRestaurants.map(restaurant => (
                <div key={restaurant.id} className={styles.favoriteItem}>
                  <div className={styles.favoriteImageContainer}>
                    {restaurant.image ? (
                      <img src={restaurant.image} alt={restaurant.name} className={styles.favoriteImage} />
                    ) : (
                      <div className={styles.placeholderImage}>
                        <Heart size={20} />
                      </div>
                    )}
                  </div>
                  <div className={styles.favoriteContent}>
                    <h3>{restaurant.name}</h3>
                    <p className={styles.cuisineType}>{restaurant.cuisine}</p>
                    <div className={styles.ratingContainer}>
                      <Star size={16} className={styles.starIcon} />
                      <span>{restaurant.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className={styles.favoriteActions}>
                    <Link to={`/restaurants/${restaurant.id}`} className={styles.viewButton}>
                      <ExternalLink size={16} />
                    </Link>
                    <button 
                      onClick={() => handleRemoveRestaurant(restaurant.id)}
                      className={styles.removeButton}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      
      {activeTab === 'menuItems' && (
        <>
          {favoriteMenuItems.length === 0 ? (
            <div className={styles.emptyState}>
              <p>You haven't added any favorite menu items yet.</p>
              <Link to="/menu" className={styles.actionButton}>
                Browse Menu
              </Link>
            </div>
          ) : (
            <div className={styles.favoritesList}>
              {favoriteMenuItems.map(menuItem => (
                <div key={menuItem.favoriteId} className={styles.favoriteItem}>
                  <div className={styles.favoriteImageContainer}>
                    {menuItem.image ? (
                      <img src={menuItem.image} alt={menuItem.name} className={styles.favoriteImage} />
                    ) : (
                      <div className={styles.placeholderImage}>
                        <Heart size={20} />
                      </div>
                    )}
                  </div>
                  <div className={styles.favoriteContent}>
                    <h3>{menuItem.name}</h3>
                    <p className={styles.descriptionText}>{menuItem.description.substring(0, 60)}...</p>
                    <p className={styles.priceText}>${menuItem.price.toFixed(2)}</p>
                  </div>
                  <div className={styles.favoriteActions}>
                    <Link to={`/menu?item=${menuItem.id}`} className={styles.viewButton}>
                      <ExternalLink size={16} />
                    </Link>
                    <button 
                      onClick={() => handleRemoveMenuItem(menuItem.favoriteId)}
                      className={styles.removeButton}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Favorites; 