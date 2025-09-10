// 🎮 App.js - Main PixelPlay Fitness App File
// This is the main file that holds your entire app together!

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 🔗 Import the Avatar Context Provider
import { AvatarProvider } from "./context/AvatarContext";

// 🎨 Import your PixelPlay components
import PixelPlayAvatarEditor from "./components/PixelPlayAvatarEditor";
import Dashboard from "./components/Dashboard";
import WorkoutPage from "./components/WorkoutPage";
import InventoryPage from "./components/InventoryPage";
import AchievementsPage from "./components/AchievementsPage";
import Navbar from "./components/Navbar";

// 📱 Import styles
import "./styles/AvatarEditor.css";
import "./App.css"; // Your main app styles

function App() {
  return (
    // 🌟 Wrap everything in AvatarProvider so all components can share avatar data
    <AvatarProvider>
      <Router>
        <div className="App">
          {/* 🧭 Navigation bar at the top */}
          <Navbar />

          {/* 🛣️ Different pages/routes in your app */}
          <Routes>
            {/* 🏠 Main dashboard/home page */}
            <Route path="/" element={<Dashboard />} />

            {/* 🎨 Avatar customization page */}
            <Route path="/avatar-editor" element={<PixelPlayAvatarEditor />} />

            {/* 💪 Workout tracking page */}
            <Route path="/workouts" element={<WorkoutPage />} />

            {/* 🎒 Inventory/items page */}
            <Route path="/inventory" element={<InventoryPage />} />

            {/* 🏆 Achievements page */}
            <Route path="/achievements" element={<AchievementsPage />} />
          </Routes>
        </div>
      </Router>
    </AvatarProvider>
  );
}

export default App;
