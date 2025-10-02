import React from "react";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "./components/RootLayout";
import ProtectedRoute from "./Contexts/ProtectedRoute";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import GameHub from "./components/GameHub";
import AvatarEditorPage from "./pages/AvatarEditorPage";
import AvatarInventory from "./pages/AvatarInventory";
import InventoryPage from "./pages/InventoryPage";
import StoryCreator from "./pages/StoryCreator";

// Create the router configuration
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />, // Redirect root to login
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "games",
        element: (
          <ProtectedRoute>
            <GameHub />
          </ProtectedRoute>
        ),
      },
      {
        path: "avatar-editor",
        element: (
          <ProtectedRoute>
            <AvatarEditorPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "avatar-inventory",
        element: (
          <ProtectedRoute>
            <AvatarInventory />
          </ProtectedRoute>
        ),
      },
      {
        path: "inventory",
        element: (
          <ProtectedRoute>
            <InventoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "story-creator",
        element: (
          <ProtectedRoute>
            <StoryCreator />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/login" replace />, // Catch-all for unknown routes
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default router;