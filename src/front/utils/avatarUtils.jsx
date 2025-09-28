import { createAvatar } from '@dicebear/core';
import { 
  micah,
  avataaars,
  bigSmile,
  miniavs,
  personas,
  thumbs,
  bigEars,
  adventurer,
  pixelArt,
  openPeeps,
  croodles,
  lorelei
} from '@dicebear/collection';

// DiceBear avatar styles configuration
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
    description: 'Popular cartoon-style avatars',
    kidFriendly: true,
    customOptions: {
      backgroundColor: ['65C9FF', 'FC909F', 'FFAF7A', 'BEAAE2', '93EDC7', 'FFD93D'],
      top: ['NoHair', 'ShortHairDreads01', 'ShortHairShortFlat', 'ShortHairShortWaved', 'LongHairStraight', 'LongHairCurly'],
      hairColor: ['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Red'],
      accessories: ['Blank', 'Kurt', 'Prescription01', 'Round', 'Sunglasses', 'Wayfarers'],
      facialHair: ['Blank', 'BeardLight', 'MoustacheFancy', 'MoustacheMagnum'],
      clothes: ['BlazerShirt', 'BlazerSweater', 'CollarSweater', 'Hoodie', 'Overall', 'ShirtCrewNeck'],
      clotheColor: ['Black', 'Blue01', 'Blue02', 'Gray01', 'Red', 'White'],
      skin: ['Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black']
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

  thumbs: {
    name: 'Thumbs Up',
    style: thumbs,
    description: 'Positive and encouraging thumb characters',
    kidFriendly: true,
    customOptions: {
      backgroundColor: ['0066ff', '7b68ee', 'ff6b35', '37d67a', 'f94144', 'f8961e'],
      shading: ['variant01', 'variant02', 'variant03'],
      eyes: ['variant01', 'variant02', 'variant03', 'variant04'],
      mouth: ['variant01', 'variant02', 'variant03', 'variant04']
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

  lorelei: {
    name: 'Artistic',
    style: lorelei,
    description: 'Artistic and stylized character portraits',
    kidFriendly: true,
    customOptions: {
      backgroundColor: ['ffdfbf', 'c0aede', 'a8e6cf', 'ffd93d', 'ff8b94'],
      hair: ['variant01', 'variant02', 'variant03', 'variant04'],
      eyes: ['variant01', 'variant02', 'variant03'],
      accessories: ['variant01', 'variant02']
    }
  }
};

// Generate avatar SVG string
export const generateAvatarSVG = (avatarConfig) => {
  if (!avatarConfig.style || !AVATAR_STYLES[avatarConfig.style]) {
    return null;
  }

  const styleConfig = AVATAR_STYLES[avatarConfig.style];
  const avatar = createAvatar(styleConfig.style, {
    seed: avatarConfig.seed || 'default',
    ...avatarConfig.options
  });

  return avatar.toString();
};

// Get available options for a specific style and category
export const getStyleOptions = (styleName, category) => {
  const style = AVATAR_STYLES[styleName];
  if (!style || !style.customOptions[category]) {
    return [];
  }
  return style.customOptions[category];
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
  const style = AVATAR_STYLES[styleName];
  if (!style) {
    return null;
  }

  const defaultOptions = {};
  
  // Set first option as default for each category
  Object.keys(style.customOptions).forEach(category => {
    const options = style.customOptions[category];
    if (options && options.length > 0) {
      defaultOptions[category] = [options[0]];
    }
  });

  return {
    style: styleName,
    seed: `${userId}-${styleName}`,
    options: defaultOptions
  };
};

// Validate avatar configuration
export const validateAvatarConfig = (config) => {
  if (!config.style || !AVATAR_STYLES[config.style]) {
    return false;
  }

  const style = AVATAR_STYLES[config.style];
  
  // Check if all options are valid for the style
  if (config.options) {
    for (const [category, value] of Object.entries(config.options)) {
      if (style.customOptions[category]) {
        const validOptions = style.customOptions[category];
        const selectedValue = Array.isArray(value) ? value[0] : value;
        if (!validOptions.includes(selectedValue)) {
          return false;
        }
      }
    }
  }

  return true;
};

// Legacy function compatibility
export const getItemsForLevel = (level) => {
  // For backwards compatibility with existing inventory system
  const baseItems = {
    hair: ['short01', 'long01', 'curly'],
    clothing: ['crew', 'hoodie', 'blazer'],
    accessories: ['glasses', 'sunglasses'],
    colors: ['blue', 'red', 'green', 'purple', 'orange']
  };

  // Unlock more items as level increases
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
  // Generate theme-based avatar configurations
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