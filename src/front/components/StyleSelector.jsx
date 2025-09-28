import React from 'react';
import { AVATAR_STYLES, generateAvatarSVG, createDefaultAvatarConfig } from '../utils/avatarUtils';
import '../styles/AvatarEditorPage.css';

const StyleSelector = ({ currentStyle, currentConfig, onChange }) => {
  const styles = Object.keys(AVATAR_STYLES);

  const handleStyleChange = (newStyle) => {
    if (newStyle === currentStyle) return;
    
    // Create default config for new style
    const defaultConfig = createDefaultAvatarConfig(newStyle, currentConfig?.seed?.split('-')[0] || 'user');
    
    onChange(defaultConfig);
  };

  return (
    <div className="style-selector">
      <div className="selector-section">
        <h3>Avatar Styles</h3>
        <p>Choose from available hair options</p>
        
        {/* Compact Button Grid - Like Image 4 */}
        <div className="option-buttons-grid">
          {styles.map(styleKey => {
            const style = AVATAR_STYLES[styleKey];
            const isSelected = currentStyle === styleKey;
            
            return (
              <button
                key={styleKey}
                className={`option-button ${isSelected ? 'selected' : ''}`}
                onClick={() => handleStyleChange(styleKey)}
              >
                {style.name}
                {style.kidFriendly && <span className="kid-badge">👶</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StyleSelector;