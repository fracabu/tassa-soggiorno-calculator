import React from 'react';

const GuidaGECOS = ({ isOpen, onClose, darkMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* Header */}
          <div className={`px-6 py-4 border-b ${
            darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className={`text-2xl font-bold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                📖 Guida al Pagamento della Tassa di Soggiorno su GECOS
              </h2>
              <button
                onClick={onClose}
                className={`rounded-lg p-2 transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Questa guida spiega passo passo come completare il pagamento della tassa di soggiorno per la tua struttura tramite il portale GECOS.
            </p>

            {/* Steps */}
            <div className="space-y-6">
              <div className="mb-8">
                <h3 className={`text-lg font-semibold mb-3 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                  Accedi al portale GECOS
                </h3>
                <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Vai su <a href="https://comune.roma.it/gecos" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    https://comune.roma.it/gecos
                  </a> ed effettua l'accesso con SPID o CIE.
                </p>
              </div>

              <div className="mb-8">
                <h3 className={`text-lg font-semibold mb-3 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                  Vai nella sezione "Ricerca Comunicazioni Trimestrali"
                </h3>
                <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Dopo l'accesso, verrai indirizzato alla tua area riservata. Vedrai un elenco dei trimestri con diversi stati.
                </p>
              </div>

              <div className="mb-8">
                <h3 className={`text-lg font-semibold mb-3 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                  Valida la Comunicazione
                </h3>
                <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Se tutto è corretto, clicca sul pulsante "Valida Comunicazione Trimestrale". Questo genera l'identificativo per il pagamento.
                </p>
              </div>

              <div className="mb-8">
                <h3 className={`text-lg font-semibold mb-3 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
                  Effettua il pagamento
                </h3>
                <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Una volta generato il pagamento trimestrale, puoi pagare con PayPal, PagoPA, etc. usando l'identificativo generato.
                </p>
              </div>
            </div>

            <div className={`mt-8 p-6 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Hai ancora dubbi?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Consulta il manuale ufficiale dal portale GECOS o contatta il supporto per assistenza.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidaGECOS;