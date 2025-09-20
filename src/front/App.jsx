
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { AvatarProvider } from './Context/AvatarContext'; 
import router from './router';
import '../styles/Avatar.css'; 

function App() {
  return (
    <div className="App">
      {/* 🎫 AvatarProvider: Gives ALL pages access to avatar features */}
      <AvatarProvider>
        {/* 🛣️ RouterProvider: Handles all page navigation using your router.js */}
        <RouterProvider router={router} />
      </AvatarProvider>
    </div>
  );
}

export default App;