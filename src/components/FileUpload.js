import React from 'react';

const FileUpload = ({ darkMode, error, isProcessing, onFileUpload }) => {
  return (
    <div className="h-full flex flex-col">
      {error && (
        <div className={`mb-2 p-2 rounded text-sm ${
          darkMode 
            ? 'bg-red-900 border-red-700 text-red-200' 
            : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          {error}
        </div>
      )}
      
      <div 
        className={`flex-1 border-2 border-dashed rounded-lg p-3 text-center cursor-pointer flex flex-col justify-center transition-colors ${
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
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600 mx-auto"></div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Elaborazione...
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl">📊</div>
            <div>
              <p className={`text-sm font-medium mb-1 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Trascina file qui
              </p>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                o clicca per selezionare
              </p>
              <p className={`text-sm mt-1 ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Excel/CSV supportati
              </p>
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
      <div className={`mt-2 p-2 rounded-lg text-center ${
        darkMode ? 'bg-green-900/20 border border-green-700/50' : 'bg-green-50 border border-green-200'
      }`}>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-green-600 text-sm">🔒</span>
          <p className={`text-sm font-medium ${
            darkMode ? 'text-green-300' : 'text-green-700'
          }`}>
            File elaborato solo nel tuo browser
          </p>
        </div>
        <p className={`text-sm mt-1 ${
          darkMode ? 'text-green-400/80' : 'text-green-600'
        }`}>
          Nessun invio a server esterni
        </p>
      </div>
    </div>
  );
};

export default FileUpload;