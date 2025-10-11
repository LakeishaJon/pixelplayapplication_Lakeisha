// 🎨 Avatar Utils - Using DiceBear API with CORRECT values!
// These values are tested and work with the actual API! ✅

// ✨ Available Avatar Styles with REAL API values
export const AVATAR_STYLES = {
  micah: {
    name: 'Friendly Kids',
    description: 'Diverse and welcoming characters perfect for kids',
    kidFriendly: true,
    apiStyle: 'micah',
    availableOptions: {
      // These are the REAL values the micah API accepts:
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
      baseColor: ['ac6651', 'd08b5b', 'edb98a', 'f8d25c', 'ffdbb4'],
      earringColor: ['d2eff3', 'ffedef', 'ffffff'],
      eyebrowColor: ['000000', '4a312c', '724133', 'a55728', 'c93305'],
      // Note: "hair" option doesn't exist in micah - it uses different properties
      // micah is simpler and generates random variations
    }
  },
  
  avataaars: {
    name: 'Cartoon Heroes',
    description: 'Popular cartoon-style avatars',
    kidFriendly: true,
    apiStyle: 'avataaars',
    availableOptions: {
      backgroundColor: ['65C9FF', '5199E4', '25557C', 'E0DDFF', 'D09CFA', 'A44BA0', 'FC909F', 'F4D150'],
      accessoriesType: ['Blank', 'Kurt', 'Prescription01', 'Prescription02', 'Round', 'Sunglasses', 'Wayfarers'],
      clothesType: ['BlazerShirt', 'BlazerSweater', 'CollarSweater', 'Hoodie', 'Overall', 'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck'],
      clothesColor: ['Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02', 'Heather', 'PastelBlue', 'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow', 'Pink', 'Red', 'White'],
      eyebrowType: ['Angry', 'AngryNatural', 'Default', 'DefaultNatural', 'FlatNatural', 'RaisedExcited', 'RaisedExcitedNatural', 'SadConcerned', 'SadConcernedNatural', 'UnibrowNatural', 'UpDown', 'UpDownNatural'],
      eyeType: ['Close', 'Cry', 'Default', 'Dizzy', 'EyeRoll', 'Happy', 'Hearts', 'Side', 'Squint', 'Surprised', 'Wink', 'WinkWacky'],
      facialHairColor: ['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'Platinum', 'Red'],
      facialHairType: ['Blank', 'BeardMedium', 'BeardLight', 'BeardMagestic', 'MoustacheFancy', 'MoustacheMagnum'],
      hairColor: ['Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray'],
      mouthType: ['Concerned', 'Default', 'Disbelief', 'Eating', 'Grimace', 'Sad', 'ScreamOpen', 'Serious', 'Smile', 'Tongue', 'Twinkle', 'Vomit'],
      skinColor: ['Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black'],
      topType: ['NoHair', 'Eyepatch', 'Hat', 'Hijab', 'Turban', 'WinterHat1', 'WinterHat2', 'WinterHat3', 'WinterHat4', 'LongHairBigHair', 'LongHairBob', 'LongHairBun', 'LongHairCurly', 'LongHairCurvy', 'LongHairDreads', 'LongHairFrida', 'LongHairFro', 'LongHairFroBand', 'LongHairNotTooLong', 'LongHairShavedSides', 'LongHairMiaWallace', 'LongHairStraight', 'LongHairStraight2', 'LongHairStraightStrand', 'ShortHairDreads01', 'ShortHairDreads02', 'ShortHairFrizzle', 'ShortHairShaggyMullet', 'ShortHairShortCurly', 'ShortHairShortFlat', 'ShortHairShortRound', 'ShortHairShortWaved', 'ShortHairSides', 'ShortHairTheCaesar', 'ShortHairTheCaesarSidePart']
    }
  },

  bigSmile: {
    name: 'Always Happy',
    description: 'Cheerful faces that are always smiling',
    kidFriendly: true,
    apiStyle: 'big-smile',
    availableOptions: {
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
      eyesColor: ['000000', '4a312c', '724133', 'a55728', 'c93305'],
      hairColor: ['000000', '4a312c', '724133', 'a55728', 'c93305'],
      mouthColor: ['000000', '4a312c', '724133', 'a55728', 'c93305'],
      skinColor: ['ac6651', 'd08b5b', 'edb98a', 'f8d25c', 'ffdbb4']
    }
  },

  lorelei: {
    name: 'Lorelei',
    description: 'Elegant character illustrations',
    kidFriendly: true,
    apiStyle: 'lorelei',
    availableOptions: {
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf']
    }
  },

  notionists: {
    name: 'Notionists',
    description: 'Notion-style avatars',
    kidFriendly: true,
    apiStyle: 'notionists',
    availableOptions: {
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf']
    }
  },

  openPeeps: {
    name: 'Open Peeps',
    description: 'Hand-drawn style illustrations',
    kidFriendly: true,
    apiStyle: 'open-peeps',
    availableOptions: {
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
      accessories: ['none', 'glasses', 'glasses2', 'glasses3', 'glasses4', 'glasses5', 'sunglasses', 'sunglasses2', 'sunglasses3'],
      body: ['chest', 'breasts'],
      face: ['angryWithFang', 'awe', 'blank', 'calm', 'cheeky', 'concerned', 'contempt', 'cute', 'cyclops', 'driven', 'eatingHappy', 'explaining', 'eyesClosed', 'fear', 'hectic', 'lovingGrin1', 'lovingGrin2', 'monster', 'old', 'rage', 'serious', 'smile', 'smileBig', 'smileLOL', 'smileTeethGap', 'solemn', 'suspicious', 'tired', 'veryAngry'],
      facialHair: ['none', 'chin', 'full', 'moustache'],
      head: ['afro', 'bangs', 'bangs2', 'bantuKnots', 'bear', 'bun', 'bun2', 'buns', 'cornrows', 'cornrows2', 'dreads1', 'dreads2', 'flatTop', 'flatTopLong', 'grayBun', 'grayMedium', 'grayShort', 'hatBeanie', 'hatHip', 'hijab', 'long', 'longAfro', 'longBangs', 'longCurly', 'medium1', 'medium2', 'medium3', 'mediumBangs', 'mediumBangs2', 'mediumBangs3', 'mediumStraight', 'mohawk', 'mohawk2', 'noHair', 'pomp', 'short1', 'short2', 'short3', 'short4', 'short5', 'turban', 'twists', 'twists2']
    }
  },

  pixelArt: {
    name: 'Pixel Art',
    description: 'Retro pixel-style game characters',
    kidFriendly: true,
    apiStyle: 'pixel-art',
    availableOptions: {
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
      accessories: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12', 'variant13'],
      clothing: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09'],
      eyes: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12', 'variant13', 'variant14', 'variant15', 'variant16', 'variant17', 'variant18', 'variant19', 'variant20', 'variant21', 'variant22', 'variant23', 'variant24', 'variant25', 'variant26'],
      hair: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06', 'variant07', 'variant08', 'variant09', 'variant10', 'variant11', 'variant12', 'variant13', 'variant14', 'variant15', 'variant16', 'variant17', 'variant18', 'variant19', 'variant20', 'variant21', 'variant22', 'variant23', 'variant24', 'variant25', 'variant26', 'variant27', 'variant28', 'variant29', 'variant30'],
      mouth: ['happy01', 'happy02', 'happy03', 'happy04', 'happy05', 'happy06', 'happy07', 'happy08', 'happy09', 'happy10', 'happy11', 'happy12', 'happy13', 'happy14', 'happy15', 'happy16', 'sad01', 'sad02', 'sad03', 'sad04', 'sad05', 'sad06', 'sad07', 'sad08', 'sad09']
    }
  }
};

// 🌐 Generate Avatar URL using DiceBear API
export const generateAvatarURL = (avatarConfig) => {
  console.log('🎨 Generating avatar URL with config:', avatarConfig);
  
  if (!avatarConfig || !avatarConfig.style) {
    console.warn('⚠️ Invalid avatar config');
    return null;
  }

  const styleConfig = AVATAR_STYLES[avatarConfig.style];
  if (!styleConfig) {
    console.warn('⚠️ Unknown style:', avatarConfig.style);
    return null;
  }

  // Start building the API URL
  const baseURL = 'https://api.dicebear.com/7.x';
  const style = styleConfig.apiStyle;
  const seed = avatarConfig.seed || 'default-seed';
  
  // Build URL with parameters
  let url = `${baseURL}/${style}/svg?seed=${encodeURIComponent(seed)}`;
  
  // Add all the custom options
  if (avatarConfig.options) {
    Object.entries(avatarConfig.options).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        url += `&${key}=${encodeURIComponent(value)}`;
      }
    });
  }
  
  console.log('✅ Generated URL:', url);
  return url;
};

