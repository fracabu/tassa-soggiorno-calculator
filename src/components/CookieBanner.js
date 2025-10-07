import React, { useState, useEffect } from 'react';

const CookieBanner = ({ darkMode, onOpenPrivacy, onOpenCookie }) => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    const consentData = {
      accepted: true,
      date: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    setShowBanner(false);
  };

  const rejectCookies = () => {
    const consentData = {
      accepted: false,
      date: new Date().toISOString(),
      version: '1.0'
    };
    localStorage.setItem('cookieConsent', JSON.stringify(consentData));
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6">
      <div className={`max-w-6xl mx-auto rounded-lg shadow-2xl ${
        darkMode
          ? 'bg-gray-800 border border-gray-700'
          : 'bg-white border border-gray-200'
      }`}>
        <div className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 text-3xl">
              🍪
            </div>

            <div className="flex-1">
              <h3 className={`text-lg font-bold mb-2 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Utilizzo dei Cookie
              </h3>

              <p className={`text-sm mb-4 ${
                darkMode ? 'text-gray-300' : 'text-gray-600'
              }`}>
                Questo sito utilizza solo <strong>cookie tecnici strettamente necessari</strong> per il
                funzionamento del servizio (autenticazione, preferenze tema, esenzioni manuali).
                Non utilizziamo cookie di profilazione o pubblicitari.
              </p>

              <div className={`text-xs mb-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <p>
                  I file caricati vengono elaborati <strong>solo nel tuo browser</strong> e non vengono
                  mai inviati ai nostri server. Per maggiori dettagli consulta la{' '}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenCookie();
                    }}
                    className="underline hover:text-blue-500"
                  >
                    Cookie Policy
                  </button>
                  {' '}e la{' '}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      onOpenPrivacy();
                    }}
                    className="underline hover:text-blue-500"
                  >
                    Privacy Policy
                  </button>
                  .
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={acceptCookies}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  Accetta Cookie Tecnici
                </button>

                <button
                  onClick={rejectCookies}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Rifiuta
                </button>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onOpenCookie();
                  }}
                  className={`px-6 py-2.5 rounded-lg font-medium transition-colors ${
                    darkMode
                      ? 'border border-gray-600 hover:bg-gray-700 text-gray-300'
                      : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  Maggiori Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
