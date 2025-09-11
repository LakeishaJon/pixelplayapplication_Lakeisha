// 🔗 AvatarContext.js - The Avatar Data Sharing Center!
// This helps different parts of your PixelPlay app talk to each other about avatars

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AvatarService from '../services/AvatarService';
import DiceBearConfig from '../services/DiceBearConfig';
import UnlockableItems from '../data/UnlockableItems';

// 🎯 Create the Avatar Context (like a messenger between pages)
const AvatarContext = createContext();

// 🎮 Initial State (what the app starts with)
const initialState = {
  // 👤 Current User Info
  currentAvatar: null,
  userStats: {
    level: 1,
    fitnessPoints: 0,
    totalWorkouts: 0,
    consecutiveDays: 0,
    achievements: [],
    workoutTypes: {
      cardio: 0,
      strength: 0,
      flexibility: 0,
      dance: 0
    }
  },
  
  // 🎒 User Inventory
  inventory: {
    hair: ['short01', 'short02'],
    clothing: ['shirt01', 'shirt02'],
    accessories: [],
    colors: {
      hair: ['8B4513', 'FFD700', '000000'],
      clothing: ['ff6b6b', '4ecdc4', '45b7d1'],
      skin: ['f2d3b1', 'ddb98a', 'c68642']
    },
    achievements: [],
    unlockedCollections: []
  },

  // 💾 Saved Avatars
  savedAvatars: [],
  
  // 🎨 Editor State
  editorSettings: {
    style: 'adventurer',
    seed: 'player1',
    hair: ['short01'],
    hairColor: ['8B4513'],
    eyes: ['variant01'],
    eyeColor: ['0066cc'],
    mouth: ['variant01'],
    skinColor: ['f2d3b1'],
    clothing: ['shirt01'],
    clothingColor: ['4ecdc4'],
    backgroundColor: ['b6e3f4']
  },

  // 🌟 App State
  isLoading: false,
  error: null,
  notifications: []
};

// 🔄 Action Types (different things that can happen)
const ActionTypes = {
  // Avatar Actions
  SET_CURRENT_AVATAR: 'SET_CURRENT_AVATAR',
  UPDATE_EDITOR_SETTINGS: 'UPDATE_EDITOR_SETTINGS',
  SAVE_AVATAR: 'SAVE_AVATAR',
  DELETE_AVATAR: 'DELETE_AVATAR',
  LOAD_SAVED_AVATARS: 'LOAD_SAVED_AVATARS',
  
  // User Progress Actions
  UPDATE_USER_STATS: 'UPDATE_USER_STATS',
  ADD_WORKOUT: 'ADD_WORKOUT',
  UNLOCK_ACHIEVEMENT: 'UNLOCK_ACHIEVEMENT',
  LEVEL_UP: 'LEVEL_UP',
  
  // Inventory Actions
  ADD_TO_INVENTORY: 'ADD_TO_INVENTORY',
  UPDATE_INVENTORY: 'UPDATE_INVENTORY',
  UNLOCK_COLLECTION: 'UNLOCK_COLLECTION',
  
  // App State Actions
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// 🎛️ Reducer Function (handles all the state changes)
const avatarReducer = (state, action) => {
  switch (action.type) {
    
    // 👤 Avatar Management
    case ActionTypes.SET_CURRENT_AVATAR:
      return {
        ...state,
        currentAvatar: action.payload
      };

    case ActionTypes.UPDATE_EDITOR_SETTINGS:
      return {
        ...state,
        editorSettings: {
          ...state.editorSettings,
          ...action.payload
        }
      };

    case ActionTypes.SAVE_AVATAR:
      return {
        ...state,
        savedAvatars: [...state.savedAvatars, action.payload]
      };

    case ActionTypes.DELETE_AVATAR:
      return {
        ...state,
        savedAvatars: state.savedAvatars.filter(avatar => avatar.id !== action.payload)
      };

    case ActionTypes.LOAD_SAVED_AVATARS:
      return {
        ...state,
        savedAvatars: action.payload
      };

    // 💪 User Progress Management
    case ActionTypes.UPDATE_USER_STATS:
      return {
        ...state,
        userStats: {
          ...state.userStats,
          ...action.payload
        }
      };

    case ActionTypes.ADD_WORKOUT:
      const { workoutType, points = 25 } = action.payload;
      const newStats = {
        ...state.userStats,
        totalWorkouts: state.userStats.totalWorkouts + 1,
        fitnessPoints: state.userStats.fitnessPoints + points,
        workoutTypes: {
          ...state.userStats.workoutTypes,
          [workoutType]: (state.userStats.workoutTypes[workoutType] || 0) + 1
        }
      };

      // Check for level up
      const newLevel = Math.floor(newStats.fitnessPoints / 100) + 1;
      if (newLevel > state.userStats.level) {
        newStats.level = newLevel;
        // Could trigger level up notification here
      }

      return {
        ...state,
        userStats: newStats
      };

    case ActionTypes.UNLOCK_ACHIEVEMENT:
      const achievement = action.payload;
      return {
        ...state,
        userStats: {
          ...state.userStats,
          achievements: [...state.userStats.achievements, achievement.id],
          fitnessPoints: state.userStats.fitnessPoints + (achievement.points || 50)
        },
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            type: 'achievement',
            title: `🏆 Achievement Unlocked!`,
            message: achievement.name,
            emoji: achievement.emoji,
            timestamp: new Date().toISOString()
          }
        ]
      };

    case ActionTypes.LEVEL_UP:
      return {
        ...state,
        userStats: {
          ...state.userStats,
          level: action.payload
        },
        notifications: [
          ...state.notifications,
          {
            id: Date.now(),
            type: 'levelUp',
            title: `🌟 Level Up!`,
            message: `You reached level ${action.payload}!`,
            emoji: '⭐',
            timestamp: new Date().toISOString()
          }
        ]
      };

    // 🎒 Inventory Management
    case ActionTypes.ADD_TO_INVENTORY:
      const { itemType, itemId } = action.payload;
      return {
        ...state,
        inventory: {
          ...state.inventory,
          [itemType]: [...(state.inventory[itemType] || []), itemId]
        }
      };

    case ActionTypes.UPDATE_INVENTORY:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          ...action.payload
        }
      };

    case ActionTypes.UNLOCK_COLLECTION:
      return {
        ...state,
        inventory: {
          ...state.inventory,
          unlockedCollections: [...state.inventory.unlockedCollections, action.payload]
        }
      };

    // 🌟 App State Management
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case ActionTypes.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };

    case ActionTypes.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(notif => notif.id !== action.payload)
      };

    default:
      return state;
  }
};

