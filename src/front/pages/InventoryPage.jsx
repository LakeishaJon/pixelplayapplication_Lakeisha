import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/InventoryPage.css';

const InventoryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('myItems');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  // ⭐ MOCK DATA - Used as fallback
  const mockInventoryItems = [
    { id: 1, name: 'Cool Sunglasses', category: 'accessories', icon: '🕶️', owned: true, equipped: false, price: 100 },
    { id: 2, name: 'Red Cap', category: 'clothing', icon: '🧢', owned: true, equipped: true, price: 50 },
    { id: 3, name: 'Blue T-Shirt', category: 'clothing', icon: '👕', owned: true, equipped: false, price: 75 },
    { id: 4, name: 'Sneakers', category: 'clothing', icon: '👟', owned: true, equipped: false, price: 150 },
    { id: 5, name: 'Backpack', category: 'accessories', icon: '🎒', owned: true, equipped: false, price: 200 },
    { id: 6, name: 'Watch', category: 'accessories', icon: '⌚', owned: false, equipped: false, price: 300 },
    { id: 7, name: 'Hoodie', category: 'clothing', icon: '🧥', owned: false, equipped: false, price: 125 },
  ];

  const mockAchievements = [
    { id: 1, name: 'First Steps', description: 'Complete your first workout', icon: '🏃', unlocked: true, progress: 100 },
    { id: 2, name: 'Week Warrior', description: 'Work out 7 days in a row', icon: '🔥', unlocked: true, progress: 100 },
    { id: 3, name: 'Century Club', description: 'Complete 100 workouts', icon: '💯', unlocked: false, progress: 45 },
    { id: 4, name: 'Marathon Master', description: 'Run 26 miles total', icon: '🏅', unlocked: false, progress: 68 },
    { id: 5, name: 'Strength Supreme', description: 'Complete 50 strength workouts', icon: '💪', unlocked: false, progress: 32 },
  ];

  // ⭐ NO AUTHENTICATION CHECK - Removed completely!

  useEffect(() => {
    console.log('🚀 InventoryPage mounted (NO AUTH REQUIRED)');
    fetchData();
  }, []);

  // ⭐ FETCH DATA WITHOUT AUTHENTICATION
  const fetchData = async () => {
    setLoading(true);

    // Try to fetch from backend (without auth)
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

      console.log('📡 Attempting to fetch from backend (no auth)...');

      // Try fetching inventory
      try {
        const inventoryResponse = await fetch(`${backendUrl}/api/inventory`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (inventoryResponse.ok) {
          const inventoryData = await inventoryResponse.json();
          console.log('✅ Backend inventory loaded:', inventoryData);
          setItems(inventoryData.items || mockInventoryItems);
          setBackendConnected(true);
        } else {
          console.log('⚠️ Backend returned error, using mock data');
          setItems(mockInventoryItems);
          setBackendConnected(false);
        }
      } catch (error) {
        console.log('⚠️ Backend not available, using mock data');
        setItems(mockInventoryItems);
        setBackendConnected(false);
      }

      // Try fetching achievements
      try {
        const achievementsResponse = await fetch(`${backendUrl}/api/achievements`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (achievementsResponse.ok) {
          const achievementsData = await achievementsResponse.json();
          console.log('✅ Backend achievements loaded:', achievementsData);
          setAchievements(achievementsData.achievements || mockAchievements);
        } else {
          console.log('⚠️ Backend returned error, using mock achievements');
          setAchievements(mockAchievements);
        }
      } catch (error) {
        console.log('⚠️ Backend not available, using mock achievements');
        setAchievements(mockAchievements);
      }

    } catch (error) {
      console.log('⚠️ Error fetching data, using mock data:', error);
      setItems(mockInventoryItems);
      setAchievements(mockAchievements);
      setBackendConnected(false);
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const ownedItems = filteredItems.filter(item => item.owned);
  const shopItems = filteredItems.filter(item => !item.owned);

  if (loading) {
    return (
      <div className="inventory-page">
        <div className="loading-container">
          <div className="loading-spinner">🔄</div>
          <h2>Loading Collection...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="inventory-page">
      {/* Header */}
      <div className="inventory-header">
        <div className="header-content">
          <div className="header-left">
            <div className="cube-icon">📦</div>
            <div>
              <h1>My Collection</h1>
              <p>Check out all your awesome gear! {!backendConnected && '(Demo Mode)'}</p>
            </div>
          </div>
          <div className="header-right">
            <div className="level-badge">
              <span className="level-number">Level 5</span>
              <span className="xp-amount">⭐ 850 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* Backend Status Banner */}
      {!backendConnected && (
        <div style={{
          background: 'rgba(251, 191, 36, 0.1)',
          border: '2px solid #fbbf24',
          borderRadius: '12px',
          padding: '1rem',
          margin: '0 2rem 1rem 2rem',
          color: '#92400e',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>ℹ️</span>
          <span>Backend not connected - showing demo data</span>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab ${activeTab === 'myItems' ? 'active' : ''}`}
          onClick={() => setActiveTab('myItems')}
        >
          🎒 My Items
        </button>
        <button
          className={`tab ${activeTab === 'shop' ? 'active' : ''}`}
          onClick={() => setActiveTab('shop')}
        >
          🏪 Shop
        </button>
        <button
          className={`tab ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          🏆 Achievements
        </button>
      </div>

      {/* Filters (only show for items tabs) */}
      {(activeTab === 'myItems' || activeTab === 'shop') && (
        <div className="filters-container">
          <div className="category-filters">
            <button
              className={`filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              📦 All Items
            </button>
            <button
              className={`filter-btn ${activeCategory === 'clothing' ? 'active' : ''}`}
              onClick={() => setActiveCategory('clothing')}
            >
              👕 Clothing
            </button>
            <button
              className={`filter-btn ${activeCategory === 'accessories' ? 'active' : ''}`}
              onClick={() => setActiveCategory('accessories')}
            >
              🎩 Accessories
            </button>
          </div>
          <div className="search-box">
            <input
              type="text"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="inventory-content">
        {activeTab === 'myItems' && (
          <div className="items-grid">
            {ownedItems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No items yet!</h3>
                <p>Complete workouts to earn coins and buy items in the shop!</p>
              </div>
            ) : (
              ownedItems.map(item => (
                <div key={item.id} className={`item-card ${item.equipped ? 'equipped' : ''}`}>
                  <div className="item-icon">{item.icon}</div>
                  <h3>{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  {item.equipped && <span className="equipped-badge">✓ Equipped</span>}
                  <div className="item-actions">
                    <button className="equip-btn">
                      {item.equipped ? 'Unequip' : 'Equip'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'shop' && (
          <div className="items-grid">
            {shopItems.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🎉</div>
                <h3>You own everything!</h3>
                <p>Check back later for new items!</p>
              </div>
            ) : (
              shopItems.map(item => (
                <div key={item.id} className="item-card shop-item">
                  <div className="item-icon">{item.icon}</div>
                  <h3>{item.name}</h3>
                  <p className="item-category">{item.category}</p>
                  <div className="item-price">💰 {item.price} coins</div>
                  <div className="item-actions">
                    <button className="buy-btn">Buy Now</button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="achievements-grid">
            {achievements.map(achievement => (
              <div key={achievement.id} className={`achievement-card ${achievement.unlocked ? 'unlocked' : ''}`}>
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-info">
                  <h3>{achievement.name}</h3>
                  <p>{achievement.description}</p>
                  {achievement.unlocked ? (
                    <span className="unlocked-badge">✓ Unlocked!</span>
                  ) : (
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${achievement.progress}%` }}
                      />
                      <span className="progress-text">{achievement.progress}%</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="navigation-buttons">
        <button
          className="nav-btn secondary"
          onClick={() => navigate('/home')}
        >
          🏠 Back to Home
        </button>
        <button
          className="nav-btn primary"
          onClick={() => navigate('/editor')}
        >
          🎨 Edit Avatar
        </button>
      </div>
    </div>
  );
};

export default InventoryPage;