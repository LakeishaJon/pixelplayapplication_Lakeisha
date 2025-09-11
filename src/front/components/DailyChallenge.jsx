import React from 'react';
import { useAvatar } from '../../context/AvatarContext';
import ProgressBar from './ProgressBar';
import './DailyChallenge.css';

const DailyChallenge = ({ challenge }) => {
  const { updateDailyChallenge, addPoints } = useAvatar();

  const handleCompleteChallenge = () => {
    const remaining = challenge.target - challenge.progress;
    updateDailyChallenge(remaining);
    
    if (!challenge.completed) {
      addPoints(challenge.points);
    }
  };

  const progressPercentage = (challenge.progress / challenge.target) * 100;

  return (
    <div className="daily-challenge">
      <div className="challenge-header">
        <h3>🎯 Daily Challenge</h3>
        <span className={`challenge-status ${challenge.completed ? 'completed' : 'active'}`}>
          {challenge.completed ? '✅ Complete' : '🔥 Active'}
        </span>
      </div>

      <div className="challenge-content">
        <h4 className="challenge-title">{challenge.title}</h4>
        <p className="challenge-description">{challenge.description}</p>

        <div className="challenge-progress">
          <ProgressBar
            current={challenge.progress}
            max={challenge.target}
            label={`${challenge.progress} / ${challenge.target}`}
            color={challenge.completed ? '#4CAF50' : '#FF9800'}
            height={12}
            animated={!challenge.completed}
          />
        </div>

        <div className="challenge-reward">
          <span className="reward-text">Reward: +{challenge.points} points</span>
        </div>

        {!challenge.completed && (
          <button
            onClick={handleCompleteChallenge}
            className="challenge-button"
          >
            Complete Challenge 🚀
          </button>
        )}

        {challenge.completed && (
          <div className="challenge-completed">
            <span>🎉 Great job! Challenge completed!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyChallenge;
