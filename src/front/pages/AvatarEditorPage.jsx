import React, { useState, useEffect } from 'react';
import { 
  getAvailableCategories,
  hasStyleOption,
  createDefaultConfig,
  getStyleOptions,
  getAvailableStyles,
  generateAvatarSVG,
  updateAvatarOption,
  AVATAR_STYLES
} from '../utils/avatarUtils';

// ============================================
// 🎨 MAIN AVATAR EDITOR COMPONENT
// ============================================

const AvatarEditorPage = () => {
  const [currentStyle, setCurrentStyle] = useState('micah');
  const [availableCategories, setAvailableCategories] = useState([]);
  const [config, setConfig] = useState(null);
  const [avatarSvg, setAvatarSvg] = useState(null);
  
  // Initialize when component mounts or style changes
  useEffect(() => {
    console.log('🎨 Style changed to:', currentStyle);
    
    // Get only the categories that exist for this style
    const categories = getAvailableCategories(currentStyle);
    setAvailableCategories(categories);
    
    // Create a fresh config with default options
    const newConfig = createDefaultConfig(currentStyle, 'user-' + Date.now());
    setConfig(newConfig);
    
    console.log('✅ Available categories:', categories);
    console.log('✅ New config:', newConfig);
  }, [currentStyle]);
  
  // Generate SVG whenever config changes
  useEffect(() => {
    if (config) {
      const svg = generateAvatarSVG(config);
      setAvatarSvg(svg);
    }
  }, [config]);
  
  // Handle option changes
  const handleOptionChange = (category, value) => {
    console.log(`🎯 Changing ${category} to ${value}`);
    
    const updatedConfig = updateAvatarOption(config, category, value);
    setConfig(updatedConfig);
  };
  
  // Handle style change
  const handleStyleChange = (newStyle) => {
    console.log('🔄 Switching to style:', newStyle);
    setCurrentStyle(newStyle);
  };
  
  return (
    <div className="avatar-editor-page">
      <div className="editor-container">
        {/* Header */}
        <div className="editor-header">
          <h1>🎨 Avatar Creator</h1>
          <p>Design your unique character!</p>
        </div>
        
        {/* Main Content */}
        <div className="editor-content">
          {/* Left Panel - Avatar Preview */}
          <div className="preview-panel">
            <AvatarDisplay 
              svg={avatarSvg} 
              styleName={AVATAR_STYLES[currentStyle]?.name || currentStyle}
            />
          </div>
          
          {/* Right Panel - Controls */}
          <div className="controls-panel">
            {/* Style Selector */}
            <div className="control-section">
              <h3>Choose Art Style</h3>
              <StyleSelector 
                currentStyle={currentStyle}
                onChange={handleStyleChange}
              />
            </div>
            
            {/* Customization Options */}
            <div className="control-section">
              <h3>Customize Your Avatar</h3>
              <div className="options-grid">
                {availableCategories.map(category => (
                  <OptionSelector
                    key={category}
                    category={category}
                    currentValue={config?.options?.[category]?.[0]}
                    styleName={currentStyle}
                    onChange={(value) => handleOptionChange(category, value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Info Footer */}
        <div className="editor-footer">
          <div className="info-box">
            <p>
              ℹ️ <strong>{AVATAR_STYLES[currentStyle]?.name}</strong> style has{' '}
              <strong>{availableCategories.length}</strong> customization options
            </p>
            <small>
              Available: {availableCategories.join(', ')}
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 📺 AVATAR DISPLAY COMPONENT
// ============================================

const AvatarDisplay = ({ svg, styleName }) => {
  if (!svg) {
    return (
      <div className="avatar-display loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Generating avatar...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="avatar-display">
      <div className="avatar-frame">
        <div 
          className="avatar-svg"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
      <div className="avatar-info">
        <span className="avatar-style-badge">{styleName}</span>
      </div>
    </div>
  );
};

// ============================================
// 🎭 STYLE SELECTOR COMPONENT
// ============================================

const StyleSelector = ({ currentStyle, onChange }) => {
  const styles = getAvailableStyles();
  
  return (
    <div className="style-selector">
      <div className="style-grid">
        {styles.map(style => (
          <button
            key={style.id}
            className={`style-button ${currentStyle === style.id ? 'active' : ''}`}
            onClick={() => onChange(style.id)}
            title={style.description}
          >
            <div className="style-icon">🎨</div>
            <div className="style-name">{style.name}</div>
            {style.kidFriendly && <span className="kid-friendly-badge">👶</span>}
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================
// 🎚️ OPTION SELECTOR COMPONENT
// ============================================

const OptionSelector = ({ category, currentValue, styleName, onChange }) => {
  // Get available options for this category
  const options = getStyleOptions(styleName, category);
  
  // Don't render if no options available
  if (!options || options.length === 0) {
    return null;
  }
  
  // Format category label
  const categoryLabels = {
    backgroundColor: 'Background',
    hair: 'Hair Style',
    hairColor: 'Hair Color',
    eyes: 'Eyes',
    eyebrows: 'Eyebrows',
    mouth: 'Mouth',
    shirt: 'Shirt',
    shirtColor: 'Shirt Color',
    top: 'Top',
    skin: 'Skin Tone',
    skinTone: 'Skin Shade',
    clothes: 'Clothes',
    clotheColor: 'Clothes Color',
    accessories: 'Accessories',
    facialHair: 'Facial Hair',
    facial_hair: 'Facial Hair',
    body: 'Body',
    nose: 'Nose',
    beard: 'Beard',
    mood: 'Mood'
  };
  
  const label = categoryLabels[category] || category;
  
  // Check if this is a color category
  const isColorCategory = category.toLowerCase().includes('color') || 
                          category === 'backgroundColor' ||
                          category === 'skin' ||
                          category === 'skinTone';
  
  return (
    <div className="option-selector">
      <label className="option-label">{label}</label>
      
      {isColorCategory ? (
        // Color picker for color options
        <div className="color-options">
          {options.map(option => (
            <button
              key={option}
              className={`color-button ${currentValue === option ? 'selected' : ''}`}
              onClick={() => onChange(option)}
              style={{ backgroundColor: `#${option}` }}
              title={option}
            >
              {currentValue === option && <span className="check-mark">✓</span>}
            </button>
          ))}
        </div>
      ) : (
        // Dropdown for non-color options
        <select
          className="option-dropdown"
          value={currentValue || ''}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

// ============================================
// 💅 STYLES
// ============================================

const styles = `
  .avatar-editor-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 2rem;
  }
  
  .editor-container {
    max-width: 1400px;
    margin: 0 auto;
    background: white;
    border-radius: 20px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    overflow: hidden;
  }
  
  .editor-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 2rem;
    text-align: center;
  }
  
  .editor-header h1 {
    margin: 0;
    font-size: 2.5rem;
    font-weight: 700;
  }
  
  .editor-header p {
    margin: 0.5rem 0 0 0;
    opacity: 0.9;
  }
  
  .editor-content {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 2rem;
    padding: 2rem;
  }
  
  @media (max-width: 968px) {
    .editor-content {
      grid-template-columns: 1fr;
    }
  }
  
  /* Avatar Display */
  .preview-panel {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .avatar-display {
    text-align: center;
  }
  
  .avatar-display.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 300px;
  }
  
  .loading-spinner {
    text-align: center;
  }
  
  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .avatar-frame {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  }
  
  .avatar-svg {
    width: 300px;
    height: 300px;
    margin: 0 auto;
  }
  
  .avatar-svg svg {
    width: 100%;
    height: 100%;
  }
  
  .avatar-info {
    margin-top: 1rem;
  }
  
  .avatar-style-badge {
    display: inline-block;
    background: #667eea;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
  }
  
  /* Controls Panel */
  .controls-panel {
    overflow-y: auto;
    max-height: 600px;
  }
  
  .control-section {
    margin-bottom: 2rem;
  }
  
  .control-section h3 {
    margin: 0 0 1rem 0;
    color: #333;
    font-size: 1.3rem;
  }
  
  /* Style Selector */
  .style-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
  }
  
  .style-button {
    background: white;
    border: 2px solid #e0e0e0;
    border-radius: 12px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }
  
  .style-button:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(102, 126, 234, 0.2);
  }
  
  .style-button.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-color: #667eea;
    color: white;
  }
  
  .style-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .style-name {
    font-size: 0.85rem;
    font-weight: 600;
  }
  
  .kid-friendly-badge {
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 1rem;
  }
  
  /* Options Grid */
  .options-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }
  
  .option-selector {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .option-label {
    font-weight: 600;
    color: #555;
    font-size: 0.9rem;
  }
  
  .option-dropdown {
    padding: 0.75rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .option-dropdown:hover,
  .option-dropdown:focus {
    border-color: #667eea;
    outline: none;
  }
  
  /* Color Options */
  .color-options {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
    gap: 0.5rem;
  }
  
  .color-button {
    width: 40px;
    height: 40px;
    border: 3px solid #e0e0e0;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .color-button:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
  
  .color-button.selected {
    border-color: #667eea;
    border-width: 4px;
    transform: scale(1.15);
  }
  
  .check-mark {
    color: white;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
    font-size: 1.2rem;
    font-weight: bold;
  }
  
  /* Footer */
  .editor-footer {
    background: #f5f7fa;
    padding: 1.5rem;
    border-top: 1px solid #e0e0e0;
  }
  
  .info-box {
    text-align: center;
  }
  
  .info-box p {
    margin: 0 0 0.5rem 0;
    color: #333;
  }
  
  .info-box small {
    color: #666;
    font-size: 0.85rem;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default AvatarEditorPage;