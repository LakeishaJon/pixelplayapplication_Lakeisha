import React from 'react';
import { AVATAR_STYLES, generateAvatarSVG } from '../utils/avatarUtils';
import '../styles/AvatarEditorPage.css';

const ItemSelector = ({ 
  title, 
  category, 
  currentValue, 
  currentAvatarConfig, 
  onChange,
  showPreview = true 
}) => {
  // Get current style from avatar config
  const currentStyle = currentAvatarConfig?.style;
  
  if (!currentStyle || !AVATAR_STYLES[currentStyle]) {
    return (
      <div className="item-selector">
        <h4>{title}</h4>
        <p className="no-style-message">Please select an avatar style first</p>
      </div>
    );
  }

  // Get available options for this style and category
  const availableOptions = AVATAR_STYLES[currentStyle].customOptions[category] || [];
  
  if (availableOptions.length === 0) {
    return (
      <div className="item-selector">
        <h4>{title}</h4>
        <p className="no-options-message">No {category} options available for this style</p>
      </div>
    );
  }

  const handleOptionSelect = (optionValue) => {
    // Update the avatar config with new option
    const updatedOptions = {
      ...currentAvatarConfig.options,
      [category]: [optionValue]
    };
    
    const updatedConfig = {
      ...currentAvatarConfig,
      options: updatedOptions
    };
    
    onChange(updatedConfig);
  };

  // Get current selected value
  const selectedValue = currentValue || 
    (currentAvatarConfig?.options?.[category] && 
     Array.isArray(currentAvatarConfig.options[category]) 
       ? currentAvatarConfig.options[category][0] 
       : currentAvatarConfig.options[category]);

  return (
    <div className="item-selector">
      <div className="selector-header">
        <h4>{title}</h4>
        <span className="option-count">{availableOptions.length} options</span>
      </div>
      
      <div className="options-grid">
        {availableOptions.map(option => {
          const isSelected = selectedValue === option;
          
          // Generate preview with this option if showPreview is enabled
          let previewSvg = null;
          if (showPreview) {
            const previewConfig = {
              ...currentAvatarConfig,
              options: {
                ...currentAvatarConfig.options,
                [category]: [option]
              }
            };
            previewSvg = generateAvatarSVG(previewConfig);
          }
          
          return (
            <div
              key={option}
              className={`option-item ${isSelected ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(option)}
            >
              {showPreview && previewSvg ? (
                <div className="option-preview">
                  <div 
                    className="preview-avatar"
                    dangerouslySetInnerHTML={{ __html: previewSvg }}
                  />
                </div>
              ) : (
                <div className="option-color-preview" style={{
                  backgroundColor: category.includes('Color') || category === 'backgroundColor' 
                    ? `#${option}` 
                    : '#f0f0f0'
                }}>
                  {!category.includes('Color') && category !== 'backgroundColor' && (
                    <span className="option-icon">👤</span>
                  )}
                </div>
              )}
              
              <div className="option-info">
                <span className="option-name">
                  {formatOptionName(option)}
                </span>
                {isSelected && (
                  <span className="selected-check">✓</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {selectedValue && (
        <div className="current-selection">
          <span className="selection-label">Current:</span>
          <span className="selection-value">{formatOptionName(selectedValue)}</span>
        </div>
      )}
    </div>
  );
};

// Helper function to format option names for display
const formatOptionName = (optionValue) => {
  if (!optionValue) return 'None';
  
  // Handle color codes
  if (optionValue.match(/^[0-9a-fA-F]{6}$/)) {
    return `Color #${optionValue}`;
  }
  
  // Convert camelCase and snake_case to readable format
  return optionValue
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/[_-]/g, ' ') // Replace underscores and dashes with spaces
    .replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter
    .replace(/\s+/g, ' ') // Remove extra spaces
    .trim();
};

export default ItemSelector;