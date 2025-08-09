import React from 'react';

const ConfigPanel = ({ 
  darkMode, 
  tariffePersonalizzate, 
  setTariffePersonalizzate,
  datiMensili,
  filtroMese,
  setFiltroMese
}) => {
  const tariffeComuni = [
    6.00, 5.50, 5.00, 4.50, 4.00, 3.50, 3.00, 2.50, 2.00, 1.50, 1.00, 0.50
  ];

  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } rounded-lg border p-4 sm:p-5 mb-3 sm:mb-4`}>
      <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
        {/* Selezione Tariffa */}
        <div>
          <label className={`block text-sm font-medium mb-3 ${
            darkMode ? 'text-gray-200' : 'text-gray-700'
          }`}>
            Seleziona l'importo a notte della tua struttura
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              value={tariffeComuni.includes(tariffePersonalizzate) ? tariffePersonalizzate : 'custom'}
              onChange={(e) => {
                if (e.target.value !== 'custom') {
                  setTariffePersonalizzate(parseFloat(e.target.value));
                }
              }}
              className={`w-full sm:flex-1 p-3 sm:p-2 text-base sm:text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] sm:min-h-0 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              {tariffeComuni.map((tariffa) => (
                <option key={tariffa} value={tariffa}>
                  €{tariffa.toFixed(2)}
                </option>
              ))}
              <option value="custom">Importo personalizzato</option>
            </select>
            
            {!tariffeComuni.includes(tariffePersonalizzate) && (
              <div className="w-full sm:flex-1">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={tariffePersonalizzate}
                  onChange={(e) => setTariffePersonalizzate(parseFloat(e.target.value) || 0)}
                  placeholder="Es. 4.75"
                  className={`w-full p-3 sm:p-2 text-base sm:text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] sm:min-h-0 ${
                    darkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  }`}
                />
              </div>
            )}
          </div>
          <p className={`text-sm sm:text-xs mt-2 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Attuale: €{tariffePersonalizzate.toFixed(2)} per persona/notte
          </p>
          <p className={`text-xs mt-1 ${
            darkMode ? 'text-gray-500' : 'text-gray-400'
          }`}>
            Max 10 notti tassabili, bambini &lt;10 anni esenti
          </p>
        </div>

        {/* Filtro Mese */}
        {datiMensili && (
          <div>
            <label className={`block text-sm font-medium mb-3 ${
              darkMode ? 'text-gray-200' : 'text-gray-700'
            }`}>
              Filtra per mese
            </label>
            <select 
              value={filtroMese}
              onChange={(e) => setFiltroMese(e.target.value)}
              className={`w-full p-3 sm:p-2 text-base sm:text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] sm:min-h-0 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white' 
                  : 'bg-white border-gray-300 text-gray-900'
              }`}
            >
              <option value="">Tutti i mesi</option>
              {Object.keys(datiMensili)
                .filter(mese => !mese.startsWith('_'))
                .sort().map((mese) => (
                <option key={mese} value={mese}>
                  {new Date(mese + '-01').toLocaleDateString('it-IT', { 
                    year: 'numeric', 
                    month: 'long' 
                  })}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfigPanel;