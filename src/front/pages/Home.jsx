import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getUserData, requireAuth } from '../utils/auth';
import '../styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = getUserData();

  useEffect(() => {
    // Check authentication on component mount
    requireAuth('/login');
    setIsLoaded(true);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  const features = [
    {
      id: 'fitness-games',
      title: 'Fitness Games',
      description: 'Play fun fitness games that make exercise enjoyable',
      icon: '🎮',
      path: '/games',
      gradient: 'from-purple-400 to-blue-500'
    },
    {
      id: 'story-workout',
      title: 'Story Workout Creator',
      description: 'Create exciting story-based workout adventures',
      icon: '🏋️',
      path: '/story-creator',
      gradient: 'from-indigo-400 to-purple-500'
    },
    {
      id: 'avatar',
      title: 'Avatar Creator',
      description: 'Design your unique fitness character',
      icon: '🎨',
      path: '/avatar-editor',
      gradient: 'from-pink-400 to-purple-500'
    },
    {
      id: 'progress',
      title: 'Track Progress',
      description: 'Complete daily tasks and play mini-games',
      icon: '📈',
      path: '/habit-tracker',
      gradient: 'from-green-400 to-blue-500'
    },
    {
      id: 'rewards',
      title: 'Your Rewards',
      description: 'Unlock and collect awesome fitness rewards',
      icon: '🏆',
      path: '/reward-store',
      gradient: 'from-orange-400 to-red-500'
    }
  ];

  const stats = [
    { number: '8+', label: 'Fun Games' },
    { number: '50+', label: 'Achievements' },
    { number: '1000+', label: 'Happy Users' },
    { number: '∞', label: 'Fun Levels' }
  ];

  return (
    <div className="home-container">
      {/* Navigation Header */}
      <nav className="home-nav">
        <div className="nav-content">
          <div className="logo">
            <span className="logo-icon">🎮</span>
            <span className="logo-text">PixelPlay</span>
          </div>
          <div className="nav-actions">
            {user && (
              <span className="welcome-text">Welcome, {user.name || user.email}!</span>
            )}
            <button
              className="nav-button nav-button-secondary"
              onClick={() => handleNavigation('/dashboard')}
            >
              Dashboard
            </button>
            <button
              className="nav-button nav-button-primary"
              onClick={() => handleNavigation('/games')}
            >
              Play Now
            </button>
            <button
              className="nav-button nav-button-logout"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className={`hero-section ${isLoaded ? 'loaded' : ''}`}>
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to PixelPlay
            </h1>
            <p className="hero-subtitle">
              Turn fitness into an adventure with gamified workouts,
              avatar customization, and fun challenges that make
              staying healthy exciting.
            </p>
            <div className="hero-actions">
              <button
                className="cta-button cta-primary"
                onClick={() => handleNavigation('/story-creator')}
              >
                Start Your Journey
              </button>
              <button
                className="cta-button cta-secondary"
                onClick={() => handleNavigation('/dashboard')}
              >
                View Dashboard
              </button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="card-header">
                <span className="card-title">Your Fitness Adventure</span>
              </div>
              <div className="card-content">
                <div className="avatar-preview">
                  <div className="avatar-circle">
                    <span className="avatar-icon">👤</span>
                  </div>
                  <div className="avatar-info">
                    <span className="avatar-level">Level 1</span>
                    <span className="avatar-xp">0 XP</span>
                  </div>
                </div>
                <div className="preview-stats">
                  <div className="preview-stat">
                    <span className="stat-icon">🏋️</span>
                    <span className="stat-text">0 Workouts</span>
                  </div>
                  <div className="preview-stat">
                    <span className="stat-icon">🔥</span>
                    <span className="stat-text">0 Day Streak</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-content">
          <div className="section-header">
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle">
              A complete fitness gaming ecosystem designed to keep you motivated
            </p>
          </div>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`feature-card feature-card-${index + 1}`}
                onClick={() => handleNavigation(feature.path)}
              >
                <div className={`feature-icon bg-gradient-to-br ${feature.gradient}`}>
                  <span>{feature.icon}</span>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
                <div className="feature-arrow">→</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-content">
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Your Fitness Adventure?</h2>
          <p className="cta-text">
            Join thousands of users who have transformed their fitness routine into an exciting game.
          </p>
          <button
            className="cta-button cta-large"
            onClick={() => handleNavigation('/story-creator')}
          >
            Begin Your Journey
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <span className="logo-icon">🎮</span>
              <span className="logo-text">PixelPlay</span>
            </div>
            <p className="footer-tagline">Making fitness fun, one game at a time.</p>
          </div>
          <div className="footer-links">
            <button onClick={() => handleNavigation('/games')}>Games</button>
            <button onClick={() => handleNavigation('/dashboard')}>Dashboard</button>
            <button onClick={() => handleNavigation('/avatar-editor')}>Avatar</button>
            <button onClick={() => handleNavigation('/habit-tracker')}>Track Progress</button>
            <button onClick={() => handleNavigation('/reward-store')}>Rewards</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;