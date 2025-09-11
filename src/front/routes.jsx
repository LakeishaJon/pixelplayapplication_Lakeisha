import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import Layout from './pages/Layout';
import Home from './pages/Home';
import AvatarEditorPage from './pages/AvatarEditorPage';
import Dashboard from './pages/Dashboard';
import InventoryPage from './pages/InventoryPage';
import Navigation from './components/Navigation';
import Single from './pages/Single';

export const router = createBrowserRouter(
  createRoutesFromElements(
    // Root Route: All navigation will start from here
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>

      {/* Nested Routes: sub-routes within Layout */}
      <Route index element={<Home />} />  {/* Default route */}
      <Route path="avatar-editor" element={<AvatarEditor />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="inventory" element={<InventoryPage />} />
      <Route path="navigation" element={<Navigation />} />  
      <Route path="single/:theId" element={<Single />} />  {/* Dynamic route for single items */}
      
    </Route>
  )
);
