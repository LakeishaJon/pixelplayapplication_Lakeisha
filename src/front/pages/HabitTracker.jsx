import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, LayoutDashboard } from 'lucide-react';
import { getUserData } from '../utils/auth'; // Import auth utility

const HabitTracker = () => {
  const navigate = useNavigate();
  
  // User state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [gameData, setGameData] = useState({
    dailyPoints: 0,
    completedTasks: [],
    lastResetDate: null,
    streakDays: 0,
    gameStates: {}
  });

  const [sequenceProgress, setSequenceProgress] = useState({});
  const [activeTimers, setActiveTimers] = useState({});
  const [memoryGame, setMemoryGame] = useState({});
  const [timeUntilReset, setTimeUntilReset] = useState('');

  const handleNavigation = (path) => {
    console.log('Navigating to:', path);
    try {
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
      window.location.href = path;
    }
  };

  const routines = [
    {
      id: 'make-bed',
      title: 'Make My Bed',
      icon: '🛏️',
      description: 'Get a daily motivation quote!',
      gameType: 'quote',
      gameData: {
        quotes: [
          "Making your bed is the first victory of the day! 🏆",
          "A tidy space creates a peaceful mind! 🧘‍♀️",
          "Small actions lead to big changes! ⭐",
          "Success is built one small task at a time! 💪",
          "A made bed means you're ready to conquer the day! 🌟"
        ]
      }
    },
    {
      id: 'brush-teeth',
      title: 'Brush My Teeth',
      icon: '🪥',
      description: 'Brush for 2 minutes with our timer game!',
      gameType: 'timer',
      gameData: {
        duration: 120,
        encouragementMessages: [
          "Great brushing! Keep those circles going! 🦷",
          "Don't forget the back teeth! 🎯",
          "You're doing amazing! Almost halfway! ⭐",
          "Keep up the good work! Your teeth will thank you! 😊",
          "Almost done! Finish strong! 💪"
        ]
      }
    },
    {
      id: 'eat-fruit',
      title: 'Eat Healthy Snack',
      icon: '🍎',
      description: 'Learn fun food facts and play nutrition quiz!',
      gameType: 'quiz',
      gameData: {
        questions: [
          {
            question: "Which food gives you energy for a long time?",
            options: ["🍎 Apple", "🍭 Candy", "🥤 Soda", "🍪 Cookie"],
            correct: 0
          },
          {
            question: "What makes fruits and vegetables colorful?",
            options: ["🎨 Paint", "🌈 Vitamins", "✨ Magic", "🧪 Chemicals"],
            correct: 1
          },
          {
            question: "How many colors should you eat each day?",
            options: ["1 color", "2 colors", "Many colors", "No colors"],
            correct: 2
          }
        ]
      }
    },
    {
      id: 'wash-hands',
      title: 'Wash My Hands',
      icon: '🧼',
      description: 'Play the handwashing sequence game!',
      gameType: 'sequence',
      gameData: {
        steps: [
          { icon: '🚿', text: 'Turn on water' },
          { icon: '💧', text: 'Wet hands' },
          { icon: '🧼', text: 'Apply soap' },
          { icon: '👐', text: 'Scrub for 20 seconds' },
          { icon: '🌊', text: 'Rinse thoroughly' },
          { icon: '🧻', text: 'Dry with towel' }
        ]
      }
    },
    {
      id: 'read-book',
      title: 'Read a Book',
      icon: '📚',
      description: 'Play word memory game!',
      gameType: 'memory',
      gameData: {
        cards: ['📖', '✏️', '🎭', '🌟', '🦄', '🚀', '🌈', '🎨'],
        gridSize: 4
      }
    },
    {
      id: 'drink-water',
      title: 'Drink Water',
      icon: '💧',
      description: 'Track glasses and get hydration facts!',
      gameType: 'counter',
      gameData: {
        target: 8,
        facts: [
          "Water helps your brain work better! 🧠",
          "Your body is 60% water! 💧",
          "Water helps carry nutrients to your cells! 🚚"
        ]
      }
    }
  ];

  // Load authenticated user and their habit data
  useEffect(() => {
    loadUserData();
    const interval = setInterval(updateTimeUntilMidnight, 60000);
    return () => clearInterval(interval);
  }, []);

  const loadUserData = async () => {
    try {
      // Get authenticated user
      const authUser = getUserData();
      if (!authUser) {
        console.error('No authenticated user found');
        navigate('/login');
        return;
      }
      
      setUser(authUser);

      // ✅ TEMPORARY: Load from localStorage
      const savedData = localStorage.getItem(`habitTracker_${authUser.id}`);
      if (savedData) {
        const data = JSON.parse(savedData);
        setGameData({
          dailyPoints: data.dailyPoints || 0,
          completedTasks: data.completedTasks || [],
          lastResetDate: data.lastResetDate || getCurrentDateString(),
          streakDays: data.streakDays || 0,
          gameStates: data.gameStates || {}
        });
      } else {
        // Initialize with default data
        const currentDate = getCurrentDateString();
        setGameData(prev => ({
          ...prev,
          lastResetDate: currentDate
        }));
      }

      /* 🔧 UNCOMMENT THIS AFTER ADDING BACKEND ROUTES:
      
      // Fetch user's habit tracker data from backend
      const response = await fetch(`/api/habits/${authUser.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setGameData({
          dailyPoints: data.daily_points || 0,
          completedTasks: data.completed_tasks || [],
          lastResetDate: data.last_reset_date || getCurrentDateString(),
          streakDays: data.streak_days || 0,
          gameStates: data.game_states || {}
        });
      } else {
        // Initialize with default data
        const currentDate = getCurrentDateString();
        setGameData(prev => ({
          ...prev,
          lastResetDate: currentDate
        }));
      }
      
      */ // End of backend code - uncomment after setup
      
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
    
    updateTimeUntilMidnight();
  };

  const getCurrentDateString = () => {
    const now = new Date();
    return now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
  };

  const updateTimeUntilMidnight = () => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    setTimeUntilReset(`${hours}h ${minutes}m until reset`);
  };

  const enableTaskCompletion = (routineId) => {
    setGameData(prev => ({
      ...prev,
      gameStates: {
        ...prev.gameStates,
        [routineId]: { ...prev.gameStates[routineId], completed: true }
      }
    }));
  };

  const completeTask = async (routineId) => {
    if (!user) {
      alert('Please log in to save your progress!');
      return;
    }

    if (gameData.completedTasks.includes(routineId)) return;
    
    // ✅ UNLOCKED: No game completion required!
    // Users can complete tasks directly

    const newCompletedTasks = [...gameData.completedTasks, routineId];
    const newDailyPoints = gameData.dailyPoints + 10;
    const allTasksCompleted = newCompletedTasks.length === routines.length;

    // Update local state immediately for instant UI feedback
    setGameData(prev => ({
      ...prev,
      completedTasks: newCompletedTasks,
      dailyPoints: newDailyPoints
    }));

    // ✅ TEMPORARY: Working without backend
    // Remove this section and uncomment backend code below after setting up API
    
    // Save to localStorage for now
    try {
      const savedData = {
        dailyPoints: newDailyPoints,
        completedTasks: newCompletedTasks,
        streakDays: gameData.streakDays,
        lastResetDate: gameData.lastResetDate
      };
      localStorage.setItem(`habitTracker_${user.id}`, JSON.stringify(savedData));
      
      if (allTasksCompleted) {
        setTimeout(() => alert('🎉 All tasks completed! Great job! 🎉'), 500);
      }
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }

    /* 🔧 UNCOMMENT THIS AFTER ADDING BACKEND ROUTES:
    
    // Save to backend
    try {
      const response = await fetch(`/api/habits/${user.id}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: JSON.stringify({
          routine_id: routineId,
          points_earned: 10,
          all_completed: allTasksCompleted
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        // Update with confirmed data from backend
        setGameData(prev => ({
          ...prev,
          dailyPoints: data.daily_points,
          completedTasks: data.completed_tasks,
          streakDays: data.streak_days
        }));

        if (allTasksCompleted) {
          setTimeout(() => alert('🎉 All tasks completed! You earned a streak day! 🎉'), 500);
        }
      } else {
        // Revert on error
        setGameData(prev => ({
          ...prev,
          completedTasks: prev.completedTasks.filter(id => id !== routineId),
          dailyPoints: prev.dailyPoints - 10
        }));
        alert('Failed to save progress. Please try again!');
      }
    } catch (error) {
      console.error('Error completing task:', error);
      // Revert on error
      setGameData(prev => ({
        ...prev,
        completedTasks: prev.completedTasks.filter(id => id !== routineId),
        dailyPoints: prev.dailyPoints - 10
      }));
      alert('Failed to save progress. Please try again!');
    }
    
    */ // End of backend code - uncomment after setup
  };

  const showQuote = (routineId) => {
    const routine = routines.find(r => r.id === routineId);
    const quotes = routine.gameData.quotes;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    alert(randomQuote);
    setTimeout(() => enableTaskCompletion(routineId), 1000);
  };

  const startTimer = (routineId) => {
    const routine = routines.find(r => r.id === routineId);
    let timeLeft = routine.gameData.duration;
    setActiveTimers(prev => ({ ...prev, [routineId]: timeLeft }));
    
    const interval = setInterval(() => {
      timeLeft--;
      setActiveTimers(prev => ({ ...prev, [routineId]: timeLeft }));
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        setActiveTimers(prev => {
          const newTimers = { ...prev };
          delete newTimers[routineId];
          return newTimers;
        });
        alert('🎉 Perfect brushing! 🦷✨');
        enableTaskCompletion(routineId);
      }
    }, 1000);
  };

  const selectQuizAnswer = (routineId, answerIndex) => {
    const routine = routines.find(r => r.id === routineId);
    const currentQuestionIndex = gameData.gameStates[routineId]?.currentQuestion || 0;
    const question = routine.gameData.questions[currentQuestionIndex];

    if (answerIndex === question.correct) {
      const nextQuestionIndex = currentQuestionIndex + 1;
      if (nextQuestionIndex >= routine.gameData.questions.length) {
        alert('🎉 Perfect! You know your nutrition facts!');
        enableTaskCompletion(routineId);
      } else {
        setGameData(prev => ({
          ...prev,
          gameStates: {
            ...prev.gameStates,
            [routineId]: {
              ...prev.gameStates[routineId],
              currentQuestion: nextQuestionIndex,
              score: (prev.gameStates[routineId]?.score || 0) + 1
            }
          }
        }));
        alert('Correct! Next question...');
      }
    } else {
      alert('Try again!');
    }
  };

  const selectStep = (routineId, stepIndex) => {
    const routine = routines.find(r => r.id === routineId);
    const expectedStep = sequenceProgress[routineId] || 0;

    if (stepIndex === expectedStep) {
      const newProgress = expectedStep + 1;
      setSequenceProgress(prev => ({ ...prev, [routineId]: newProgress }));
      if (newProgress >= routine.gameData.steps.length) {
        alert('🎉 Perfect handwashing!');
        enableTaskCompletion(routineId);
      }
    } else {
      alert('Try the correct order!');
    }
  };

  const initMemoryGame = (routineId) => {
    const routine = routines.find(r => r.id === routineId);
    const cards = routine.gameData.cards;
    const gameCards = [...cards, ...cards].sort(() => Math.random() - 0.5);
    setMemoryGame(prev => ({
      ...prev,
      [routineId]: { cards: gameCards, flippedCards: [], matchedCards: [], attempts: 0 }
    }));
  };

  const flipMemoryCard = (routineId, cardIndex) => {
    const game = memoryGame[routineId];
    if (!game || game.flippedCards.length >= 2 || game.flippedCards.includes(cardIndex) || game.matchedCards.includes(cardIndex)) return;

    const newFlippedCards = [...game.flippedCards, cardIndex];
    setMemoryGame(prev => ({
      ...prev,
      [routineId]: { ...game, flippedCards: newFlippedCards }
    }));

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      setTimeout(() => {
        if (game.cards[first] === game.cards[second]) {
          setMemoryGame(prev => ({
            ...prev,
            [routineId]: {
              ...prev[routineId],
              flippedCards: [],
              matchedCards: [...prev[routineId].matchedCards, first, second],
              attempts: prev[routineId].attempts + 1
            }
          }));
          if (game.matchedCards.length + 2 >= game.cards.length) {
            setTimeout(() => {
              alert('🎉 Amazing memory!');
              enableTaskCompletion(routineId);
            }, 500);
          }
        } else {
          setMemoryGame(prev => ({
            ...prev,
            [routineId]: {
              ...prev[routineId],
              flippedCards: [],
              attempts: prev[routineId].attempts + 1
            }
          }));
        }
      }, 1000);
    }
  };

  const addWaterGlass = (routineId) => {
    const routine = routines.find(r => r.id === routineId);
    const current = gameData.gameStates[routineId]?.waterCount || 0;
    if (current < routine.gameData.target) {
      const newCount = current + 1;
      setGameData(prev => ({
        ...prev,
        gameStates: {
          ...prev.gameStates,
          [routineId]: { ...prev.gameStates[routineId], waterCount: newCount }
        }
      }));
      if (newCount >= routine.gameData.target) {
        setTimeout(() => {
          alert('🎉 Hydration goal reached!');
          enableTaskCompletion(routineId);
        }, 500);
      }
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderGameContent = (routine) => {
    switch (routine.gameType) {
      case 'quote':
        return (
          <div className="game-area">
            <div className="quote-display">Click to get your daily inspiration!</div>
            <button
              className="game-button"
              onClick={() => showQuote(routine.id)}
              disabled={gameData.gameStates[routine.id]?.completed}
            >
              Get My Quote! ✨
            </button>
          </div>
        );

      case 'timer':
        const timerActive = activeTimers[routine.id];
        return (
          <div className="game-area">
            <div className={`timer-display ${!timerActive && gameData.gameStates[routine.id]?.completed ? 'complete' : ''}`}>
              {timerActive ? formatTime(timerActive) : gameData.gameStates[routine.id]?.completed ? '✅ Complete!' : '2:00'}
            </div>
            <button
              className="game-button"
              onClick={() => startTimer(routine.id)}
              disabled={timerActive || gameData.gameStates[routine.id]?.completed}
            >
              {timerActive ? 'Brushing...' : gameData.gameStates[routine.id]?.completed ? 'Done!' : 'Start Timer'}
            </button>
          </div>
        );

      case 'quiz':
        const currentQuestionIndex = gameData.gameStates[routine.id]?.currentQuestion || 0;
        const question = routine.gameData.questions[currentQuestionIndex];
        return (
          <div className="game-area">
            <div className="quiz-question">{question.question}</div>
            {question.options.map((option, index) => (
              <button
                key={index}
                className="quiz-option"
                onClick={() => selectQuizAnswer(routine.id, index)}
                disabled={gameData.gameStates[routine.id]?.completed}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'sequence':
        const progress = sequenceProgress[routine.id] || 0;
        return (
          <div className="game-area">
            <div className="sequence-progress">Step {progress + 1} of {routine.gameData.steps.length}</div>
            {routine.gameData.steps.map((step, index) => (
              <button
                key={index}
                className="quiz-option"
                onClick={() => selectStep(routine.id, index)}
                disabled={gameData.gameStates[routine.id]?.completed}
                style={{ opacity: index < progress ? 0.5 : 1 }}
              >
                {step.icon} {step.text}
              </button>
            ))}
          </div>
        );

      case 'memory':
        const game = memoryGame[routine.id];
        if (!game) {
          return (
            <div className="game-area">
              <button className="game-button" onClick={() => initMemoryGame(routine.id)}>
                Start Memory Game
              </button>
            </div>
          );
        }
        return (
          <div className="game-area">
            <div className="memory-grid">
              {game.cards.map((card, index) => (
                <button
                  key={index}
                  className="memory-card"
                  onClick={() => flipMemoryCard(routine.id, index)}
                >
                  {game.flippedCards.includes(index) || game.matchedCards.includes(index) ? card : '❓'}
                </button>
              ))}
            </div>
          </div>
        );

      case 'counter':
        const waterCount = gameData.gameStates[routine.id]?.waterCount || 0;
        return (
          <div className="game-area">
            <div className="water-display">
              {'🥤'.repeat(waterCount)}{'⚪'.repeat(routine.gameData.target - waterCount)}
              <br />{waterCount} / {routine.gameData.target} cups
            </div>
            <button
              className="game-button"
              onClick={() => addWaterGlass(routine.id)}
              disabled={waterCount >= routine.gameData.target}
            >
              Add Glass 💧
            </button>
          </div>
        );

      default:
        return <div className="game-area">Fun activity!</div>;
    }
  };

  const getProgress = () => {
    const completed = gameData.completedTasks.length;
    const total = routines.length;
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(to right top, #fb735f, #ff6871, #ff5f85, #ff599c, #ff58b5, #fa5ec4, #f365d2, #eb6ce0, #df74e4, #d37be6, #c881e7, #bd86e7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '1.5rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📋</div>
          <div>Loading your routines...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to right top, #fb735f, #ff6871, #ff5f85, #ff599c, #ff58b5, #fa5ec4, #f365d2, #eb6ce0, #df74e4, #d37be6, #c881e7, #bd86e7)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation Bar - GameHub Style */}
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
              fontSize: '0.875rem'
            }}
            onClick={() => handleNavigation('/dashboard')}
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#1F2937'
          }}>
            <span style={{ fontSize: '1.5rem' }}>📋</span>
            <span style={{ color: '#8B5CF6' }}>Routine Tracker</span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <button
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(139, 92, 246, 0.1)',
                color: '#8B5CF6',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}
              onClick={() => handleNavigation('/')}
            >
              <Home size={18} />
              <span>Home</span>
            </button>
            <button
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                border: 'none',
                background: 'rgba(139, 92, 246, 0.1)',
                color: '#8B5CF6',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem'
              }}
              onClick={() => handleNavigation('/dashboard')}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>
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
            }}>🌟 My Routine Tracker 🌟</h1>
            <p style={{
              fontSize: '1.125rem',
              color: '#6B7280',
              margin: '0 0 1.5rem 0'
            }}>Complete tasks, play games, and earn points!</p>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap',
              marginBottom: '1rem'
            }}>
              <span style={{
                padding: '0.5rem 1rem',
                background: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
              }}>
                ⭐ {gameData.dailyPoints} Points Today
              </span>
              <span style={{
                padding: '0.5rem 1rem',
                background: 'linear-gradient(135deg, #F59E0B, #EF4444)',
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.875rem',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
              }}>
                🔥 {gameData.streakDays} Day Streak
              </span>
            </div>

            <div style={{
              fontSize: '0.875rem',
              color: '#9CA3AF',
              fontWeight: '500'
            }}>
              {timeUntilReset}
            </div>
          </div>
        </section>

        {/* Routine Cards Grid */}
        <section style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.5rem'
          }}>
            {routines.map(routine => {
              const isCompleted = gameData.completedTasks.includes(routine.id);

              return (
                <div
                  key={routine.id}
                  style={{
                    position: 'relative',
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '20px',
                    border: isCompleted ? '2px solid #10B981' : '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ padding: '2rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>{routine.icon}</div>
                    <h3 style={{
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: '#1F2937',
                      margin: '0 0 0.75rem 0'
                    }}>{routine.title}</h3>
                    <p style={{
                      color: '#6B7280',
                      margin: '0 0 1.5rem 0',
                      lineHeight: '1.5',
                      fontSize: '0.9rem'
                    }}>{routine.description}</p>

                    <div style={{
                      background: '#F9FAFB',
                      borderRadius: '15px',
                      padding: '1rem',
                      marginBottom: '1rem',
                      border: '2px solid #E5E7EB'
                    }}>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        color: '#6B7280', 
                        textAlign: 'center',
                        fontWeight: '600',
                        marginBottom: '0.5rem'
                      }}>
                        Optional Activity
                      </div>
                      {renderGameContent(routine)}
                    </div>

                    <button
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
                        cursor: isCompleted ? 'not-allowed' : 'pointer',
                        background: isCompleted
                          ? 'linear-gradient(135deg, #10B981, #059669)'
                          : 'linear-gradient(135deg, #8B5CF6, #EC4899)',
                        color: 'white',
                        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
                        opacity: isCompleted ? 0.8 : 1
                      }}
                      onClick={() => completeTask(routine.id)}
                      disabled={isCompleted}
                    >
                      {isCompleted ? '✅ Completed!' : '✨ Complete Task!'}
                    </button>
                  </div>

                  {isCompleted && (
                    <div style={{
                      position: 'absolute',
                      top: '1rem',
                      right: '1rem',
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      background: '#10B981',
                      fontSize: '1.25rem'
                    }}>
                      ✓
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Progress Section */}
        <section>
          <div style={{
            background: 'linear-gradient(135deg, #a855f7, #E32BED, #fb923c)',
            borderRadius: '24px',
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            textAlign: 'center'
          }}>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: '800',
              color: '#1F2937',
              margin: '0 0 1.5rem 0'
            }}>Daily Progress</h2>

            <div style={{
              background: '#F3F4F6',
              borderRadius: '15px',
              height: '35px',
              margin: '0 0 1.5rem 0',
              overflow: 'hidden',
              position: 'relative',
              border: '2px solid #E5E7EB'
            }}>
              <div style={{
                background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
                height: '100%',
                borderRadius: '13px',
                transition: 'width 0.5s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                color: 'white',
                width: `${getProgress()}%`,
                minWidth: getProgress() > 0 ? '40px' : '0',
                boxShadow: '0 2px 8px rgba(139, 92, 246, 0.3)'
              }}>
                {getProgress()}%
              </div>
            </div>

            <p style={{
              fontSize: '1.125rem',
              color: '#6B7280',
              fontWeight: '600',
              margin: 0
            }}>
              {gameData.completedTasks.length === 0 ? "Let's start your daily routine! 🌟" :
                gameData.completedTasks.length < routines.length ?
                  `${routines.length - gameData.completedTasks.length} more to go! 💪` :
                  `🎉 Perfect! You earned ${gameData.dailyPoints} points! 🎉`}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HabitTracker;