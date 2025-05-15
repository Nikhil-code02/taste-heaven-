import React from 'react';
import MenuList from '../components/menu/MenuList';
import styles from './Menu.module.css';

const Menu: React.FC = () => {
  return (
    <div className={styles.menuPage}>
      <div className={styles.menuHeader}>
        <h1>Our Menu</h1>
        <p>Explore our diverse selection of expertly crafted dishes, made with locally sourced ingredients</p>
      </div>
      
      <div className={styles.menuDescription}>
        <div className={styles.container}>
          <div className={styles.descriptionContent}>
            <h2>Taste the Difference</h2>
            <p>
              At Taste Haven, we believe in creating memorable dining experiences through 
              exceptional flavors and quality ingredients. Our menu changes seasonally to 
              take advantage of the freshest local produce, while maintaining our signature 
              dishes that our guests have come to love.
            </p>
            <p>
              Our executive chef draws inspiration from global cuisine while honoring 
              traditional techniques, resulting in unique dishes you won't find anywhere else.
            </p>
          </div>
        </div>
      </div>
      
      <div className={styles.menuContainer}>
        <MenuList />
      </div>
      
      <div className={styles.specialDiets}>
        <div className={styles.container}>
          <h2>Special Dietary Options</h2>
          <div className={styles.dietsGrid}>
            <div className={styles.dietCard}>
              <h3>Vegetarian</h3>
              <p>We offer a wide selection of creative vegetarian dishes that celebrate seasonal produce.</p>
            </div>
            <div className={styles.dietCard}>
              <h3>Gluten-Free</h3>
              <p>Many of our dishes can be prepared gluten-free without compromising flavor.</p>
            </div>
            <div className={styles.dietCard}>
              <h3>Vegan</h3>
              <p>Our plant-based options are designed to satisfy and delight even dedicated carnivores.</p>
            </div>
            <div className={styles.dietCard}>
              <h3>Allergen-Aware</h3>
              <p>Please inform your server of any allergies, and we'll accommodate your needs.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu; 