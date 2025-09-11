import React, { useState, useEffect } from 'react';
import {
    Package,
    Star,
    Crown,
    Shirt,
    Award,
    Zap,
    Heart,
    Lock,
    ShoppingBag,
    Filter,
    Search,
    Grid,
    List
} from 'lucide-react';

const InventoryPage = () => {
    const [activeTab, setActiveTab] = useState('owned');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [searchTerm, setSearchTerm] = useState('');
    const [inventory, setInventory] = useState([]);
    const [availableItems, setAvailableItems] = useState({});
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState({ level: 1, xp: 0 });

    // Mock data for demonstration
    useEffect(() => {
        // Simulate API calls
        setTimeout(() => {
            setInventory([
                {
                    id: 1,
                    item: {
                        id: 1,
                        name: "Superhero Cape",
                        category: "clothing",
                        subcategory: "cape",
                        rarity: "epic",
                        color: "#DC2626",
                        icon: "🦸‍♂️"
                    },
                    is_equipped: true,
                    is_favorite: true,
                    acquired_at: "2025-09-01"
                },
                {
                    id: 2,
                    item: {
                        id: 2,
                        name: "Golden Sneakers",
                        category: "clothing",
                        subcategory: "shoes",
                        rarity: "legendary",
                        color: "#FFD700",
                        icon: "👟"
                    },
                    is_equipped: false,
                    is_favorite: false,
                    acquired_at: "2025-09-05"
                },
                {
                    id: 3,
                    item: {
                        id: 3,
                        name: "Fitness Tracker",
                        category: "accessory",
                        subcategory: "watch",
                        rarity: "rare",
                        color: "#059669",
                        icon: "⌚"
                    },
                    is_equipped: true,
                    is_favorite: true,
                    acquired_at: "2025-09-03"
                }
            ]);

            setAvailableItems({
                affordable: [
                    {
                        id: 4,
                        name: "Power Gloves",
                        category: "clothing",
                        subcategory: "gloves",
                        rarity: "rare",
                        xp_cost: 150,
                        level_required: 5,
                        color: "#7C3AED",
                        icon: "🧤",
                        can_afford: true
                    }
                ],
                locked: [
                    {
                        id: 5,
                        name: "Dragon Wings",
                        category: "clothing",
                        subcategory: "wings",
                        rarity: "legendary",
                        xp_cost: 500,
                        level_required: 10,
                        color: "#EF4444",
                        icon: "🐉",
                        can_afford: false
                    }
                ]
            });

            setAchievements([
                {
                    id: 1,
                    name: "First Steps",
                    description: "Complete your first workout",
                    category: "fitness",
                    icon: "🚀",
                    is_completed: true,
                    user_progress: 1,
                    requirement_value: 1,
                    earned_at: "2025-09-01"
                },
                {
                    id: 2,
                    name: "Workout Warrior",
                    description: "Complete 10 workouts",
                    category: "fitness",
                    icon: "💪",
                    is_completed: false,
                    user_progress: 7,
                    requirement_value: 10
                }
            ]);

            setUserStats({ level: 8, xp: 450 });
            setLoading(false);
        }, 1000);
    }, []);

    const categories = [
        { id: 'all', name: 'All Items', icon: Package },
        { id: 'clothing', name: 'Clothing', icon: Shirt },
        { id: 'accessory', name: 'Accessories', icon: Crown },
        { id: 'badge', name: 'Badges', icon: Award },
        { id: 'power-up', name: 'Power-ups', icon: Zap }
    ];

    const rarityColors = {
        common: 'border-gray-300 bg-gray-50',
        rare: 'border-blue-300 bg-blue-50',
        epic: 'border-purple-300 bg-purple-50',
        legendary: 'border-yellow-300 bg-yellow-50'
    };

    const filterItems = (items) => {
        return items.filter(item => {
            const itemData = item.item || item;
            const matchesCategory = selectedCategory === 'all' || itemData.category === selectedCategory;
            const matchesSearch = itemData.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    };

    const handleEquipToggle = async (inventoryId) => {
        // API call to toggle equip status
        console.log('Toggle equip for item:', inventoryId);
    };

    const handleFavoriteToggle = async (inventoryId) => {
        // API call to toggle favorite status
        console.log('Toggle favorite for item:', inventoryId);
    };

    const handlePurchase = async (itemId) => {
        // API call to purchase item
        console.log('Purchase item:', itemId);
    };

    const InventoryItemCard = ({ item, showActions = true }) => {
        const itemData = item.item || item;
        const isOwned = item.is_equipped !== undefined;

        return (
            <div className={`
        relative p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg
        ${rarityColors[itemData.rarity] || rarityColors.common}
        ${viewMode === 'list' ? 'flex items-center space-x-4' : ''}
      `}>
                {/* Rarity indicator */}
                <div className={`
          absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold uppercase
          ${itemData.rarity === 'legendary' ? 'bg-yellow-200 text-yellow-800' : ''}
          ${itemData.rarity === 'epic' ? 'bg-purple-200 text-purple-800' : ''}
          ${itemData.rarity === 'rare' ? 'bg-blue-200 text-blue-800' : ''}
          ${itemData.rarity === 'common' ? 'bg-gray-200 text-gray-800' : ''}
        `}>
                    {itemData.rarity}
                </div>

                {/* Item icon/image */}
                <div className={`
          ${viewMode === 'grid' ? 'w-16 h-16 mx-auto mb-3' : 'w-12 h-12 flex-shrink-0'}
          rounded-full flex items-center justify-center text-2xl
          ${viewMode === 'grid' ? '' : 'mr-4'}
        `} style={{ backgroundColor: itemData.color + '20' }}>
                    {itemData.icon || '📦'}
                </div>

                {/* Item details */}
                <div className={`${viewMode === 'grid' ? 'text-center' : 'flex-1'}`}>
                    <h3 className="font-bold text-gray-800 mb-1">{itemData.name}</h3>
                    {itemData.description && (
                        <p className="text-sm text-gray-600 mb-2">{itemData.description}</p>
                    )}

                    {!isOwned && itemData.xp_cost > 0 && (
                        <div className="flex items-center justify-center space-x-2 text-sm">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span className="font-semibold">{itemData.xp_cost} XP</span>
                        </div>
                    )}

                    {!isOwned && itemData.level_required > 1 && (
                        <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                            <Crown className="w-4 h-4" />
                            <span>Level {itemData.level_required}</span>
                        </div>
                    )}
                </div>

                {/* Action buttons */}
                {showActions && isOwned && (
                    <div className={`${viewMode === 'grid' ? 'mt-3' : 'ml-4'} flex space-x-2`}>
                        <button
                            onClick={() => handleFavoriteToggle(item.id)}
                            className={`p-2 rounded-lg transition-colors ${item.is_favorite
                                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${item.is_favorite ? 'fill-current' : ''}`} />
                        </button>
                        <button
                            onClick={() => handleEquipToggle(item.id)}
                            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${item.is_equipped
                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                }`}
                        >
                            {item.is_equipped ? 'Equipped' : 'Equip'}
                        </button>
                    </div>
                )}

                {/* Purchase button for unowned items */}
                {showActions && !isOwned && (
                    <div className={`${viewMode === 'grid' ? 'mt-3' : 'ml-4'}`}>
                        {itemData.can_afford ? (
                            <button
                                onClick={() => handlePurchase(itemData.id)}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-semibold"
                            >
                                <ShoppingBag className="w-4 h-4 inline mr-1" />
                                Buy
                            </button>
                        ) : (
                            <div className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg text-sm font-semibold flex items-center">
                                <Lock className="w-4 h-4 mr-1" />
                                Locked
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const AchievementCard = ({ achievement }) => {
        const progressPercentage = (achievement.user_progress / achievement.requirement_value) * 100;

        return (
            <div className={`
        p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg
        ${achievement.is_completed
                    ? 'border-green-300 bg-green-50'
                    : 'border-gray-300 bg-gray-50'
                }
      `}>
                <div className="flex items-center space-x-3">
                    <div className={`
            w-12 h-12 rounded-full flex items-center justify-center text-2xl
            ${achievement.is_completed ? 'bg-green-200' : 'bg-gray-200'}
          `}>
                        {achievement.icon}
                    </div>

                    <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{achievement.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>

                        {!achievement.is_completed && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        )}

                        <div className="text-xs text-gray-500 mt-1">
                            {achievement.is_completed
                                ? `Completed on ${new Date(achievement.earned_at).toLocaleDateString()}`
                                : `${achievement.user_progress}/${achievement.requirement_value}`
                            }
                        </div>
                    </div>

                    {achievement.is_completed && (
                        <Award className="w-6 h-6 text-green-600" />
                    )}
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
                <div className="max-w-6xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-2xl p-8">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading your awesome collection...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
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

                    {/* Tabs */}
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
                                    className={`
                    py-4 px-2 border-b-2 font-medium text-sm flex items-center space-x-2
                    ${activeTab === tab.id
                                            ? 'border-purple-500 text-purple-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                        }
                  `}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    <span>{tab.name}</span>
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Filters and Search */}
                    {(activeTab === 'owned' || activeTab === 'shop') && (
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                {/* Category filters */}
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(category => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`
                        px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2
                        ${selectedCategory === category.id
                                                    ? 'bg-purple-100 text-purple-700'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                }
                      `}
                                        >
                                            <category.icon className="w-4 h-4" />
                                            <span>{category.name}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Search and view controls */}
                                <div className="flex items-center space-x-4">
                                    <div className="relative">
                                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search items..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="flex border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}`}
                                        >
                                            <Grid className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-600'}`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        {/* My Items Tab */}
                        {activeTab === 'owned' && (
                            <div>
                                {filterItems(inventory).length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No items found</h3>
                                        <p className="text-gray-500">Try adjusting your search or filters!</p>
                                    </div>
                                ) : (
                                    <div className={`
                    ${viewMode === 'grid'
                                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                            : 'space-y-4'
                                        }
                  `}>
                                        {filterItems(inventory).map(item => (
                                            <InventoryItemCard key={item.id} item={item} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Shop Tab */}
                        {activeTab === 'shop' && (
                            <div className="space-y-8">
                                {/* Affordable items */}
                                {availableItems.affordable && availableItems.affordable.length > 0 && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                            <ShoppingBag className="w-6 h-6 mr-2 text-green-600" />
                                            Available Now
                                        </h2>
                                        <div className={`
                      ${viewMode === 'grid'
                                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                                : 'space-y-4'
                                            }
                    `}>
                                            {filterItems(availableItems.affordable).map(item => (
                                                <InventoryItemCard key={item.id} item={item} />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Locked items */}
                                {availableItems.locked && availableItems.locked.length > 0 && (
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                            <Lock className="w-6 h-6 mr-2 text-gray-500" />
                                            Coming Soon
                                        </h2>
                                        <div className={`
                      ${viewMode === 'grid'
                                                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                                                : 'space-y-4'
                                            }
                    `}>
                                            {filterItems(availableItems.locked).map(item => (
                                                <InventoryItemCard key={item.id} item={item} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Achievements Tab */}
                        {activeTab === 'achievements' && (
                            <div className="space-y-4">
                                {achievements.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No achievements yet</h3>
                                        <p className="text-gray-500">Start working out to earn your first achievement!</p>
                                    </div>
                                ) : (
                                    achievements.map(achievement => (
                                        <AchievementCard key={achievement.id} achievement={achievement} />
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryPage;