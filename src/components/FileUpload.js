import React from 'react';

const FileUpload = ({ darkMode, error, isProcessing, onFileUpload }) => {
  return (
    <div className={`${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } rounded-lg border p-6 mb-6`}>
      {error && (
        <div className={`mb-6 p-4 rounded-lg border ${
          darkMode 
            ? 'bg-red-900 border-red-700 text-red-200' 
            : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          <div className="flex">
            <div className="text-sm">
              {error}
            </div>
          </div>
        </div>
      )}
      
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer ${
          darkMode 
            ? 'border-gray-600 hover:border-gray-500' 
            : 'border-gray-300 hover:border-gray-400'
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
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-200 border-t-blue-600 mx-auto"></div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Elaborazione in corso...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-4xl mb-3">📊</div>
            <div>
              <h3 className={`text-lg font-medium mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Carica file prenotazioni
              </h3>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Trascina qui il file Excel/CSV o clicca per selezionarlo
              </p>
              <p className={`text-xs mt-2 ${
                darkMode ? 'text-gray-500' : 'text-gray-500'
              }`}>
                Supporta .xlsx, .xls, .csv
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
    </div>
  );
};

export default FileUpload;