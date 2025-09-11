import React, { useState } from 'react';
import { Package, Star, Crown, Shirt, Award, Zap, Heart, Lock, ShoppingBag, Search, Grid, List } from 'lucide-react';


const InventoryPage = () => {
  // Simple state management - like keeping track of what's happening
  const [activeTab, setActiveTab] = useState('owned');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - pretend information for testing
  const userStats = { level: 8, xp: 450 };

  const inventory = [
    {
      id: 1,
      name: "Superhero Cape",
      category: "clothing",
      rarity: "epic",
      icon: "🦸‍♂️",
      isEquipped: true,
      isFavorite: true
    },
    {
      id: 2,
      name: "Golden Sneakers",
      category: "clothing",
      rarity: "legendary",
      icon: "👟",
      isEquipped: false,
      isFavorite: false
    },
    {
      id: 3,
      name: "Fitness Tracker",
      category: "accessory",
      rarity: "rare",
      icon: "⌚",
      isEquipped: true,
      isFavorite: true
    }
  ];

  const shopItems = [
    {
      id: 4,
      name: "Power Gloves",
      category: "clothing",
      rarity: "rare",
      icon: "🧤",
      xpCost: 150,
      levelRequired: 5,
      canAfford: true
    },
    {
      id: 5,
      name: "Dragon Wings",
      category: "clothing",
      rarity: "legendary",
      icon: "🐉",
      xpCost: 500,
      levelRequired: 10,
      canAfford: false
    }
  ];

  const achievements = [
    {
      id: 1,
      name: "First Steps",
      description: "Complete your first workout",
      icon: "🚀",
      isCompleted: true,
      progress: 1,
      maxProgress: 1
    },
    {
      id: 2,
      name: "Workout Warrior",
      description: "Complete 10 workouts",
      icon: "💪",
      isCompleted: false,
      progress: 7,
      maxProgress: 10
    }
  ];

  // Helper functions - like little assistants that do specific jobs
  const categories = [
    { id: 'all', name: 'All Items', icon: Package },
    { id: 'clothing', name: 'Clothing', icon: Shirt },
    { id: 'accessory', name: 'Accessories', icon: Crown }
  ];

  const getRarityStyle = (rarity) => {
    const styles = {
      common: 'border-gray-300 bg-gray-50',
      rare: 'border-blue-300 bg-blue-50',
      epic: 'border-purple-300 bg-purple-50',
      legendary: 'border-yellow-300 bg-yellow-50'
    };
    return styles[rarity] || styles.common;
  };

  const filterItems = (items) => {
    return items.filter(item => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  };

  // Component for displaying individual items
  const ItemCard = ({ item, isShopItem = false }) => (
    <div className={`p-4 rounded-xl border-2 transition-all hover:shadow-lg ${getRarityStyle(item.rarity)}`}>
      {/* Rarity badge */}
      <div className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold bg-white/80">
        {item.rarity}
      </div>

      {/* Item icon */}
      <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-3xl bg-white/50">
        {item.icon}
      </div>

      {/* Item info */}
      <div className="text-center">
        <h3 className="font-bold text-gray-800 mb-2">{item.name}</h3>

        {isShopItem ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2 text-sm">
              <Zap className="w-4 h-4 text-yellow-500" />
              <span>{item.xpCost} XP</span>
            </div>
            {item.levelRequired > 1 && (
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <Crown className="w-4 h-4" />
                <span>Level {item.levelRequired}</span>
              </div>
            )}
            <button
              className={`w-full py-2 px-4 rounded-lg font-semibold ${item.canAfford
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              disabled={!item.canAfford}
            >
              {item.canAfford ? '🛒 Buy' : '🔒 Locked'}
            </button>
          </div>
        ) : (
          <div className="flex justify-center space-x-2">
            <button
              className={`p-2 rounded-lg ${item.isFavorite ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}
            >
              <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              className={`px-3 py-2 rounded-lg text-sm font-semibold ${item.isEquipped
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
                }`}
            >
              {item.isEquipped ? '✅ Equipped' : '📦 Equip'}
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Component for achievements
  const AchievementCard = ({ achievement }) => (
    <div className={`p-4 rounded-xl border-2 ${achievement.isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'}`}>
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${achievement.isCompleted ? 'bg-green-200' : 'bg-gray-200'}`}>
          {achievement.icon}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800">{achievement.name}</h3>
          <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
          {!achievement.isCompleted && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
              />
            </div>
          )}
          <div className="text-xs text-gray-500 mt-1">
            {achievement.isCompleted ? '🎉 Completed!' : `${achievement.progress}/${achievement.maxProgress}`}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

          {/* Header - The top part with title and user info */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center">
                  <Package className="w-8 h-8 mr-3" />
                  My Collection
                </h1>
                <p className="text-purple-100 mt-1">Check out all your awesome gear!</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">Level {userStats.level}</div>
                <div className="text-purple-200 flex items-center">
                  <Zap className="w-4 h-4 mr-1" />
                  {userStats.xp} XP
                </div>
              </div>
            </div>
          </div>

          {/* Navigation tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'owned', name: 'My Items', icon: Package },
                { id: 'shop', name: 'Shop', icon: ShoppingBag },
                { id: 'achievements', name: 'Achievements', icon: Award }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Filters - Only show for items and shop */}
          {(activeTab === 'owned' || activeTab === 'shop') && (
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-wrap items-center justify-between gap-4">

                {/* Category buttons */}
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 ${selectedCategory === category.id
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      <category.icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </button>
                  ))}
                </div>

                {/* Search box */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main content area */}
          <div className="p-6">

            {/* My Items tab */}
            {activeTab === 'owned' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filterItems(inventory).map(item => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Shop tab */}
            {activeTab === 'shop' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filterItems(shopItems).map(item => (
                  <ItemCard key={item.id} item={item} isShopItem={true} />
                ))}
              </div>
            )}

            {/* Achievements tab */}
            {activeTab === 'achievements' && (
              <div className="space-y-4">
                {achievements.map(achievement => (
                  <AchievementCard key={achievement.id} achievement={achievement} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;