// 🎮 Avatar Provider Component (wraps your app to share avatar data)
export const AvatarProvider = ({ children }) => {
  const [state, dispatch] = useReducer(avatarReducer, initialState);

  // 🚀 Load initial data when app starts
  useEffect(() => {
    loadInitialData();
  }, []);

  // 📥 Load saved data from storage
  const loadInitialData = async () => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });

      // Load saved avatars
      const savedAvatars = AvatarService.getSavedAvatars();
      dispatch({ type: ActionTypes.LOAD_SAVED_AVATARS, payload: savedAvatars });

      // Load current avatar
      const currentAvatar = AvatarService.getCurrentAvatar();
      if (currentAvatar) {
        dispatch({ type: ActionTypes.SET_CURRENT_AVATAR, payload: currentAvatar });
      }

      // Load user inventory and stats
      const inventory = AvatarService.getUserInventory();
      dispatch({ type: ActionTypes.UPDATE_INVENTORY, payload: inventory });

      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    } catch (error) {
      dispatch({ type: ActionTypes.SET_ERROR, payload: 'Failed to load avatar data' });
    }
  };

  // 🎯 Action Creators (functions to update the state)
  const actions = {
    
    // 👤 Avatar Actions
    setCurrentAvatar: (avatar) => {
      AvatarService.setCurrentAvatar(avatar);
      dispatch({ type: ActionTypes.SET_CURRENT_AVATAR, payload: avatar });
    },

    updateEditorSettings: (settings) => {
      dispatch({ type: ActionTypes.UPDATE_EDITOR_SETTINGS, payload: settings });
    },

    saveAvatar: (avatarData) => {
      const savedAvatar = AvatarService.saveAvatar(avatarData);
      if (savedAvatar) {
        dispatch({ type: ActionTypes.SAVE_AVATAR, payload: savedAvatar });
        actions.showNotification({
          type: 'success',
          title: '💾 Avatar Saved!',
          message: `"${savedAvatar.name}" has been saved to your collection!`,
          emoji: '🎉'
        });
        return savedAvatar;
      }
      return null;
    },

    deleteAvatar: (avatarId) => {
      const success = AvatarService.deleteAvatar(avatarId);
      if (success) {
        dispatch({ type: ActionTypes.DELETE_AVATAR, payload: avatarId });
        actions.showNotification({
          type: 'info',
          title: '🗑️ Avatar Deleted',
          message: 'Avatar has been removed from your collection.',
          emoji: '👋'
        });
      }
    },

    // 💪 Fitness Actions
    addWorkout: (workoutType, extraPoints = 0) => {
      const totalPoints = 25 + extraPoints;
      dispatch({ 
        type: ActionTypes.ADD_WORKOUT, 
        payload: { workoutType, points: totalPoints }
      });
      
      // Check for achievements
      actions.checkAchievements();
      
      actions.showNotification({
        type: 'fitness',
        title: '💪 Workout Complete!',
        message: `Great ${workoutType} workout! +${totalPoints} points!`,
        emoji: '🔥'
      });
    },

    unlockAchievement: (achievementId) => {
      const achievement = UnlockableItems.achievements[achievementId];
      if (achievement && !state.userStats.achievements.includes(achievementId)) {
        dispatch({ type: ActionTypes.UNLOCK_ACHIEVEMENT, payload: achievement });
        
        // Award items from achievement
        if (achievement.rewards?.items) {
          achievement.rewards.items.forEach(item => {
            actions.addToInventory(item.type, item.id);
          });
        }
      }
    },

    checkAchievements: () => {
      // Check various achievements based on current stats
      const stats = state.userStats;
      
      // First workout achievement
      if (stats.totalWorkouts === 1) {
        actions.unlockAchievement('first_workout');
      }
      
      // Five workouts achievement
      if (stats.totalWorkouts === 5) {
        actions.unlockAchievement('five_workouts');
      }
      
      // Cardio master achievement
      if (stats.workoutTypes.cardio === 25) {
        actions.unlockAchievement('cardio_master');
      }
      
      // Add more achievement checks here...
    },

    // 🎒 Inventory Actions
    addToInventory: (itemType, itemId) => {
      const added = AvatarService.addToInventory(itemId, itemType);
      if (added) {
        dispatch({ type: ActionTypes.ADD_TO_INVENTORY, payload: { itemType, itemId } });
        actions.showNotification({
          type: 'unlock',
          title: '🎁 New Item Unlocked!',
          message: `You earned a new ${itemType}!`,
          emoji: '✨'
        });
      }
    },

    hasItem: (itemType, itemId) => {
      return state.inventory[itemType]?.includes(itemId) || false;
    },

    getUnlockedItems: (itemType) => {
      const userLevel = state.userStats.level;
      return DiceBearConfig.getUnlockedItems(userLevel, itemType);
    },

    // 🌟 Notification Actions
    showNotification: (notification) => {
      const notif = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        ...notification
      };
      dispatch({ type: ActionTypes.ADD_NOTIFICATION, payload: notif });
      
      // Auto-remove notification after 5 seconds
      setTimeout(() => {
        actions.removeNotification(notif.id);
      }, 5000);
    },

    removeNotification: (notificationId) => {
      dispatch({ type: ActionTypes.REMOVE_NOTIFICATION, payload: notificationId });
    },

    clearError: () => {
      dispatch({ type: ActionTypes.CLEAR_ERROR });
    },

    // 📊 Stats and Progress
    getProgress: () => {
      const stats = state.userStats;
      const currentLevel = stats.level;
      const pointsForCurrentLevel = (currentLevel - 1) * 100;
      const pointsForNextLevel = currentLevel * 100;
      const progressToNextLevel = ((stats.fitnessPoints - pointsForCurrentLevel) / 100) * 100;
      
      return {
        level: currentLevel,
        totalPoints: stats.fitnessPoints,
        progressToNextLevel: Math.round(progressToNextLevel),
        pointsNeededForNextLevel: pointsForNextLevel - stats.fitnessPoints,
        totalWorkouts: stats.totalWorkouts,
        achievementsCount: stats.achievements.length
      };
    },

    // 🎮 Random Avatar Generator
    generateRandomAvatar: () => {
      const userLevel = state.userStats.level;
      const randomSettings = DiceBearConfig.getRandomAvatarSettings(userLevel);
      actions.updateEditorSettings(randomSettings);
    }
  };

  // 🎁 Context value (everything other components can access)
  const contextValue = {
    // State
    ...state,
    
    // Actions
    ...actions,
    
    // Computed values
    progress: actions.getProgress()
  };

  return (
    <AvatarContext.Provider value={contextValue}>
      {children}
    </AvatarContext.Provider>
  );
};

// 🎯 Custom Hook to use Avatar Context
export const useAvatar = () => {
  const context = useContext(AvatarContext);
  
  if (!context) {
    throw new Error('useAvatar must be used within an AvatarProvider');