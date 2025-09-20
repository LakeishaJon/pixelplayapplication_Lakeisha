// src/front/components/Navigation.jsx
import React from 'react';
import { useAvatar } from '../Contexts/AvatarContext';
import AvatarDisplay from './AvatarDisplay';
import '../styles/Navigation.css';

const Navigation = ({ currentPage, onNavigate }) => {
  const { currentAvatar, userStats } = useAvatar();

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: '🏠' },
    { id: 'editor', label: 'Editor', icon: '🎨' },
    { id: 'inventory', label: 'Collection', icon: '🎒' }
  ];

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <h2>🎮 PixelPlay</h2>
        </div>

        {/* Navigation Items */}
        <div className="nav-items">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* User Info */}
        <div className="nav-user">
          <div className="user-stats">
            <div className="user-level">Level {userStats.level}</div>
            <div className="user-points">{userStats.points} pts</div>
          </div>

          <AvatarDisplay
            avatar={currentAvatar}
            size={50}
            className="nav-avatar"
            onClick={() => onNavigate('editor')}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

