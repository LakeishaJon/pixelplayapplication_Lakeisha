import React from 'react';

const StyleSelector = ({ currentStyle, onChange }) => {
  const styles = [
    { id: 'avataaars', name: 'Avataaars', description: 'Fun cartoon style' },
    { id: 'miniavs', name: 'Miniavs', description: 'Cute mini characters' },
    { id: 'personas', name: 'Personas', description: 'Professional look' }
  ];

  return (
    <div>
      <h4 style={{ marginBottom: '15px', color: '#333' }}>✨ Choose Avatar Style</h4>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {styles.map(style => (
          <div
            key={style.id}
            onClick={() => onChange(style.id)}
            style={{
              padding: '15px',
              border: currentStyle === style.id ? '3px solid #4CAF50' : '2px solid #ddd',
              borderRadius: '10px',
              cursor: 'pointer',
              background: currentStyle === style.id ? '#f0f8f0' : 'white',
              transition: 'all 0.3s ease'
            }}
          >
            <h5 style={{ margin: '0 0 5px 0', color: '#333' }}>{style.name}</h5>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>{style.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
