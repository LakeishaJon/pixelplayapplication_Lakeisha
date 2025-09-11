import React from 'react';
import { createAvatar } from '@dicebear/core';
import { avataaars, miniavs, personas } from '@dicebear/collection';

const AvatarDisplay = ({
  avatar,
  size = 100,
  showLevel = false,
  level = 1,
  onClick,
  className = '',
  showCustomizeButton = false,
  onCustomize
}) => {
  // Choose which avatar style to use
  const getAvatarStyle = (styleName) => {
    switch (styleName) {
      case 'miniavs': return miniavs;
      case 'personas': return personas;
      default: return avataaars;
    }
  };

  // Create the avatar image
  const generateAvatar = () => {
    try {
      const style = getAvatarStyle(avatar.style);
      const avatarSvg = createAvatar(style, {
        seed: avatar.seed,
        ...avatar // Include all other settings
      });
      return avatarSvg.toDataUri();
    } catch (error) {
      console.error('Error generating avatar:', error);
      // Return a simple fallback avatar
      const fallback = createAvatar(avataaars, { seed: 'fallback' });
      return fallback.toDataUri();
    }
  };

  return (
    <div
      className={`avatar-display ${className}`}
      style={{
        position: 'relative',
        display: 'inline-block',
        cursor: onClick ? 'pointer' : 'default'
      }}
      onClick={onClick}
    >
      {/* The avatar image */}
      <img
        src={generateAvatar()}
        alt="Avatar"
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          border: '3px solid #4CAF50',
          background: 'white'
        }}
      />

      {/* Level badge - like a trophy sticker */}
      {showLevel && (
        <div
          style={{
            position: 'absolute',
            bottom: -5,
            right: -5,
            background: '#FF6B35',
            color: 'white',
            borderRadius: '50%',
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '12px',
            fontWeight: 'bold',
            border: '2px solid white'
          }}
        >
          {level}
        </div>
      )}

      {/* Customize button - like an edit pencil */}
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
  );
};

export default AvatarDisplay;
