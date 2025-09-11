// src/front/pages/Home.jsx
import React, { useState } from 'react';
import { AvatarProvider } from '../Contexts/AvatarContext.jsx';
import Navigation from '../components/Navigation.jsx';
import Dashboard from './Dashboard.jsx';
import AvatarEditorPage from './AvatarEditorPage.jsx';
import AvatarInventory from './AvatarInventory.jsx';
import '../styles/global.css';
import '../styles/variables.css';

const Home = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'editor':
        return <AvatarEditorPage onNavigate={handleNavigate} />;
      case 'inventory':
        return <InventoryPage onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <AvatarProvider>
      <div className="app">
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="main-content">{renderCurrentPage()}</main>
      </div>
    </AvatarProvider>
  );
};

export default Home;
