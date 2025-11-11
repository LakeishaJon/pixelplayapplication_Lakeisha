import { useAvatar } from '../context/AvatarContext';

export const useWorkout = () => {
  const { 
    addPoints, 
    completeWorkout, 
    updateDailyChallenge, 
    unlockItem,
    unlockAchievement,
    userStats,
    dailyChallenge 
  } = useAvatar();

  const performWorkout = (workoutType, duration, basePoints) => {
    // Complete the workout
    completeWorkout(duration);
    
    // Calculate points with potential bonuses
    let totalPoints = basePoints;
    
    // Streak bonus
    if (userStats.streak > 3) {
      totalPoints += Math.floor(basePoints * 0.2); // 20% bonus for 4+ day streak
    }
    
    // First workout achievement
    if (userStats.workoutsCompleted === 0) {
      unlockAchievement('firstWorkout');
      totalPoints += 50; // Bonus for first workout
    }
    
    addPoints(totalPoints);
    
    // Update daily challenge if it matches
    if (dailyChallenge.type === workoutType && !dailyChallenge.completed) {
      updateDailyChallenge(1);
    }
    
    // Random item unlock (30% chance)
    if (Math.random() > 0.7) {
      const possibleItems = {
        hair: ['spiky', 'wavy', 'braided'],
        clothing: ['sportswear', 'tank-top', 'tracksuit'],
        accessories: ['sweatband', 'water-bottle', 'medal']
      };
      
      const categories = Object.keys(possibleItems);
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      const items = possibleItems[randomCategory];
      const randomItem = items[Math.floor(Math.random() * items.length)];
      
      unlockItem(randomCategory, randomItem);
    }
    
    // Check for level-based achievements
    const newLevel = Math.floor((userStats.points + totalPoints) / 100) + 1;
    if (newLevel >= 5 && !userStats.achievements?.level5?.unlocked) {
      unlockAchievement('level5');
    }
    
    return {
      pointsEarned: totalPoints,
      streakBonus: userStats.streak > 3,
      newLevel: newLevel > userStats.level
    };
  };

  return { performWorkout };
};
