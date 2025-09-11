// 🏆 UnlockableItems.js - Everything Kids Can Earn Through Exercise!
// This file defines what cool stuff kids get when they work out and stay active

const UnlockableItems = {
  // 🎯 Achievement Categories
  achievementCategories: {
    beginner: {
      name: "Getting Started",
      emoji: "🌱",
      description: "Your first steps into fitness!",
      color: "#27ae60",
    },
    consistency: {
      name: "Staying Strong",
      emoji: "💪",
      description: "Building healthy habits!",
      color: "#3498db",
    },
    challenges: {
      name: "Challenge Master",
      emoji: "🏆",
      description: "Crushing difficult workouts!",
      color: "#9b59b6",
    },
    social: {
      name: "Fitness Friend",
      emoji: "👥",
      description: "Exercising with others!",
      color: "#e74c3c",
    },
    mastery: {
      name: "Fitness Legend",
      emoji: "⭐",
      description: "Ultimate fitness achievements!",
      color: "#f39c12",
    },
  },

  // 🏅 Individual Achievements with Rewards
  achievements: {
    // 🌱 BEGINNER ACHIEVEMENTS
    first_workout: {
      id: "first_workout",
      name: "First Steps Hero",
      emoji: "👶",
      description: "Complete your very first workout!",
      category: "beginner",
      requirements: {
        workouts_completed: 1,
      },
      rewards: {
        items: [
          { type: "clothing", id: "tank_top" },
          { type: "accessories", id: "headband" },
        ],
        fitnessPoints: 50,
        title: "Fitness Newbie",
      },
      celebrationMessage: "🎉 Amazing! You just started your fitness journey!",
    },

    five_workouts: {
      id: "five_workouts",
      name: "Workout Warrior",
      emoji: "⚔️",
      description: "Complete 5 different workouts!",
      category: "beginner",
      requirements: {
        workouts_completed: 5,
      },
      rewards: {
        items: [
          { type: "hair", id: "short03" },
          { type: "accessories", id: "cap" },
        ],
        fitnessPoints: 100,
        title: "Active Adventurer",
      },
      celebrationMessage: "⚔️ You are becoming a true workout warrior!",
    },

    first_cardio: {
      id: "first_cardio",
      name: "Heart Pumper",
      emoji: "❤️",
      description: "Complete a cardio workout!",
      category: "beginner",
      requirements: {
        cardio_workouts: 1,
      },
      rewards: {
        items: [
          { type: "hair", id: "ponytail" },
          { type: "colors", collection: "vibrant" },
        ],
        fitnessPoints: 75,
        title: "Cardio Crusher",
      },
      celebrationMessage: "❤️ Your heart is getting stronger!",
    },

    first_strength: {
      id: "first_strength",
      name: "Muscle Builder",
      emoji: "💪",
      description: "Complete a strength training workout!",
      category: "beginner",
      requirements: {
        strength_workouts: 1,
      },
      rewards: {
        items: [
          { type: "clothing", id: "workout_shirt" },
          { type: "accessories", id: "glasses" },
        ],
        fitnessPoints: 75,
        title: "Strength Seeker",
      },
      celebrationMessage: "💪 You are building awesome strength!",
    },

    // 💪 CONSISTENCY ACHIEVEMENTS
    week_streak: {
      id: "week_streak",
      name: "Seven Day Superstar",
      emoji: "🌟",
      description: "Exercise 7 days in a row!",
      category: "consistency",
      requirements: {
        consecutive_days: 7,
      },
      rewards: {
        items: [
          { type: "clothing", id: "superhero" },
          { type: "accessories", id: "cape" },
          { type: "hair", id: "long01" },
        ],
        fitnessPoints: 200,
        title: "Consistency Champion",
      },
      celebrationMessage:
        "🌟 WOW! One whole week of exercise! You are a superstar!",
    },

    month_streak: {
      id: "month_streak",
      name: "Monthly Fitness Master",
      emoji: "📅",
      description: "Exercise for 30 days!",
      category: "consistency",
      requirements: {
        consecutive_days: 30,
      },
      rewards: {
        items: [
          { type: "hair", id: "curly01" },
          { type: "accessories", id: "sunglasses" },
          { type: "clothing", id: "hoodie" },
          { type: "colors", collection: "neon" },
        ],
        fitnessPoints: 500,
        title: "Habit Hero",
      },
      celebrationMessage:
        "📅 30 days! You have built an amazing fitness habit!",
    },

    hundred_workouts: {
      id: "hundred_workouts",
      name: "Century Crusher",
      emoji: "💯",
      description: "Complete 100 total workouts!",
      category: "consistency",
      requirements: {
        total_workouts: 100,
      },
      rewards: {
        items: [
          { type: "hair", id: "mohawk" },
          { type: "accessories", id: "crown" },
          { type: "clothing", id: "wizard" },
        ],
        fitnessPoints: 1000,
        title: "Century Superstar",
      },
      celebrationMessage: "💯 100 workouts! You are absolutely incredible!",
    },

    // 🏆 CHALLENGE ACHIEVEMENTS
    cardio_master: {
      id: "cardio_master",
      name: "Cardio King/Queen",
      emoji: "👑",
      description: "Complete 25 cardio workouts!",
      category: "challenges",
      requirements: {
        cardio_workouts: 25,
      },
      rewards: {
        items: [
          { type: "accessories", id: "necklace" },
          { type: "hair", id: "headband_hair" },
          { type: "clothing", id: "sports_bra" },
        ],
        fitnessPoints: 300,
        title: "Cardio Royalty",
      },
      celebrationMessage: "👑 You rule the cardio kingdom!",
    },

    strength_master: {
      id: "strength_master",
      name: "Strength Superhero",
      emoji: "🦸‍♂️",
      description: "Complete 25 strength workouts!",
      category: "challenges",
      requirements: {
        strength_workouts: 25,
      },
      rewards: {
        items: [
          { type: "clothing", id: "ninja" },
          { type: "accessories", id: "goggles" },
          { type: "hair", id: "rainbow_hair" },
        ],
        fitnessPoints: 300,
        title: "Strength Superhero",
      },
      celebrationMessage: "🦸‍♂️ Your strength powers are incredible!",
    },

    flexibility_master: {
      id: "flexibility_master",
      name: "Flexibility Wizard",
      emoji: "🧙‍♀️",
      description: "Master 20 different stretches!",
      category: "challenges",
      requirements: {
        stretches_mastered: 20,
      },
      rewards: {
        items: [
          { type: "clothing", id: "dress01" },
          { type: "accessories", id: "watch" },
          { type: "colors", collection: "pastel" },
        ],
        fitnessPoints: 250,
        title: "Bendy Master",
      },
      celebrationMessage: "🧙‍♀️ You are magically flexible!",
    },

    // 👥 SOCIAL ACHIEVEMENTS
    workout_buddy: {
      id: "workout_buddy",
      name: "Fitness Friend",
      emoji: "👫",
      description: "Exercise with a friend 5 times!",
      category: "social",
      requirements: {
        friend_workouts: 5,
      },
      rewards: {
        items: [
          { type: "accessories", id: "cap" },
          { type: "hair", id: "ponytail" },
        ],
        fitnessPoints: 150,
        title: "Team Player",
      },
      celebrationMessage: "👫 Exercising with friends makes it even more fun!",
    },

    fitness_leader: {
      id: "fitness_leader",
      name: "Inspiration Station",
      emoji: "🌟",
      description: "Help 10 friends start exercising!",
      category: "social",
      requirements: {
        friends_inspired: 10,
      },
      rewards: {
        items: [
          { type: "accessories", id: "crown" },
          { type: "clothing", id: "superhero" },
          { type: "hair", id: "long01" },
        ],
        fitnessPoints: 400,
        title: "Fitness Leader",
      },
      celebrationMessage: "🌟 You inspire others to be healthy! Amazing!",
    },

    family_fitness: {
      id: "family_fitness",
      name: "Family Fitness Fun",
      emoji: "👨‍👩‍👧‍👦",
      description: "Exercise with family 15 times!",
      category: "social",
      requirements: {
        family_workouts: 15,
      },
      rewards: {
        items: [
          { type: "clothing", id: "hoodie" },
          { type: "accessories", id: "necklace" },
          { type: "colors", collection: "rainbow" },
        ],
        fitnessPoints: 350,
        title: "Family Champion",
      },
      celebrationMessage: "👨‍👩‍👧‍👦 Family fitness time is the best time!",
    },

    // ⭐ MASTERY ACHIEVEMENTS
    fitness_legend: {
      id: "fitness_legend",
      name: "Ultimate Fitness Legend",
      emoji: "🏆",
      description: "Reach level 25 and complete 200 workouts!",
      category: "mastery",
      requirements: {
        level: 25,
        total_workouts: 200,
      },
      rewards: {
        items: [
          { type: "hair", id: "rainbow_hair" },
          { type: "clothing", id: "wizard" },
          { type: "accessories", id: "crown" },
          { type: "accessories", id: "cape" },
          { type: "colors", collection: "rainbow" },
        ],
        fitnessPoints: 2000,
        title: "Legendary Champion",
      },
      celebrationMessage: "🏆 You are a TRUE FITNESS LEGEND! Incredible!",
    },

    perfect_month: {
      id: "perfect_month",
      name: "Perfect Month Hero",
      emoji: "✨",
      description: "Exercise every single day for a month!",
      category: "mastery",
      requirements: {
        perfect_month: true,
      },
      rewards: {
        items: [
          { type: "accessories", id: "watch" },
          { type: "hair", id: "curly01" },
          { type: "clothing", id: "ninja" },
        ],
        fitnessPoints: 800,
        title: "Perfection Master",
      },
      celebrationMessage: "✨ Perfect! Every single day! You are unstoppable!",
    },

    all_workout_types: {
      id: "all_workout_types",
      name: "Exercise Expert",
      emoji: "🎓",
      description: "Try every type of workout available!",
      category: "mastery",
      requirements: {
        workout_types_completed: "all",
      },
      rewards: {
        items: [
          { type: "accessories", id: "goggles" },
          { type: "clothing", id: "dress01" },
          { type: "colors", collection: "neon" },
        ],
        fitnessPoints: 600,
        title: "Exercise Encyclopedia",
      },
      celebrationMessage: "🎓 You know every workout! You are an expert!",
    },
  },

  // 🎁 Milestone Rewards (Level-based unlocks)
  levelRewards: {
    2: {
      message: "Level 2! You are getting stronger!",
      rewards: {
        items: [{ type: "hair", id: "short03" }],
        fitnessPoints: 25,
      },
    },
    3: {
      message: "Level 3! New hair style unlocked!",
      rewards: {
        items: [{ type: "accessories", id: "headband" }],
        fitnessPoints: 50,
      },
    },
    5: {
      message: "Level 5! You unlocked the Athletic Champion collection!",
      rewards: {
        items: [
          { type: "clothing", id: "tank_top" },
          { type: "hair", id: "ponytail" },
        ],
        collections: ["athlete"],
        fitnessPoints: 100,
      },
    },
    10: {
      message: "Level 10! Double digits! You are incredible!",
      rewards: {
        items: [
          { type: "clothing", id: "hoodie" },
          { type: "accessories", id: "sunglasses" },
        ],
        fitnessPoints: 200,
      },
    },
    15: {
      message: "Level 15! Superhero gear unlocked!",
      rewards: {
        items: [
          { type: "clothing", id: "superhero" },
          { type: "accessories", id: "cape" },
        ],
        collections: ["superhero"],
        fitnessPoints: 300,
      },
    },
    20: {
      message: "Level 20! You are a fitness master!",
      rewards: {
        items: [
          { type: "clothing", id: "wizard" },
          { type: "hair", id: "rainbow_hair" },
        ],
        collections: ["wizard"],
        colors: ["rainbow"],
        fitnessPoints: 500,
      },
    },
    25: {
      message: "Level 25! LEGENDARY STATUS ACHIEVED!",
      rewards: {
        items: [
          { type: "accessories", id: "crown" },
          { type: "hair", id: "mohawk" },
        ],
        title: "Legendary Fitness Champion",
        fitnessPoints: 1000,
      },
    },
  },

  // 🏃 Workout-Specific Rewards
  workoutRewards: {
    cardio: {
      name: "Cardio Workouts",
      emoji: "❤️",
      milestones: {
        1: { items: [{ type: "hair", id: "ponytail" }], points: 25 },
        5: { items: [{ type: "accessories", id: "headband" }], points: 50 },
        10: { items: [{ type: "clothing", id: "tank_top" }], points: 100 },
        25: {
          items: [{ type: "accessories", id: "necklace" }],
          points: 250,
          title: "Cardio King/Queen",
        },
      },
    },
    strength: {
      name: "Strength Training",
      emoji: "💪",
      milestones: {
        1: { items: [{ type: "clothing", id: "workout_shirt" }], points: 25 },
        5: { items: [{ type: "accessories", id: "glasses" }], points: 50 },
        10: { items: [{ type: "hair", id: "short03" }], points: 100 },
        25: {
          items: [{ type: "clothing", id: "ninja" }],
          points: 250,
          title: "Strength Superhero",
        },
      },
    },
    flexibility: {
      name: "Flexibility & Yoga",
      emoji: "🧘‍♀️",
      milestones: {
        1: { items: [{ type: "clothing", id: "sports_bra" }], points: 25 },
        5: { items: [{ type: "hair", id: "long01" }], points: 50 },
        10: { items: [{ type: "clothing", id: "dress01" }], points: 100 },
        20: {
          items: [{ type: "accessories", id: "watch" }],
          points: 200,
          title: "Flexibility Wizard",
        },
      },
    },
    dance: {
      name: "Dance Workouts",
      emoji: "💃",
      milestones: {
        1: { items: [{ type: "hair", id: "curly01" }], points: 25 },
        5: { items: [{ type: "colors", collection: "vibrant" }], points: 50 },
        10: { items: [{ type: "clothing", id: "dress01" }], points: 100 },
        15: {
          items: [{ type: "colors", collection: "rainbow" }],
          points: 150,
          title: "Dance Star",
        },
      },
    },
  },

  // 🌟 Special Event Rewards
  specialEvents: {
    summer_challenge: {
      name: "Summer Fitness Challenge",
      emoji: "☀️",
      duration: "30 days",
      description: "Exercise outside during summer!",
      requirements: {
        outdoor_workouts: 20,
        timeframe: "summer",
      },
      rewards: {
        items: [
          { type: "accessories", id: "sunglasses" },
          { type: "clothing", id: "tank_top" },
          { type: "colors", collection: "vibrant" },
        ],
        title: "Summer Fitness Star",
        badge: "summer_champion",
      },
    },
    winter_warrior: {
      name: "Winter Warrior Challenge",
      emoji: "❄️",
      duration: "30 days",
      description: "Stay active during winter!",
      requirements: {
        indoor_workouts: 25,
        timeframe: "winter",
      },
      rewards: {
        items: [
          { type: "clothing", id: "hoodie" },
          { type: "hair", id: "long01" },
          { type: "colors", collection: "pastel" },
        ],
        title: "Winter Warrior",
        badge: "winter_champion",
      },
    },
    new_year_resolution: {
      name: "New Year, New Me!",
      emoji: "🎊",
      duration: "31 days",
      description: "Start the year with healthy habits!",
      requirements: {
        consecutive_days: 31,
        timeframe: "january",
      },
      rewards: {
        items: [
          { type: "accessories", id: "crown" },
          { type: "hair", id: "rainbow_hair" },
          { type: "clothing", id: "superhero" },
        ],
        title: "Resolution Champion",
        badge: "new_year_hero",
      },
    },
  },

  // 🎮 Daily/Weekly Challenges
  dailyChallenges: {
    jumping_jacks: {
      name: "Jumping Jack Attack",
      emoji: "🦘",
      description: "Do 50 jumping jacks!",
      requirement: { exercise: "jumping_jacks", count: 50 },
      reward: { points: 20, items: [] },
    },
    push_ups: {
      name: "Push-Up Power",
      emoji: "💪",
      description: "Complete 20 push-ups!",
      requirement: { exercise: "push_ups", count: 20 },
      reward: { points: 25, items: [] },
    },
    dance_party: {
      name: "Dance Party Time",
      emoji: "💃",
      description: "Dance for 10 minutes!",
      requirement: { exercise: "dance", minutes: 10 },
      reward: {
        points: 30,
        items: [{ type: "colors", collection: "vibrant" }],
      },
    },
    balance_challenge: {
      name: "Balance Master",
      emoji: "🤸‍♀️",
      description: "Hold a balance pose for 2 minutes!",
      requirement: { exercise: "balance", minutes: 2 },
      reward: { points: 35, items: [] },
    },
  },

  weeklyChallenges: {
    cardio_week: {
      name: "Cardio Crush Week",
      emoji: "❤️",
      description: "Do cardio every day this week!",
      requirement: { cardio_days: 7 },
      reward: {
        points: 200,
        items: [{ type: "accessories", id: "headband" }],
        title: "Cardio Crusher",
      },
    },
    strength_week: {
      name: "Strength Building Week",
      emoji: "💪",
      description: "Strength training 5 times this week!",
      requirement: { strength_sessions: 5 },
      reward: {
        points: 250,
        items: [{ type: "clothing", id: "workout_shirt" }],
        title: "Strength Builder",
      },
    },
    flexibility_week: {
      name: "Flexibility Focus Week",
      emoji: "🧘‍♀️",
      description: "Stretch every day this week!",
      requirement: { flexibility_days: 7 },
      reward: {
        points: 150,
        items: [{ type: "hair", id: "long01" }],
        title: "Flexibility Master",
      },
    },
  },
};

