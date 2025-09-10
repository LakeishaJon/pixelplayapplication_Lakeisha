// DiceBearConfig.js - All the Avatar Creation Settings!
// This file contains all the options for making awesome avatars

import { adventurer, personas, lorelei, miniavs } from "@dicebear/collection";

class DiceBearConfig {
  // 🎮 Available Avatar Styles (like different art styles in games)
  static AVATAR_STYLES = {
    adventurer: {
      name: "adventurer",
      label: "🏰 Adventure Hero",
      description: "Brave heroes ready for any quest!",
      colors: ["#ff6b6b", "#4ecdc4", "#45b7d1"],
      collection: adventurer,
      recommended: true, // Great for fitness apps!
      ageGroup: "kids", // Perfect for children
    },
    personas: {
      name: "personas",
      label: "😊 Happy Face",
      description: "Cheerful and friendly characters!",
      colors: ["#96ceb4", "#ffeaa7", "#dda0dd"],
      collection: personas,
      recommended: true,
      ageGroup: "kids",
    },
    lorelei: {
      name: "lorelei",
      label: "👑 Royal Style",
      description: "Elegant and magical characters!",
      colors: ["#ff7675", "#74b9ff", "#a29bfe"],
      collection: lorelei,
      recommended: false, // More complex, maybe for older kids
      ageGroup: "teens",
    },
    miniavs: {
      name: "miniavs",
      label: "🎮 Game Character",
      description: "Pixel-perfect gaming avatars!",
      colors: ["#00b894", "#fdcb6e", "#e17055"],
      collection: miniavs,
      recommended: true,
      ageGroup: "kids",
    },
  };

  // 🌈 Color Palettes (organized by what they're for)
  static COLOR_PALETTES = {
    // Hair colors - from natural to fun fantasy colors
    hair: {
      natural: [
        { color: "#8B4513", name: "Brown", emoji: "🤎" },
        { color: "#FFD700", name: "Blonde", emoji: "💛" },
        { color: "#000000", name: "Black", emoji: "🖤" },
        { color: "#A0522D", name: "Auburn", emoji: "🧡" },
        { color: "#DC143C", name: "Red", emoji: "❤️" },
      ],
      fantasy: [
        { color: "#FF6347", name: "Fire Orange", emoji: "🔥" },
        { color: "#9370DB", name: "Magic Purple", emoji: "💜" },
        { color: "#00CED1", name: "Ocean Blue", emoji: "💙" },
        { color: "#32CD32", name: "Nature Green", emoji: "💚" },
        { color: "#FF1493", name: "Power Pink", emoji: "💗" },
      ],
    },

    // Skin tones - inclusive and diverse
    skin: [
      { color: "#f2d3b1", name: "Light", emoji: "🤍" },
      { color: "#ddb98a", name: "Medium Light", emoji: "🤎" },
      { color: "#c68642", name: "Medium", emoji: "🤎" },
      { color: "#8d5524", name: "Medium Dark", emoji: "🤎" },
      { color: "#654321", name: "Dark", emoji: "🤎" },
      { color: "#f9dcc4", name: "Warm Light", emoji: "🤍" },
    ],

    // Clothing colors - bright and fun for kids
    clothing: [
      { color: "#ff6b6b", name: "Fire Red", emoji: "❤️" },
      { color: "#4ecdc4", name: "Cool Mint", emoji: "💚" },
      { color: "#45b7d1", name: "Sky Blue", emoji: "💙" },
      { color: "#96ceb4", name: "Fresh Green", emoji: "💚" },
      { color: "#feca57", name: "Sunny Yellow", emoji: "💛" },
      { color: "#ff9ff3", name: "Bubblegum Pink", emoji: "💗" },
      { color: "#a29bfe", name: "Royal Purple", emoji: "💜" },
      { color: "#fd79a8", name: "Hot Pink", emoji: "💗" },
    ],

    // Background colors - soft and appealing
    background: [
      { color: "#b6e3f4", name: "Cloud Blue", emoji: "☁️" },
      { color: "#ffd93d", name: "Sunshine", emoji: "☀️" },
      { color: "#6c5ce7", name: "Galaxy Purple", emoji: "🌌" },
      { color: "#a29bfe", name: "Lavender", emoji: "💜" },
      { color: "#fd79a8", name: "Sunset Pink", emoji: "🌅" },
      { color: "#00b894", name: "Forest Green", emoji: "🌲" },
      { color: "#e17055", name: "Warm Orange", emoji: "🧡" },
      { color: "#81ecec", name: "Ocean Breeze", emoji: "🌊" },
    ],
  };

