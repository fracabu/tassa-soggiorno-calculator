import React, { useState } from 'react';
import { 
  BuildingOfficeIcon, 
  LockClosedIcon, 
  GiftIcon, 
  DocumentTextIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  SunIcon,
  MoonIcon,
  HomeIcon
} from '@heroicons/react/24/outline';
import GuidePage from './GuidePage';

const LoginScreen = ({ onLogin, darkMode, toggleDarkMode }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  const validCredentials = {
    username: process.env.REACT_APP_ADMIN_USERNAME || 'admin',
    password: process.env.REACT_APP_ADMIN_PASSWORD || 'gecos2024'
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
    <div className={`min-h-screen flex items-center justify-center p-2 sm:p-4 relative overflow-x-hidden ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      
      <div className={`max-w-6xl w-full max-h-[95vh] overflow-y-auto overflow-x-hidden ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl sm:rounded-2xl shadow-xl border p-4 sm:p-6 lg:p-8 relative`}>
        
        {/* Header section con badge ai lati */}
        <div className="text-center mb-4 sm:mb-6 relative">
          {/* Badge ai lati dell'header - Solo desktop */}
          <div className="hidden lg:block">
            {/* Badge Privacy - Sinistra */}
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2">
              <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-full shadow-lg transition-all duration-200 hover:scale-105 ${
                darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
              }`}>
                <LockClosedIcon className="w-5 h-5 mr-2" />
                100% PRIVACY
              </span>
            </div>
            
            {/* Badge Free - Destra */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
              <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-full shadow-lg transition-all duration-200 hover:scale-105 ${
                darkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
              }`}>
                <GiftIcon className="w-5 h-5 mr-2" />
                100% FREE
              </span>
            </div>
          </div>
          
          <div className="mb-2 sm:mb-3">
            <BuildingOfficeIcon className={`w-12 h-12 sm:w-16 sm:h-16 mx-auto ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          </div>
          <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2 sm:mb-3 px-2`}>
            Calcolatore Tassa di Soggiorno
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-base sm:text-lg px-2`}>
            Calcolo Automatico Tasse di Soggiorno • 🇮🇹 Tutti i Comuni
          </p>
          
          {/* Mobile badges - Sotto il titolo */}
          <div className="lg:hidden flex flex-wrap justify-center gap-3 mt-4">
            <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-full shadow-md transition-all duration-200 ${
              darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'
            }`}>
              <LockClosedIcon className="w-4 h-4 mr-2" />
              100% PRIVACY
            </span>
            <span className={`inline-flex items-center px-4 py-2 text-sm font-bold rounded-full shadow-md transition-all duration-200 ${
              darkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white'
            }`}>
              <GiftIcon className="w-4 h-4 mr-2" />
              100% FREE
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 items-start flex-1">
          {/* Column 1 - Login form */}
          <div className="space-y-4 order-1 lg:order-3">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className={`block text-base sm:text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 sm:mb-3`}>
                  Username
                </label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                  className={`w-full p-3 sm:p-4 text-base sm:text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px] ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Inserisci username"
                  required
                />
              </div>
              
              <div>
                <label className={`block text-base sm:text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2 sm:mb-3`}>
                  Password
                </label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                  className={`w-full p-3 sm:p-4 text-base sm:text-lg border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[48px] ${
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
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 sm:py-4 px-6 text-base sm:text-lg rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold min-h-[48px]"
              >
                Accedi al Sistema
              </button>
            </form>
            
            {/* Dark mode toggle */}
            <div className={`pt-3 sm:pt-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
              <button
                onClick={toggleDarkMode}
                className={`w-full flex items-center justify-center space-x-2 text-base sm:text-lg py-2 sm:py-3 rounded-lg min-h-[44px] transition-all duration-200 ${
                  darkMode 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-600 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                {darkMode ? <SunIcon className="w-5 h-5 sm:w-6 sm:h-6" /> : <MoonIcon className="w-5 h-5 sm:w-6 sm:h-6" />}
                <span>{darkMode ? 'Modalità Chiara' : 'Modalità Scura'}</span>
              </button>
            </div>
          </div>
          
          {/* Column 2 - Privacy Information */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-2">
            {/* Privacy Information */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-50 border border-gray-200'}`}>
              <div className="flex items-start space-x-3">
                <ShieldCheckIcon className="w-6 h-6 text-green-600 flex-shrink-0" />
                <div>
                  <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    Massima Privacy Garantita
                  </h4>
                  <ul className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                    <li>• File elaborati solo nel browser</li>
                    <li>• Nessun invio a server esterni</li>
                    <li>• Zero tracciamento dati</li>
                    <li>• Conforme GDPR</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Free Information */}
            <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900/20 border border-purple-700' : 'bg-purple-50 border border-purple-200'}`}>
              <div className="flex items-start space-x-3">
                <GiftIcon className="w-6 h-6 text-purple-600 flex-shrink-0" />
                <div>
                  <h4 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                    100% Gratuito Sempre
                  </h4>
                  <ul className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} space-y-1`}>
                    <li>• Nessun costo nascosto</li>
                    <li>• Zero commissioni sui calcoli</li>
                    <li className={`font-bold text-base ${darkMode ? 'text-purple-300' : 'text-purple-700'} bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 px-2 py-1 rounded-md`}>
                      🇮🇹 • TUTTI I COMUNI ITALIANI
                    </li>
                    <li>• Export illimitato</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Column 3 - Guide and Info */}
          <div className="space-y-4 order-3 lg:order-1 lg:col-span-2 xl:col-span-1">
            <button
              onClick={() => setShowGuide(true)}
              className={`w-full flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-medium transition-all duration-200 border-2 min-h-[48px] ${
                darkMode 
                  ? 'border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-gray-900' 
                  : 'border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white'
              }`}
            >
              <DocumentTextIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Come Funziona</span>
            </button>
            
            <div className={`text-center p-4 sm:p-6 rounded-lg ${darkMode ? 'bg-blue-900/20' : 'bg-blue-50'}`}>
              <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4">
                <EnvelopeIcon className={`w-5 h-5 mb-1 sm:mb-0 sm:mr-2 ${darkMode ? 'text-blue-200' : 'text-blue-700'}`} />
                <p className={`text-base sm:text-lg ${darkMode ? 'text-blue-200' : 'text-blue-700'} font-medium text-center`}>
                  Credenziali inviate immediatamente via email
                </p>
              </div>
              <button
                onClick={() => window.open('mailto:info@ospitly.it?subject=Richiesta Credenziali Calcolatore Tassa Soggiorno&body=Salve,%0A%0Avorrei richiedere le credenziali di accesso per il Calcolatore Tassa di Soggiorno.%0A%0AGrazie', '_blank')}
                className={`w-full flex items-center justify-center space-x-2 px-4 sm:px-6 py-3 rounded-lg text-base sm:text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl min-h-[48px] ${
                  darkMode 
                    ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                    : 'bg-orange-500 hover:bg-orange-600 text-white'
                }`}
              >
                <EnvelopeIcon className="w-5 h-5" />
                <span>Richiedi Credenziali</span>
              </button>
              <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-600'} mt-3`}>
                Scrivi a <span className="font-mono font-semibold text-xs sm:text-sm">info@ospitly.it</span>
              </p>
            </div>
          </div>
        </div>
        
        {/* Made by hosts for hosts */}
        <div className="text-center mt-4 sm:mt-6">
          <div className="flex items-center justify-center">
            <HomeIcon className={`w-4 h-4 mr-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} italic`}>
              Made by hosts, for hosts
            </p>
          </div>
        </div>
      </div>
      
      {/* Guide Modal */}
      <GuidePage 
        isOpen={showGuide}
        onClose={() => setShowGuide(false)}
        darkMode={darkMode}
      />
    </div>
  );
};

export default LoginScreen;