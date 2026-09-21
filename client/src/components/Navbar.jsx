import React, { useState } from "react";

export default function Navbar({ activeTab, setActiveTab }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Mission" },
    { id: "charities", label: "Charities" },
    { id: "dashboard", label: "Dashboard" },
    { id: "admin", label: "Admin" },
  ];

  const handleNav = (id) => {
    setActiveTab(id);
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0B0F17]/85 border-b border-[#1E293B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => handleNav("home")}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#E0B589] to-[#F3E8DF] flex items-center justify-center font-bold text-black text-lg shadow-lg shadow-[#E0B589]/20">
            DH
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">
              digital.<span className="text-[#E0B589]">HEROES</span>
            </span>
            <p className="text-[9px] tracking-wider uppercase text-gray-400 font-medium -mt-0.5">
              Play. Give. Win.
            </p>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                activeTab === item.id
                  ? "text-[#E0B589] bg-[#1E293B]"
                  : "text-gray-300 hover:text-white"
              } ${
                item.id === "admin"
                  ? "text-xs font-semibold uppercase tracking-wider border border-[#1E293B]"
                  : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded-lg hover:bg-[#1E293B] transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-0.5 bg-white transition-transform duration-200 ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[#1E293B] bg-[#0B0F17]/95 px-4 py-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === item.id
                  ? "text-[#E0B589] bg-[#1E293B]"
                  : "text-gray-300 hover:text-white hover:bg-[#1E293B]/50"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
