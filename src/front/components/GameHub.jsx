import React, { useState, useEffect, useCallback } from 'react';
import {
    Play,
    Pause,
    RotateCcw,
    Star,
    Trophy,
    Heart,
    Zap,
    Users,
    Target,
    Timer,
    Gamepad2,
    Sparkles,
    Lock,
    CheckCircle,
    Search,
    ArrowLeft,
    Volume2,
    VolumeX,
    UserCircle,
    BookOpen,
    Palette,
    Award,
    BarChart3,
    Calendar
} from 'lucide-react';

const PixelPlayGameHub = () => {
    // Game state management
    const [selectedGame, setSelectedGame] = useState(null);
    const [gameState, setGameState] = useState('menu'); // menu, playing, paused, completed
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [score, setScore] = useState(0);
    const [streakCount, setStreakCount] = useState(0);
    
    // UI state
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [showStoryCreator, setShowStoryCreator] = useState(false);
    const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [motionDetection, setMotionDetection] = useState(true);
    
    // Motion and audio
    const [motionData, setMotionData] = useState({ x: 0, y: 0, z: 0 });
    const [isListening, setIsListening] = useState(false);
    
    // Enhanced user state
    const [user] = useState({
        id: 'user123',
        name: 'Alex',
        avatar: '🧑‍🚀',
        level: 5,
        xp: 850,
        totalGamesPlayed: 23,
        weeklyStreak: 3,
        favoriteCategory: 'adventure',
        unlockedGames: ['dance', 'ninja', 'yoga', 'adventure', 'sports', 'superhero', 'lightning-ladders', 'shadow-punch', 'magic', 'rhythm'],
        completedGames: ['dance', 'yoga', 'lightning-ladders'],
        favoriteGames: ['dance', 'ninja', 'adventure'],
        achievements: ['first_game', 'week_streak', 'adventure_master'],
        customAvatars: ['🧑‍🚀', '🧙‍♂️', '🦸‍♀️'],
        stories: ['My Space Adventure', 'Ninja Training Day']
    });

    // Enhanced games database combining both game selection and actual gameplay
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
            playerCount: '1-4 players',
            // Gameplay data
            gameDuration: 300, // 5 minutes in seconds
            exercises: [
                { name: 'Dance Moves', duration: 30, instruction: 'Follow the beat and dance!' },
                { name: 'Spin Move', duration: 20, instruction: 'Spin around with the music!' },
                { name: 'Jump Dance', duration: 25, instruction: 'Jump to the rhythm!' }
            ],
            visualStyle: 'dance',
            motionDetection: true,
            audioSync: true,
            safetyFeatures: ['warm-up', 'cool-down', 'hydration-reminders']
        },
        {
            id: 'lightning-ladders',
            name: 'Lightning Ladders',
            emoji: '⚡',
            description: 'Sprint in place to climb the lightning ladder and reach the sky!',
            category: 'cardio',
            difficulty: 'Medium',
            duration: '6-8 min',
            xpReward: 75,
            energyRequired: 30,
            color: 'from-yellow-400 to-orange-500',
            unlockLevel: 3,
            instructions: 'Sprint as fast as you can to climb each lightning bolt!',
            features: ['Speed training', 'Interval bursts', 'Lightning effects'],
            playerCount: '1-6 players',
            // Gameplay data
            gameDuration: 420, // 7 minutes
            exercises: [
                { name: 'Sprint in Place', duration: 20, rest: 10, reps: 10, instruction: 'Sprint as fast as you can!' }
            ],
            visualStyle: 'ladder',
            motionDetection: true,
            safetyFeatures: ['intensity-monitoring', 'automatic-rest']
        },
        {
            id: 'shadow-punch',
            name: 'Shadow Boxing',
            emoji: '👊',
            description: 'Punch targets in rhythm to defeat shadow opponents!',
            category: 'strength',
            difficulty: 'Medium',
            duration: '7-10 min',
            xpReward: 60,
            energyRequired: 35,
            color: 'from-red-500 to-pink-500',
            unlockLevel: 4,
            instructions: 'Punch left and right targets to the beat of the music!',
            features: ['Rhythm boxing', 'Target practice', 'Shadow opponents'],
            playerCount: '1-4 players',
            // Gameplay data
            gameDuration: 480,
            exercises: [
                { name: 'Left Punch', duration: 2, instruction: 'Punch left target!' },
                { name: 'Right Punch', duration: 2, instruction: 'Punch right target!' }
            ],
            visualStyle: 'targets',
            motionDetection: true,
            audioSync: true,
            safetyFeatures: ['proper-form-tips', 'wrist-safety']
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
            playerCount: '1-2 players',
            // Gameplay data
            gameDuration: 600,
            exercises: [
                { name: 'Jump', duration: 1, instruction: 'Jump high!' },
                { name: 'Duck', duration: 1, instruction: 'Duck low!' },
                { name: 'Punch', duration: 1, instruction: 'Punch forward!' }
            ],
            visualStyle: 'ninja',
            motionDetection: true,
            reactionBased: true,
            safetyFeatures: ['form-guidance', 'rest-periods']
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
            playerCount: '1+ players',
            // Gameplay data
            gameDuration: 900,
            exercises: [
                { name: 'Cat Stretch', duration: 30, instruction: 'Arch your back like a cat' },
                { name: 'Dog Stretch', duration: 30, instruction: 'Downward dog pose' },
                { name: 'Frog Stretch', duration: 30, instruction: 'Squat low like a frog' }
            ],
            visualStyle: 'animals',
            mindfulness: true,
            safetyFeatures: ['breathing-guidance', 'relaxation-focus']
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
            playerCount: '1-6 players',
            // Gameplay data
            gameDuration: 1200,
            exercises: [
                { name: 'Quest Challenge 1', duration: 60, instruction: 'Complete the first quest!' },
                { name: 'Quest Challenge 2', duration: 60, instruction: 'Discover hidden treasure!' },
                { name: 'Final Boss', duration: 90, instruction: 'Defeat the final boss!' }
            ],
            visualStyle: 'quest',
            storyMode: true,
            safetyFeatures: ['adventure-briefing', 'progress-pacing']
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
            playerCount: '1-4 players',
            // Gameplay data
            gameDuration: 900,
            exercises: [
                { name: 'Super Strength', duration: 45, instruction: 'Build your super strength!' },
                { name: 'Super Speed', duration: 30, instruction: 'Run like the wind!' },
                { name: 'Flying Practice', duration: 60, instruction: 'Practice your flying moves!' }
            ],
            visualStyle: 'superhero',
            motionDetection: true,
            safetyFeatures: ['power-control', 'safety-first']
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
            playerCount: '1-4 players',
            // Gameplay data
            gameDuration: 600,
            exercises: [
                { name: 'Spell Casting', duration: 45, instruction: 'Cast your magical spells!' },
                { name: 'Potion Mixing', duration: 30, instruction: 'Mix the magical potion!' },
                { name: 'Magic Duel', duration: 60, instruction: 'Defeat the dark wizard!' }
            ],
            visualStyle: 'magic',
            motionDetection: true,
            safetyFeatures: ['gentle-movements', 'imagination-focus']
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
            playerCount: '1-8 players',
            // Gameplay data
            gameDuration: 420,
            exercises: [
                { name: 'Beat Creation', duration: 60, instruction: 'Create the perfect beat!' },
                { name: 'Rhythm Challenge', duration: 45, instruction: 'Match the rhythm!' }
            ],
            visualStyle: 'rhythm',
            motionDetection: true,
            audioSync: true,
            safetyFeatures: ['tempo-guidance', 'rhythm-safety']
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
            playerCount: '2-8 players',
            // Gameplay data
            gameDuration: 780,
            exercises: [
                { name: 'Soccer Kicks', duration: 60, instruction: 'Score the winning goal!' },
                { name: 'Basketball Shots', duration: 45, instruction: 'Make the perfect shot!' },
                { name: 'Tennis Swings', duration: 60, instruction: 'Return the serve!' }
            ],
            visualStyle: 'sports',
            motionDetection: true,
            safetyFeatures: ['sport-safety', 'team-coordination']
        }
    ];

    const categories = [
        { id: 'all', name: 'All Games', icon: Gamepad2 },
        { id: 'cardio', name: 'Cardio Fun', icon: Heart },
        { id: 'strength', name: 'Get Strong', icon: Zap },
        { id: 'flexibility', name: 'Stretch Time', icon: Sparkles },
        { id: 'sports', name: 'Sports Zone', icon: Trophy },
        { id: 'adventure', name: 'Adventures', icon: Target },
        { id: 'mixed', name: 'Mix It Up', icon: Star }
    ];

    const difficulties = [
        { id: 'all', name: 'All Levels' },
        { id: 'Easy', name: 'Easy Peasy' },
        { id: 'Medium', name: 'Just Right' },
        { id: 'Hard', name: 'Challenge Me!' }
    ];

    // Load user stats from localStorage
    useEffect(() => {
        const savedStats = localStorage.getItem('pixelplay-fitness-stats');
        if (savedStats) {
            const stats = JSON.parse(savedStats);
            // Merge with current user state if needed
        }
    }, []);

    // Motion detection setup
    useEffect(() => {
        const handleMotion = (event) => {
            if (isListening && event.accelerationIncludingGravity) {
                setMotionData({
                    x: event.accelerationIncludingGravity.x || 0,
                    y: event.accelerationIncludingGravity.y || 0,
                    z: event.accelerationIncludingGravity.z || 0
                });
            }
        };

        if (selectedGame?.motionDetection && gameState === 'playing') {
            setIsListening(true);
            window.addEventListener('devicemotion', handleMotion);
        } else {
            setIsListening(false);
        }

        return () => {
            window.removeEventListener('devicemotion', handleMotion);
        };
    }, [selectedGame, gameState, isListening]);

    // Timer logic
    useEffect(() => {
        let interval = null;
        
        if (gameState === 'playing' && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(time => time - 1);
            }, 1000);
        } else if (gameState === 'playing' && timeRemaining === 0) {
            handleExerciseComplete();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameState, timeRemaining]);

    // Audio feedback
    const playAudioFeedback = useCallback((type) => {
        if (!audioEnabled) return;
        
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            switch(type) {
                case 'success':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1);
                    break;
                case 'countdown':
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                    break;
                case 'complete':
                    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
                    oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.2);
                    break;
                default:
                    oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            }
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Audio not available');
        }
    }, [audioEnabled]);

    // Game logic functions
    const handleExerciseComplete = () => {
        if (!selectedGame || !selectedGame.exercises) return;
        
        const currentExercise = selectedGame.exercises[currentExerciseIndex];
        playAudioFeedback('success');
        
        setScore(prev => prev + 10);
        setStreakCount(prev => prev + 1);

        if (currentExerciseIndex < selectedGame.exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
            setTimeRemaining(selectedGame.exercises[currentExerciseIndex + 1].duration);
        } else {
            // Game completed
            const newXP = user.xp + selectedGame.xpReward + (streakCount * 5);
            
            const updatedStats = {
                ...user,
                xp: newXP,
                level: Math.floor(newXP / 100) + 1,
                totalGamesPlayed: user.totalGamesPlayed + 1
            };
            
            localStorage.setItem('pixelplay-fitness-stats', JSON.stringify(updatedStats));
            setGameState('completed');
            playAudioFeedback('complete');
        }
    };

    const startGame = (game) => {
        console.log('Starting game:', game.name, game);
        
        // Ensure the game has exercises
        if (!game.exercises || game.exercises.length === 0) {
            console.warn('Game has no exercises, adding default exercise');
            game.exercises = [
                { name: 'Workout', duration: 30, instruction: 'Follow along with the workout!' }
            ];
        }
        
        setSelectedGame(game);
        setGameState('playing');
        setCurrentExerciseIndex(0);
        setTimeRemaining(game.exercises[0].duration || 30);
        setScore(0);
        setStreakCount(0);
        
        console.log('Game state changed to playing, timer set to:', game.exercises[0].duration || 30);
    };

    const pauseGame = () => setGameState('paused');
    const resumeGame = () => setGameState('playing');
    
    const resetGame = () => {
        setGameState('menu');
        setSelectedGame(null);
        setCurrentExerciseIndex(0);
        setTimeRemaining(0);
        setScore(0);
        setStreakCount(0);
    };

    const handleBackToDashboard = () => {
        console.log('Navigating back to dashboard');
        window.history.back();
    };

    // Filter games
    const filteredGames = games.filter(game => {
        const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === 'all' || game.difficulty === selectedDifficulty;
        const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesDifficulty && matchesSearch;
    });

    const isGameUnlocked = (game) => {
        const unlocked = user.level >= game.unlockLevel;
        console.log(`Game ${game.name}: user level ${user.level}, unlock level ${game.unlockLevel}, unlocked: ${unlocked}`);
        return unlocked;
    };
    const isGameCompleted = (game) => user.completedGames.includes(game.id);
    const isGameFavorite = (game) => user.favoriteGames.includes(game.id);

    // Visual game renderers
    const renderGameVisuals = () => {
        if (!selectedGame || !selectedGame.exercises) return null;

        const currentExercise = selectedGame.exercises[currentExerciseIndex];
        
        switch(selectedGame.visualStyle) {
            case 'ladder':
                return (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '2rem',
                        borderRadius: '16px',
                        minHeight: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: '1rem' }}>
                            {[...Array(5)].map((_, i) => (
                                <div 
                                    key={i} 
                                    style={{
                                        fontSize: '2rem',
                                        opacity: i < (5 - timeRemaining/20) ? '1' : '0.3',
                                        transition: 'all 0.3s ease',
                                        transform: i < (5 - timeRemaining/20) ? 'scale(1.2)' : 'scale(1)'
                                    }}
                                >
                                    ⚡
                                </div>
                            ))}
                        </div>
                    </div>
                );
                
            case 'targets':
                return (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '2rem',
                        borderRadius: '16px',
                        minHeight: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-around',
                        flexDirection: 'row'
                    }}>
                        <div style={{
                            fontSize: '3rem',
                            opacity: currentExercise?.name === 'Left Punch' ? '1' : '0.3',
                            transition: 'all 0.3s ease',
                            transform: currentExercise?.name === 'Left Punch' ? 'scale(1.3)' : 'scale(1)',
                            animation: currentExercise?.name === 'Left Punch' ? 'pulse 0.5s infinite' : 'none'
                        }}>👊</div>
                        <div style={{
                            fontSize: '3rem',
                            opacity: currentExercise?.name === 'Right Punch' ? '1' : '0.3',
                            transition: 'all 0.3s ease',
                            transform: currentExercise?.name === 'Right Punch' ? 'scale(1.3)' : 'scale(1)',
                            animation: currentExercise?.name === 'Right Punch' ? 'pulse 0.5s infinite' : 'none'
                        }}>👊</div>
                    </div>
                );
                
            case 'ninja':
                return (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '2rem',
                        borderRadius: '16px',
                        minHeight: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>🥷</div>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div style={{
                                fontSize: '2rem',
                                opacity: currentExercise?.name === 'Jump' ? '1' : '0.3',
                                transition: 'all 0.3s ease',
                                transform: currentExercise?.name === 'Jump' ? 'scale(1.5)' : 'scale(1)'
                            }}>⬆️</div>
                            <div style={{
                                fontSize: '2rem',
                                opacity: currentExercise?.name === 'Duck' ? '1' : '0.3',
                                transition: 'all 0.3s ease',
                                transform: currentExercise?.name === 'Duck' ? 'scale(1.5)' : 'scale(1)'
                            }}>⬇️</div>
                            <div style={{
                                fontSize: '2rem',
                                opacity: currentExercise?.name === 'Punch' ? '1' : '0.3',
                                transition: 'all 0.3s ease',
                                transform: currentExercise?.name === 'Punch' ? 'scale(1.5)' : 'scale(1)'
                            }}>👊</div>
                        </div>
                    </div>
                );
                
            default:
                return (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '2rem',
                        borderRadius: '16px',
                        minHeight: '300px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{selectedGame.emoji}</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '600' }}>{currentExercise?.name}</div>
                    </div>
                );
        }
    };

    // Main menu view
    if (gameState === 'menu') {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
                {/* Navigation Bar */}
                <nav style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '0.75rem 0',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100
                }}>
                    <div style={{
                        maxWidth: '1400px',
                        margin: '0 auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 2rem'
                    }}>
                        <div>
                            <button 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(139, 92, 246, 0.1)',
                                    color: '#8B5CF6',
                                    border: 'none',
                                    borderRadius: '12px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={handleBackToDashboard}
                                onMouseOver={(e) => {
                                    e.target.style.background = 'rgba(139, 92, 246, 0.2)';
                                    e.target.style.transform = 'translateX(-2px)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.background = 'rgba(139, 92, 246, 0.1)';
                                    e.target.style.transform = 'translateX(0px)';
                                }}
                            >
                                <ArrowLeft size={20} />
                                <span>Back to Dashboard</span>
                            </button>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            color: '#1F2937'
                        }}>
                            <span style={{ fontSize: '1.5rem' }}>🎮</span>
                            <span style={{ color: '#8B5CF6' }}>PixelPlay Games</span>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button 
                                    style={{
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        borderRadius: '50%',
                                        border: 'none',
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        color: '#8B5CF6',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onClick={() => setAudioEnabled(!audioEnabled)}
                                    title={audioEnabled ? 'Mute Sound' : 'Enable Sound'}
                                >
                                    {audioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                                </button>
                                <button 
                                    style={{
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        borderRadius: '50%',
                                        border: 'none',
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        color: '#8B5CF6',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onClick={() => setShowAvatarCustomizer(true)}
                                    title="Customize Avatar"
                                >
                                    <UserCircle size={20} />
                                </button>
                                <button 
                                    style={{
                                        width: '2.5rem',
                                        height: '2.5rem',
                                        borderRadius: '50%',
                                        border: 'none',
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        color: '#8B5CF6',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onClick={() => setShowStoryCreator(true)}
                                    title="Story Creator"
                                >
                                    <BookOpen size={20} />
                                </button>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.5rem 1rem',
                                background: 'rgba(139, 92, 246, 0.1)',
                                borderRadius: '16px'
                            }}>
                                <span style={{ fontSize: '1.5rem' }}>{user.avatar}</span>
                                <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    fontSize: '0.875rem'
                                }}>
                                    <span style={{ fontWeight: '600', color: '#1F2937' }}>Level {user.level}</span>
                                    <span style={{ color: '#6B7280' }}>{user.xp} XP</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <main style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '2rem'
                }}>
                    
                    {/* Header Section */}
                    <section style={{ marginBottom: '2rem' }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '24px',
                            padding: '2rem',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                gap: '2rem'
                            }}>
                                <div>
                                    <h1 style={{
                                        fontSize: '2.5rem',
                                        fontWeight: '800',
                                        color: '#1F2937',
                                        margin: '0 0 0.5rem 0'
                                    }}>Hey {user.name}! Choose Your Adventure!</h1>
                                    <p style={{
                                        fontSize: '1.125rem',
                                        color: '#6B7280',
                                        margin: '0 0 1rem 0'
                                    }}>Pick a fun fitness game to play and start your workout journey</p>
                                    <div style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        flexWrap: 'wrap'
                                    }}>
                                        <span style={{
                                            padding: '0.5rem 1rem',
                                            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                                            color: 'white',
                                            borderRadius: '20px',
                                            fontSize: '0.875rem',
                                            fontWeight: '600'
                                        }}>🔥 {user.weeklyStreak} Day Streak!</span>
                                        <span style={{
                                            padding: '0.5rem 1rem',
                                            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                                            color: 'white',
                                            borderRadius: '20px',
                                            fontSize: '0.875rem',
                                            fontWeight: '600'
                                        }}>🎯 {user.totalGamesPlayed} Games Played</span>
                                        <span style={{
                                            padding: '0.5rem 1rem',
                                            background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                                            color: 'white',
                                            borderRadius: '20px',
                                            fontSize: '0.875rem',
                                            fontWeight: '600'
                                        }}>🏆 {user.achievements.length} Achievements</span>
                                    </div>
                                </div>
                                
                                {/* User Stats */}
                                <div style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '1rem 1.5rem',
                                        background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                                        color: 'white',
                                        borderRadius: '16px',
                                        minWidth: '80px'
                                    }}>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '1.75rem',
                                            fontWeight: '800',
                                            marginBottom: '0.25rem'
                                        }}>{user.level}</span>
                                        <span style={{
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: 'rgba(255, 255, 255, 0.9)'
                                        }}>Level</span>
                                    </div>
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '1rem 1.5rem',
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        borderRadius: '16px',
                                        minWidth: '80px'
                                    }}>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '1.75rem',
                                            fontWeight: '800',
                                            color: '#8B5CF6',
                                            marginBottom: '0.25rem'
                                        }}>{user.xp}</span>
                                        <span style={{
                                            fontSize: '0.875rem',
                                            color: '#6B7280',
                                            fontWeight: '600'
                                        }}>Total XP</span>
                                    </div>
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '1rem 1.5rem',
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        borderRadius: '16px',
                                        minWidth: '80px'
                                    }}>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '1.75rem',
                                            fontWeight: '800',
                                            color: '#8B5CF6',
                                            marginBottom: '0.25rem'
                                        }}>{user.unlockedGames.length}</span>
                                        <span style={{
                                            fontSize: '0.875rem',
                                            color: '#6B7280',
                                            fontWeight: '600'
                                        }}>Games Unlocked</span>
                                    </div>
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '1rem 1.5rem',
                                        background: 'rgba(139, 92, 246, 0.1)',
                                        borderRadius: '16px',
                                        minWidth: '80px'
                                    }}>
                                        <span style={{
                                            display: 'block',
                                            fontSize: '1.75rem',
                                            fontWeight: '800',
                                            color: '#8B5CF6',
                                            marginBottom: '0.25rem'
                                        }}>{user.weeklyStreak}</span>
                                        <span style={{
                                            fontSize: '0.875rem',
                                            color: '#6B7280',
                                            fontWeight: '600'
                                        }}>Day Streak</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Games Grid */}
                    <section style={{ marginBottom: '2rem' }}>
                        {filteredGames.length > 0 ? (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                                gap: '1.5rem'
                            }}>
                                {filteredGames.map(game => (
                                    <GameCard 
                                        key={game.id} 
                                        game={game} 
                                        isUnlocked={isGameUnlocked(game)}
                                        isCompleted={isGameCompleted(game)}
                                        isFavorite={isGameFavorite(game)}
                                        onPlay={startGame}
                                        motionEnabled={motionDetection}
                                        audioEnabled={audioEnabled}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.95)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '24px',
                                padding: '3rem',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                                textAlign: 'center'
                            }}>
                                <Gamepad2 style={{ width: '4rem', height: '4rem', color: '#9CA3AF', marginBottom: '1rem' }} />
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    color: '#6B7280',
                                    margin: '0 0 0.5rem 0'
                                }}>No games found!</h3>
                                <p style={{ color: '#9CA3AF', margin: '0' }}>Try adjusting your search or filters to find more games.</p>
                            </div>
                        )}
                    </section>

                    {/* Motivation Footer */}
                    <section style={{ marginTop: '3rem' }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '24px',
                            padding: '2rem',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎮✨</div>
                            <h3 style={{
                                fontSize: '1.75rem',
                                fontWeight: '700',
                                color: '#1F2937',
                                margin: '0 0 0.75rem 0'
                            }}>You're Doing Amazing, {user.name}!</h3>
                            <p style={{
                                fontSize: '1.125rem',
                                color: '#6B7280',
                                margin: '0 0 1.5rem 0',
                                lineHeight: '1.6'
                            }}>Every game makes you stronger, faster, and healthier. Your {user.weeklyStreak} day streak shows you're becoming a true fitness champion!</p>
                        </div>
                    </section>

                </main>

                {/* Story Creator Modal */}
                {showStoryCreator && (
                    <StoryCreatorModal 
                        onClose={() => setShowStoryCreator(false)}
                        user={user}
                    />
                )}

                {/* Avatar Customizer Modal */}
                {showAvatarCustomizer && (
                    <AvatarCustomizerModal 
                        onClose={() => setShowAvatarCustomizer(false)}
                        user={user}
                    />
                )}
            </div>
        );
    }

    // Game playing screen
    if (gameState === 'playing' || gameState === 'paused') {
        const currentExercise = selectedGame?.exercises?.[currentExerciseIndex];
        
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: 'white',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                padding: '1rem',
                position: 'relative'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '2rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '1rem',
                    borderRadius: '12px'
                }}>
                    <div>
                        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>{selectedGame.name}</h2>
                        <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                            Exercise {currentExerciseIndex + 1} of {selectedGame.exercises?.length || 1}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button 
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={gameState === 'playing' ? pauseGame : resumeGame}
                        >
                            {gameState === 'playing' ? <Pause size={20} /> : <Play size={20} />}
                        </button>
                        <button 
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={resetGame}
                        >
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '2rem',
                    maxWidth: '1000px',
                    margin: '0 auto',
                    alignItems: 'center'
                }}>
                    {renderGameVisuals()}
                    
                    <div style={{ textAlign: 'center' }}>
                        <h3 style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            margin: '0 0 1rem 0'
                        }}>{currentExercise?.name || 'Get Ready!'}</h3>
                        <p style={{
                            fontSize: '1.1rem',
                            opacity: '0.9',
                            margin: '0 0 2rem 0',
                            lineHeight: '1.4'
                        }}>{currentExercise?.instruction || 'Prepare for your workout!'}</p>
                        
                        <div style={{
                            width: '150px',
                            height: '150px',
                            border: '6px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 2rem auto',
                            background: 'rgba(255, 255, 255, 0.1)'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: '800',
                                color: '#fbbf24'
                            }}>{timeRemaining}</div>
                            <div style={{
                                fontSize: '0.8rem',
                                opacity: '0.8'
                            }}>seconds</div>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '2rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            padding: '1rem',
                            borderRadius: '8px'
                        }}>
                            <div style={{ fontWeight: '600' }}>Score: {score}</div>
                            <div style={{ fontWeight: '600' }}>Streak: {streakCount}</div>
                            {selectedGame.motionDetection && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontWeight: '600'
                                }}>
                                    Motion: {isListening ? '🟢' : '🔴'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {gameState === 'paused' && (
                    <div style={{
                        position: 'absolute',
                        inset: '0',
                        background: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            padding: '2rem',
                            borderRadius: '16px',
                            textAlign: 'center',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <h3 style={{ margin: '0 0 1rem 0' }}>Game Paused</h3>
                            <p style={{ margin: '0 0 1.5rem 0', opacity: '0.9' }}>Take a breath and resume when ready!</p>
                            <button 
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                }}
                                onClick={resumeGame}
                            >
                                <Play size={20} />
                                Resume
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Completion screen
    if (gameState === 'completed') {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: 'white',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ maxWidth: '500px', textAlign: 'center' }}>
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{
                            fontSize: '4rem',
                            marginBottom: '1rem',
                            animation: 'bounce 2s infinite'
                        }}>🏆</div>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: '800',
                            margin: '0 0 1rem 0'
                        }}>Workout Complete!</h1>
                        <p style={{
                            fontSize: '1.1rem',
                            opacity: '0.9',
                            margin: '0'
                        }}>You've successfully completed {selectedGame.name}!</p>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            padding: '1rem',
                            borderRadius: '12px'
                        }}>
                            <Star style={{ color: '#fbbf24', width: '2rem', height: '2rem' }} />
                            <div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700'
                                }}>+{selectedGame.xpReward + (streakCount * 5)} XP</div>
                                <div style={{
                                    fontSize: '0.9rem',
                                    opacity: '0.8'
                                }}>Experience Gained</div>
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            padding: '1rem',
                            borderRadius: '12px'
                        }}>
                            <Trophy style={{ color: '#fbbf24', width: '2rem', height: '2rem' }} />
                            <div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700'
                                }}>Level {user.level}</div>
                                <div style={{
                                    fontSize: '0.9rem',
                                    opacity: '0.8'
                                }}>Current Level</div>
                            </div>
                        </div>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            padding: '1rem',
                            borderRadius: '12px'
                        }}>
                            <div>
                                <div style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700'
                                }}>{score}</div>
                                <div style={{
                                    fontSize: '0.9rem',
                                    opacity: '0.8'
                                }}>Final Score</div>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem'
                    }}>
                        <button 
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                padding: '1rem 2rem',
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                            onClick={() => startGame(selectedGame)}
                        >
                            <Play size={20} />
                            Play Again
                        </button>
                        <button 
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                            onClick={resetGame}
                        >
                            Back to Menu
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

