import React from 'react';

const ColorPalette = ({ avatar, availableColors, onChange }) => {
  const colorMap = {
    blue: '#2196F3',
    red: '#F44336',
    green: '#4CAF50',
    purple: '#9C27B0',
    orange: '#FF9800',
    yellow: '#FFEB3B',
    pink: '#E91E63',
    brown: '#795548',
    black: '#424242',
    white: '#FAFAFA'
  };

  return (
    <div>
      <h4 style={{ marginBottom: '15px', color: '#333' }}>🎨 Choose Colors</h4>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Hair Color:
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {availableColors.map(color => (
            <button
              key={color}
              onClick={() => onChange({ hairColor: [color] })}
              style={{
                width: '40px',
                height: '40px',
                background: colorMap[color] || color,
                border: avatar.hairColor && avatar.hairColor[0] === color 
                  ? '3px solid #333' 
                  : '2px solid #ddd',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
              title={color}
            />
          ))}
        </div>
      </div>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Clothing Color:
        </label>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {availableColors.map(color => (
            <button
              key={color}
              onClick={() => onChange({ clothingColor: [color] })}
              style={{
                width: '40px',
                height: '40px',
                background: colorMap[color] || color,
                border: avatar.clothingColor && avatar.clothingColor[0] === color 
                  ? '3px solid #333' 
                  : '2px solid #ddd',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
              title={color}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
