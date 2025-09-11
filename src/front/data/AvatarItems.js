// 🎒 AvatarItems.js - Complete Catalog of All Avatar Items!
// This is like a huge toy store catalog with everything kids can earn and use

const AvatarItems = {
  // 🎨 Art Styles - Different ways avatars can look
  styles: {
    adventurer: {
      id: "adventurer",
      name: "Adventure Hero",
      emoji: "🏰",
      description: "Brave heroes ready for quests and fitness challenges!",
      unlockLevel: 1,
      category: "style",
      rarity: "common",
      fitnessTheme: true, // Perfect for fitness apps
      ageAppropriate: true,
    },
    personas: {
      id: "personas",
      name: "Happy Friends",
      emoji: "😊",
      description: "Cheerful and friendly characters that love to play!",
      unlockLevel: 1,
      category: "style",
      rarity: "common",
      fitnessTheme: true,
      ageAppropriate: true,
    },
    miniavs: {
      id: "miniavs",
      name: "Game Characters",
      emoji: "🎮",
      description: "Pixel-perfect gaming avatars that level up with you!",
      unlockLevel: 5,
      category: "style",
      rarity: "rare",
      fitnessTheme: true,
      ageAppropriate: true,
    },
    lorelei: {
      id: "lorelei",
      name: "Magical Style",
      emoji: "✨",
      description: "Elegant and magical characters for special occasions!",
      unlockLevel: 15,
      category: "style",
      rarity: "epic",
      fitnessTheme: false,
      ageAppropriate: true,
    },
  },

  // ✂️ Hair Styles - Organized by type and unlock level
  hair: {
    // 👶 Starter Hair (Level 1)
    short01: {
      id: "short01",
      name: "Classic Short",
      emoji: "✂️",
      description: "Perfect for any adventure!",
      unlockLevel: 1,
      category: "hair",
      rarity: "common",
      fitnessBonus: 0,
      tags: ["starter", "basic", "neat"],
    },
    short02: {
      id: "short02",
      name: "Spiky Cool",
      emoji: "⚡",
      description: "Show your energetic side!",
      unlockLevel: 1,
      category: "hair",
      rarity: "common",
      fitnessBonus: 0,
      tags: ["starter", "energetic", "fun"],
    },

    // 🏃 Active Hair (Level 3-5)
    short03: {
      id: "short03",
      name: "Workout Ready",
      emoji: "🏃",
      description: "Perfect for breaking a sweat!",
      unlockLevel: 3,
      category: "hair",
      rarity: "common",
      fitnessBonus: 5,
      tags: ["athletic", "practical", "sporty"],
      unlockCondition: "Complete 5 workouts",
    },
    ponytail: {
      id: "ponytail",
      name: "High Ponytail",
      emoji: "🐴",
      description: "Bouncy and ready for action!",
      unlockLevel: 4,
      category: "hair",
      rarity: "uncommon",
      fitnessBonus: 8,
      tags: ["athletic", "bouncy", "active"],
      unlockCondition: "Run for 30 minutes total",
    },
    headband_hair: {
      id: "headband_hair",
      name: "Sporty with Headband",
      emoji: "🏃‍♀️",
      description: "Athletic style with sweat-stopping power!",
      unlockLevel: 5,
      category: "hair",
      rarity: "uncommon",
      fitnessBonus: 10,
      tags: ["athletic", "professional", "focused"],
      unlockCondition: "Complete cardio challenge",
    },

    // 🌟 Special Hair (Level 8+)
    long01: {
      id: "long01",
      name: "Flowing Locks",
      emoji: "🌊",
      description: "Beautiful long hair that flows like water!",
      unlockLevel: 8,
      category: "hair",
      rarity: "rare",
      fitnessBonus: 12,
      tags: ["elegant", "flowing", "graceful"],
      unlockCondition: "Master yoga poses",
    },
    curly01: {
      id: "curly01",
      name: "Bouncy Curls",
      emoji: "🌀",
      description: "Curls that bounce with every jump!",
      unlockLevel: 10,
      category: "hair",
      rarity: "rare",
      fitnessBonus: 15,
      tags: ["bouncy", "fun", "energetic"],
      unlockCondition: "Do 500 jumping jacks",
    },

    // 🏆 Champion Hair (Level 15+)
    mohawk: {
      id: "mohawk",
      name: "Champion Mohawk",
      emoji: "🦅",
      description: "For true fitness warriors!",
      unlockLevel: 15,
      category: "hair",
      rarity: "epic",
      fitnessBonus: 25,
      tags: ["warrior", "bold", "champion"],
      unlockCondition: "Reach fitness level 15",
    },
    rainbow_hair: {
      id: "rainbow_hair",
      name: "Rainbow Power",
      emoji: "🌈",
      description: "Magical hair that changes colors!",
      unlockLevel: 20,
      category: "hair",
      rarity: "legendary",
      fitnessBonus: 50,
      tags: ["magical", "colorful", "legendary"],
      unlockCondition: "Complete all workout types",
    },
  },

  // 👕 Clothing - From basic to super special
  clothing: {
    // 👕 Basic Clothing (Level 1)
    shirt01: {
      id: "shirt01",
      name: "Basic Tee",
      emoji: "👕",
      description: "Comfortable for everyday adventures!",
      unlockLevel: 1,
      category: "clothing",
      rarity: "common",
      fitnessBonus: 0,
      tags: ["starter", "comfortable", "basic"],
    },
    shirt02: {
      id: "shirt02",
      name: "Fun Graphic Tee",
      emoji: "🎨",
      description: "Show your personality!",
      unlockLevel: 1,
      category: "clothing",
      rarity: "common",
      fitnessBonus: 0,
      tags: ["starter", "colorful", "personal"],
    },

    // 🏃 Athletic Wear (Level 3-8)
    tank_top: {
      id: "tank_top",
      name: "Sports Tank",
      emoji: "🏃",
      description: "Perfect for intense workouts!",
      unlockLevel: 3,
      category: "clothing",
      rarity: "uncommon",
      fitnessBonus: 10,
      tags: ["athletic", "breathable", "performance"],
      unlockCondition: "Complete strength training",
    },
    workout_shirt: {
      id: "workout_shirt",
      name: "Performance Tee",
      emoji: "💪",
      description: "High-tech fabric for champions!",
      unlockLevel: 5,
      category: "clothing",
      rarity: "uncommon",
      fitnessBonus: 15,
      tags: ["athletic", "tech", "moisture-wicking"],
      unlockCondition: "Work out 10 days in a row",
    },
    sports_bra: {
      id: "sports_bra",
      name: "Athletic Top",
      emoji: "🏃‍♀️",
      description: "Supportive and stylish!",
      unlockLevel: 6,
      category: "clothing",
      rarity: "uncommon",
      fitnessBonus: 18,
      tags: ["athletic", "supportive", "comfortable"],
      unlockCondition: "Master flexibility exercises",
    },

    // 🎉 Fun Outfits (Level 10+)
    hoodie: {
      id: "hoodie",
      name: "Cozy Champion Hoodie",
      emoji: "🧥",
      description: "Warm and comfy after workouts!",
      unlockLevel: 8,
      category: "clothing",
      rarity: "rare",
      fitnessBonus: 20,
      tags: ["cozy", "warm", "relaxing"],
      unlockCondition: "Exercise in different weather",
    },
    dress01: {
      id: "dress01",
      name: "Victory Dress",
      emoji: "👗",
      description: "Celebrate your achievements in style!",
      unlockLevel: 12,
      category: "clothing",
      rarity: "rare",
      fitnessBonus: 25,
      tags: ["celebration", "elegant", "victory"],
      unlockCondition: "Win fitness challenges",
    },

    // 🦸 Super Special Outfits (Level 15+)
    superhero: {
      id: "superhero",
      name: "Fitness Hero Cape",
      emoji: "🦸",
      description: "You are a fitness superhero!",
      unlockLevel: 15,
      category: "clothing",
      rarity: "epic",
      fitnessBonus: 40,
      tags: ["heroic", "inspiring", "powerful"],
      unlockCondition: "Help friends exercise",
    },
    ninja: {
      id: "ninja",
      name: "Stealth Ninja Gear",
      emoji: "🥷",
      description: "Silent but strong like a ninja!",
      unlockLevel: 18,
      category: "clothing",
      rarity: "epic",
      fitnessBonus: 45,
      tags: ["stealthy", "agile", "mysterious"],
      unlockCondition: "Master balance challenges",
    },
    wizard: {
      id: "wizard",
      name: "Magic Fitness Robes",
      emoji: "🧙",
      description: "Cast spells of strength and endurance!",
      unlockLevel: 20,
      category: "clothing",
      rarity: "legendary",
      fitnessBonus: 60,
      tags: ["magical", "wise", "powerful"],
      unlockCondition: "Reach fitness master level",
    },
  },

  // 🎭 Accessories - Extra cool items
  accessories: {
    // 👑 Headwear
    cap: {
      id: "cap",
      name: "Baseball Cap",
      emoji: "🧢",
      description: "Classic cap for sunny day workouts!",
      unlockLevel: 3,
      category: "accessories",
      subCategory: "headwear",
      rarity: "common",
      fitnessBonus: 5,
      tags: ["sporty", "sun-protection", "classic"],
      unlockCondition: "Exercise outdoors",
    },
    headband: {
      id: "headband",
      name: "Sweat Warrior Band",
      emoji: "🏃",
      description: "Keeps sweat out of your eyes!",
      unlockLevel: 4,
      category: "accessories",
      subCategory: "headwear",
      rarity: "uncommon",
      fitnessBonus: 8,
      tags: ["practical", "athletic", "focused"],
      unlockCondition: "Complete cardio workout",
    },
    crown: {
      id: "crown",
      name: "Fitness Champion Crown",
      emoji: "👑",
      description: "You rule the fitness kingdom!",
      unlockLevel: 25,
      category: "accessories",
      subCategory: "headwear",
      rarity: "legendary",
      fitnessBonus: 100,
      tags: ["royal", "champion", "prestigious"],
      unlockCondition: "Become ultimate fitness champion",
    },

    // 👓 Eyewear
    glasses: {
      id: "glasses",
      name: "Smart Glasses",
      emoji: "🤓",
      description: "See your fitness goals clearly!",
      unlockLevel: 6,
      category: "accessories",
      subCategory: "eyewear",
      rarity: "uncommon",
      fitnessBonus: 12,
      tags: ["smart", "focused", "analytical"],
      unlockCondition: "Track workout data",
    },
    sunglasses: {
      id: "sunglasses",
      name: "Cool Shades",
      emoji: "😎",
      description: "Look cool while staying cool!",
      unlockLevel: 8,
      category: "accessories",
      subCategory: "eyewear",
      rarity: "rare",
      fitnessBonus: 15,
      tags: ["cool", "stylish", "confident"],
      unlockCondition: "Exercise in summer",
    },
    goggles: {
      id: "goggles",
      name: "Sport Goggles",
      emoji: "🥽",
      description: "Professional athlete protection!",
      unlockLevel: 12,
      category: "accessories",
      subCategory: "eyewear",
      rarity: "rare",
      fitnessBonus: 22,
      tags: ["professional", "protective", "serious"],
      unlockCondition: "Try extreme sports workout",
    },

    // 💎 Jewelry & Special Items
    necklace: {
      id: "necklace",
      name: "Victory Medal",
      emoji: "🏅",
      description: "Wear your achievements with pride!",
      unlockLevel: 10,
      category: "accessories",
      subCategory: "jewelry",
      rarity: "rare",
      fitnessBonus: 20,
      tags: ["achievement", "pride", "victory"],
      unlockCondition: "Win fitness competition",
    },
    watch: {
      id: "watch",
      name: "Fitness Tracker Watch",
      emoji: "⌚",
      description: "Track every step and heartbeat!",
      unlockLevel: 15,
      category: "accessories",
      subCategory: "tech",
      rarity: "epic",
      fitnessBonus: 35,
      tags: ["tech", "tracking", "precise"],
      unlockCondition: "Use fitness app for 30 days",
    },
    cape: {
      id: "cape",
      name: "Champion Cape",
      emoji: "🦸‍♀️",
      description: "Fly through your workouts!",
      unlockLevel: 20,
      category: "accessories",
      subCategory: "special",
      rarity: "legendary",
      fitnessBonus: 50,
      tags: ["heroic", "flying", "inspiring"],
      unlockCondition: "Inspire others to exercise",
    },
  },

  // 🎨 Color Collections - Organized themes
  colors: {
    natural: {
      hair: ["#8B4513", "#FFD700", "#000000", "#A0522D", "#DC143C"],
      clothing: ["#FFFFFF", "#000000", "#8B4513", "#4B0082", "#008B8B"],
      description: "Natural, everyday colors",
    },
    vibrant: {
      hair: ["#FF6347", "#9370DB", "#00CED1", "#32CD32", "#FF1493"],
      clothing: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"],
      description: "Bright, energetic colors",
    },
    pastel: {
      hair: ["#FFB6C1", "#E6E6FA", "#F0E68C", "#98FB98", "#FFA07A"],
      clothing: ["#FFE4E1", "#E0FFFF", "#F5FFFA", "#FFF8DC", "#FFEFD5"],
      description: "Soft, gentle colors",
    },
    neon: {
      hair: ["#FF073A", "#39FF14", "#FF0080", "#00FFFF", "#FFFF00"],
      clothing: ["#FF073A", "#39FF14", "#FF0080", "#00FFFF", "#FFFF00"],
      description: "Electric, glowing colors",
      unlockLevel: 15,
    },
    rainbow: {
      hair: [
        "#FF0000",
        "#FF7F00",
        "#FFFF00",
        "#00FF00",
        "#0000FF",
        "#4B0082",
        "#9400D3",
      ],
      clothing: [
        "#FF0000",
        "#FF7F00",
        "#FFFF00",
        "#00FF00",
        "#0000FF",
        "#4B0082",
        "#9400D3",
      ],
      description: "All the colors of the rainbow!",
      unlockLevel: 20,
    },
  },

  // 🏆 Special Collections - Themed sets
  collections: {
    athlete: {
      name: "Athletic Champion",
      emoji: "🏃‍♀️",
      description: "Everything a sports star needs!",
      items: ["tank_top", "headband", "ponytail", "sunglasses"],
      unlockLevel: 5,
      bonus: "Extra energy during workouts",
      completeBonus: 25,
    },
    superhero: {
      name: "Fitness Hero",
      emoji: "🦸",
      description: "Save the world with fitness!",
      items: ["superhero", "cape", "crown", "rainbow_hair"],
      unlockLevel: 15,
      bonus: "Inspire others to exercise",
      completeBonus: 100,
    },
    ninja: {
      name: "Stealth Warrior",
      emoji: "🥷",
      description: "Silent but deadly... deadly fit!",
      items: ["ninja", "mohawk", "goggles", "watch"],
      unlockLevel: 18,
      bonus: "Perfect balance and agility",
      completeBonus: 75,
    },
    wizard: {
      name: "Magic Fitness Master",
      emoji: "🧙‍♀️",
      description: "Cast spells of strength!",
      items: ["wizard", "curly01", "necklace", "glasses"],
      unlockLevel: 20,
      bonus: "Magical workout enhancement",
      completeBonus: 150,
    },
  },

  // 🎯 Rarity System
  rarityInfo: {
    common: {
      color: "#95a5a6",
      name: "Common",
      emoji: "⚪",
      description: "Basic items everyone can get",
    },
    uncommon: {
      color: "#27ae60",
      name: "Uncommon",
      emoji: "🟢",
      description: "Nice items that take some work",
    },
    rare: {
      color: "#3498db",
      name: "Rare",
      emoji: "🔵",
      description: "Special items for dedicated exercisers",
    },
    epic: {
      color: "#9b59b6",
      name: "Epic",
      emoji: "🟣",
      description: "Amazing items for fitness heroes",
    },
    legendary: {
      color: "#f39c12",
      name: "Legendary",
      emoji: "🟡",
      description: "The most incredible items for champions",
    },
  },
};

