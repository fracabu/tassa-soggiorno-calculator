import React from 'react';

const Header = ({ darkMode, toggleDarkMode, onLogout, onShowGuida }) => {
  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } rounded-lg border p-6 mb-6`}>
      <div className="flex justify-between items-center">
        <div className="text-center flex-1">
          <h1 className={`text-2xl font-semibold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Calcolatore Tassa di Soggiorno
          </h1>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Roma 2025 • Report Gecos • Multi-Tariffa
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onShowGuida();
            }}
            className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 relative z-10 ${
              darkMode 
                ? 'bg-blue-900 hover:bg-blue-800 text-blue-200 border border-blue-700' 
                : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
            }`}
            title="Guida GECOS"
          >
            <span>📖</span>
            <span>Guida GECOS</span>
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleDarkMode();
            }}
            className={`p-2 rounded-lg relative z-10 ${
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
            className={`px-3 py-2 rounded-lg text-sm font-medium relative z-10 ${
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