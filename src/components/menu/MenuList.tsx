import React, { useState, useEffect } from 'react';
import { MenuItem } from '../../services/menuService';
import { default as MenuItemComponent } from './MenuItem';
import MenuFilter from './MenuFilter';
import styles from './MenuList.module.css';
import { useMenu } from '../../contexts/MenuContext';

const MenuList: React.FC = () => {
  const { 
    menuItems: contextMenuItems, 
    loading: contextLoading, 
    error: contextError,
    courses: contextCourses,
    cuisines: contextCuisines
  } = useMenu();
  
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilters, setDietaryFilters] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    spicy: false
  });
  
  // Apply filters
  useEffect(() => {
    let result = [...contextMenuItems];
    
    // Filter by course
    if (selectedCourse) {
      result = result.filter(item => item.course === selectedCourse);
    }
    
    // Filter by cuisine
    if (selectedCuisine) {
      result = result.filter(item => item.category === selectedCuisine);
    }
    
    // Filter by dietary preferences
    if (dietaryFilters.vegetarian) {
      result = result.filter(item => item.isVegetarian);
    }
    
    if (dietaryFilters.vegan) {
      result = result.filter(item => item.isVegan);
    }
    
    if (dietaryFilters.glutenFree) {
      result = result.filter(item => item.isGlutenFree);
    }
    
    if (dietaryFilters.spicy) {
      result = result.filter(item => item.isSpicy);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.ingredients.some(ingredient => ingredient.toLowerCase().includes(query))
      );
    }
    
    setFilteredItems(result);
  }, [contextMenuItems, selectedCourse, selectedCuisine, dietaryFilters, searchQuery]);
  
  // Group items by course for display
  const groupedByCourse = filteredItems.reduce((acc, item) => {
    const course = item.course;
    if (!acc[course]) {
      acc[course] = [];
    }
    acc[course].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);
  
  if (contextLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading our delicious menu...</p>
      </div>
    );
  }
  
  if (contextError) {
    return (
      <div className={styles.errorContainer}>
        <p>{contextError}</p>
        <button 
          onClick={() => window.location.reload()}
          className={styles.retryButton}
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className={styles.menuList}>
      <MenuFilter
        courses={contextCourses}
        cuisines={contextCuisines}
        selectedCourse={selectedCourse}
        selectedCuisine={selectedCuisine}
        searchQuery={searchQuery}
        dietaryFilters={dietaryFilters}
        onCourseChange={setSelectedCourse}
        onCuisineChange={setSelectedCuisine}
        onSearchChange={setSearchQuery}
        onDietaryFilterChange={setDietaryFilters}
      />
      
      {Object.keys(groupedByCourse).length === 0 ? (
        <div className={styles.noResults}>
          <p>No menu items match your filters.</p>
          <button 
            onClick={() => {
              setSelectedCourse(null);
              setSelectedCuisine(null);
              setDietaryFilters({
                vegetarian: false,
                vegan: false,
                glutenFree: false,
                spicy: false
              });
              setSearchQuery('');
            }}
            className={styles.clearFiltersButton}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className={styles.menuSections}>
          {Object.entries(groupedByCourse).map(([course, items]) => (
            <div key={course} className={styles.menuSection}>
              <h2 className={styles.courseTitle}>{course}</h2>
              <div className={styles.menuItemsGrid}>
                {items.map(item => (
                  <MenuItemComponent key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuList; 