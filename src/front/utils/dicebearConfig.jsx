// utils/dicebearConfig.jsx
/**
 * DiceBear Configuration for PixelPlay Fitness App
 * Defines all available options, styles, and configurations for avatar customization
 */

// Available avatar styles and their configurations
export const avatarStyles = {
    avataaars: {
        name: 'Avataaars',
        description: 'Fun cartoon-style avatars with lots of customization options',
        category: 'cartoon',
        complexity: 'high'
    },
    miniavs: {
        name: 'Miniavs',
        description: 'Cute minimalist avatars perfect for gaming',
        category: 'minimal',
        complexity: 'medium'
    },
    personas: {
        name: 'Personas',
        description: 'Professional-looking human avatars',
        category: 'realistic',
        complexity: 'medium'
    }
};

// Complete options for each avatar style
export const avatarOptions = {
    avataaars: {
        hair: [
            // Short hair styles
            'shortHairShortFlat', 'shortHairShortRound', 'shortHairShortWaved',
            'shortHairShortCurly', 'shortHairDreads01', 'shortHairDreads02',
            'shortHairFrizzle', 'shortHairShaggyMullet', 'shortHairSides',
            'shortHairTheCaesar', 'shortHairTheCaesarSidePart',

            // Long hair styles
            'longHairBigHair', 'longHairBob', 'longHairBun', 'longHairCurly',
            'longHairCurvy', 'longHairDreads', 'longHairFro', 'longHairNotTooLong',
            'longHairShavedSides', 'longHairMiaWallace', 'longHairStraight',
            'longHairStraight2', 'longHairStraightStrand',

            // Special styles
            'bigHair', 'bob', 'bun', 'curly', 'curvy', 'dreads', 'frida', 'fro',
            'froAndBand', 'miaWallace', 'hat', 'hijab', 'turban', 'winterHat1',
            'winterHat2', 'winterHat3', 'winterHat4'
        ],

        clothing: [
            'blazerShirt', 'blazerSweater', 'collarSweater', 'graphicShirt',
            'hoodie', 'overall', 'shirtCrewNeck', 'shirtScoopNeck', 'shirtVNeck'
        ],

        accessories: [
            'blank', 'kurt', 'prescription01', 'prescription02', 'round',
            'sunglasses', 'wayfarers'
        ],

        eyebrows: [
            'angry', 'angryNatural', 'default', 'defaultNatural', 'flatNatural',
            'raisedExcited', 'raisedExcitedNatural', 'sadConcerned',
            'sadConcernedNatural', 'unibrowNatural', 'upDown', 'upDownNatural'
        ],

        eyes: [
            'close', 'cry', 'default', 'dizzy', 'eyeRoll', 'happy', 'hearts',
            'side', 'squint', 'surprised', 'wink', 'winkWacky'
        ],

        mouth: [
            'concerned', 'default', 'disbelief', 'eating', 'grimace', 'sad',
            'screamOpen', 'serious', 'smile', 'tongue', 'twinkle', 'vomit'
        ],

        facialHair: [
            'blank', 'beardMedium', 'beardLight', 'beardMajestic',
            'moustacheFancy', 'moustacheMagnum'
        ],

        skin: [
            'tanned', 'yellow', 'pale', 'light', 'brown', 'darkBrown', 'black'
        ]
    },

    miniavs: {
        hair: [
            'short', 'medium', 'long', 'buzz', 'curly', 'wavy', 'straight',
            'ponytail', 'bun', 'mohawk'
        ],
        clothing: [
            'shirt', 'hoodie', 'jacket', 'dress', 'tank', 'formal', 'casual'
        ],
        accessories: [
            'none', 'glasses', 'sunglasses', 'hat', 'cap', 'headphones'
        ],
        mood: [
            'happy', 'sad', 'surprised', 'angry', 'neutral', 'excited', 'sleepy'
        ]
    },

    personas: {
        hair: [
            'short', 'medium', 'long', 'buzz', 'bald', 'wavy', 'straight', 'curly'
        ],
        clothing: [
            'casual', 'business', 'formal', 'sporty', 'trendy'
        ],
        accessories: [
            'none', 'glasses', 'sunglasses', 'watch', 'jewelry'
        ],
        age: [
            'young', 'adult', 'mature'
        ]
    }
};

// Color mappings for easy selection and display
export const colorMappings = {
    // Hair colors with hex values
    hair: {
        'auburn': { hex: '#A55728', name: 'Auburn' },
        'black': { hex: '#2C1B18', name: 'Black' },
        'blonde': { hex: '#B58143', name: 'Blonde' },
        'blondeGolden': { hex: '#D6B370', name: 'Golden Blonde' },
        'brown': { hex: '#724133', name: 'Brown' },
        'brownDark': { hex: '#4A312C', name: 'Dark Brown' },
        'pastelPink': { hex: '#F59797', name: 'Pastel Pink' },
        'platinum': { hex: '#ECDCBF', name: 'Platinum' },
        'red': { hex: '#C93305', name: 'Red' },
        'silverGray': { hex: '#E8E1E1', name: 'Silver Gray' }
    },

    // Clothing colors
    clothing: {
        'black': { hex: '#262E33', name: 'Black' },
        'blue01': { hex: '#65C9FF', name: 'Light Blue' },
        'blue02': { hex: '#5199E4', name: 'Blue' },
        'blue03': { hex: '#25557C', name: 'Dark Blue' },
        'gray01': { hex: '#E6E6E6', name: 'Light Gray' },
        'gray02': { hex: '#929598', name: 'Gray' },
        'heather': { hex: '#3C4F5C', name: 'Heather' },
        'pastelBlue': { hex: '#B1E2FF', name: 'Pastel Blue' },
        'pastelGreen': { hex: '#A7FFC4', name: 'Pastel Green' },
        'pastelOrange': { hex: '#FFDEB5', name: 'Pastel Orange' },
        'pastelRed': { hex: '#FFAFB9', name: 'Pastel Red' },
        'pastelYellow': { hex: '#FFFFB1', name: 'Pastel Yellow' },
        'pink': { hex: '#FF488E', name: 'Pink' },
        'red': { hex: '#FF5A5A', name: 'Red' },
        'white': { hex: '#FFFFFF', name: 'White' }
    },

    // Skin tones
    skin: {
        'tanned': { hex: '#FD9841', name: 'Tanned' },
        'yellow': { hex: '#F8D25C', name: 'Light' },
        'pale': { hex: '#FDBCB4', name: 'Pale' },
        'light': { hex: '#EDB98A', name: 'Fair' },
        'brown': { hex: '#D08B5B', name: 'Medium' },
        'darkBrown': { hex: '#AE5D29', name: 'Dark' },
        'black': { hex: '#614335', name: 'Deep' }
    },

    // Background colors
    background: {
        'transparent': { hex: 'transparent', name: 'Transparent' },
        'blue': { hex: '#3498db', name: 'Blue' },
        'green': { hex: '#2ecc71', name: 'Green' },
        'purple': { hex: '#9b59b6', name: 'Purple' },
        'orange': { hex: '#e67e22', name: 'Orange' },
        'red': { hex: '#e74c3c', name: 'Red' },
        'yellow': { hex: '#f1c40f', name: 'Yellow' },
        'pink': { hex: '#e91e63', name: 'Pink' }
    }
};

// Workout-themed avatar configurations
export const fitnessThemes = {
    athlete: {
        name: 'Athletic Champion',
        hair: ['shortHairShortCurly', 'shortHairSides', 'ponytail'],
        clothing: ['hoodie', 'tank', 'sporty'],
        accessories: ['sunglasses', 'cap', 'sweatband'],
        colors: ['blue', 'red', 'black', 'white']
    },

    yogi: {
        name: 'Zen Master',
        hair: ['longHairBun', 'longHairStraight', 'bun'],
        clothing: ['comfortable', 'loose', 'breathable'],
        accessories: ['none', 'simple'],
        colors: ['pastelBlue', 'pastelGreen', 'white', 'light']
    },

    runner: {
        name: 'Speed Demon',
        hair: ['shortHairShortFlat', 'ponytail', 'shortHairSides'],
        clothing: ['athletic', 'lightweight', 'sporty'],
        accessories: ['cap', 'sunglasses', 'watch'],
        colors: ['bright', 'energetic', 'bold']
    },

    dancer: {
        name: 'Rhythm Master',
        hair: ['curly', 'flowing', 'expressive'],
        clothing: ['flexible', 'colorful', 'stylish'],
        accessories: ['headphones', 'colorful'],
        colors: ['vibrant', 'rainbow', 'expressive']
    },

    strongPerson: {
        name: 'Power Lifter',
        hair: ['shortHairShortFlat', 'buzz', 'simple'],
        clothing: ['tank', 'strong', 'muscular'],
        accessories: ['none', 'minimal'],
        colors: ['dark', 'strong', 'bold']
    }
};

// Level-based unlock system
export const levelUnlocks = {
    1: {
        message: 'Welcome to PixelPlay!',
        unlocks: ['basic hair', 'basic clothing', 'starter colors']
    },
    2: {
        message: 'Getting stronger!',
        unlocks: ['glasses', 'new hair styles']
    },
    3: {
        message: 'Fitness enthusiast!',
        unlocks: ['sunglasses', 'athletic wear']
    },
    5: {
        message: 'Rising star!',
        unlocks: ['premium hair', 'special accessories']
    },
    7: {
        message: 'Workout warrior!',
        unlocks: ['advanced styles', 'unique colors']
    },
    10: {
        message: 'Fitness master!',
        unlocks: ['exclusive items', 'master badge']
    },
    15: {
        message: 'Avatar legend!',
        unlocks: ['legendary items', 'all styles']
    }
};

// Achievement-based rewards
export const achievementRewards = {
    firstWorkout: {
        name: 'First Steps',
        description: 'Complete your first workout',
        icon: '🥇',
        reward: { type: 'accessory', item: 'medal' }
    },

    weekStreak: {
        name: 'Week Warrior',
        description: 'Exercise for 7 days in a row',
        icon: '🔥',
        reward: { type: 'hair', item: 'flame-hair' }
    },

    pointCollector: {
        name: 'Point Master',
        description: 'Earn 1000 points',
        icon: '💎',
        reward: { type: 'accessory', item: 'diamond-crown' }
    },

    marathoner: {
        name: 'Endurance King',
        description: 'Exercise for 60 minutes total',
        icon: '👑',
        reward: { type: 'clothing', item: 'royal-outfit' }
    },

    socialButterfly: {
        name: 'Avatar Creator',
        description: 'Create 10 different avatars',
        icon: '🎨',
        reward: { type: 'unlockAll', item: 'artist-palette' }
    }
};

// Preset avatar configurations for quick selection
export const presetAvatars = {
    beginner: {
        name: 'Fitness Beginner',
        style: 'avataaars',
        hair: 'shortHairShortWaved',
        clothing: 'hoodie',
        accessories: 'blank',
        hairColor: ['brown'],
        clothingColor: ['blue01'],
        skin: ['light']
    },

    athlete: {
        name: 'Pro Athlete',
        style: 'avataaars',
        hair: 'shortHairSides',
        clothing: 'tank',
        accessories: 'sunglasses',
        hairColor: ['black'],
        clothingColor: ['red'],
        skin: ['tanned']
    },

    yogi: {
        name: 'Yoga Master',
        style: 'miniavs',
        hair: 'bun',
        clothing: 'comfortable',
        mood: 'peaceful',
        colors: ['pastelBlue']
    },

    dancer: {
        name: 'Dance Star',
        style: 'personas',
        hair: 'curly',
        clothing: 'trendy',
        accessories: 'headphones'
    }
};

// Validation schemas for different avatar styles
export const validationSchemas = {
    avataaars: {
        required: ['style', 'seed'],
        optional: [
            'hair', 'hairColor', 'clothing', 'clothingColor', 'accessories',
            'eyebrows', 'eyes', 'mouth', 'facialHair', 'skin', 'backgroundColor'
        ],
        arrays: ['hairColor', 'clothingColor', 'accessories', 'facialHair']
    },

    miniavs: {
        required: ['style', 'seed'],
        optional: ['hair', 'clothing', 'accessories', 'mood'],
        arrays: []
    },

    personas: {
        required: ['style', 'seed'],
        optional: ['hair', 'clothing', 'accessories', 'age'],
        arrays: []
    }
};

// Export configuration object
export const diceBearConfig = {
    avatarStyles,
    avatarOptions,
    colorMappings,
    fitnessThemes,
    levelUnlocks,
    achievementRewards,
    presetAvatars,
    validationSchemas
};

// Helper functions for working with configurations
export const getStyleOptions = (styleName) => {
    return avatarOptions[styleName] || avatarOptions.avataaars;
};

export const getColorOptions = (colorType) => {
    return colorMappings[colorType] || {};
};

export const getThemeByName = (themeName) => {
    return fitnessThemes[themeName] || fitnessThemes.athlete;
};

export const getUnlocksForLevel = (level) => {
    return levelUnlocks[level] || null;
};

export const getPresetByName = (presetName) => {
    return presetAvatars[presetName] || presetAvatars.beginner;
};

export const validateStyleConfig = (styleName, config) => {
    const schema = validationSchemas[styleName];
    if (!schema) return false;

    // Check required fields
    for (const field of schema.required) {
        if (!config[field]) return false;
    }

    return true;
};

// Random configuration generators
export const generateRandomConfig = (styleName = 'avataaars') => {
    const options = getStyleOptions(styleName);
    const config = {
        style: styleName,
        seed: `random-${Date.now()}`
    };

    // Add random selections for each option type
    Object.keys(options).forEach(optionType => {
        if (Array.isArray(options[optionType]) && options[optionType].length > 0) {
            const randomIndex = Math.floor(Math.random() * options[optionType].length);
            config[optionType] = options[optionType][randomIndex];
        }
    });

    // Add random colors if applicable
    if (styleName === 'avataaars') {
        const hairColors = Object.keys(colorMappings.hair);
        const clothingColors = Object.keys(colorMappings.clothing);
        const skinTones = Object.keys(colorMappings.skin);

        config.hairColor = [hairColors[Math.floor(Math.random() * hairColors.length)]];
        config.clothingColor = [clothingColors[Math.floor(Math.random() * clothingColors.length)]];
        config.skin = [skinTones[Math.floor(Math.random() * skinTones.length)]];
    }

    return config;
};

// Generate theme-based configuration
export const generateThemeConfig = (themeName, styleName = 'avataaars') => {
    const theme = getThemeByName(themeName);
    const baseConfig = {
        style: styleName,
        seed: `${themeName}-${Date.now()}`
    };

    // Apply theme-specific options
    if (theme.hair && theme.hair.length > 0) {
        baseConfig.hair = theme.hair[Math.floor(Math.random() * theme.hair.length)];
    }

    if (theme.clothing && theme.clothing.length > 0) {
        baseConfig.clothing = theme.clothing[Math.floor(Math.random() * theme.clothing.length)];
    }

    if (theme.accessories && theme.accessories.length > 0) {
        baseConfig.accessories = theme.accessories[Math.floor(Math.random() * theme.accessories.length)];
    }

    // Apply theme colors
    if (theme.colors && theme.colors.length > 0 && styleName === 'avataaars') {
        const themeColor = theme.colors[Math.floor(Math.random() * theme.colors.length)];
        baseConfig.hairColor = [themeColor];
        baseConfig.clothingColor = [themeColor];
    }

    return baseConfig;
};

// Get available options for a specific level
export const getOptionsForLevel = (level, styleName = 'avataaars') => {
    const allOptions = getStyleOptions(styleName);
    const levelItems = {};

    // Basic items available at level 1
    const baseItems = {
        hair: allOptions.hair?.slice(0, 3) || [],
        clothing: allOptions.clothing?.slice(0, 3) || [],
        accessories: ['blank'],
        colors: ['brown', 'blue01', 'light']
    };

    // Add more items based on level
    const itemsPerLevel = Math.floor(level / 2) + 1;

    Object.keys(allOptions).forEach(category => {
        if (Array.isArray(allOptions[category])) {
            const maxItems = Math.min(
                baseItems[category]?.length + itemsPerLevel,
                allOptions[category].length
            );
            levelItems[category] = allOptions[category].slice(0, maxItems);
        }
    });

    return levelItems;
};

// Color palette generator for UI
export const generateColorPalette = (colorType = 'clothing') => {
    const colors = colorMappings[colorType] || colorMappings.clothing;

    return Object.entries(colors).map(([key, value]) => ({
        id: key,
        name: value.name,
        hex: value.hex,
        category: colorType
    }));
};

// Style comparison helper
export const compareStyles = () => {
    return Object.entries(avatarStyles).map(([key, style]) => ({
        id: key,
        ...style,
        optionCount: Object.keys(avatarOptions[key] || {}).length,
        colorOptions: key === 'avataaars' ? Object.keys(colorMappings.hair).length : 0
    }));
};

// Export default configuration
export default {
    avatarStyles,
    avatarOptions,
    colorMappings,
    fitnessThemes,
    levelUnlocks,
    achievementRewards,
    presetAvatars,
    validationSchemas,
    getStyleOptions,
    getColorOptions,
    getThemeByName,
    getUnlocksForLevel,
    getPresetByName,
    validateStyleConfig,
    generateRandomConfig,
    generateThemeConfig,
    getOptionsForLevel,
    generateColorPalette,
    compareStyles
};

// Utility constants for easy importing
export const AVATAR_STYLES = Object.keys(avatarStyles);
export const FITNESS_THEMES = Object.keys(fitnessThemes);
export const COLOR_TYPES = Object.keys(colorMappings);
export const PRESET_NAMES = Object.keys(presetAvatars);
export const ACHIEVEMENT_IDS = Object.keys(achievementRewards);

// Quick access to common configurations
export const QUICK_CONFIGS = {
    // Beginner-friendly minimal options
    SIMPLE: {
        hair: ['shortHairShortWaved', 'longHairStraight', 'bob'],
        clothing: ['hoodie', 'tshirt', 'blazerShirt'],
        accessories: ['blank', 'glasses', 'sunglasses'],
        colors: ['brown', 'blonde', 'black', 'blue01', 'red', 'green']
    },

    // Full customization options
    ADVANCED: avatarOptions.avataaars,

    // Mobile-optimized (fewer options for smaller screens)
    MOBILE: {
        hair: ['shortHairShortWaved', 'longHairStraight', 'bob', 'bun'],
        clothing: ['hoodie', 'tshirt', 'blazerShirt', 'tank'],
        accessories: ['blank', 'glasses', 'sunglasses'],
        colors: ['brown', 'blonde', 'black', 'blue01', 'red']
    }
};

// Error messages for validation
export const ERROR_MESSAGES = {
    INVALID_STYLE: 'Invalid avatar style selected',
    MISSING_SEED: 'Avatar seed is required',
    INVALID_CONFIG: 'Invalid avatar configuration',
    GENERATION_FAILED: 'Failed to generate avatar',
    INVALID_COLOR: 'Invalid color selection',
    LEVEL_TOO_LOW: 'Item not unlocked at current level',
    THEME_NOT_FOUND: 'Fitness theme not found'
};

// Success messages for user feedback
export const SUCCESS_MESSAGES = {
    AVATAR_CREATED: 'Avatar created successfully! 🎉',
    AVATAR_SAVED: 'Avatar saved to your collection! 💾',
    LEVEL_UP: 'Level up! New items unlocked! 🎊',
    ACHIEVEMENT_UNLOCKED: 'Achievement unlocked! 🏆',
    ITEM_UNLOCKED: 'New item unlocked! ✨',
    THEME_APPLIED: 'Theme applied successfully! 🎨'
};

// Configuration for different app modes
export const APP_MODES = {
    KIDS: {
        simplifiedUI: true,
        maxOptions: 5,
        autoSave: true,
        parentalControls: true,
        allowedStyles: ['avataaars', 'miniavs']
    },

    TEEN: {
        simplifiedUI: false,
        maxOptions: 10,
        autoSave: true,
        parentalControls: false,
        allowedStyles: ['avataaars', 'miniavs', 'personas']
    },

    ADULT: {
        simplifiedUI: false,
        maxOptions: -1, // unlimited
        autoSave: false,
        parentalControls: false,
        allowedStyles: ['avataaars', 'miniavs', 'personas']
    }
};