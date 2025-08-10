import React from 'react';
import { 
  LockClosedIcon, 
  BoltIcon,
  BookOpenIcon,
  SunIcon,
  MoonIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const Header = ({ darkMode, toggleDarkMode, onLogout, onShowGuida }) => {
  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } rounded-lg border p-3 mb-2 overflow-x-hidden`}>
      {/* Mobile-first layout: stack vertically on small screens */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center w-full overflow-x-hidden">
        <div className="text-center sm:text-left">
          <h1 className={`text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-semibold mb-1 sm:mb-2 break-words ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Calcolatore Tassa di Soggiorno
          </h1>
          <p className={`text-base sm:text-lg lg:text-xl ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Italia 2025 • Multi-Comune • Report CSV/PDF
          </p>
          
          {/* Badges */}
          <div className="mt-3 flex flex-wrap gap-2">
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
              darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
            } shadow-sm`}>
              <LockClosedIcon className="w-4 h-4 mr-2" />
              <span>0% Commissioni</span>
            </div>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
              darkMode ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'
            } shadow-sm`}>
              <BoltIcon className="w-4 h-4 mr-2" />
              <span>SEO Ottimizzato</span>
            </div>
          </div>
        </div>
        
        {/* Mobile-first buttons: horizontal on mobile, with better touch targets */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onShowGuida();
            }}
            className={`px-3 py-3 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2 relative z-10 min-h-[44px] sm:min-h-0 ${
              darkMode 
                ? 'bg-blue-900 hover:bg-blue-800 text-blue-200 border border-blue-700' 
                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
            }`}
            title="Guida GECOS"
          >
            <span className="text-sm sm:text-base">📖</span>
            <span className="hidden sm:inline">Guida</span>
            <span className="sm:hidden">📖</span>
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleDarkMode();
            }}
            className={`p-3 sm:p-2 rounded-lg relative z-10 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 flex items-center justify-center ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
            title={darkMode ? 'Modalità Chiara' : 'Modalità Scura'}
          >
            <span className="text-lg">{darkMode ? '☀️' : '🌙'}</span>
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onLogout();
            }}
            className={`px-3 py-3 sm:px-3 sm:py-2 rounded-lg text-xs sm:text-sm font-medium relative z-10 min-h-[44px] sm:min-h-0 ${
              darkMode 
                ? 'bg-red-900 hover:bg-red-800 text-red-200 border border-red-700' 
                : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
            }`}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;