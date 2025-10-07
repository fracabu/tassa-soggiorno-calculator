import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

// Components
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import ResetPassword from './components/ResetPassword';
import PrivateRoute from './components/PrivateRoute';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import CookiePolicy from './components/CookiePolicy';
import AdminPage from './components/AdminPage';
import Header from './components/Header';
import ConfigPanel from './components/ConfigPanel';
import FileUpload from './components/FileUpload';
import ResultsCards from './components/ResultsCards';
import BookingsTable from './components/BookingsTable';
import GuidaGECOS from './components/GuidaGECOS';
import InfoFooter from './components/InfoFooter';

// Business Logic Hook
import useBookingProcessor from './hooks/useBookingProcessor';

// Database Comuni Italiani
import { comuniItaliani, getTuttiComuni, getTariffaPerComune } from './data/comuniItaliani';

// API Service
import { logout as apiLogout, isAuthenticated as checkAuth } from './services/api';

const TassaSoggiornoCalculator = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showGuida, setShowGuida] = useState(false);
  const [comuneSelezionato, setComuneSelezionato] = useState('Roma');
  
  // Custom hook for all booking processing logic
  const {
    prenotazioni,
    results,
    error,
    isProcessing,
    tariffePersonalizzate,
    setTariffePersonalizzate,
    filtroMese,
    setFiltroMese,
    datiMensili,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    esenzioniManuali,
    toggleEsenzione,
    clearEsenzioni,
    handleFileUpload,
    exportResultsCSV,
    exportResultsPDF,
    getCountryName,
    resetData
  } = useBookingProcessor(comuneSelezionato);

  // Check auth e theme on mount
  useEffect(() => {
    setIsAuthenticated(checkAuth());

    const savedTheme = localStorage.getItem('darkMode');
    if (savedTheme === 'true') {
      setDarkMode(true);
    }
  }, []);

  const handleRegisterSuccess = (data) => {
    setIsAuthenticated(true);
    navigate('/app');
  };

  const handleLoginSuccess = (data) => {
    setIsAuthenticated(true);
    navigate('/app');
  };

  const handleLogout = () => {
    apiLogout();
    setIsAuthenticated(false);
    navigate('/');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  return (
    <Routes>
      {/* Home - Landing Page pubblica */}
      <Route
        path="/"
        element={
          <LandingPage
            onRegisterSuccess={handleRegisterSuccess}
            darkMode={darkMode}
          />
        }
      />

      {/* Rotta Login */}
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/app" replace />
          ) : (
            <LoginPage
              onLoginSuccess={handleLoginSuccess}
              darkMode={darkMode}
            />
          )
        }
      />

      {/* Rotta Reset Password */}
      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* Rotte Legali */}
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/cookie-policy" element={<CookiePolicy />} />

      {/* Rotta Admin */}
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <AdminPage darkMode={darkMode} />
          </PrivateRoute>
        }
      />

      {/* Rotta Register - mostra landing page con form registrazione */}
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/app" replace />
          ) : (
            <LandingPage
              onRegisterSuccess={handleRegisterSuccess}
              darkMode={darkMode}
            />
          )
        }
      />

      {/* Rotta Calcolatore - richiede autenticazione */}
      <Route
        path="/app"
        element={
          <PrivateRoute>
    <div className={`min-h-screen overflow-x-hidden ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onLogout={handleLogout}
        onShowGuida={() => setShowGuida(true)}
      />

      <div className="pt-20 px-2 sm:px-4 pb-4">
        <div className="max-w-7xl mx-auto w-full flex flex-col overflow-x-hidden">
          <div className={`mb-4 sm:mb-6 overflow-x-hidden ${
            !prenotazioni.length ? 'flex items-center justify-center min-h-[calc(100vh-6rem)]' : ''
          }`}>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 w-full ${
              !prenotazioni.length ? 'max-w-6xl' : ''
            }`}>
          {/* Step 1: Configurazione */}
          <div className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-lg border p-4 sm:p-6 w-full flex flex-col overflow-x-hidden ${
            !prenotazioni.length ? 'min-h-[280px] sm:aspect-square' : 'min-h-[200px]'
          }`}>
            <div className="text-center mb-4">
              <span className={`inline-flex w-8 h-8 rounded-full items-center justify-center text-sm font-bold mb-2 ${
                darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
              }`}>1</span>
              <h3 className={`text-lg font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Seleziona Comune
              </h3>
              <p className={`text-base mt-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Regole automatiche per comune
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center space-y-3">
              {/* Dropdown Comuni */}
              <select 
                value={comuneSelezionato}
                onChange={(e) => {
                  const nuovoComune = e.target.value;
                  setComuneSelezionato(nuovoComune);
                  // Aggiorna automaticamente la tariffa
                  const tariffa = getTariffaPerComune(nuovoComune);
                  if (tariffa) {
                    setTariffePersonalizzate(tariffa);
                  }
                }}
                className={`w-full p-3 rounded-lg border text-base ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                {getTuttiComuni().map(comune => (
                  <option key={comune.nome_comune} value={comune.nome_comune}>
                    {comune.nome_comune} ({comune.regione})
                  </option>
                ))}
                <option value="custom">🔧 Configurazione personalizzata</option>
              </select>

              {/* Input personalizzato */}
              {comuneSelezionato === 'custom' && (
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="50"
                  value={tariffePersonalizzate}
                  onChange={(e) => setTariffePersonalizzate(parseFloat(e.target.value) || 0)}
                  placeholder="Importo €"
                  className={`w-full p-3 rounded-lg border text-base ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              )}
              
              {/* Info Comune Selezionato */}
              {comuneSelezionato !== 'custom' && comuniItaliani[comuneSelezionato] && (
                <div className={`text-center p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className={`text-lg font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>€{tariffePersonalizzate.toFixed(2)}</div>
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>per persona/notte</div>
                  <div className={`text-sm mt-1 ${
                    darkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Max {comuniItaliani[comuneSelezionato].max_notti_tassabili} notti • 
                    Esenti &lt;{comuniItaliani[comuneSelezionato].esenzione_eta} anni
                  </div>
                </div>
              )}

              {/* Info Personalizzata */}
              {comuneSelezionato === 'custom' && (
                <div className={`text-center p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <div className={`text-lg font-bold ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>€{tariffePersonalizzate.toFixed(2)}</div>
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>per persona/notte</div>
                  <div className={`text-sm mt-1 ${
                    darkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Configurazione personalizzata
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Upload File */}
          <div className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-lg border p-4 sm:p-6 w-full flex flex-col overflow-hidden ${
            !prenotazioni.length ? 'min-h-[280px] sm:aspect-square' : 'min-h-[200px]'
          }`}>
            <div className="text-center mb-4">
              <span className={`inline-flex w-8 h-8 rounded-full items-center justify-center text-sm font-bold mb-2 ${
                prenotazioni.length > 0 
                  ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600')
                  : (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600')
              }`}>{prenotazioni.length > 0 ? '✓' : '2'}</span>
              <h3 className={`text-lg font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Carica File
              </h3>
              <p className={`text-base mt-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Excel/CSV da Booking o Airbnb
              </p>
            </div>

            <div className="flex-1">
              {!prenotazioni.length ? (
                <FileUpload 
                  darkMode={darkMode}
                  error={error}
                  isProcessing={isProcessing}
                  onFileUpload={handleFileUpload}
                />
              ) : (
                <div className={`flex flex-col items-center justify-center h-full text-center ${
                  darkMode ? 'text-green-300' : 'text-green-600'
                }`}>
                  <div className="text-4xl mb-2">✅</div>
                  <p className="text-base font-medium">File caricato</p>
                  <p className="text-sm">{prenotazioni.length} prenotazioni</p>
                  <button
                    onClick={resetData}
                    className={`mt-3 text-sm px-4 py-2 rounded-lg min-h-[36px] transition-colors ${
                      darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    Cambia file
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Risultati */}
          <div className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-lg border p-4 sm:p-6 w-full flex flex-col overflow-x-hidden ${
            !prenotazioni.length ? 'min-h-[280px] sm:aspect-square md:col-span-2 lg:col-span-1' : 'min-h-[200px]'
          }`}>
            <div className="text-center mb-4">
              <span className={`inline-flex w-8 h-8 rounded-full items-center justify-center text-sm font-bold mb-2 ${
                results 
                  ? (darkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-600')
                  : (darkMode ? 'bg-gray-600 text-gray-400' : 'bg-gray-100 text-gray-400')
              }`}>{results ? '✓' : '3'}</span>
              <h3 className={`text-lg font-semibold ${
                results 
                  ? (darkMode ? 'text-white' : 'text-gray-900')
                  : (darkMode ? 'text-gray-400' : 'text-gray-400')
              }`}>
                Scarica Report
              </h3>
              <p className={`text-base mt-2 ${
                results 
                  ? (darkMode ? 'text-gray-300' : 'text-gray-600')
                  : (darkMode ? 'text-gray-500' : 'text-gray-400')
              }`}>
                CSV/PDF con calcoli dettagliati
              </p>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              {!results ? (
                <div className={`text-center ${
                  darkMode ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  <div className="text-4xl mb-2">📊</div>
                  <p className="text-sm">In attesa dei dati...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg text-center ${
                    darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'
                  }`}>
                    <div className={`text-2xl font-bold mb-1 ${
                      darkMode ? 'text-green-300' : 'text-green-600'
                    }`}>
                      €{results.totaleIncassi.toFixed(2)}
                    </div>
                    <div className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Incassi Totali
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <button
                      onClick={exportResultsCSV}
                      className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center justify-center space-x-2 ${
                        darkMode 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      <span>📊</span>
                      <span>Scarica CSV</span>
                    </button>
                    <button
                      onClick={exportResultsPDF}
                      className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors min-h-[44px] flex items-center justify-center space-x-2 ${
                        darkMode 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      <span>📄</span>
                      <span>Scarica PDF</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>

        {/* Filtro mesi se ci sono dati */}
        {prenotazioni.length > 0 && datiMensili && (
          <div className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-lg border p-4 sm:p-5 mb-3 sm:mb-4`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <label className={`text-base font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Filtra per mese:
              </label>
              <select
                value={filtroMese}
                onChange={(e) => setFiltroMese(e.target.value)}
                className={`p-3 sm:p-2 rounded-lg border text-base sm:text-sm min-h-[44px] sm:min-h-0 flex-1 sm:flex-none sm:min-w-[200px] ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="">Tutti i mesi</option>
                {Object.keys(datiMensili).sort().map(mese => (
                  <option key={mese} value={mese}>
                    {new Date(mese + '-01').toLocaleDateString('it-IT', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <ResultsCards 
          results={results} 
          darkMode={darkMode} 
          prenotazioni={prenotazioni}
          filtroMese={filtroMese}
        />

        <BookingsTable 
          darkMode={darkMode}
          prenotazioni={prenotazioni}
          filtroMese={filtroMese}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          tariffePersonalizzate={tariffePersonalizzate}
          esenzioniManuali={esenzioniManuali}
          toggleEsenzione={toggleEsenzione}
          clearEsenzioni={clearEsenzioni}
          onExportCSV={exportResultsCSV}
          onExportPDF={exportResultsPDF}
          getCountryName={getCountryName}
        />


        <GuidaGECOS
          isOpen={showGuida}
          onClose={() => setShowGuida(false)}
          darkMode={darkMode}
        />
        </div>
      </div>
    </div>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default TassaSoggiornoCalculator;