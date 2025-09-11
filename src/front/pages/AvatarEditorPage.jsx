// src/front/pages/AvatarEditorPage.jsx
import React, { useState } from "react";

// Context
import { useAvatar } from "../Contexts/AvatarContext.jsx";

// Components
import AvatarDisplay from "../components/AvatarDisplay.jsx";
import ColorPalette from "../components/ColorPalette.jsx";
import StyleSelector from "../components/StyleSelector.jsx";
import ItemSelector from "../components/ItemSelector.jsx";

// Utilities
import { getItemsForLevel, generateThemeConfig } from "../utils/avatarUtils.jsx";
import { FITNESS_THEMES } from "../utils/dicebearConfig.jsx";

const AvatarEditorPage = ({ onNavigate }) => {
  const { currentAvatar, updateAvatar, saveAvatar, inventory } = useAvatar();
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
    alert("Avatar saved! 🎉");
  };

  const handleSetAsCurrent = () => {
    updateAvatar(previewAvatar);
    alert("Avatar updated! 👍");
  };

  const handleReset = () => setPreviewAvatar({ ...currentAvatar });

  const tabs = [
    { id: "hair", label: "💇 Hair", icon: "💇" },
    { id: "clothing", label: "👕 Clothes", icon: "👕" },
    { id: "accessories", label: "👓 Accessories", icon: "👓" },
    { id: "colors", label: "🎨 Colors", icon: "🎨" },
    { id: "style", label: "✨ Style", icon: "✨" },
  ];

  return (
    <div className="avatar-editor-page">
      <div className="editor-container">
        <header className="editor-header">
          <h2>🎨 Avatar Art Studio</h2>
          <p>Create and customize your perfect fitness character</p>
        </header>

        <div className="editor-content">
          {/* Left side - Preview */}
          <div className="preview-section">
            <div className="preview-card">
              <h3>Your Avatar Preview</h3>
              <AvatarDisplay avatar={previewAvatar} size={150} showLevel={true} level={1} />
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

          {/* Right side - Customization */}
          <div className="customization-section">
            <div className="editor-tabs">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`editor-tab ${activeTab === tab.id ? "active" : ""}`}
                >
                  {tab.icon}
                </button>
              ))}
            </div>

            <div className="tab-content-editor">
              {activeTab === "hair" && (
                <ItemSelector
                  title="Choose Hair Style"
                  category="hair"
                  currentValue={previewAvatar.hair}
                  availableItems={inventory.hair}
                  onChange={(value) => handleAvatarChange({ hair: value })}
                />
              )}
              {activeTab === "clothing" && (
                <ItemSelector
                  title="Choose Clothing"
                  category="clothing"
                  currentValue={previewAvatar.clothing}
                  availableItems={inventory.clothing}
                  onChange={(value) => handleAvatarChange({ clothing: value })}
                />
              )}
              {activeTab === "accessories" && (
                <ItemSelector
                  title="Choose Accessories"
                  category="accessories"
                  currentValue={previewAvatar.accessories}
                  availableItems={inventory.accessories}
                  onChange={(value) => handleAvatarChange({ accessories: [value] })}
                />
              )}
              {activeTab === "colors" && (
                <ColorPalette avatar={previewAvatar} availableColors={inventory.colors} onChange={handleAvatarChange} />
              )}
              {activeTab === "style" && (
                <StyleSelector currentStyle={previewAvatar.style} onChange={(style) => handleAvatarChange({ style })} />
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="editor-navigation">
          <button onClick={() => onNavigate("dashboard")} className="nav-button back-button">
            🏠 Back to Dashboard
          </button>
          <button onClick={() => onNavigate("inventory")} className="nav-button inventory-button">
            🎒 View Collection
          </button>
        </div>
      </div>
    </div>
  );
};

export default AvatarEditorPage;
