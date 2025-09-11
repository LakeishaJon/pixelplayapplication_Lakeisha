// utils/avatarUtils.jsx
import { createAvatar } from '@dicebear/core';
import { avataaars, miniavs, personas } from '@dicebear/collection';

/**
 * Avatar Utilities for PixelPlay Fitness App
 * Handles avatar generation, validation, and utility functions
 */

// Helper function to generate random seeds for unique avatars
export const generateRandomSeed = () => {
  const seeds = [
    'happy', 'sunny', 'cool', 'awesome', 'bright', 'smart', 'kind',
    'brave', 'strong', 'gentle', 'creative', 'fun', 'amazing', 'super',
    'energetic', 'focused', 'determined', 'motivated', 'inspired', 'confident'
  ];
  const randomSeed = seeds[Math.floor(Math.random() * seeds.length)];
  const timestamp = Date.now();
  return `${randomSeed}-${timestamp}`;
};

// Get the appropriate DiceBear style collection
export const getAvatarStyle = (styleName) => {
  const styles = {
    'avataaars': avataaars,
    'miniavs': miniavs,
    'personas': personas
  };
  
  return styles[styleName] || avataaars; // Default to avataaars if style not found
};

// Generate avatar data URI from avatar settings
export const generateAvatarDataUri = (avatarSettings) => {
  try {
    // Validate input
    if (!avatarSettings || typeof avatarSettings !== 'object') {
      throw new Error('Invalid avatar settings provided');
    }

    const style = getAvatarStyle(avatarSettings.style || 'avataaars');
    const seed = avatarSettings.seed || generateRandomSeed();
    
    // Create avatar with provided settings
    const avatar = createAvatar(style, {
      seed,
      ...avatarSettings
    });
    
    return avatar.toDataUri();
  } catch (error) {
    console.error('Error generating avatar:', error);
    
    // Return fallback avatar
    try {
      const fallbackAvatar = createAvatar(avataaars, { 
        seed: 'fallback-' + Date.now() 
      });
      return fallbackAvatar.toDataUri();
    } catch (fallbackError) {
      console.error('Error generating fallback avatar:', fallbackError);
      return null;
    }
  }
};

// Create default avatar settings
export const getDefaultAvatar = (style = 'avataaars') => {
  const baseSettings = {
    style,
    seed: generateRandomSeed(),
    backgroundColor: ['transparent']
  };

  // Style-specific default settings
  const styleDefaults = {
    avataaars: {
      accessories: [],
      accessoriesChance: 30,
      clothing: 'blazerShirt',
      clothingColor: ['blue'],
      eyebrows: 'default',
      eyes: 'default',
      facialHair: [],
      facialHairChance: 0,
      hair: 'shortWaved',
      hairColor: ['brown'],
      mouth: 'default',
      skin: ['light'],
      top: 'shortWaved'
    },
    miniavs: {
      hair: 'short',
      clothing: 'shirt',
      mood: 'happy'
    },
    personas: {
      hair: 'short',
      clothing: 'casual'
    }
  };

  return {
    ...baseSettings,
    ...(styleDefaults[style] || styleDefaults.avataaars)
  };
};

// Calculate user level from points
export const calculateLevel = (points) => {
  if (typeof points !== 'number' || points < 0) return 1;
  return Math.floor(points / 100) + 1;
};

// Calculate progress percentage to next level
export const calculateProgress = (points) => {
  if (typeof points !== 'number' || points < 0) return 0;
  return (points % 100) / 100;
};

// Calculate points needed for next level
export const pointsToNextLevel = (points) => {
  if (typeof points !== 'number' || points < 0) return 100;
  return 100 - (points % 100);
};

// Items that can be unlocked at different levels
export const getUnlockableItems = () => ({
  hair: {
    1: ['shortWaved', 'longHair', 'curly'],
    2: ['straight', 'bob', 'bun'],
    3: ['mohawk', 'bald', 'dreads'],
    4: ['frida', 'fro', 'shaggyMullet'],
    5: ['fancy', 'wild', 'miaWallace']
  },
  clothing: {
    1: ['blazerShirt', 'hoodie', 'tshirt'],
    2: ['sweater', 'collarSweater', 'shirtCrewNeck'],
    3: ['jacket', 'vest', 'overall'],
    4: ['formal', 'graphicShirt', 'shirtScoopNeck'],
    5: ['premium', 'designer', 'shirtVNeck']
  },
  accessories: {
    2: ['glasses', 'prescription01'],
    3: ['sunglasses', 'wayfarers', 'round'],
    4: ['prescription02', 'kurt'],
    5: ['crown', 'mask', 'premium-glasses']
  },
  colors: {
    1: ['blue', 'red', 'green'],
    2: ['purple', 'orange', 'yellow'],
    3: ['pink', 'brown', 'black'],
    4: ['white', 'gray', 'navy'],
    5: ['gold', 'silver', 'rainbow']
  }
});