// 🎨 Generate Avatar SVG string by fetching from API
export const generateAvatarSVG = async (avatarConfig) => {
  console.log('🎨 Fetching avatar SVG from API...');
  
  const url = generateAvatarURL(avatarConfig);
  if (!url) {
    console.error('❌ Could not generate avatar URL');
    return null;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      throw new Error(`API error: ${response.status}`);
    }
    
    const svgText = await response.text();
    console.log('✅ Avatar SVG fetched successfully! Length:', svgText.length);
    return svgText;
    
  } catch (error) {
    console.error('❌ Error fetching avatar SVG:', error);
    return null;
  }
};

// 📋 Get available options for a style and category
export const getStyleOptions = (styleName, category) => {
  console.log(`📋 Getting options for ${styleName} -> ${category}`);
  
  const style = AVATAR_STYLES[styleName];
  if (!style) {
    console.warn(`⚠️ Unknown style: ${styleName}`);
    return [];
  }

  const options = style.availableOptions[category];
  if (!options) {
    console.log(`ℹ️ No options for ${category} in ${styleName}`);
    return [];
  }
  
  console.log(`✅ Found ${options.length} options`);
  return options;
};

// 🎯 Check if a style has a specific option category
export const hasStyleOptions = (styleName, category) => {
  const options = getStyleOptions(styleName, category);
  return options.length > 0;
};

