import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAvatar } from '../Contexts/AvatarContext';
import { getAuthToken, getAuthHeaders, isAuthenticated } from '../utils/auth';
import "../styles/InventoryPage.css";

const InventoryPage = () => {
  const navigate = useNavigate();
  const { userStats } = useAvatar();
  const [activeTab, setActiveTab] = useState('myItems');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [inventoryItems, setInventoryItems] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL - matches your auth.js
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleNavigateToEditor = () => {
    navigate('/avatar-editor');
  };

  const handleNavigateToHome = () => {
    navigate('/');
  };

  // ✅ FIXED: Using your auth.js functions
  const checkAuthentication = () => {
    if (!isAuthenticated()) {
      console.error('❌ User not authenticated, redirecting to login...');
      setError('Please log in to view your inventory.');
      setLoading(false);
      setTimeout(() => navigate('/login'), 2000);
      return false;
    }
    return true;
  };

  // Handle API errors
  const handleApiError = (response) => {
    if (response.status === 401) {
      setError('Session expired. Please log in again.');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  };

  // Helper to get category background colors
  const getCategoryBackgroundColor = (category, rarity = 'common') => {
    const colorMap = {
      clothing: {
        common: '#E3F2FD',
        rare: '#BBDEFB',
        epic: '#90CAF9',
        legendary: '#64B5F6'
      },
      accessories: {
        common: '#FFF3C4',
        rare: '#FFEB3B',
        epic: '#FFC107',
        legendary: '#FF9800'
      },
      consumables: {
        common: '#E8F5E8',
        rare: '#C8E6C9',
        epic: '#A5D6A7',
        legendary: '#81C784'
      },
      default: {
        common: '#F5F5F5',
        rare: '#E0E0E0',
        epic: '#BDBDBD',
        legendary: '#9E9E9E'
      }
    };
    return colorMap[category]?.[rarity] || colorMap.default[rarity];
  };

  // Helper to get item icon
  const getItemIcon = (category, name) => {
    const iconMap = {
      clothing: {
        'cape': '🦸',
        'shirt': '👕',
        'hoodie': '🧥',
        'jacket': '🧥',
        'blazer': '👔',
        'dress': '👗',
        'default': '👕'
      },
      accessories: {
        'sneakers': '👟',
        'shoes': '👟',
        'tracker': '⌚',
        'watch': '⌚',
        'headband': '🎯',
        'gloves': '🧤',
        'glasses': '👓',
        'sunglasses': '🕶️',
        'hat': '👒',
        'crown': '👑',
        'mask': '🎭',
        'default': '👑'
      },
      consumables: {
        'potion': '🧪',
        'energy': '⚡',
        'health': '💊',
        'default': '🍎'
      }
    };

    const categoryIcons = iconMap[category] || iconMap.accessories;
    const nameKey = Object.keys(categoryIcons).find(key =>
      name.toLowerCase().includes(key)
    );
    return categoryIcons[nameKey] || categoryIcons.default;
  };

  // ✅ FIXED: Using auth.js getAuthHeaders()
  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check authentication first
      if (!checkAuthentication()) {
        return;
      }

      const token = getAuthToken();
      console.log('📡 Fetching inventory from:', `${API_BASE_URL}/api/inventory`);
      console.log('🔑 Token exists:', !!token);

      const response = await fetch(`${API_BASE_URL}/api/inventory`, {
        method: 'GET',
        headers: getAuthHeaders(), // ✅ Using your auth.js function
      });

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          handleApiError(response);
          return;
        }
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ API Error:', errorData);
        setError(errorData.message || 'Failed to fetch inventory');
        return;
      }

      const data = await response.json();
      console.log('✅ Inventory data received:', data);

      if (data.success && data.inventory) {
        const transformedItems = data.inventory.map(item => ({
          id: item.id,
          inventoryId: item.id,
          itemId: item.item.id,
          name: item.item.name,
          category: item.item.category,
          equipped: item.is_equipped,
          favorite: item.is_favorite,
          backgroundColor: getCategoryBackgroundColor(
            item.item.category,
            item.item.rarity
          ),
          icon: getItemIcon(item.item.category, item.item.name),
          rarity: item.item.rarity || 'common',
          description: item.item.description,
          level_required: item.item.level_required,
          coin_cost: item.item.coin_cost,
          xp_cost: item.item.xp_cost,
          acquired_at: item.acquired_at
        }));

        console.log('✅ Transformed items:', transformedItems);
        setInventoryItems(transformedItems);
      } else {
        console.warn('⚠️ Unexpected data format:', data);
        setError(data.message || 'Invalid inventory data format');
      }
    } catch (err) {
      console.error('❌ Error fetching inventory:', err);
      setError(`Failed to load inventory: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch achievements
  const fetchAchievements = async () => {
    try {
      if (!checkAuthentication()) {
        return;
      }

      console.log('📡 Fetching achievements...');

      const response = await fetch(`${API_BASE_URL}/api/achievements`, {
        method: 'GET',
        headers: getAuthHeaders(), // ✅ Using your auth.js function
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Achievements data:', data);

        if (data.success && data.achievements) {
          const transformedAchievements = data.achievements.map(achievement => ({
            id: achievement.id,
            name: achievement.name,
            description: achievement.description,
            completed: achievement.is_completed,
            progress: achievement.user_progress,
            total: achievement.requirement_value,
            icon: getAchievementIcon(achievement.name),
            earned_at: achievement.earned_at
          }));
          setAchievements(transformedAchievements);
        }
      }
    } catch (error) {
      console.error('❌ Error fetching achievements:', error);
    }
  };

  // Helper for achievement icons
  const getAchievementIcon = (name) => {
    const iconMap = {
      'first': '🎯',
      'steps': '👣',
      'warrior': '💪',
      'workout': '🏋️',
      'level': '⭐',
      'master': '🏆',
      'streak': '🔥',
      'point': '💎'
    };

    const nameKey = Object.keys(iconMap).find(key =>
      name.toLowerCase().includes(key)
    );
    return iconMap[nameKey] || '🏅';
  };

  // Handle equipping items
  const handleEquipItem = async (inventoryId) => {
    try {
      if (!checkAuthentication()) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/inventory/${inventoryId}/equip`, {
        method: 'PATCH',
        headers: getAuthHeaders(), // ✅ Using your auth.js function
      });

      if (!response.ok) {
        handleApiError(response);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setInventoryItems(prev => prev.map(item =>
          item.inventoryId === inventoryId
            ? { ...item, equipped: !item.equipped }
            : item
        ));
        console.log('✅ Item equipped successfully');
      }
    } catch (error) {
      console.error('❌ Error equipping item:', error);
    }
  };

  // Handle favoriting items
  const handleFavoriteItem = async (inventoryId) => {
    try {
      if (!checkAuthentication()) {
        return;
      }

      const response = await fetch(`${API_BASE_URL}/api/inventory/${inventoryId}/favorite`, {
        method: 'PATCH',
        headers: getAuthHeaders(), // ✅ Using your auth.js function
      });

      if (!response.ok) {
        handleApiError(response);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setInventoryItems(prev => prev.map(item =>
          item.inventoryId === inventoryId
            ? { ...item, favorite: !item.favorite }
            : item
        ));
        console.log('✅ Item favorited successfully');
      }
    } catch (error) {
      console.error('❌ Error favoriting item:', error);
    }
  };

  // Filter inventory items
  const filteredItems = inventoryItems.filter(item => {
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Load data on mount
  useEffect(() => {
    console.log('🔍 Checking authentication on mount...');

    if (checkAuthentication()) {
      fetchInventory();
      fetchAchievements();
    }
  }, []);

  // Render inventory items
  const renderInventoryItems = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your awesome gear...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</p>
          <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>{error}</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={fetchInventory} className="retry-btn">
              🔄 Try Again
            </button>
            <button onClick={() => navigate('/login')} className="login-btn">
              🔐 Go to Login
            </button>
          </div>
        </div>
      );
    }

    if (filteredItems.length === 0) {
      return (
        <div className="empty-container">
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</p>
          <p style={{ fontSize: '1.2rem' }}>
            {searchTerm
              ? 'No items match your search. Try adjusting your filters.'
              : 'No items found. Start working out to earn awesome gear!'
            }
          </p>
        </div>
      );
    }

    return (
      <div className="inventory-grid">
        {filteredItems.map(item => (
          <div
            key={item.inventoryId}
            className="inventory-card"
            style={{ backgroundColor: item.backgroundColor }}
          >
            <div className="item-icon">{item.icon}</div>
            <h3 className="item-name">{item.name}</h3>
            {item.description && (
              <p className="item-description">{item.description}</p>
            )}
            <div className="item-rarity">
              <span className={`rarity-badge ${item.rarity}`}>
                {item.rarity.charAt(0).toUpperCase() + item.rarity.slice(1)}
              </span>
            </div>
            <div className="item-actions">
              <button
                className={`favorite-btn ${item.favorite ? 'active' : ''}`}
                onClick={() => handleFavoriteItem(item.inventoryId)}
                disabled={loading}
                title={item.favorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {item.favorite ? '❤️' : '🤍'}
              </button>
              <button
                className={`equip-btn ${item.equipped ? 'equipped' : ''}`}
                onClick={() => handleEquipItem(item.inventoryId)}
                disabled={loading}
              >
                {item.equipped ? '✅ Equipped' : '🔄 Equip'}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render achievements
  const renderAchievements = () => (
    <div className="achievements-list">
      {achievements.length === 0 ? (
        <div className="empty-container">
          <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</p>
          <p style={{ fontSize: '1.2rem' }}>
            No achievements yet. Keep working out to unlock them!
          </p>
        </div>
      ) : (
        achievements.map(achievement => (
          <div
            key={achievement.id}
            className={`achievement-card ${achievement.completed ? 'completed' : 'in-progress'}`}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <div className="achievement-content">
              <h3 className="achievement-name">{achievement.name}</h3>
              <p className="achievement-description">{achievement.description}</p>
              {achievement.completed ? (
                <div className="completion-badge">
                  ✅ Completed!
                  {achievement.earned_at && (
                    <span className="earned-date">
                      {new Date(achievement.earned_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ) : (
                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                    ></div>
                  </div>
                  <span className="progress-text">
                    {achievement.progress}/{achievement.total}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );

  // Render shop placeholder
  const renderShop = () => (
    <div className="shop-container">
      <h3>🛍️ Shop Coming Soon!</h3>
      <p>Purchase new items to customize your avatar and enhance your workouts.</p>
      <div className="shop-features">
        <div className="feature">
          <span className="feature-icon">👕</span>
          <span>Exclusive Clothing</span>
        </div>
        <div className="feature">
          <span className="feature-icon">⚡</span>
          <span>Power-ups & Boosts</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🏆</span>
          <span>Rare Collectibles</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="inventory-page">
      {/* Header */}
      <div className="inventory-header">
        <div className="header-content">
          <div className="header-left">
            <div className="cube-icon">📦</div>
            <div className="header-text">
              <h1>My Collection</h1>
              <p>Check out all your awesome gear!</p>
            </div>
          </div>
          <div className="header-right">
            <div className="level-display">
              <div className="level-text">Level {userStats?.level || 1}</div>
              <div className="xp-text">✨ {userStats?.points || 0} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="inventory-content">
        {/* Main Navigation Tabs */}
        <div className="main-tabs">
          <button
            className={`tab-btn ${activeTab === 'myItems' ? 'active' : ''}`}
            onClick={() => setActiveTab('myItems')}
          >
            📦 My Items
          </button>
          <button
            className={`tab-btn ${activeTab === 'shop' ? 'active' : ''}`}
            onClick={() => setActiveTab('shop')}
          >
            🛍️ Shop
          </button>
          <button
            className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            🏆 Achievements
          </button>
        </div>

        {/* Secondary Controls */}
        {activeTab === 'myItems' && (
          <div className="secondary-controls">
            <div className="category-tabs">
              <button
                className={`category-btn ${categoryFilter === 'all' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('all')}
              >
                📋 All Items
              </button>
              <button
                className={`category-btn ${categoryFilter === 'clothing' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('clothing')}
              >
                👕 Clothing
              </button>
              <button
                className={`category-btn ${categoryFilter === 'accessories' ? 'active' : ''}`}
                onClick={() => setCategoryFilter('accessories')}
              >
                👑 Accessories
              </button>
            </div>
            <div className="search-container">
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'myItems' && renderInventoryItems()}
          {activeTab === 'shop' && renderShop()}
          {activeTab === 'achievements' && renderAchievements()}
        </div>

        {/* Bottom Navigation */}
        <div className="bottom-navigation">
          <div className="nav-buttons">
            <button
              onClick={handleNavigateToDashboard}
              className="nav-btn secondary"
            >
              📊 Back to Dashboard
            </button>
            <button
              onClick={handleNavigateToEditor}
              className="nav-btn primary"
            >
              🎨 Edit Avatar
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
    </div>
  );
};

export default InventoryPage;