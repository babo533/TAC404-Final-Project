import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { usePlayer } from '../context/PlayerContext';

const Navigation = () => {
  const { theme, toggleTheme } = useTheme();
  const { players, currentUser, switchPlayer, createProfile } = usePlayer();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfilePosition, setNewProfilePosition] = useState('');

  const navLinkClass = ({ isActive }) =>
    `px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-slate-900 text-white shadow-md transform scale-105 dark:bg-indigo-600 dark:text-white'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
    }`;

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!newProfileName || !newProfilePosition) return;

    const success = await createProfile(newProfileName, newProfilePosition);
    if (success) {
      setNewProfileName('');
      setNewProfilePosition('');
      setShowCreateForm(false);
      setIsDropdownOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight dark:text-white hidden sm:block">
                Soccer<span className="text-indigo-600 dark:text-indigo-400">Log</span>
              </h1>
            </div>

            {/* Player Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <div className="w-6 h-6 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-xs font-bold">
                  {currentUser?.name?.charAt(0)}
                </div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                  {currentUser?.name || 'Loading...'}
                </span>
                <span className="text-xs text-slate-400">▼</span>
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 animate-fade-in z-50">
                  {!showCreateForm ? (
                    <>
                      <div className="mb-2 px-2 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Switch Profile
                      </div>
                      {players.map((player) => (
                        <button
                          key={player.id}
                          onClick={() => {
                            switchPlayer(player.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                            currentUser?.id === player.id
                              ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          <span>{player.name}</span>
                          {currentUser?.id === player.id && <span>✓</span>}
                        </button>
                      ))}
                      <div className="border-t border-slate-100 dark:border-slate-700 my-2"></div>
                      <button
                        onClick={() => setShowCreateForm(true)}
                        className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 flex items-center gap-2"
                      >
                        <span>+ Create New Profile</span>
                      </button>
                    </>
                  ) : (
                    <div className="p-2">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">
                          New Profile
                        </span>
                        <button
                          onClick={() => setShowCreateForm(false)}
                          className="text-xs text-slate-400 hover:text-slate-600"
                        >
                          Cancel
                        </button>
                      </div>
                      <form onSubmit={handleCreateSubmit} className="space-y-3">
                        <input
                          type="text"
                          placeholder="Player Name"
                          value={newProfileName}
                          onChange={(e) => setNewProfileName(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white outline-none focus:border-indigo-500"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Position (e.g. Striker)"
                          value={newProfilePosition}
                          onChange={(e) => setNewProfilePosition(e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-slate-200 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white outline-none focus:border-indigo-500"
                          required
                        />
                        <button
                          type="submit"
                          className="w-full py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700"
                        >
                          Create
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex space-x-1">
              <NavLink to="/" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/games" className={navLinkClass}>
                Games
              </NavLink>
              <NavLink to="/goals" className={navLinkClass}>
                Goals
              </NavLink>
              <NavLink to="/statistics" className={navLinkClass}>
                Stats
              </NavLink>
            </div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Menu (Simplified) */}
      <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-x-auto">
        <div className="flex p-2 space-x-2">
          <NavLink to="/" className={navLinkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/games" className={navLinkClass}>
            Games
          </NavLink>
          <NavLink to="/goals" className={navLinkClass}>
            Goals
          </NavLink>
          <NavLink to="/statistics" className={navLinkClass}>
            Stats
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
