// 🎨 Avatar Utils - Using DiceBear API with CORRECT values!
// All values tested and verified against official DiceBear schemas! ✅

// ✨ Available Avatar Styles with REAL API values
export const AVATAR_STYLES = {
  micah: {
    name: 'Friendly Kids',
    description: 'Diverse and welcoming characters perfect for kids',
    kidFriendly: true,
    apiStyle: 'micah',
    availableOptions: {
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
      base: ['standard'],
      baseColor: ['f9c9b6', 'ac6651', '77311d'],
      earringColor: ['f9c9b6', 'd2eff3', '000000', 'e0ddff', 'f4d150', 'ac6651', '9287ff', 'ffeba4', 'fc909f', 'ffedef', '6bd9e9', '77311d', 'ffffff'],
      earrings: ['hoop', 'stud'],
      ears: ['attached', 'detached'],
      eyeShadowColor: ['d2eff3', 'e0ddff', 'ffeba4', 'ffedef', 'ffffff'],
      eyebrows: ['up', 'down', 'eyelashesUp', 'eyelashesDown'],
      eyebrowsColor: ['000000'],
      eyes: ['eyes', 'round', 'eyesShadow', 'smiling', 'smilingShadow'],
      eyesColor: ['000000'],
      facialHair: ['beard', 'scruff'],
      facialHairColor: ['000000'],
      glasses: ['round', 'square'],
      glassesColor: ['f9c9b6', 'd2eff3', '000000', 'e0ddff', 'f4d150', 'ac6651', '9287ff', 'ffeba4', 'fc909f', 'ffedef', '6bd9e9', '77311d', 'ffffff'],
      hair: ['fonze', 'mrT', 'dougFunny', 'mrClean', 'dannyPhantom', 'full', 'turban', 'pixie'],
      hairColor: ['f9c9b6', 'd2eff3', '000000', 'e0ddff', 'f4d150', 'ac6651', '9287ff', 'ffeba4', 'fc909f', 'ffedef', '6bd9e9', '77311d', 'ffffff'],
      mouth: ['surprised', 'laughing', 'nervous', 'smile', 'sad', 'pucker', 'frown', 'smirk'],
      mouthColor: ['000000'],
      nose: ['curve', 'pointed', 'round'],
      shirt: ['open', 'crew', 'collared'],
      shirtColor: ['f9c9b6', 'd2eff3', '000000', 'e0ddff', 'f4d150', 'ac6651', '9287ff', 'ffeba4', 'fc909f', 'ffedef', '6bd9e9', '77311d', 'ffffff']
    }
  },

  avataaars: {
    name: 'Cartoon Heroes',
    description: 'Popular cartoon-style avatars',
    kidFriendly: true,
    apiStyle: 'avataaars',
    availableOptions: {
      backgroundColor: ['65c9ff', '5199e4', '25557c', 'e0ddff', 'd09cfa', 'a44ba0', 'fc909f', 'f4d150'],
      accessories: ['kurt', 'prescription01', 'prescription02', 'round', 'sunglasses', 'wayfarers', 'eyepatch'],
      accessoriesColor: ['262e33', '65c9ff', '5199e4', '25557c', 'e6e6e6', '929598', '3c4f5c', 'b1e2ff', 'a7ffc4', 'ffdeb5', 'ffafb9', 'ffffb1', 'ff488e', 'ff5c5c', 'ffffff'],
      base: ['default'],
      clothesColor: ['262e33', '65c9ff', '5199e4', '25557c', 'e6e6e6', '929598', '3c4f5c', 'b1e2ff', 'a7ffc4', 'ffafb9', 'ffffb1', 'ff488e', 'ff5c5c', 'ffffff'],
      clothing: ['blazerAndShirt', 'blazerAndSweater', 'collarAndSweater', 'graphicShirt', 'hoodie', 'overall', 'shirtCrewNeck', 'shirtScoopNeck', 'shirtVNeck'],
      clothingGraphic: ['bat', 'bear', 'cumbia', 'deer', 'diamond', 'hola', 'pizza', 'resist', 'skull', 'skullOutline'],
      eyebrows: ['angryNatural', 'defaultNatural', 'flatNatural', 'frownNatural', 'raisedExcitedNatural', 'sadConcernedNatural', 'unibrowNatural', 'upDownNatural', 'angry', 'default', 'raisedExcited', 'sadConcerned', 'upDown'],
      eyes: ['closed', 'cry', 'default', 'eyeRoll', 'happy', 'hearts', 'side', 'squint', 'surprised', 'winkWacky', 'wink', 'xDizzy'],
      facialHair: ['beardLight', 'beardMajestic', 'beardMedium', 'moustacheFancy', 'moustacheMagnum'],
      facialHairColor: ['a55728', '2c1b18', 'b58143', 'd6b370', '724133', '4a312c', 'f59797', 'ecdcbf', 'c93305', 'e8e1e1'],
      hairColor: ['a55728', '2c1b18', 'b58143', 'd6b370', '724133', '4a312c', 'f59797', 'ecdcbf', 'c93305', 'e8e1e1'],
      hatColor: ['262e33', '65c9ff', '5199e4', '25557c', 'e6e6e6', '929598', '3c4f5c', 'b1e2ff', 'a7ffc4', 'ffdeb5', 'ffafb9', 'ffffb1', 'ff488e', 'ff5c5c', 'ffffff'],
      mouth: ['concerned', 'default', 'disbelief', 'eating', 'grimace', 'sad', 'screamOpen', 'serious', 'smile', 'tongue', 'twinkle', 'vomit'],
      nose: ['default'],
      skinColor: ['614335', 'd08b5b', 'ae5d29', 'edb98a', 'ffdbb4', 'fd9841', 'f8d25c'],
      style: ['circle', 'default'],
      top: ['hat', 'hijab', 'turban', 'winterHat1', 'winterHat02', 'winterHat03', 'winterHat04', 'bob', 'bun', 'curly', 'curvy', 'dreads', 'frida', 'fro', 'froBand', 'longButNotTooLong', 'miaWallace', 'shavedSides', 'straight02', 'straight01', 'straightAndStrand', 'dreads01', 'dreads02', 'frizzle', 'shaggy', 'shaggyMullet', 'shortCurly', 'shortFlat', 'shortRound', 'shortWaved', 'sides', 'theCaesar', 'theCaesarAndSidePart', 'bigHair']
    }
  },

  bigSmile: {
    name: 'Always Happy',
    description: 'Cheerful faces that are always smiling',
    kidFriendly: true,
    apiStyle: 'big-smile',
    availableOptions: {
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
      accessories: ['catEars', 'glasses', 'sailormoonCrown', 'clownNose', 'sleepMask', 'sunglasses', 'faceMask', 'mustache'],
      eyes: ['cheery', 'normal', 'confused', 'starstruck', 'winking', 'sleepy', 'sad', 'angry'],
      face: ['base'],
      hair: ['shortHair', 'mohawk', 'wavyBob', 'bowlCutHair', 'curlyBob', 'straightHair', 'braids', 'shavedHead', 'bunHair', 'froBun', 'bangs', 'halfShavedHead', 'curlyShortHair'],
      hairColor: ['220f00', '3a1a00', '71472d', 'e2ba87', '605de4', '238d80', 'd56c0c', 'e9b729'],
      mouth: ['openedSmile', 'unimpressed', 'gapSmile', 'openSad', 'teethSmile', 'awkwardSmile', 'braces', 'kawaii'],
      skinColor: ['ffe4c0', 'f5d7b1', 'efcc9f', 'e2ba87', 'c99c62', 'a47539', '8c5a2b', '643d19']
    }
  },

  lorelei: {
    name: 'Lorelei',
    description: 'Elegant character illustrations',
    kidFriendly: true,
    apiStyle: 'lorelei',
    availableOptions: {
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
      beard: ['variant01', 'variant02'],
      earrings: ['variant01', 'variant02', 'variant03'],
      earringsColor: ['000000'],
      eyebrows: ['variant13', 'variant12', 'variant11', 'variant10', 'variant09', 'variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01'],
      eyebrowsColor: ['000000'],
      eyes: ['variant24', 'variant23', 'variant22', 'variant21', 'variant20', 'variant19', 'variant18', 'variant17', 'variant16', 'variant15', 'variant14', 'variant13', 'variant12', 'variant11', 'variant10', 'variant09', 'variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01'],
      eyesColor: ['000000'],
      freckles: ['variant01'],
      frecklesColor: ['000000'],
      glasses: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05'],
      glassesColor: ['000000'],
      hair: ['variant48', 'variant47', 'variant46', 'variant45', 'variant44', 'variant43', 'variant42', 'variant41', 'variant40', 'variant39', 'variant38', 'variant37', 'variant36', 'variant35', 'variant34', 'variant33', 'variant32', 'variant31', 'variant30', 'variant29', 'variant28', 'variant27', 'variant26', 'variant25', 'variant24', 'variant23', 'variant22', 'variant21', 'variant20', 'variant19', 'variant18', 'variant17', 'variant16', 'variant15', 'variant14', 'variant13', 'variant12', 'variant11', 'variant10', 'variant09', 'variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01'],
      hairAccessories: ['flowers'],
      hairAccessoriesColor: ['000000'],
      hairColor: ['000000'],
      head: ['variant04', 'variant03', 'variant02', 'variant01'],
      mouth: ['happy01', 'happy02', 'happy03', 'happy04', 'happy05', 'happy06', 'happy07', 'happy08', 'happy18', 'happy09', 'happy10', 'happy11', 'happy12', 'happy13', 'happy14', 'happy17', 'happy15', 'happy16', 'sad01', 'sad02', 'sad03', 'sad04', 'sad05', 'sad06', 'sad07', 'sad08', 'sad09'],
      mouthColor: ['000000'],
      nose: ['variant01', 'variant02', 'variant03', 'variant04', 'variant05', 'variant06'],
      noseColor: ['000000'],
      skinColor: ['ffffff']
    }
  },

  notionists: {
    name: 'Notionists',
    description: 'Notion-style avatars',
    kidFriendly: true,
    apiStyle: 'notionists',
    availableOptions: {
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
      base: ['variant01'],
      beard: ['variant12', 'variant11', 'variant10', 'variant09', 'variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01'],
      body: ['variant25', 'variant24', 'variant23', 'variant22', 'variant21', 'variant20', 'variant19', 'variant18', 'variant17', 'variant16', 'variant15', 'variant14', 'variant13', 'variant12', 'variant11', 'variant10', 'variant09', 'variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01'],
      bodyIcon: ['electric', 'saturn', 'galaxy'],
      brows: ['variant13', 'variant12', 'variant11', 'variant10', 'variant09', 'variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01'],
      eyes: ['variant05', 'variant04', 'variant03', 'variant02', 'variant01'],
      gesture: ['wavePointLongArms', 'waveOkLongArms', 'waveLongArms', 'waveLongArm', 'pointLongArm', 'okLongArm', 'point', 'ok', 'hand', 'handPhone'],
      glasses: ['variant11', 'variant10', 'variant09', 'variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01'],
      hair: ['variant63', 'variant62', 'variant61', 'variant60', 'variant59', 'variant58', 'variant57', 'variant56', 'variant55', 'variant54', 'variant53', 'variant52', 'variant51', 'variant50', 'variant49', 'variant48', 'variant47', 'variant46', 'variant45', 'variant44', 'variant43', 'variant42', 'variant41', 'variant40', 'variant39', 'variant38', 'variant37', 'variant36', 'variant35', 'variant34', 'variant33', 'variant32', 'variant31', 'variant30', 'variant29', 'variant28', 'variant27', 'variant26', 'variant25', 'variant24', 'variant23', 'variant22', 'variant21', 'variant20', 'variant19', 'variant18', 'variant17', 'variant16', 'variant15', 'variant14', 'variant13', 'variant12', 'variant11', 'variant10', 'variant09', 'variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01', 'hat'],
      lips: ['variant30', 'variant29', 'variant28', 'variant27', 'variant26', 'variant25', 'variant24', 'variant23', 'variant22', 'variant21', 'variant20', 'variant19', 'variant18', 'variant17', 'variant16', 'variant15', 'variant14', 'variant13', 'variant12', 'variant11', 'variant10', 'variant09', 'variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01'],
      nose: ['variant20', 'variant19', 'variant18', 'variant17', 'variant16', 'variant15', 'variant14', 'variant13', 'variant12', 'variant11', 'variant10', 'variant09', 'variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01']
    }
  },

  openPeeps: {
    name: 'Open Peeps',
    description: 'Hand-drawn style illustrations',
    kidFriendly: true,
    apiStyle: 'open-peeps',
    availableOptions: {
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
      accessories: ['eyepatch', 'glasses', 'glasses2', 'glasses3', 'glasses4', 'glasses5', 'sunglasses', 'sunglasses2'],
      clothingColor: ['e78276', 'ffcf77', 'fdea6b', '78e185', '9ddadb', '8fa7df', 'e279c7'],
      face: ['angryWithFang', 'awe', 'blank', 'calm', 'cheeky', 'concerned', 'concernedFear', 'contempt', 'cute', 'cyclops', 'driven', 'eatingHappy', 'explaining', 'eyesClosed', 'fear', 'hectic', 'lovingGrin1', 'lovingGrin2', 'monster', 'old', 'rage', 'serious', 'smile', 'smileBig', 'smileLOL', 'smileTeethGap', 'solemn', 'suspicious', 'tired', 'veryAngry'],
      facialHair: ['chin', 'full', 'full2', 'full3', 'full4', 'goatee1', 'goatee2', 'moustache1', 'moustache2', 'moustache3', 'moustache4', 'moustache5', 'moustache6', 'moustache7', 'moustache8', 'moustache9'],
      head: ['afro', 'bangs', 'bangs2', 'bantuKnots', 'bear', 'bun', 'bun2', 'buns', 'cornrows', 'cornrows2', 'dreads1', 'dreads2', 'flatTop', 'flatTopLong', 'grayBun', 'grayMedium', 'grayShort', 'hatBeanie', 'hatHip', 'hijab', 'long', 'longAfro', 'longBangs', 'longCurly', 'medium1', 'medium2', 'medium3', 'mediumBangs', 'mediumBangs2', 'mediumBangs3', 'mediumStraight', 'mohawk', 'mohawk2', 'noHair1', 'noHair2', 'noHair3', 'pomp', 'shaved1', 'shaved2', 'shaved3', 'short1', 'short2', 'short3', 'short4', 'short5', 'turban', 'twists', 'twists2'],
      headContrastColor: ['2c1b18', 'e8e1e1', 'ecdcbf', 'd6b370', 'f59797', 'b58143', 'a55728', '724133', '4a312c', 'c93305'],
      skinColor: ['ffdbb4', 'edb98a', 'd08b5b', 'ae5d29', '694d3d']
    }
  },

  pixelArt: {
    name: 'Pixel Art',
    description: 'Retro pixel-style game characters',
    kidFriendly: true,
    apiStyle: 'pixel-art',
    availableOptions: {
      backgroundColor: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
      accessories: ['variant04', 'variant03', 'variant02', 'variant01'],
      accessoriesColor: ['daa520', 'ffd700', 'fafad2', 'd3d3d3', 'a9a9a9'],
      beard: ['variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01'],
      clothing: ['variant23', 'variant22', 'variant21', 'variant20', 'variant19', 'variant18', 'variant17', 'variant16', 'variant15', 'variant14', 'variant13', 'variant12', 'variant11', 'variant10', 'variant09', 'variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01'],
      clothingColor: ['5bc0de', '428bca', '03396c', '88d8b0', '44c585', '00b159', 'ff6f69', 'd11141', 'ae0001', 'ffeead', 'ffd969', 'ffc425'],
      eyes: ['variant12', 'variant11', 'variant10', 'variant09', 'variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01'],
      eyesColor: ['76778b', '697b94', '647b90', '5b7c8b', '588387', '876658'],
      glasses: ['light07', 'light06', 'light05', 'light04', 'light03', 'light02', 'light01', 'dark07', 'dark06', 'dark05', 'dark04', 'dark03', 'dark02', 'dark01'],
      glassesColor: ['4b4b4b', '323232', '191919', '43677d', '5f705c', 'a04b5d'],
      hair: ['short24', 'short23', 'short22', 'short21', 'short20', 'short19', 'short18', 'short17', 'short16', 'short15', 'short14', 'short13', 'short12', 'short11', 'short10', 'short09', 'short08', 'short07', 'short06', 'short05', 'short04', 'short03', 'short02', 'short01', 'long21', 'long20', 'long19', 'long18', 'long17', 'long16', 'long15', 'long14', 'long13', 'long12', 'long11', 'long10', 'long09', 'long08', 'long07', 'long06', 'long05', 'long04', 'long03', 'long02', 'long01'],
      hairColor: ['cab188', '603a14', '83623b', 'a78961', '611c17', '603015', '612616', '28150a', '009bbd', 'bd1700', '91cb15'],
      hat: ['variant10', 'variant09', 'variant08', 'variant07', 'variant06', 'variant05', 'variant04', 'variant03', 'variant02', 'variant01'],
      hatColor: ['2e1e05', '2663a3', '989789', '3d8a6b', 'cc6192', '614f8a', 'a62116'],
      mouth: ['sad10', 'sad09', 'sad08', 'sad07', 'sad06', 'sad05', 'sad04', 'sad03', 'sad02', 'sad01', 'happy13', 'happy12', 'happy11', 'happy10', 'happy09', 'happy08', 'happy07', 'happy06', 'happy05', 'happy04', 'happy03', 'happy02', 'happy01'],
      mouthColor: ['d29985', 'c98276', 'e35d6a', 'de0f0d'],
      skinColor: ['ffdbac', 'f5cfa0', 'eac393', 'e0b687', 'cb9e6e', 'b68655', 'a26d3d', '8d5524']
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