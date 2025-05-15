import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowDown, X } from 'lucide-react';
import { Course, Cuisine } from '../../services/menuService';
import styles from './MenuFilter.module.css';

interface MenuFilterProps {
  courses: Course[];
  cuisines: Cuisine[];
  selectedCourse: string | null;
  selectedCuisine: string | null;
  searchQuery: string;
  dietaryFilters: {
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    spicy: boolean;
  };
  onCourseChange: (course: string | null) => void;
  onCuisineChange: (cuisine: string | null) => void;
  onSearchChange: (query: string) => void;
  onDietaryFilterChange: (filters: any) => void;
}

const MenuFilter: React.FC<MenuFilterProps> = ({
  courses,
  cuisines,
  selectedCourse,
  selectedCuisine,
  searchQuery,
  dietaryFilters,
  onCourseChange,
  onCuisineChange,
  onSearchChange,
  onDietaryFilterChange
}) => {
  const [isMobileView, setIsMobileView] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let count = 0;
    if (selectedCourse) count++;
    if (selectedCuisine) count++;
    if (dietaryFilters.vegetarian) count++;
    if (dietaryFilters.vegan) count++;
    if (dietaryFilters.glutenFree) count++;
    if (dietaryFilters.spicy) count++;
    setActiveFiltersCount(count);
  }, [selectedCourse, selectedCuisine, dietaryFilters]);

  const handleDietaryChange = (name: string) => {
    onDietaryFilterChange({
      ...dietaryFilters,
      [name]: !dietaryFilters[name as keyof typeof dietaryFilters]
    });
  };

  const clearAllFilters = () => {
    onCourseChange(null);
    onCuisineChange(null);
    onDietaryFilterChange({
      vegetarian: false,
      vegan: false,
      glutenFree: false,
      spicy: false
    });
    onSearchChange('');
  };

  return (
    <div className={styles.menuFilter}>
      <div className={styles.searchBar}>
        <div className={styles.searchInput}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button 
              className={styles.clearSearch}
              onClick={() => onSearchChange('')}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button 
          className={styles.filterButton}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} />
          <span>Filters</span>
          {activeFiltersCount > 0 && (
            <span className={styles.filterBadge}>{activeFiltersCount}</span>
          )}
          <ArrowDown 
            size={16} 
            className={`${styles.arrowIcon} ${showFilters ? styles.rotated : ''}`} 
          />
        </button>
      </div>

      {showFilters && (
        <div className={styles.filterPanel}>
          <div className={styles.filterSection}>
            <h3>Course</h3>
            <div className={styles.filterOptions}>
              <button
                className={`${styles.filterOption} ${selectedCourse === null ? styles.active : ''}`}
                onClick={() => onCourseChange(null)}
              >
                All
              </button>
              {courses.map((course) => (
                <button
                  key={course}
                  className={`${styles.filterOption} ${selectedCourse === course ? styles.active : ''}`}
                  onClick={() => onCourseChange(course)}
                >
                  {course}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3>Cuisine</h3>
            <div className={styles.filterOptions}>
              <button
                className={`${styles.filterOption} ${selectedCuisine === null ? styles.active : ''}`}
                onClick={() => onCuisineChange(null)}
              >
                All
              </button>
              {cuisines.map((cuisine) => (
                <button
                  key={cuisine}
                  className={`${styles.filterOption} ${selectedCuisine === cuisine ? styles.active : ''}`}
                  onClick={() => onCuisineChange(cuisine)}
                >
                  {cuisine}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.filterSection}>
            <h3>Dietary Preferences</h3>
            <div className={styles.dietaryOptions}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={dietaryFilters.vegetarian}
                  onChange={() => handleDietaryChange('vegetarian')}
                />
                <span>Vegetarian</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={dietaryFilters.vegan}
                  onChange={() => handleDietaryChange('vegan')}
                />
                <span>Vegan</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={dietaryFilters.glutenFree}
                  onChange={() => handleDietaryChange('glutenFree')}
                />
                <span>Gluten-Free</span>
              </label>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={dietaryFilters.spicy}
                  onChange={() => handleDietaryChange('spicy')}
                />
                <span>Spicy</span>
              </label>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <button 
              className={styles.clearFiltersButton}
              onClick={clearAllFilters}
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuFilter; 