  // ✂️ Hair Style Options (organized by style type)
  static HAIR_OPTIONS = {
    short: [
      { id: "short01", name: "Classic Short", emoji: "✂️", unlockLevel: 1 },
      { id: "short02", name: "Spiky Short", emoji: "⚡", unlockLevel: 1 },
      { id: "short03", name: "Messy Short", emoji: "🌪️", unlockLevel: 3 },
      { id: "short04", name: "Side Part", emoji: "📐", unlockLevel: 5 },
    ],
    long: [
      { id: "long01", name: "Flowing Long", emoji: "🌊", unlockLevel: 2 },
      { id: "long02", name: "Straight Long", emoji: "📏", unlockLevel: 4 },
      { id: "long03", name: "Wavy Long", emoji: "〰️", unlockLevel: 6 },
    ],
    curly: [
      { id: "curly01", name: "Bouncy Curls", emoji: "🌀", unlockLevel: 3 },
      { id: "curly02", name: "Tight Curls", emoji: "🔄", unlockLevel: 7 },
      { id: "curly03", name: "Wild Curls", emoji: "🌪️", unlockLevel: 10 },
    ],
    special: [
      { id: "mohawk", name: "Mohawk", emoji: "🦅", unlockLevel: 15 },
      { id: "ponytail", name: "High Ponytail", emoji: "🐴", unlockLevel: 8 },
      { id: "braids", name: "Cool Braids", emoji: "🧵", unlockLevel: 12 },
    ],
  };

  // 👀 Eye Style Options
  static EYE_OPTIONS = [
    { id: "variant01", name: "Happy Eyes", emoji: "😊", unlockLevel: 1 },
    { id: "variant02", name: "Curious Eyes", emoji: "🤔", unlockLevel: 1 },
    { id: "variant03", name: "Excited Eyes", emoji: "🤩", unlockLevel: 2 },
    { id: "variant04", name: "Cool Eyes", emoji: "😎", unlockLevel: 5 },
    { id: "variant05", name: "Sleepy Eyes", emoji: "😴", unlockLevel: 3 },
    { id: "variant06", name: "Winking Eyes", emoji: "😉", unlockLevel: 7 },
  ];

  // 😊 Facial Expression Options
  static EXPRESSION_OPTIONS = [
    {
      id: "variant01",
      name: "Happy",
      emoji: "😊",
      description: "Big smile after a great workout!",
      unlockLevel: 1,
    },
    {
      id: "variant02",
      name: "Surprised",
      emoji: "😮",
      description: "Wow, I can do that many push-ups?!",
      unlockLevel: 1,
    },
    {
      id: "variant03",
      name: "Laughing",
      emoji: "😄",
      description: "Having so much fun exercising!",
      unlockLevel: 3,
    },
    {
      id: "variant04",
      name: "Cool",
      emoji: "😌",
      description: "Totally nailed that workout!",
      unlockLevel: 5,
    },
    {
      id: "variant05",
      name: "Determined",
      emoji: "😤",
      description: "Ready to crush any challenge!",
      unlockLevel: 8,
    },
  ];

  // 👕 Clothing Options (organized by type)
  static CLOTHING_OPTIONS = {
    casual: [
      { id: "shirt01", name: "Basic Tee", emoji: "👕", unlockLevel: 1 },
      { id: "shirt02", name: "Graphic Tee", emoji: "🎨", unlockLevel: 2 },
      { id: "hoodie", name: "Cozy Hoodie", emoji: "🧥", unlockLevel: 4 },
    ],
    athletic: [
      { id: "tank_top", name: "Sports Tank", emoji: "🏃", unlockLevel: 5 },
      { id: "workout_shirt", name: "Workout Tee", emoji: "💪", unlockLevel: 6 },
      { id: "sports_bra", name: "Sports Top", emoji: "🏃‍♀️", unlockLevel: 8 },
    ],
    formal: [
      { id: "dress01", name: "Pretty Dress", emoji: "👗", unlockLevel: 7 },
      { id: "jacket", name: "Smart Jacket", emoji: "🧥", unlockLevel: 10 },
      { id: "suit", name: "Cool Suit", emoji: "🤵", unlockLevel: 15 },
    ],
    fun: [
      { id: "superhero", name: "Hero Cape", emoji: "🦸", unlockLevel: 12 },
      { id: "ninja", name: "Ninja Outfit", emoji: "🥷", unlockLevel: 18 },
      { id: "wizard", name: "Magic Robes", emoji: "🧙", unlockLevel: 20 },
    ],
  };

