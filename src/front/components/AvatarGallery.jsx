import React, { useState } from 'react';
import AvatarDisplay from './AvatarDisplay';

const AvatarGallery = ({ 
  avatars, 
  onSelect, 
  onEdit, 
  onDelete,
  showActions = true,
  columns = 4 
}) => {
  const [selectedAvatars, setSelectedAvatars] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const handleAvatarClick = (avatar) => {
    if (onSelect) {
      onSelect(avatar);
    }
  };

  const toggleSelection = (avatarId) => {
    setSelectedAvatars(prev => 
      prev.includes(avatarId) 
        ? prev.filter(id => id !== avatarId)
        : [...prev, avatarId]
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px' 
      }}>
        <h3 style={{ color: '#333', margin: 0 }}>
          🎨 Avatar Collection ({avatars.length})
        </h3>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '8px 15px',
              background: viewMode === 'grid' ? '#4CAF50' : '#e0e0e0',
              color: viewMode === 'grid' ? 'white' : '#666',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📱 Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '8px 15px',
              background: viewMode === 'list' ? '#4CAF50' : '#e0e0e0',
              color: viewMode === 'list' ? 'white' : '#666',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            📋 List
          </button>
        </div>
      </div>

      {avatars.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          background: '#f9f9f9',
          borderRadius: '15px',
          color: '#666'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '20px' }}>🎨</div>
          <h4>No avatars yet!</h4>
          <p>Create your first avatar in the editor to get started.</p>
        </div>
      ) : (
        <div style={{
          display: viewMode === 'grid' ? 'grid' : 'flex',
          gridTemplateColumns: viewMode === 'grid' ? `repeat(${columns}, 1fr)` : 'none',
          flexDirection: viewMode === 'list' ? 'column' : 'row',
          gap: '20px'
        }}>
          {avatars.map(avatar => (
            <div
              key={avatar.id}
              style={{
                background: 'white',
                borderRadius: '15px',
                padding: '20px',
                border: '2px solid #e0e0e0',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                ':hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }
              }}
              onClick={() => handleAvatarClick(avatar)}
            >
              <AvatarDisplay 
                avatar={avatar.settings} 
                size={viewMode === 'grid' ? 80 : 60}
                showLevel={false}
              />
              
              <h5 style={{ 
                margin: '15px 0 10px 0', 
                color: '#333',
                fontSize: '16px'
              }}>
                {avatar.name}
              </h5>
              
              <p style={{ 
                margin: '0 0 15px 0', 
                color: '#666', 
                fontSize: '12px' 
              }}>
                Created: {new Date(avatar.createdAt).toLocaleDateString()}
              </p>
              
              {showActions && (
                <div style={{ 
                  display: 'flex', 
                  gap: '8px', 
                  justifyContent: 'center' 
                }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit && onEdit(avatar);
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    ✏️ Edit
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Delete this avatar?')) {
                        onDelete && onDelete(avatar.id);
                      }
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#f44336',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvatarGallery;
