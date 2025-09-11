import React, { useState, useMemo } from 'react';
import AvatarDisplay from './AvatarDisplay';

const AvatarGallery = ({ 
  users = [], 
  savedAvatars = [],
  onAvatarSelect = null,
  onCustomizeClick = null,
  onDeleteAvatar = null,
  showUserInfo = true,
  avatarSize = 120,
  columns = 3,
  title = "🎨 Avatar Gallery",
  emptyMessage = "No avatars to display",
  sortBy = "level", // "level", "username", "date", "workouts"
  filterBy = "all", // "all", "mine", "friends", "high-level"
  searchTerm = "",
  galleryType = "users" // "users" or "saved"
}) => {
  // 🎮 State for gallery interactions
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [currentSort, setCurrentSort] = useState(sortBy);
  const [currentFilter, setCurrentFilter] = useState(filterBy);
  const [currentSearch, setCurrentSearch] = useState(searchTerm);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // 🔍 Process and filter the data
  const processedData = useMemo(() => {
    let data = galleryType === 'saved' ? savedAvatars : users;
    
    // 🔍 Search filtering
    if (currentSearch) {
      data = data.filter(item => {
        const searchTarget = galleryType === 'saved' ? item.name : item.username;
        return searchTarget?.toLowerCase().includes(currentSearch.toLowerCase());
      });
    }

    // 🎯 Category filtering
    switch (currentFilter) {
      case 'mine':
        data = data.filter(item => item.isOwner || item.userId === 'currentUser');
        break;
      case 'friends':
        data = data.filter(item => item.isFriend);
        break;
      case 'high-level':
        data = data.filter(item => (item.level || 1) >= 10);
        break;
      default:
        // 'all' - no filtering
        break;
    }

    // 📊 Sorting
    switch (currentSort) {
      case 'username':
        data.sort((a, b) => {
          const nameA = galleryType === 'saved' ? a.name : a.username;
          const nameB = galleryType === 'saved' ? b.name : b.username;
          return nameA.localeCompare(nameB);
        });
        break;
      case 'level':
        data.sort((a, b) => (b.level || 1) - (a.level || 1));
        break;
      case 'date':
        data.sort((a, b) => new Date(b.timestamp || b.createdAt || 0) - new Date(a.timestamp || a.createdAt || 0));
        break;
      case 'workouts':
        data.sort((a, b) => (b.gameData?.totalWorkouts || 0) - (a.gameData?.totalWorkouts || 0));
        break;
      default:
        // No sorting
        break;
    }

    return data;
  }, [users, savedAvatars, currentSearch, currentFilter, currentSort, galleryType]);

  // 🖱️ Handle avatar selection
  const handleAvatarClick = (item) => {
    setSelectedAvatar(item);
    if (onAvatarSelect) {
      onAvatarSelect(item);
    }
  };

  // ✏️ Handle customization
  const handleCustomizeClick = (item) => {
    if (onCustomizeClick) {
      onCustomizeClick(item);
    }
  };

  // 🗑️ Handle deletion
  const handleDeleteClick = (item) => {
    if (onDeleteAvatar && window.confirm('Are you sure you want to delete this avatar?')) {
      onDeleteAvatar(item.id);
      setSelectedAvatar(null);
    }
  };

  // 📱 Calculate grid columns for responsive design
  const getGridClass = () => {
    const colSize = Math.floor(12 / columns);
    return `grid-item col-${colSize} col-md-${colSize} col-lg-${colSize}`;
  };

  // 🚫 Empty state
  if (!processedData || processedData.length === 0) {
    return (
      <div className="avatar-gallery-empty">
        <div className="text-center py-5">
          <div className="mb-3" style={{ fontSize: '4rem' }}>
            {galleryType === 'saved' ? '🎨' : '👥'}
          </div>
          <h4 className="pixel-font text-muted mb-3">{emptyMessage}</h4>
          <p className="text-muted">
            {galleryType === 'saved' 
              ? 'Create some avatars to see them here!' 
              : 'Add some users to see their avatars here!'
            }
          </p>
          {currentSearch && (
            <button 
              className="btn btn-outline-primary btn-sm mt-2"
              onClick={() => setCurrentSearch('')}
            >
              Clear Search
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="avatar-gallery">
      {/* 📋 Gallery Header */}
      <div className="gallery-header mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="pixel-font mb-0">{title}</h3>
          <div className="d-flex gap-2 align-items-center">
            <small className="text-muted">
              {processedData.length} avatar{processedData.length !== 1 ? 's' : ''}
            </small>
            
            {/* View Mode Toggle */}
            <div className="btn-group btn-group-sm" role="group">
              <button 
                className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                ⊞
              </button>
              <button 
                className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setViewMode('list')}
                title="List View"
              >
                ☰
              </button>
            </div>
          </div>
        </div>

        {/* 🔍 Search and Filters */}
        <div className="row g-3 mb-3">
          {/* Search Bar */}
          <div className="col-md-4">
            <div className="input-group input-group-sm">
              <span className="input-group-text">🔍</span>
              <input
                type="text"
                className="form-control"
                placeholder={`Search ${galleryType === 'saved' ? 'avatars' : 'users'}...`}
                value={currentSearch}
                onChange={(e) => setCurrentSearch(e.target.value)}
              />
              {currentSearch && (
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => setCurrentSearch('')}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Sort Options */}
          <div className="col-md-3">
            <select 
              className="form-select form-select-sm"
              value={currentSort}
              onChange={(e) => setCurrentSort(e.target.value)}
            >
              <option value="level">📊 Sort by Level</option>
              <option value="username">🔤 Sort by Name</option>
              <option value="date">📅 Sort by Date</option>
              {galleryType === 'users' && (
                <option value="workouts">💪 Sort by Workouts</option>
              )}
            </select>
          </div>

          {/* Filter Options */}
          <div className="col-md-3">
            <select 
              className="form-select form-select-sm"
              value={currentFilter}
              onChange={(e) => setCurrentFilter(e.target.value)}
            >
              <option value="all">👥 Show All</option>
              <option value="mine">👤 My Avatars</option>
              <option value="friends">👫 Friends</option>
              <option value="high-level">⭐ High Level</option>
            </select>
          </div>

          {/* Avatar Size Slider */}
          <div className="col-md-2">
            <div className="d-flex align-items-center gap-2">
              <small className="text-muted">Size:</small>
              <input 
                type="range" 
                min="60" 
                max="200" 
                value={avatarSize}
                className="form-range"
                onChange={(e) => {
                  // This would need to be controlled by parent component
                  console.log('Avatar size changed:', e.target.value);
                }}
                title={`Avatar size: ${avatarSize}px`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 🖼️ Avatar Grid */}
      <div className={`avatar-grid ${viewMode}`}>
        {viewMode === 'grid' ? (
          <div className="row g-3">
            {processedData.map((item) => (
              <div key={item.id} className={getGridClass()}>
                <div className="avatar-gallery-item text-center">
                  <AvatarDisplay
                    user={galleryType === 'saved' ? { ...item, username: item.name } : item}
                    size={avatarSize}
                    showLevel={true}
                    showCustomization={galleryType === 'saved'}
                    clickable={true}
                    onAvatarClick={() => handleAvatarClick(item)}
                    onCustomizeClick={() => handleCustomizeClick(item)}
                    newlyUnlocked={item.level >= 20 || item.isNew}
                    theme={item.theme || 'default'}
                  />
                  
                  {showUserInfo && (
                    <div className="mt-2">
                      <div className="pixel-font fw-bold" style={{ fontSize: '14px' }}>
                        {galleryType === 'saved' ? item.name : item.username}
                      </div>
                      <small className="text-muted d-block">
                        Level {item.level || 1}
                      </small>
                      {galleryType === 'saved' && item.timestamp && (
                        <small className="text-muted d-block">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </small>
                      )}
                      {galleryType === 'users' && item.gameData?.totalWorkouts && (
                        <small className="text-success d-block">
                          💪 {item.gameData.totalWorkouts} workouts
                        </small>
                      )}
                    </div>
                  )}

                  {/* Quick Actions for Saved Avatars */}
                  {galleryType === 'saved' && (
                    <div className="mt-2 d-flex gap-1 justify-content-center">
                      <button 
                        className="btn btn-primary btn-sm"
                        onClick={() => handleCustomizeClick(item)}
                        title="Edit Avatar"
                      >
                        ✏️
                      </button>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleAvatarClick(item)}
                        title="Use Avatar"
                      >
                        ✨
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteClick(item)}
                        title="Delete Avatar"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* 📋 List View */
          <div className="avatar-list">
            {processedData.map((item) => (
              <div 
                key={item.id} 
                className={`avatar-list-item d-flex align-items-center p-3 mb-2 border rounded ${
                  selectedAvatar?.id === item.id ? 'border-primary bg-light' : ''
                }`}
                style={{ cursor: 'pointer' }}
                onClick={() => handleAvatarClick(item)}
              >
                <div className="me-3">
                  <AvatarDisplay
                    user={galleryType === 'saved' ? { ...item, username: item.name } : item}
                    size={60}
                    showLevel={true}
                    showCustomization={false}
                    clickable={false}
                  />
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-1 pixel-font">
                    {galleryType === 'saved' ? item.name : item.username}
                  </h6>
                  <div className="d-flex gap-3 text-muted small">
                    <span>📊 Level {item.level || 1}</span>
                    {galleryType === 'users' && item.gameData?.totalWorkouts && (
                      <span>💪 {item.gameData.totalWorkouts} workouts</span>
                    )}
                    {galleryType === 'saved' && item.timestamp && (
                      <span>📅 {new Date(item.timestamp).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="d-flex gap-2">
                  {galleryType === 'saved' && (
                    <>
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCustomizeClick(item);
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn btn-outline-danger btn-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(item);
                        }}
                      >
                        🗑️
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🔍 Selected Avatar Details */}
      {selectedAvatar && showUserInfo && (
        <div className="selected-avatar-info mt-4 p-3 bg-light border rounded">
          <div className="row align-items-center">
            <div className="col-auto">
              <AvatarDisplay
                user={galleryType === 'saved' ? { ...selectedAvatar, username: selectedAvatar.name } : selectedAvatar}
                size={80}
                showLevel={true}
                showCustomization={false}
              />
            </div>
            <div className="col">
              <h5 className="mb-1 pixel-font">
                📍 Selected: {galleryType === 'saved' ? selectedAvatar.name : selectedAvatar.username}
              </h5>
              <div className="row text-sm">
                <div className="col-md-6">
                  <strong>Level:</strong> {selectedAvatar.level || 1}<br/>
                  <strong>Style:</strong> {selectedAvatar.avatarData?.style || selectedAvatar.settings?.style || 'adventurer'}
                </div>
                <div className="col-md-6">
                  {galleryType === 'users' && selectedAvatar.gameData && (
                    <>
                      <strong>Workouts:</strong> {selectedAvatar.gameData.totalWorkouts || 0}<br/>
                      <strong>Points:</strong> {selectedAvatar.gameData.fitnessPoints || 0}
                    </>
                  )}
                  {galleryType === 'saved' && (
                    <>
                      <strong>Created:</strong> {selectedAvatar.timestamp ? new Date(selectedAvatar.timestamp).toLocaleDateString() : 'Unknown'}<br/>
                      <strong>Tags:</strong> {selectedAvatar.tags?.join(', ') || 'None'}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex gap-2">
                {galleryType === 'saved' ? (
                  <>
                    <button 
                      className="btn btn-primary btn-sm pixel-font"
                      onClick={() => handleCustomizeClick(selectedAvatar)}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      className="btn btn-success btn-sm pixel-font"
                      onClick={() => onAvatarSelect && onAvatarSelect(selectedAvatar)}
                    >
                      ✨ Use
                    </button>
                  </>
                ) : (
                  <button 
                    className="btn btn-primary btn-sm pixel-font"
                    onClick={() => handleCustomizeClick(selectedAvatar)}
                  >
                    👀 View Profile
                  </button>
                )}
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setSelectedAvatar(null)}
                >
                  ✕ Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 📊 Gallery Stats */}
      <div className="gallery-stats mt-4 text-center">
        <div className="row">
          <div className="col-md-3">
            <small className="text-muted">
              📊 Total: <strong>{processedData.length}</strong>
            </small>
          </div>
          <div className="col-md-3">
            <small className="text-muted">
              ⭐ High Level: <strong>{processedData.filter(item => (item.level || 1) >= 10).length}</strong>
            </small>
          </div>
          <div className="col-md-3">
            <small className="text-muted">
              🆕 New: <strong>{processedData.filter(item => item.isNew).length}</strong>
            </small>
          </div>
          <div className="col-md-3">
            <small className="text-muted">
              🔍 Filtered: <strong>{currentSearch || currentFilter !== 'all' ? 'Yes' : 'No'}</strong>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarGallery;