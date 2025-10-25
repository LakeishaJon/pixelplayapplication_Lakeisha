import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, logout, requireAuth } from '../utils/auth';
import '../styles/Dashboard.css';

// ===================================
// 🎯 IMPORT THE STATS HOOK
// ===================================
// Make sure you have useUserStats.js in your hooks folder!
// If not, copy it from the previous files
import { useUserStats } from '../hooks/useUserStats';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = getUserData();

  // ===================================
  // 📊 USE THE STATS HOOK FOR REAL DATA
  // ===================================
  const { userStats, loading: statsLoading, refreshStats } = useUserStats();

  // Local loading state for page initialization
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleNavigation = (route) => {
    switch (route) {
      case 'home':
        navigate('/');
        break;
      case 'games':
        navigate('/games');
        break;
      case 'workout':
        navigate('/story-creator');
        break;
      case 'editor':
        navigate('/avatar-editor');
        break;
      case 'inventory':
        navigate('/collection');
        break;
      default:
        console.log(`Navigation to ${route} not implemented`);
    }
  };

  const quickActions = [
    {
      id: 'workout',
      title: 'Start Workout',
      description: 'Begin your fitness journey',
      icon: '💪',
      gradient: 'from-orange-400 to-red-500',
      action: () => handleNavigation('workout')
    },
    {
      id: 'games',
      title: 'Play Games',
      description: 'Fun fitness games',
      icon: '🎮',
      gradient: 'from-purple-400 to-blue-500',
      action: () => handleNavigation('games')
    },
    {
      id: 'avatar',
      title: 'Customize Avatar',
      description: 'Edit your character',
      icon: '🎨',
      gradient: 'from-pink-400 to-purple-500',
      action: () => handleNavigation('editor')
    },
    {
      id: 'collection',
      title: 'View Collection',
      description: 'See your gear',
      icon: '🎒',
      gradient: 'from-green-400 to-blue-500',
      action: () => handleNavigation('inventory')
    }
  ];

  if (loading || statsLoading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // Calculate level progress
  const currentLevelXP = (userStats.level - 1) * 100;
  const nextLevelXP = userStats.level * 100;
  const xpInCurrentLevel = userStats.xp - currentLevelXP;
  const xpNeededForLevel = nextLevelXP - currentLevelXP;
  const levelProgress = (xpInCurrentLevel / xpNeededForLevel) * 100;

  return (
    <div className="dashboard-container">
      {/* Navigation Bar */}
      <nav className="dashboard-nav">
        <div className="nav-content">
          <div className="nav-left">
            <div className="logo">
              <span className="logo-icon">🎮</span>
              <span className="logo-text">PixelPlay</span>
            </div>
          </div>
          <div className="nav-center">
            <button
              className="nav-btn nav-btn-active"
              onClick={() => handleNavigation('home')}
            >
              <span className="nav-btn-icon">🏠</span>
              Home
            </button>
            <button
              className="nav-btn"
              onClick={() => handleNavigation('editor')}
            >
              <span className="nav-btn-icon">🎨</span>
              Editor
            </button>
            <button
              className="nav-btn"
              onClick={() => handleNavigation('inventory')}
            >
              <span className="nav-btn-icon">👜</span>
              Collection
            </button>
          </div>
          <div className="nav-right">
            {/* ✅ REAL LEVEL AND POINTS FROM BACKEND */}
            <div className="user-level">
              <span className="level-label">Level {userStats.level}</span>
              <span className="points-label">{userStats.xp} pts</span>
            </div>
            <div className="avatar-badge">
              <span>👤</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard Content */}
      <main className="dashboard-main">
        {/* Header Section */}
        <section className="dashboard-header">
          <div className="header-content">
            <div className="welcome-text">
              <h1>Welcome Back Champion!</h1>
              <p>Ready to continue your fitness journey?</p>
            </div>
            {/* ✅ REAL LEVEL AND XP FROM BACKEND */}
            <div className="level-display">
              <div className="level-badge">
                <span className="level-title">Level {userStats.level}</span>
                <span className="xp-amount">⭐ {userStats.xp} XP</span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats and Avatar Section */}
        <section className="stats-avatar-section">
          <div className="section-grid">

            {/* Avatar Card */}
            <div className="avatar-section">
              <div className="avatar-card">
                <h2>Your Avatar</h2>
                <div className="avatar-display">
                  <div className="avatar-circle">
                    <div className="avatar-placeholder">
                      <span style={{ fontSize: '3rem' }}>👤</span>
                    </div>
                    <button
                      className="avatar-edit-badge"
                      onClick={() => handleNavigation('editor')}
                      title="Edit Avatar"
                    >
                      <span>✏️</span>
                    </button>
                  </div>
                </div>
                <button
                  className="customize-btn"
                  onClick={() => handleNavigation('editor')}
                >
                  Customize Avatar
                </button>
              </div>
            </div>

            {/* ===================================
                🎯 UPDATED: STATS GRID WITH REAL DATA
                =================================== */}
            <div className="stats-section">
              <div className="stats-grid-container">

                {/* ✅ WORKOUTS - Real data from backend */}
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-icon">🏋️</span>
                    <span className="stat-label">WORKOUTS</span>
                  </div>
                  <div className="stat-value">{userStats.totalGamesPlayed}</div>
                  <div className="stat-subtitle">Completed</div>
                </div>

                {/* ✅ ACTIVE TIME - Calculated from games (estimate) */}
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-icon">⏱️</span>
                    <span className="stat-label">ACTIVE TIME</span>
                  </div>
                  <div className="stat-value">{userStats.totalGamesPlayed * 8}</div>
                  <div className="stat-subtitle">Minutes</div>
                </div>

                {/* ✅ XP EARNED - Real XP from backend */}
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-icon">⭐</span>
                    <span className="stat-label">XP EARNED</span>
                  </div>
                  <div className="stat-value">{userStats.xp}</div>
                  <div className="stat-subtitle">Total Points</div>
                </div>

                {/* ✅ STREAK - Real streak from backend */}
                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-icon">🔥</span>
                    <span className="stat-label">STREAK</span>
                  </div>
                  <div className="stat-value">{userStats.weeklyStreak}</div>
                  <div className="stat-subtitle">Days</div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Section */}
        <section className="quick-actions-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map(action => (
              <button
                key={action.id}
                className={`action-card bg-gradient-to-br ${action.gradient}`}
                onClick={action.action}
              >
                <div className="action-content">
                  <div className="action-icon">{action.icon}</div>
                  <h3 className="action-title">{action.title}</h3>
                  <p className="action-description">{action.description}</p>
                </div>
                <div className="action-arrow">→</div>
              </button>
            ))}
          </div>
        </section>

        {/* ===================================
            🎯 UPDATED: PROGRESS SECTION WITH REAL DATA
            =================================== */}
        <section className="progress-section" style={{ padding: '2rem', display: 'flex', justifyContent: 'center' }}>
          <div
            className="progress-card"
            style={{
              background: 'linear-gradient(135deg, #a855f7, #E32BED, #fb923c)',
              borderRadius: '24px',
              padding: '2rem',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              color: '#fff',
              width: '100%',
              maxWidth: '800px',
            }}
          >
            <h2 className="section-title" style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
              Your Progress
            </h2>

            <div className="progress-info">
              {/* ✅ REAL LEVEL AND XP */}
              <div className="progress-level" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', marginBottom: '1rem' }}>
                <span>Level {userStats.level}</span>
                <span>{userStats.xp} XP</span>
              </div>

              {/* ✅ REAL PROGRESS BAR */}
              <div className="progress-bar-container" style={{ background: 'rgba(255, 255, 255, 0.2)', borderRadius: '10px', height: '12px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                <div
                  className="progress-bar"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '10px',
                  }}
                >
                  <div
                    className="progress-fill"
                    style={{
                      width: `${levelProgress}%`,
                      background: 'rgba(255, 255, 255, 0.9)',
                      height: '100%',
                      transition: 'width 0.5s ease-in-out',
                    }}
                  ></div>
                </div>
              </div>

              {/* ✅ REAL XP NEEDED */}
              <span className="progress-text" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Next Level: {xpNeededForLevel - xpInCurrentLevel} XP to go
              </span>
            </div>

            {/* Optional: Refresh button */}
            <button
              onClick={refreshStats}
              style={{
                marginTop: '1.5rem',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
            >
              🔄 Refresh Stats
            </button>
          </div>
        </section>

        {/* ===================================
            💎 BONUS: ADDITIONAL STATS DISPLAY
            =================================== */}
        <section className="additional-stats" style={{ padding: '2rem' }}>
          <div style={{
            background: 'linear-gradient(to right top, #fb735f, #ff6871, #ff5f85, #ff599c, #ff58b5, #fa5ec4, #f365d2, #eb6ce0, #df74e4, #d37be6, #c881e7, #bd86e7)',
            borderRadius: '20px',
            padding: '2rem',
            color: 'white',
            maxWidth: '800px',
            margin: '0 auto'
          }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.3rem', fontWeight: '700', textAlign: 'center' }}>
              🎮 Your Gaming Stats
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
              gap: '1rem'
            }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🪙</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{userStats.coins}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Total Coins</div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔓</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{userStats.unlockedGames?.length || 3}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Games Unlocked</div>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.15)',
                padding: '1rem',
                borderRadius: '12px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{userStats.totalGamesPlayed}</div>
                <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Total Games</div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;