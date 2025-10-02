import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAvatar } from "../Contexts/AvatarContext";
import AvatarDisplay from "../components/AvatarDisplay";
import StyleSelector from "../components/StyleSelector";
import ItemSelector from "../components/ItemSelector";
import {
  createDefaultAvatarConfig,
  AVATAR_STYLES,
  validateAvatarConfig,
  getStyleOptions
} from "../utils/avatarUtils.jsx";
import "../styles/AvatarEditorPage.css";

const AvatarEditorPage = () => {
  const navigate = useNavigate();
  const { currentAvatar, updateAvatar, saveAvatar, userStats } = useAvatar();

  // State management
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [activeTab, setActiveTab] = useState("style"); // Start with style tab like Image 1
  const [avatarName, setAvatarName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Initialize preview avatar
  useEffect(() => {
    console.log('Initializing avatar editor with:', { currentAvatar, userStats });

    try {
      let initialAvatar;

      if (currentAvatar && validateAvatarConfig(currentAvatar)) {
        initialAvatar = { ...currentAvatar };
        console.log('Using current avatar:', initialAvatar);
      } else {
        // Create default avatar
        const userId = userStats?.id || 'default';
        initialAvatar = createDefaultAvatarConfig('avataaars', `user-${userId}`);
        console.log('Created default avatar:', initialAvatar);
      }

      if (initialAvatar) {
        setPreviewAvatar(initialAvatar);
      }
    } catch (error) {
      console.error('Error initializing avatar:', error);
      // Fallback to basic config
      setPreviewAvatar({
        style: 'avataaars',
        seed: 'fallback',
        options: { backgroundColor: ['b6e3f4'] }
      });
    } finally {
      setIsLoading(false);
    }
  }, [currentAvatar, userStats]);

  // Handle avatar configuration changes
  const handleAvatarChange = (newAvatarConfig) => {
    console.log('Avatar change requested:', newAvatarConfig);

    if (!newAvatarConfig) {
      console.warn('Received null avatar config');
      return;
    }

    if (validateAvatarConfig(newAvatarConfig)) {
      console.log('Valid config, updating preview avatar');
      setPreviewAvatar({ ...newAvatarConfig });
    } else {
      console.warn('Invalid avatar configuration:', newAvatarConfig);
    }
  };

  // Save avatar with validation
  const handleSave = () => {
    if (!avatarName.trim()) {
      alert("Please give your avatar a name!");
      return;
    }

    if (!previewAvatar || !validateAvatarConfig(previewAvatar)) {
      alert("Invalid avatar configuration! Please try selecting a different style.");
      return;
    }

    try {
      saveAvatar(avatarName, previewAvatar);
      updateAvatar(previewAvatar);
      setAvatarName("");
      alert("Avatar saved successfully!");
    } catch (error) {
      console.error('Error saving avatar:', error);
      alert("Error saving avatar. Please try again.");
    }
  };

  // Set as current avatar
  const handleSetAsCurrent = () => {
    if (!previewAvatar || !validateAvatarConfig(previewAvatar)) {
      alert("Invalid avatar configuration! Please try selecting a different style.");
      return;
    }

    try {
      updateAvatar(previewAvatar);
      alert("Avatar updated successfully!");
    } catch (error) {
      console.error('Error updating avatar:', error);
      alert("Error updating avatar. Please try again.");
    }
  };

  // Reset to original
  const handleReset = () => {
    try {
      if (currentAvatar && validateAvatarConfig(currentAvatar)) {
        setPreviewAvatar({ ...currentAvatar });
      } else {
        const userId = userStats?.id || 'default';
        const defaultConfig = createDefaultAvatarConfig('avataaars', `user-${userId}`);
        setPreviewAvatar(defaultConfig);
      }
      console.log('Avatar reset successfully');
    } catch (error) {
      console.error('Error resetting avatar:', error);
    }
  };

  // Randomize current style options
  const handleRandomize = () => {
    if (!previewAvatar?.style) {
      console.warn('No preview avatar style available for randomization');
      return;
    }

    try {
      const style = AVATAR_STYLES[previewAvatar.style];
      if (!style || !style.customOptions) {
        console.warn('No customization options available for style:', previewAvatar.style);
        return;
      }

      const randomOptions = {};

      // Randomize each customization option
      Object.keys(style.customOptions).forEach(category => {
        const options = style.customOptions[category];
        if (options && options.length > 0) {
          const randomOption = options[Math.floor(Math.random() * options.length)];
          randomOptions[category] = [randomOption];
        }
      });

      const randomConfig = {
        ...previewAvatar,
        seed: Math.random().toString(36).substring(7),
        options: randomOptions
      };

      console.log('Generated random config:', randomConfig);
      setPreviewAvatar(randomConfig);
    } catch (error) {
      console.error('Error randomizing avatar:', error);
    }
  };

  // Navigation handlers
  const handleNavigateToDashboard = () => navigate("/dashboard");
  const handleNavigateToInventory = () => navigate("/inventory");
  const handleNavigateToHome = () => navigate("/");

  // Tab configuration - ORDER LIKE IMAGE 1
  const tabs = [
    { id: "style", label: "Avatar Style", icon: "🎨" },
    { id: "hair", label: "Hair", icon: "💇" },
    { id: "skin", label: "Skin & Colors", icon: "🌈" },
    { id: "clothing", label: "Clothing", icon: "👕" },
    { id: "accessories", label: "Accessories", icon: "👓" },
    { id: "features", label: "Features", icon: "😊" },
  ];

  // Get current style info for display
  const currentStyleInfo = previewAvatar?.style ? AVATAR_STYLES[previewAvatar.style] : null;

  // Helper function to check if a category has options
  const hasStyleOptions = (category) => {
    if (!previewAvatar?.style) return false;
    const options = getStyleOptions(previewAvatar.style, category);
    return options && options.length > 0;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="avatar-editor-page">
        <div className="editor-header">
          <div className="header-content">
            <div className="header-left">
              <div className="cube-icon">🎨</div>
              <div className="header-text">
                <h1>Avatar Art Studio</h1>
                <p>Loading your avatar editor...</p>
              </div>
            </div>
          </div>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '400px',
          color: 'white',
          fontSize: '1.2rem'
        }}>
          <div>🎭 Loading Avatar Editor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="avatar-editor-page">
      {/* Header - Like Image 1 */}
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

      {/* Main Content - Two Panel Layout Like Image 1 */}
      <div className="editor-content">

        {/* LEFT PANEL - Avatar Preview (Like Image 1) */}
        <div className="preview-section">
          <div className="preview-card">
            <h2>Your Avatar Preview</h2>

            {/* Avatar Display - Circular with border like Image 1 */}
            {previewAvatar ? (
              <div className="avatar-display-container">
                <AvatarDisplay
                  avatar={previewAvatar}
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

            {/* Current Style Info */}
            {currentStyleInfo && (
              <div className="current-style-info">
                <h4>{currentStyleInfo.name}</h4>
                <p>{currentStyleInfo.description}</p>
                {currentStyleInfo.kidFriendly && (
                  <span className="kid-friendly-badge">👶 Kid Friendly</span>
                )}
              </div>
            )}

            {/* Save Controls - Exactly like Image 1 */}
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
                <button
                  onClick={handleSave}
                  className="control-button save-button"
                  disabled={!previewAvatar}
                >
                  💾 Save Avatar
                </button>
                <button
                  onClick={handleSetAsCurrent}
                  className="control-button use-button"
                  disabled={!previewAvatar}
                >
                  ✅ Use This
                </button>
                <button
                  onClick={handleRandomize}
                  className="control-button randomize-button"
                  disabled={!previewAvatar?.style}
                >
                  🎲 Randomize
                </button>
                <button
                  onClick={handleReset}
                  className="control-button reset-button"
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Customization (Like Image 1) */}
        <div className="customization-section">
          <div className="customization-card">
            <h2>Choose Avatar Style</h2>

            {/* Horizontal Tabs - Like Image 1 */}
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

            {/* Tab Content - COMPACT BUTTONS ONLY */}
            <div className="tab-content">

              {/* Style Selection Tab - Compact Buttons */}
              {activeTab === "style" && (
                <div className="tab-panel">
                  <h3>Avatar Style</h3>
                  <p>Choose your avatar's overall style</p>
                  {previewAvatar ? (
                    <StyleSelector
                      currentStyle={previewAvatar.style}
                      currentConfig={previewAvatar}
                      onChange={handleAvatarChange}
                    />
                  ) : (
                    <div>Loading styles...</div>
                  )}
                </div>
              )}

              {/* Hair Customization Tab - Compact Buttons */}
              {activeTab === "hair" && previewAvatar && (
                <div className="tab-panel">
                  <h3>Hair & Hair Color</h3>
                  <p>Style your avatar's hair</p>

                  {/* Hair Style */}
                  {hasStyleOptions('hair') && (
                    <ItemSelector
                      title="Hair Style"
                      category="hair"
                      currentValue={previewAvatar.options?.hair?.[0]}
                      currentAvatarConfig={previewAvatar}
                      onChange={handleAvatarChange}
                    />
                  )}

                  {/* Hair Color */}
                  {hasStyleOptions('hairColor') && (
                    <ItemSelector
                      title="Hair Color"
                      category="hairColor"
                      currentValue={previewAvatar.options?.hairColor?.[0]}
                      currentAvatarConfig={previewAvatar}
                      onChange={handleAvatarChange}
                    />
                  )}

                  {/* Alternative hair option names */}
                  {hasStyleOptions('top') && (
                    <ItemSelector
                      title="Hair Style"
                      category="top"
                      currentValue={previewAvatar.options?.top?.[0]}
                      currentAvatarConfig={previewAvatar}
                      onChange={handleAvatarChange}
                    />
                  )}

                  {!hasStyleOptions('hair') && !hasStyleOptions('hairColor') && !hasStyleOptions('top') && (
                    <div className="no-options-message">
                      <p>No hair customization options available for this avatar style.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Skin & Colors Tab - Color Buttons */}
              {activeTab === "skin" && previewAvatar && (
                <div className="tab-panel">
                  <h3>Skin & Background Colors</h3>
                  <p>Customize colors and skin tone</p>

                  {/* Skin Color */}
                  {hasStyleOptions('skin') && (
                    <ItemSelector
                      title="Skin Tone"
                      category="skin"
                      currentValue={previewAvatar.options?.skin?.[0]}
                      currentAvatarConfig={previewAvatar}
                      onChange={handleAvatarChange}
                    />
                  )}

                  {/* Background Color */}
                  {hasStyleOptions('backgroundColor') && (
                    <ItemSelector
                      title="Background Color"
                      category="backgroundColor"
                      currentValue={previewAvatar.options?.backgroundColor?.[0]}
                      currentAvatarConfig={previewAvatar}
                      onChange={handleAvatarChange}
                    />
                  )}

                  {!hasStyleOptions('skin') && !hasStyleOptions('backgroundColor') && (
                    <div className="no-options-message">
                      <p>No skin or color customization options available for this avatar style.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Clothing Tab - Compact Buttons */}
              {activeTab === "clothing" && previewAvatar && (
                <div className="tab-panel">
                  <h3>Clothing & Style</h3>
                  <p>Dress up your avatar</p>

                  {/* Clothing Options */}
                  {hasStyleOptions('clothes') && (
                    <ItemSelector
                      title="Clothing"
                      category="clothes"
                      currentValue={previewAvatar.options?.clothes?.[0]}
                      currentAvatarConfig={previewAvatar}
                      onChange={handleAvatarChange}
                    />
                  )}

                  {/* Clothing Color */}
                  {hasStyleOptions('clotheColor') && (
                    <ItemSelector
                      title="Clothing Color"
                      category="clotheColor"
                      currentValue={previewAvatar.options?.clotheColor?.[0]}
                      currentAvatarConfig={previewAvatar}
                      onChange={handleAvatarChange}
                    />
                  )}

                  {!hasStyleOptions('clothes') && !hasStyleOptions('clotheColor') && (
                    <div className="no-options-message">
                      <p>No clothing customization options available for this avatar style.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Accessories Tab - Toggle Buttons */}
              {activeTab === "accessories" && previewAvatar && (
                <div className="tab-panel">
                  <h3>Accessories & Extras</h3>
                  <p>Add some personality to your avatar</p>

                  {/* Accessories */}
                  {hasStyleOptions('accessories') && (
                    <ItemSelector
                      title="Accessories"
                      category="accessories"
                      currentValue={previewAvatar.options?.accessories?.[0]}
                      currentAvatarConfig={previewAvatar}
                      onChange={handleAvatarChange}
                    />
                  )}

                  {/* Facial Hair */}
                  {hasStyleOptions('facialHair') && (
                    <ItemSelector
                      title="Facial Hair"
                      category="facialHair"
                      currentValue={previewAvatar.options?.facialHair?.[0]}
                      currentAvatarConfig={previewAvatar}
                      onChange={handleAvatarChange}
                    />
                  )}

                  {!hasStyleOptions('accessories') && !hasStyleOptions('facialHair') && (
                    <div className="no-options-message">
                      <p>No accessory options available for this avatar style.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Features Tab */}
              {activeTab === "features" && previewAvatar && (
                <div className="tab-panel">
                  <h3>Facial Features</h3>
                  <p>Customize facial expressions and features</p>

                  {/* Eyes */}
                  {hasStyleOptions('eyes') && (
                    <ItemSelector
                      title="Eyes"
                      category="eyes"
                      currentValue={previewAvatar.options?.eyes?.[0]}
                      currentAvatarConfig={previewAvatar}
                      onChange={handleAvatarChange}
                    />
                  )}

                  {/* Mouth */}
                  {hasStyleOptions('mouth') && (
                    <ItemSelector
                      title="Mouth"
                      category="mouth"
                      currentValue={previewAvatar.options?.mouth?.[0]}
                      currentAvatarConfig={previewAvatar}
                      onChange={handleAvatarChange}
                    />
                  )}

                  {!hasStyleOptions('eyes') && !hasStyleOptions('mouth') && (
                    <div className="no-options-message">
                      <p>No facial feature options available for this avatar style.</p>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Bottom buttons */}
      <div className="editor-navigation">
        <div className="nav-buttons">
          <button
            onClick={handleNavigateToDashboard}
            className="nav-btn secondary"
          >
            📊 Back to Dashboard
          </button>
          <button
            onClick={handleNavigateToInventory}
            className="nav-btn primary"
          >
            📦 View Collection
          </button>
          <button
            onClick={handleNavigateToHome}
            className="nav-btn tertiary"
          >
            🏡 Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarEditorPage;