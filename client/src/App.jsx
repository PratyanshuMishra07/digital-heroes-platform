import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import Charities from './pages/Charities';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-[#F8FAFC]">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1">
        {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
        {activeTab === 'charities' && <Charities />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'admin' && <Admin />}
      </main>

      <footer className="border-t border-[#1E293B] py-8 text-center text-xs text-gray-500">
        <p>© 2026 Digital Heroes. A golf performance & charity draw platform.</p>
        <p className="mt-1">Edition 2026 • Selection Process Sample Assignment</p>
      </footer>
    </div>
  );
}
