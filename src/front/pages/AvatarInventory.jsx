import React from 'react';
import { useAvatar } from '../Contexts/AvatarContext';
import AvatarDisplay from '../components/AvatarDisplay';
import '../styles/AvatarInventory.css';

const AvatarInventory = ({ onNavigate }) => {
  const { savedAvatars, inventory, userStats, setCurrentAvatar } = useAvatar();

  console.log('🎨 AvatarInventory Context Data:', {
    savedAvatars,
    inventory,
    userStats
  });

  // Handle using an avatar
  const handleUseAvatar = (avatar) => {
    console.log('✅ Setting current avatar:', avatar.name);
    if (setCurrentAvatar) {
      setCurrentAvatar(avatar.settings);
      alert(`Now using avatar: ${avatar.name}! 🎨`);
    }
  };

  // Handle editing an avatar
  const handleEditAvatar = (avatar) => {
    console.log('✏️ Editing avatar:', avatar.name);
    // Could pass avatar data to editor through context or navigation state
    onNavigate('editor', avatar);
  };

  return (
    <div className="avatar-inventory-page">
      {/* Header */}
      <div className="inventory-header">
        <div className="header-content">
          <div className="header-left">
            <div className="cube-icon">🎒</div>
            <div className="header-text">
              <h1>Your Collection</h1>
              <p>All your saved avatars and unlocked items</p>
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
      <div className="inventory-content">
        {/* Saved Avatars Section */}
        <div className="saved-avatars-section">
          <div className="section-card">
            <h2>💼 Saved Avatars</h2>

            {!savedAvatars || savedAvatars.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👤</div>
                <h3>No Saved Avatars Yet</h3>
                <p>Create and save your first avatar to see it here!</p>
                <button
                  className="create-avatar-btn"
                  onClick={() => onNavigate('editor')}
                >
                  ✨ Create Your First Avatar
                </button>
              </div>
            ) : (
              <div className="avatars-grid">
                {savedAvatars.map((avatar) => (
                  <div key={avatar.id} className="avatar-card">
                    <div className="avatar-display-container">
                      <AvatarDisplay
                        avatar={avatar.settings}
                        size={120}
                        showLevel={true}
                        level={userStats?.level || 1}
                      />
                    </div>
                    <div className="avatar-info">
                      <h4>{avatar.name}</h4>
                      <p className="avatar-date">
                        Created {new Date(avatar.createdAt).toLocaleDateString()}
                      </p>
                      {avatar.settings?.style && (
                        <span className="avatar-style-badge">
                          {avatar.settings.style}
                        </span>
                      )}
                    </div>
                    <div className="avatar-actions">
                      <button
                        className="action-btn use-btn"
                        onClick={() => handleUseAvatar(avatar)}
                      >
                        ✅ Use Avatar
                      </button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditAvatar(avatar)}
                      >
                        ✏️ Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Inventory Items Section */}
        <div className="inventory-items-section">
          <div className="section-card">
            <h2>🎒 Inventory Items</h2>

            {!inventory || Object.keys(inventory).length === 0 ||
              Object.values(inventory).every(items => !items || items.length === 0) ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No Items Yet</h3>
                <p>Complete workouts and level up to unlock new items!</p>
                <button
                  className="start-workout-btn"
                  onClick={() => onNavigate('dashboard')}
                >
                  💪 Start Working Out
                </button>
              </div>
            ) : (
              <div className="inventory-grid">
                {Object.entries(inventory).map(([category, items]) => {
                  // Skip empty categories
                  if (!items || items.length === 0) return null;

                  return (
                    <div key={category} className="category-card">
                      <div className="category-header">
                        <h3>
                          {getCategoryIcon(category)}{' '}
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </h3>
                        <span className="item-count">{items.length} items</span>
                      </div>

                      <div className="items-list">
                        {items.map((item, index) => (
                          <div key={`${category}-${index}`} className="item-chip">
                            <span className="item-name">{formatItemName(item)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="section-card">
            <h2>📊 Collection Stats</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon">👤</div>
                <div className="stat-number">{savedAvatars?.length || 0}</div>
                <div className="stat-label">Saved Avatars</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">📦</div>
                <div className="stat-number">
                  {inventory
                    ? Object.values(inventory).reduce(
                        (total, items) => total + (items?.length || 0),
                        0
                      )
                    : 0}
                </div>
                <div className="stat-label">Total Items</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🏷️</div>
                <div className="stat-number">
                  {inventory
                    ? Object.keys(inventory).filter(
                        key => inventory[key] && inventory[key].length > 0
                      ).length
                    : 0}
                </div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">⭐</div>
                <div className="stat-number">{userStats?.level || 1}</div>
                <div className="stat-label">Current Level</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="navigation-section">
        <button
          onClick={() => onNavigate('dashboard')}
          className="nav-btn secondary"
        >
          📊 Back to Dashboard
        </button>
        <button
          onClick={() => onNavigate('editor')}
          className="nav-btn primary"
        >
          🎨 Create New Avatar
        </button>
      </div>
    </div>
  );
};

// Helper function to get category icons
const getCategoryIcon = (category) => {
  const iconMap = {
    'tops': '👕',
    'clothing': '👕',
    'accessories': '👑',
    'hats': '🎩',
    'glasses': '👓',
    'hairColor': '💇',
    'facialHair': '🧔',
    'clotheColor': '🎨',
    'backgroundColor': '🌈',
    'default': '📦'
  };
  return iconMap[category] || iconMap.default;
};

// Helper function to format item names nicely
const formatItemName = (item) => {
  if (!item) return 'Unknown Item';
  
  return String(item)
    .replace(/([A-Z])/g, ' $1') // Add spaces before capital letters
    .replace(/^./, str => str.toUpperCase()) // Capitalize first letter
    .trim();
};

export default AvatarInventory;