// 🔧 Helper Functions for easier access
export const getItemsByCategory = (category) => {
  return AvatarItems[category] || {};
};

export const getItemsByLevel = (maxLevel) => {
  const allItems = {};

  Object.keys(AvatarItems).forEach((category) => {
    if (
      typeof AvatarItems[category] === "object" &&
      !Array.isArray(AvatarItems[category])
    ) {
      allItems[category] = {};

      Object.keys(AvatarItems[category]).forEach((itemKey) => {
        const item = AvatarItems[category][itemKey];
        if (item.unlockLevel && item.unlockLevel <= maxLevel) {
          allItems[category][itemKey] = item;
        }
      });
    }
  });

  return allItems;
};

export const getItemsByRarity = (rarity) => {
  const items = [];

  Object.keys(AvatarItems).forEach((category) => {
    if (typeof AvatarItems[category] === "object") {
      Object.values(AvatarItems[category]).forEach((item) => {
        if (item.rarity === rarity) {
          items.push({ ...item, category });
        }
      });
    }
  });

  return items;
};

export const searchItems = (searchTerm) => {
  const results = [];
  const term = searchTerm.toLowerCase();

  Object.keys(AvatarItems).forEach((category) => {
    if (typeof AvatarItems[category] === "object") {
      Object.values(AvatarItems[category]).forEach((item) => {
        if (
          item.name?.toLowerCase().includes(term) ||
          item.description?.toLowerCase().includes(term) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(term))
        ) {
          results.push({ ...item, category });
        }
      });
    }
  });

  return results;
};

export default AvatarItems;
