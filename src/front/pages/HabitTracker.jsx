import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ ADDED THIS
import '../styles/HabitTracker.css';

const HabitTracker = () => {
  const navigate = useNavigate(); // ✅ ADDED THIS
  
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

  // ✅ ADDED: Navigation handler
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

  useEffect(() => {
    initApp();
    const interval = setInterval(updateTimeUntilMidnight, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (gameData.lastResetDate) {
      checkForDailyReset();
    }
  }, []);

  const getCurrentDateString = () => {
    const now = new Date();
    return now.getFullYear() + '-' +
      String(now.getMonth() + 1).padStart(2, '0') + '-' +
      String(now.getDate()).padStart(2, '0');
  };

  const initApp = () => {
    const currentDate = getCurrentDateString();
    setGameData(prev => {
      if (!prev.lastResetDate) {
        return { ...prev, lastResetDate: currentDate };
      }
      return prev;
    });
    updateTimeUntilMidnight();
  };

  const checkForDailyReset = () => {
    const currentDate = getCurrentDateString();
    if (gameData.lastResetDate && gameData.lastResetDate !== currentDate) {
      setGameData(prev => {
        const allTasksCompleted = prev.completedTasks.length === routines.length;
        return {
          ...prev,
          streakDays: allTasksCompleted ? prev.streakDays + 1 : 0,
          completedTasks: [],
          dailyPoints: 0,
          gameStates: {},
          lastResetDate: currentDate
        };
      });
      setSequenceProgress({});
      setActiveTimers({});
      setMemoryGame({});
    }
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

  const completeTask = (routineId) => {
    if (gameData.completedTasks.includes(routineId)) return;
    const isGameCompleted = gameData.gameStates[routineId]?.completed;
    if (!isGameCompleted) {
      alert('Complete the activity first! 🎮');
      return;
    }

    setGameData(prev => {
      const newCompletedTasks = [...prev.completedTasks, routineId];
      const newDailyPoints = prev.dailyPoints + 10;
      if (newCompletedTasks.length === routines.length) {
        setTimeout(() => alert('🎉 All tasks completed! 🎉'), 500);
      }
      return {
        ...prev,
        completedTasks: newCompletedTasks,
        dailyPoints: newDailyPoints
      };
    });
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
            <div className="timer-display">
              {timerActive ? formatTime(timerActive) : '2:00'}
            </div>
            <button
              className="game-button"
              onClick={() => startTimer(routine.id)}
              disabled={timerActive || gameData.gameStates[routine.id]?.completed}
            >
              {timerActive ? 'Brushing...' : 'Start Timer'}
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

  return (
    <div className="container">
      {/* ✅ FIXED: Navigation Bar with working buttons */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        marginBottom: '20px'
      }}>
        <div 
          style={{
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer'
          }}
          onClick={() => handleNavigation('/')}
        >
          <span>🎮</span>
          <span>Pixel Play</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            style={{
              background: 'white',
              color: '#a855f7',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onClick={() => handleNavigation('/')}
          >
            🏠 Home
          </button>
          <button
            style={{
              background: 'white',
              color: '#a855f7',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '10px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onClick={() => handleNavigation('/dashboard')}
          >
            📊 Dashboard
          </button>
        </div>
      </div>

      <div className="header">
        <h1>🌟 My Routine Tracker 🌟</h1>
        <p>Complete tasks, play games, and earn points!</p>

        <div className="points-container">
          <div className="points-display">
            <h3>Today's Points</h3>
            <div className="points-number">{gameData.dailyPoints}</div>
          </div>
          <div className="points-display streak-display">
            <h3>🔥 Streak</h3>
            <div className="points-number">{gameData.streakDays}</div>
          </div>
        </div>

        <div className="time-display">{timeUntilReset}</div>
      </div>

      <div className="main-content">
        <div className="routine-grid">
          {routines.map(routine => {
            const isCompleted = gameData.completedTasks.includes(routine.id);
            const isGameCompleted = gameData.gameStates[routine.id]?.completed;

            return (
              <div
                key={routine.id}
                className={`routine-card ${isCompleted ? 'completed' : ''} ${isGameCompleted ? 'game-ready' : ''}`}
              >
                <div className="routine-icon">{routine.icon}</div>
                <div className="routine-title">{routine.title}</div>
                <div className="routine-description">{routine.description}</div>

                <div className="game-section">
                  <div className="game-title">{routine.title} Game</div>
                  {renderGameContent(routine)}
                </div>

                <button
                  className={`complete-button ${isCompleted ? 'completed' : ''} ${isGameCompleted && !isCompleted ? 'ready' : ''}`}
                  onClick={() => completeTask(routine.id)}
                  disabled={isCompleted}
                >
                  {isCompleted ? 'Completed! ✅' :
                    isGameCompleted ? 'Ready to Complete! 🎯' :
                      'Complete Task'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="progress-section">
          <h2>Daily Progress</h2>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${getProgress()}%` }}>
              {getProgress()}%
            </div>
          </div>
          <p>
            {gameData.completedTasks.length === 0 ? "Let's start your daily routine! 🌟" :
              gameData.completedTasks.length < routines.length ?
                `${routines.length - gameData.completedTasks.length} more to go! 💪` :
                `🎉 Perfect! You earned ${gameData.dailyPoints} points! 🎉`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;