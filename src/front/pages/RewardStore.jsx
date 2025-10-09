import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, LayoutDashboard, ShoppingCart, Lock, Check } from 'lucide-react';

const RewardStore = ({ userId, userName, onPurchase }) => {
    const navigate = useNavigate();
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
            emoji: '💪',
            category: 'Achievement'
        },
        {
            id: 'early_bird',
            name: 'Early Bird',
            description: 'For those who love morning workouts',
            cost: 80,
            emoji: '🌅',
            category: 'Time'
        },
        {
            id: 'streak_champion',
            name: 'Streak Champion',
            description: 'Consistency is key!',
            cost: 200,
            emoji: '🔥',
            category: 'Achievement'
        },
        {
            id: 'dance_star',
            name: 'Dance Star',
            description: 'You have the best moves!',
            cost: 90,
            emoji: '💃',
            category: 'Activity'
        },
        {
            id: 'healthy_eater',
            name: 'Healthy Eater',
            description: 'Great food choices!',
            cost: 70,
            emoji: '🥗',
            category: 'Nutrition'
        },
        {
            id: 'water_champion',
            name: 'Water Champion',
            description: 'Staying hydrated like a pro!',
            cost: 60,
            emoji: '💧',
            category: 'Nutrition'
        },
        {
            id: 'super_sleeper',
            name: 'Super Sleeper',
            description: 'Getting great rest every night!',
            cost: 85,
            emoji: '😴',
            category: 'Wellness'
        },
        {
            id: 'goal_crusher',
            name: 'Goal Crusher',
            description: 'Nothing can stop you!',
            cost: 180,
            emoji: '🎯',
            category: 'Achievement'
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
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(to right top, #fb735f, #ff6871, #ff5f85, #ff599c, #ff58b5, #fa5ec4, #f365d2, #eb6ce0, #df74e4, #d37be6, #c881e7, #bd86e7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.5rem',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎁</div>
                    <div>Loading rewards...</div>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to right top, #fb735f, #ff6871, #ff5f85, #ff599c, #ff58b5, #fa5ec4, #f365d2, #eb6ce0, #df74e4, #d37be6, #c881e7, #bd86e7)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            {/* Navigation Bar - GameHub Style */}
            <nav style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                padding: '0.75rem 0',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 2rem'
                }}>
                    <button
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem 1rem',
                            background: 'rgba(139, 92, 246, 0.1)',
                            color: '#8B5CF6',
                            border: 'none',
                            borderRadius: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            fontSize: '0.875rem'
                        }}
                        onClick={() => handleNavigation('/dashboard')}
                    >
                        <ArrowLeft size={20} />
                        <span>Back</span>
                    </button>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '1.25rem',
                        fontWeight: '700',
                        color: '#1F2937'
                    }}>
                        <span style={{ fontSize: '1.5rem' }}>🎁</span>
                        <span style={{ color: '#8B5CF6' }}>Reward Store</span>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem'
                    }}>
                        <button
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'rgba(139, 92, 246, 0.1)',
                                color: '#8B5CF6',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                            onClick={() => handleNavigation('/')}
                        >
                            <Home size={18} />
                            <span>Home</span>
                        </button>
                        <button
                            style={{
                                padding: '0.5rem 1rem',
                                borderRadius: '12px',
                                border: 'none',
                                background: 'rgba(139, 92, 246, 0.1)',
                                color: '#8B5CF6',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontSize: '0.875rem'
                            }}
                            onClick={() => handleNavigation('/dashboard')}
                        >
                            <LayoutDashboard size={18} />
                            <span>Dashboard</span>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Purchase Confirmation Toast */}
            {showPurchaseConfirm && (
                <div style={{
                    position: 'fixed',
                    top: '90px',
                    right: '20px',
                    background: 'white',
                    color: '#1F2937',
                    padding: '1.5rem',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    zIndex: 1000,
                    borderLeft: '4px solid #10B981',
                    minWidth: '300px'
                }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: '#10B981' }}>
                        🎉 Purchase Successful!
                    </div>
                    <div style={{ fontSize: '1rem', color: '#6B7280' }}>
                        You got: {showPurchaseConfirm.emoji} {showPurchaseConfirm.name}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '2rem'
            }}>
                {/* Header Section */}
                <section style={{ marginBottom: '2rem' }}>
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '24px',
                        padding: '2rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        textAlign: 'center'
                    }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            color: '#1F2937',
                            margin: '0 0 0.5rem 0'
                        }}>🎁 Reward Store 🎁</h1>
                        <p style={{
                            fontSize: '1.125rem',
                            color: '#6B7280',
                            margin: '0 0 1.5rem 0'
                        }}>Use your points to buy awesome rewards!</p>

                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.75rem 2rem',
                            background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                            borderRadius: '50px',
                            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
                        }}>
                            <span style={{ fontSize: '2rem', fontWeight: '900', color: 'white' }}>
                                {userPoints}
                            </span>
                            <span style={{ color: 'white', fontSize: '1.125rem', fontWeight: '700' }}>
                                🪙 Points
                            </span>
                        </div>
                    </div>
                </section>

                {/* Rewards Grid */}
                <section style={{ marginBottom: '2rem' }}>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {rewards.map((reward) => {
                            const affordable = canAfford(reward.cost);
                            const owned = isOwned(reward.id);
                            const isPurchasing = purchasing === reward.id;

                            return (
                                <div
                                    key={reward.id}
                                    style={{
                                        position: 'relative',
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        borderRadius: '20px',
                                        border: owned ? '2px solid #10B981' : affordable ? '2px solid #8B5CF6' : '1px solid rgba(255, 255, 255, 0.2)',
                                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                        transition: 'all 0.3s ease',
                                        opacity: owned ? 0.8 : 1
                                    }}
                                >
                                    <div style={{ padding: '2rem', textAlign: 'center' }}>
                                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
                                            {reward.emoji}
                                        </div>
                                        <h3 style={{
                                            fontSize: '1.5rem',
                                            fontWeight: '700',
                                            color: '#1F2937',
                                            margin: '0 0 0.5rem 0'
                                        }}>{reward.name}</h3>
                                        
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '0.25rem 0.75rem',
                                            background: 'rgba(139, 92, 246, 0.1)',
                                            color: '#8B5CF6',
                                            borderRadius: '12px',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            marginBottom: '0.75rem'
                                        }}>
                                            {reward.category}
                                        </div>

                                        <p style={{
                                            color: '#6B7280',
                                            margin: '0 0 1.5rem 0',
                                            lineHeight: '1.5',
                                            fontSize: '0.9rem',
                                            minHeight: '40px'
                                        }}>{reward.description}</p>

                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '1rem',
                                            fontSize: '1.5rem',
                                            fontWeight: '800',
                                            color: affordable ? '#10B981' : '#EF4444'
                                        }}>
                                            <span style={{ marginRight: '0.5rem' }}>🪙</span>
                                            {reward.cost}
                                        </div>

                                        {owned ? (
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1.5rem',
                                                    borderRadius: '16px',
                                                    fontWeight: '700',
                                                    fontSize: '1rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    border: 'none',
                                                    cursor: 'not-allowed',
                                                    background: 'linear-gradient(135deg, #10B981, #059669)',
                                                    color: 'white'
                                                }}
                                                disabled
                                            >
                                                <Check size={20} />
                                                <span>Owned</span>
                                            </button>
                                        ) : affordable ? (
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1.5rem',
                                                    borderRadius: '16px',
                                                    fontWeight: '700',
                                                    fontSize: '1rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    border: 'none',
                                                    cursor: isPurchasing ? 'not-allowed' : 'pointer',
                                                    background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                                                    color: 'white',
                                                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                                                    transition: 'all 0.2s ease'
                                                }}
                                                onClick={() => handlePurchase(reward)}
                                                disabled={isPurchasing}
                                                onMouseEnter={(e) => {
                                                    if (!isPurchasing) {
                                                        e.target.style.transform = 'translateY(-2px)';
                                                        e.target.style.boxShadow = '0 8px 20px rgba(139, 92, 246, 0.4)';
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                                                }}
                                            >
                                                {isPurchasing ? (
                                                    <>⏳ Buying...</>
                                                ) : (
                                                    <>
                                                        <ShoppingCart size={20} />
                                                        <span>Buy Now</span>
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                style={{
                                                    width: '100%',
                                                    padding: '0.75rem 1.5rem',
                                                    borderRadius: '16px',
                                                    fontWeight: '700',
                                                    fontSize: '1rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    gap: '0.5rem',
                                                    border: 'none',
                                                    cursor: 'not-allowed',
                                                    background: '#E5E7EB',
                                                    color: '#9CA3AF'
                                                }}
                                                disabled
                                            >
                                                <Lock size={20} />
                                                <span>Need {reward.cost - userPoints} More</span>
                                            </button>
                                        )}
                                    </div>

                                    {owned && (
                                        <div style={{
                                            position: 'absolute',
                                            top: '1rem',
                                            right: '1rem',
                                            width: '2.5rem',
                                            height: '2.5rem',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            background: '#10B981',
                                            fontSize: '1.25rem'
                                        }}>
                                            ✓
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Owned Rewards Section */}
                {ownedRewards.length > 0 ? (
                    <section>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '24px',
                            padding: '2rem',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                        }}>
                            <h3 style={{
                                fontSize: '2rem',
                                fontWeight: '800',
                                color: '#1F2937',
                                textAlign: 'center',
                                marginBottom: '2rem'
                            }}>
                                🎉 My Earned Rewards 🎉
                            </h3>
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                                gap: '1rem'
                            }}>
                                {rewards
                                    .filter(reward => ownedRewards.includes(reward.id))
                                    .map(reward => (
                                        <div key={reward.id} style={{
                                            background: 'linear-gradient(135deg, #F0FDF4, #DCFCE7)',
                                            borderRadius: '16px',
                                            padding: '1.5rem',
                                            textAlign: 'center',
                                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                                            border: '2px solid #10B981'
                                        }}>
                                            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>
                                                {reward.emoji}
                                            </div>
                                            <div style={{ fontWeight: '700', color: '#1F2937', fontSize: '0.9rem' }}>
                                                {reward.name}
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </section>
                ) : (
                    <section>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '24px',
                            padding: '3rem 2rem',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⭐</div>
                            <h3 style={{
                                fontSize: '1.5rem',
                                fontWeight: '800',
                                color: '#1F2937',
                                marginBottom: '0.5rem'
                            }}>
                                Start Your Collection!
                            </h3>
                            <p style={{ color: '#6B7280', fontSize: '1rem' }}>
                                Complete activities to earn points and buy your first reward! 💪
                            </p>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default RewardStore;