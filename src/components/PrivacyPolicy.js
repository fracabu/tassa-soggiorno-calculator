import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const PrivacyPolicy = () => {
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
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-3">1. Titolare del Trattamento</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Il Titolare del trattamento dei dati personali è Tassa Soggiorno Calculator.
              <br />
              Email: privacy@tassasoggiorno.it
              <br />
              Per qualsiasi richiesta relativa al trattamento dei tuoi dati personali, puoi contattarci all'indirizzo sopra indicato.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">2. Dati Raccolti</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Raccogliamo i seguenti dati personali:
            </p>
            <ul className={`list-disc list-inside mt-2 space-y-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li>Nome e Cognome (forniti durante la registrazione)</li>
              <li>Indirizzo Email (utilizzato per l'autenticazione e comunicazioni)</li>
              <li>Password (crittografata con algoritmo bcrypt)</li>
              <li>Azienda (opzionale, se fornita)</li>
              <li>Numero di telefono (opzionale, se fornito)</li>
              <li>Indirizzo IP e User-Agent (registrati durante l'accesso per sicurezza)</li>
              <li>Data e ora di accesso (storico degli accessi)</li>
              <li>Dati dei calcoli effettuati (comune, totali, date, salvati nel database)</li>
            </ul>
            <p className={`mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <strong>Importante:</strong> I file Excel/CSV caricati per il calcolo vengono elaborati esclusivamente
              nel tuo browser. Nessun dato contenuto nei file viene trasmesso o salvato sui nostri server.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">3. Finalità del Trattamento</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              I dati personali sono trattati per le seguenti finalità:
            </p>
            <ul className={`list-disc list-inside mt-2 space-y-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li>Fornire accesso alla piattaforma di calcolo tassa di soggiorno</li>
              <li>Gestire l'account utente</li>
              <li>Inviare comunicazioni relative al servizio</li>
              <li>Migliorare il servizio e sviluppare nuovi strumenti</li>
              <li>Adempiere agli obblighi di legge</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">4. Base Giuridica</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Il trattamento dei dati si basa su:
            </p>
            <ul className={`list-disc list-inside mt-2 space-y-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li>Consenso dell'interessato (art. 6.1.a GDPR)</li>
              <li>Esecuzione del contratto (art. 6.1.b GDPR)</li>
              <li>Legittimo interesse del Titolare (art. 6.1.f GDPR)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">5. Conservazione dei Dati</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              I dati personali saranno conservati per il tempo necessario alle finalità per cui sono stati raccolti,
              e comunque non oltre 24 mesi dall'ultima interazione con il servizio, salvo diversi obblighi di legge.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">6. Diritti dell'Interessato</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              L'interessato ha diritto di:
            </p>
            <ul className={`list-disc list-inside mt-2 space-y-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li>Accedere ai propri dati personali</li>
              <li>Richiedere la rettifica o la cancellazione</li>
              <li>Limitare il trattamento</li>
              <li>Opporsi al trattamento</li>
              <li>Richiedere la portabilità dei dati</li>
              <li>Revocare il consenso in qualsiasi momento</li>
              <li>Proporre reclamo all'Autorità Garante</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">7. Sicurezza</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Adottiamo misure di sicurezza tecniche e organizzative per proteggere i dati personali da accessi
              non autorizzati, perdita, distruzione o divulgazione. I dati sono protetti mediante crittografia
              e autenticazione JWT.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">8. Elaborazione Locale</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              I file Excel/CSV caricati vengono elaborati esclusivamente nel browser dell'utente.
              Nessun dato dei file viene inviato ai nostri server o a terze parti.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">9. Cookie</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Il sito utilizza cookie tecnici necessari al funzionamento del servizio. Per maggiori informazioni
              consultare la Cookie Policy.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">10. Modifiche</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Ci riserviamo il diritto di modificare questa Privacy Policy in qualsiasi momento. Le modifiche
              saranno pubblicate su questa pagina con indicazione della data di ultimo aggiornamento.
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

export default PrivacyPolicy;
