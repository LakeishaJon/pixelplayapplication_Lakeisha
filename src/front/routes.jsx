import React from "react";
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import GameHub from "./components/GameHub";
import AvatarEditorPage from "./pages/AvatarEditorPage";
import AvatarInventory from "./pages/AvatarInventory";
import InventoryPage from "./pages/InventoryPage";
import StoryCreator from './pages/StoryCreator';

// Create the router configuration with RootLayout wrapping everything
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />, // 🎫 This provides AvatarContext to ALL child routes
    children: [
      {
        index: true, // This makes it the default route for "/"
        element: <Home />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "games",
        element: <GameHub />,
      },
      {
        path: "avatar-editor",
        element: <AvatarEditorPage />, 
      },
      {
        path: "avatar-inventory",
        element: <AvatarInventory />,
      },
      {
        path: "story-creator",
        element: <StoryCreator />,
      },
    ],
  },
]);

export default router;