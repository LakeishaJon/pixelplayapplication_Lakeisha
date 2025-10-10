import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserData, logout, requireAuth } from '../utils/auth';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const user = getUserData();
  <span>Welcome, {user?.name}!</span>

  const [userStats, setUserStats] = useState({
    level: 1,
    points: 0,
    streakDays: 0
  });

  const [todayStats, setTodayStats] = useState({
    workoutsCompleted: 0,
    minutesExercised: 0,
    pointsEarned: 0
  });

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
        navigate('/inventory');
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

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

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
            <div className="user-level">
              <span className="level-label">Level {userStats.level}</span>
              <span className="points-label">{userStats.points} pts</span>
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
            <div className="level-display">
              <div className="level-badge">
                <span className="level-title">Level {userStats.level}</span>
                <span className="xp-amount">⭐ {userStats.points} XP</span>
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

            {/* Stats Grid */}
            <div className="stats-section">
              <div className="stats-grid-container">

                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-icon">🏋️</span>
                    <span className="stat-label">WORKOUTS</span>
                  </div>
                  <div className="stat-value">{todayStats.workoutsCompleted}</div>
                  <div className="stat-subtitle">Completed</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-icon">⏱️</span>
                    <span className="stat-label">ACTIVE TIME</span>
                  </div>
                  <div className="stat-value">{todayStats.minutesExercised}</div>
                  <div className="stat-subtitle">Minutes</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-icon">⭐</span>
                    <span className="stat-label">XP EARNED</span>
                  </div>
                  <div className="stat-value">{todayStats.pointsEarned}</div>
                  <div className="stat-subtitle">Total Points</div>
                </div>

                <div className="stat-card">
                  <div className="stat-header">
                    <span className="stat-icon">🔥</span>
                    <span className="stat-label">STREAK</span>
                  </div>
                  <div className="stat-value">{userStats.streakDays}</div>
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

        {/* Progress Section */}
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
              <div className="progress-level" style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '600', marginBottom: '1rem' }}>
                <span>Level {userStats.level}</span>
                <span>{userStats.points} XP</span>
              </div>

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
                      width: `${userStats.points % 100}%`,
                      background: 'rgba(255, 255, 255, 0.9)',
                      height: '100%',
                      transition: 'width 0.5s ease-in-out',
                    }}
                  ></div>
                </div>
              </div>

              <span className="progress-text" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                Next Level: {100 - (userStats.points % 100)} XP to go
              </span>
            </div>
          </div>
        </section>


      </main>
    </div>
  );
};

export default Dashboard;