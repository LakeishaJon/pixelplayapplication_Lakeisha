import React from 'react';

const ItemSelector = ({ title, category, currentValue, availableItems, onChange }) => {
  return (
    <div>
      <h4 style={{ marginBottom: '15px', color: '#333' }}>{title}</h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '10px' }}>
        {availableItems.map(item => (
          <button
            key={item}
            onClick={() => onChange(item)}
            style={{
              padding: '15px 10px',
              border: currentValue === item ? '3px solid #4CAF50' : '2px solid #ddd',
              borderRadius: '10px',
              background: currentValue === item ? '#f0f8f0' : 'white',
              cursor: 'pointer',
              textAlign: 'center',
              fontSize: '14px',
              fontWeight: currentValue === item ? 'bold' : 'normal',
              color: '#333',
              transition: 'all 0.3s ease'
            }}
          >
            {item.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
          </button>
        ))}
      </div>
      
      {availableItems.length === 0 && (
        <p style={{ 
          textAlign: 'center', 
          color: '#666', 
          fontStyle: 'italic',
          padding: '20px',
          background: '#f5f5f5',
          borderRadius: '10px'
        }}>
          Complete workouts to unlock more {category}! 💪
        </p>
      )}
    </div>
  );
};

export default ItemSelector;
