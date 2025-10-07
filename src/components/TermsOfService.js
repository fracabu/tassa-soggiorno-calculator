import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const TermsOfService = () => {
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
        <h1 className="text-3xl font-bold mb-8">Termini di Servizio</h1>

        <div className="p-6 space-y-6">
          <section>
            <h3 className="text-xl font-semibold mb-3">1. Accettazione dei Termini</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Utilizzando questo servizio, accetti di essere vincolato da questi Termini di Servizio.
              Se non accetti questi termini, non utilizzare il servizio.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">2. Descrizione del Servizio</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Tassa Soggiorno Calculator è uno strumento web per il calcolo della tassa di soggiorno secondo
              le normative dei comuni italiani aggiornate al 2025. Il servizio include:
            </p>
            <ul className={`list-disc list-inside mt-2 space-y-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li>Elaborazione locale (nel browser) di file Excel/CSV da piattaforme come Booking.com, Airbnb</li>
              <li>Calcolo automatico delle tasse secondo le regole specifiche di ciascun comune</li>
              <li>Gestione di esenzioni per età e massimali di notti tassabili</li>
              <li>Export dei risultati in formato CSV (compatibile GECOS) e PDF</li>
              <li>Database completo di comuni italiani con tariffe 2025</li>
              <li>Salvataggio storico calcoli effettuati (per utenti registrati)</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">3. Account Utente</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Per utilizzare il servizio è necessario registrarsi fornendo informazioni accurate e complete
              (Nome, Cognome, Email, Password). L'utente si impegna a:
            </p>
            <ul className={`list-disc list-inside mt-2 space-y-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li>Fornire dati veritieri e aggiornati durante la registrazione</li>
              <li>Mantenere riservata la propria password</li>
              <li>Non condividere l'account con terzi</li>
              <li>Notificare immediatamente eventuali accessi non autorizzati</li>
            </ul>
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Sei responsabile della sicurezza del tuo account e di tutte le attività svolte con esso.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">4. Utilizzo del Servizio</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              L'utente si impegna a:
            </p>
            <ul className={`list-disc list-inside mt-2 space-y-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li>Utilizzare il servizio in conformità con le leggi vigenti</li>
              <li>Non tentare di violare la sicurezza del sistema</li>
              <li>Non utilizzare il servizio per scopi fraudolenti</li>
              <li>Non sovraccaricare il sistema con richieste eccessive</li>
              <li>Verificare l'accuratezza dei calcoli prima dell'utilizzo ufficiale</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">5. Proprietà Intellettuale</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Tutti i contenuti, il software, il codice e la struttura del servizio sono di proprietà esclusiva
              del Titolare e protetti dalle leggi sul diritto d'autore.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">6. Limitazione di Responsabilità</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Il servizio è fornito "così com'è" senza garanzie di alcun tipo. Non garantiamo:
            </p>
            <ul className={`list-disc list-inside mt-2 space-y-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li>L'accuratezza assoluta dei calcoli (verificare sempre i risultati)</li>
              <li>La disponibilità continua del servizio</li>
              <li>L'assenza di errori o interruzioni</li>
            </ul>
            <p className={`mt-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              L'utente è responsabile della verifica dei calcoli prima dell'utilizzo ufficiale e della
              presentazione alle autorità competenti.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">7. Privacy e Protezione Dati</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Il trattamento dei dati personali è disciplinato dalla Privacy Policy. I file caricati
              vengono elaborati esclusivamente nel browser dell'utente e non vengono mai inviati ai
              nostri server.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">8. Modifiche al Servizio</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Ci riserviamo il diritto di modificare, sospendere o interrompere il servizio in qualsiasi
              momento senza preavviso. Possiamo anche modificare questi termini, pubblicando le modifiche
              su questa pagina.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">9. Risoluzione</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Possiamo sospendere o terminare l'accesso al servizio in caso di violazione di questi termini
              o per qualsiasi altro motivo a nostra discrezione.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">10. Disclaimer</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              <strong>IMPORTANTE:</strong> Questo servizio è fornito come strumento di supporto al calcolo
              della tassa di soggiorno. L'utente è tenuto a:
            </p>
            <ul className={`list-disc list-inside mt-2 space-y-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              <li>Verificare sempre i risultati ottenuti</li>
              <li>Consultare le normative ufficiali del proprio comune</li>
              <li>Controllare le tariffe aggiornate sul sito del comune di riferimento</li>
              <li>Assumersi la responsabilità finale dei dati presentati alle autorità</li>
            </ul>
            <p className={`mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Non siamo responsabili per errori, omissioni o inesattezze nei calcoli. Il servizio non sostituisce
              la consulenza professionale di commercialisti o consulenti fiscali.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">11. Legge Applicabile</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Questi termini sono regolati dalla legge italiana. Per qualsiasi controversia sarà competente
              il foro italiano secondo la normativa vigente.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-3">12. Contatti</h3>
            <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
              Per domande su questi Termini di Servizio, contattaci a:<br />
              Email: support@tassasoggiorno.it<br />
              Privacy: privacy@tassasoggiorno.it
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

export default TermsOfService;
