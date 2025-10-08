import React from 'react';
import { getStyleOptions, generateAvatarSVG } from '../utils/avatarUtils';
import '../styles/AvatarEditorPage.css';

const ItemSelector = ({ 
  title, 
  category, 
  currentValue,
  availableItems = [], // NEW: Support for available items from AvatarEditor
  currentAvatarConfig, // OPTIONAL: For backward compatibility
  onChange 
}) => {
  
  // Debug logging
  console.log(`ItemSelector - ${title}:`, {
    category,
    currentValue,
    availableItems,
    hasConfig: !!currentAvatarConfig
  });

  // CRITICAL FIX: Determine options source
  let options = [];
  
  // If availableItems is provided (new way), use it
  if (availableItems && availableItems.length > 0) {
    options = availableItems;
  } 
  // Otherwise, use the old way with currentAvatarConfig
  else if (currentAvatarConfig?.style) {
    options = getStyleOptions(currentAvatarConfig.style, category);
  }

  if (!options || options.length === 0) {
    console.warn(`No options found for ${category}`);
    return (
      <div className="item-selector">
        <div className="no-options-message">
          <p>No {title.toLowerCase()} options available.</p>
          <p style={{ fontSize: '0.85em', color: '#666' }}>
            Try leveling up to unlock more options!
          </p>
        </div>
      </div>
    );
  }

  console.log(`Found ${options.length} options for ${category}:`, options);

  // CRITICAL FIX: Simplified option click handler
  const handleOptionClick = (optionValue) => {
    console.log(`🎯 Selecting ${category}: ${optionValue}`);
    
    if (onChange) {
      // IMPORTANT: Just pass the value, not the entire config
      // The parent component (AvatarEditor) handles the structure
      onChange(optionValue);
      console.log(`✅ Called onChange with value:`, optionValue);
    } else {
      console.error('❌ No onChange handler provided!');
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
      'skin', 'skinTone', 'eyeColor', 'facialHairColor', 'skinColor',
      'clothingColor', 'accessoryColor'
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
        <div className="options-count">
          {options.length} option{options.length !== 1 ? 's' : ''} available
        </div>
        
        {/* COMPACT BUTTON GRID */}
        <div className="option-buttons-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '0.75rem',
          marginTop: '1rem'
        }}>
          {options.map((option) => {
            const isSelected = currentValue === option;
            const label = formatLabel(option);
            
            return (
              <button
                key={option}
                className={`option-button ${isSelected ? 'selected' : ''} ${isColor ? 'color-option' : ''}`}
                onClick={() => handleOptionClick(option)}
                title={`${label} - Click to select`}
                style={{
                  padding: '0.75rem',
                  border: isSelected ? '3px solid #8B5CF6' : '2px solid #E5E7EB',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(139, 92, 246, 0.1)' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? '#8B5CF6' : '#2D3748'
                }}
              >
                {isColor && (
                  <div 
                    className="color-preview"
                    style={{ 
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: getColorValue(option),
                      border: '2px solid rgba(0,0,0,0.1)'
                    }}
                  />
                )}
                <span className="option-label" style={{
                  textAlign: 'center',
                  fontSize: '0.85rem',
                  lineHeight: '1.2'
                }}>
                  {label}
                </span>
                {isSelected && (
                  <span style={{ fontSize: '1.2rem' }}>✓</span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Show current selection */}
        {currentValue && (
          <div className="current-selection" style={{
            marginTop: '1rem',
            padding: '0.75rem',
            background: 'rgba(139, 92, 246, 0.05)',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span className="selection-label" style={{
              fontWeight: '600',
              color: '#6B7280'
            }}>
              Current Selection:
            </span>
            <span className="selection-value" style={{
              fontWeight: '700',
              color: '#8B5CF6'
            }}>
              {formatLabel(currentValue)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemSelector;