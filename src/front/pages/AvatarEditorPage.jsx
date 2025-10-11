import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAvatar } from "../Contexts/AvatarContext";
import AvatarDisplay from "../components/AvatarDisplay";
import StyleSelector from "../components/StyleSelector";
import ItemSelector from "../components/ItemSelector";
import {
  createDefaultAvatarConfig,
  updateAvatarOption,
  AVATAR_STYLES,
  validateAvatarConfig,
  getStyleOptions
} from "../utils/avatarUtils.jsx";
import "../styles/AvatarEditorPage.css";

const AvatarEditorPage = () => {
  const navigate = useNavigate();
  const { currentAvatar, updateAvatar, saveAvatar, userStats } = useAvatar();

  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState("style");
  const [avatarName, setAvatarName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Initialize preview avatar
  useEffect(() => {
    console.log('🎨 Initializing avatar editor');

    try {
      let initialAvatar;

      if (currentAvatar && validateAvatarConfig(currentAvatar)) {
        initialAvatar = { ...currentAvatar };
        console.log('✅ Using current avatar:', initialAvatar);
      } else {
        const userId = userStats?.id || 'default';
        initialAvatar = createDefaultAvatarConfig('avataaars', `user-${userId}`);
        console.log('✅ Created default avatar:', initialAvatar);
      }

      if (initialAvatar) {
        setPreviewAvatar(initialAvatar);
      }
    } catch (error) {
      console.error('❌ Error initializing avatar:', error);
      setPreviewAvatar({
        style: 'avataaars',
        seed: 'fallback',
        options: { backgroundColor: ['b6e3f4'] }
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentAvatar, userStats]);

  // ✅ Handle avatar style changes (receives style name string)
  const handleStyleChange = (newStyleName) => {
    console.log('🎨 Style change requested:', newStyleName);

    if (!newStyleName || typeof newStyleName !== 'string') {
      console.warn('⚠️ Invalid style name:', newStyleName);
      return;
    }

    try {
      const userId = userStats?.id || 'default';
      const newConfig = createDefaultAvatarConfig(newStyleName, `user-${userId}-${Date.now()}`);

      if (newConfig && validateAvatarConfig(newConfig)) {
        console.log('✅ Created new style config:', newConfig);
        setPreviewAvatar(newConfig);
      } else {
        console.error('❌ Failed to create valid config for style:', newStyleName);
      }
    } catch (error) {
      console.error('❌ Error changing style:', error);
    }
  };

  // ✅ Handle option changes (receives category and value)
  const handleOptionChange = (category) => (value) => {
    console.group(`🎯 Option Change: ${category}`);
    console.log('Value received:', value);
    console.log('Current preview avatar:', previewAvatar);

    if (!previewAvatar) {
      console.error('❌ No preview avatar available');
      console.groupEnd();
      return;
    }

    if (!category || value === undefined) {
      console.error('❌ Invalid category or value');
      console.groupEnd();
      return;
    }

    try {
      // Use the updateAvatarOption utility
      const updatedConfig = updateAvatarOption(previewAvatar, category, value);

      console.log('📦 Updated config:', updatedConfig);

      if (validateAvatarConfig(updatedConfig)) {
        console.log('✅ Valid config, updating preview');
        setPreviewAvatar(updatedConfig);
        console.log('✅ Preview avatar updated successfully');
      } else {
        console.error('❌ Invalid config after update');
      }
    } catch (error) {
      console.error('❌ Error updating option:', error);
    }

    console.groupEnd();
  };

  // Save avatar
  const handleSave = () => {
    if (!avatarName.trim()) {
      alert("Please give your avatar a name!");
      return;
    }

    if (!previewAvatar || !validateAvatarConfig(previewAvatar)) {
      alert("Invalid avatar configuration!");
      return;
    }

    try {
      saveAvatar(avatarName, previewAvatar);
      updateAvatar(previewAvatar);
      setAvatarName("");
      alert("✅ Avatar saved successfully! 🎉");
    } catch (error) {
      console.error('Error saving avatar:', error);
      alert("Error saving avatar. Please try again.");
    }
  };

  // Set as current avatar
  const handleSetAsCurrent = () => {
    if (!previewAvatar || !validateAvatarConfig(previewAvatar)) {
      alert("Invalid avatar configuration!");
      return;
    }

    try {
      updateAvatar(previewAvatar);
      alert("✅ Avatar updated! 🎨");
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert("Error updating avatar.");
    }
  };

  // Reset
  const handleReset = () => {
    try {
      if (currentAvatar && validateAvatarConfig(currentAvatar)) {
        setPreviewAvatar({ ...currentAvatar });
      } else {
        const userId = userStats?.id || 'default';
        const defaultConfig = createDefaultAvatarConfig('avataaars', `user-${userId}`);
        setPreviewAvatar(defaultConfig);
      }
      console.log('🔄 Avatar reset');
    } catch (error) {
      console.error('Error resetting avatar:', error);
    }
  };

  // Randomize
  const handleRandomize = () => {
    if (!previewAvatar?.style) return;

    try {
      const style = AVATAR_STYLES[previewAvatar.style];
      if (!style?.customOptions) return;

      const randomOptions = {};
      Object.keys(style.customOptions).forEach(category => {
        const options = style.customOptions[category];
        if (options?.length > 0) {
          const randomOption = options[Math.floor(Math.random() * options.length)];
          randomOptions[category] = [randomOption];
        }
      });

      const randomConfig = {
        ...previewAvatar,
        seed: Math.random().toString(36).substring(7),
        options: randomOptions
      };

      console.log('🎲 Randomized config:', randomConfig);
      setPreviewAvatar(randomConfig);
    } catch (error) {
      console.error('Error randomizing:', error);
    }
  };

  // Navigation
  const handleNavigateToDashboard = () => navigate("/dashboard");
  const handleNavigateToInventory = () => navigate("/inventory");
  const handleNavigateToHome = () => navigate("/");

  // Tabs
  const tabs = [
    { id: "style", label: "Avatar Style", icon: "🎨" },
    { id: "hair", label: "Hair", icon: "💇" },
    { id: "skin", label: "Skin & Colors", icon: "🌈" },
    { id: "clothing", label: "Clothing", icon: "👕" },
    { id: "accessories", label: "Accessories", icon: "👓" },
    { id: "features", label: "Features", icon: "😊" },
  ];

  const currentStyleInfo = previewAvatar?.style ? AVATAR_STYLES[previewAvatar.style] : null;

  const hasStyleOptions = (category) => {
    if (!previewAvatar?.style) return false;
    const options = getStyleOptions(previewAvatar.style, category);
    return options && options.length > 0;
  };

  // Loading
  if (isLoading) {
    return (
      <div className="avatar-editor-page">
        <div className="editor-header">
          <div className="header-content">
            <div className="header-left">
              <div className="cube-icon">🎨</div>
              <div className="header-text">
                <h1>Avatar Art Studio</h1>
                <p>Loading...</p>
              </div>
            </div>
          </div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          fontSize: '1.2rem'
        }}>
          🎭 Loading Avatar Editor...
        </div>
      </div>
    );
  }

  return (
    <div className="avatar-editor-page">
      {/* Header */}
      <div className="editor-header">
        <div className="header-content">
          <div className="header-left">
            <div className="cube-icon">🎨</div>
            <div className="header-text">
              <h1>Avatar Art Studio</h1>
              <p>Create and customize your perfect fitness character</p>
            </div>
          </div>
          <div className="header-right">
            <div className="level-display">
              <div className="level-text">Level {userStats?.level || 1}</div>
              <div className="xp-text">⭐ {userStats?.points || 0} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="editor-content">

        {/* LEFT - Preview */}
        <div className="preview-section">
          <div className="preview-card">
            <h2>Your Avatar Preview</h2>

            {previewAvatar ? (
              <div className="avatar-display-container">
                <AvatarDisplay
                  config={previewAvatar}
                  size={180}
                  showLevel={true}
                  level={userStats?.level || 1}
                  showBorder={true}
                  borderColor="#8B5CF6"
                />
              </div>
            ) : (
              <div className="avatar-loading">
                <div className="loading-placeholder">
                  <span>🎭</span>
                  <p>Loading avatar...</p>
                </div>
              </div>
            )}

            {currentStyleInfo && (
              <div className="current-style-info">
                <h4>{currentStyleInfo.name}</h4>
                <p>{currentStyleInfo.description}</p>
                {currentStyleInfo.kidFriendly && (
                  <span className="kid-friendly-badge">👶 Kid Friendly</span>
                )}
              </div>
            )}

            <div className="save-controls">
              <input
                type="text"
                placeholder="Give your avatar a name..."
                value={avatarName}
                onChange={(e) => setAvatarName(e.target.value)}
                className="avatar-name-input"
                maxLength={50}
              />

              <div className="control-buttons">
                <button onClick={handleSave} className="control-button save-button" disabled={!previewAvatar}>
                  💾 Save Avatar
                </button>
                <button onClick={handleSetAsCurrent} className="control-button use-button" disabled={!previewAvatar}>
                  ✅ Use This
                </button>
                <button onClick={handleRandomize} className="control-button randomize-button" disabled={!previewAvatar?.style}>
                  🎲 Randomize
                </button>
                <button onClick={handleReset} className="control-button reset-button">
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT - Customization */}
        <div className="customization-section">
          <div className="customization-card">
            <h2>Choose Avatar Style</h2>

            {/* Tabs */}
            <div className="editor-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`editor-tab ${activeTab === tab.id ? "active" : ""}`}
                >
                  <span className="tab-icon">{tab.icon}</span>
                  <span className="tab-label">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="tab-content">

              {/* Style Tab */}
              {activeTab === "style" && (
                <div className="tab-panel">
                  <h3>Avatar Style</h3>
                  <p>Choose your avatar's overall style</p>
                  {previewAvatar ? (
                    <StyleSelector
                      currentStyle={previewAvatar.style}
                      currentConfig={previewAvatar}
                      onChange={handleStyleChange}
                    />
                  ) : (
                    <div>Loading styles...</div>
                  )}
                </div>
              )}

              {/* Hair Tab */}
              {activeTab === "hair" && previewAvatar && (
                <div className="tab-panel">
                  <h3>Hair & Hair Color</h3>
                  <p>Style your avatar's hair</p>

                  {hasStyleOptions('hair') && (
                    <div style={{ marginBottom: '2rem' }}>
                      <ItemSelector
                        title="Hair Style"
                        category="hair"
                        currentValue={previewAvatar.options?.hair?.[0]}
                        currentAvatarConfig={previewAvatar}
                        onChange={handleOptionChange('hair')}
                      />
                    </div>
                  )}

                  {hasStyleOptions('top') && (
                    <div style={{ marginBottom: '2rem' }}>
                      <ItemSelector
                        title="Hair Style"
                        category="top"
                        currentValue={previewAvatar.options?.top?.[0]}
                        currentAvatarConfig={previewAvatar}
                        onChange={handleOptionChange('top')}
                      />
                    </div>
                  )}

                  {hasStyleOptions('hairColor') && (
                    <div style={{ marginBottom: '2rem' }}>
                      <ItemSelector
                        title="Hair Color"
                        category="hairColor"
                        currentValue={previewAvatar.options?.hairColor?.[0]}
                        currentAvatarConfig={previewAvatar}
                        onChange={handleOptionChange('hairColor')}
                      />
                    </div>
                  )}

                  {!hasStyleOptions('hair') && !hasStyleOptions('hairColor') && !hasStyleOptions('top') && (
                    <div className="no-options-message">
                      <p>No hair options for this style.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Skin & Colors Tab */}
              {activeTab === "skin" && previewAvatar && (
                <div className="tab-panel">
                  <h3>Skin & Background Colors</h3>
                  <p>Customize colors and skin tone</p>

                  {hasStyleOptions('skin') && (
                    <div style={{ marginBottom: '2rem' }}>
                      <ItemSelector
                        title="Skin Tone"
                        category="skin"
                        currentValue={previewAvatar.options?.skin?.[0]}
                        currentAvatarConfig={previewAvatar}
                        onChange={handleOptionChange('skin')}
                      />
                    </div>
                  )}

                  {hasStyleOptions('skinTone') && (
                    <div style={{ marginBottom: '2rem' }}>
                      <ItemSelector
                        title="Skin Tone"
                        category="skinTone"
                        currentValue={previewAvatar.options?.skinTone?.[0]}
                        currentAvatarConfig={previewAvatar}
                        onChange={handleOptionChange('skinTone')}
                      />
                    </div>
                  )}

                  {hasStyleOptions('backgroundColor') && (
                    <div style={{ marginBottom: '2rem' }}>
                      <ItemSelector
                        title="Background Color"
                        category="backgroundColor"
                        currentValue={previewAvatar.options?.backgroundColor?.[0]}
                        currentAvatarConfig={previewAvatar}
                        onChange={handleOptionChange('backgroundColor')}
                      />
                    </div>
                  )}

                  {!hasStyleOptions('skin') && !hasStyleOptions('skinTone') && !hasStyleOptions('backgroundColor') && (
                    <div className="no-options-message">
                      <p>No skin/color options for this style.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Clothing Tab */}
              {activeTab === "clothing" && previewAvatar && (
                <div className="tab-panel">
                  <h3>Clothing & Style</h3>
                  <p>Dress up your avatar</p>

                  {hasStyleOptions('shirt') && (
                    <div style={{ marginBottom: '2rem' }}>
                      <ItemSelector
                        title="Shirt Style"
                        category="shirt"
                        currentValue={previewAvatar.options?.shirt?.[0]}
                        currentAvatarConfig={previewAvatar}
                        onChange={handleOptionChange('shirt')}
                      />
                    </div>
                  )}

                  {hasStyleOptions('shirtColor') && (
                    <div style={{ marginBottom: '2rem' }}>
                      <ItemSelector
                        title="Shirt Color"
                        category="shirtColor"
                        currentValue={previewAvatar.options?.shirtColor?.[0]}
                        currentAvatarConfig={previewAvatar}
                        onChange={handleOptionChange('shirtColor')}
                      />
                    </div>
                  )}

                  {hasStyleOptions('clothes') && (
                    <div style={{ marginBottom: '2rem' }}>
                      <ItemSelector
                        title="Clothing"
                        category="clothes"
                        currentValue={previewAvatar.options?.clothes?.[0]}
                        currentAvatarConfig={previewAvatar}
                        onChange={handleOptionChange('clothes')}
                      />
                    </div>
                  )}

                  {hasStyleOptions('clotheColor') && (
                    <div style={{ marginBottom: '2rem' }}>
                      <ItemSelector
                        title="Clothing Color"
                        category="clotheColor"
                        currentValue={previewAvatar.options?.clotheColor?.[0]}
                        currentAvatarConfig={previewAvatar}
                        onChange={handleOptionChange('clotheColor')}
                      />
                    </div>
                  )}

                  {!hasStyleOptions('shirt') && !hasStyleOptions('shirtColor') && !hasStyleOptions('clothes') && !hasStyleOptions('clotheColor') && (
                    <div className="no-options-message">
                      <p>No clothing options for this style.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Accessories Tab */}
              {activeTab === "accessories" && previewAvatar && (
                <div className="tab-panel">
                  <h3>Accessories & Extras</h3>
                  <p>Add personality to your avatar</p>

                  {hasStyleOptions('accessories') && (
                    <div style={{ marginBottom: '2rem' }}>
                      <ItemSelector
                        title="Accessories"
                        category="accessories"
                        currentValue={previewAvatar.options?.accessories?.[0]}
                        currentAvatarConfig={previewAvatar}
                        onChange={handleOptionChange('accessories')}
                      />
                    </div>
                  )}

                  {hasStyleOptions('facialHair') && (
                    <div style={{ marginBottom: '2rem' }}>
                      <ItemSelector
                        title="Facial Hair"
                        category="facialHair"
                        currentValue={previewAvatar.options?.facialHair?.[0]}
                        currentAvatarConfig={previewAvatar}
                        onChange={handleOptionChange('facialHair')}
                      />
                    </div>
                  )}

                  {!hasStyleOptions('accessories') && !hasStyleOptions('facialHair') && (
                    <div className="no-options-message">
                      <p>No accessory options for this style.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Features Tab */}
              {activeTab === "features" && previewAvatar && (
                <div className="tab-panel">
                  <h3>Facial Features</h3>
                  <p>Customize expressions</p>

                  {hasStyleOptions('eyes') && (
                    <div style={{ marginBottom: '2rem' }}>
                      <ItemSelector
                        title="Eyes"
                        category="eyes"
                        currentValue={previewAvatar.options?.eyes?.[0]}
                        currentAvatarConfig={previewAvatar}
                        onChange={handleOptionChange('eyes')}
                      />
                    </div>
                  )}

                  {hasStyleOptions('eyebrows') && (
                    <div style={{ marginBottom: '2rem' }}>
                      <ItemSelector
                        title="Eyebrows"
                        category="eyebrows"
                        currentValue={previewAvatar.options?.eyebrows?.[0]}
                        currentAvatarConfig={previewAvatar}
                        onChange={handleOptionChange('eyebrows')}
                      />
                    </div>
                  )}

                  {hasStyleOptions('mouth') && (
                    <div style={{ marginBottom: '2rem' }}>
                      <ItemSelector
                        title="Mouth"
                        category="mouth"
                        currentValue={previewAvatar.options?.mouth?.[0]}
                        currentAvatarConfig={previewAvatar}
                        onChange={handleOptionChange('mouth')}
                      />
                    </div>
                  )}

                  {!hasStyleOptions('eyes') && !hasStyleOptions('eyebrows') && !hasStyleOptions('mouth') && (
                    <div className="no-options-message">
                      <p>No feature options for this style.</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="editor-navigation">
        <div className="nav-buttons">
          <button onClick={handleNavigateToDashboard} className="nav-btn secondary">
            📊 Back to Dashboard
          </button>
          <button onClick={handleNavigateToInventory} className="nav-btn primary">
            📦 View Collection
          </button>
          <button onClick={handleNavigateToHome} className="nav-btn tertiary">
            🏡 Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarEditorPage;