import { createAvatar } from '@dicebear/core';
import { 
  micah,
  avataaars,
  bigSmile,
  miniavs,
  personas,
  bigEars,
  adventurer,
  pixelArt,
  openPeeps,
  croodles,
  lorelei
} from '@dicebear/collection';

// Updated DiceBear avatar styles configuration with working options
export const AVATAR_STYLES = {
  micah: {
    name: 'Friendly Kids',
    style: micah,
    description: 'Diverse and welcoming characters perfect for kids',
    kidFriendly: true,
    customOptions: {
      backgroundColor: ['b6e3f4', 'c084fc', 'fb7185', 'fbbf24', '34d399', 'f472b6', '60a5fa'],
      hair: ['long01', 'long02', 'long03', 'short01', 'short02', 'short03', 'short04'],
      hairColor: ['2d3748', '744210', 'f59e0b', 'ef4444', '8b5cf6', '06b6d4', '10b981'],
      eyes: ['happy', 'wink', 'surprised'],
      eyebrows: ['down', 'up'],
      mouth: ['happy', 'openSmile', 'serious'],
      shirt: ['crew', 'open'],
      shirtColor: ['3b82f6', 'ef4444', '10b981', 'f59e0b', '8b5cf6', 'ec4899']
    }
  },
  
  avataaars: {
    name: 'Cartoon Heroes',
    style: avataaars,
    description: 'Popular cartoon-style avatars with lots of customization',
    kidFriendly: true,
    customOptions: {
      backgroundColor: ['65C9FF', 'FC909F', 'FFAF7A', 'BEAAE2', '93EDC7', 'FFD93D'],
      top: ['NoHair', 'ShortHairDreads01', 'ShortHairShortFlat', 'ShortHairShortWaved', 'LongHairStraight', 'LongHairCurly', 'LongHairBob', 'LongHairBun', 'ShortHairTheCaesar', 'ShortHairSides'],
      hairColor: ['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Red'],
      accessories: ['Blank', 'Kurt', 'Prescription01', 'Round', 'Sunglasses', 'Wayfarers'],
      facialHair: ['Blank', 'BeardLight', 'MoustacheFancy', 'MoustacheMagnum'],
      clothes: ['BlazerShirt', 'BlazerSweater', 'CollarSweater', 'Hoodie', 'Overall', 'ShirtCrewNeck'],
      clotheColor: ['Black', 'Blue01', 'Blue02', 'Gray01', 'Red', 'White'],
      skin: ['Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black'],
      eyes: ['Close', 'Default', 'Happy', 'Hearts', 'Side', 'Squint', 'Surprised', 'Wink'],
      eyebrows: ['Angry', 'Default', 'RaisedExcited', 'SadConcerned', 'UnibrowNatural'],
      mouth: ['Default', 'Eating', 'Smile', 'Tongue', 'Twinkle']
    }
  },

  bigSmile: {
    name: 'Always Happy',
    style: bigSmile,
    description: 'Cheerful faces that are always smiling',
    kidFriendly: true,
    customOptions: {
      backgroundColor: ['blue', 'green', 'red', 'orange', 'yellow', 'purple', 'pink'],
      hair: ['afro', 'bangs', 'bangs2', 'bun', 'bun2', 'fancy', 'long', 'short'],
      hairColor: ['black', 'blonde', 'brown', 'gray', 'red'],
      eyes: ['normal', 'happy', 'wink'],
      mouth: ['happy', 'openSmile', 'tongue'],
      skin: ['light', 'medium', 'dark']
    }
  },

  miniavs: {
    name: 'Minimalist',
    style: miniavs,
    description: 'Clean and simple avatar designs',
    kidFriendly: true,
    customOptions: {
      backgroundColor: ['ff5722', '2196f3', '4caf50', 'ff9800', '9c27b0', 'e91e63'],
      body: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05'],
      hair: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06'],
      hairColor: ['333333', '8b4513', 'daa520', 'ff6347', '9370db'],
      eyes: ['variant01', 'variant02', 'variant03', 'variant04'],
      mouth: ['variant01', 'variant02', 'variant03', 'variant04']
    }
  },

  personas: {
    name: 'Professional',
    style: personas,
    description: 'Stylish and professional character designs',
    kidFriendly: true,
    customOptions: {
      backgroundColor: ['ffdfbf', 'c0aede', 'a8e6cf', 'ffd93d', 'ff8b94', '88d8b0'],
      hair: ['curly', 'straight', 'wavy'],
      hairColor: ['blonde', 'brown', 'black', 'red'],
      eyes: ['normal', 'happy'],
      nose: ['variant01', 'variant02', 'variant03'],
      mouth: ['happy', 'serious'],
      beard: ['variant01', 'variant02', 'variant03']
    }
  },

  bigEars: {
    name: 'Big Ears',
    style: bigEars,
    description: 'Cute characters with distinctive big ears',
    kidFriendly: true,
    customOptions: {
      backgroundColor: ['96ceb4', 'feca57', 'ff9ff3', '54a0ff', 'ee5a24', '00d2d3'],
      hair: ['variant01', 'variant02', 'variant03', 'variant04'],
      hairColor: ['2d3436', '6c5ce7', 'a29bfe', 'fd79a8', 'fdcb6e'],
      accessories: ['variant01', 'variant02', 'variant03']
    }
  },

  adventurer: {
    name: 'Adventurer',
    style: adventurer,
    description: 'Bold characters ready for any adventure',
    kidFriendly: true,
    customOptions: {
      backgroundColor: ['92a8d1', 'b1cbbb', 'eea990', 'f4c2c2', 'd6a2e8', 'a8e6cf'],
      hair: ['short01', 'short02', 'short03', 'long01', 'long02'],
      hairColor: ['4a4a4a', '8b4513', 'daa520', 'cd853f', '9370db'],
      eyes: ['variant01', 'variant02', 'variant03'],
      mouth: ['variant01', 'variant02', 'variant03'],
      skinTone: ['light', 'medium', 'dark']
    }
  },

  pixelArt: {
    name: 'Pixel Art',
    style: pixelArt,
    description: 'Retro pixel-style game characters',
    kidFriendly: true,
    customOptions: {
      backgroundColor: ['transparent'],
      hair: ['pixie', 'short', 'long'],
      hairColor: ['black', 'blonde', 'brown', 'red', 'blue', 'green'],
      eyes: ['normal', 'wink', 'happy'],
      accessories: ['glasses', 'sunglasses']
    }
  },

  openPeeps: {
    name: 'Open Peeps',
    style: openPeeps,
    description: 'Hand-drawn style illustrations',
    kidFriendly: true,
    customOptions: {
      backgroundColor: ['b6e3f4', 'c084fc', 'fb7185', 'fbbf24', '34d399'],
      hair: ['afro', 'bangs', 'bunCurly', 'buzz', 'long', 'shortCurly'],
      hairColor: ['000000', '2c1b18', '724133', 'a55728', 'd2b48c'],
      accessories: ['glasses', 'sunglasses'],
      facial_hair: ['goatee', 'moustache', 'stubble']
    }
  },

  croodles: {
    name: 'Doodle Style',
    style: croodles,
    description: 'Fun doodle-style characters',
    kidFriendly: true,
    customOptions: {
      backgroundColor: ['f093fb', '4facfe', '00f2fe', 'f0ff00', 'fe4a49', '96ceb4'],
      hair: ['short', 'long', 'curly', 'wavy'],
      mood: ['blissful', 'happy', 'sad', 'surprised']
    }
  },

  }

