import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    Lock,
    CheckCircle,
    Search,
    ArrowLeft,
    Volume2,
    VolumeX,
    Filter
} from 'lucide-react';

// Game music configuration - OUTSIDE component to prevent recreation
const GAME_MUSIC = {
    'dance': '/Audio/upbeat-dance.mp3',
    'ninja': '/Audio/action-theme.mp3',
    'yoga': '/Audio/calm-ambient.mp3',
    'rhythm': '/Audio/electronic-beat.mp3',
    'lightning-ladders': '/Audio/energetic-workout.mp3',
    'shadow-punch': '/Audio/combat-music.mp3',
    'adventure': '/Audio/adventure-theme.mp3',
    'superhero': '/Audio/heroic-theme.mp3',
    'magic': '/Audio/mystical-ambient.mp3',
    'sports': '/Audio/sports-theme.mp3',
    'memory-match': '/Audio/memory-theme.mp3',
    'sequence-memory': '/Audio/brain-theme.mp3'
};

const PixelPlayGameHub = () => {
    const [selectedGame, setSelectedGame] = useState(null);
    const [gameState, setGameState] = useState('menu');
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [score, setScore] = useState(0);
    const [streakCount, setStreakCount] = useState(0);

    const [memoryCards, setMemoryCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedCards, setMatchedCards] = useState([]);
    const [memoryMoves, setMemoryMoves] = useState(0);
    const [memoryTimer, setMemoryTimer] = useState(0);

    const [sequence, setSequence] = useState([]);
    const [playerSequence, setPlayerSequence] = useState([]);
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);
    const [activeButton, setActiveButton] = useState(null);
    const [sequenceLevel, setSequenceLevel] = useState(1);
    const [sequenceMessage, setSequenceMessage] = useState('Click START to begin!');

    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedDifficulty, setSelectedDifficulty] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [audioEnabled, setAudioEnabled] = useState(true);

    const currentAudioRef = useRef(null);
    const audioContextRef = useRef(null);

    const [user] = useState({
        id: 'user123',
        name: 'Alex',
        avatar: '🧑‍🚀',
        level: 5,
        xp: 850,
        totalGamesPlayed: 23,
        weeklyStreak: 3,
        unlockedGames: ['dance', 'ninja', 'yoga', 'adventure', 'sports', 'superhero', 'lightning-ladders', 'shadow-punch', 'magic', 'rhythm', 'memory-match', 'sequence-memory'],
        completedGames: ['dance', 'yoga', 'lightning-ladders'],
        favoriteGames: ['dance', 'ninja', 'adventure']
    });

    // Complete games database
    const games = [
        {
            id: 'dance',
            name: 'Dance Party',
            emoji: '💃',
            gameType: 'exercise',
            description: 'Dance to fun music and copy the moves! Perfect for getting your groove on.',
            category: 'cardio',
            difficulty: 'Easy',
            duration: '5-10 min',
            xpReward: 50,
            energyRequired: 20,
            unlockLevel: 1,
            playerCount: '1-4 players',
            exercises: [
                { name: 'Warm-up Dance', duration: 45, instruction: 'Start with gentle dance moves!' },
                { name: 'Groove Time', duration: 60, instruction: 'Find your rhythm and groove!' },
                { name: 'Spin Moves', duration: 40, instruction: 'Add some spins to your dance!' },
                { name: 'Jump Dance', duration: 50, instruction: 'Jump to the beat!' },
                { name: 'Freestyle', duration: 60, instruction: 'Dance however you want!' },
                { name: 'Cool Down', duration: 45, instruction: 'Slow dance to cool down!' }
            ],
            hasMusic: true,
            safetyFeatures: ['warm-up', 'cool-down', 'hydration-reminders']
        },
        {
            id: 'ninja',
            name: 'Ninja Training',
            emoji: '🥷',
            gameType: 'exercise',
            description: 'Jump, duck, and punch like a ninja! Master the ancient arts of fitness.',
            category: 'strength',
            difficulty: 'Medium',
            duration: '8-12 min',
            xpReward: 75,
            energyRequired: 30,
            unlockLevel: 3,
            playerCount: '1-2 players',
            exercises: [
                { name: 'Ninja Preparation', duration: 10, instruction: 'Prepare your ninja stance!' },
                { name: 'Jump Training', duration: 60, instruction: 'Practice high ninja jumps!' },
                { name: 'Duck Training', duration: 50, instruction: 'Master the art of ducking!' },
                { name: 'Punch Power', duration: 55, instruction: 'Develop ninja punch strength!' },
                { name: 'Combo Moves', duration: 70, instruction: 'Combine jump, duck, and punch!' },
                { name: 'Speed Challenge', duration: 60, instruction: 'Fast ninja movements!' },
                { name: 'Stealth Mode', duration: 45, instruction: 'Silent ninja techniques!' },
                { name: 'Advanced Combat', duration: 80, instruction: 'Master ninja warrior moves!' },
                { name: 'Meditation Cool Down', duration: 60, instruction: 'Find your inner ninja peace!' }
            ],
            hasMusic: true,
            safetyFeatures: ['form-guidance', 'rest-periods']
        },
        {
            id: 'yoga',
            name: 'Animal Yoga',
            emoji: '🧘',
            gameType: 'exercise',
            description: 'Stretch like different animals! Calm your mind and strengthen your body.',
            category: 'flexibility',
            difficulty: 'Easy',
            duration: '10-15 min',
            xpReward: 60,
            energyRequired: 15,
            unlockLevel: 1,
            playerCount: '1+ players',
            exercises: [
                { name: 'Mountain Pose', duration: 45, instruction: 'Stand tall like a mountain!' },
                { name: 'Cat Stretch', duration: 60, instruction: 'Arch your back like a cat!' },
                { name: 'Downward Dog', duration: 70, instruction: 'Stretch like a happy dog!' },
                { name: 'Cobra Pose', duration: 50, instruction: 'Rise up like a cobra!' },
                { name: 'Frog Jumps', duration: 40, instruction: 'Hop like a playful frog!' },
                { name: 'Eagle Balance', duration: 60, instruction: 'Balance with eagle focus!' },
                { name: 'Child Pose Rest', duration: 45, instruction: 'Rest like a sleepy child!' },
                { name: 'Tree Pose', duration: 55, instruction: 'Stand strong like a tree!' },
                { name: 'Butterfly Stretch', duration: 50, instruction: 'Flutter like a butterfly!' },
                { name: 'Final Relaxation', duration: 75, instruction: 'Deep relaxation and breathing!' }
            ],
            hasMusic: true,
            safetyFeatures: ['breathing-guidance', 'relaxation-focus']
        },
        {
            id: 'rhythm',
            name: 'Rhythm Master',
            emoji: '🥁',
            gameType: 'exercise',
            description: 'Create beats with your body! Musical fitness that gets your heart pumping.',
            category: 'cardio',
            difficulty: 'Medium',
            duration: '5-12 min',
            xpReward: 75,
            energyRequired: 30,
            unlockLevel: 4,
            playerCount: '1-8 players',
            exercises: [
                { name: 'Beat Basics', duration: 50, instruction: 'Learn the basic beat patterns!' },
                { name: 'Clap Rhythm', duration: 45, instruction: 'Clap to create rhythms!' },
                { name: 'Stomp Beats', duration: 55, instruction: 'Stomp your feet to the beat!' },
                { name: 'Body Percussion', duration: 60, instruction: 'Use your whole body as drums!' },
                { name: 'Dance Beats', duration: 70, instruction: 'Combine dance with rhythm!' },
                { name: 'Speed Challenge', duration: 50, instruction: 'Keep up with fast rhythms!' },
                { name: 'Freestyle Jam', duration: 90, instruction: 'Create your own rhythm masterpiece!' }
            ],
            hasMusic: true,
            safetyFeatures: ['tempo-guidance', 'rhythm-safety']
        },
        {
            id: 'lightning-ladders',
            name: 'Lightning Ladders',
            emoji: '⚡',
            gameType: 'exercise',
            description: 'Sprint in place to climb the lightning ladder and reach the sky!',
            category: 'cardio',
            difficulty: 'Medium',
            duration: '6-8 min',
            xpReward: 75,
            energyRequired: 30,
            unlockLevel: 3,
            playerCount: '1-6 players',
            exercises: [
                { name: 'Sprint Warm-up', duration: 30, instruction: 'Light jogging to warm up!' },
                { name: 'Lightning Sprint 1', duration: 20, instruction: 'Sprint as fast as you can!' },
                { name: 'Recovery Jog', duration: 15, instruction: 'Slow jog to recover!' },
                { name: 'Lightning Sprint 2', duration: 20, instruction: 'Another fast sprint!' },
                { name: 'Active Rest', duration: 15, instruction: 'Walk in place to rest!' },
                { name: 'Lightning Sprint 3', duration: 20, instruction: 'Keep up the pace!' },
                { name: 'Recovery Walk', duration: 15, instruction: 'Walk to catch your breath!' },
                { name: 'Final Sprint', duration: 25, instruction: 'Last lightning climb!' },
                { name: 'Cool Down', duration: 30, instruction: 'Slow walk to cool down!' }
            ],
            hasMusic: true,
            safetyFeatures: ['intensity-monitoring', 'automatic-rest']
        },
        {
            id: 'shadow-punch',
            name: 'Shadow Boxing',
            emoji: '👊',
            gameType: 'exercise',
            description: 'Punch targets in rhythm to defeat shadow opponents!',
            category: 'strength',
            difficulty: 'Medium',
            duration: '7-10 min',
            xpReward: 60,
            energyRequired: 35,
            unlockLevel: 4,
            playerCount: '1-4 players',
            exercises: [
                { name: 'Arm Warm-up', duration: 30, instruction: 'Gentle arm circles and stretches!' },
                { name: 'Left Jab Practice', duration: 45, instruction: 'Practice your left jab!' },
                { name: 'Right Cross Practice', duration: 45, instruction: 'Work on your right cross!' },
                { name: 'Combo Training', duration: 60, instruction: 'Combine left and right punches!' },
                { name: 'Speed Round', duration: 50, instruction: 'Fast punching combinations!' },
                { name: 'Power Punches', duration: 55, instruction: 'Strong, powerful punches!' },
                { name: 'Duck & Punch', duration: 40, instruction: 'Duck low then punch!' },
                { name: 'Final Combination', duration: 75, instruction: 'Ultimate boxing workout!' },
                { name: 'Cool Down Stretch', duration: 30, instruction: 'Stretch your arms and shoulders!' }
            ],
            hasMusic: true,
            safetyFeatures: ['proper-form-tips', 'wrist-safety']
        },
        {
            id: 'adventure',
            name: 'Quest Adventure',
            emoji: '🗺️',
            gameType: 'exercise',
            description: 'Go on epic fitness quests! Explore magical worlds through exercise.',
            category: 'adventure',
            difficulty: 'Medium',
            duration: '15-20 min',
            xpReward: 100,
            energyRequired: 40,
            unlockLevel: 4,
            playerCount: '1-6 players',
            exercises: [
                { name: 'Journey Begins', duration: 60, instruction: 'Start your epic adventure!' },
                { name: 'Mountain Climb', duration: 90, instruction: 'Climb the steep mountain!' },
                { name: 'River Crossing', duration: 75, instruction: 'Jump across the rushing river!' },
                { name: 'Forest Path', duration: 80, instruction: 'Navigate through the forest!' },
                { name: 'Cave Exploration', duration: 70, instruction: 'Crawl through the mysterious cave!' },
                { name: 'Dragon Battle', duration: 120, instruction: 'Face the mighty dragon!' },
                { name: 'Treasure Hunt', duration: 85, instruction: 'Search for hidden treasure!' },
                { name: 'Castle Climb', duration: 100, instruction: 'Scale the castle walls!' },
                { name: 'Final Challenge', duration: 110, instruction: 'Complete your heroic quest!' }
            ],
            hasMusic: true,
            safetyFeatures: ['adventure-briefing', 'progress-pacing']
        },
        {
            id: 'superhero',
            name: 'Superhero Training',
            emoji: '🦸',
            gameType: 'exercise',
            description: 'Train like your favorite superheroes! Develop super strength and speed.',
            category: 'strength',
            difficulty: 'Hard',
            duration: '12-18 min',
            xpReward: 120,
            energyRequired: 50,
            unlockLevel: 6,
            playerCount: '1-4 players',
            exercises: [
                { name: 'Hero Warm-up', duration: 60, instruction: 'Activate your super powers!' },
                { name: 'Super Strength', duration: 90, instruction: 'Build incredible strength!' },
                { name: 'Lightning Speed', duration: 75, instruction: 'Run faster than lightning!' },
                { name: 'Flying Practice', duration: 80, instruction: 'Learn to soar through the sky!' },
                { name: 'Laser Vision', duration: 45, instruction: 'Focus your laser vision!' },
                { name: 'Shield Defense', duration: 70, instruction: 'Master defensive moves!' },
                { name: 'Team Up Moves', duration: 85, instruction: 'Practice team superhero moves!' },
                { name: 'Villain Battle', duration: 120, instruction: 'Defeat the evil villain!' },
                { name: 'Hero Recovery', duration: 55, instruction: 'Superhero cool-down routine!' }
            ],
            hasMusic: true,
            safetyFeatures: ['power-control', 'safety-first']
        },
        {
            id: 'magic',
            name: 'Magic Academy',
            emoji: '🪄',
            gameType: 'exercise',
            description: 'Learn magical spells through movement! Cast fitness spells and brew potions.',
            category: 'flexibility',
            difficulty: 'Easy',
            duration: '8-12 min',
            xpReward: 70,
            energyRequired: 25,
            unlockLevel: 5,
            playerCount: '1-4 players',
            exercises: [
                { name: 'Magic Circle', duration: 45, instruction: 'Cast the opening magic circle!' },
                { name: 'Fire Spell', duration: 60, instruction: 'Wave your arms to cast fire!' },
                { name: 'Water Flow', duration: 55, instruction: 'Flow like magical water!' },
                { name: 'Earth Power', duration: 50, instruction: 'Connect with earth magic!' },
                { name: 'Air Swirls', duration: 45, instruction: 'Swirl like magical wind!' },
                { name: 'Potion Brewing', duration: 70, instruction: 'Mix a magical fitness potion!' },
                { name: 'Transformation', duration: 65, instruction: 'Transform into magical creatures!' },
                { name: 'Magic Duel', duration: 80, instruction: 'Friendly magical battle!' },
                { name: 'Spell Completion', duration: 50, instruction: 'Complete your magical training!' }
            ],
            hasMusic: true,
            safetyFeatures: ['gentle-movements', 'imagination-focus']
        },
        {
            id: 'sports',
            name: 'Mini Sports',
            emoji: '⚽',
            gameType: 'exercise',
            description: 'Play soccer, basketball, and more! Compete in fun mini sporting events.',
            category: 'sports',
            difficulty: 'Medium',
            duration: '8-15 min',
            xpReward: 80,
            energyRequired: 35,
            unlockLevel: 2,
            playerCount: '2-8 players',
            exercises: [
                { name: 'Sports Warm-up', duration: 60, instruction: 'Prepare for athletic competition!' },
                { name: 'Soccer Skills', duration: 90, instruction: 'Practice soccer kicks and moves!' },
                { name: 'Basketball Shots', duration: 75, instruction: 'Shoot hoops and dribble!' },
                { name: 'Tennis Swings', duration: 80, instruction: 'Perfect your tennis technique!' },
                { name: 'Baseball Batting', duration: 70, instruction: 'Swing for the home run!' },
                { name: 'Track & Field', duration: 85, instruction: 'Run, jump, and throw!' },
                { name: 'Team Sports', duration: 100, instruction: 'Play various team sports!' },
                { name: 'Sports Medley', duration: 120, instruction: 'Mix of all sports activities!' },
                { name: 'Victory Celebration', duration: 50, instruction: 'Celebrate your athletic achievements!' }
            ],
            hasMusic: true,
            safetyFeatures: ['sport-safety', 'team-coordination']
        },
        {
            id: 'memory-match',
            name: 'Fitness Match Pairs',
            emoji: '🎴',
            description: 'Flip cards to find matching pairs of fitness items! Test your visual memory.',
            category: 'cognitive',
            difficulty: 'Easy',
            duration: '5-10 min',
            xpReward: 60,
            energyRequired: 10,
            unlockLevel: 1,
            playerCount: '1-4 players',
            gameType: 'memory-match',
            hasMusic: true
        },
        {
            id: 'sequence-memory',
            name: 'Exercise Sequence',
            emoji: '🧠',
            description: 'Watch exercises light up, then repeat the pattern! Challenge your memory.',
            category: 'cognitive',
            difficulty: 'Medium',
            duration: '8-15 min',
            xpReward: 85,
            energyRequired: 15,
            unlockLevel: 2,
            playerCount: '1-6 players',
            gameType: 'sequence-memory',
            hasMusic: true
        }
    ];

    const categories = [
        { id: 'all', name: 'All Games', emoji: '🎮' },
        { id: 'cardio', name: 'Cardio Fun', emoji: '💓' },
        { id: 'cognitive', name: 'Brain Games', emoji: '🧠' },
        { id: 'strength', name: 'Get Strong', emoji: '💪' },
        { id: 'flexibility', name: 'Stretch Time', emoji: '🤸' },
        { id: 'sports', name: 'Sports Zone', emoji: '⚽' },
        { id: 'adventure', name: 'Adventures', emoji: '🗺️' }
    ];

    const difficulties = [
        { id: 'all', name: 'All Levels' },
        { id: 'Easy', name: 'Easy Peasy' },
        { id: 'Medium', name: 'Just Right' },
        { id: 'Hard', name: 'Challenge Me!' }
    ];

    useEffect(() => {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }, []);

    // Audio management functions with fixed dependencies
    const playBackgroundMusic = useCallback((gameId) => {
        if (!audioEnabled || !GAME_MUSIC[gameId]) {
            console.log('Audio disabled or no music file for:', gameId);
            return;
        }

        try {
            // Stop current audio if playing
            if (currentAudioRef.current) {
                currentAudioRef.current.pause();
                currentAudioRef.current.currentTime = 0;
                currentAudioRef.current = null;
            }

            const audio = new Audio(GAME_MUSIC[gameId]);
            audio.loop = true;
            audio.volume = 0.3;

            currentAudioRef.current = audio;

            audio.play()
                .then(() => {
                    console.log(`✅ Playing music: ${gameId}`);
                })
                .catch((error) => {
                    console.warn(`⚠️ Could not autoplay music:`, error.message);
                    console.log('User interaction may be required for audio playback');
                });

        } catch (error) {
            console.error('Audio error:', error);
        }
    }, [audioEnabled]);

    const stopBackgroundMusic = useCallback(() => {
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            currentAudioRef.current.currentTime = 0;
            currentAudioRef.current = null;
            console.log('🔇 Music stopped');
        }
    }, []);

    const pauseBackgroundMusic = useCallback(() => {
        if (currentAudioRef.current) {
            currentAudioRef.current.pause();
            console.log('⏸️ Music paused');
        }
    }, []);

    const resumeBackgroundMusic = useCallback(() => {
        if (currentAudioRef.current) {
            currentAudioRef.current.play().catch(error => {
                console.warn('Could not resume music:', error.message);
            });
            console.log('▶️ Music resumed');
        }
    }, []);
    const playSound = useCallback((frequency) => {
        if (!audioEnabled || !audioContextRef.current) return;
        try {
            const oscillator = audioContextRef.current.createOscillator();
            const gainNode = audioContextRef.current.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContextRef.current.destination);
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + 0.3);
            oscillator.start(audioContextRef.current.currentTime);
            oscillator.stop(audioContextRef.current.currentTime + 0.3);
        } catch (error) {
            console.error('Sound error:', error);
        }
    }, [audioEnabled]);

     const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const initializeMemoryMatch = () => {
        const fitnessEmojis = ['🏋️', '🧘', '🏃', '⚽', '🥊', '🏊', '🚴', '🤸'];
        const shuffledCards = [...fitnessEmojis, ...fitnessEmojis]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({ id: index, emoji }));

        setMemoryCards(shuffledCards);
        setFlippedCards([]);
        setMatchedCards([]);
        setMemoryMoves(0);
        setMemoryTimer(0);
        setScore(0);
    };

    const handleMemoryCardClick = (cardId) => {
        if (flippedCards.length === 2 || flippedCards.includes(cardId) || matchedCards.includes(cardId)) return;

        const newFlippedCards = [...flippedCards, cardId];
        setFlippedCards(newFlippedCards);
        playSound(400);

        if (newFlippedCards.length === 2) {
            setMemoryMoves(m => m + 1);
            const [firstId, secondId] = newFlippedCards;
            const firstCard = memoryCards.find(c => c.id === firstId);
            const secondCard = memoryCards.find(c => c.id === secondId);

            if (firstCard.emoji === secondCard.emoji) {
                setTimeout(() => {
                    setMatchedCards(m => [...m, firstId, secondId]);
                    setFlippedCards([]);
                    setScore(s => s + 10);
                    playSound(600);
                }, 500);
            } else {
                setTimeout(() => {
                    setFlippedCards([]);
                    playSound(200);
                }, 1000);
            }
        }
    };

    const initializeSequenceMemory = () => {
        setSequence([]);
        setPlayerSequence([]);
        setSequenceLevel(1);
        setScore(0);
        setIsPlayerTurn(false);
        setSequenceMessage('Watch the sequence...');
        setTimeout(() => addToSequence([]), 500);
    };

    const addToSequence = (currentSequence) => {
        const newExercise = Math.floor(Math.random() * 4);
        const newSequence = [...currentSequence, newExercise];
        setSequence(newSequence);
        playSequence(newSequence);
    };

    const playSequence = async (seq) => {
        setIsPlayerTurn(false);
        setSequenceMessage('Watch carefully...');

        for (let i = 0; i < seq.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            setActiveButton(seq[i]);
            playSound(300 + seq[i] * 100);
            await new Promise(resolve => setTimeout(resolve, 400));
            setActiveButton(null);
        }

        setIsPlayerTurn(true);
        setSequenceMessage('Your turn! Repeat the sequence');
    };

    const handleSequenceButtonClick = (exerciseId) => {
        if (!isPlayerTurn) return;

        const newPlayerSequence = [...playerSequence, exerciseId];
        setPlayerSequence(newPlayerSequence);

        setActiveButton(exerciseId);
        playSound(300 + exerciseId * 100);
        setTimeout(() => setActiveButton(null), 300);

        const currentIndex = newPlayerSequence.length - 1;

        if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
            setSequenceMessage('Game Over! Wrong sequence');
            setIsPlayerTurn(false);
            setTimeout(() => setGameState('completed'), 1500);
        } else if (newPlayerSequence.length === sequence.length) {
            const newScore = score + (sequenceLevel * 10);
            setScore(newScore);
            setSequenceLevel(l => l + 1);
            setPlayerSequence([]);
            setIsPlayerTurn(false);
            setSequenceMessage(`Level ${sequenceLevel} Complete!`);

            setTimeout(() => {
                setSequenceMessage('Next level...');
                addToSequence(sequence);
            }, 1500);
        }
    };

    useEffect(() => {
        let interval;
        if (gameState === 'playing' && selectedGame?.gameType === 'memory-match' && matchedCards.length < memoryCards.length) {
            interval = setInterval(() => setMemoryTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [gameState, selectedGame, matchedCards.length, memoryCards.length]);

    useEffect(() => {
        if (matchedCards.length === memoryCards.length && memoryCards.length > 0) {
            setTimeout(() => setGameState('completed'), 1000);
        }
    }, [matchedCards, memoryCards]);


    // Timer logic
    useEffect(() => {
        let interval = null;

        if (gameState === 'playing' && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(time => time - 1);
            }, 1000);
        } else if (gameState === 'playing'  && selectedGame?.gameType === 'exercise' && timeRemaining === 0) {
            handleExerciseComplete();
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [gameState, timeRemaining, selectedGame]);

    // Game logic functions
    const handleExerciseComplete = () => {
        if (!selectedGame || !selectedGame.exercises) return;

        setScore(prev => prev + 10);
        setStreakCount(prev => prev + 1);

        if (currentExerciseIndex < selectedGame.exercises.length - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
            setTimeRemaining(selectedGame.exercises[currentExerciseIndex + 1].duration);
        } else {
            stopBackgroundMusic();
            setGameState('completed');
        }
    };

    const startGame = (game) => {
        console.log('Starting game:', game.name);

        if (!game.gameType && (!game.exercises || game.exercises.length === 0)) {
            console.warn('Game has no exercises');
            return;
        }

        setSelectedGame(game);
        setGameState('playing');
        setCurrentExerciseIndex(0);
        setScore(0);
        setStreakCount(0);

        if (game.gameType === 'memory-match') {
            initializeMemoryMatch();
        } else if (game.gameType === 'sequence-memory') {
            initializeSequenceMemory();
        } else if (game.gameType === 'exercise' && game.exercises?.length > 0) {
            setCurrentExerciseIndex(0);
            setTimeRemaining(game.exercises[0].duration);
        }

        if (game.hasMusic && audioEnabled) {
            playBackgroundMusic(game.id);
        }
    };

    const pauseGame = () => {
        setGameState('paused');
        pauseBackgroundMusic();
    };

    const resumeGame = () => {
        setGameState('playing');
        resumeBackgroundMusic();
    };

    const resetGame = () => {
        setGameState('menu');
        setSelectedGame(null);
        setCurrentExerciseIndex(0);
        setTimeRemaining(0);
        setScore(0);
        setStreakCount(0);
        setMemoryCards([]);
        setFlippedCards([]);
        setMatchedCards([]);
        setMemoryMoves(0);
        setMemoryTimer(0);
        setSequence([]);
        setPlayerSequence([]);
        setSequenceLevel(1);
        stopBackgroundMusic();
    };

    const handleBackToDashboard = () => {
        stopBackgroundMusic();
        window.history.back();
    };


    const filteredGames = games.filter(game => {
        const matchesCategory = selectedCategory === 'all' || game.category === selectedCategory;
        const matchesDifficulty = selectedDifficulty === 'all' || game.difficulty === selectedDifficulty;
        const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.description.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesDifficulty && matchesSearch;
    });

    useEffect(() => {
        return () => {
            stopBackgroundMusic();
        };
    }, [stopBackgroundMusic]);


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
                            <button
                                style={{
                                    width: '2.5rem',
                                    height: '2.5rem',
                                    borderRadius: '50%',
                                    border: 'none',
                                    background: audioEnabled ? 'rgba(139, 92, 246, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: audioEnabled ? '#8B5CF6' : '#EF4444',
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
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center'
                        }}>
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
                                justifyContent: 'center',
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
                            </div>
                        </div>
                    </section>

                    {/* Search and Filters Section */}
                    <section style={{ marginBottom: '2rem' }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '24px',
                            padding: '2rem',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                        }}>
                            {/* Search Bar */}
                            <div style={{ marginBottom: '2rem' }}>
                                <div style={{
                                    position: 'relative',
                                    marginBottom: '1rem'
                                }}>
                                    <Search style={{
                                        position: 'absolute',
                                        left: '1rem',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#9CA3AF',
                                        width: '1.25rem',
                                        height: '1.25rem'
                                    }} />
                                    <input
                                        type="text"
                                        placeholder="Search for awesome games..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        style={{
                                            width: '100%',
                                            paddingLeft: '3rem',
                                            paddingRight: '1rem',
                                            paddingTop: '0.875rem',
                                            paddingBottom: '0.875rem',
                                            border: '2px solid #E5E7EB',
                                            borderRadius: '16px',
                                            fontSize: '1.125rem',
                                            fontWeight: '500',
                                            transition: 'all 0.2s ease',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => {
                                            e.target.style.borderColor = '#8B5CF6';
                                            e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                                        }}
                                        onBlur={(e) => {
                                            e.target.style.borderColor = '#E5E7EB';
                                            e.target.style.boxShadow = 'none';
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Category Filters */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <h3 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: '700',
                                    color: '#1F2937',
                                    marginBottom: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <Filter size={20} />
                                    Game Categories
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.75rem'
                                }}>
                                    {categories.map(category => (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                padding: '0.75rem 1rem',
                                                borderRadius: '16px',
                                                border: 'none',
                                                fontWeight: '600',
                                                fontSize: '0.875rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                background: selectedCategory === category.id
                                                    ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                                                    : 'rgba(139, 92, 246, 0.1)',
                                                color: selectedCategory === category.id ? 'white' : '#8B5CF6',
                                                transform: selectedCategory === category.id ? 'scale(1.05)' : 'scale(1)',
                                                boxShadow: selectedCategory === category.id
                                                    ? '0 4px 12px rgba(139, 92, 246, 0.3)'
                                                    : 'none'
                                            }}
                                        >
                                            <span style={{ fontSize: '1rem' }}>{category.emoji}</span>
                                            <span>{category.name}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Difficulty Filters */}
                            <div>
                                <h3 style={{
                                    fontSize: '1.125rem',
                                    fontWeight: '700',
                                    color: '#1F2937',
                                    marginBottom: '1rem'
                                }}>
                                    Difficulty Level
                                </h3>
                                <div style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.75rem'
                                }}>
                                    {difficulties.map(diff => (
                                        <button
                                            key={diff.id}
                                            onClick={() => setSelectedDifficulty(diff.id)}
                                            style={{
                                                padding: '0.75rem 1.25rem',
                                                borderRadius: '16px',
                                                border: 'none',
                                                fontWeight: '600',
                                                fontSize: '0.875rem',
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                background: selectedDifficulty === diff.id
                                                    ? 'linear-gradient(135deg, #EC4899, #F59E0B)'
                                                    : 'rgba(236, 72, 153, 0.1)',
                                                color: selectedDifficulty === diff.id ? 'white' : '#EC4899',
                                                transform: selectedDifficulty === diff.id ? 'scale(1.05)' : 'scale(1)',
                                                boxShadow: selectedDifficulty === diff.id
                                                    ? '0 4px 12px rgba(236, 72, 153, 0.3)'
                                                    : 'none'
                                            }}
                                        >
                                            {diff.name}
                                        </button>
                                    ))}
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
                                gap: '1.5rem',
                                width: '100%',
                                maxWidth: '1400px',
                                margin: '0 auto'
                            }}>
                                {filteredGames.map(game => {
                                    const isUnlocked = user.level >= game.unlockLevel;
                                    const isCompleted = user.completedGames.includes(game.id);
                                    const isFavorite = user.favoriteGames.includes(game.id);

                                    return (
                                        <div
                                            key={game.id}
                                            style={{
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
                                            }}
                                            onMouseEnter={(e) => {
                                                if (isUnlocked) {
                                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                                    e.currentTarget.style.boxShadow = '0 12px 48px rgba(0, 0, 0, 0.15)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.1)';
                                            }}
                                        >
                                            {/* Game Card Content */}
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

                                                {/* Music Badge */}
                                                {game.hasMusic && audioEnabled && (
                                                    <div style={{
                                                        display: 'flex',
                                                        justifyContent: 'center',
                                                        marginBottom: '1rem'
                                                    }}>
                                                        <span style={{
                                                            fontSize: '0.75rem',
                                                            padding: '0.25rem 0.5rem',
                                                            background: 'rgba(139, 92, 246, 0.1)',
                                                            color: '#8B5CF6',
                                                            borderRadius: '12px',
                                                            fontWeight: '500'
                                                        }}>🎶 Background Music</span>
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
                                                    onClick={() => isUnlocked && startGame(game)}
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
                                                        background: isUnlocked
                                                            ? 'linear-gradient(135deg, #8B5CF6, #EC4899)'
                                                            : '#E5E7EB',
                                                        color: isUnlocked ? 'white' : '#9CA3AF'
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        if (isUnlocked) {
                                                            e.target.style.transform = 'scale(1.05)';
                                                            e.target.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.4)';
                                                        }
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.target.style.transform = 'scale(1)';
                                                        e.target.style.boxShadow = 'none';
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

                                            {/* Status Badges */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                right: '1rem',
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
                                                        <Heart size={16} />
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
                                        </div>
                                    );
                                })}
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
                                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎮</div>
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

                </main>
            </div>
        );
    }

    if (gameState === 'playing' && selectedGame?.gameType === 'memory-match') {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'rgba(255, 255, 255, 0.2)', padding: '1rem', borderRadius: '12px', color: 'white' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem' }}>{selectedGame.emoji} {selectedGame.name}</h2>
                    <button onClick={resetGame} style={{ background: 'rgba(255, 255, 255, 0.3)', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer' }}>
                        <RotateCcw size={20} />
                    </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                    <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '15px 25px', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', opacity: 0.9 }}>Time</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{formatTime(memoryTimer)}</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '15px 25px', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', opacity: 0.9 }}>Moves</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{memoryMoves}</div>
                    </div>
                    <div style={{ background: 'rgba(255, 255, 255, 0.2)', padding: '15px 25px', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', opacity: 0.9 }}>Matched</div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{matchedCards.length / 2} / 8</div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', maxWidth: '600px', margin: '0 auto' }}>
                    {memoryCards.map(card => (
                        <div
                            key={card.id}
                            onClick={() => handleMemoryCardClick(card.id)}
                            style={{
                                aspectRatio: '1',
                                background: flippedCards.includes(card.id) || matchedCards.includes(card.id) ? matchedCards.includes(card.id) ? 'rgba(144, 238, 144, 0.9)' : 'white' : 'rgba(255, 255, 255, 0.3)',
                                borderRadius: '15px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '50px',
                                transition: 'all 0.3s ease',
                                border: matchedCards.includes(card.id) ? '3px solid #32cd32' : '3px solid rgba(255, 255, 255, 0.5)'
                            }}
                        >
                            {flippedCards.includes(card.id) || matchedCards.includes(card.id) ? card.emoji : '?'}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (gameState === 'playing' && selectedGame?.gameType === 'sequence-memory') {
        const exercises = [
            { id: 0, name: 'Squats', emoji: '🏋️', color: '#ff6b6b' },
            { id: 1, name: 'Push-ups', emoji: '💪', color: '#4ecdc4' },
            { id: 2, name: 'Jumping', emoji: '🤸', color: '#ffe66d' },
            { id: 3, name: 'Running', emoji: '🏃', color: '#95e1d3' }
        ];

        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', background: 'white', padding: '1rem', borderRadius: '12px' }}>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', color: '#2d3561' }}>{selectedGame.emoji} {selectedGame.name}</h2>
                    <button onClick={resetGame} style={{ background: '#667eea', color: 'white', border: 'none', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer' }}>
                        <RotateCcw size={20} />
                    </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <div style={{ background: 'white', padding: '15px 25px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: '#666' }}>Level</div>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d3561' }}>{sequenceLevel}</div>
                    </div>
                    <div style={{ background: 'white', padding: '15px 25px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: '#666' }}>Score</div>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d3561' }}>{score}</div>
                    </div>
                    <div style={{ background: 'white', padding: '15px 25px', borderRadius: '12px', textAlign: 'center' }}>
                        <div style={{ fontSize: '14px', color: '#666' }}>Length</div>
                        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2d3561' }}>{sequence.length}</div>
                    </div>
                </div>

                <div style={{ background: isPlayerTurn ? 'rgba(78, 205, 196, 0.9)' : 'rgba(255, 230, 109, 0.9)', maxWidth: '500px', margin: '0 auto 30px', padding: '20px', borderRadius: '15px', textAlign: 'center' }}>
                    <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2d3561', margin: 0 }}>{sequenceMessage}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
                    {exercises.map(exercise => (
                        <button
                            key={exercise.id}
                            onClick={() => handleSequenceButtonClick(exercise.id)}
                            disabled={!isPlayerTurn}
                            style={{
                                aspectRatio: '1',
                                border: 'none',
                                borderRadius: '20px',
                                background: activeButton === exercise.id ? exercise.color : `${exercise.color}80`,
                                transform: activeButton === exercise.id ? 'scale(0.95)' : 'scale(1)',
                                boxShadow: activeButton === exercise.id ? `0 0 30px ${exercise.color}` : '0 4px 15px rgba(0,0,0,0.3)',
                                cursor: isPlayerTurn ? 'pointer' : 'not-allowed',
                                opacity: isPlayerTurn || activeButton === exercise.id ? 1 : 0.7,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                transition: 'all 0.2s ease',
                                minHeight: '150px'
                            }}
                        >
                            <div style={{ fontSize: '60px' }}>{exercise.emoji}</div>
                            <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                                {exercise.name}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Game playing screen
    if (gameState === 'playing' && selectedGame?.gameType === 'exercise') {
        const currentExercise = selectedGame.exercises[currentExerciseIndex];

        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: 'white',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                padding: '1rem'
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
                                transition: 'all 0.2s ease'
                            }}
                            onClick={gameState === 'playing' ? pauseGame : resumeGame}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
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
                                transition: 'all 0.2s ease'
                            }}
                            onClick={resetGame}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
                        >
                            <RotateCcw size={20} />
                        </button>
                    </div>
                </div>

                <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{selectedGame.emoji}</div>
                    <h3 style={{
                        fontSize: '2rem',
                        fontWeight: '700',
                        margin: '0 0 1rem 0'
                    }}>{currentExercise?.name || 'Get Ready!'}</h3>
                    <p style={{
                        fontSize: '1.1rem',
                        opacity: '0.9',
                        margin: '0 0 2rem 0'
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
                    </div>
                </div>

                {gameState === 'paused' && (
                    <div style={{
                        position: 'fixed',
                        inset: '0',
                        background: 'rgba(0, 0, 0, 0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            padding: '2rem',
                            borderRadius: '16px',
                            textAlign: 'center',
                            color: '#1F2937'
                        }}>
                            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.5rem' }}>Game Paused</h3>
                            <p style={{ margin: '0 0 1.5rem 0', color: '#6B7280' }}>Take a breath and resume when ready!</p>
                            <button
                                style={{
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    margin: '0 auto',
                                    transition: 'all 0.2s ease'
                                }}
                                onClick={resumeGame}
                                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
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
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏆</div>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        margin: '0 0 1rem 0'
                    }}>Workout Complete!</h1>
                    <p style={{
                        fontSize: '1.1rem',
                        opacity: '0.9',
                        margin: '0 0 2rem 0'
                    }}>You've successfully completed {selectedGame.name}!</p>

                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            padding: '1rem',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <Star style={{ color: '#fbbf24', width: '2rem', height: '2rem' }} />
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                    +{selectedGame.xpReward + (streakCount * 5)} XP
                                </div>
                                <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>Experience Gained</div>
                            </div>
                        </div>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            padding: '1rem',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <Trophy style={{ color: '#fbbf24', width: '2rem', height: '2rem' }} />
                            <div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>Final Score: {score}</div>
                                <div style={{ fontSize: '0.9rem', opacity: '0.8' }}>Great job!</div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button
                            style={{
                                background: '#10b981',
                                color: 'white',
                                border: 'none',
                                padding: '1rem 2rem',
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={() => startGame(selectedGame)}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'scale(1.05)';
                                e.target.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.4)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'scale(1)';
                                e.target.style.boxShadow = 'none';
                            }}
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
                                fontWeight: '500',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={resetGame}
                            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.3)'}
                            onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.2)'}
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

export default PixelPlayGameHub;