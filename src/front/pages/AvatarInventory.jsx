import React from 'react';
import { useAvatar } from '../contexts/AvatarContext.jsx';
import AvatarDisplay from '../components/AvatarDisplay.jsx';

const AvatarInventory = ({ onNavigate }) => {
  const { savedAvatars, inventory } = useAvatar();

  return (
    <div className="inventory-page" style={{ padding: '20px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>🎒 Your Collection</h2>

      {/* Saved Avatars */}
      <section style={{ marginBottom: '40px' }}>
        <h3>Saved Avatars</h3>
        {savedAvatars.length === 0 ? (
          <p>You haven't saved any avatars yet!</p>
        ) : (
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {savedAvatars.map((avatar) => (
              <div key={avatar.id} style={{ textAlign: 'center' }}>
                <AvatarDisplay avatar={avatar.settings} size={100} />
                <p>{avatar.name}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Inventory Items */}
      <section>
        <h3>Inventory</h3>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {Object.entries(inventory).map(([category, items]) => (
            <div key={category} style={{ minWidth: '150px' }}>
              <h4 style={{ textTransform: 'capitalize' }}>{category}</h4>
              {items.length === 0 ? (
                <p>No items</p>
              ) : (
                <ul>
                  {items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Navigation Buttons */}
      <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
        <button
          onClick={() => onNavigate('dashboard')}
          style={{
            padding: '10px 20px',
            background: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          🏠 Back to Dashboard
        </button>

        <button
          onClick={() => onNavigate('editor')}
          style={{
            padding: '10px 20px',
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          🎨 Edit Avatar
        </button>
      </div>
    </div>
  );
};

export default AvatarInventory;
