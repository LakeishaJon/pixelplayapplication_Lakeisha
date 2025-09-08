import React, { useState, useEffect } from 'react';
import '../styles/habittracker.css';

const HabitTracker = () => {
  const [gameData, setGameData] = useState({
    // totalPoints: 0,
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
      icon: '🦷',
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
          },
          {
            question: "What should you drink most throughout the day?",
            options: ["🥤 Soda", "🧃 Juice", "💧 Water", "🥛 Chocolate milk"],
            correct: 2
          },
          {
            question: "Which helps build strong bones?",
            options: ["🍭 Candy", "🥛 Milk", "🍟 Chips", "🥤 Soda"],
            correct: 1
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
          "Water helps carry nutrients to your cells! 🚚",
          "Drinking water improves your mood! 😊",
          "Water helps regulate your body temperature! 🌡️"
        ]
      }
    },
    {
      id: 'tidy-toys',
      title: 'Tidy Up Toys',
      icon: '🧸',
      description: 'Solve a fun math problem about organizing!',
      gameType: 'math',
      gameData: {
        problems: [
          { question: "If you have 12 toys and put 4 in each box, how many boxes do you need?", answer: 3 },
          { question: "You have 15 books. You put 5 on each shelf. How many shelves?", answer: 3 },
          { question: "8 toy cars + 7 toy trucks = ? total vehicles", answer: 15 },
          { question: "If you clean for 10 minutes and rest for 5, then clean 8 more minutes, how many minutes did you clean total?", answer: 18 },
          { question: "You have 20 blocks. You use 8 to build a tower. How many blocks are left?", answer: 12 }
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
        return {
          ...prev,
          lastResetDate: currentDate
        };
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
    
    setTimeUntilReset(`Tasks reset in: ${hours}h ${minutes}m`);
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
      alert('Complete the activity first, then mark it as done! 🎮');
      return;
    }

    setGameData(prev => {
      const newCompletedTasks = [...prev.completedTasks, routineId];
      const newDailyPoints = prev.dailyPoints + 2;
      // const newTotalPoints = prev.totalPoints + 25;

      if (newCompletedTasks.length === routines.length) {
        setTimeout(() => alert('🎉 Congratulations! You completed all tasks! 🎉'), 500);
      }

      return {
        ...prev,
        completedTasks: newCompletedTasks,
        dailyPoints: newDailyPoints,
        // totalPoints: newTotalPoints
      };
    });
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
      alert('Not quite, try again!');
    }
  };

  const selectStep = (routineId, stepIndex) => {
    const routine = routines.find(r => r.id === routineId);
    const expectedStep = sequenceProgress[routineId] || 0;
    
    if (stepIndex === expectedStep) {
      const newProgress = expectedStep + 1;
      setSequenceProgress(prev => ({
        ...prev,
        [routineId]: newProgress
      }));
      
      if (newProgress >= routine.gameData.steps.length) {
        alert('🎉 Perfect! You know how to wash hands properly!');
        enableTaskCompletion(routineId);
      }
    } else {
      alert('Oops! Try the correct order. Think about what comes first!');
    }
  };

  const startTimer = (routineId) => {
    const routine = routines.find(r => r.id === routineId);
    let timeLeft = routine.gameData.duration;
    
    setActiveTimers(prev => ({ ...prev, [routineId]: timeLeft }));
    
    const interval = setInterval(() => {
      timeLeft--;
      setActiveTimers(prev => ({ ...prev, [routineId]: timeLeft }));
      
      if (timeLeft > 0 && timeLeft % 30 === 0) {
        const messages = routine.gameData.encouragementMessages;
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];
        setTimeout(() => alert(randomMessage), 100);
      }
      
      if (timeLeft <= 0) {
        clearInterval(interval);
        setActiveTimers(prev => {
          const newTimers = { ...prev };
          delete newTimers[routineId];
          return newTimers;
        });
        alert('🎉 Perfect brushing! Your teeth are super clean! 🦷✨');
        enableTaskCompletion(routineId);
      }
    }, 1000);
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
          [routineId]: {
            ...prev.gameStates[routineId],
            waterCount: newCount
          }
        }
      }));
      
      const facts = routine.gameData.facts;
      const randomFact = facts[Math.floor(Math.random() * facts.length)];
      setTimeout(() => alert(randomFact), 100);
      
      if (newCount >= routine.gameData.target) {
        setTimeout(() => {
          alert('🎉 Excellent! You reached your goals!');
          enableTaskCompletion(routineId);
        }, 500);
      }
    }
  };

  const initMemoryGame = (routineId) => {
    const routine = routines.find(r => r.id === routineId);
    const cards = routine.gameData.cards;
    const gameCards = [...cards, ...cards].sort(() => Math.random() - 0.5);
    
    setMemoryGame(prev => ({
      ...prev,
      [routineId]: {
        cards: gameCards,
        flippedCards: [],
        matchedCards: [],
        attempts: 0
      }
    }));
  };

  const flipMemoryCard = (routineId, cardIndex) => {
    const game = memoryGame[routineId];
    if (!game || game.flippedCards.length >= 2 || game.flippedCards.includes(cardIndex) || game.matchedCards.includes(cardIndex)) {
      return;
    }

    const newFlippedCards = [...game.flippedCards, cardIndex];
    
    setMemoryGame(prev => ({
      ...prev,
      [routineId]: {
        ...game,
        flippedCards: newFlippedCards
      }
    }));

    if (newFlippedCards.length === 2) {
      const [first, second] = newFlippedCards;
      const firstCard = game.cards[first];
      const secondCard = game.cards[second];
      
      setTimeout(() => {
        if (firstCard === secondCard) {
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
              alert('🎉 Amazing memory! You matched all the cards!');
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

  const checkMathAnswer = (routineId, answer) => {
    const routine = routines.find(r => r.id === routineId);
    const currentProblemIndex = gameData.gameStates[routineId]?.currentProblem || 0;
    const problem = routine.gameData.problems[currentProblemIndex];
    
    if (parseInt(answer) === problem.answer) {
      const nextProblemIndex = currentProblemIndex + 1;
      
      if (nextProblemIndex >= routine.gameData.problems.length) {
        alert('🎉 Excellent math skills! You solved all the problems!');
        enableTaskCompletion(routineId);
      } else {
        setGameData(prev => ({
          ...prev,
          gameStates: {
            ...prev.gameStates,
            [routineId]: {
              ...prev.gameStates[routineId],
              currentProblem: nextProblemIndex,
              score: (prev.gameStates[routineId]?.score || 0) + 1
            }
          }
        }));
        alert('Correct! Next problem...');
      }
    } else {
      alert(`Not quite! The answer is ${problem.answer}. Try the next one!`);
      const nextProblemIndex = currentProblemIndex + 1;
      if (nextProblemIndex < routine.gameData.problems.length) {
        setGameData(prev => ({
          ...prev,
          gameStates: {
            ...prev.gameStates,
            [routineId]: {
              ...prev.gameStates[routineId],
              currentProblem: nextProblemIndex
            }
          }
        }));
      } else {
        alert('🎉 Good effort! You completed all the problems!');
        enableTaskCompletion(routineId);
      }
    }
  };

  const showQuote = (routineId) => {
    const routine = routines.find(r => r.id === routineId);
    const quotes = routine.gameData.quotes;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    alert(randomQuote);
    setTimeout(() => {
      enableTaskCompletion(routineId);
    }, 1000);
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
              {timerActive ? 'Brushing...' : 'Start Brushing Timer'}
            </button>
          </div>
        );

      case 'quiz':
        const currentQuestionIndex = gameData.gameStates[routine.id]?.currentQuestion || 0;
        const question = routine.gameData.questions[currentQuestionIndex];
        const score = gameData.gameStates[routine.id]?.score || 0;
        
        return (
          <div className="game-area">
            <div className="quiz-progress">Question {currentQuestionIndex + 1} of {routine.gameData.questions.length} | Score: {score}</div>
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
            <div>Click the steps in the right order!</div>
            {routine.gameData.steps.map((step, index) => (
              <button
                key={index}
                className={`quiz-option ${index < progress ? 'completed' : index === progress ? 'active' : ''}`}
                onClick={() => selectStep(routine.id, index)}
                disabled={gameData.gameStates[routine.id]?.completed}
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
              <div>Match the pairs to complete the game!</div>
              <button 
                className="game-button" 
                onClick={() => initMemoryGame(routine.id)}
              >
                Start Memory Game
              </button>
            </div>
          );
        }
        
        return (
          <div className="game-area">
            <div className="memory-stats">Attempts: {game.attempts} | Matched: {game.matchedCards.length / 2}/{game.cards.length / 2}</div>
            <div className="memory-grid">
              {game.cards.map((card, index) => (
                <button
                  key={index}
                  className={`memory-card ${
                    game.flippedCards.includes(index) || game.matchedCards.includes(index) ? 'flipped' : ''
                  } ${game.matchedCards.includes(index) ? 'matched' : ''}`}
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
            <div>Drink your water cups!</div>
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

      case 'math':
        const currentProblemIndex = gameData.gameStates[routine.id]?.currentProblem || 0;
        const problem = routine.gameData.problems[currentProblemIndex];
        const mathScore = gameData.gameStates[routine.id]?.score || 0;
        
        return (
          <div className="game-area">
            <div className="math-progress">Problem {currentProblemIndex + 1} of {routine.gameData.problems.length} | Score: {mathScore}</div>
            <div className="math-question">{problem.question}</div>
            <input
              type="number"
              className="math-input"
              placeholder="Your answer"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  checkMathAnswer(routine.id, e.target.value);
                  e.target.value = '';
                }
              }}
              disabled={gameData.gameStates[routine.id]?.completed}
            />
            <button 
              className="game-button"
              onClick={(e) => {
                const input = e.target.previousElementSibling;
                checkMathAnswer(routine.id, input.value);
                input.value = '';
              }}
              disabled={gameData.gameStates[routine.id]?.completed}
            >
              Check Answer
            </button>
          </div>
        );

      default:
        return <div className="game-area">Fun activity coming soon!</div>;
    }
  };

  const getProgress = () => {
    const completed = gameData.completedTasks.length;
    const total = routines.length;
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>🌟 My Routine Tracker 🌟</h1>
        <p>Complete tasks, play games, and earn points!</p>
        
        <div className="points-container">
          <div className="points-display">
            <h3>Today's Points</h3>
            <div className="points-number">{gameData.dailyPoints}</div>
          </div>
          {/* <div className="points-display">
            <h3>Total Points</h3>
            <div className="points-number">{gameData.totalPoints}</div>
          </div> */}
          <div className="points-display streak-display">
            <h3>🔥 Streak</h3>
            <div className="points-number">{gameData.streakDays}</div>
          </div>
        </div>
        
        <div className="time-display">
          {timeUntilReset}
        </div>
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
               `Great job! ${routines.length - gameData.completedTasks.length} more tasks to go! 💪` :
               `🎉 Perfect day! You earned ${gameData.dailyPoints} points! 🎉`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HabitTracker;