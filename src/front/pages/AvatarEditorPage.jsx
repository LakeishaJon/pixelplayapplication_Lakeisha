import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Add this import
import { useAvatar } from "../Contexts/AvatarContext";
import AvatarDisplay from "../components/AvatarDisplay";
import ColorPalette from "../components/ColorPalette";
import StyleSelector from "../components/StyleSelector";
import ItemSelector from "../components/ItemSelector";
import { getItemsForLevel, generateThemeConfig } from "../utils/avatarUtils.jsx";
import "../styles/AvatarEditorPage.css";

const AvatarEditorPage = () => { // ✅ Remove onNavigate prop
  const navigate = useNavigate(); // ✅ Add useNavigate hook
  const { currentAvatar, updateAvatar, saveAvatar, inventory, userStats } = useAvatar();
  const [previewAvatar, setPreviewAvatar] = useState({ ...currentAvatar });
  const [activeTab, setActiveTab] = useState("hair");
  const [avatarName, setAvatarName] = useState("");

  const handleAvatarChange = (changes) => {
    setPreviewAvatar({ ...previewAvatar, ...changes });
  };

  const handleSave = () => {
    if (!avatarName.trim()) {
      alert("Please give your avatar a name!");
      return;
    }
    saveAvatar(avatarName, previewAvatar);
    updateAvatar(previewAvatar);
    setAvatarName("");
    alert("Avatar saved!");
  };

  const handleSetAsCurrent = () => {
    updateAvatar(previewAvatar);
    alert("Avatar updated!");
  };

  const handleReset = () => setPreviewAvatar({ ...currentAvatar });

  // ✅ Add navigation handlers
  const handleNavigateToDashboard = () => {
    navigate("/dashboard");
  };

  const handleNavigateToInventory = () => {
    navigate("/inventory");
  };

  const handleNavigateToHome = () => {
    navigate("/");
  };

  const tabs = [
    { id: "hair", label: "Hair", icon: "💇" },
    { id: "clothing", label: "Clothes", icon: "👕" },
    { id: "accessories", label: "Accessories", icon: "👓" },
    { id: "colors", label: "Colors", icon: "🎨" },
    { id: "style", label: "Style", icon: "✨" },
  ];

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
        {/* Preview Section */}
        <div className="preview-section">
          <div className="preview-card">
            <h2>Your Avatar Preview</h2>
            <div className="avatar-display-container">
              <AvatarDisplay
                avatar={previewAvatar}
                size={180}
                showLevel={true}
                level={userStats?.level || 1}
              />
            </div>

            <div className="save-controls">
              <input
                type="text"
                placeholder="Give your avatar a name..."
                value={avatarName}
                onChange={(e) => setAvatarName(e.target.value)}
                className="avatar-name-input"
              />

              <div className="control-buttons">
                <button onClick={handleSave} className="control-button save-button">
                  💾 Save Avatar
                </button>
                <button onClick={handleSetAsCurrent} className="control-button use-button">
                  ✅ Use This
                </button>
                <button onClick={handleReset} className="control-button reset-button">
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customization Section */}
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
              {activeTab === "hair" && (
                <div className="tab-panel">
                  <h3>Hair Styles</h3>
                  <p>Choose from available hair options</p>
                  <ItemSelector
                    title="Hair Style"
                    category="hair"
                    currentValue={previewAvatar.hair}
                    availableItems={inventory.hair || ['shortWaved', 'longHair', 'curly']}
                    onChange={(value) => handleAvatarChange({ hair: value })}
                  />
                </div>
              )}

              {activeTab === "clothing" && (
                <div className="tab-panel">
                  <h3>Clothing Options</h3>
                  <p>Select your outfit</p>
                  <ItemSelector
                    title="Clothing"
                    category="clothing"
                    currentValue={previewAvatar.clothing}
                    availableItems={inventory.clothing || ['blazerShirt', 'hoodie', 'tshirt']}
                    onChange={(value) => handleAvatarChange({ clothing: value })}
                  />
                </div>
              )}

              {activeTab === "accessories" && (
                <div className="tab-panel">
                  <h3>Accessories</h3>
                  <p>Add some flair to your look</p>
                  <ItemSelector
                    title="Accessories"
                    category="accessories"
                    currentValue={previewAvatar.accessories?.[0] || ''}
                    availableItems={inventory.accessories || ['glasses', 'sunglasses']}
                    onChange={(value) => handleAvatarChange({ accessories: [value] })}
                  />
                </div>
              )}

              {activeTab === "colors" && (
                <div className="tab-panel">
                  <h3>Color Palette</h3>
                  <p>Customize your colors</p>
                  <ColorPalette
                    avatar={previewAvatar}
                    availableColors={inventory.colors || ['blue', 'red', 'green', 'purple']}
                    onChange={handleAvatarChange}
                  />
                </div>
              )}

              {activeTab === "style" && (
                <div className="tab-panel">
                  <h3>Avatar Style</h3>
                  <p>Choose your avatar's overall style</p>
                  <StyleSelector
                    currentStyle={previewAvatar.style}
                    onChange={(style) => handleAvatarChange({ style })}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ FIXED NAVIGATION - Using proper React Router navigation */}
      <div className="editor-navigation">
        <div className="nav-buttons">
          <button
            onClick={handleNavigateToDashboard}
            className="nav-btn secondary"
          >
            🏠 Back to Dashboard
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