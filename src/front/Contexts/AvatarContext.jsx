import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AvatarContext = createContext();

// Initial state
const initialState = {
  userStats: {
    level: 1,
    points: 0,
    workoutsCompleted: 0,
    totalMinutesExercised: 0
  },
  currentAvatar: {
    style: 'avataaars',
    seed: 'default',
    accessories: [],
    accessoriesChance: 50,
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
  savedAvatars: [],
  inventory: {
    hair: ['shortWaved', 'longHair'],
    clothing: ['blazerShirt', 'hoodie'],
    accessories: ['glasses'],
    colors: ['blue', 'red', 'green', 'purple']
  },
  // Backend data (using defaults for now)
  backendInventory: [],
  achievements: [],
  editorSettings: {
    currentStyle: 'avataaars',
    previewMode: 'live'
  },
  notifications: [],
  isLoading: false,
  syncError: null
};

// Reducer
const avatarReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_AVATAR':
      return { ...state, currentAvatar: { ...state.currentAvatar, ...action.payload } };
    case 'SAVE_AVATAR':
      const newAvatar = {
        id: Date.now(),
        name: action.payload.name || `Avatar ${state.savedAvatars.length + 1}`,
        settings: action.payload.settings,
        createdAt: new Date().toISOString()
      };
      return { ...state, savedAvatars: [...state.savedAvatars, newAvatar] };
    case 'SET_CURRENT_AVATAR':
      return { ...state, currentAvatar: action.payload };
    case 'ADD_POINTS':
      const newPoints = state.userStats.points + action.payload;
      const newLevel = Math.floor(newPoints / 100) + 1;
      const leveledUp = newLevel > state.userStats.level;
      return {
        ...state,
        userStats: { ...state.userStats, points: newPoints, level: newLevel },
        notifications: leveledUp
          ? [...state.notifications, { id: Date.now(), message: `Level Up! You're now level ${newLevel}!`, type: 'success' }]
          : state.notifications
      };
    case 'COMPLETE_WORKOUT':
      return {
        ...state,
        userStats: {
          ...state.userStats,
          workoutsCompleted: state.userStats.workoutsCompleted + 1,
          totalMinutesExercised: state.userStats.totalMinutesExercised + action.payload.minutes
        }
      };
    case 'UNLOCK_ITEM':
      const { category, item } = action.payload;
      return {
        ...state,
        inventory: { ...state.inventory, [category]: [...state.inventory[category], item] },
        notifications: [...state.notifications, { id: Date.now(), message: `New ${category} unlocked: ${item}!`, type: 'unlock' }]
      };
    case 'CLEAR_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case 'LOAD_USER_DATA':
      return { ...state, ...action.payload };
    case 'SET_BACKEND_INVENTORY':
      return { ...state, backendInventory: action.payload };
    case 'SET_ACHIEVEMENTS':
      return { ...state, achievements: action.payload };
    case 'SET_USER_STATS_FROM_BACKEND':
      return { ...state, userStats: { ...state.userStats, ...action.payload } };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, syncError: action.payload };
    default:
      return state;
  }
};

// Provider
export const AvatarProvider = ({ children }) => {
  const [state, dispatch] = useReducer(avatarReducer, initialState);

  // Save LOCAL state to localStorage (avatars saved in browser)
  useEffect(() => {
    const dataToSave = {
      userStats: state.userStats,
      currentAvatar: state.currentAvatar,
      savedAvatars: state.savedAvatars,
      inventory: state.inventory
    };
    localStorage.setItem('pixelplay-data', JSON.stringify(dataToSave));
  }, [state.userStats, state.currentAvatar, state.savedAvatars, state.inventory]);

  // Load LOCAL state from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('pixelplay-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        dispatch({ type: 'LOAD_USER_DATA', payload: parsed });
      } catch (error) {
        console.log('Could not load saved data', error);
      }
    }
  }, []);

  // ⭐ REMOVED BACKEND FETCHING - No auth required!
  // Backend calls are commented out for now

  const refreshData = () => {
    console.log('📦 Refresh requested, but backend fetch is disabled');
    // Backend fetch disabled - using local data only
  };

  // Helper functions
  const value = {
    ...state,
    dispatch,
    isLoading: false,
    syncError: null,
    refreshData,
    updateAvatar: (changes) => dispatch({ type: 'UPDATE_AVATAR', payload: changes }),
    saveAvatar: (name, settings) => dispatch({ type: 'SAVE_AVATAR', payload: { name, settings } }),
    setCurrentAvatar: (avatar) => dispatch({ type: 'SET_CURRENT_AVATAR', payload: avatar }),
    addPoints: (points) => dispatch({ type: 'ADD_POINTS', payload: points }),
    completeWorkout: (minutes) => dispatch({ type: 'COMPLETE_WORKOUT', payload: { minutes } }),
    unlockItem: (category, item) => dispatch({ type: 'UNLOCK_ITEM', payload: { category, item } }),
    clearNotification: (id) => dispatch({ type: 'CLEAR_NOTIFICATION', payload: id })
  };

  return <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>;
};

// Custom hook
export const useAvatar = () => {
  const context = useContext(AvatarContext);
  if (!context) throw new Error('useAvatar must be used within an AvatarProvider');
  return context;
};