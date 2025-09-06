import React, { useState, useEffect, useContext } from 'react';



// const RewardStore = () => <div className="placeholder-page"><h1>Games Hub</h1><p>Coming Soon!</p></div>
// export default RewardStore;

const RewardStore = ({ userId, userName, onPurchase }) => {
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [ownedRewards, setOwnedRewards] = useState([]);
  const [showPurchaseConfirm, setShowPurchaseConfirm] = useState(null);

  // badge rewards, for now
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
      emoji: '🐦'
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
      description: 'Congratulations on making great food choices!',
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

  // useEffect statement
  useEffect(() => {
    loadUserData();
  }, [userId]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Fetch user points and owned rewards
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
        
        // Call parent callback if provided
        onPurchase && onPurchase(reward, data.remaining_points);

        // timeout after confirmation, 3000 is 3 seconds
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
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl shadow-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            🎁 Reward Store! 🎁
          </h1>
          <p className="text-gray-600">Use your points to buy awesome rewards!</p>
          
          {/* Points Display */}
          <div className="mt-4 inline-flex items-center bg-yellow-100 px-6 py-3 rounded-full shadow-md">
            <span className="text-2xl font-bold text-yellow-700">{userPoints} </span>
            <span className="text-yellow-600 ml-2">Points</span>
          </div>
        </div>

        {/* Purchase Confirmation */}
      {showPurchaseConfirm && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 animate-pulse">
          <div className="flex items-center">
            <div>
              <p className="font-semibold">Purchase Successful!</p>
              <p className="text-sm">You got: {showPurchaseConfirm.name}</p>
            </div>
          </div>
        </div>
      )}

       <div className="row g-4">
        {rewards.map((reward) => {
          const affordable = canAfford(reward.cost);
          const owned = isOwned(reward.id);
          const isPurchasing = purchasing === reward.id;

          return (
            <div key={reward.id} className="col-lg-3 col-md-4 col-sm-6">
              <div className={`card h-100 border-3 ${owned ? 'opacity-75' : ''} shadow-sm`}>
                <div className="card-body text-center">
                  {/* Badge Header */}
                  <div className="mb-3">
                    <div className="fs-1 mb-2">{reward.emoji}</div>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h5 className="card-title flex-grow-1">{reward.name}</h5>
                    </div>
                    <p className="card-text text-muted small">{reward.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-center align-items-center">
                      <span className="me-2">🪙</span>
                      <span className={`fs-5 fw-bold ${affordable ? 'text-success' : 'text-danger'}`}>
                        {reward.cost}
                      </span>
                    </div>
                  </div>

                  {/* Purchase Button */}
                  <div className="d-grid">
                    {owned ? (
                      <button disabled className="btn btn-success">
                        <i className="bi bi-check-circle me-2"></i>
                        Owned
                      </button>
                    ) : affordable ? (
                      <button
                        onClick={() => handlePurchase(reward)}
                        disabled={isPurchasing}
                      >
                        {isPurchasing ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Buying...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-cart-plus me-2"></i>
                            Buy Now
                          </>
                        )}
                      </button>
                    ) : (
                      <button disabled className="btn btn-secondary">
                        <i className="bi bi-lock me-2"></i>
                        Not Enough Points
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Earned Rewards */}
      {ownedRewards.length > 0 && (
        <div className="row mt-5">
          <div className="col-12">
            <div className="card border-0 shadow-sm bg-success bg-opacity-10">
              <div className="card-body">
                <h3 className="text-center mb-4 text-success">🎉 My Earned Rewards</h3>
                <div className="row g-3">
                  {rewards
                    .filter(reward => ownedRewards.includes(reward.id))
                    .map(reward => (
                      <div key={reward.id} className="col-lg-2 col-md-3 col-sm-4 col-6">
                        <div className="text-center p-3 bg-white rounded shadow-sm">
                          <div className="fs-2 mb-2">{reward.emoji}</div>
                          <h6 className="fw-bold">{reward.name}</h6>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
};
export default RewardStore;