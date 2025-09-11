// This file helps save, load, and manage all avatar data

class AvatarService {
  // 🏠 Where we store avatars (like a digital closet)
  static STORAGE_KEY = "pixelplay_avatars";
  static CURRENT_AVATAR_KEY = "pixelplay_current_avatar";
  static USER_INVENTORY_KEY = "pixelplay_user_inventory";

  // 💾 Save an avatar design (like taking a photo for your album)
  static saveAvatar(avatarData) {
    try {
      // Get existing saved avatars
      const savedAvatars = this.getSavedAvatars();

      // Create new avatar object with all the important info
      const newAvatar = {
        id: Date.now(), // Unique ID (like a special sticker number)
        name: avatarData.name || `My Avatar ${savedAvatars.length + 1}`,
        settings: avatarData.settings,
        svg: avatarData.svg,
        timestamp: new Date().toISOString(),
        level: avatarData.level || 1,
        fitnessPoints: avatarData.fitnessPoints || 0,
        tags: avatarData.tags || [], // Like "sporty", "cool", "ninja"
      };

      // Add to the collection
      savedAvatars.push(newAvatar);

      // Save back to storage
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(savedAvatars));

      return newAvatar;
    } catch (error) {
      console.error("Oops! Could not save avatar:", error);
      return null;
    }
  }

  // 📖 Get all saved avatars (like opening your photo album)
  static getSavedAvatars() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Could not load saved avatars:", error);
      return [];
    }
  }

  // 🗑️ Delete an avatar (like removing a photo from album)
  static deleteAvatar(avatarId) {
    try {
      const savedAvatars = this.getSavedAvatars();
      const filtered = savedAvatars.filter((avatar) => avatar.id !== avatarId);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.error("Could not delete avatar:", error);
      return false;
    }
  }

  // ⭐ Set which avatar is currently active (like picking your outfit for today)
  static setCurrentAvatar(avatarData) {
    try {
      localStorage.setItem(this.CURRENT_AVATAR_KEY, JSON.stringify(avatarData));
      return true;
    } catch (error) {
      console.error("Could not set current avatar:", error);
      return false;
    }
  }

  // 👤 Get the currently active avatar
  static getCurrentAvatar() {
    try {
      const current = localStorage.getItem(this.CURRENT_AVATAR_KEY);
      return current ? JSON.parse(current) : null;
    } catch (error) {
      console.error("Could not get current avatar:", error);
      return null;
    }
  }

  // 🎒 Get user's inventory (all the cool stuff they've earned)
  static getUserInventory() {
    try {
      const inventory = localStorage.getItem(this.USER_INVENTORY_KEY);
      return inventory ? JSON.parse(inventory) : this.getDefaultInventory();
    } catch (error) {
      console.error("Could not load inventory:", error);
      return this.getDefaultInventory();
    }
  }

  // 🎁 Add new item to inventory (when kids earn rewards from exercise!)
  static addToInventory(itemId, itemType = "clothing") {
    try {
      const inventory = this.getUserInventory();

      if (!inventory[itemType]) {
        inventory[itemType] = [];
      }

      // Don't add duplicates
      if (!inventory[itemType].includes(itemId)) {
        inventory[itemType].push(itemId);
        localStorage.setItem(
          this.USER_INVENTORY_KEY,
          JSON.stringify(inventory)
        );
        return true;
      }

      return false; // Already had this item
    } catch (error) {
      console.error("Could not add item to inventory:", error);
      return false;
    }
  }

  // 🏅 Check if user owns a specific item
  static hasItem(itemId, itemType = "clothing") {
    const inventory = this.getUserInventory();
    return inventory[itemType] && inventory[itemType].includes(itemId);
  }

  // 🌟 Get default starting inventory (what new users start with)
  static getDefaultInventory() {
    return {
      hair: ["short01", "short02"], // Start with 2 basic hairstyles
      clothing: ["shirt01", "shirt02"], // Start with 2 basic shirts
      accessories: [], // No accessories at start
      backgrounds: ["b6e3f4"], // One basic background
      colors: {
        hair: ["8B4513", "FFD700", "000000"], // 3 basic hair colors
        clothing: ["ff6b6b", "4ecdc4", "45b7d1"], // 3 basic clothing colors
        skin: ["f2d3b1", "ddb98a", "c68642"], // 3 basic skin tones
      },
      achievements: [], // No achievements yet
      level: 1,
      fitnessPoints: 0,
    };
  }

  // 🏆 Award achievement and related rewards
  static unlockAchievement(achievementId, rewards = []) {
    try {
      const inventory = this.getUserInventory();

      // Don't award the same achievement twice
      if (
        inventory.achievements &&
        inventory.achievements.includes(achievementId)
      ) {
        return false;
      }

      // Add achievement
      if (!inventory.achievements) {
        inventory.achievements = [];
      }
      inventory.achievements.push(achievementId);

      // Add reward items
      rewards.forEach((reward) => {
        this.addToInventory(reward.itemId, reward.itemType);
      });

      // Update fitness points and level
      if (inventory.fitnessPoints !== undefined) {
        inventory.fitnessPoints += 10; // Each achievement gives 10 points

        // Level up every 100 points
        const newLevel = Math.floor(inventory.fitnessPoints / 100) + 1;
        if (newLevel > inventory.level) {
          inventory.level = newLevel;
          // Could unlock bonus items here based on level
        }
      }

      localStorage.setItem(this.USER_INVENTORY_KEY, JSON.stringify(inventory));
      return true;
    } catch (error) {
      console.error("Could not unlock achievement:", error);
      return false;
    }
  }

  // 🔄 Export avatar data (for sharing or backup)
  static exportAvatarData(avatarId) {
    const savedAvatars = this.getSavedAvatars();
    const avatar = savedAvatars.find((a) => a.id === avatarId);

    if (avatar) {
      return {
        version: "1.0",
        avatar: avatar,
        exportDate: new Date().toISOString(),
      };
    }

    return null;
  }

  // 📥 Import avatar data (for sharing or restore)
  static importAvatarData(exportData) {
    try {
      if (exportData.version === "1.0" && exportData.avatar) {
        // Give it a new ID to avoid conflicts
        const avatarToImport = {
          ...exportData.avatar,
          id: Date.now(),
          name: `${exportData.avatar.name} (Imported)`,
          timestamp: new Date().toISOString(),
        };

        const savedAvatars = this.getSavedAvatars();
        savedAvatars.push(avatarToImport);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(savedAvatars));

        return avatarToImport;
      }

      return null;
    } catch (error) {
      console.error("Could not import avatar:", error);
      return null;
    }
  }

  // 🧹 Clean up old or unused data (good for maintenance)
  static cleanupStorage() {
    try {
      // Remove avatars older than 6 months (optional)
      const savedAvatars = this.getSavedAvatars();
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const recentAvatars = savedAvatars.filter((avatar) => {
        const avatarDate = new Date(avatar.timestamp);
        return avatarDate > sixMonthsAgo;
      });

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(recentAvatars));

      return {
        removed: savedAvatars.length - recentAvatars.length,
        kept: recentAvatars.length,
      };
    } catch (error) {
      console.error("Could not cleanup storage:", error);
      return null;
    }
  }

  // 📊 Get storage usage stats (helpful for debugging)
  static getStorageStats() {
    try {
      const avatars = this.getSavedAvatars();
      const inventory = this.getUserInventory();
      const current = this.getCurrentAvatar();

      return {
        totalAvatars: avatars.length,
        inventoryItems: {
          hair: inventory.hair?.length || 0,
          clothing: inventory.clothing?.length || 0,
          accessories: inventory.accessories?.length || 0,
          achievements: inventory.achievements?.length || 0,
        },
        level: inventory.level || 1,
        fitnessPoints: inventory.fitnessPoints || 0,
        hasCurrentAvatar: !!current,
        lastModified:
          avatars.length > 0 ? avatars[avatars.length - 1].timestamp : null,
      };
    } catch (error) {
      console.error("Could not get storage stats:", error);
      return null;
    }
  }
}

export default AvatarService;