// Generate avatar SVG string using local DiceBear library
export const generateAvatarSVG = (avatarConfig) => {
  console.log('Generating avatar with config:', avatarConfig);
  
  if (!avatarConfig || !avatarConfig.style || !AVATAR_STYLES[avatarConfig.style]) {
    console.warn('Invalid avatar config:', avatarConfig);
    return null;
  }

  try {
    const styleConfig = AVATAR_STYLES[avatarConfig.style];
    
    // Prepare options object for DiceBear
    const options = {
      seed: avatarConfig.seed || 'default'
    };
    
    // Convert array options to single values or comma-separated strings
    if (avatarConfig.options) {
      Object.entries(avatarConfig.options).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          if (value.length === 1) {
            options[key] = value[0];
          } else if (value.length > 1) {
            options[key] = value.join(',');
          }
        } else if (value !== null && value !== undefined) {
          options[key] = value;
        }
      });
    }
    
    console.log('DiceBear options:', options);
    
    const avatar = createAvatar(styleConfig.style, options);
    const svgString = avatar.toString();
    
    console.log('Generated SVG length:', svgString.length);
    return svgString;
    
  } catch (error) {
    console.error('Error generating avatar SVG:', error);
    return null;
  }
};

// Get available options for a specific style and category
export const getStyleOptions = (styleName, category) => {
  console.log(`Getting options for ${styleName} -> ${category}`);
  
  const style = AVATAR_STYLES[styleName];
  if (!style || !style.customOptions[category]) {
    console.warn(`No options found for ${styleName} -> ${category}`);
    return [];
  }
  
  const options = style.customOptions[category];
  console.log(`Found ${options.length} options:`, options);
  return options;
};

