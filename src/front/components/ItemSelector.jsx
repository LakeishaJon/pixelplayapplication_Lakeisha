import React from 'react';
import { getStyleOptions, generateAvatarSVG } from '../utils/avatarUtils';
import '../styles/AvatarEditorPage.css';

const ItemSelector = ({ 
  title, 
  category, 
  currentValue, 
  currentAvatarConfig, 
  onChange 
}) => {
  
  // Debug logging
  console.log(`ItemSelector - ${title}:`, {
    category,
    currentValue,
    currentAvatarConfig,
    style: currentAvatarConfig?.style
  });

  if (!currentAvatarConfig?.style || !category) {
    console.warn('ItemSelector: Missing required props', { style: currentAvatarConfig?.style, category });
    return (
      <div className="item-selector">
        <div className="no-options-message">
          <p>Missing configuration for {title}</p>
        </div>
      </div>
    );
  }

  // Get options for this category and style
  const options = getStyleOptions(currentAvatarConfig.style, category);
  
  if (!options || options.length === 0) {
    console.warn(`No options found for ${currentAvatarConfig.style} -> ${category}`);
    return (
      <div className="item-selector">
        <div className="no-options-message">
          <p>No {title.toLowerCase()} options available for {currentAvatarConfig.style} style.</p>
        </div>
      </div>
    );
  }

  console.log(`Found ${options.length} options for ${category}:`, options);

  const handleOptionClick = (optionValue) => {
    console.log(`Selecting ${category}: ${optionValue}`);
    
    // Create updated avatar config
    const updatedConfig = {
      ...currentAvatarConfig,
      options: {
        ...currentAvatarConfig.options,
        [category]: [optionValue] // DiceBear expects arrays for options
      }
    };
    
    console.log('Updated config:', updatedConfig);
    
    if (onChange) {
      onChange(updatedConfig);
    }
  };

  // Helper to format option labels nicely
  const formatLabel = (option) => {
    if (!option) return 'None';
    
    return String(option)
      .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
      .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
      .replace(/\b\w+\b/g, word => {
        // Handle specific cases
        const lowerWord = word.toLowerCase();
        if (lowerWord === 'nohair') return 'No Hair';
        if (lowerWord === 'longhair') return 'Long Hair';
        if (lowerWord === 'shorthair') return 'Short Hair';
        if (lowerWord.startsWith('variant')) return word.toUpperCase();
        return word;
      })
      .trim();
  };

  // Helper to determine if option represents a color
  const isColorCategory = (category) => {
    const colorCategories = [
      'backgroundColor', 'hairColor', 'shirtColor', 'clotheColor', 
      'skin', 'skinTone', 'eyeColor', 'facialHairColor'
    ];
    return colorCategories.includes(category);
  };

  // Helper to get color value for display
  const getColorValue = (option) => {
    if (!option) return '#CCCCCC';
    
    const colorMap = {
      // Hair colors
      'Auburn': '#A52A2A', 'Black': '#2C1B18', 'Blonde': '#F5DEB3', 'BlondeGolden': '#FFD700',
      'Brown': '#8B4513', 'BrownDark': '#654321', 'PastelPink': '#FFB6C1', 'Platinum': '#E5E4E2',
      'Red': '#FF0000', 'SilverGray': '#C0C0C0',
      
      // Micah style colors (hex without #)
      '2d3748': '#2d3748', '744210': '#744210', 'f59e0b': '#f59e0b', 'ef4444': '#ef4444',
      '8b5cf6': '#8b5cf6', '06b6d4': '#06b6d4', '10b981': '#10b981',
      
      // Skin colors
      'Tanned': '#D2B48C', 'Yellow': '#F1C27D', 'Pale': '#F8E6CC', 'Light': '#F5DEB3',
      'DarkBrown': '#8B4513', 'light': '#F5DEB3', 'medium': '#D2B48C', 'dark': '#8B4513',
      
      // Background colors
      'b6e3f4': '#b6e3f4', 'c084fc': '#c084fc', 'fb7185': '#fb7185', 'fbbf24': '#fbbf24',
      '34d399': '#34d399', 'f472b6': '#f472b6', '60a5fa': '#60a5fa',
      '65C9FF': '#65C9FF', 'FC909F': '#FC909F', 'FFAF7A': '#FFAF7A', 'BEAAE2': '#BEAAE2',
      '93EDC7': '#93EDC7', 'FFD93D': '#FFD93D',
      
      // Basic colors
      'blue': '#0000FF', 'green': '#008000', 'red': '#FF0000', 'orange': '#FFA500',
      'yellow': '#FFFF00', 'purple': '#800080', 'pink': '#FFC0CB', 'black': '#000000',
      'white': '#FFFFFF', 'brown': '#A52A2A', 'gray': '#808080', 'blonde': '#F5DEB3',
      
      // Clothing colors
      'Blue01': '#4A90E2', 'Blue02': '#5BA7F7', 'Blue03': '#96CCF0', 'Gray01': '#9B9B9B',
      'Gray02': '#C5C5C5', 'Heather': '#B0B0B0', 'PastelBlue': '#87CEEB', 'PastelGreen': '#98FB98',
      'PastelOrange': '#FFB347', 'PastelRed': '#FFB6C1', 'PastelYellow': '#FFFF9F', 'Pink': '#FF69B4',
      
      // Shirt colors (micah style)
      '3b82f6': '#3b82f6', 'ef4444': '#ef4444', '10b981': '#10b981', 'f59e0b': '#f59e0b',
      '8b5cf6': '#8b5cf6', 'ec4899': '#ec4899'
    };
    
    // Return mapped color, try as hex, or default
    return colorMap[option] || (option.startsWith('#') ? option : `#${option}`) || '#CCCCCC';
  };

  const isColor = isColorCategory(category);

  return (
    <div className="item-selector">
      <div className="selector-section">
        <h4 className="selector-title">{title}</h4>
        <div className="options-count">{options.length} options</div>
        
        {/* COMPACT BUTTON GRID */}
        <div className="option-buttons-grid">
          {options.map((option) => {
            const isSelected = currentValue === option;
            const label = formatLabel(option);
            
            return (
              <button
                key={option}
                className={`option-button ${isSelected ? 'selected' : ''} ${isColor ? 'color-option' : ''}`}
                onClick={() => handleOptionClick(option)}
                title={`${label} - Click to select`}
              >
                {isColor && (
                  <div 
                    className="color-preview"
                    style={{ backgroundColor: getColorValue(option) }}
                  />
                )}
                <span className="option-label">{label}</span>
              </button>
            );
          })}
        </div>
        
        {/* Show current selection */}
        {currentValue && (
          <div className="current-selection">
            <span className="selection-label">Current:</span>
            <span className="selection-value">{formatLabel(currentValue)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemSelector;