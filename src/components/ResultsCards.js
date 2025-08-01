import React from 'react';

const ResultsCards = ({ results, darkMode }) => {
  if (!results) return null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-lg border p-4`}>
        <div className="text-center">
          <div className="text-xl font-semibold text-green-600 mb-1">
            €{results.totaleIncassi.toFixed(2)}
          </div>
          <div className={`text-xs ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>Incassi Totali</div>
        </div>
      </div>
      
      <div className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-lg border p-4`}>
        <div className="text-center">
          <div className="text-xl font-semibold text-blue-600 mb-1">
            {results.prenotazioniTassabili}
          </div>
          <div className={`text-xs ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>Prenotazioni Valide</div>
        </div>
      </div>
      
      <div className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-lg border p-4`}>
        <div className="text-center">
          <div className="text-xl font-semibold text-red-600 mb-1">
            {results.prenotazioneCancellate}
          </div>
          <div className={`text-xs ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>Cancellate</div>
        </div>
      </div>
      
      <div className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-lg border p-4`}>
        <div className="text-center">
          <div className={`text-xl font-semibold mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {results.totaleTotale}
          </div>
          <div className={`text-xs ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>Totale Prenotazioni</div>
        </div>
      </div>
    </div>
  );
};

export default ResultsCards;