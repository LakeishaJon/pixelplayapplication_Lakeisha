import React from 'react';
import { useAvatar } from '../Contexts/AvatarContext';
import AvatarDisplay from '../components/AvatarDisplay';
import '../styles/AvatarInventory.css';

const AvatarInventory = ({ onNavigate }) => {
  const {
    savedAvatars,
    inventory,
    backendInventory,
    achievements,
    userStats,
    setCurrentAvatar,
    isLoading,
    syncError,
    refreshData
  } = useAvatar();

  console.log('🎨 AvatarInventory - Working without authentication!', {
    savedAvatars: savedAvatars?.length || 0,
    inventory: Object.keys(inventory || {}).length,
    backendInventory: backendInventory?.length || 0,
    achievements: achievements?.length || 0,
    userStats,
    isLoading
  });

  // ⭐ MOCK DATA - Used when backend is empty or unavailable
  const mockInventoryItems = [
    { name: 'Cool Sunglasses', category: 'accessories', icon: '🕶️', is_equipped: false },
    { name: 'Red Cap', category: 'clothing', icon: '🧢', is_equipped: true },
    { name: 'Blue Hoodie', category: 'clothing', icon: '🧥', is_equipped: false },
    { name: 'Sneakers', category: 'clothing', icon: '👟', is_equipped: false },
    { name: 'Backpack', category: 'accessories', icon: '🎒', is_equipped: false },
    { name: 'Watch', category: 'accessories', icon: '⌚', is_equipped: false },
  ];

  const mockAchievements = [
    {
      name: 'First Steps',
      description: 'Complete your first workout',
      is_completed: true,
      earned_at: new Date().toISOString()
    },
    {
      name: 'Week Warrior',
      description: 'Work out 7 days in a row',
      is_completed: false,
      user_progress: 45
    },
    {
      name: 'Century Club',
      description: 'Complete 100 workouts',
      is_completed: false,
      user_progress: 23
    },
    {
      name: 'Marathon Master',
      description: 'Run 26 miles total',
      is_completed: false,
      user_progress: 68
    },
  ];

  // Use backend data if available, otherwise use mock data
  const displayInventory = backendInventory && backendInventory.length > 0
    ? backendInventory
    : mockInventoryItems;

  const displayAchievements = achievements && achievements.length > 0
    ? achievements
    : mockAchievements;

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
    onNavigate('editor', avatar);
  };

  // Show loading state (though it should be instant now)
  if (isLoading) {
    return (
      <div className="avatar-inventory-page">
        <div className="loading-state">
          <div className="loading-spinner">🔄</div>
          <h3>Loading your collection...</h3>
        </div>
      </div>
    );
  }

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
            {syncError && (
              <button onClick={refreshData} className="refresh-btn" title="Retry loading data">
                🔄 Retry
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error Message - Modified to be less alarming */}
      {syncError && (
        <div className="error-banner">
          <span>⚠️ Using offline mode - showing demo data</span>
          <button onClick={refreshData} className="retry-btn">Try Again</button>
        </div>
      )}

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

        {/* Inventory Items Section - Now shows demo data */}
        <div className="inventory-items-section">
          <div className="section-card">
            <h2>🎒 Inventory Items {!backendInventory || backendInventory.length === 0 ? '(Demo)' : ''}</h2>

            {displayInventory.length === 0 ? (
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
                {displayInventory.map((item, index) => (
                  <div key={index} className="inventory-item-card">
                    <div className="item-icon">{item.icon || '📦'}</div>
                    <div className="item-details">
                      <h4>{item.name}</h4>
                      <p className="item-category">{item.category}</p>
                      {item.is_equipped && (
                        <span className="equipped-badge">✓ Equipped</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Achievements Section - Now shows demo data */}
        <div className="achievements-section">
          <div className="section-card">
            <h2>🏆 Achievements {!achievements || achievements.length === 0 ? '(Demo)' : ''}</h2>

            {displayAchievements.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🏆</div>
                <h3>No Achievements Yet</h3>
                <p>Keep working out to unlock achievements!</p>
              </div>
            ) : (
              <div className="achievements-grid">
                {displayAchievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`achievement-card ${achievement.is_completed ? 'completed' : 'locked'}`}
                  >
                    <div className="achievement-icon">
                      {achievement.is_completed ? '🏆' : '🔒'}
                    </div>
                    <div className="achievement-info">
                      <h4>{achievement.name}</h4>
                      <p>{achievement.description}</p>
                      {achievement.is_completed && achievement.earned_at && (
                        <p className="earned-date">
                          Earned: {new Date(achievement.earned_at).toLocaleDateString()}
                        </p>
                      )}
                      {!achievement.is_completed && (
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${achievement.user_progress || 0}%` }}
                          />
                          <span className="progress-text">
                            {achievement.user_progress || 0}% Complete
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Local Inventory (Browser-saved items) */}
        {inventory && Object.keys(inventory).length > 0 && (
          <div className="local-inventory-section">
            <div className="section-card">
              <h2>📦 Local Items</h2>
              <div className="inventory-grid">
                {Object.entries(inventory).map(([category, items]) => {
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
            </div>
          </div>
        )}

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
                <div className="stat-number">{displayInventory?.length || 0}</div>
                <div className="stat-label">Inventory Items</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🏆</div>
                <div className="stat-number">
                  {displayAchievements?.filter(a => a.is_completed).length || 0}
                </div>
                <div className="stat-label">Achievements</div>
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
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();
};

export default AvatarInventory;