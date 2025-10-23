import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAvatar } from '../Contexts/AvatarContext';
import AvatarDisplay from '../components/AvatarDisplay';
import '../styles/CollectionPage.css';

const CollectionPage = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { savedAvatars, userStats, setCurrentAvatar } = useAvatar();

  const [activeTab, setActiveTab] = useState('myItems');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  // Backend URL from environment or default
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

  useEffect(() => {
    console.log('🚀 CollectionPage mounted');
    fetchBackendData();
  }, []);

  // ===================================
  // 📡 FETCH DATA FROM BACKEND
  // ===================================

  const fetchBackendData = async () => {
    setLoading(true);
    try {
      console.log('📡 Fetching from backend:', BACKEND_URL);

      // Fetch inventory (public endpoint - no auth required)
      try {
        const inventoryRes = await fetch(`${BACKEND_URL}/api/inventory`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (inventoryRes.ok) {
          const data = await inventoryRes.json();
          console.log('✅ Inventory loaded:', data);
          setItems(data.items || []);
          setBackendConnected(true);
        } else {
          console.log('⚠️ Inventory fetch failed, using empty array');
          setItems([]);
          setBackendConnected(false);
        }
      } catch (error) {
        console.log('⚠️ Inventory fetch error:', error.message);
        setItems([]);
        setBackendConnected(false);
      }

      // Fetch achievements (public endpoint - no auth required)
      try {
        const achievementsRes = await fetch(`${BACKEND_URL}/api/achievements`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (achievementsRes.ok) {
          const data = await achievementsRes.json();
          console.log('✅ Achievements loaded:', data);
          setAchievements(data.achievements || []);
        } else {
          console.log('⚠️ Achievements fetch failed');
          setAchievements([]);
        }
      } catch (error) {
        console.log('⚠️ Achievements fetch error:', error.message);
        setAchievements([]);
      }
    } catch (error) {
      console.error('❌ Error fetching backend data:', error);
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // 🛒 PURCHASE ITEM
  // ===================================

  const handlePurchaseItem = async (item) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login to purchase items!');
      return;
    }

    if (userStats.points < item.price) {
      alert(`Not enough coins! You need ${item.price} but have ${userStats.points}`);
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/inventory/purchase/${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${data.message}`);
        fetchBackendData(); // Refresh data
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error('Error purchasing item:', error);
      alert('Failed to purchase item. Please try again.');
    }
  };

  // ===================================
  // ⚙️ EQUIP ITEM
  // ===================================

  const handleEquipItem = async (item) => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Please login to equip items!');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/inventory/equip/${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ ${data.message}`);
        fetchBackendData(); // Refresh data
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error('Error equipping item:', error);
      alert('Failed to equip item. Please try again.');
    }
  };

  // ===================================
  // 👤 AVATAR ACTIONS
  // ===================================

  const handleUseAvatar = (avatar) => {
    console.log('✅ Setting current avatar:', avatar.name);
    if (setCurrentAvatar) {
      setCurrentAvatar(avatar.settings);
      alert(`Now using avatar: ${avatar.name}! 🎨`);
    }
  };

  const handleEditAvatar = (avatar) => {
    console.log('✏️ Editing avatar:', avatar.name);
    if (onNavigate) {
      onNavigate('editor', avatar);
    } else {
      navigate('/editor', { state: { avatar } });
    }
  };

  const handleDeleteAvatar = (avatarId) => {
    if (window.confirm('Delete this avatar?')) {
      const currentData = JSON.parse(localStorage.getItem('pixelplay-data') || '{}');
      const updatedAvatars = (currentData.savedAvatars || []).filter(a => a.id !== avatarId);
      localStorage.setItem('pixelplay-data', JSON.stringify({ ...currentData, savedAvatars: updatedAvatars }));
      window.location.reload();
    }
  };

  // ===================================
  // 🔍 FILTER ITEMS
  // ===================================

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const ownedItems = filteredItems.filter(item => item.owned);
  const shopItems = filteredItems.filter(item => !item.owned);
  const currentLevel = userStats?.level || 1;

  // ===================================
  // 📊 RENDER LOADING STATE
  // ===================================

  if (loading) {
    return (
      <div className="collection-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <h2>Loading Collection...</h2>
        </div>
      </div>
    );
  }

  // ===================================
  // 🎨 RENDER MAIN COMPONENT
  // ===================================

  return (
    <div className="collection-page">
      {/* Header */}
      <div className="collection-header">
        <div className="header-content">
          <div className="header-left">
            <div className="cube-icon">📦</div>
            <div className="header-text">
              <h1>My Collection</h1>
              <p>Check out all your awesome gear! {!backendConnected && '(Demo Mode)'}</p>
            </div>
          </div>
          <div className="header-right">
            <div className="level-display">
              <div className="level-text">Level {currentLevel}</div>
              <div className="xp-text">⭐ {userStats?.points || 0} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="collection-content">
        {/* Main Tabs */}
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
            🏪 Shop
          </button>
          <button
            className={`tab-btn ${activeTab === 'achievements' ? 'active' : ''}`}
            onClick={() => setActiveTab('achievements')}
          >
            🏆 Achievements
          </button>
        </div>

        {/* Category Filters & Search */}
        {(activeTab === 'myItems' || activeTab === 'shop') && (
          <div className="secondary-controls">
            <div className="category-tabs">
              <button
                className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
              >
                📦 All Items
              </button>
              <button
                className={`category-btn ${activeCategory === 'clothing' ? 'active' : ''}`}
                onClick={() => setActiveCategory('clothing')}
              >
                👕 Clothing
              </button>
              <button
                className={`category-btn ${activeCategory === 'accessories' ? 'active' : ''}`}
                onClick={() => setActiveCategory('accessories')}
              >
                👜 Accessories
              </button>
            </div>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="tab-content">
          {/* MY ITEMS TAB */}
          {activeTab === 'myItems' && (
            <div className="inventory-grid">
              {ownedItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <h3>No Items Yet</h3>
                  <p>Visit the shop to purchase items!</p>
                </div>
              ) : (
                ownedItems.map(item => (
                  <div key={item.id} className={`inventory-card ${item.equipped ? 'equipped' : ''}`}>
                    <div className="item-icon">{item.icon}</div>
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-description">{item.description}</p>
                    <div className="item-rarity">
                      <span className={`rarity-badge ${item.rarity}`}>{item.rarity}</span>
                    </div>
                    {item.equipped && <span className="equipped-badge">✓ Equipped</span>}
                    <div className="item-actions">
                      <button
                        className={`equip-btn ${item.equipped ? 'equipped' : ''}`}
                        onClick={() => handleEquipItem(item)}
                      >
                        {item.equipped ? '✓ Equipped' : 'Equip'}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* SHOP TAB */}
          {activeTab === 'shop' && (
            <div className="inventory-grid">
              {shopItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🎉</div>
                  <h3>You Own Everything!</h3>
                  <p>Check back for new items!</p>
                </div>
              ) : (
                shopItems.map(item => {
                  const canUnlock = currentLevel >= (item.levelRequired || 1);
                  const canAfford = userStats.points >= item.price;

                  return (
                    <div
                      key={item.id}
                      className={`inventory-card shop-item ${!canUnlock ? 'locked' : ''}`}
                    >
                      <div className="item-icon">{item.icon}</div>
                      <h3 className="item-name">{item.name}</h3>
                      <p className="item-description">{item.description}</p>
                      <div className="item-rarity">
                        <span className={`rarity-badge ${item.rarity}`}>{item.rarity}</span>
                      </div>
                      <div className="item-price">💰 {item.price} coins</div>
                      {item.levelRequired && (
                        <div className={`level-req ${!canUnlock ? 'locked' : ''}`}>
                          {canUnlock ? '✓' : '🔒'} Level {item.levelRequired}
                        </div>
                      )}
                      <div className="item-actions">
                        <button
                          className="equip-btn"
                          disabled={!canUnlock || !canAfford}
                          onClick={() => handlePurchaseItem(item)}
                        >
                          {!canUnlock ? '🔒 Locked' : !canAfford ? '💰 Not enough coins' : 'Buy Now'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {activeTab === 'achievements' && (
            <div className="achievements-list">
              {achievements.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🏆</div>
                  <h3>No Achievements Yet</h3>
                  <p>Complete workouts to unlock achievements!</p>
                </div>
              ) : (
                achievements.map(achievement => (
                  <div
                    key={achievement.id}
                    className={`achievement-card ${achievement.unlocked ? 'completed' : 'in-progress'}`}
                  >
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-content">
                      <h3 className="achievement-name">{achievement.name}</h3>
                      <p className="achievement-description">{achievement.description}</p>
                      {achievement.reward && (
                        <p className="reward">💰 {achievement.reward} coins</p>
                      )}
                      {achievement.unlocked ? (
                        <span className="completion-badge">✓ Unlocked!</span>
                      ) : (
                        <div className="progress-container">
                          <div className="progress-bar">
                            <div
                              className="progress-fill"
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                          <span className="progress-text">{achievement.progress}%</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="stats-summary">
          <div className="stat-item">
            <span className="stat-icon">👤</span>
            <span className="stat-number">{savedAvatars?.length || 0}</span>
            <span className="stat-label">Avatars</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📦</span>
            <span className="stat-number">{ownedItems.length}</span>
            <span className="stat-label">Items Owned</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🏆</span>
            <span className="stat-number">{achievements.filter(a => a.unlocked).length}</span>
            <span className="stat-label">Achievements</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⭐</span>
            <span className="stat-number">{currentLevel}</span>
            <span className="stat-label">Level</span>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-navigation">
        <button
          className="nav-btn secondary"
          onClick={() => onNavigate ? onNavigate('dashboard') : navigate('/home')}
        >
          🏠 Back to Home
        </button>
        <button
          className="nav-btn primary"
          onClick={() => onNavigate ? onNavigate('editor') : navigate('/editor')}
        >
          🎨 Edit Avatar
        </button>
      </div>
    </div>
  );
};

export default CollectionPage;