// Check what items should be unlocked for a specific level
export const getItemsForLevel = (level) => {
  const unlockables = getUnlockableItems();
  const items = { 
    hair: [], 
    clothing: [], 
    accessories: [], 
    colors: [] 
  };
  
  // Add items for each category based on level
  Object.keys(unlockables).forEach(category => {
    Object.keys(unlockables[category]).forEach(unlockLevel => {
      const requiredLevel = parseInt(unlockLevel);
      if (level >= requiredLevel) {
        items[category] = [
          ...items[category], 
          ...unlockables[category][unlockLevel]
        ];
      }
    });
  });
  
  return items;
};

// Get newly unlocked items when leveling up
export const getNewlyUnlockedItems = (oldLevel, newLevel) => {
  if (newLevel <= oldLevel) return { hair: [], clothing: [], accessories: [], colors: [] };
  
  const unlockables = getUnlockableItems();
  const newItems = { 
    hair: [], 
    clothing: [], 
    accessories: [], 
    colors: [] 
  };
  
  // Find items unlocked between old and new level
  Object.keys(unlockables).forEach(category => {
    Object.keys(unlockables[category]).forEach(unlockLevel => {
      const requiredLevel = parseInt(unlockLevel);
      if (requiredLevel > oldLevel && requiredLevel <= newLevel) {
        newItems[category] = [
          ...newItems[category], 
          ...unlockables[category][unlockLevel]
        ];
      }
    });
  });
  
  return newItems;
};

// Validate avatar settings object
export const validateAvatarSettings = (settings) => {
  if (!settings || typeof settings !== 'object') {
    return false;
  }
  
  // Check required fields
  const requiredFields = ['style', 'seed'];
  for (const field of requiredFields) {
    if (!settings[field]) {
      return false;
    }
  }
  
  // Validate style
  const validStyles = ['avataaars', 'miniavs', 'personas'];
  if (!validStyles.includes(settings.style)) {
    return false;
  }
  
  return true;
};

// Create a random avatar with specified style
export const createRandomAvatar = (style = 'avataaars') => {
  const defaultAvatar = getDefaultAvatar(style);
  const unlockableItems = getUnlockableItems();
  
  // Randomize some features
  if (style === 'avataaars') {
    const randomHair = unlockableItems.hair[1][Math.floor(Math.random() * unlockableItems.hair[1].length)];
    const randomClothing = unlockableItems.clothing[1][Math.floor(Math.random() * unlockableItems.clothing[1].length)];
    const randomColors = unlockableItems.colors[1];
    const randomHairColor = randomColors[Math.floor(Math.random() * randomColors.length)];
    const randomClothingColor = randomColors[Math.floor(Math.random() * randomColors.length)];
    
    return {
      ...defaultAvatar,
      hair: randomHair,
      clothing: randomClothing,
      hairColor: [randomHairColor],
      clothingColor: [randomClothingColor],
      seed: generateRandomSeed()
    };
  }
  
  return {
    ...defaultAvatar,
    seed: generateRandomSeed()
  };
};

// Export avatar settings as JSON string for saving
export const exportAvatarSettings = (avatarSettings) => {
  try {
    return JSON.stringify(avatarSettings, null, 2);
  } catch (error) {
    console.error('Error exporting avatar settings:', error);
    return null;
  }
};

// Import avatar settings from JSON string
export const importAvatarSettings = (jsonString) => {
  try {
    const settings = JSON.parse(jsonString);
    if (validateAvatarSettings(settings)) {
      return settings;
    } else {
      throw new Error('Invalid avatar settings format');
    }
  } catch (error) {
    console.error('Error importing avatar settings:', error);
    return null;
  }
};

