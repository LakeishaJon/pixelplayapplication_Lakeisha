import { useAvatar } from '../context/AvatarContext';

export const useAchievements = () => {
  const { achievements, userStats, unlockAchievement } = useAvatar();

  const checkAchievements = () => {
    const toUnlock = [];

    // First workout
    if (userStats.workoutsCompleted >= 1 && !achievements.firstWorkout?.unlocked) {
      toUnlock.push('firstWorkout');
    }

    // Level 5
    if (userStats.level >= 5 && !achievements.level5?.unlocked) {
      toUnlock.push('level5');
    }

    // 1000 points
    if (userStats.points >= 1000 && !achievements.points1000?.unlocked) {
      toUnlock.push('points1000');
    }

    // 7 day streak
    if (userStats.streak >= 7 && !achievements.week1?.unlocked) {
      toUnlock.push('week1');
    }

    // Unlock all pending achievements
    toUnlock.forEach(achievementId => {
      unlockAchievement(achievementId);
    });

    return toUnlock;
  };

  const getAchievementProgress = () => {
    return {
      firstWorkout: {
        progress: Math.min(userStats.workoutsCompleted, 1),
        target: 1,
        unlocked: achievements.firstWorkout?.unlocked || false
      },
      level5: {
        progress: Math.min(userStats.level, 5),
        target: 5,
        unlocked: achievements.level5?.unlocked || false
      },
      points1000: {
        progress: Math.min(userStats.points, 1000),
        target: 1000,
        unlocked: achievements.points1000?.unlocked || false
      },
      week1: {
        progress: Math.min(userStats.streak, 7),
        target: 7,
        unlocked: achievements.week1?.unlocked || false
      }
    };
  };

  return { checkAchievements, getAchievementProgress };
};
