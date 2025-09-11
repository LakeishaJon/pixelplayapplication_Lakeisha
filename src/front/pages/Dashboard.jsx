// src/front/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import { useAvatar } from '../Contexts/AvatarContext.jsx';
import AvatarDisplay from '../components/AvatarDisplay.jsx';

const Dashboard = ({ onNavigate }) => {
  const {
    userStats,
    currentAvatar,
    notifications,
    addPoints,
    completeWorkout,
    unlockItem,
    clearNotification
  } = useAvatar();

  // Simulate completing a workout (for demo)
  const handleWorkout = (minutes, points) => {
    completeWorkout(minutes);
    addPoints(points);
  };

  useEffect(() => {
    if (notifications.length > 0) {
      console.log('New notification:', notifications[0]);
    }
  }, [notifications]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="avatar-section">
        <AvatarDisplay avatar={currentAvatar} size={150} showLevel={true} level={userStats.level} />
      </div>

      <div className="stats">
        <p>Level: {userStats.level}</p>
        <p>Points: {userStats.points}</p>
        <p>Workouts Completed: {userStats.workoutsCompleted}</p>
        <p>Total Minutes Exercised: {userStats.totalMinutesExercised}</p>
      </div>

      <div className="dashboard-actions">
        <button onClick={() => handleWorkout(30, 50)}>🏃 Complete 30-min Workout (+50 points)</button>
        <button onClick={() => onNavigate('editor')}>🎨 Customize Avatar</button>
        <button onClick={() => onNavigate('inventory')}>🎒 View Collection</button>
      </div>
    </div>
  );
};

export default Dashboard;
