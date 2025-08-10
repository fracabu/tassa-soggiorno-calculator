import React from 'react';
import { BuildingOfficeIcon, DocumentIcon, CloudArrowUpIcon, DocumentArrowDownIcon, XMarkIcon } from '@heroicons/react/24/outline';

const GuidePage = ({ isOpen, onClose, darkMode }) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: <BuildingOfficeIcon className="w-12 h-12" />,
      title: "1. Seleziona il tuo Comune",
      description: "Scegli il comune dove operi dal menu a tendina. Le regole fiscali verranno applicate automaticamente.",
      details: [
        "Roma: €6.00/notte, max 10 notti, esenti under-10",
        "Milano: €5.00/notte, max 14 notti, esenti under-2", 
        "Firenze: tariffe stagionali, max 7 notti",
        "Altri comuni: configurazioni specifiche incluse"
      ]
    },
    {
      icon: <CloudArrowUpIcon className="w-12 h-12" />,
      title: "2. Carica il tuo File",
      description: "Carica il file Excel o CSV esportato da Booking.com, Airbnb o altri portali.",
      details: [
        "Formati supportati: .xlsx, .xls, .csv",
        "Riconoscimento automatico delle colonne",
        "Elaborazione locale nel browser (100% privacy)",
        "Nessun invio di dati a server esterni"
      ]
    },
    {
      icon: <DocumentIcon className="w-12 h-12" />,
      title: "3. Controlla i Calcoli",
      description: "Verifica i risultati automatici e applica eventuali esenzioni manuali.",
      details: [
        "Calcolo automatico tasse per ospite",
        "Gestione bambini e esenzioni",
        "Suddivisione per mesi di competenza",
        "Visualizzazione dettagli per prenotazione"
      ]
    },
    {
      icon: <DocumentArrowDownIcon className="w-12 h-12" />,
      title: "4. Scarica il Report",
      description: "Esporta il file CSV già formattato per l'invio al portale GECOS del tuo comune.",
      details: [
        "File CSV compatibile con GECOS",
        "Report PDF per i tuoi archivi", 
        "Suddivisione per periodi mensili",
        "Pronto per l'invio alle autorità"
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50 overflow-x-hidden">
      <div className={`max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto overflow-x-hidden rounded-lg sm:rounded-2xl shadow-2xl ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } border`}>
        {/* Header */}
        <div className={`sticky top-0 p-4 sm:p-6 border-b ${
          darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
        } flex items-start justify-between`}>
          <div className="flex-1 pr-3">
            <h2 className={`text-2xl sm:text-3xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Come Funziona
            </h2>
            <p className={`text-base sm:text-lg mt-1 sm:mt-2 ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Guida completa all'utilizzo del calcolatore
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 sm:p-2 rounded-lg transition-colors flex-shrink-0 min-h-[44px] min-w-[44px] flex items-center justify-center ${
              darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <XMarkIcon className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Introduction */}
          <div className={`p-4 sm:p-6 rounded-lg mb-6 sm:mb-8 ${
            darkMode ? 'bg-blue-900/20 border border-blue-700' : 'bg-blue-50 border border-blue-200'
          }`}>
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-3 ${
              darkMode ? 'text-blue-200' : 'text-blue-800'
            }`}>
              ✨ Calcolo automatico in 4 semplici passaggi
            </h3>
            <p className={`text-sm sm:text-base leading-relaxed ${
              darkMode ? 'text-blue-300' : 'text-blue-700'
            }`}>
              Il nostro calcolatore ti permette di elaborare centinaia di prenotazioni in pochi secondi, 
              applicando automaticamente le regole fiscali del tuo comune e generando i report per GECOS.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4 sm:space-y-6">
            {steps.map((step, index) => (
              <div key={index} className={`p-4 sm:p-6 rounded-lg border ${
                darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start space-x-3 sm:space-x-6">
                  <div className={`flex-shrink-0 ${
                    darkMode ? 'text-blue-400' : 'text-blue-600'
                  }`}>
                    <div className="w-10 h-10 sm:w-12 sm:h-12">
                      {React.cloneElement(step.icon, { 
                        className: "w-full h-full" 
                      })}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {step.title}
                    </h4>
                    <p className={`text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed ${
                      darkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {step.description}
                    </p>
                    <ul className={`space-y-1 sm:space-y-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-green-500 mr-2 flex-shrink-0">•</span>
                          <span className="text-xs sm:text-sm leading-relaxed">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className={`mt-6 sm:mt-8 p-4 sm:p-6 rounded-lg text-center ${
            darkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'
          }`}>
            <h3 className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-3 ${
              darkMode ? 'text-green-200' : 'text-green-800'
            }`}>
              🚀 Pronto per iniziare?
            </h3>
            <p className={`text-sm sm:text-base mb-4 leading-relaxed px-2 ${
              darkMode ? 'text-green-300' : 'text-green-700'
            }`}>
              Richiedi le tue credenziali gratuite e inizia subito a calcolare le tasse di soggiorno
            </p>
            <button
              onClick={() => window.open('mailto:info@ospitly.it?subject=Richiesta Credenziali Calcolatore Tassa Soggiorno&body=Salve,%0A%0Avorrei richiedere le credenziali di accesso per il Calcolatore Tassa di Soggiorno dopo aver letto la guida.%0A%0AGrazie', '_blank')}
              className={`inline-flex items-center space-x-2 px-4 sm:px-6 py-3 rounded-lg text-base sm:text-lg font-semibold transition-all duration-200 min-h-[48px] ${
                darkMode 
                  ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl' 
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl'
              }`}
            >
              <span>📧</span>
              <span>Richiedi Credenziali Ora</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuidePage;