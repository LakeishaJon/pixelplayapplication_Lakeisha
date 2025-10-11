import React, { useState, useEffect } from 'react';
import { generateAvatarURL } from '../utils/avatarUtils';

const AvatarDisplay = ({ config, size = 'large' }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Size configurations
  const sizes = {
    small: { width: '100px', height: '100px' },
    medium: { width: '150px', height: '150px' },
    large: { width: '200px', height: '200px' },
    xlarge: { width: '300px', height: '300px' }
  };

  useEffect(() => {
    if (!config) {
      setLoading(false);
      return;
    }

    console.log('🎨 AvatarDisplay received config:', config);
    setLoading(true);
    setError(null);

    try {
      // Generate the avatar URL using the API
      const url = generateAvatarURL(config);

      if (url) {
        console.log('✅ Avatar URL generated successfully');
        setAvatarUrl(url);
      } else {
        console.error('❌ Failed to generate avatar URL');
        setError('Could not generate avatar');
      }
    } catch (err) {
      console.error('❌ Error in AvatarDisplay:', err);
      setError('Error displaying avatar');
    } finally {
      setLoading(false);
    }
  }, [config]);

  // Show loading state
  if (loading) {
    return (
      <div className="avatar-display loading" style={{ textAlign: 'center', padding: '2rem' }}>
        <div className="spinner" style={{ fontSize: '2rem' }}>⏳</div>
        <p>Loading avatar...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="avatar-display error" style={{ textAlign: 'center', padding: '2rem', color: '#dc3545' }}>
        <div className="error-icon" style={{ fontSize: '2rem' }}>❌</div>
        <p>{error}</p>
      </div>
    );
  }

  // Get size dimensions
  const dimensions = sizes[size] || sizes.large;

  // Show the avatar!
  return (
    <div className="avatar-display" style={{ textAlign: 'center' }}>
      {avatarUrl ? (
        <div className="avatar-container" style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
          display: 'inline-block'
        }}>
          <img
            src={avatarUrl}
            alt="Avatar"
            className="avatar-image"
            style={{
              width: dimensions.width,
              height: dimensions.height,
              borderRadius: '50%',
              background: 'white',
              padding: '1rem',
              boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)'
            }}
            onError={(e) => {
              console.error('❌ Image failed to load');
              setError('Failed to load avatar image');
            }}
          />
        </div>
      ) : (
        <div className="no-avatar" style={{ padding: '2rem' }}>
          <p style={{ fontSize: '4rem' }}>👤</p>
          <p>No avatar to display</p>
        </div>
      )}
    </div>
  );
};

export default AvatarDisplay;

