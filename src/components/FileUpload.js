import React from 'react';

const FileUpload = ({ darkMode, error, isProcessing, onFileUpload }) => {
  return (
    <div className="h-full flex flex-col">
      {error && (
        <div className={`mb-3 p-3 rounded-lg text-sm border ${
          darkMode 
            ? 'bg-red-900 border-red-700 text-red-200' 
            : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          <div className="flex items-start space-x-2">
            <span className="text-red-500 flex-shrink-0">⚠️</span>
            <span className="flex-1">{error}</span>
          </div>
        </div>
      )}
      
      <div 
        className={`flex-1 border-2 border-dashed rounded-lg p-4 sm:p-6 text-center cursor-pointer flex flex-col justify-center transition-colors min-h-[120px] sm:min-h-[140px] ${
          darkMode 
            ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-800/30' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
        onDrop={(e) => {
          e.preventDefault();
          const droppedFile = e.dataTransfer.files[0];
          if (droppedFile) onFileUpload(droppedFile);
        }}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('fileInput').click()}
      >
        {isProcessing ? (
          <div className="space-y-3">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-3 border-blue-200 border-t-blue-600 mx-auto"></div>
            <p className={`text-base sm:text-lg font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Elaborazione in corso...
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-5xl sm:text-6xl">📊</div>
            <div className="space-y-2">
              <p className={`text-base sm:text-lg font-semibold ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Trascina il file qui
              </p>
              <p className={`text-sm sm:text-base ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                oppure tocca per selezionare
              </p>
              <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs sm:text-sm ${
                darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'
              }`}>
                <span>📄</span>
                <span>Excel • CSV</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <input
        id="fileInput"
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={(e) => onFileUpload(e.target.files[0])}
        className="hidden"
      />
      
      {/* Privacy Info Banner */}
      <div className={`mt-3 sm:mt-4 p-3 rounded-lg text-center ${
        darkMode ? 'bg-green-900/20 border border-green-700/50' : 'bg-green-50 border border-green-200'
      }`}>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-2">
          <div className="flex items-center space-x-2">
            <span className="text-green-600 text-base">🔒</span>
            <p className={`text-sm sm:text-base font-medium ${
              darkMode ? 'text-green-300' : 'text-green-700'
            }`}>
              File elaborato solo nel tuo browser
            </p>
          </div>
        </div>
        <p className={`text-xs sm:text-sm mt-1 ${
          darkMode ? 'text-green-400/80' : 'text-green-600'
        }`}>
          Nessun invio a server esterni • Massima privacy
        </p>
      </div>
    </div>
  );
};

export default FileUpload;