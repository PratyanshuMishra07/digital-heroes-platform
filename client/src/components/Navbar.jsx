import React from 'react';

export default function Navbar({ activeTab, setActiveTab }) {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0B0F17]/85 border-b border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#E0B589] to-[#F3E8DF] flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-[#E0B589]/20">
            DH
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-white">digital.<span className="text-[#E0B589]">HEROES</span></span>
            <p className="text-[10px] tracking-wider uppercase text-gray-400 font-medium -mt-1">Play. Give. Win.</p>
          </div>
        </div>

        <nav className="flex items-center space-x-1 sm:space-x-3 text-sm font-medium">
          <button
            onClick={() => setActiveTab('home')}
            className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'home' ? 'text-[#E0B589] bg-[#1E293B]' : 'text-gray-300 hover:text-white'}`}
          >
            Mission
          </button>
          <button
            onClick={() => setActiveTab('charities')}
            className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'charities' ? 'text-[#E0B589] bg-[#1E293B]' : 'text-gray-300 hover:text-white'}`}
          >
            Charity Directory
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-3 py-2 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'text-[#E0B589] bg-[#1E293B]' : 'text-gray-300 hover:text-white'}`}
          >
            User Dashboard
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${activeTab === 'admin' ? 'bg-[#E0B589] text-black shadow-md' : 'text-gray-400 hover:text-white border border-[#1E293B]'}`}
          >
            Admin Panel
          </button>
        </nav>
      </div>
    </header>
  );
}
