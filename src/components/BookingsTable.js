import React from 'react';

const BookingsTable = ({ 
  darkMode, 
  prenotazioni, 
  filtroMese,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  tariffePersonalizzate,
  onExport,
  getCountryName
}) => {
  // Logiche di paginazione
  const getPrenotazioniFiltrate = () => {
    if (!filtroMese) return prenotazioni;
    
    return prenotazioni.filter(p => {
      const dataArrivo = new Date(p.arrivo);
      const meseArrivo = `${dataArrivo.getFullYear()}-${String(dataArrivo.getMonth() + 1).padStart(2, '0')}`;
      return meseArrivo === filtroMese;
    });
  };

  const getPrenotazioniPaginate = () => {
    const filtrate = getPrenotazioniFiltrate();
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtrate.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    const filtrate = getPrenotazioniFiltrate();
    return Math.ceil(filtrate.length / itemsPerPage);
  };

  const filteredBookings = getPrenotazioniFiltrate();
  const paginatedBookings = getPrenotazioniPaginate();
  const totalPages = getTotalPages();

  if (filteredBookings.length === 0) return null;

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } rounded-2xl shadow-lg border p-6 mb-6`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className={`text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Dettaglio Prenotazioni
            {filtroMese && (
              <span className={`text-sm font-normal ml-2 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                ({new Date(filtroMese + '-01').toLocaleDateString('it-IT', { 
                  year: 'numeric', 
                  month: 'long' 
                })})
              </span>
            )}
          </h2>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          } mt-1`}>
            {filteredBookings.length} prenotazioni totali
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className={`text-sm p-2 border rounded ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-white' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value={10}>10 per pagina</option>
            <option value={20}>20 per pagina</option>
            <option value={50}>50 per pagina</option>
            <option value={100}>100 per pagina</option>
          </select>
          <button
            onClick={onExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
          >
            Esporta CSV
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={`${
            darkMode ? 'bg-gray-700' : 'bg-gray-50'
          }`}>
            <tr>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Ospite
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Periodo
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Persone
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Notti Tassabili
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Stato
              </th>
              <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                darkMode ? 'text-gray-300' : 'text-gray-500'
              }`}>
                Tassa
              </th>
            </tr>
          </thead>
          <tbody className={`divide-y ${
            darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'
          }`}>
            {paginatedBookings.map((prenotazione, index) => (
              <tr key={index} className={`transition-colors duration-150 ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
              }`}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className={`text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {prenotazione.nome}
                    </div>
                    <div className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {getCountryName(prenotazione.paese)}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    {new Date(prenotazione.arrivo).toLocaleDateString('it-IT')} - {new Date(prenotazione.partenza).toLocaleDateString('it-IT')}
                  </div>
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {prenotazione.notti} {prenotazione.notti === 1 ? 'notte' : 'notti'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    {prenotazione.adultiTassabili} adulti tassabili
                  </div>
                  {prenotazione.bambiniEsenti > 0 && (
                    <div className="text-xs text-green-500">
                      -{prenotazione.bambiniEsenti} {prenotazione.bambiniEsenti === 1 ? 
                        'bambino esente' : 'bambini esenti'} (&lt;10 anni)
                    </div>
                  )}
                  {prenotazione.bambini > prenotazione.bambiniEsenti && (
                    <div className="text-xs text-orange-500">
                      +{prenotazione.bambini - prenotazione.bambiniEsenti} {(prenotazione.bambini - prenotazione.bambiniEsenti) === 1 ? 'bambino tassabile' : 'bambini tassabili'} (≥10 anni)
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-300' : 'text-gray-900'
                  }`}>
                    {prenotazione.nottiTassabili}
                    {prenotazione.notti > 10 && (
                      <span className="text-xs text-orange-500 ml-1">(max 10)</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    prenotazione.stato === 'OK' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                  }`}>
                    {prenotazione.stato}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    €{prenotazione.tassaTotale.toFixed(2)}
                  </div>
                  {prenotazione.tassaTotale > 0 && (
                    <div className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {prenotazione.adultiTassabili} × {prenotazione.nottiTassabili} × €{tariffePersonalizzate.toFixed(2)}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Controlli Paginazione */}
      {totalPages > 1 && (
        <div className={`mt-4 flex items-center justify-between px-4 py-3 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Pagina {currentPage} di {totalPages} • Mostrando {Math.min(itemsPerPage, filteredBookings.length - (currentPage - 1) * itemsPerPage)} di {filteredBookings.length} risultati
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                currentPage === 1
                  ? darkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
                  : darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              ← Precedente
            </button>
            
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm rounded transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : darkMode 
                          ? 'text-gray-300 hover:text-white hover:bg-gray-700' 
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                currentPage === totalPages
                  ? darkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
                  : darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Successiva →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsTable;