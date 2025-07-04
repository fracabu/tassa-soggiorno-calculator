import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import * as d3 from 'd3';

// Componente Guida GECOS
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

            {/* Step 1 */}
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

            {/* Step 2 */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">2</span>
                Vai nella sezione "Ricerca Comunicazioni Trimestrali"
              </h3>
              <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Dopo l'accesso, verrai indirizzato alla tua area riservata.
              </p>
              <div className={`p-4 rounded-lg mb-3 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Screenshot:</strong> Schermata principale con la ricerca delle comunicazioni trimestrali
                </p>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Vedrai un elenco dei trimestri:
              </p>
              <ul className={`list-disc ml-6 mt-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>Quelli con stato <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-sm">GENERATA</span> sono in attesa di pagamento</li>
                <li>Quelli con stato <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-sm">TOTALMENTE RIVERSATA</span> sono già stati pagati</li>
              </ul>
            </div>

            {/* Step 3 */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">3</span>
                Clicca sulla riga del trimestre da pagare
              </h3>
              <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Ad esempio: <code className={`px-2 py-1 rounded ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>ATR-028844-5 / Terzo Trimestre 2025 - GENERATA</code>
              </p>
              <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Poi clicca sulla freccia a destra (˅) e seleziona il pulsante <strong>Dettaglio</strong>.
              </p>
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Screenshot:</strong> Lista dei trimestri con stati diversi - seleziona quello da pagare
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">4</span>
                Visualizza i dettagli della comunicazione
              </h3>
              <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Ti verranno mostrati tutti i dati riepilogativi della comunicazione:
              </p>
              <ul className={`list-disc ml-6 mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                <li>Dati del dichiarante</li>
                <li>Codice CIU</li>
                <li>Periodo</li>
                <li>Totale dovuto</li>
              </ul>
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Screenshot:</strong> Dettagli completi della comunicazione trimestrale
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">5</span>
                Scorri in basso per visualizzare i dettagli mensili
              </h3>
              <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Espandi i mesi <strong>APRILE</strong>, <strong>MAGGIO</strong>, <strong>GIUGNO</strong> per verificare le presenze caricate.
              </p>
              <div className={`p-4 rounded-lg mb-3 ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Screenshot:</strong> Sezione con i dettagli mensili espandibili
                </p>
              </div>
              <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Alla fine della pagina, troverai la sezione <strong>Versamenti effettuati</strong>.
              </p>
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <strong>Screenshot:</strong> Sezione versamenti con il pulsante di validazione
                </p>
              </div>
            </div>

            {/* Step 6 */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">6</span>
                Valida la Comunicazione
              </h3>
              <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Se tutto è corretto, clicca sul pulsante <span className="bg-blue-500 text-white px-3 py-1 rounded">
                  Valida Comunicazione Trimestrale
                </span> in basso a destra. Questo passaggio genera l'identificativo che poi userai per il pagamento.
              </p>
              <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${
                darkMode ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                  <strong>Nota:</strong> Dopo la validazione, lo stato della comunicazione sarà ancora "GENERATA" ma con il totale dovuto visibile.
                </p>
              </div>
            </div>

            {/* Step 7 */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">7</span>
                Carica i dati mensili e genera il pagamento unico
              </h3>
              <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Dopo aver caricato i dati di ogni mese e salvato, clicca su "Paga" per generare un unico pagamento trimestrale.
              </p>
              <div className={`p-4 rounded-lg border-2 border-dashed ${
                darkMode ? 'border-yellow-600 bg-yellow-900 bg-opacity-20' : 'border-yellow-400 bg-yellow-50'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
                  ⚠️ <strong>Screenshot mancante:</strong> Qui andrebbe inserito lo screenshot della procedura di caricamento dati mensili
                </p>
              </div>
            </div>

            {/* Step 8 */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">8</span>
                Effettua il pagamento
              </h3>
              <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Una volta generato il pagamento unico trimestrale, puoi pagare con il metodo che preferisci (es. PayPal, PagoPA, etc.).
              </p>
              <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Inserisci l'<strong>identificativo</strong> generato (es: <code className={`px-2 py-1 rounded ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>Ctb_Est_2025/902885335</code>) e completa il pagamento.
              </p>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                In alternativa, puoi tornare nella sezione <strong>Contabili Comunicazione Trimestrale</strong> per visualizzare lo stato del pagamento.
              </p>
            </div>

            {/* Step 9 */}
            <div className="mb-8">
              <h3 className={`text-lg font-semibold mb-3 flex items-center ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                <span className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">9</span>
                Scarica la ricevuta
              </h3>
              <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Dopo il pagamento, torna alla comunicazione e clicca su <strong>Dettaglio</strong> &gt; <strong>Contabili Comunicazione Trimestrale</strong> per scaricare la ricevuta.
              </p>
              <div className={`p-4 rounded-lg border-l-4 border-green-500 ${
                darkMode ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'
              }`}>
                <p className={`text-sm ${darkMode ? 'text-green-200' : 'text-green-700'}`}>
                  <strong>Suggerimento:</strong> Se la ricevuta non appare subito, attendi qualche minuto o accedi nuovamente più tardi.
                </p>
              </div>
            </div>

            {/* Help section */}
            <div className={`mt-8 p-6 rounded-lg ${
              darkMode ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <h3 className={`text-lg font-semibold mb-3 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Hai ancora dubbi?
              </h3>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Consulta il manuale ufficiale dal link in alto a destra del portale: <strong>"Manuale Contributo Forfettario"</strong>, 
                oppure clicca su <strong>Supporto GECOS</strong> per assistenza.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Login Component separato
const LoginScreen = ({ onLogin, darkMode, toggleDarkMode }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const validCredentials = {
    username: 'admin',
    password: 'gecos2024'
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (credentials.username === validCredentials.username && 
        credentials.password === validCredentials.password) {
      onLogin();
    } else {
      alert('Credenziali non valide');
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
      <div className={`max-w-md w-full mx-4 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-2xl shadow-xl border p-8`}>
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🏨</div>
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
            Calcolatore Tassa di Soggiorno
          </h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            Accesso Riservato • Versione Pro
          </p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Inserisci username"
              required
            />
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Inserisci password"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium"
          >
            Accedi al Sistema
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center justify-center space-x-2 text-sm ${
              darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'
            } transition-colors`}
          >
            <span>{darkMode ? '☀️' : '🌙'}</span>
            <span>{darkMode ? 'Modalità Chiara' : 'Modalità Scura'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const MainApp = ({ onLogout, darkMode, toggleDarkMode }) => {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ospitesByCountry, setOspitesByCountry] = useState({});
  const [tariffePersonalizzate, setTariffePersonalizzate] = useState(6.00);
  const [filtroMese, setFiltroMese] = useState('');
  const [datiMensili, setDatiMensili] = useState(null);
  const [showGuida, setShowGuida] = useState(false);

  const MAX_NOTTI_TASSABILI = 10;
  const ETA_ESENZIONE_BAMBINI = 10;

  const tariffeComuni = [
    6.00, 5.50, 5.00, 4.50, 4.00, 3.50, 3.00, 2.50, 2.00, 1.50, 1.00, 0.50
  ];

  const handleFileUpload = async (file) => {
    if (!file) return;
    
    setError('');
    setIsProcessing(true);
    
    try {
      if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
        await processExcelFile(file);
      } else if (file.name.toLowerCase().endsWith('.csv')) {
        await processCsvFile(file);
      } else {
        throw new Error('Formato file non supportato. Usa file Excel (.xlsx, .xls) o CSV.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const processExcelFile = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (data.length < 2) {
      throw new Error('Il file deve contenere almeno una riga di dati oltre all\'intestazione.');
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const mappedData = mapExcelData(headers, rows);
    processPrenotazioni(mappedData);
  };

  const processCsvFile = async (file) => {
    const text = await file.text();
    Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const mappedData = mapCsvData(results.data);
        processPrenotazioni(mappedData);
      }
    });
  };

  const mapExcelData = (headers, rows) => {
    return rows.map((row, index) => {
      const obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      
      const nome = obj['Booker'] || obj['Nome'] || obj['Guest Name'] || `Ospite ${index + 1}`;
      const persone = parseInt(obj['Persone'] || obj['Ospiti'] || obj['Adults'] || obj['Total Guests'] || 1);
      const bambini = parseInt(obj['Bambini'] || obj['Children'] || 0);
      const paese = obj['Booker country'] || obj['Paese'] || obj['Country'] || 'IT';
      const stato = mapStatus(obj['Stato'] || obj['Status'] || 'OK');
      
      const etaBambiniStr = obj['Età Bambini'] || obj['Children Ages'] || '';
      const etaBambini = etaBambiniStr ? 
        etaBambiniStr.toString().split(',').map(eta => parseInt(eta.trim())).filter(eta => !isNaN(eta)) : 
        [];
      
      return {
        nome: nome,
        ospiti: persone,
        bambini: bambini,
        etaBambini: etaBambini,
        arrivo: formatDate(obj['Arrivo'] || obj['Check-in'] || ''),
        partenza: formatDate(obj['Partenza'] || obj['Check-out'] || ''),
        stato: stato,
        paese: paese
      };
    });
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return new Date().toISOString().split('T')[0];
    
    if (typeof dateValue === 'string' && dateValue.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateValue;
    }
    
    if (typeof dateValue === 'number') {
      const date = XLSX.SSF.parse_date_code(dateValue);
      return `${date.y}-${String(date.m).padStart(2, '0')}-${String(date.d).padStart(2, '0')}`;
    }
    
    if (typeof dateValue === 'string') {
      try {
        const date = new Date(dateValue);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      } catch (e) {
        console.error('Errore nel parsing della data:', dateValue);
      }
    }
    
    return new Date().toISOString().split('T')[0];
  };

  const mapStatus = (status) => {
    if (!status) return 'OK';
    const statusLower = status.toString().toLowerCase();
    if (statusLower.includes('cancel') || statusLower.includes('annull')) return 'Cancellata';
    if (statusLower.includes('no-show') || statusLower.includes('mancata')) return 'Mancata presentazione';
    if (statusLower === 'ok') return 'OK';
    return 'OK';
  };

  const mapCsvData = (data) => {
    return data.map((row, index) => ({
      nome: row.Nome || row['Nome ospite'] || row['Guest Name'] || `Ospite ${index + 1}`,
      ospiti: parseInt(row.Ospiti || row['Numero Ospiti'] || row['Total Guests'] || row.Persone || 1),
      bambini: parseInt(row.Bambini || row.Children || 0),
      etaBambini: row['Età Bambini'] ? 
        row['Età Bambini'].split(',').map(Number) : [],
      arrivo: row.Arrivo || row.Checkin || row['Check-in'] || '',
      partenza: row.Partenza || row.Checkout || row['Check-out'] || '',
      stato: mapStatus(row.Stato || row.Status || 'OK'),
      paese: row['Booker country'] || row.Paese || row.Country || 'unknown'
    }));
  };

  const processPrenotazioni = (data) => {
    const risultati = data.map(prenotazione => {
      const notti = calcolaNotti(prenotazione.arrivo, prenotazione.partenza);
      const nottiTassabili = Math.min(notti, MAX_NOTTI_TASSABILI);
      
      let adultiTassabili = prenotazione.ospiti;
      let bambiniEsenti = 0;
      let bambiniTassabili = 0;
      
      if (prenotazione.bambini > 0 && prenotazione.etaBambini && prenotazione.etaBambini.length > 0) {
        bambiniEsenti = prenotazione.etaBambini.filter(eta => eta < ETA_ESENZIONE_BAMBINI).length;
        bambiniTassabili = prenotazione.etaBambini.filter(eta => eta >= ETA_ESENZIONE_BAMBINI).length;
        adultiTassabili = prenotazione.ospiti - prenotazione.bambini + bambiniTassabili;
      }
      
      let tassaTotale = 0;
      if (prenotazione.stato === "OK") {
        tassaTotale = adultiTassabili * nottiTassabili * tariffePersonalizzate;
      }
      
      return {
        ...prenotazione,
        notti,
        nottiTassabili,
        adultiTassabili,
        bambiniEsenti,
        bambiniTassabili,
        tassaTotale
      };
    });
    
    setPrenotazioni(risultati);
    calcolaRisultati(risultati);
  };

  const calcolaRisultati = (risultati) => {
    const totaleIncassi = risultati.reduce((sum, p) => sum + p.tassaTotale, 0);
    const prenotazioniTassabili = risultati.filter(p => p.stato === "OK").length;
    const prenotazioneCancellate = risultati.filter(p => p.stato !== "OK").length;
    
    const countryStats = {};
    risultati.forEach(p => {
      const country = p.paese || 'unknown';
      if (!countryStats[country]) {
        countryStats[country] = {
          count: 0,
          ospiti: 0,
          incassi: 0,
          nome: getCountryName(country)
        };
      }
      countryStats[country].count += 1;
      countryStats[country].ospiti += p.ospiti;
      countryStats[country].incassi += p.tassaTotale;
    });
    
    setOspitesByCountry(countryStats);
    
    setResults({
      totaleIncassi,
      prenotazioniTassabili,
      prenotazioneCancellate,
      totaleTotale: risultati.length,
      topCountries: Object.entries(countryStats)
        .sort(([,a], [,b]) => b.count - a.count)
        .slice(0, 5)
    });

    calcolaDatiMensili(risultati);
  };

  const calcolaDatiMensili = (risultati) => {
    const datiPerMese = {};
    const soggiorniMultiMese = [];
    
    risultati.forEach(prenotazione => {
      if (prenotazione.stato !== "OK") return;
      
      const dataArrivo = new Date(prenotazione.arrivo);
      const dataPartenza = new Date(prenotazione.partenza);
      
      const meseArrivo = dataArrivo.getMonth();
      const mesePartenza = dataPartenza.getMonth();
      const annoArrivo = dataArrivo.getFullYear();
      const annoPartenza = dataPartenza.getFullYear();
      
      const attraversaMultiMese = (annoArrivo !== annoPartenza) || (meseArrivo !== mesePartenza);
      
      if (attraversaMultiMese) {
        soggiorniMultiMese.push({
          nome: prenotazione.nome,
          ospiti: prenotazione.ospiti,
          arrivo: prenotazione.arrivo,
          partenza: prenotazione.partenza,
          mesi: []
        });
      }
      
      const meseArrivoKey = `${annoArrivo}-${String(meseArrivo + 1).padStart(2, '0')}`;
      
      if (!datiPerMese[meseArrivoKey]) {
        datiPerMese[meseArrivoKey] = {
          totaleOspiti: 0,
          totalePernottamenti: 0,
          totaleImporto: 0,
          prenotazioni: [],
          soggiorniMultiMese: []
        };
      }
      
      datiPerMese[meseArrivoKey].totaleOspiti += prenotazione.ospiti;
      
      const nottiPerMese = {};
      let currentDate = new Date(dataArrivo);
      
      while (currentDate < dataPartenza) {
        const nightStartDate = new Date(currentDate);
        const currentYear = nightStartDate.getFullYear();
        const currentMonth = nightStartDate.getMonth();
        const meseAnno = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
        
        if (!nottiPerMese[meseAnno]) {
          nottiPerMese[meseAnno] = [];
        }
        
        const nextDay = new Date(nightStartDate.getTime() + 24 * 60 * 60 * 1000);
        
        nottiPerMese[meseAnno].push({
          from: nightStartDate.getDate(),
          to: nextDay.getDate(),
          month: currentMonth + 1,
          year: currentYear,
          startDate: new Date(nightStartDate),
          endDate: new Date(nextDay)
        });
        
        currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      }
      
      Object.entries(nottiPerMese).forEach(([meseAnno, nottiArray]) => {
        const nottiDelMese = nottiArray.length;
        
        if (!datiPerMese[meseAnno]) {
          datiPerMese[meseAnno] = {
            totaleOspiti: 0,
            totalePernottamenti: 0,
            totaleImporto: 0,
            prenotazioni: [],
            soggiorniMultiMese: []
          };
        }
        
        const pernottamentiDelMese = prenotazione.ospiti * nottiDelMese;
        const importoDelMese = prenotazione.adultiTassabili * nottiDelMese * tariffePersonalizzate;
        
        datiPerMese[meseAnno].totalePernottamenti += pernottamentiDelMese;
        datiPerMese[meseAnno].totaleImporto += importoDelMese;
        
        if (attraversaMultiMese) {
          const dettaglioNotti = nottiArray.map(n => 
            `${n.from}→${n.to}/${n.month}`
          ).join(', ');
          
          datiPerMese[meseAnno].soggiorniMultiMese.push({
            nome: prenotazione.nome,
            ospiti: prenotazione.ospiti,
            nottiDelMese: nottiDelMese,
            pernottamentiDelMese: pernottamentiDelMese,
            isOspiteContato: meseAnno === meseArrivoKey,
            dettaglio: `${nottiDelMese} notti: ${dettaglioNotti}`
          });
          
          const soggiorno = soggiorniMultiMese[soggiorniMultiMese.length - 1];
          if (soggiorno) {
            soggiorno.mesi.push({
              mese: meseAnno,
              notti: nottiDelMese,
              pernottamenti: pernottamentiDelMese,
              dettaglio: `${nottiDelMese} notti: ${dettaglioNotti}`
            });
          }
        }
        
        datiPerMese[meseAnno].prenotazioni.push({
          ...prenotazione,
          nottiDelMese,
          importoDelMese,
          attraversaMultiMese
        });
      });
    });
    
    setDatiMensili({...datiPerMese, _soggiorniMultiMese: soggiorniMultiMese});
  };

  const getCountryName = (code) => {
    const countries = {
      'it': 'Italia',
      'us': 'Stati Uniti',
      'uk': 'Regno Unito',
      'de': 'Germania',
      'fr': 'Francia',
      'es': 'Spagna',
      'nl': 'Paesi Bassi',
      'ch': 'Svizzera',
      'at': 'Austria',
      'be': 'Belgio',
      'au': 'Australia',
      'ca': 'Canada',
      'jp': 'Giappone',
      'br': 'Brasile',
      'ar': 'Argentina',
      'mx': 'Messico',
      'ru': 'Russia',
      'cn': 'Cina',
      'in': 'India',
      'kr': 'Corea del Sud'
    };
    return countries[code?.toLowerCase()] || code?.toUpperCase() || 'Sconosciuto';
  };

  const calcolaNotti = (arrivo, partenza) => {
    const dataArrivo = new Date(arrivo);
    const dataPartenza = new Date(partenza);
    const diffTime = Math.abs(dataPartenza - dataArrivo);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const exportResults = () => {
    if (!prenotazioni || prenotazioni.length === 0) return;
    
    const csvData = prenotazioni.map(p => ({
      'Nome': p.nome,
      'Paese': getCountryName(p.paese),
      'Ospiti': p.ospiti,
      'Bambini': p.bambini || 0,
      'Bambini Esenti': p.bambiniEsenti || 0,
      'Adulti Tassabili': p.adultiTassabili,
      'Arrivo': p.arrivo,
      'Partenza': p.partenza,
      'Notti': p.notti,
      'Notti Tassabili': p.nottiTassabili,
      'Stato': p.stato,
      'Tassa Totale (€)': p.tassaTotale.toFixed(2)
    }));
    
    try {
      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tassa_soggiorno_dettaglio.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Errore nell\'export:', error);
      alert('Errore durante l\'export del CSV. Riprova.');
    }
  };

  const exportDatiMensili = () => {
    if (!datiMensili) {
      alert('Nessun dato mensile disponibile. Carica prima un file di prenotazioni.');
      return;
    }
    
    try {
      const csvData = Object.entries(datiMensili)
        .filter(([mese]) => !mese.startsWith('_'))
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([mese, dati]) => ({
          'Mese': mese,
          'Nome Mese': new Date(mese + '-01').toLocaleDateString('it-IT', { 
            year: 'numeric', 
            month: 'long' 
          }),
          'Totale Ospiti': dati.totaleOspiti,
          'Totale Pernottamenti': dati.totalePernottamenti,
          'Importo Totale (€)': dati.totaleImporto.toFixed(2),
          'Media Ospiti/Giorno': (dati.totaleOspiti / new Date(mese.split('-')[0], mese.split('-')[1], 0).getDate()).toFixed(2),
          'Soggiorni Multi-Mese': dati.soggiorniMultiMese ? dati.soggiorniMultiMese.length : 0,
          'Tariffa Utilizzata (€)': tariffePersonalizzate.toFixed(2)
        }));
      
      if (csvData.length === 0) {
        alert('Nessun dato da esportare.');
        return;
      }
      
      const csv = Papa.unparse(csvData);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'dati_mensili_gecos.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      alert(`Export completato! Scaricati dati per ${csvData.length} mesi.`);
      
    } catch (error) {
      console.error('Errore nell\'export dati mensili:', error);
      alert('Errore durante l\'export dei dati mensili. Riprova.');
    }
  };

  const getPrenotazioniFiltrate = () => {
    if (!filtroMese) return prenotazioni;
    
    return prenotazioni.filter(p => {
      const dataArrivo = new Date(p.arrivo);
      const meseArrivo = `${dataArrivo.getFullYear()}-${String(dataArrivo.getMonth() + 1).padStart(2, '0')}`;
      return meseArrivo === filtroMese;
    });
  };

  React.useEffect(() => {
    if (prenotazioni.length > 0) {
      processPrenotazioni(prenotazioni.map(p => ({
        nome: p.nome,
        ospiti: p.ospiti,
        bambini: p.bambini,
        etaBambini: p.etaBambini,
        arrivo: p.arrivo,
        partenza: p.partenza,
        stato: p.stato,
        paese: p.paese
      })));
    }
  }, [tariffePersonalizzate]);

  const WorldMap = ({ countries }) => {
    const mapRef = useRef();
    
    React.useEffect(() => {
      if (!countries || Object.keys(countries).length === 0) return;
      
      d3.select(mapRef.current).selectAll("*").remove();
      
      const width = 400;
      const height = 240;
      
      const svg = d3.select(mapRef.current)
        .attr("width", width)
        .attr("height", height);
      
      const maxOspiti = Math.max(...Object.values(countries).map(c => c.ospiti));
      const colorScale = darkMode ? 
        d3.scaleSequential(d3.interpolateBlues).domain([0, maxOspiti]) :
        d3.scaleSequential(d3.interpolateBlues).domain([0, maxOspiti]);
      
      const topCountries = Object.entries(countries)
        .sort(([,a], [,b]) => b.ospiti - a.ospiti)
        .slice(0, 8);
      
      const barHeight = (height - 40) / topCountries.length - 4;
      const maxBarWidth = width - 140;
      
      svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("font-weight", "600")
        .attr("fill", darkMode ? "#e5e7eb" : "#374151")
        .text("Ospiti per Paese");
      
      const bars = svg.selectAll("g.country-bar")
        .data(topCountries)
        .enter()
        .append("g")
        .attr("class", "country-bar")
        .attr("transform", (d, i) => `translate(0, ${30 + i * (barHeight + 4)})`);
      
      bars.append("rect")
        .attr("x", 120)
        .attr("y", 0)
        .attr("height", barHeight)
        .attr("width", d => Math.max(2, (d[1].ospiti / maxOspiti) * maxBarWidth))
        .attr("fill", d => colorScale(d[1].ospiti))
        .attr("stroke", darkMode ? "#4b5563" : "#e5e7eb")
        .attr("rx", 3)
        .style("cursor", "pointer");
      
      bars.append("text")
        .attr("x", 115)
        .attr("y", barHeight / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("font-size", "11px")
        .attr("font-weight", "500")
        .attr("fill", darkMode ? "#d1d5db" : "#374151")
        .text(d => d[1].nome.length > 12 ? 
          d[1].nome.substring(0, 12) + '...' : d[1].nome);
      
      bars.append("text")
        .attr("x", d => 125 + Math.max(2, (d[1].ospiti / maxOspiti) * maxBarWidth))
        .attr("y", barHeight / 2)
        .attr("dy", "0.35em")
        .attr("font-size", "10px")
        .attr("font-weight", "500")
        .attr("fill", darkMode ? "#9ca3af" : "#6b7280")
        .text(d => d[1].ospiti);
      
    }, [countries, darkMode]);
    
    return (
      <div className="relative">
        <svg ref={mapRef}></svg>
        <div className={`mt-2 flex items-center justify-between text-xs ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <span>Passa sopra le barre per più dettagli</span>
          <span>{Object.keys(countries).length} paesi totali</span>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-blue-50'
    } p-4`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-4">
            <svg width="120" height="40" viewBox="0 0 300 120" className="mr-3">
              <text x="60" y="45" fill="#f97316" fontSize="32" fontWeight="bold" fontFamily="Arial, sans-serif">
                Ospitly
              </text>
              <g fill="#f97316">
                <rect x="10" y="15" width="8" height="25" rx="2"/>
                <rect x="22" y="10" width="8" height="30" rx="2"/>
                <rect x="34" y="5" width="8" height="35" rx="2"/>
                <circle cx="14" cy="8" r="3"/>
                <path d="M5 45 Q15 35 25 45 Q35 35 45 45" stroke="#f97316" strokeWidth="2" fill="none"/>
              </g>
            </svg>
          </div>
        {/* Header with Dark Mode Toggle */}
        <div className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } rounded-2xl shadow-lg border p-6 mb-8`}>
          <div className="flex justify-between items-center">
            <div className="text-center flex-1">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <span className="text-4xl">🏨</span>
                <h1 className={`text-3xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Calcolatore Tassa di Soggiorno
                </h1>
              </div>
              <p className={`${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              } text-lg`}>
                Versione Pro • Multi-Tariffa • Report Mensili Gecos
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowGuida(true)}
                className={`px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium flex items-center space-x-2 ${
                  darkMode 
                    ? 'bg-blue-900 hover:bg-blue-800 text-blue-200 border border-blue-700' 
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200'
                }`}
                title="Guida GECOS"
              >
                <span>📖</span>
                <span>Guida GECOS</span>
              </button>
              
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-lg transition-all duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title={darkMode ? 'Modalità Chiara' : 'Modalità Scura'}
              >
                <span className="text-xl">{darkMode ? '☀️' : '🌙'}</span>
              </button>
              
              <button
                onClick={onLogout}
                className={`px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
                  darkMode 
                    ? 'bg-red-900 hover:bg-red-800 text-red-200 border border-red-700' 
                    : 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200'
                }`}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* NUOVI CONTROLLI */}
        <div className={`${
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        } rounded-2xl shadow-lg border p-6 mb-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Selezione Tariffa */}
            <div>
              <label className={`block text-sm font-medium ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              } mb-2`}>
                Seleziona la tariffa a notte del tuo comune
              </label>
              <div className="flex gap-3">
                <select 
                  value={tariffeComuni.includes(tariffePersonalizzate) ? tariffePersonalizzate : 'custom'}
                  onChange={(e) => {
                    if (e.target.value !== 'custom') {
                      setTariffePersonalizzate(parseFloat(e.target.value));
                    }
                  }}
                  className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
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
                
                {(!tariffeComuni.includes(tariffePersonalizzate)) && (
                  <div className="flex-1">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={tariffePersonalizzate}
                      onChange={(e) => setTariffePersonalizzate(parseFloat(e.target.value) || 0)}
                      placeholder="Es. 4.75"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>
                )}
              </div>
              <p className={`text-xs ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              } mt-1`}>
                Tariffa attuale: €{tariffePersonalizzate.toFixed(2)} per persona/notte
              </p>
            </div>

            {/* Filtro Mese */}
            {datiMensili && (
              <div>
                <label className={`block text-sm font-medium ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                } mb-2`}>
                  Filtra per Mese (Gecos)
                </label>
                <select 
                  value={filtroMese}
                  onChange={(e) => setFiltroMese(e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
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

        {!prenotazioni.length && (
          <div className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-2xl shadow-lg border p-8 mb-6`}>
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
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 cursor-pointer ${
                darkMode 
                  ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-750' 
                  : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) handleFileUpload(droppedFile);
              }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('fileInput').click()}
            >
              {isProcessing ? (
                <div>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Elaborazione in corso...
                  </p>
                </div>
              ) : (
                <div>
                  <div className="text-6xl mb-4">📊</div>
                  <h3 className={`text-lg font-medium ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  } mb-2`}>
                    Carica il file delle prenotazioni
                  </h3>
                  <p className={`${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  } mb-4`}>
                    Trascina qui il file Excel/CSV o clicca per selezionarlo
                  </p>
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-500' : 'text-gray-500'
                  }`}>
                    Supporta file .xlsx, .xls e .csv
                  </p>
                </div>
              )}
            </div>
            
            <input
              id="fileInput"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              className="hidden"
            />
          </div>
        )}

        {/* PANNELLO DATI MENSILI GECOS */}
        {datiMensili && (
          <div className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-2xl shadow-lg border p-6 mb-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                📊 Report Mensile Gecos
              </h2>
              <button
                onClick={exportDatiMensili}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-sm font-medium shadow-md"
              >
                Esporta Dati Mensili
              </button>
            </div>
            
            {/* Note per soggiorni multi-mese */}
            {datiMensili._soggiorniMultiMese && datiMensili._soggiorniMultiMese.length > 0 && (
              <div className={`mb-6 p-4 rounded-lg border ${
                darkMode 
                  ? 'bg-yellow-900 border-yellow-700 text-yellow-200' 
                  : 'bg-yellow-50 border-yellow-200 text-yellow-700'
              }`}>
                <h3 className={`font-medium mb-2 ${
                  darkMode ? 'text-yellow-200' : 'text-yellow-800'
                }`}>
                  ⚠️ Attenzione: Soggiorni Multi-Mese
                </h3>
                <p className={`text-sm mb-3 ${
                  darkMode ? 'text-yellow-300' : 'text-yellow-700'
                }`}>
                  I seguenti soggiorni attraversano più mesi. Gli <strong>ospiti sono contati nel mese di arrivo</strong>, 
                  i <strong>pernottamenti sono divisi per mese</strong>:
                </p>
                <div className="space-y-2">
                  {datiMensili._soggiorniMultiMese.map((soggiorno, index) => (
                    <div key={index} className={`text-sm border-l-4 pl-3 ${
                      darkMode ? 'border-yellow-500' : 'border-yellow-400'
                    }`}>
                      <div className={`font-medium ${
                        darkMode ? 'text-yellow-200' : 'text-yellow-800'
                      }`}>
                        {soggiorno.nome} - {soggiorno.ospiti} ospiti 
                        <span className={`text-xs ml-2 ${
                          darkMode ? 'text-yellow-400' : 'text-yellow-600'
                        }`}>
                          ({new Date(soggiorno.arrivo).toLocaleDateString('it-IT')} → {new Date(soggiorno.partenza).toLocaleDateString('it-IT')})
                        </span>
                      </div>
                      <div className={`ml-4 ${
                        darkMode ? 'text-yellow-300' : 'text-yellow-700'
                      }`}>
                        {soggiorno.mesi.map((mese, i) => (
                          <span key={i} className="mr-4 block">
                            <strong>{new Date(mese.mese + '-01').toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}:</strong> {mese.notti} notti = {mese.pernottamenti} pernottamenti
                            <span className={`text-xs ml-2 ${
                              darkMode ? 'text-yellow-400' : 'text-yellow-600'
                            }`}>({mese.dettaglio})</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {Object.entries(datiMensili)
                .filter(([mese]) => !mese.startsWith('_') && (!filtroMese || mese === filtroMese))
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([mese, dati]) => (
                  <div key={mese} className={`p-4 border rounded-xl transition-all duration-200 ${
                    darkMode 
                      ? 'border-gray-600 bg-gray-750 hover:bg-gray-700' 
                      : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                  }`}>
                    <h3 className={`font-medium mb-3 ${
                      darkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {new Date(mese + '-01').toLocaleDateString('it-IT', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <div className="text-2xl font-bold text-blue-500">
                          {dati.totaleOspiti}
                        </div>
                        <div className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Ospiti Totali
                          {dati.soggiorniMultiMese && dati.soggiorniMultiMese.length > 0 && (
                            <span className="text-yellow-500 ml-1">⚠️</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-semibold text-green-500">
                          {dati.totalePernottamenti}
                        </div>
                        <div className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          Pernottamenti Totali
                          {dati.soggiorniMultiMese && dati.soggiorniMultiMese.length > 0 && (
                            <span className="text-yellow-500 ml-1">⚠️</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-semibold text-purple-500">
                          €{dati.totaleImporto.toFixed(2)}
                        </div>
                        <div className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>Importo Totale</div>
                      </div>
                    </div>
                    
                    {/* Dettagli soggiorni multi-mese per questo mese */}
                    {dati.soggiorniMultiMese && dati.soggiorniMultiMese.length > 0 && (
                      <div className={`mt-3 pt-3 border-t ${
                        darkMode ? 'border-gray-600' : 'border-gray-200'
                      }`}>
                        <div className={`text-xs ${
                          darkMode ? 'text-yellow-300' : 'text-yellow-700'
                        }`}>
                          <strong>Soggiorni multi-mese:</strong>
                          {dati.soggiorniMultiMese.map((s, i) => (
                            <div key={i} className="mt-1">
                              {s.nome}: {s.pernottamentiDelMese} pernottamenti
                              {s.isOspiteContato ? ' (ospiti contati qui)' : ' (ospiti non contati)'}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {results && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl shadow-lg border p-6 transition-all duration-200 hover:shadow-xl`}>
              <div className="flex items-center">
                <div className="text-3xl mr-3">💰</div>
                <div>
                  <div className="text-2xl font-bold text-green-500">
                    €{results.totaleIncassi.toFixed(2)}
                  </div>
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Incassi Totali</div>
                </div>
              </div>
            </div>
            
            <div className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl shadow-lg border p-6 transition-all duration-200 hover:shadow-xl`}>
              <div className="flex items-center">
                <div className="text-3xl mr-3">✅</div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">
                    {results.prenotazioniTassabili}
                  </div>
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Prenotazioni Valide</div>
                </div>
              </div>
            </div>
            
            <div className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl shadow-lg border p-6 transition-all duration-200 hover:shadow-xl`}>
              <div className="flex items-center">
                <div className="text-3xl mr-3">❌</div>
                <div>
                  <div className="text-2xl font-bold text-red-500">
                    {results.prenotazioneCancellate}
                  </div>
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Cancellate</div>
                </div>
              </div>
            </div>
            
            <div className={`${
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            } rounded-2xl shadow-lg border p-6 transition-all duration-200 hover:shadow-xl`}>
              <div className="flex items-center">
                <div className="text-3xl mr-3">📊</div>
                <div>
                  <div className={`text-2xl font-bold ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {results.totaleTotale}
                  </div>
                  <div className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>Totale Prenotazioni</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {Object.keys(ospitesByCountry).length > 0 && (
          <div className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-2xl shadow-lg border p-6 mb-6`}>
            <h2 className={`text-xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-800'
            } mb-4`}>
              🌍 Analisi Geografica Ospiti
            </h2>
            <WorldMap countries={ospitesByCountry} />
          </div>
        )}

        {getPrenotazioniFiltrate().length > 0 && (
          <div className={`${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          } rounded-2xl shadow-lg border p-6 mb-6`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                📋 Dettaglio Prenotazioni
                {filtroMese && (
                  <span className={`text-sm font-normal ml-2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    (Filtrato: {new Date(filtroMese + '-01').toLocaleDateString('it-IT', { 
                      year: 'numeric', 
                      month: 'long' 
                    })})
                  </span>
                )}
              </h2>
              <button
                onClick={exportResults}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium shadow-md"
              >
                Esporta CSV
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={`${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Ospite
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Periodo
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Persone
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Notti Tassabili
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Stato
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                      darkMode ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      Tassa
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${
                  darkMode ? 'bg-gray-800 divide-gray-700' : 'bg-white divide-gray-200'
                }`}>
                  {getPrenotazioniFiltrate().map((prenotazione, index) => (
                    <tr key={index} className={`transition-colors duration-150 ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                    }`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className={`text-sm font-medium ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {prenotazione.nome}
                          </div>
                          <div className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {getCountryName(prenotazione.paese)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                          {new Date(prenotazione.arrivo).toLocaleDateString('it-IT')} - {new Date(prenotazione.partenza).toLocaleDateString('it-IT')}
                        </div>
                        <div className={`text-sm ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {prenotazione.notti} {prenotazione.notti === 1 ? 'notte' : 'notti'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                          {prenotazione.adultiTassabili} adulti tassabili
                        </div>
                        {prenotazione.bambiniEsenti > 0 && (
                          <div className="text-xs text-green-500">
                            -{prenotazione.bambiniEsenti} {prenotazione.bambiniEsenti === 1 ? 
                              'bambino esente' : 'bambini esenti'} (&lt;10 anni)
                          </div>
                        )}
                        {prenotazione.bambini > prenotazione.bambiniEsenti && (
                          <div className="text-xs text-orange-500">
                            +{prenotazione.bambini - prenotazione.bambiniEsenti} {(prenotazione.bambini - prenotazione.bambiniEsenti) === 1 ? 'bambino tassabile' : 'bambini tassabili'} (≥10 anni)
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-900'
                        }`}>
                          {prenotazione.nottiTassabili}
                          {prenotazione.notti > MAX_NOTTI_TASSABILI && (
                            <span className="text-xs text-orange-500 ml-1">(max 10)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          prenotazione.stato === 'OK' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {prenotazione.stato}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`text-sm font-medium ${
                          darkMode ? 'text-white' : 'text-gray-900'
                        }`}>
                          €{prenotazione.tassaTotale.toFixed(2)}
                        </div>
                        {prenotazione.tassaTotale > 0 && (
                          <div className={`text-xs ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {prenotazione.adultiTassabili} × {prenotazione.nottiTassabili} × €{tariffePersonalizzate.toFixed(2)}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {!prenotazioni.length && !isProcessing && (
          <div className="text-center mt-8">
            <p className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              💡 <strong>Nuove funzionalità:</strong><br/>
              • Tariffe personalizzabili per tutti i comuni italiani<br/>
              • Report mensili per il portale Gecos<br/>
              • Filtri avanzati per analisi dettagliate<br/>
              • Dark mode e interfaccia moderna<br/>
              • Sistema di autenticazione sicuro
            </p>
          </div>
        )}
      </div>
      
      {/* Modal Guida GECOS */}
      <GuidaGECOS 
        isOpen={showGuida} 
        onClose={() => setShowGuida(false)} 
        darkMode={darkMode} 
      />
    </div>
  );
};

// Componente principale che gestisce auth e theme
const TassaSoggiornoCalculator = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Check auth e theme on mount
  React.useEffect(() => {
    const savedAuth = localStorage.getItem('taxCalculatorAuth');
    const savedTheme = localStorage.getItem('darkMode');
    
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    if (savedTheme === 'true') {
      setDarkMode(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('taxCalculatorAuth', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('taxCalculatorAuth');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };

  if (!isAuthenticated) {
    return (
      <LoginScreen 
        onLogin={handleLogin}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    );
  }

  return (
    <MainApp 
      onLogout={handleLogout}
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
    />
  );
};

export default TassaSoggiornoCalculator;