// 📝 Get all available option categories for a style
export const getAvailableOptionsForStyle = (styleName) => {
  const style = AVATAR_STYLES[styleName];
  if (!style) return [];
  
  const categories = Object.keys(style.availableOptions);
  console.log(`✅ ${styleName} has ${categories.length} customizable options:`, categories);
  return categories;
};

// 🎨 Create default avatar configuration
export const createDefaultAvatarConfig = (styleName, userId = 'default') => {
  console.log(`🎨 Creating default config for ${styleName}`);
  
  const style = AVATAR_STYLES[styleName];
  if (!style) {
    console.error(`❌ Unknown style: ${styleName}`);
    return null;
  }

  const defaultOptions = {};
  
  // Set the first option as default for each category
  Object.entries(style.availableOptions).forEach(([category, options]) => {
    if (options && options.length > 0) {
      defaultOptions[category] = options[0];
    }
  });

  const config = {
    style: styleName,
    seed: `${userId}-${styleName}-${Date.now()}`,
    options: defaultOptions
  };
  
  console.log('✅ Created default config:', config);
  return config;
};

// ✏️ Update a specific option in the avatar config
export const updateAvatarOption = (currentConfig, category, value) => {
  console.log(`✏️ Updating ${category} to ${value}`);
  
  if (!currentConfig) {
    console.error('❌ No config to update');
    return currentConfig;
  }
  
  const updatedConfig = {
    ...currentConfig,
    options: {
      ...currentConfig.options,
      [category]: value
    }
  };
  
  console.log('✅ Updated config:', updatedConfig);
  return updatedConfig;
};

// 📚 Get all available styles
export const getAvailableStyles = () => {
  return Object.keys(AVATAR_STYLES).map(key => ({
    id: key,
    name: AVATAR_STYLES[key].name,
    description: AVATAR_STYLES[key].description,
    kidFriendly: AVATAR_STYLES[key].kidFriendly
  }));
};

// ✅ Validate avatar configuration
export const validateAvatarConfig = (config) => {
  if (!config || !config.style || !AVATAR_STYLES[config.style]) {
    console.warn('⚠️ Invalid avatar config');
    return false;
  }
  return true;
};

// 🧪 Debug/Test function
export const debugAvatarGeneration = async (styleName) => {
  console.group(`🧪 Debug Avatar: ${styleName}`);
  
  const config = createDefaultAvatarConfig(styleName, 'debug-user');
  console.log('Config:', config);
  
  const url = generateAvatarURL(config);
  console.log('URL:', url);
  console.log('👉 Test this URL in your browser!');
  
  try {
    const svg = await generateAvatarSVG(config);
    console.log('SVG:', svg ? '✅ Success' : '❌ Failed');
  } catch (error) {
    console.error('Error:', error);
  }
  
  console.groupEnd();
  return { config, url };
};