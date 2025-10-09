import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpenIcon,
  SunIcon,
  MoonIcon,
  ArrowRightStartOnRectangleIcon,
  BuildingOffice2Icon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Header = ({ darkMode, toggleDarkMode, onLogout, onShowGuida }) => {
  const navigate = useNavigate();

  // Verifica se l'utente è admin (controllando email dal localStorage)
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const adminEmails = ['fracabu@gmail.com', 'admin@tassasoggiorno.it', 'admin@test.it'];
  const isAdmin = user.email && adminEmails.includes(user.email);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${
      darkMode ? 'bg-gray-800/95 border-gray-700' : 'bg-white/95 border-gray-200'
    } border-b backdrop-blur-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
            <img
              src="/logo.svg"
              alt="Tassa Soggiorno Logo"
              className="w-10 h-10 rounded-lg"
            />
            <span className={`text-xl sm:text-2xl font-extrabold tracking-tight ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`} style={{ fontFamily: "'Inter', 'SF Pro Display', -apple-system, sans-serif", letterSpacing: '-0.02em' }}>
              TourTax
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className={`p-2 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1 transition-colors ${
                  darkMode
                    ? 'hover:bg-gray-700 text-indigo-400'
                    : 'hover:bg-gray-100 text-indigo-600'
                }`}
                title="Pannello Admin"
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            )}

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onShowGuida();
              }}
              className={`p-2 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1 transition-colors ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-300'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
              title="Guida"
            >
              <BookOpenIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Guida</span>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleDarkMode();
              }}
              className={`p-2 rounded-lg transition-colors ${
                darkMode
                  ? 'hover:bg-gray-700 text-yellow-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={darkMode ? 'Modalità Chiara' : 'Modalità Scura'}
            >
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onLogout();
              }}
              className={`p-2 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1 transition-colors ${
                darkMode
                  ? 'hover:bg-gray-700 text-red-300'
                  : 'hover:bg-gray-100 text-red-600'
              }`}
            >
              <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Esci</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;