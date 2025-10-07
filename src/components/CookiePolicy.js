import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const CookiePolicy = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className={`sticky top-0 z-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className={`inline-flex items-center ${
              darkMode ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
            }`}
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Torna alla Home
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Cookie Policy</h1>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-3">Cosa sono i Cookie</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              I cookie sono piccoli file di testo che vengono memorizzati sul dispositivo dell'utente quando
              visita un sito web. Vengono utilizzati per far funzionare il sito in modo efficiente e fornire
              informazioni ai proprietari del sito.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Cookie Utilizzati</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Questo sito utilizza esclusivamente cookie tecnici necessari al funzionamento del servizio:
            </p>
          </section>

          <section>
            <h4 className="text-lg font-semibold mb-2">Cookie Tecnici (Strettamente Necessari)</h4>
            <div className={`mt-3 space-y-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="font-semibold">localStorage: authToken</p>
                <p className="text-sm mt-1">Finalità: Memorizza il token JWT per l'autenticazione dell'utente</p>
                <p className="text-sm">Durata: 7 giorni</p>
                <p className="text-sm">Tipo: Tecnico essenziale</p>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="font-semibold">localStorage: user</p>
                <p className="text-sm mt-1">Finalità: Memorizza i dati base dell'utente (nome, email)</p>
                <p className="text-sm">Durata: 7 giorni</p>
                <p className="text-sm">Tipo: Tecnico essenziale</p>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="font-semibold">localStorage: darkMode</p>
                <p className="text-sm mt-1">Finalità: Memorizza la preferenza tema (chiaro/scuro)</p>
                <p className="text-sm">Durata: Permanente (fino a cancellazione manuale)</p>
                <p className="text-sm">Tipo: Tecnico preferenze</p>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="font-semibold">localStorage: esenzioniManuali</p>
                <p className="text-sm mt-1">Finalità: Memorizza le esenzioni manuali impostate dall'utente</p>
                <p className="text-sm">Durata: Permanente (fino a cancellazione manuale)</p>
                <p className="text-sm">Tipo: Tecnico funzionale</p>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                <p className="font-semibold">localStorage: cookieConsent</p>
                <p className="text-sm mt-1">Finalità: Memorizza il consenso ai cookie</p>
                <p className="text-sm">Durata: 12 mesi</p>
                <p className="text-sm">Tipo: Tecnico essenziale</p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Cookie di Terze Parti</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Questo sito NON utilizza cookie di terze parti, cookie di profilazione o cookie per scopi
              pubblicitari.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Base Giuridica</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              I cookie tecnici strettamente necessari non richiedono il consenso dell'utente (Provvedimento
              del Garante Privacy n. 229 dell'8 maggio 2014). Questi cookie sono indispensabili per il
              funzionamento del servizio e non possono essere disabilitati.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Gestione dei Cookie</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Puoi gestire o eliminare i cookie in qualsiasi momento tramite le impostazioni del tuo browser:
            </p>
            <ul className={`list-disc list-inside mt-2 space-y-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li>Chrome: Impostazioni → Privacy e sicurezza → Cookie</li>
              <li>Firefox: Opzioni → Privacy e sicurezza → Cookie</li>
              <li>Safari: Preferenze → Privacy → Gestione dati siti web</li>
              <li>Edge: Impostazioni → Cookie e autorizzazioni sito</li>
            </ul>
            <p className={`mt-3 font-semibold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              ⚠️ Nota: Eliminare i cookie tecnici può compromettere il funzionamento del servizio e
              richiedere un nuovo login.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Sicurezza</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Tutti i dati memorizzati localmente sono protetti e accessibili solo dal tuo browser.
              Il token di autenticazione utilizza crittografia JWT standard del settore.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Elaborazione File</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              I file Excel/CSV caricati vengono elaborati esclusivamente nel browser (client-side).
              Nessun dato dei file viene memorizzato in cookie o inviato a server esterni.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Aggiornamenti</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Questa Cookie Policy può essere aggiornata periodicamente. Ti invitiamo a consultarla
              regolarmente per restare informato su come utilizziamo i cookie.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">Contatti</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Per domande su questa Cookie Policy, contattaci a: privacy@example.com
            </p>
          </section>

          <p className={`text-sm mt-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