// 🔧 Helper Functions for Reward System

export const checkAchievementProgress = (userStats, achievementId) => {
  const achievement = UnlockableItems.achievements[achievementId];
  if (!achievement) return { completed: false, progress: 0 };

  const requirements = achievement.requirements;
  let progress = 0;
  let completed = true;

  // Check each requirement
  Object.keys(requirements).forEach((req) => {
    const required = requirements[req];
    const userValue = userStats[req] || 0;

    if (typeof required === "number") {
      progress = Math.min(userValue / required, 1);
      if (userValue < required) completed = false;
    } else if (req === "workout_types_completed" && required === "all") {
      const totalTypes = 4; // cardio, strength, flexibility, dance
      const completedTypes = userStats.workout_types_completed || 0;
      progress = completedTypes / totalTypes;
      if (completedTypes < totalTypes) completed = false;
    }
  });

  return { completed, progress: Math.round(progress * 100) };
};

export const getAvailableRewards = (userLevel) => {
  const available = {
    items: [],
    collections: [],
    colors: [],
  };

  // Check level rewards
  Object.keys(UnlockableItems.levelRewards).forEach((level) => {
    if (parseInt(level) <= userLevel) {
      const rewards = UnlockableItems.levelRewards[level].rewards;
      if (rewards.items) available.items.push(...rewards.items);
      if (rewards.collections)
        available.collections.push(...rewards.collections);
      if (rewards.colors) available.colors.push(...rewards.colors);
    }
  });

  return available;
};

export const calculateNextLevelPoints = (currentLevel) => {
  // Points needed for next level increases as you level up
  return (currentLevel + 1) * 100;
};

export const getTotalPointsForLevel = (level) => {
  // Total points earned by reaching this level
  let total = 0;
  for (let i = 1; i <= level; i++) {
    total += i * 100;
  }
  return total;
};

export default UnlockableItems;
