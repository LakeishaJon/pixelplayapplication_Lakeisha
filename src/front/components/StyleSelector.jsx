import React from 'react';
import { AVATAR_STYLES, createDefaultAvatarConfig } from '../utils/avatarUtils';
import '../styles/AvatarEditorPage.css';

const StyleSelector = ({ currentStyle, currentConfig, onChange }) => {
  const styles = Object.keys(AVATAR_STYLES);

  console.log('StyleSelector - Current:', {
    currentStyle,
    currentConfig,
    availableStyles: styles
  });

  const handleStyleChange = (newStyle) => {
    if (newStyle === currentStyle) {
      console.log('Style already selected:', newStyle);
      return;
    }
    
    console.log('Changing style from', currentStyle, 'to', newStyle);
    
    // Log the new style options for debugging
    const styleConfig = AVATAR_STYLES[newStyle];
    if (styleConfig) {
      console.group(`Debug: ${styleConfig.name} Options`);
      Object.entries(styleConfig.customOptions).forEach(([category, options]) => {
        console.log(`${category}:`, options);
      });
      console.groupEnd();
    }
    
    // Create default config for new style, keeping the user seed if available
    const userId = currentConfig?.seed?.split('-')[0] || 'user';
    const defaultConfig = createDefaultAvatarConfig(newStyle, `${userId}-${Date.now()}`);
    
    if (!defaultConfig) {
      console.error('Failed to create default config for style:', newStyle);
      return;
    }
    
    console.log('New style config:', defaultConfig);
    
    if (onChange) {
      onChange(defaultConfig);
    }
  };

  // Helper to format style names nicely
  const formatStyleName = (styleKey) => {
    const style = AVATAR_STYLES[styleKey];
    return style ? style.name : styleKey.charAt(0).toUpperCase() + styleKey.slice(1);
  };

  return (
    <div className="item-selector">
      <div className="selector-section">
        <h4 className="selector-title">Avatar Style</h4>
        <div className="options-count">{styles.length} styles available</div>
        
        {/* COMPACT BUTTON GRID - NO LARGE CARDS */}
        <div className="option-buttons-grid">
          {styles.map(styleKey => {
            const style = AVATAR_STYLES[styleKey];
            const isSelected = currentStyle === styleKey;
            
            return (
              <button
                key={styleKey}
                className={`option-button ${isSelected ? 'selected' : ''}`}
                onClick={() => handleStyleChange(styleKey)}
                title={style.description}
              >
                <span className="option-label">{formatStyleName(styleKey)}</span>
                {style.kidFriendly && (
                  <span className="kid-badge">👶</span>
                )}
              </button>
            );
          })}
        </div>
        
        {/* Show current selection */}
        {currentStyle && AVATAR_STYLES[currentStyle] && (
          <div className="current-selection">
            <span className="selection-label">Current Style:</span>
            <span className="selection-value">{formatStyleName(currentStyle)}</span>
          </div>
        )}
        
        {/* Show available customizations for current style */}
        {currentStyle && AVATAR_STYLES[currentStyle] && (
          <div className="style-info">
            <h5>Available Customizations:</h5>
            <div className="customization-preview">
              {Object.keys(AVATAR_STYLES[currentStyle].customOptions).map(category => (
                <span key={category} className="category-tag">
                  {category.replace(/([A-Z])/g, ' $1').trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleSelector;