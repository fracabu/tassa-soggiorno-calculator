import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';

// Components
import LoginScreen from './components/LoginScreen';
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

const TassaSoggiornoCalculator = () => {
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
    getCountryName
  } = useBookingProcessor(comuneSelezionato);

  // Check auth e theme on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('taxCalculatorAuth');
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    if (savedTheme === 'true') {
      setDarkMode(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('taxCalculatorAuth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('taxCalculatorAuth');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen 
        onLogin={handleLogin}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <div className={`min-h-screen ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    } p-2 flex justify-center`}>
      <div className="max-w-6xl w-full flex flex-col">
        <Header 
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
          onShowGuida={() => setShowGuida(true)}
        />

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-4 justify-items-center mb-6 ${
          !prenotazioni.length ? 'flex-1 min-h-[70vh] items-center' : 'items-start'
        }`}>
          {/* Step 1: Configurazione */}
          <div className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-lg border p-6 w-full flex flex-col max-w-sm ${
            !prenotazioni.length ? 'aspect-square' : 'min-h-[200px]'
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
              <p className={`text-sm mt-2 ${
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
                  <div className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>per persona/notte</div>
                  <div className={`text-xs mt-1 ${
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
                  <div className={`text-xs ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>per persona/notte</div>
                  <div className={`text-xs mt-1 ${
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
          } rounded-lg border p-6 w-full flex flex-col max-w-sm ${
            !prenotazioni.length ? 'aspect-square' : 'min-h-[200px]'
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
              <p className={`text-sm mt-2 ${
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
                  <p className="text-sm font-medium">File caricato</p>
                  <p className="text-xs">{prenotazioni.length} prenotazioni</p>
                  <button
                    onClick={() => {
                      setPrenotazioni([]);
                      setResults(null);
                      setError('');
                      setFiltroMese('');
                      setDatiMensili(null);
                    }}
                    className={`mt-2 text-xs px-3 py-1 rounded ${
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
          } rounded-lg border p-6 w-full flex flex-col max-w-sm ${
            !prenotazioni.length ? 'aspect-square' : 'min-h-[200px]'
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
              <p className={`text-sm mt-2 ${
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
                  <p className="text-xs">In attesa dei dati...</p>
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
                    <div className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Incassi Totali
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <button
                      onClick={exportResultsCSV}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        darkMode 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      📊 CSV
                    </button>
                    <button
                      onClick={exportResultsPDF}
                      className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        darkMode 
                          ? 'bg-red-600 hover:bg-red-700 text-white' 
                          : 'bg-red-500 hover:bg-red-600 text-white'
                      }`}
                    >
                      📄 PDF
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Filtro mesi se ci sono dati */}
        {prenotazioni.length > 0 && datiMensili && (
          <div className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-lg border p-4 sm:p-5 mb-3 sm:mb-4`}>
            <div className="flex items-center gap-4">
              <label className={`text-sm font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                Filtra per mese:
              </label>
              <select
                value={filtroMese}
                onChange={(e) => setFiltroMese(e.target.value)}
                className={`p-2 rounded-lg border text-sm ${
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
  );
};

export default TassaSoggiornoCalculator;