// Get all available styles
export const getAvailableStyles = () => {
  return Object.keys(AVATAR_STYLES).map(key => ({
    id: key,
    name: AVATAR_STYLES[key].name,
    description: AVATAR_STYLES[key].description,
    kidFriendly: AVATAR_STYLES[key].kidFriendly
  }));
};

// Create default avatar configuration for a style
export const createDefaultAvatarConfig = (styleName, userId = 'default') => {
  console.log(`Creating default config for ${styleName} with user ${userId}`);
  
  const style = AVATAR_STYLES[styleName];
  if (!style) {
    console.error(`Unknown style: ${styleName}`);
    return null;
  }

  const defaultOptions = {};
  
  // Set smart defaults for each category
  Object.entries(style.customOptions).forEach(([category, options]) => {
    if (options && options.length > 0) {
      let defaultValue;
      
      // Smart default selection based on category
      switch (category) {
        case 'hair':
        case 'top':
          defaultValue = options.find(opt => 
            opt.toLowerCase().includes('short') || 
            opt.toLowerCase().includes('medium') ||
            opt === 'short01'
          ) || options[0];
          break;
          
        case 'hairColor':
          defaultValue = options.find(opt => 
            opt.toLowerCase().includes('brown') || 
            opt === 'brown' ||
            opt === 'Brown'
          ) || options[0];
          break;
          
        case 'backgroundColor':
          defaultValue = options.find(opt => 
            opt === 'b6e3f4' || 
            opt === '65C9FF' ||
            opt === 'blue'
          ) || options[0];
          break;
          
        case 'skin':
        case 'skinTone':
          defaultValue = options.find(opt => 
            opt.toLowerCase().includes('light') || 
            opt === 'Light'
          ) || options[0];
          break;
          
        case 'shirt':
        case 'clothes':
          defaultValue = options.find(opt => 
            opt.toLowerCase().includes('crew') || 
            opt.toLowerCase().includes('shirt') ||
            opt === 'crew'
          ) || options[0];
          break;
          
        case 'shirtColor':
        case 'clotheColor':
          defaultValue = options.find(opt => 
            opt.toLowerCase().includes('blue') || 
            opt === 'Blue01'
          ) || options[0];
          break;
          
        case 'eyes':
          defaultValue = options.find(opt => 
            opt.toLowerCase().includes('default') || 
            opt.toLowerCase().includes('normal') ||
            opt.toLowerCase().includes('happy')
          ) || options[0];
          break;
          
        case 'mouth':
          defaultValue = options.find(opt => 
            opt.toLowerCase().includes('default') || 
            opt.toLowerCase().includes('happy') ||
            opt.toLowerCase().includes('smile')
          ) || options[0];
          break;
          
        case 'accessories':
        case 'facialHair':
        case 'facial_hair':
          defaultValue = options.find(opt => 
            opt.toLowerCase().includes('blank') || 
            opt.toLowerCase().includes('none')
          ) || options[0];
          break;
          
        default:
          defaultValue = options[0];
      }
      
      defaultOptions[category] = [defaultValue];
    }
  });

  const config = {
    style: styleName,
    seed: `${userId}-${styleName}-${Date.now()}`,
    options: defaultOptions
  };
  
  console.log('Created default config:', config);
  return config;
};

