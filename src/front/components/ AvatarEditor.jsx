// src/front/pages/AvatarEditor.jsx - DEBUG VERSION
import React, { useState, useEffect } from 'react';
import { useAvatar } from '../Contexts/AvatarContext';
import AvatarDisplay from '../components/AvatarDisplay';
import ColorPalette from '../components/ColorPalette';
import StyleSelector from '../components/StyleSelector';
import ItemSelector from '../components/ItemSelector';
import { getItemsForLevel, generateThemeConfig, createDefaultAvatarConfig, getStyleOptions } from '../utils/avatarUtils';
import { FITNESS_THEMES } from '../utils/dicebearConfig';

const AvatarEditor = () => {
  const { currentAvatar, updateAvatar, saveAvatar, inventory, userStats } = useAvatar();

  // Debug: Log what we're getting from context
  useEffect(() => {
    console.log('=== AVATAR EDITOR DEBUG ===');
    console.log('currentAvatar:', currentAvatar);
    console.log('inventory:', inventory);
    console.log('userStats:', userStats);
  }, [currentAvatar, inventory, userStats]);

  const getInitialAvatar = () => {
    if (currentAvatar && currentAvatar.style) {
      return { ...currentAvatar };
    }

    console.log('🎨 Creating default avatar configuration');
    const userId = userStats?.userId || 'user';
    const defaultAvatar = createDefaultAvatarConfig('avataaars', `${userId}-${Date.now()}`);

    if (defaultAvatar) {
      return defaultAvatar;
    }

    // Ultimate fallback with valid structure
    return {
      style: 'avataaars',
      seed: `${userId}-${Date.now()}`,
      hair: 'short',
      clothing: 'hoodie',
      accessories: [],
      hairColor: 'brown',
      clothingColor: 'blue',
      skinColor: 'light',
      _updateTimestamp: Date.now()
    };
  };

  const [previewAvatar, setPreviewAvatar] = useState(getInitialAvatar());
  const [activeTab, setActiveTab] = useState('style');
  const [avatarName, setAvatarName] = useState('');
  const [runnerAvatar, setRunnerAvatar] = useState('');

  useEffect(() => {
    if (currentAvatar && currentAvatar.style) {
      console.log('🔄 Updating preview from currentAvatar:', currentAvatar);
      setPreviewAvatar({ ...currentAvatar, _updateTimestamp: Date.now() });
    }
  }, [currentAvatar]);

  useEffect(() => {
    console.log('🎨 Current preview avatar:', previewAvatar);

    if (!previewAvatar.style) {
      console.warn('⚠️ Preview avatar missing style, initializing...');
      const defaultAvatar = getInitialAvatar();
      setPreviewAvatar(defaultAvatar);
    }
  }, []);

  const handleAvatarChange = (changes) => {
    console.log('🎨 handleAvatarChange called with:', changes);

    setPreviewAvatar(prev => {
      const newAvatar = {
        ...prev,
        ...changes,
        _updateTimestamp: Date.now()
      };

      console.log('✅ New preview avatar:', newAvatar);
      return newAvatar;
    });
  };

  const handleStyleChange = (newStyle) => {
    console.log('✨ Style change requested:', newStyle);

    const userId = previewAvatar?.seed?.split('-')[0] || userStats?.userId || 'user';
    const newConfig = createDefaultAvatarConfig(newStyle, `${userId}-${Date.now()}`);

    if (newConfig) {
      console.log('✅ Created new style config:', newConfig);
      setPreviewAvatar({
        ...newConfig,
        _updateTimestamp: Date.now()
      });
    } else {
      console.error('❌ Failed to create default config for style:', newStyle);
      handleAvatarChange({ style: newStyle });
    }
  };

  const handleSave = () => {
    if (avatarName.trim()) {
      console.log('💾 Saving avatar:', avatarName, previewAvatar);
      saveAvatar(avatarName, previewAvatar);
      updateAvatar(previewAvatar);
      setAvatarName('');
      alert('Avatar saved! 🎉');
    } else {
      alert('Please give your avatar a name!');
    }
  };

  const handleSetAsCurrent = () => {
    console.log('✅ Setting as current avatar:', previewAvatar);
    updateAvatar(previewAvatar);
    alert('Avatar updated! 👍');
  };

  const handleReset = () => {
    console.log('🔄 Resetting to current avatar or default');
    const resetAvatar = currentAvatar && currentAvatar.style
      ? { ...currentAvatar, _updateTimestamp: Date.now() }
      : getInitialAvatar();
    setPreviewAvatar(resetAvatar);
  };

  // Get available items with fallback to style options
  const getAvailableItems = (category) => {
    console.log(`📋 Getting items for category: ${category}`);

    // First try inventory
    const inventoryItems = getItemsForLevel(userStats?.level || 1, inventory?.[category] || []);
    console.log(`  Inventory items:`, inventoryItems);

    if (inventoryItems && inventoryItems.length > 0) {
      return inventoryItems;
    }

    // Fallback to style options
    if (previewAvatar?.style) {
      const styleOptions = getStyleOptions(previewAvatar.style, category);
      console.log(`  Style options:`, styleOptions);
      return styleOptions || [];
    }

    // Ultimate fallback - some default options
    const defaults = {
      hair: ['short', 'long', 'wavy', 'curly', 'straight'],
      clothing: ['hoodie', 'shirt', 'dress', 'sweater'],
      accessories: ['none', 'glasses', 'hat', 'earrings'],
      colors: ['blue', 'red', 'green', 'brown', 'black', 'blonde']
    };

    console.log(`  Using default options:`, defaults[category]);
    return defaults[category] || [];
  };

  useEffect(() => {
    if (FITNESS_THEMES?.runner) {
      setRunnerAvatar(generateThemeConfig(FITNESS_THEMES.runner));
    }
  }, [userStats.level]);

  const tabs = [
    { id: 'style', label: '✨ Avatar Style' },
    { id: 'hair', label: '💇 Hair' },
    { id: 'clothing', label: '👕 Clothing' },
    { id: 'accessories', label: '👓 Accessories' },
    { id: 'colors', label: '🎨 Skin & Colors' },
    { id: 'features', label: '😊 Features' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem'
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white',
        marginBottom: '2rem'
      }}>
        <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0' }}>
          🎨 Avatar Art Studio
        </h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          Create and customize your perfect fitness character
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* LEFT PANEL - Preview */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            textAlign: 'center',
            margin: '0 0 1.5rem 0',
            fontSize: '1.5rem',
            color: '#2D3748'
          }}>
            Your Avatar Preview
          </h3>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <AvatarDisplay
              avatar={previewAvatar}
              size={200}
              showLevel={true}
              level={userStats?.level || 1}
              borderColor="#8B5CF6"
            />

            {previewAvatar.style && (
              <div style={{
                padding: '0.5rem 1rem',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: '600',
                color: '#8B5CF6',
                textAlign: 'center'
              }}>
                {previewAvatar.style}
                <br />
                <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
                  Popular cartoon-style avatars with lots of customization
                </span>
              </div>
            )}

            <input
              type="text"
              placeholder="Give your avatar a name..."
              value={avatarName}
              onChange={(e) => setAvatarName(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '2px solid #E5E7EB',
                fontSize: '1rem',
                outline: 'none'
              }}
            />

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              width: '100%'
            }}>
              <button onClick={handleSave} style={{
                background: 'linear-gradient(135deg, #10B981, #059669)',
                color: 'white',
                border: 'none',
                padding: '0.875rem',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '1rem'
              }}>
                💾 Save Avatar
              </button>

              <button onClick={handleSetAsCurrent} style={{
                background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                color: 'white',
                border: 'none',
                padding: '0.875rem',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '1rem'
              }}>
                ✅ Use This
              </button>

              <button onClick={() => {
                console.log('🎲 Randomizing avatar...');
                const randomConfig = getInitialAvatar();
                setPreviewAvatar(randomConfig);
              }} style={{
                background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                color: 'white',
                border: 'none',
                padding: '0.875rem',
                borderRadius: '10px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '1rem'
              }}>
                🎲 Randomize
              </button>

              <button onClick={handleReset} style={{
                background: '#6B7280',
                color: 'white',
                border: 'none',
                padding: '0.75rem',
                borderRadius: '10px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                🔄 Reset
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Customization */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{
            textAlign: 'center',
            margin: '0 0 1.5rem 0',
            fontSize: '1.5rem',
            color: '#2D3748'
          }}>
            Choose Avatar Style
          </h3>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  console.log('📑 Tab clicked:', tab.id);
                  setActiveTab(tab.id);
                }}
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeTab === tab.id
                    ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                    : '#F3F4F6',
                  color: activeTab === tab.id ? 'white' : '#6B7280',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ minHeight: '400px', padding: '1rem' }}>
            {activeTab === 'style' && (
              <StyleSelector
                currentStyle={previewAvatar.style}
                currentConfig={previewAvatar}
                onChange={handleStyleChange}
              />
            )}

            {activeTab === 'hair' && (
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#2D3748' }}>
                  💇 Choose Hair Style
                </h4>
                <ItemSelector
                  title="Hair Style"
                  category="hair"
                  currentValue={previewAvatar.hair}
                  availableItems={getAvailableItems('hair')}
                  currentAvatarConfig={previewAvatar}
                  onChange={(value) => {
                    console.log('💇 Hair selected:', value);
                    handleAvatarChange({ hair: value });
                  }}
                />
              </div>
            )}

            {activeTab === 'clothing' && (
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#2D3748' }}>
                  👕 Choose Clothing
                </h4>
                <ItemSelector
                  title="Clothing"
                  category="clothing"
                  currentValue={previewAvatar.clothing}
                  availableItems={getAvailableItems('clothing')}
                  currentAvatarConfig={previewAvatar}
                  onChange={(value) => {
                    console.log('👕 Clothing selected:', value);
                    handleAvatarChange({ clothing: value });
                  }}
                />
              </div>
            )}

            {activeTab === 'accessories' && (
              <div>
                <h4 style={{ marginBottom: '1rem', color: '#2D3748' }}>
                  👓 Choose Accessories
                </h4>
                <ItemSelector
                  title="Accessories"
                  category="accessories"
                  currentValue={previewAvatar.accessories?.[0]}
                  availableItems={getAvailableItems('accessories')}
                  currentAvatarConfig={previewAvatar}
                  onChange={(value) => {
                    console.log('👓 Accessory selected:', value);
                    handleAvatarChange({ accessories: [value] });
                  }}
                />
              </div>
            )}

            {activeTab === 'colors' && (
              <ColorPalette
                avatar={previewAvatar}
                availableColors={getAvailableItems('colors')}
                onChange={(changes) => {
                  console.log('🎨 Colors changed:', changes);
                  handleAvatarChange(changes);
                }}
              />
            )}

            {activeTab === 'features' && (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: '#6B7280'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>😊</div>
                <h4 style={{ marginBottom: '0.5rem' }}>Facial Features</h4>
                <p style={{ margin: 0, fontSize: '0.9rem' }}>
                  Coming soon! You'll be able to customize eyes, mouth, and more.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Debug Panel - Remove this in production */}
      <div style={{
        position: 'fixed',
        bottom: '1rem',
        right: '1rem',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '1rem',
        borderRadius: '8px',
        fontSize: '0.75rem',
        maxWidth: '300px',
        maxHeight: '200px',
        overflow: 'auto'
      }}>
        <strong>🐛 Debug Info:</strong>
        <div>Active Tab: {activeTab}</div>
        <div>Style: {previewAvatar.style}</div>
        <div>Hair: {previewAvatar.hair}</div>
        <div>Clothing: {previewAvatar.clothing}</div>
        <div>Has Inventory: {inventory ? 'Yes' : 'No'}</div>
        <div>Level: {userStats?.level || 1}</div>
      </div>
    </div>
  );
};

export default AvatarEditor;