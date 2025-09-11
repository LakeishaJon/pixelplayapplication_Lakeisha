import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ 
  current, 
  max, 
  label, 
  color = '#4CAF50',
  height = 10,
  showPercentage = false,
  animated = true 
}) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="progress-bar-container">
      <div 
        className="progress-bar-track"
        style={{ height: `${height}px` }}
      >
        <div 
          className={`progress-bar-fill ${animated ? 'animated' : ''}`}
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color
          }}
        />
      </div>
      
      {label && (
        <div className="progress-bar-label">
          {label}
          {showPercentage && ` (${Math.round(percentage)}%)`}
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
