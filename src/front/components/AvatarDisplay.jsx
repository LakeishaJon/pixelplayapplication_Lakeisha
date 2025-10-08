import React, { useState, useEffect } from 'react';
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
  const [avatarSvg, setAvatarSvg] = useState(null);

  // CRITICAL FIX: Use useEffect instead of useMemo to ensure updates
  useEffect(() => {
    // Validate avatar has minimum required fields
    if (!avatar) {
      console.warn('⚠️ AvatarDisplay: No avatar provided');
      setError('No avatar data');
      setAvatarSvg(null);
      return;
    }

    if (!avatar.style) {
      console.warn('⚠️ AvatarDisplay: Avatar missing style property');
      setError('No style selected');
      setAvatarSvg(null);
      return;
    }

    try {
      console.log('🎨 Generating avatar SVG for:', avatar);
      const svg = generateAvatarSVG(avatar);

      if (!svg) {
        throw new Error('generateAvatarSVG returned null');
      }

      setAvatarSvg(svg);
      setError(null);
      console.log('✅ Avatar SVG generated successfully');
    } catch (err) {
      console.error('❌ Error generating avatar:', err);
      setError('Error generating avatar');
      setAvatarSvg(null);
    }
  }, [
    avatar,
    // Watch specific properties to ensure React detects changes
    avatar?.style,
    avatar?.hair,
    avatar?.clothing,
    avatar?.accessories,
    avatar?.skinColor,
    avatar?.hairColor,
    avatar?.clothingColor,
    avatar?._updateTimestamp, // Our force-update timestamp
    JSON.stringify(avatar) // Fallback: stringify to catch any deep changes
  ]);

  // Error fallback with helpful message
  if (error) {
    return (
      <div
        className={`avatar-display error ${className}`}
        style={{
          width: size,
          height: size,
          borderRadius: showBorder ? '50%' : '8px',
          border: showBorder ? `3px solid ${borderColor}` : 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#DC2626',
          fontSize: size * 0.15,
          fontWeight: '600',
          textAlign: 'center',
          padding: '1rem'
        }}
      >
        <div style={{ fontSize: size * 0.3, marginBottom: '0.5rem' }}>⚠️</div>
        <div>{error}</div>
        {error === 'No style selected' && (
          <div style={{ fontSize: size * 0.1, marginTop: '0.5rem', opacity: 0.7 }}>
            Choose a style to begin
          </div>
        )}
      </div>
    );
  }

  // Loading/Empty fallback
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
          cursor: onClick ? 'pointer' : 'default',
          position: 'relative'
        }}
        onClick={onClick}
      >
        <div style={{ textAlign: 'center' }}>
          <div>👤</div>
          <div style={{ fontSize: size * 0.1, marginTop: '0.5rem', color: '#6B7280' }}>
            Loading...
          </div>
        </div>
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