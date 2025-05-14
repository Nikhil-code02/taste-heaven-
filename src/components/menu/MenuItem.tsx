import React from 'react';
import { MenuItem as MenuItemType } from '../../services/menuService';

interface MenuItemProps {
  item: MenuItemType;
}

const MenuItem: React.FC<MenuItemProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-48">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
        {item.specialLabels.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-wrap gap-2">
            {item.specialLabels.map(label => (
              <span
                key={label}
                className="bg-primary-600 text-white text-xs px-2 py-1 rounded"
              >
                {label}
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <span className="text-lg font-bold text-primary-600">
            ${item.price.toFixed(2)}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4">{item.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {item.allergens.map(allergen => (
            <span
              key={allergen}
              className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
            >
              {allergen}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Prep time: {item.preparationTime} mins
          </span>
          <button
            className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors"
            disabled={!item.availability}
          >
            {item.availability ? 'Add to Cart' : 'Not Available'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MenuItem; 