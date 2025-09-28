import React, { useMemo } from 'react';
import { generateAvatarSVG } from '../utils/avatarUtils';
import '../styles/Avatar.css';

const AvatarDisplay = ({ 
  avatar, 
  size = 120, 
  showLevel = false, 
  level = 1,
  showBorder = true,
  borderColor = '#667eea',
  className = '',
  onClick = null,
  showName = false,
  name = '',
  showCustomizeButton = false,
  onCustomize
}) => {
  // Generate avatar using your utils function (supports all 12 styles)
  const avatarSvg = useMemo(() => {
    if (!avatar || !avatar.style) {
      return null;
    }
    
    try {
      return generateAvatarSVG(avatar);
    } catch (error) {
      console.error('Error generating avatar:', error);
      return null;
    }
  }, [avatar]);

  // Handle fallback if avatar generation fails
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
        {/* Use SVG directly instead of img with data URI */}
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
        {showLevel && level && (
          <div 
            className="level-badge"
            style={{
              position: 'absolute',
              bottom: '-5px',
              right: '-5px',
              backgroundColor: '#fbbf24',
              color: 'white',
              borderRadius: '50%',
              width: size * 0.25,
              height: size * 0.25,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: size * 0.12,
              fontWeight: 'bold',
              border: '2px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            {level}
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

// Keep your existing AvatarGallery and AvatarComparison components as they are

export default AvatarDisplay;