// Create avatar thumbnail (smaller version for lists)
export const generateAvatarThumbnail = (avatarSettings, size = 64) => {
  try {
    const style = getAvatarStyle(avatarSettings.style || 'avataaars');
    const avatar = createAvatar(style, {
      ...avatarSettings,
      size: size
    });
    
    return avatar.toDataUri();
  } catch (error) {
    console.error('Error generating avatar thumbnail:', error);
    return generateAvatarDataUri(getDefaultAvatar());
  }
};

// Workout reward system - determine what items to unlock based on workout
export const getWorkoutRewards = (workoutType, userLevel) => {
  const baseRewards = {
    'jumping-jacks': { points: 25, category: 'accessories', items: ['sporty-glasses', 'sweatband'] },
    'push-ups': { points: 15, category: 'clothing', items: ['tank-top', 'athletic-wear'] },
    'yoga': { points: 40, category: 'hair', items: ['zen-bun', 'peaceful-waves'] },
    'running': { points: 50, category: 'accessories', items: ['running-cap', 'athletic-shoes'] },
    'dancing': { points: 35, category: 'clothing', items: ['dance-outfit', 'colorful-shirt'] }
  };
  
  const reward = baseRewards[workoutType] || { points: 20, category: 'accessories', items: ['basic-item'] };
  
  // Level bonus
  const levelBonus = Math.floor(userLevel / 5) * 5;
  
  return {
    ...reward,
    points: reward.points + levelBonus,
    levelBonus
  };
};

// Achievement system helpers
export const checkAchievements = (userStats) => {
  const achievements = [];
  
  // Workout achievements
  if (userStats.workoutsCompleted === 1) {
    achievements.push({ id: 'first-workout', name: 'First Steps', reward: 'medal' });
  }
  
  if (userStats.workoutsCompleted === 10) {
    achievements.push({ id: 'workout-warrior', name: 'Workout Warrior', reward: 'trophy' });
  }
  
  // Level achievements
  if (userStats.level === 5) {
    achievements.push({ id: 'level-5', name: 'Rising Star', reward: 'star-crown' });
  }
  
  if (userStats.level === 10) {
    achievements.push({ id: 'level-10', name: 'Fitness Master', reward: 'master-badge' });
  }
  
  // Point achievements
  if (userStats.points >= 1000) {
    achievements.push({ id: 'point-master', name: 'Point Collector', reward: 'golden-accessory' });
  }
  
  // Streak achievements
  if (userStats.streak >= 7) {
    achievements.push({ id: 'week-streak', name: 'Week Warrior', reward: 'consistency-badge' });
  }
  
  return achievements;
};

// Generate multiple random avatars for gallery/selection
export const generateAvatarCollection = (count = 6, style = 'avataaars') => {
  const collection = [];
  
  for (let i = 0; i < count; i++) {
    const avatar = createRandomAvatar(style);
    avatar.name = `Avatar ${i + 1}`;
    avatar.id = `random-${Date.now()}-${i}`;
    collection.push(avatar);
  }
  
  return collection;
};

// Avatar comparison utility
export const compareAvatars = (avatar1, avatar2) => {
  const differences = [];
  
  const compareFields = ['hair', 'clothing', 'accessories', 'hairColor', 'clothingColor', 'skin'];
  
  compareFields.forEach(field => {
    if (JSON.stringify(avatar1[field]) !== JSON.stringify(avatar2[field])) {
      differences.push({
        field,
        avatar1Value: avatar1[field],
        avatar2Value: avatar2[field]
      });
    }
  });
  
  return {
    identical: differences.length === 0,
    differences
  };
};

