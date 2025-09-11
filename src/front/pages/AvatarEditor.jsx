import React, { useState, useEffect } from 'react';

const AvatarEditor = () => {
  // Mock user data - replace with actual hooks
  const [currentAvatar, setCurrentAvatar] = useState({
    hair: 'short-brown',
    clothing: 'casual-blue',
    accessories: [],
    colors: {
      skin: '#FDBCB4',
      hair: '#8B4513',
      clothing: '#4A90E2'
    },
    style: 'casual'
  });

  const [previewAvatar, setPreviewAvatar] = useState({ ...currentAvatar });
  const [activeTab, setActiveTab] = useState('hair');
  const [avatarName, setAvatarName] = useState('');
  const [userLevel, setUserLevel] = useState(5);
  const [savedAvatars, setSavedAvatars] = useState([]);

  // Mock inventory data
  const inventory = {
    hair: [
      { id: 'short-brown', name: 'Short Brown', level: 1, emoji: '👦' },
      { id: 'long-blonde', name: 'Long Blonde', level: 2, emoji: '👱‍♀️' },
      { id: 'curly-black', name: 'Curly Black', level: 3, emoji: '👨‍🦱' },
      { id: 'spiky-red', name: 'Spiky Red', level: 4, emoji: '🦰' },
      { id: 'bald', name: 'Bald', level: 1, emoji: '👨‍🦲' }
    ],
    clothing: [
      { id: 'casual-blue', name: 'Casual Blue', level: 1, emoji: '👕' },
      { id: 'formal-black', name: 'Formal Black', level: 3, emoji: '🤵' },
      { id: 'sporty-red', name: 'Sporty Red', level: 2, emoji: '🏃‍♂️' },
      { id: 'hoodie-gray', name: 'Gray Hoodie', level: 4, emoji: '🧥' },
      { id: 'dress-purple', name: 'Purple Dress', level: 5, emoji: '👗' }
    ],
    accessories: [
      { id: 'glasses', name: 'Glasses', level: 1, emoji: '👓' },
      { id: 'hat', name: 'Baseball Cap', level: 2, emoji: '🧢' },
      { id: 'headphones', name: 'Headphones', level: 3, emoji: '🎧' },
      { id: 'sunglasses', name: 'Sunglasses', level: 4, emoji: '🕶️' },
      { id: 'crown', name: 'Crown', level: 10, emoji: '👑' }
    ],
    colors: {
      skin: ['#FDBCB4', '#F1C27D', '#E0AC69', '#C68642', '#8D5524'],
      hair: ['#000000', '#8B4513', '#D2691E', '#FFD700', '#FF6347'],
      clothing: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']
    }
  };

  const styles = [
    { id: 'casual', name: 'Casual', emoji: '😊' },
    { id: 'formal', name: 'Formal', emoji: '🎩' },
    { id: 'sporty', name: 'Sporty', emoji: '💪' },
    { id: 'artistic', name: 'Artistic', emoji: '🎨' }
  ];

  const getItemsForLevel = (userLevel, items) => {
    return items.filter(item => item.level <= userLevel);
  };

  const handleAvatarChange = (changes) => {
    setPreviewAvatar({ ...previewAvatar, ...changes });
  };

  const handleColorChange = (colorType, color) => {
    setPreviewAvatar({
      ...previewAvatar,
      colors: {
        ...previewAvatar.colors,
        [colorType]: color
      }
    });
  };

  const handleSave = () => {
    if (avatarName.trim()) {
      const newAvatar = {
        id: Date.now(),
        name: avatarName,
        config: { ...previewAvatar }
      };
      setSavedAvatars([...savedAvatars, newAvatar]);
      setAvatarName('');
      alert('Avatar saved! 🎉');
    } else {
      alert('Please give your avatar a name!');
    }
  };

  const handleSetAsCurrent = () => {
    setCurrentAvatar({ ...previewAvatar });
    alert('Avatar updated! 👍');
  };

  const handleReset = () => {
    setPreviewAvatar({ ...currentAvatar });
  };

  const AvatarDisplay = ({ avatar, size = 150 }) => (
    <div 
      className="avatar-display"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${avatar.colors.clothing}, ${avatar.colors.hair})`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        border: `4px solid ${avatar.colors.skin}`,
        position: 'relative',
        margin: '0 auto'
      }}
    >
      <span style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))' }}>
        {inventory.hair.find(h => h.id === avatar.hair)?.emoji || '👤'}
      </span>
      <div style={{
        position: 'absolute',
        bottom: -5,
        right: -5,
        background: '#FFD700',
        borderRadius: '50%',
        width: size * 0.25,
        height: size * 0.25,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.15,
        fontWeight: 'bold'
      }}>
        {userLevel}
      </div>
    </div>
  );

  const ItemSelector = ({ title, category, currentValue, availableItems, onChange }) => (
    <div className="item-selector">
      <h3>{title}</h3>
      <div className="item-grid">
        {availableItems.map(item => (
          <button
            key={item.id}
            className={`item-button ${currentValue === item.id ? 'selected' : ''}`}
            onClick={() => onChange(item.id)}
            disabled={item.level > userLevel}
            title={item.level > userLevel ? `Requires level ${item.level}` : ''}
          >
            <span className="item-emoji">{item.emoji}</span>
            <span className="item-name">{item.name}</span>
            {item.level > userLevel && <span className="level-lock">🔒{item.level}</span>}
          </button>
        ))}
      </div>
    </div>
  );

  const ColorPalette = ({ colorType, currentColor, availableColors, onChange }) => (
    <div className="color-palette">
      <h4>{colorType.charAt(0).toUpperCase() + colorType.slice(1)} Color</h4>
      <div className="color-grid">
        {availableColors.map(color => (
          <button
            key={color}
            className={`color-button ${currentColor === color ? 'selected' : ''}`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(colorType, color)}
            title={color}
          />
        ))}
      </div>
    </div>
  );

  const tabs = [
    { id: 'hair', label: '💇 Hair' },
    { id: 'clothing', label: '👕 Clothes' },
    { id: 'accessories', label: '👓 Accessories' },
    { id: 'colors', label: '🎨 Colors' },
    { id: 'style', label: '✨ Style' },
  ];

  return (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ color: 'white', textAlign: 'center', marginBottom: '30px' }}>
          🎨 Avatar Art Studio
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '30px',
          backgroundColor: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          {/* Left - Preview and Save */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px'
          }}>
            <AvatarDisplay avatar={previewAvatar} size={180} />
            
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#666', margin: '10px 0' }}>Level {userLevel} Avatar</p>
              <input
                type="text"
                placeholder="Give your avatar a name..."
                value={avatarName}
                onChange={(e) => setAvatarName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '2px solid #ddd',
                  fontSize: '14px',
                  marginBottom: '15px'
                }}
              />
            </div>
            
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              width: '100%'
            }}>
              <button
                onClick={handleSave}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                💾 Save Avatar
              </button>
              <button
                onClick={handleSetAsCurrent}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ✅ Use This
              </button>
              <button
                onClick={handleReset}
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#FF9800',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🔄 Reset
              </button>
            </div>

            {savedAvatars.length > 0 && (
              <div style={{ width: '100%', marginTop: '20px' }}>
                <h4>Saved Avatars ({savedAvatars.length})</h4>
                <div style={{
                  maxHeight: '200px',
                  overflowY: 'auto',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '8px',
                  padding: '10px'
                }}>
                  {savedAvatars.map(avatar => (
                    <div key={avatar.id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '5px',
                      marginBottom: '5px'
                    }}>
                      <AvatarDisplay avatar={avatar.config} size={30} />
                      <span style={{ fontSize: '12px' }}>{avatar.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right - Customization Tabs */}
          <div>
            <div style={{
              display: 'flex',
              borderBottom: '2px solid #eee',
              marginBottom: '20px'
            }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: '12px 20px',
                    border: 'none',
                    backgroundColor: activeTab === tab.id ? '#667eea' : 'transparent',
                    color: activeTab === tab.id ? 'white' : '#666',
                    borderRadius: '8px 8px 0 0',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginRight: '5px'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ minHeight: '400px' }}>
              {activeTab === 'hair' && (
                <ItemSelector
                  title="Choose Hair Style"
                  category="hair"
                  currentValue={previewAvatar.hair}
                  availableItems={getItemsForLevel(userLevel, inventory.hair)}
                  onChange={(value) => handleAvatarChange({ hair: value })}
                />
              )}

              {activeTab === 'clothing' && (
                <ItemSelector
                  title="Choose Clothing"
                  category="clothing"
                  currentValue={previewAvatar.clothing}
                  availableItems={getItemsForLevel(userLevel, inventory.clothing)}
                  onChange={(value) => handleAvatarChange({ clothing: value })}
                />
              )}

              {activeTab === 'accessories' && (
                <ItemSelector
                  title="Choose Accessories"
                  category="accessories"
                  currentValue={previewAvatar.accessories[0]}
                  availableItems={getItemsForLevel(userLevel, inventory.accessories)}
                  onChange={(value) => handleAvatarChange({ accessories: [value] })}
                />
              )}

              {activeTab === 'colors' && (
                <div>
                  <h3>🎨 Customize Colors</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <ColorPalette
                      colorType="skin"
                      currentColor={previewAvatar.colors.skin}
                      availableColors={inventory.colors.skin}
                      onChange={handleColorChange}
                    />
                    <ColorPalette
                      colorType="hair"
                      currentColor={previewAvatar.colors.hair}
                      availableColors={inventory.colors.hair}
                      onChange={handleColorChange}
                    />
                    <ColorPalette
                      colorType="clothing"
                      currentColor={previewAvatar.colors.clothing}
                      availableColors={inventory.colors.clothing}
                      onChange={handleColorChange}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'style' && (
                <div>
                  <h3>✨ Choose Style</h3>
                  <div className="item-grid">
                    {styles.map(style => (
                      <button
                        key={style.id}
                        className={`item-button ${previewAvatar.style === style.id ? 'selected' : ''}`}
                        onClick={() => handleAvatarChange({ style: style.id })}
                        style={{
                          padding: '15px',
                          border: previewAvatar.style === style.id ? '3px solid #667eea' : '2px solid #ddd',
                          borderRadius: '10px',
                          backgroundColor: previewAvatar.style === style.id ? '#f0f4ff' : 'white',
                          cursor: 'pointer',
                          textAlign: 'center',
                          margin: '5px'
                        }}
                      >
                        <div style={{ fontSize: '24px', marginBottom: '5px' }}>{style.emoji}</div>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{style.name}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .item-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 10px;
          margin-top: 15px;
        }

        .item-button {
          padding: 15px 10px;
          border: 2px solid #ddd;
          border-radius: 10px;
          background: white;
          cursor: pointer;
          text-align: center;
          transition: all 0.2s;
          position: relative;
        }

        .item-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }

        .item-button.selected {
          border-color: #667eea;
          background: #f0f4ff;
          transform: translateY(-2px);
        }

        .item-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .item-emoji {
          font-size: 24px;
          display: block;
          margin-bottom: 5px;
        }

        .item-name {
          font-size: 12px;
          font-weight: bold;
          color: #333;
        }

        .level-lock {
          position: absolute;
          top: 5px;
          right: 5px;
          background: #ff4444;
          color: white;
          border-radius: 10px;
          padding: 2px 6px;
          font-size: 10px;
        }

        .color-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
          gap: 10px;
          margin-top: 10px;
        }

        .color-button {
          width: 40px;
          height: 40px;
          border: 3px solid #ddd;
          border-radius: 50%;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .color-button:hover {
          transform: scale(1.1);
        }

        .color-button.selected {
          border-color: #333;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default AvatarEditor;