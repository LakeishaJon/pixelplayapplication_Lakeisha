import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Single } from "./pages/Single";
import { Demo } from "./pages/Demo";
import { AvatarDemo } from "./pages/AvatarDemo";
import { AvatarDashboard } from "./pages/AvatarDashboard";
import { Dashboard } from "./pages/Dashboard";
import { StoryGenerator } from "./pages/StoryGenerator";
import { MyStories } from "./pages/MyStories";
import { Profile } from "./pages/Profile";
import { StoryTemplates } from "./pages/StoryTemplates";
import { Community } from "./pages/Community";
import { AuthPage } from "./pages/AuthPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes */}
      <Route path="/auth" element={<AuthPage />} />

      {/* Protected Routes with Layout */}
      <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >
        {/* Main Dashboard - Protected */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />

        {/* Story-related Routes - Protected */}
        <Route path="/story-generator" element={
          <ProtectedRoute>
            <StoryGenerator />
          </ProtectedRoute>
        } />

        <Route path="/my-stories" element={
          <ProtectedRoute>
            <MyStories />
          </ProtectedRoute>
        } />

        <Route path="/story-templates" element={
          <ProtectedRoute>
            <StoryTemplates />
          </ProtectedRoute>
        } />

        <Route path="/community" element={
          <ProtectedRoute>
            <Community />
          </ProtectedRoute>
        } />

        {/* User Profile - Protected */}
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />

        {/* Avatar System Routes - Protected */}
        <Route path="/avatar-dashboard" element={
          <ProtectedRoute>
            <AvatarDashboard />
          </ProtectedRoute>
        } />

        {/* Legacy/Demo Routes - Can be public or protected as needed */}
        <Route path="/avatars" element={<AvatarDemo />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/home" element={<Home />} />
        <Route path="/single/:theId" element={<Single />} />
      </Route>
    </>
  )
);