// Game Card Component (matches your current design)
const GameCard = ({ game, isUnlocked, isCompleted, isFavorite, onPlay, motionEnabled, audioEnabled }) => {
    const getGameFeatureBadges = () => {
        const badges = [];
        if (game.motionDetection && motionEnabled) badges.push('📱 Motion');
        if (game.audioSync && audioEnabled) badges.push('🎵 Audio');
        if (game.storyMode) badges.push('📖 Story');
        if (game.mindfulness) badges.push('🧘 Mindful');
        return badges;
    };

    return (
        <div style={{
            position: 'relative',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            overflow: 'hidden',
            cursor: isUnlocked ? 'pointer' : 'not-allowed',
            opacity: isUnlocked ? '1' : '0.7'
        }}>
            
            {/* Card Header with Badges */}
            <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 10,
                display: 'flex',
                gap: '0.5rem'
            }}>
                {!isUnlocked && (
                    <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        background: '#6B7280'
                    }}>
                        <Lock size={16} />
                    </div>
                )}
                {isFavorite && isUnlocked && (
                    <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        background: '#F59E0B'
                    }}>
                        <Star size={16} />
                    </div>
                )}
                {isCompleted && (
                    <div style={{
                        width: '2rem',
                        height: '2rem',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        background: '#10B981'
                    }}>
                        <CheckCircle size={16} />
                    </div>
                )}
            </div>

            {/* Game Content */}
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{game.emoji}</div>
                <h3 style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#1F2937',
                    margin: '0 0 0.75rem 0'
                }}>{game.name}</h3>
                <p style={{
                    color: '#6B7280',
                    margin: '0 0 1rem 0',
                    lineHeight: '1.5',
                    fontSize: '0.9rem'
                }}>{game.description}</p>
                
                {/* Feature Badges */}
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    justifyContent: 'center',
                    marginBottom: '1rem'
                }}>
                    {getGameFeatureBadges().map((badge, index) => (
                        <span key={index} style={{
                            fontSize: '0.75rem',
                            padding: '0.25rem 0.5rem',
                            background: 'rgba(139, 92, 246, 0.1)',
                            color: '#8B5CF6',
                            borderRadius: '12px',
                            fontWeight: '500'
                        }}>{badge}</span>
                    ))}
                </div>
                
                {/* Game Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#6B7280',
                        fontWeight: '500'
                    }}>
                        <Timer size={16} />
                        <span>{game.duration}</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#6B7280',
                        fontWeight: '500'
                    }}>
                        <Zap size={16} />
                        <span>{game.xpReward} XP</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#6B7280',
                        fontWeight: '500'
                    }}>
                        <Target size={16} />
                        <span>{game.difficulty}</span>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#6B7280',
                        fontWeight: '500'
                    }}>
                        <Users size={16} />
                        <span>{game.playerCount}</span>
                    </div>
                </div>

                {/* Safety Features */}
                {game.safetyFeatures && (
                    <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                        <span style={{
                            fontSize: '0.875rem',
                            fontWeight: '600',
                            color: '#059669',
                            display: 'block',
                            marginBottom: '0.5rem'
                        }}>🛡️ Safety First:</span>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '0.5rem'
                        }}>
                            {game.safetyFeatures.map((feature, index) => (
                                <span key={index} style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.5rem',
                                    background: 'rgba(5, 150, 105, 0.1)',
                                    color: '#059669',
                                    borderRadius: '8px',
                                    textTransform: 'capitalize'
                                }}>
                                    {feature.replace('-', ' ')}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Unlock Requirement */}
                {!isUnlocked && (
                    <div style={{
                        background: '#6B7280',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        marginBottom: '1.5rem',
                        display: 'inline-block'
                    }}>
                        🔒 Unlock at Level {game.unlockLevel}
                    </div>
                )}

                {/* Play Button */}
                <button
                    onClick={() => {
                        console.log('Play button clicked for game:', game.name);
                        console.log('Is unlocked:', isUnlocked);
                        if (isUnlocked) {
                            console.log('Starting game...');
                            onPlay(game);
                        } else {
                            console.log('Game is locked, cannot start');
                        }
                    }}
                    disabled={!isUnlocked}
                    style={{
                        width: '100%',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '16px',
                        fontWeight: '700',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        border: 'none',
                        cursor: isUnlocked ? 'pointer' : 'not-allowed',
                        transition: 'all 0.2s ease',
                        background: isUnlocked ? '#8B5CF6' : '#E5E7EB',
                        color: isUnlocked ? 'white' : '#9CA3AF'
                    }}
                    onMouseOver={(e) => {
                        if (isUnlocked) {
                            e.target.style.background = '#7C3AED';
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                        }
                    }}
                    onMouseOut={(e) => {
                        if (isUnlocked) {
                            e.target.style.background = '#8B5CF6';
                            e.target.style.transform = 'translateY(0px)';
                            e.target.style.boxShadow = 'none';
                        }
                    }}
                >
                    {isUnlocked ? (
                        <>
                            <Play size={20} />
                            <span>Play Now!</span>
                        </>
                    ) : (
                        <>
                            <Lock size={20} />
                            <span>Locked</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

// Story Creator Modal Component (simplified for this demo)
const StoryCreatorModal = ({ onClose, user }) => {
    return (
        <div style={{
            position: 'fixed',
            inset: '0',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '2rem 2rem 1rem'
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#1F2937',
                        margin: '0'
                    }}>🎨 Create Your Fitness Story!</h2>
                    <button 
                        style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '50%',
                            border: 'none',
                            background: '#E5E7EB',
                            cursor: 'pointer',
                            fontSize: '1.2rem'
                        }}
                        onClick={onClose}
                    >×</button>
                </div>
                <div style={{ padding: '0 2rem 2rem', textAlign: 'center' }}>
                    <p>Story creator coming soon! This will let you create your own fitness adventures.</p>
                    <button 
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#8B5CF6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                        onClick={onClose}
                    >Close</button>
                </div>
            </div>
        </div>
    );
};

// Avatar Customizer Modal Component (simplified for this demo)
const AvatarCustomizerModal = ({ onClose, user }) => {
    return (
        <div style={{
            position: 'fixed',
            inset: '0',
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '24px',
                width: '100%',
                maxWidth: '500px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '2rem 2rem 1rem'
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#1F2937',
                        margin: '0'
                    }}>🎨 Customize Your Avatar!</h2>
                    <button 
                        style={{
                            width: '2rem',
                            height: '2rem',
                            borderRadius: '50%',
                            border: 'none',
                            background: '#E5E7EB',
                            cursor: 'pointer',
                            fontSize: '1.2rem'
                        }}
                        onClick={onClose}
                    >×</button>
                </div>
                <div style={{ padding: '0 2rem 2rem', textAlign: 'center' }}>
                    <p>Avatar customizer coming soon! This will let you personalize your character.</p>
                    <button 
                        style={{
                            padding: '0.75rem 1.5rem',
                            background: '#8B5CF6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            marginTop: '1rem'
                        }}
                        onClick={onClose}
                    >Close</button>
                </div>
            </div>
        </div>
    );
};

export default PixelPlayGameHub;