import React from 'react';
import { useAvatar } from '../Contexts/AvatarContext';
import AvatarDisplay from '../components/AvatarDisplay';
import '../styles/AvatarInventory.css';

const AvatarInventory = ({ onNavigate }) => {
  const { savedAvatars, inventory, userStats } = useAvatar();

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
            <h2>Saved Avatars</h2>

            {savedAvatars.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">👤</div>
                <h3>No Saved Avatars Yet</h3>
                <p>Create and save your first avatar to see it here!</p>
                <button
                  className="create-avatar-btn"
                  onClick={() => onNavigate('editor')}
                >
                  Create Your First Avatar
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
                    </div>
                    <div className="avatar-actions">
                      <button
                        className="action-btn use-btn"
                        onClick={() => {
                          // Logic to set this as current avatar would go here
                          console.log('Using avatar:', avatar.name);
                        }}
                      >
                        Use Avatar
                      </button>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => onNavigate('editor')}
                      >
                        Edit
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
            <h2>Inventory Items</h2>

            {Object.keys(inventory).length === 0 ||
              Object.values(inventory).every(items => items.length === 0) ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No Items Yet</h3>
                <p>Complete workouts and level up to unlock new items!</p>
              </div>
            ) : (
              <div className="inventory-grid">
                {Object.entries(inventory).map(([category, items]) => (
                  <div key={category} className="category-card">
                    <div className="category-header">
                      <h3>{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
                      <span className="item-count">{items.length} items</span>
                    </div>

                    {items.length === 0 ? (
                      <div className="category-empty">
                        <p>No {category} items yet</p>
                      </div>
                    ) : (
                      <div className="items-list">
                        {items.map((item, index) => (
                          <div key={index} className="item-chip">
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="stats-section">
          <div className="section-card">
            <h2>Collection Stats</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-number">{savedAvatars.length}</div>
                <div className="stat-label">Saved Avatars</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">
                  {Object.values(inventory).reduce((total, items) => total + items.length, 0)}
                </div>
                <div className="stat-label">Total Items</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">{Object.keys(inventory).length}</div>
                <div className="stat-label">Categories</div>
              </div>
              <div className="stat-item">
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

export default AvatarInventory;