import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ADDED THIS

const RewardStore = ({ userId, userName, onPurchase }) => {
    const navigate = useNavigate(); // ✅ ADDED THIS
    const [userPoints, setUserPoints] = useState(150);
    const [loading, setLoading] = useState(false);
    const [purchasing, setPurchasing] = useState(null);
    const [ownedRewards, setOwnedRewards] = useState([]);
    const [showPurchaseConfirm, setShowPurchaseConfirm] = useState(null);

    const rewards = [
        {
            id: 'fitness_master',
            name: 'Fitness Master',
            description: 'Show everyone you love staying active!',
            cost: 120,
            emoji: '💪'
        },
        {
            id: 'early_bird',
            name: 'Early Bird',
            description: 'For those who love morning workouts',
            cost: 80,
            emoji: '🌅'
        },
        {
            id: 'streak_champion',
            name: 'Streak Champion',
            description: 'Consistency is key!',
            cost: 200,
            emoji: '🔥'
        },
        {
            id: 'dance_star',
            name: 'Dance Star',
            description: 'You have the best moves!',
            cost: 90,
            emoji: '💃'
        },
        {
            id: 'healthy_eater',
            name: 'Healthy Eater',
            description: 'Great food choices!',
            cost: 70,
            emoji: '🥗'
        },
        {
            id: 'water_champion',
            name: 'Water Champion',
            description: 'Staying hydrated like a pro!',
            cost: 60,
            emoji: '💧'
        },
        {
            id: 'super_sleeper',
            name: 'Super Sleeper',
            description: 'Getting great rest every night!',
            cost: 85,
            emoji: '😴'
        },
        {
            id: 'goal_crusher',
            name: 'Goal Crusher',
            description: 'Nothing can stop you!',
            cost: 180,
            emoji: '🎯'
        },
    ];

    useEffect(() => {
        loadUserData();
    }, [userId]);

    const loadUserData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/rewards/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUserPoints(data.points || 0);
                setOwnedRewards(data.owned_rewards || []);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (reward) => {
        if (purchasing || userPoints < reward.cost) return;

        setPurchasing(reward.id);

        try {
            const response = await fetch(`/api/rewards/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                },
                body: JSON.stringify({
                    reward_id: reward.id,
                    cost: reward.cost
                })
            });

            if (response.ok) {
                const data = await response.json();
                setUserPoints(data.remaining_points);
                setOwnedRewards([...ownedRewards, reward.id]);
                setShowPurchaseConfirm(reward);

                onPurchase && onPurchase(reward, data.remaining_points);

                setTimeout(() => {
                    setShowPurchaseConfirm(null);
                }, 3000);

            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Purchase failed. Please try again!');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            alert('Oops! Something went wrong. Please try again!');
        } finally {
            setPurchasing(null);
        }
    };

    // ✅ FIXED: Added proper navigation handler
    const handleNavigation = (path) => {
        console.log('Navigating to:', path);
        try {
            navigate(path);
        } catch (error) {
            console.error('Navigation error:', error);
            window.location.href = path;
        }
    };

    const canAfford = (cost) => userPoints >= cost;
    const isOwned = (rewardId) => ownedRewards.includes(rewardId);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">Loading rewards...</span>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to right top, #fb735f, #ff6871, #ff5f85, #ff599c, #ff58b5, #fa5ec4, #f365d2, #eb6ce0, #df74e4, #d37be6, #c881e7, #bd86e7)',
            padding: '20px',
            fontFamily: 'Arial, sans-serif'
        }}>
            {/* ✅ FIXED: Navigation Bar with working buttons */}
            <nav style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 30px',
                marginBottom: '20px'
            }}>
                <div
                    style={{
                        color: 'white',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        cursor: 'pointer'
                    }}
                    onClick={() => handleNavigation('/')}
                >
                    <span>🎮</span>
                    <span>Pixel Play</span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        style={{
                            background: 'white',
                            color: '#a855f7',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                        onClick={() => handleNavigation('/')}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(255,255,255,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        🏠 Home
                    </button>
                    <button
                        style={{
                            background: 'white',
                            color: '#a855f7',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '10px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '14px'
                        }}
                        onClick={() => handleNavigation('/dashboard')}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(255,255,255,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = 'none';
                        }}
                    >
                        📊 Dashboard
                    </button>
                </div>
            </nav>

            {/* Purchase Confirmation Toast */}
            {showPurchaseConfirm && (
                <div style={{
                    position: 'fixed',
                    top: '20px',
                    right: '20px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    padding: '20px 30px',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(16,185,129,0.4)',
                    zIndex: 1000
                }}>
                    <div style={{ fontSize: '1.3em', fontWeight: '800', marginBottom: '5px' }}>
                        🎉 Purchase Successful!
                    </div>
                    <div style={{ fontSize: '1em' }}>
                        You got: {showPurchaseConfirm.emoji} {showPurchaseConfirm.name}
                    </div>
                </div>
            )}

            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                background: 'white',
                borderRadius: '20px',
                padding: '40px',
                boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{
                        fontSize: '3em',
                        fontWeight: '900',
                        background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: '10px'
                    }}>
                        🎁 Reward Store 🎁
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1.2em', fontWeight: '600', marginBottom: '20px' }}>
                        Use your points to buy awesome rewards!
                    </p>

                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                        padding: '15px 30px',
                        borderRadius: '50px',
                        boxShadow: '0 8px 20px rgba(251,191,36,0.3)',
                        marginTop: '10px'
                    }}>
                        <div style={{ fontSize: '2em', fontWeight: '900', color: 'white', marginRight: '10px' }}>
                            {userPoints}
                        </div>
                        <div style={{ color: 'white', fontSize: '1.2em', fontWeight: '700' }}>
                            🪙 Points
                        </div>
                    </div>
                </div>

                {/* Rewards Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '25px',
                    marginBottom: '40px'
                }}>
                    {rewards.map((reward) => {
                        const affordable = canAfford(reward.cost);
                        const owned = isOwned(reward.id);
                        const isPurchasing = purchasing === reward.id;

                        return (
                            <div
                                key={reward.id}
                                style={{
                                    background: 'white',
                                    borderRadius: '20px',
                                    padding: '25px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                    border: owned ? '3px solid #10b981' : affordable ? '3px solid #a855f7' : '3px solid #f3f4f6',
                                    opacity: owned ? 0.7 : 1,
                                    transition: 'all 0.3s ease',
                                    textAlign: 'center'
                                }}
                            >
                                <div style={{ fontSize: '4em', marginBottom: '15px' }}>{reward.emoji}</div>
                                <div style={{ fontSize: '1.4em', fontWeight: '800', color: '#1f2937', marginBottom: '10px' }}>
                                    {reward.name}
                                </div>
                                <div style={{ color: '#6b7280', fontSize: '0.95em', marginBottom: '20px', minHeight: '40px' }}>
                                    {reward.description}
                                </div>

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '20px',
                                    fontSize: '1.3em',
                                    fontWeight: '800',
                                    color: affordable ? '#10b981' : '#ef4444'
                                }}>
                                    <span style={{ marginRight: '8px' }}>🪙</span>
                                    {reward.cost}
                                </div>

                                {owned ? (
                                    <button
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '1.1em',
                                            fontWeight: '700',
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                            color: 'white',
                                            cursor: 'not-allowed'
                                        }}
                                        disabled
                                    >
                                        ✅ Owned
                                    </button>
                                ) : affordable ? (
                                    <button
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '1.1em',
                                            fontWeight: '700',
                                            background: 'linear-gradient(135deg, #a855f7 0%, #d946ef 100%)',
                                            color: 'white',
                                            boxShadow: '0 4px 12px rgba(168,85,247,0.3)',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={() => handlePurchase(reward)}
                                        disabled={isPurchasing}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 8px 20px rgba(168,85,247,0.4)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 4px 12px rgba(168,85,247,0.3)';
                                        }}
                                    >
                                        {isPurchasing ? '⏳ Buying...' : '🛒 Buy Now'}
                                    </button>
                                ) : (
                                    <button
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontSize: '1.1em',
                                            fontWeight: '700',
                                            background: '#e5e7eb',
                                            color: '#9ca3af',
                                            cursor: 'not-allowed'
                                        }}
                                        disabled
                                    >
                                        🔒 Not Enough Points
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Owned Rewards Section */}
                {ownedRewards.length > 0 && (
                    <div style={{
                        background: 'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
                        borderRadius: '20px',
                        padding: '30px',
                        marginTop: '40px'
                    }}>
                        <h3 style={{
                            fontSize: '2em',
                            fontWeight: '900',
                            color: '#059669',
                            textAlign: 'center',
                            marginBottom: '30px'
                        }}>
                            🎉 My Earned Rewards 🎉
                        </h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: '20px'
                        }}>
                            {rewards
                                .filter(reward => ownedRewards.includes(reward.id))
                                .map(reward => (
                                    <div key={reward.id} style={{
                                        background: 'white',
                                        borderRadius: '15px',
                                        padding: '20px',
                                        textAlign: 'center',
                                        boxShadow: '0 4px 12px rgba(5,150,105,0.2)',
                                        border: '2px solid #10b981'
                                    }}>
                                        <div style={{ fontSize: '3em', marginBottom: '10px' }}>
                                            {reward.emoji}
                                        </div>
                                        <div style={{ fontWeight: '800', color: '#1f2937', fontSize: '1.1em' }}>
                                            {reward.name}
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}

                {/* Encouragement Message */}
                {ownedRewards.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                        borderRadius: '20px',
                        marginTop: '20px'
                    }}>
                        <div style={{ fontSize: '3em', marginBottom: '15px' }}>⭐</div>
                        <div style={{
                            fontSize: '1.5em',
                            fontWeight: '800',
                            color: '#92400e',
                            marginBottom: '10px'
                        }}>
                            Start Your Collection!
                        </div>
                        <div style={{ color: '#78350f', fontSize: '1.1em', fontWeight: '600' }}>
                            Complete activities to earn points and buy your first reward! 💪
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RewardStore;