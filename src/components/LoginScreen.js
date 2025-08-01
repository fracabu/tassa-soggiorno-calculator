import React, { useState } from 'react';

const LoginScreen = ({ onLogin, darkMode, toggleDarkMode }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const validCredentials = {
    username: 'admin',
    password: 'gecos2024'
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username === validCredentials.username && 
        credentials.password === validCredentials.password) {
      onLogin();
    } else {
      alert('Credenziali non valide');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className={`max-w-md w-full mx-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl border p-8`}>
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🏨</div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Calcolatore Tassa di Soggiorno
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            Accesso Riservato • Versione Pro
          </p>
          <div className={`mt-4 p-3 rounded-lg ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-blue-50 border border-blue-200'}`}>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-blue-700'} font-medium mb-1`}>
              Credenziali di accesso:
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-blue-600'}`}>
              Username: <span className="font-mono font-semibold">admin</span>
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-blue-600'}`}>
              Password: <span className="font-mono font-semibold">gecos2024</span>
            </p>
          </div>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Inserisci username"
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Inserisci password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
          >
            Accedi al Sistema
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center justify-center space-x-2 text-sm ${
              darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
            } transition-colors`}
          >
            <span>{darkMode ? '☀️' : '🌙'}</span>
            <span>{darkMode ? 'Modalità Chiara' : 'Modalità Scura'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;