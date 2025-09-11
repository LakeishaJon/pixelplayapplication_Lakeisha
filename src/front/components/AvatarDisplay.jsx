import React, { useState, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { adventurer, personas, lorelei, miniavs } from '@dicebear/collection';
import './styles/avatarStyles.css';

const AvatarDisplay = ({
    user,
    size = 150,
    showLevel = true,
    showCustomization = false,
    clickable = false,
    onAvatarClick,
    onCustomizeClick,
    newlyUnlocked = false,
    showUnlockBadge = false,
    theme = 'default'
}) => {
    // 🎨 State for the avatar image
    const [avatarSvg, setAvatarSvg] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // 🎮 Avatar style collections (like different art styles in games)
    const styleCollections = {
        adventurer: adventurer,
        personas: personas,
        lorelei: lorelei,
        miniavs: miniavs
    };

    // ✨ Generate avatar when user data changes
    useEffect(() => {
        if (user) {
            generateAvatar();
        }
    }, [user]);

    // 🎨 Function to create the avatar picture
    const generateAvatar = () => {
        if (!user || !user.avatarData) {
            setHasError(true);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            setHasError(false);

            // Get the avatar style collection
            const style = user.avatarData.style || 'adventurer';
            const collection = styleCollections[style] || adventurer;

            // Create avatar with user's settings
            const avatar = createAvatar(collection, {
                seed: user.avatarData.seed || user.username,
                backgroundColor: user.avatarData.backgroundColor || ['b6e3f4'],
                hair: user.avatarData.hair || ['short01'],
                hairColor: user.avatarData.hairColor || ['8B4513'],
                eyes: user.avatarData.eyes || ['variant01'],
                eyeColor: user.avatarData.eyeColor || ['0066cc'],
                mouth: user.avatarData.mouth || ['variant01'],
                skinColor: user.avatarData.skinColor || ['f2d3b1'],
                clothing: user.avatarData.clothing || ['shirt01'],
                clothingColor: user.avatarData.clothingColor || ['4ecdc4'],
                // Add theme-based modifications
                ...(user.avatarData.theme && getThemeModifications(user.avatarData.theme))
            });

            // Convert to SVG string
            const svgString = avatar.toString();
            setAvatarSvg(svgString);
            setIsLoading(false);
        } catch (error) {
            console.error('Error generating avatar:', error);
            setHasError(true);
            setIsLoading(false);
        }
    };

    // 🌈 Theme modifications for special effects
    const getThemeModifications = (themeName) => {
        const themes = {
            nature: {
                backgroundColor: ['00b894'],
                hairColor: ['2d3436'],
                clothingColor: ['00b894']
            },
            fire: {
                backgroundColor: ['e17055'],
                hairColor: ['d63031'],
                clothingColor: ['e17055']
            },
            ocean: {
                backgroundColor: ['74b9ff'],
                hairColor: ['0984e3'],
                clothingColor: ['74b9ff']
            },
            magic: {
                backgroundColor: ['a29bfe'],
                hairColor: ['6c5ce7'],
                clothingColor: ['a29bfe']
            }
        };

        return themes[themeName] || {};
    };

    // 🖱️ Handle avatar click
    const handleAvatarClick = () => {
        if (clickable && onAvatarClick) {
            onAvatarClick(user);
        }
    };

    // ⚙️ Handle customize button click
    const handleCustomizeClick = (e) => {
        e.stopPropagation(); // Prevent avatar click when clicking customize
        if (onCustomizeClick) {
            onCustomizeClick(user);
        }
    };

    // 📏 Calculate responsive sizes
    const containerSize = size;
    const levelBadgeSize = Math.max(24, size * 0.16);
    const customizeBtnSize = Math.max(30, size * 0.2);

    return (
        <div
            className={`avatar-container ${theme}`}
            style={{
                position: 'relative',
                display: 'inline-block',
                margin: '10px'
            }}
        >
            {/* ✨ Loading state */}
            {isLoading && (
                <div
                    className="avatar-loading"
                    style={{
                        width: containerSize,
                        height: containerSize,
                        borderRadius: '15px',
                        background: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                        fontSize: '14px',
                        fontWeight: 'bold'
                    }}
                >
                    Creating...
                </div>
            )}

            {/* ❌ Error state */}
            {hasError && !isLoading && (
                <div
                    className="avatar-error"
                    style={{
                        width: containerSize,
                        height: containerSize,
                        borderRadius: '15px',
                        background: 'linear-gradient(45deg, #ff6b6b, #ff5252)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '24px'
                    }}
                >
                    😵
                </div>
            )}

            {/* 🏆 New unlock badge */}
            {showUnlockBadge && (
                <div
                    className="style-unlock-badge"
                    style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        background: 'linear-gradient(45deg, #ffd93d, #f39c12)',
                        color: '#2c3e50',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 'bold',
                        zIndex: 3,
                        animation: 'bounce 1s ease-in-out infinite',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }}
                >
                    NEW!
                </div>
            )}

            {/* 🖼️ The actual avatar image */}
            {!isLoading && !hasError && avatarSvg && (
                <div
                    className={`avatar-border ${clickable ? 'avatar-clickable' : ''} ${newlyUnlocked ? 'achievement-glow' : ''}`}
                    style={{
                        width: containerSize,
                        height: containerSize,
                        borderRadius: '15px',
                        overflow: 'hidden',
                        border: `3px solid ${newlyUnlocked ? '#ffd93d' : '#ddd'}`,
                        cursor: clickable ? 'pointer' : 'default',
                        transition: 'all 0.3s ease',
                        backgroundColor: '#f8f9fa',
                        boxShadow: newlyUnlocked
                            ? '0 0 20px rgba(255, 217, 61, 0.6)'
                            : '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    onClick={handleAvatarClick}
                    title={user ? `${user.username} - Level ${user.level}` : 'Avatar'}
                    onMouseEnter={(e) => {
                        if (clickable) {
                            e.target.style.transform = 'scale(1.05)';
                            e.target.style.boxShadow = '0 8px 20px rgba(0,0,0,0.2)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (clickable) {
                            e.target.style.transform = 'scale(1)';
                            e.target.style.boxShadow = newlyUnlocked
                                ? '0 0 20px rgba(255, 217, 61, 0.6)'
                                : '0 4px 12px rgba(0,0,0,0.1)';
                        }
                    }}
                >
                    <div
                        style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        dangerouslySetInnerHTML={{ __html: avatarSvg }}
                    />
                </div>
            )}

            {/* 🏅 Level number badge */}
            {showLevel && user?.level && !isLoading && (
                <div
                    className="level-badge pixel-font"
                    style={{
                        position: 'absolute',
                        bottom: '-8px',
                        left: '-8px',
                        width: levelBadgeSize,
                        height: levelBadgeSize,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: Math.max(12, levelBadgeSize * 0.5),
                        fontWeight: 'bold',
                        border: '2px solid white',
                        zIndex: 2,
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }}
                >
                    {user.level}
                </div>
            )}

            {/* ✏️ Customization button */}
            {showCustomization && !isLoading && (
                <button
                    className="customize-btn"
                    onClick={handleCustomizeClick}
                    style={{
                        position: 'absolute',
                        top: '-8px',
                        right: '-8px',
                        width: customizeBtnSize,
                        height: customizeBtnSize,
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #667eea, #764ba2)',
                        color: 'white',
                        border: '2px solid white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: Math.max(12, customizeBtnSize * 0.4),
                        zIndex: 2,
                        transition: 'all 0.3s ease',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                    }}
                    title="Customize Avatar"
                    onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.1)';
                        e.target.style.boxShadow = '0 6px 12px rgba(0,0,0,0.3)';
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
                    }}
                >
                    ✏️
                </button>
            )}

            {/* 👤 Username label (optional) */}
            {user?.username && size >= 100 && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '-25px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        background: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        whiteSpace: 'nowrap',
                        zIndex: 1
                    }}
                >
                    {user.username}
                </div>
            )}
        </div>
    );
};

// 🎨 Add some CSS animations (you can put this in your CSS file)
const style = document.createElement('style');
style.textContent = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
  
  @keyframes achievement-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(255, 217, 61, 0.6); }
    50% { box-shadow: 0 0 30px rgba(255, 217, 61, 0.9); }
  }
  
  .achievement-glow {
    animation: achievement-glow 2s ease-in-out infinite;
  }
  
  .pixel-font {
    font-family: 'Courier New', monospace;
  }
`;
document.head.appendChild(style);

export default AvatarDisplay;