// Create avatar variations (slight modifications)
export const createAvatarVariations = (baseAvatar, count = 3) => {
  const variations = [];
  const unlockableItems = getUnlockableItems();
  
  for (let i = 0; i < count; i++) {
    const variation = { ...baseAvatar };
    
    // Randomly change one aspect
    const aspects = ['hair', 'clothing', 'hairColor', 'clothingColor'];
    const randomAspect = aspects[Math.floor(Math.random() * aspects.length)];
    
    if (randomAspect === 'hair' && unlockableItems.hair[1]) {
      variation.hair = unlockableItems.hair[1][Math.floor(Math.random() * unlockableItems.hair[1].length)];
    } else if (randomAspect === 'clothing' && unlockableItems.clothing[1]) {
      variation.clothing = unlockableItems.clothing[1][Math.floor(Math.random() * unlockableItems.clothing[1].length)];
    } else if (randomAspect === 'hairColor' && unlockableItems.colors[1]) {
      variation.hairColor = [unlockableItems.colors[1][Math.floor(Math.random() * unlockableItems.colors[1].length)]];
    } else if (randomAspect === 'clothingColor' && unlockableItems.colors[1]) {
      variation.clothingColor = [unlockableItems.colors[1][Math.floor(Math.random() * unlockableItems.colors[1].length)]];
    }
    
    variation.seed = generateRandomSeed();
    variation.name = `Variation ${i + 1}`;
    variation.id = `variation-${Date.now()}-${i}`;
    
    variations.push(variation);
  }
  
  return variations;
};

// Avatar fitness stats calculator
export const calculateAvatarFitnessStats = (userStats) => {
  const level = calculateLevel(userStats.points);
  const progress = calculateProgress(userStats.points);
  const nextLevelPoints = pointsToNextLevel(userStats.points);
  
  // Calculate fitness metrics
  const avgWorkoutLength = userStats.totalMinutesExercised / Math.max(userStats.workoutsCompleted, 1);
  const pointsPerWorkout = userStats.points / Math.max(userStats.workoutsCompleted, 1);
  
  return {
    level,
    progress: Math.round(progress * 100),
    nextLevelPoints,
    avgWorkoutLength: Math.round(avgWorkoutLength * 10) / 10,
    pointsPerWorkout: Math.round(pointsPerWorkout * 10) / 10,
    fitnessScore: Math.min(100, Math.round((userStats.workoutsCompleted * 10) + (userStats.streak * 5) + level)),
    rank: level >= 10 ? 'Master' : level >= 5 ? 'Expert' : level >= 3 ? 'Intermediate' : 'Beginner'
  };
};

// Motivational messages based on progress
export const getMotivationalMessage = (userStats) => {
  const fitnessStats = calculateAvatarFitnessStats(userStats);
  
  const messages = {
    'Beginner': [
      'Great start! Every journey begins with a single step! 🌟',
      'You\'re building healthy habits! Keep it up! 💪',
      'Amazing progress for a beginner! 🎉'
    ],
    'Intermediate': [
      'You\'re really getting the hang of this! 🔥',
      'Fantastic dedication to your fitness journey! 🏃‍♂️',
      'Your consistency is paying off! 📈'
    ],
    'Expert': [
      'Wow! You\'re becoming a fitness expert! 🏆',
      'Your dedication is truly inspiring! ⭐',
      'You\'re crushing your fitness goals! 💥'
    ],
    'Master': [
      'Incredible! You\'ve mastered the art of fitness! 👑',
      'You\'re a true fitness legend! 🏅',
      'Your commitment is absolutely amazing! 🌟'
    ]
  };
  
  const rankMessages = messages[fitnessStats.rank] || messages['Beginner'];
  return rankMessages[Math.floor(Math.random() * rankMessages.length)];
};

// Avatar preview with fitness overlay
export const generateFitnessAvatarPreview = (avatarSettings, userStats) => {
  const fitnessStats = calculateAvatarFitnessStats(userStats);
  const motivationalMessage = getMotivationalMessage(userStats);
  
  return {
    avatarUri: generateAvatarDataUri(avatarSettings),
    fitnessStats,
    motivationalMessage,
    badgeLevel: fitnessStats.rank,
    nextGoal: `Reach level ${fitnessStats.level + 1} (${fitnessStats.nextLevelPoints} points needed)`
  };
};

// Default export with all functions
export default {
  generateRandomSeed,
  getAvatarStyle,
  generateAvatarDataUri,
  getDefaultAvatar,
  calculateLevel,
  calculateProgress,
  pointsToNextLevel,
  getUnlockableItems,
  getItemsForLevel,
  getNewlyUnlockedItems,
  validateAvatarSettings,
  createRandomAvatar,
  exportAvatarSettings,
  importAvatarSettings,
  generateAvatarThumbnail,
  getWorkoutRewards,
  checkAchievements,
  generateAvatarCollection,
  compareAvatars,
  createAvatarVariations,
  calculateAvatarFitnessStats,
  getMotivationalMessage,
  generateFitnessAvatarPreview
};