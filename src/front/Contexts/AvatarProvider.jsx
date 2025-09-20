// App.jsx or Main.jsx - The main file that runs your app
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AvatarProvider } from './Contexts/AvatarContext'; 
import AvatarEditorPage from './pages/AvatarEditorPage';
import Dashboard from './pages/Dashboard';
// ... other imports

function App() {
  return (
    <div className="App">
      {/* Step 1: Wrap everything in the AvatarProvider "membership card" */}
      <AvatarProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Now AvatarEditorPage can access avatar stuff! */}
            <Route path="/avatar-editor" element={<AvatarEditorPage />} />
            {/* ... other routes */}
          </Routes>
        </Router>
      </AvatarProvider>
    </div>
  );
}

export default App;