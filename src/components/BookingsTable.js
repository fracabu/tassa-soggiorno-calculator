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
  esenzioniManuali,
  toggleEsenzione,
  clearEsenzioni,
  onExportCSV,
  onExportPDF,
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

  // Componente Card per mobile
  const BookingCard = ({ prenotazione, index }) => (
    <div key={index} className={`${
      darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
    } rounded-lg border p-4 mb-3`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className={`font-medium text-base ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            {prenotazione.nome}
          </h3>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {getCountryName(prenotazione.paese)}
          </p>
        </div>
        <div className="text-right">
          <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${
            prenotazione.stato === 'OK' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {prenotazione.stato}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className={`font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Periodo:
          </span>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {new Date(prenotazione.arrivo).toLocaleDateString('it-IT')}
          </p>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {new Date(prenotazione.partenza).toLocaleDateString('it-IT')}
          </p>
          <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {prenotazione.notti} {prenotazione.notti === 1 ? 'notte' : 'notti'}
          </p>
        </div>
        
        <div>
          <span className={`font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Persone:
          </span>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {prenotazione.adultiTassabili} adulti tassabili
          </p>
          {prenotazione.bambiniEsenti > 0 && (
            <p className="text-sm text-green-500">
              -{prenotazione.bambiniEsenti} bambini esenti
            </p>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-300 dark:border-gray-600">
        <div>
          <span className={`text-sm font-medium ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Notti tassabili: {prenotazione.nottiTassabili}
          </span>
        </div>
        <div className="text-right">
          <div className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            €{prenotazione.tassaTotale.toFixed(2)}
          </div>
          {prenotazione.tassaTotale > 0 && (
            <div className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {prenotazione.adultiTassabili} × {prenotazione.nottiTassabili} × €{tariffePersonalizzate.toFixed(2)}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } rounded-lg border p-4 sm:p-6 mb-4 sm:mb-6`}>
      {/* Header - Mobile First */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6">
        <div>
          <h2 className={`text-lg sm:text-xl font-semibold ${
            darkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Dettaglio Prenotazioni
            {filtroMese && (
              <span className={`block sm:inline text-sm font-normal sm:ml-2 ${
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
        
        {/* Controls - Mobile optimized */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className={`p-3 sm:p-2 text-base sm:text-sm border rounded min-h-[44px] sm:min-h-0 ${
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
          <div className="flex gap-2">
            {esenzioniManuali.size > 0 && (
              <button
                onClick={clearEsenzioni}
                className="px-4 py-3 sm:py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium text-base sm:text-sm min-h-[44px] sm:min-h-0"
                title="Pulisci tutte le esenzioni salvate"
              >
                Pulisci Esenzioni ({esenzioniManuali.size})
              </button>
            )}
            <button
              onClick={onExportCSV}
              className="px-4 py-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-base sm:text-sm min-h-[44px] sm:min-h-0"
            >
              Esporta CSV
            </button>
            <button
              onClick={onExportPDF}
              className="px-4 py-3 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-base sm:text-sm min-h-[44px] sm:min-h-0"
            >
              Esporta PDF
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile View - Cards */}
      <div className="block lg:hidden">
        {paginatedBookings.map((prenotazione, index) => (
          <BookingCard key={index} prenotazione={prenotazione} index={index} />
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
            <thead className={`${
              darkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <tr>
                <th className={`px-2 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`} style={{width: '25%'}}>
                  Ospite
                </th>
                <th className={`px-2 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`} style={{width: '20%'}}>
                  Periodo
                </th>
                <th className={`px-2 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`} style={{width: '15%'}}>
                  Persone
                </th>
                <th className={`px-2 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`} style={{width: '10%'}}>
                  Notti
                </th>
                <th className={`px-2 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`} style={{width: '10%'}}>
                  Stato
                </th>
                <th className={`px-2 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`} style={{width: '10%'}}>
                  Esente
                </th>
                <th className={`px-2 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                  darkMode ? 'text-gray-300' : 'text-gray-500'
                }`} style={{width: '10%'}}>
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
                  <td className="px-2 py-4">
                    <div>
                      <div className={`text-sm font-medium break-words ${
                        darkMode ? 'text-white' : 'text-gray-900'
                      }`} title={prenotazione.nome}>
                        {prenotazione.nome}
                      </div>
                      <div className={`text-sm ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        {getCountryName(prenotazione.paese)}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 py-4">
                    <div className={`text-sm break-words ${
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
                  <td className="px-2 py-4">
                    <div className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {prenotazione.adultiTassabili} adulti
                    </div>
                    {prenotazione.bambiniEsenti > 0 && (
                      <div className="text-sm text-green-500">
                        -{prenotazione.bambiniEsenti} {prenotazione.bambiniEsenti === 1 ? 
                          'bambino esente' : 'bambini esenti'} (&lt;10 anni)
                      </div>
                    )}
                    {prenotazione.bambini > prenotazione.bambiniEsenti && (
                      <div className="text-sm text-orange-500">
                        +{prenotazione.bambini - prenotazione.bambiniEsenti} {(prenotazione.bambini - prenotazione.bambiniEsenti) === 1 ? 'bambino tassabile' : 'bambini tassabili'} (≥10 anni)
                      </div>
                    )}
                  </td>
                  <td className="px-2 py-4">
                    <div className={`text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-900'
                    }`}>
                      {prenotazione.nottiTassabili}
                      {prenotazione.notti > 10 && (
                        <span className="text-sm text-orange-500 ml-1">(max)</span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-4">
                    <span className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${
                      prenotazione.stato === 'OK' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {prenotazione.stato === 'OK' ? 'OK' : 'KO'}
                    </span>
                  </td>
                  <td className="px-2 py-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={esenzioniManuali.has(prenotazione.nome)}
                        onChange={() => toggleEsenzione(prenotazione.nome)}
                        className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${
                          darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'
                        }`}
                      />
                      <span className={`ml-1 text-sm ${
                        darkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}>
                        {esenzioniManuali.has(prenotazione.nome) ? 'Sì' : 'No'}
                      </span>
                    </label>
                  </td>
                  <td className="px-2 py-4">
                    <div className={`text-sm font-medium ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      €{prenotazione.tassaTotale.toFixed(2)}
                    </div>
                    {prenotazione.tassaTotale > 0 && (
                      <div className={`text-sm break-all ${
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
      </div>
      
      {/* Controlli Paginazione - Mobile First */}
      {totalPages > 1 && (
        <div className={`mt-4 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          {/* Mobile Pagination Info */}
          <div className={`px-4 py-3 text-center text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          } sm:hidden`}>
            Pagina {currentPage} di {totalPages}
          </div>
          
          {/* Desktop Pagination Info */}
          <div className={`hidden sm:flex items-center justify-between px-4 py-3`}>
            <div className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Pagina {currentPage} di {totalPages} • Mostrando {Math.min(itemsPerPage, filteredBookings.length - (currentPage - 1) * itemsPerPage)} di {filteredBookings.length} risultati
            </div>
          </div>
          
          {/* Pagination Controls - Mobile Optimized */}
          <div className="flex items-center justify-center space-x-2 px-4 pb-3 sm:justify-end sm:pb-3">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 text-sm rounded transition-colors min-h-[44px] sm:min-h-0 sm:px-3 sm:py-1 ${
                currentPage === 1
                  ? darkMode ? 'text-gray-600 cursor-not-allowed' : 'text-gray-400 cursor-not-allowed'
                  : darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              ← Precedente
            </button>
            
            {/* Page Numbers - Responsive */}
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 3) {
                  pageNum = i + 1;
                } else if (currentPage <= 2) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 1) {
                  pageNum = totalPages - 2 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-2 text-sm rounded transition-colors min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:px-3 sm:py-1 ${
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
              
              {/* Show more pages on desktop */}
              <div className="hidden sm:flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) - 3 }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) return null;
                  if (currentPage <= 3) {
                    pageNum = i + 4;
                  } else if (currentPage >= totalPages - 2) {
                    return null;
                  } else {
                    pageNum = currentPage + 2 + i;
                  }
                  
                  if (pageNum > totalPages) return null;
                  
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
            </div>
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 text-sm rounded transition-colors min-h-[44px] sm:min-h-0 sm:px-3 sm:py-1 ${
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