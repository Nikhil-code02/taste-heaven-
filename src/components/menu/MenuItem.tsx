import React, { useState, useEffect } from 'react';
import { MenuItem as MenuItemType } from '../../services/menuService';
import { Utensils, Flame, Leaf, Wheat, ShoppingCart, Heart } from 'lucide-react';
import styles from './MenuItem.module.css';
import { useCart } from '../../contexts/CartContext';
import { localStorageService } from '../../services/localStorageService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { favoriteService } from '../../services/favoriteService';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  // Default placeholder image from Unsplash if no image is provided or if the image fails to load
  const defaultImage = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=500&auto=format&fit=crop';
  const [imageError, setImageError] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  
  // Check if item is favorite on load
  useEffect(() => {
    const checkIfFavorite = async () => {
      if (currentUser) {
        try {
          // First check cloud
          const favoriteItems = await favoriteService.getFavoriteMenuItems(currentUser.uid);
          const isCloudFavorite = favoriteItems.some(favItem => favItem.id === item.id);
          
          if (isCloudFavorite) {
            setIsFavorite(true);
            return;
          }
        } catch (error) {
          console.error('Error checking cloud favorites:', error);
        }
      }
      
      // Fall back to local storage
      const isLocalFavorite = localStorageService.isMenuItemFavorite(item.id);
      setIsFavorite(isLocalFavorite);
    };
    
    checkIfFavorite();
  }, [currentUser, item.id]);
  
  const handleImageError = () => {
    console.log(`Failed to load image for ${item.name}`);
    setImageError(true);
  };

  const handleAddToCart = () => {
    if (!item.availability) return;
    
    addToCart(item);
    setAddedToCart(true);
    
    // Reset the "Added" feedback after 1.5 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 1500);
  };

  const handleToggleFavorite = async () => {
    // Toggle the favorite state immediately for responsive UI
    setIsFavorite(prev => !prev);
    
    try {
      if (currentUser) {
        // If user is logged in, try to sync with cloud
        if (!isFavorite) {
          await favoriteService.addFavoriteMenuItem(currentUser.uid, item);
          toast.success('Added to favorites');
        } else {
          // Find favorite ID to remove
          const favorites = await favoriteService.getFavoriteMenuItems(currentUser.uid);
          const favorite = favorites.find(fav => fav.id === item.id);
          if (favorite && favorite.favoriteId) {
            await favoriteService.removeFavoriteMenuItem(currentUser.uid, favorite.favoriteId);
            toast.success('Removed from favorites');
          }
        }
      } else {
        // If no user, store in localStorage
        if (!isFavorite) {
          localStorageService.addFavoriteMenuItem(item);
          toast.success('Added to favorites');
        } else {
          localStorageService.removeFavoriteMenuItem(item.id);
          toast.success('Removed from favorites');
        }
      }
    } catch (error) {
      console.error('Error toggling favorite status:', error);
      // Revert the state if there was an error
      setIsFavorite(prev => !prev);
      toast.error('Failed to update favorites');
    }
  };

  return (
    <div className={styles.menuItem}>
      <div className={styles.imageContainer}>
        <img
          src={imageError ? defaultImage : item.image || defaultImage}
          alt={item.name}
          className={styles.image}
          onError={handleImageError}
          loading="lazy"
        />
        
        {item.specialLabels && item.specialLabels.length > 0 && (
          <div className={styles.specialLabels}>
            {item.specialLabels.map(label => (
              <span key={label} className={styles.specialLabel}>
                {label}
              </span>
            ))}
          </div>
        )}
        
        <div className={styles.courseTag}>
          {item.course}
        </div>
        
        <button 
          className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ''}`}
          onClick={handleToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart size={18} fill={isFavorite ? "#e53e3e" : "none"} stroke={isFavorite ? "#e53e3e" : "white"} />
        </button>
      </div>
      
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.name}>{item.name}</h3>
          <span className={styles.price}>${item.price.toFixed(2)}</span>
        </div>
        
        <div className={styles.dietaryIcons}>
          {item.isVegetarian && (
            <div className={`${styles.dietaryIcon} ${styles.vegetarian}`} title="Vegetarian">
              <Leaf size={14} />
            </div>
          )}
          {item.isVegan && (
            <div className={`${styles.dietaryIcon} ${styles.vegan}`} title="Vegan">
              <Leaf size={14} />
            </div>
          )}
          {item.isGlutenFree && (
            <div className={`${styles.dietaryIcon} ${styles.glutenFree}`} title="Gluten-Free">
              <Wheat size={14} />
            </div>
          )}
          {item.isSpicy && (
            <div className={`${styles.dietaryIcon} ${styles.spicy}`} title="Spicy">
              <Flame size={14} />
            </div>
          )}
        </div>
        
        <p className={styles.description}>{item.description}</p>
        
        {item.allergens.length > 0 && (
          <div className={styles.allergens}>
            <span className={styles.allergenLabel}>Allergens:</span>
            <div className={styles.allergenList}>
              {item.allergens.map(allergen => (
                <span key={allergen} className={styles.allergen}>{allergen}</span>
              ))}
            </div>
          </div>
        )}
        
        <div className={styles.footer}>
          <span className={styles.prepTime}>
            <Utensils size={14} />
            {item.preparationTime} mins
          </span>
          
          <button
            className={`${styles.addButton} ${!item.availability ? styles.disabled : ''} ${addedToCart ? styles.added : ''}`}
            disabled={!item.availability}
            onClick={handleAddToCart}
          >
            {!item.availability 
              ? 'Not Available' 
              : addedToCart 
                ? 'Added to Cart!' 
                : (
                  <>
                    <ShoppingCart size={16} />
                    Add to Cart
                  </>
                )
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem; 