import React, { useMemo } from 'react';

const ResultsCards = ({ results, darkMode, prenotazioni, filtroMese }) => {
  const filteredStats = useMemo(() => {
    if (!results) return null;
    
    // Se non c'è filtro mese, usa i risultati totali
    if (!filtroMese || !prenotazioni) {
      return results;
    }
    
    // Filtra le prenotazioni per il mese selezionato
    const prenotazioniFiltrate = prenotazioni.filter(prenotazione => {
      if (prenotazione.stato !== "OK") return false;
      const dataArrivo = new Date(prenotazione.arrivo);
      const meseArrivo = `${dataArrivo.getFullYear()}-${String(dataArrivo.getMonth() + 1).padStart(2, '0')}`;
      return meseArrivo === filtroMese;
    });
    
    // Calcola le statistiche per il mese filtrato
    const totaleIncassi = prenotazioniFiltrate.reduce((sum, p) => sum + p.tassaTotale, 0);
    const prenotazioniTassabili = prenotazioniFiltrate.length;
    
    // Per le prenotazioni cancellate del mese specifico
    const prenotazioniCancellateFiltrate = prenotazioni.filter(prenotazione => {
      if (prenotazione.stato === "OK") return false;
      const dataArrivo = new Date(prenotazione.arrivo);
      const meseArrivo = `${dataArrivo.getFullYear()}-${String(dataArrivo.getMonth() + 1).padStart(2, '0')}`;
      return meseArrivo === filtroMese;
    });
    
    const prenotazioneCancellate = prenotazioniCancellateFiltrate.length;
    const totaleTotale = prenotazioniTassabili + prenotazioneCancellate;
    
    return {
      totaleIncassi,
      prenotazioniTassabili,
      prenotazioneCancellate,
      totaleTotale
    };
  }, [results, prenotazioni, filtroMese]);

  if (!filteredStats) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-lg border p-4 sm:p-4`}>
        <div className="text-center">
          <div className="text-2xl sm:text-xl font-semibold text-green-600 mb-2 sm:mb-1">
            €{filteredStats.totaleIncassi.toFixed(2)}
          </div>
          <div className={`text-sm sm:text-xs ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>Incassi {filtroMese ? 'del Mese' : 'Totali'}</div>
        </div>
      </div>
      
      <div className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-lg border p-4 sm:p-4`}>
        <div className="text-center">
          <div className="text-2xl sm:text-xl font-semibold text-blue-600 mb-2 sm:mb-1">
            {filteredStats.prenotazioniTassabili}
          </div>
          <div className={`text-sm sm:text-xs ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>Prenotazioni Valide</div>
        </div>
      </div>
      
      <div className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-lg border p-4 sm:p-4`}>
        <div className="text-center">
          <div className="text-2xl sm:text-xl font-semibold text-red-600 mb-2 sm:mb-1">
            {filteredStats.prenotazioneCancellate}
          </div>
          <div className={`text-sm sm:text-xs ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>Cancellate</div>
        </div>
      </div>
      
      <div className={`${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } rounded-lg border p-4 sm:p-4`}>
        <div className="text-center">
          <div className={`text-2xl sm:text-xl font-semibold mb-2 sm:mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {filteredStats.totaleTotale}
          </div>
          <div className={`text-sm sm:text-xs ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>Totale Prenotazioni</div>
        </div>
      </div>
    </div>
  );
};

export default ResultsCards;