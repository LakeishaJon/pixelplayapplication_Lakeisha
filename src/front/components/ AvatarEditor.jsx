// src/front/pages/AvatarEditor.jsx
import React, { useState, useEffect } from 'react';
import { useAvatar } from '../Contexts/AvatarContext';
import AvatarDisplay from '../components/AvatarDisplay';
import ColorPalette from '../components/ColorPalette';
import StyleSelector from '../components/StyleSelector';
import ItemSelector from '../components/ItemSelector';
import { getItemsForLevel, generateThemeConfig } from '../utils/avatarUtils';
import { FITNESS_THEMES } from '../utils/dicebearConfig';

const AvatarEditor = () => {
  const { currentAvatar, updateAvatar, saveAvatar, inventory, userStats } = useAvatar();
  const [previewAvatar, setPreviewAvatar] = useState({ ...currentAvatar });
  const [activeTab, setActiveTab] = useState('hair');
  const [avatarName, setAvatarName] = useState('');
  const [runnerAvatar, setRunnerAvatar] = useState('');

  // Update preview when changes happen
  const handleAvatarChange = (changes) => {
    setPreviewAvatar({ ...previewAvatar, ...changes });
  };

  const handleSave = () => {
    if (avatarName.trim()) {
      saveAvatar(avatarName, previewAvatar);
      updateAvatar(previewAvatar);
      setAvatarName('');
      alert('Avatar saved! 🎉');
    } else {
      alert('Please give your avatar a name!');
    }
  };

  const handleSetAsCurrent = () => {
    updateAvatar(previewAvatar);
    alert('Avatar updated! 👍');
  };

  const handleReset = () => {
    setPreviewAvatar({ ...currentAvatar });
  };

  // Generate runner-themed avatar for theme tab
  useEffect(() => {
    setRunnerAvatar(generateThemeConfig(FITNESS_THEMES.runner));
  }, [userStats.level, previewAvatar]);

  const tabs = [
    { id: 'hair', label: '💇 Hair' },
    { id: 'clothing', label: '👕 Clothes' },
    { id: 'accessories', label: '👓 Accessories' },
    { id: 'colors', label: '🎨 Colors' },
    { id: 'style', label: '✨ Style' },
    { id: 'theme', label: '🏃 Theme' },
  ];

  return (
    <div className="avatar-editor-page">
      <h2>🎨 Avatar Art Studio</h2>

      <div className="editor-grid">
        {/* Left - Preview and Save */}
        <div className="preview-panel">
          <AvatarDisplay avatar={previewAvatar} size={150} showLevel={true} level={userStats.level} />
          <input
            type="text"
            placeholder="Give your avatar a name..."
            value={avatarName}
            onChange={(e) => setAvatarName(e.target.value)}
          />
          <div className="editor-buttons">
            <button onClick={handleSave}>💾 Save Avatar</button>
            <button onClick={handleSetAsCurrent}>✅ Use This</button>
            <button onClick={handleReset}>🔄 Reset</button>
          </div>
        </div>

        {/* Right - Customization Tabs */}
        <div className="customization-panel">
          <div className="tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={activeTab === tab.id ? 'active-tab' : ''}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="tab-content">
            {activeTab === 'hair' && (
              <ItemSelector
                title="Choose Hair Style"
                category="hair"
                currentValue={previewAvatar.hair}
                availableItems={getItemsForLevel(userStats.level, inventory.hair)}
                onChange={(value) => handleAvatarChange({ hair: value })}
              />
            )}
            {activeTab === 'clothing' && (
              <ItemSelector
                title="Choose Clothing"
                category="clothing"
                currentValue={previewAvatar.clothing}
                availableItems={getItemsForLevel(userStats.level, inventory.clothing)}
                onChange={(value) => handleAvatarChange({ clothing: value })}
              />
            )}
            {activeTab === 'accessories' && (
              <ItemSelector
                title="Choose Accessories"
                category="accessories"
                currentValue={previewAvatar.accessories}
                availableItems={getItemsForLevel(userStats.level, inventory.accessories)}
                onChange={(value) => handleAvatarChange({ accessories: [value] })}
              />
            )}
            {activeTab === 'colors' && (
              <ColorPalette
                avatar={previewAvatar}
                availableColors={getItemsForLevel(userStats.level, inventory.colors)}
                onChange={handleAvatarChange}
              />
            )}
            {activeTab === 'style' && (
              <StyleSelector
                currentStyle={previewAvatar.style}
                onChange={(style) => handleAvatarChange({ style })}
              />
            )}
            {activeTab === 'theme' && runnerAvatar && (
              <div className="theme-preview">
                <h3>Runner Theme Avatar</h3>
                <img src={runnerAvatar} alt="Runner Avatar" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarEditor;
