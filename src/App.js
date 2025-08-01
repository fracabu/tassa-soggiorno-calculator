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

const TassaSoggiornoCalculator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showGuida, setShowGuida] = useState(false);
  
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
    handleFileUpload,
    exportResults,
    getCountryName
  } = useBookingProcessor();

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
    } p-2 sm:p-4`}>
      <div className="max-w-6xl mx-auto">
        <Header 
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onLogout={handleLogout}
          onShowGuida={() => setShowGuida(true)}
        />

        <ConfigPanel 
          darkMode={darkMode}
          tariffePersonalizzate={tariffePersonalizzate}
          setTariffePersonalizzate={setTariffePersonalizzate}
          datiMensili={datiMensili}
          filtroMese={filtroMese}
          setFiltroMese={setFiltroMese}
        />

        {!prenotazioni.length && (
          <FileUpload 
            darkMode={darkMode}
            error={error}
            isProcessing={isProcessing}
            onFileUpload={handleFileUpload}
          />
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
          onExport={exportResults}
          getCountryName={getCountryName}
        />

        {!prenotazioni.length && !isProcessing && (
          <InfoFooter darkMode={darkMode} />
        )}

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