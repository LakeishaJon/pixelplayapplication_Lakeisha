import React, { useState, useEffect, useMemo } from 'react';
import { generateAvatarSVG } from '../utils/avatarUtils';
import '../styles/Avatar.css';

const AvatarDisplay = ({ 
  avatar, 
  size = 120, 
  showLevel = false, 
  level = 1,
  showBorder = true,
  borderColor = '#8B5CF6',
  className = '',
  onClick = null,
  showName = false,
  name = '',
  showCustomizeButton = false,
  onCustomize
}) => {
  const [error, setError] = useState(null);

  // Generate avatar safely
  const avatarSvg = useMemo(() => {
    if (!avatar || !avatar.style) {
      setError('Invalid avatar configuration');
      return null;
    }

    try {
      const svg = generateAvatarSVG(avatar);
      setError(null);
      return svg;
    } catch (err) {
      console.error('Error generating avatar:', err);
      setError('Error generating avatar');
      return null;
    }
  }, [avatar]);

  // Error fallback
  if (error) {
    return (
      <div 
        className={`avatar-display error ${className}`}
        style={{ width: size, height: size }}
      >
        <div className="avatar-error-message">❌ {error}</div>
      </div>
    );
  }

  // Empty fallback
  if (!avatarSvg) {
    return (
      <div 
        className={`avatar-display fallback ${className}`}
        style={{ 
          width: size, 
          height: size,
          backgroundColor: '#f0f0f0',
          borderRadius: showBorder ? '50%' : '8px',
          border: showBorder ? `3px solid ${borderColor}` : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.3,
          cursor: onClick ? 'pointer' : 'default'
        }}
        onClick={onClick}
      >
        👤
      </div>
    );
  }

  return (
    <div className={`avatar-display-container ${className}`}>
      <div 
        className={`avatar-display ${onClick ? 'clickable' : ''}`}
        style={{ 
          width: size, 
          height: size,
          borderRadius: showBorder ? '50%' : '8px',
          border: showBorder ? `3px solid ${borderColor}` : 'none',
          overflow: 'hidden',
          position: 'relative',
          cursor: onClick ? 'pointer' : 'default',
          background: 'white'
        }}
        onClick={onClick}
      >
        {/* Avatar SVG */}
        <div 
          className="avatar-svg"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          dangerouslySetInnerHTML={{ __html: avatarSvg }}
        />
        
        {/* Level Badge */}
        {showLevel && (
          <div 
            className="level-badge"
            style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              background: '#8B5CF6',
              color: 'white',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '0.75rem',
              fontWeight: 'bold',
              border: '2px solid white'
            }}
          >
            Lv {level}
          </div>
        )}

        {/* Customize Button */}
        {showCustomizeButton && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCustomize && onCustomize();
            }}
            style={{
              position: 'absolute',
              top: -5,
              right: -5,
              background: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '50%',
              width: 24,
              height: 24,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✏️
          </button>
        )}
      </div>

      {/* Avatar Name */}
      {showName && name && (
        <div 
          className="avatar-name"
          style={{
            marginTop: '8px',
            textAlign: 'center',
            fontSize: size * 0.1,
            fontWeight: '600',
            color: '#2D3748',
            maxWidth: size,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
        >
          {name}
        </div>
      )}
    </div>
  );
};

export default AvatarDisplay;