// Update avatar config with new option
export const updateAvatarOption = (currentConfig, category, value) => {
  console.log(`Updating ${category} to ${value}`);
  
  if (!validateAvatarConfig(currentConfig)) {
    console.error('Invalid current config for update');
    return currentConfig;
  }
  
  const updatedConfig = {
    ...currentConfig,
    options: {
      ...currentConfig.options,
      [category]: Array.isArray(value) ? value : [value]
    }
  };
  
  console.log('Updated config:', updatedConfig);
  return updatedConfig;
};

// Validate avatar configuration
export const validateAvatarConfig = (config) => {
  if (!config || !config.style || !AVATAR_STYLES[config.style]) {
    console.warn('Invalid avatar config:', config);
    return false;
  }
  return true;
};

// Legacy function compatibility for existing code
export const getItemsForLevel = (level) => {
  const baseItems = {
    hair: ['short01', 'long01', 'curly'],
    clothing: ['crew', 'hoodie', 'blazer'],
    accessories: ['glasses', 'sunglasses'],
    colors: ['blue', 'red', 'green', 'purple', 'orange']
  };

  if (level >= 5) {
    baseItems.hair.push('short02', 'long02', 'fancy');
    baseItems.clothing.push('overall', 'sweater');
    baseItems.accessories.push('kurt', 'wayfarers');
  }

  if (level >= 10) {
    baseItems.hair.push('short03', 'long03', 'dreads');
    baseItems.clothing.push('blazerSweater', 'collarSweater');
    baseItems.accessories.push('prescription01', 'round');
  }

  return baseItems;
};

export const generateThemeConfig = (theme) => {
  const themes = {
    fitness: {
      preferredStyles: ['micah', 'avataaars', 'adventurer'],
      colors: ['34d399', '3b82f6', 'f59e0b'],
      clothing: ['hoodie', 'crew', 'blazer']
    },
    fun: {
      preferredStyles: ['bigSmile', 'thumbs', 'pixelArt'],
      colors: ['fb7185', 'fbbf24', 'c084fc'],
      clothing: ['hoodie', 'overall']
    },
    creative: {
      preferredStyles: ['openPeeps', 'croodles', 'lorelei'],
      colors: ['a8e6cf', 'ffdfbf', 'c0aede'],
      clothing: ['blazer', 'sweater']
    }
  };

  return themes[theme] || themes.fitness;
};

// Debug function to test avatar generation
export const debugAvatarGeneration = (styleName) => {
  console.group(`Debug Avatar Generation: ${styleName}`);
  
  const config = createDefaultAvatarConfig(styleName, 'debug-user');
  console.log('Default config:', config);
  
  const svg = generateAvatarSVG(config);
  console.log('Generated SVG:', svg ? 'Success' : 'Failed');
  
  if (svg) {
    console.log('SVG preview (first 200 chars):', svg.substring(0, 200));
  }
  
  console.groupEnd();
  return { config, svg };
};