  // 🎭 Accessory Options
  static ACCESSORY_OPTIONS = {
    headwear: [
      { id: "cap", name: "Baseball Cap", emoji: "🧢", unlockLevel: 3 },
      { id: "headband", name: "Sweat Band", emoji: "🏃", unlockLevel: 4 },
      { id: "crown", name: "Winner Crown", emoji: "👑", unlockLevel: 25 },
    ],
    eyewear: [
      { id: "glasses", name: "Cool Glasses", emoji: "🤓", unlockLevel: 6 },
      { id: "sunglasses", name: "Sunglasses", emoji: "😎", unlockLevel: 9 },
      { id: "goggles", name: "Sport Goggles", emoji: "🥽", unlockLevel: 11 },
    ],
    jewelry: [
      { id: "necklace", name: "Medal Necklace", emoji: "🏅", unlockLevel: 13 },
      { id: "earrings", name: "Star Earrings", emoji: "⭐", unlockLevel: 16 },
      { id: "watch", name: "Fitness Watch", emoji: "⌚", unlockLevel: 19 },
    ],
  };

  // 🏆 Achievement-Based Unlocks
  static ACHIEVEMENT_UNLOCKS = {
    first_workout: {
      achievement: "Complete your first workout",
      unlocks: ["tank_top", "headband"],
      level: 1,
    },
    week_streak: {
      achievement: "Exercise 7 days in a row",
      unlocks: ["superhero", "crown"],
      level: 5,
    },
    fitness_master: {
      achievement: "Reach level 20",
      unlocks: ["ninja", "wizard", "goggles"],
      level: 20,
    },
  };

  // 🎨 Theme Combinations (pre-made looks)
  static THEME_PRESETS = {
    athlete: {
      name: "🏃 Athletic Champion",
      description: "Ready for any sport!",
      settings: {
        hair: "short02",
        hairColor: "8B4513",
        clothing: "tank_top",
        clothingColor: "4ecdc4",
        accessories: ["headband"],
        expression: "variant04",
        backgroundColor: "00b894",
      },
      unlockLevel: 5,
    },
    superhero: {
      name: "🦸 Super Hero",
      description: "Save the world with fitness!",
      settings: {
        hair: "short01",
        hairColor: "000000",
        clothing: "superhero",
        clothingColor: "ff6b6b",
        accessories: ["cape"],
        expression: "variant05",
        backgroundColor: "6c5ce7",
      },
      unlockLevel: 12,
    },
    ninja: {
      name: "🥷 Fitness Ninja",
      description: "Stealthy and strong!",
      settings: {
        hair: "long01",
        hairColor: "000000",
        clothing: "ninja",
        clothingColor: "262e33",
        accessories: ["mask"],
        expression: "variant04",
        backgroundColor: "2d3436",
      },
      unlockLevel: 18,
    },
  };

  // 🔧 Helper Functions

  // Get all hair options as a flat array
  static getAllHairOptions() {
    return Object.values(this.HAIR_OPTIONS).flat();
  }

  // Get unlocked items based on user level
  static getUnlockedItems(userLevel, itemType) {
    let items = [];

    switch (itemType) {
      case "hair":
        items = this.getAllHairOptions();
        break;
      case "eyes":
        items = this.EYE_OPTIONS;
        break;
      case "expressions":
        items = this.EXPRESSION_OPTIONS;
        break;
      case "clothing":
        items = Object.values(this.CLOTHING_OPTIONS).flat();
        break;
      case "accessories":
        items = Object.values(this.ACCESSORY_OPTIONS).flat();
        break;
      default:
        return [];
    }

    return items.filter((item) => item.unlockLevel <= userLevel);
  }

  // Check if user can access a specific style
  static canUseStyle(styleName, userLevel = 1) {
    const style = this.AVATAR_STYLES[styleName];
    return style && style.ageGroup === "kids" && userLevel >= 1;
  }

  // Get random avatar settings (for quick generation)
  static getRandomAvatarSettings(userLevel = 1) {
    const availableHair = this.getUnlockedItems(userLevel, "hair");
    const availableEyes = this.getUnlockedItems(userLevel, "eyes");
    const availableClothing = this.getUnlockedItems(userLevel, "clothing");
    const availableExpressions = this.getUnlockedItems(
      userLevel,
      "expressions"
    );

    const randomChoice = (array) =>
      array[Math.floor(Math.random() * array.length)];
    const randomColor = (colorArray) => randomChoice(colorArray);

    return {
      style: "adventurer", // Default safe choice
      hair: [randomChoice(availableHair)?.id || "short01"],
      hairColor: [randomColor(this.COLOR_PALETTES.hair.natural).color],
      eyes: [randomChoice(availableEyes)?.id || "variant01"],
      clothing: [randomChoice(availableClothing)?.id || "shirt01"],
      clothingColor: [randomColor(this.COLOR_PALETTES.clothing).color],
      expression: [randomChoice(availableExpressions)?.id || "variant01"],
      skinColor: [randomColor(this.COLOR_PALETTES.skin).color],
      backgroundColor: [randomColor(this.COLOR_PALETTES.background).color],
    };
  }
}

export default DiceBearConfig;
