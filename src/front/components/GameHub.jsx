import React, { useState, useEffect } from 'react';
import {
    Play,
    Star,
    Trophy,
    Heart,
    Zap,
    Users,
    Camera,
    Music,
    Target,
    Timer,
    Award,
    Map,
    Book,
    Gamepad2,
    Sparkles,
    Crown,
    Gift,
    Lock,
    CheckCircle,
    Clock,
    Filter,
    Search
} from 'lucide-react';

const GameHub = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [user, setUser] = useState({
        level: 5,
        xp: 850,
        unlockedGames: ['dance', 'ninja', 'yoga', 'adventure', 'sports', 'superhero'],
        completedGames: ['dance', 'yoga'],
        favoriteGames: ['dance', 'ninja']
    });

    // All available games in PixelPlay
    const games = [
        {
            id: 'dance',
            name: 'Dance Party',
            emoji: '💃',
            description: 'Dance to fun music and copy the moves! Perfect for getting your groove on.',
            category: 'cardio',
            difficulty: 'Easy',
            duration: '5-10 min',
            xpReward: 50,
            energyRequired: 20,
            color: 'from-pink-400 to-purple-500',
            unlockLevel: 1,
            instructions: 'Follow the dancing character on screen and copy their moves!',
            features: ['Music rhythm', 'Dance moves', 'Fun choreography'],
            playerCount: '1-4 players'
        },
        {
            id: 'ninja',
            name: 'Ninja Training',
            emoji: '🥷',
            description: 'Jump, duck, and punch like a ninja! Master the ancient arts of fitness.',
            category: 'strength',
            difficulty: 'Medium',
            duration: '8-12 min',
            xpReward: 75,
            energyRequired: 30,
            color: 'from-gray-600 to-blue-600',
            unlockLevel: 3,
            instructions: 'Do ninja moves when you see the symbols: Jump for ⬆️, Duck for ⬇️, Punch for 👊',
            features: ['Reaction training', 'Combat moves', 'Stealth exercises'],
            playerCount: '1-2 players'
        },
        {
            id: 'yoga',
            name: 'Animal Yoga',
            emoji: '🧘',
            description: 'Stretch like different animals! Calm your mind and strengthen your body.',
            category: 'flexibility',
            difficulty: 'Easy',
            duration: '10-15 min',
            xpReward: 60,
            energyRequired: 15,
            color: 'from-green-400 to-teal-500',
            unlockLevel: 1,
            instructions: 'Copy the animal poses: Cat stretch, Dog pose, Frog jumps!',
            features: ['Animal poses', 'Breathing exercises', 'Mindfulness'],
            playerCount: '1+ players'
        },
        {
            id: 'adventure',
            name: 'Quest Adventure',
            emoji: '🗺️',
            description: 'Go on epic fitness quests! Explore magical worlds through exercise.',
            category: 'adventure',
            difficulty: 'Medium',
            duration: '15-20 min',
            xpReward: 100,
            energyRequired: 40,
            color: 'from-orange-400 to-red-500',
            unlockLevel: 4,
            instructions: 'Complete physical challenges to progress through the adventure map!',
            features: ['Story mode', 'Multiple levels', 'Treasure rewards'],
            playerCount: '1-6 players'
        },
        {
            id: 'sports',
            name: 'Mini Sports',
            emoji: '⚽',
            description: 'Play soccer, basketball, and more! Compete in fun mini sporting events.',
            category: 'sports',
            difficulty: 'Medium',
            duration: '8-15 min',
            xpReward: 80,
            energyRequired: 35,
            color: 'from-blue-400 to-green-500',
            unlockLevel: 2,
            instructions: 'Use your whole body to play different sports games!',
            features: ['Multiple sports', 'Team play', 'Tournaments'],
            playerCount: '2-8 players'
        },
        {
            id: 'superhero',
            name: 'Superhero Training',
            emoji: '🦸',
            description: 'Train like your favorite superheroes! Develop super strength and speed.',
            category: 'strength',
            difficulty: 'Hard',
            duration: '12-18 min',
            xpReward: 120,
            energyRequired: 50,
            color: 'from-red-500 to-yellow-500',
            unlockLevel: 6,
            instructions: 'Complete superhero training exercises to unlock your powers!',
            features: ['Hero workouts', 'Power challenges', 'Cape physics'],
            playerCount: '1-4 players'
        },
        {
            id: 'space',
            name: 'Space Explorer',
            emoji: '🚀',
            description: 'Exercise like an astronaut in space! Zero gravity workouts await.',
            category: 'cardio',
            difficulty: 'Medium',
            duration: '10-15 min',
            xpReward: 90,
            energyRequired: 30,
            color: 'from-purple-600 to-blue-800',
            unlockLevel: 8,
            instructions: 'Move like you\'re floating in space while doing astronaut exercises!',
            features: ['Zero gravity sim', 'Space missions', 'Planet exploration'],
            playerCount: '1-6 players'
        },
        {
            id: 'pirate',
            name: 'Pirate Adventure',
            emoji: '🏴‍☠️',
            description: 'Sail the seven seas and find treasure through swashbuckling workouts!',
            category: 'adventure',
            difficulty: 'Hard',
            duration: '15-25 min',
            xpReward: 150,
            energyRequired: 45,
            color: 'from-amber-600 to-orange-700',
            unlockLevel: 10,
            instructions: 'Complete pirate challenges to find buried treasure!',
            features: ['Ship battles', 'Treasure hunting', 'Sword fighting'],
            playerCount: '2-8 players'
        },
        {
            id: 'magic',
            name: 'Magic Academy',
            emoji: '🪄',
            description: 'Learn magical spells through movement! Cast fitness spells and brew potions.',
            category: 'flexibility',
            difficulty: 'Easy',
            duration: '8-12 min',
            xpReward: 70,
            energyRequired: 25,
            color: 'from-violet-500 to-purple-700',
            unlockLevel: 5,
            instructions: 'Use gestures and movements to cast magical fitness spells!',
            features: ['Spell casting', 'Potion brewing', 'Magic duels'],
            playerCount: '1-4 players'
        },
        {
            id: 'racing',
            name: 'Turbo Racing',
            emoji: '🏎️',
            description: 'Race through obstacle courses! Speed and agility training disguised as fun.',
            category: 'cardio',
            difficulty: 'Hard',
            duration: '6-10 min',
            xpReward: 85,
            energyRequired: 40,
            color: 'from-red-400 to-pink-500',
            unlockLevel: 7,
            instructions: 'Run, jump, and dodge obstacles to win the race!',
            features: ['Racing circuits', 'Time trials', 'Speed boosts'],
            playerCount: '2-8 players'
        },
        {
            id: 'detective',
            name: 'Fitness Detective',
            emoji: '🕵️',
            description: 'Solve mysteries through physical clues! Exercise your body and brain.',
            category: 'mixed',
            difficulty: 'Medium',
            duration: '12-20 min',
            xpReward: 95,
            energyRequired: 35,
            color: 'from-gray-500 to-blue-600',
            unlockLevel: 9,
            instructions: 'Solve physical puzzles and follow exercise clues to crack the case!',
            features: ['Mystery solving', 'Physical puzzles', 'Detective tools'],
            playerCount: '1-6 players'
        },
        {
            id: 'rhythm',
            name: 'Rhythm Master',
            emoji: '🥁',
            description: 'Create beats with your body! Musical fitness that gets your heart pumping.',
            category: 'cardio',
            difficulty: 'Medium',
            duration: '5-12 min',
            xpReward: 75,
            energyRequired: 30,
            color: 'from-cyan-400 to-blue-500',
            unlockLevel: 4,
            instructions: 'Use your body to create rhythm and beats in time with the music!',
            features: ['Beat creation', 'Musical timing', 'Rhythm challenges'],
            playerCount: '1-8 players'
        }
    ];

    const categories = [
        { id: 'all', name: 'All Games', icon: Gamepad2, color: 'bg-purple-500' },
        { id: 'cardio', name: 'Cardio Fun', icon: Heart, color: 'bg-red-500' },
        { id: 'strength', name: 'Get Strong', icon: Zap, color: 'bg-yellow-500' },
        { id: 'flexibility', name: 'Stretch Time', icon: Sparkles, color: 'bg-green-500' },
        { id: 'sports', name: 'Sports Zone', icon: Trophy, color: 'bg-blue-500' },
        { id: 'adventure', name: 'Adventures', icon: Map, color: 'bg-orange-500' },
        { id: 'mixed', name: 'Mix It Up', icon: Target, color: 'bg-pink-500' }
    ];

    const difficulties = [
        { id: 'all', name: 'All Levels', color: 'bg-gray-500' },
        { id: 'Easy', name: 'Easy Peasy', color: 'bg-green-400' },
        { id: 'Medium', name: 'Just Right', color: 'bg-yellow-400' },
        { id: 'Hard', name: 'Challenge Me!', color: 'bg-red-400' }
    ];

    // Filter games based on selected criteria
    const filteredGames = games.filter(game => {
        const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === 'all' || game.difficulty === selectedDifficulty;
        const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesDifficulty && matchesSearch;
    });

    const isGameUnlocked = (game) => user.level >= game.unlockLevel;
    const isGameCompleted = (game) => user.completedGames.includes(game.id);
    const isGameFavorite = (game) => user.favoriteGames.includes(game.id);

    const handlePlayGame = (gameId) => {
        console.log(`Starting game: ${gameId}`);
        // Here you would navigate to the actual game or start the game session
    };

    const GameCard = ({ game }) => {
        const unlocked = isGameUnlocked(game);
        const completed = isGameCompleted(game);
        const favorite = isGameFavorite(game);

        return (
            <div className={`
        relative group rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl
        ${unlocked
                    ? `bg-gradient-to-br ${game.color} text-white cursor-pointer`
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
      `}>
                {/* Lock indicator for locked games */}
                {!unlocked && (
                    <div className="absolute top-4 right-4 bg-gray-600 text-white p-2 rounded-full">
                        <Lock className="w-4 h-4" />
                    </div>
                )}

                {/* Favorite indicator */}
                {favorite && unlocked && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-white p-2 rounded-full">
                        <Star className="w-4 h-4 fill-current" />
                    </div>
                )}

                {/* Completed indicator */}
                {completed && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white p-2 rounded-full">
                        <CheckCircle className="w-4 h-4" />
                    </div>
                )}

                {/* Game emoji icon */}
                <div className="text-6xl mb-4 text-center">
                    {game.emoji}
                </div>

                {/* Game info */}
                <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold mb-2">{game.name}</h3>
                    <p className={`text-sm mb-3 ${unlocked ? 'text-white/90' : 'text-gray-600'}`}>
                        {game.description}
                    </p>
                </div>

                {/* Game stats */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                            <Timer className="w-4 h-4" />
                            <span>{game.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Zap className="w-4 h-4" />
                            <span>{game.xpReward} XP</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-1">
                            <Target className="w-4 h-4" />
                            <span>{game.difficulty}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{game.playerCount}</span>
                        </div>
                    </div>
                </div>

                {/* Unlock requirement for locked games */}
                {!unlocked && (
                    <div className="text-center text-sm bg-gray-600 text-white p-2 rounded-lg mb-4">
                        🔒 Unlock at Level {game.unlockLevel}
                    </div>
                )}

                {/* Play button */}
                <button
                    onClick={() => unlocked && handlePlayGame(game.id)}
                    disabled={!unlocked}
                    className={`
            w-full py-3 px-6 rounded-xl font-bold text-lg transition-all duration-200
            ${unlocked
                            ? 'bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm'
                            : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                        }
          `}
                >
                    {unlocked ? (
                        <div className="flex items-center justify-center space-x-2">
                            <Play className="w-5 h-5" />
                            <span>Play Now!</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center space-x-2">
                            <Lock className="w-5 h-5" />
                            <span>Locked</span>
                        </div>
                    )}
                </button>

                {/* Game features preview on hover */}
                <div className="absolute inset-0 bg-black/80 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-center">
                    <h4 className="text-white font-bold text-lg mb-3">Game Features:</h4>
                    <ul className="text-white/90 space-y-1">
                        {game.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>{feature}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 text-white/80 text-sm">
                        <p className="font-semibold">How to play:</p>
                        <p>{game.instructions}</p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
                    <div className="text-center mb-8">
                        <h1 className="text-5xl font-bold text-gray-800 mb-3 flex items-center justify-center">
                            <Gamepad2 className="w-12 h-12 mr-4 text-purple-600" />
                            PixelPlay Game Hub
                        </h1>
                        <p className="text-xl text-gray-600">Choose your fitness adventure!</p>
                    </div>

                    {/* User stats */}
                    <div className="flex justify-center space-x-8 mb-8">
                        <div className="bg-purple-100 px-6 py-3 rounded-2xl">
                            <div className="text-2xl font-bold text-purple-800">Level {user.level}</div>
                            <div className="text-purple-600">Current Level</div>
                        </div>
                        <div className="bg-blue-100 px-6 py-3 rounded-2xl">
                            <div className="text-2xl font-bold text-blue-800">{user.xp} XP</div>
                            <div className="text-blue-600">Total Experience</div>
                        </div>
                        <div className="bg-green-100 px-6 py-3 rounded-2xl">
                            <div className="text-2xl font-bold text-green-800">{user.unlockedGames.length}</div>
                            <div className="text-green-600">Games Unlocked</div>
                        </div>
                    </div>

                    {/* Search and filters */}
                    <div className="space-y-6">
                        {/* Search bar */}
                        <div className="relative max-w-md mx-auto">
                            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search for games..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-2xl focus:border-purple-500 focus:outline-none text-lg"
                            />
                        </div>

                        {/* Category filters */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">Game Categories</h3>
                            <div className="flex flex-wrap justify-center gap-3">
                                {categories.map(category => (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`
                      px-4 py-2 rounded-2xl font-semibold transition-all duration-200 flex items-center space-x-2
                      ${selectedCategory === category.id
                                                ? `${category.color} text-white shadow-lg transform scale-105`
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }
                    `}
                                    >
                                        <category.icon className="w-4 h-4" />
                                        <span>{category.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty filters */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">Difficulty Level</h3>
                            <div className="flex justify-center gap-3">
                                {difficulties.map(difficulty => (
                                    <button
                                        key={difficulty.id}
                                        onClick={() => setSelectedDifficulty(difficulty.id)}
                                        className={`
                      px-6 py-2 rounded-2xl font-semibold transition-all duration-200
                      ${selectedDifficulty === difficulty.id
                                                ? `${difficulty.color} text-white shadow-lg transform scale-105`
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }
                    `}
                                    >
                                        {difficulty.name}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Games grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredGames.map(game => (
                        <GameCard key={game.id} game={game} />
                    ))}
                </div>

                {/* No games found message */}
                {filteredGames.length === 0 && (
                    <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
                        <Gamepad2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-600 mb-2">No games found!</h3>
                        <p className="text-gray-500">Try adjusting your search or filters to find more games.</p>
                    </div>
                )}

                {/* Footer with motivational message */}
                <div className="bg-white rounded-3xl shadow-2xl p-8 mt-8 text-center">
                    <div className="text-4xl mb-4">🎮✨</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Keep Playing, Keep Growing!</h3>
                    <p className="text-gray-600">Every game makes you stronger, faster, and healthier. What adventure will you choose today?</p>
                </div>
            </div>
        </div>
    );
};

export default GameHub;