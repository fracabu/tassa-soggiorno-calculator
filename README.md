# 🏨 Calcolatore Tassa di Soggiorno - Comuni Italiani 2025

**Applicazione web professionale per il calcolo automatico della tassa di soggiorno secondo le normative comunali italiane 2025.**

Strumento specializzato per strutture ricettive (hotel, B&B, appartamenti) che devono gestire il calcolo e la rendicontazione della tassa di soggiorno per i diversi comuni italiani.

## 🚀 Caratteristiche Principali

### 📊 Calcolo Automatico Multi-Comune
- **Database completo** dei comuni italiani con regole specifiche
- **Calcolo dinamico** basato su normative comunali (Roma, Milano, Firenze, Venezia, Napoli, Bologna, ecc.)
- **Gestione stagionalità** per comuni con tariffe alta/bassa stagione
- **Esenzioni automatiche** per bambini (età configurabile per comune)
- **Limite notti tassabili** rispettato per ogni comune

### 📁 Elaborazione File Avanzata
- **Supporto Excel/CSV**: File .xlsx, .xls e .csv
- **Import flessibile**: Compatibile con esportazioni Booking.com, Airbnb e formati personalizzati
- **Mappatura intelligente** delle colonne con riconoscimento automatico
- **Gestione date robusta** incluse date seriali Excel

### 📈 Analisi e Reportistica
- **Report mensili** per compliance fiscale
- **Analisi geografica** ospiti per paese di provenienza
- **Export multi-formato**: CSV per contabilità, PDF per archiviazione
- **Integrazione GECOS** per comuni che utilizzano il portale

### 🎨 Interfaccia Moderna
- **Design responsive** ottimizzato per desktop, tablet e mobile
- **Modalità chiara/scura** con persistenza preferenze
- **Workflow guidato** in 3 passaggi intuitivi
- **Gestione errori avanzata** con feedback utente

### 🔧 Funzionalità Avanzate
- **Esenzioni manuali** con sistema di override
- **Persistenza dati** tramite localStorage
- **Filtri temporali** per analisi mensili
- **Paginazione tabelle** per grandi dataset
- **Sistema di autenticazione** per accesso controllato

## 🏗️ Architettura Tecnica

### Stack Tecnologico
- **Frontend**: React 18.2.0 + Create React App
- **Styling**: Tailwind CSS 3.4.1 con tema dark/light
- **Processing**: XLSX 0.18.5, Papa Parse 5.4.1
- **Export**: jsPDF 3.0.1 + jsPDF-AutoTable 5.0.2
- **Analisi**: D3.js 7.8.5, Lodash 4.17.21, Math.js 11.11.0
- **UI**: Lucide React 0.263.1 (icone)

### Struttura Modulare
```
src/
├── App.js                    # Componente principale + autenticazione
├── hooks/
│   └── useBookingProcessor.js # Logica business per elaborazione
├── components/               # Componenti UI modulari
│   ├── LoginScreen.js       # Sistema autenticazione
│   ├── FileUpload.js        # Upload e validazione file
│   ├── BookingsTable.js     # Tabella prenotazioni con paginazione
│   ├── ResultsCards.js      # Dashboard risultati
│   └── [altri componenti]
├── data/
│   └── comuniItaliani.js    # Database regole comunali
└── [file di configurazione]
```

## 🛠️ Installazione e Setup

### Prerequisiti
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installazione
```bash
# Clona il repository
git clone [url-repository]
cd tassa-soggiorno-calculator

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm start
```

L'applicazione sarà disponibile su `http://localhost:3000`

### Build per Produzione
```bash
# Crea la build ottimizzata
npm run build

# La cartella build/ conterrà i file pronti per il deployment
```

## 📋 Comandi di Sviluppo

```bash
# Sviluppo
npm start                    # Server di sviluppo con hot reload
npm run build               # Build di produzione ottimizzata
npm test                    # Esecuzione test suite
npm test -- --watchAll=false # Test singola esecuzione
npm run eject              # Eject da Create React App (irreversibile)
```

## 🎯 Utilizzo dell'Applicazione

### 1. Accesso Sistema
- **Credenziali**: `admin` / `gecos2024`
- Autenticazione persistente via localStorage

### 2. Selezione Comune
- Scegli il comune di riferimento dal dropdown
- Il sistema carica automaticamente:
  - Tariffa specifica del comune
  - Età di esenzione bambini
  - Numero massimo notti tassabili
  - Eventuale gestione stagionalità
- Opzione "Configurazione personalizzata" per comuni non in database

### 3. Caricamento File
- **Formati supportati**: Excel (.xlsx, .xls), CSV
- **Colonne riconosciute automaticamente**:
  - Nomi: `Booker`, `Nome`, `Guest Name`
  - Ospiti: `Persone`, `Ospiti`, `Adults`, `Total Guests`
  - Bambini: `Bambini`, `Children`
  - Paese: `Booker country`, `Paese`, `Country`
  - Date: `Arrivo`/`Check-in`, `Partenza`/`Check-out`

### 4. Revisione e Export
- **Controllo dati**: Verifica calcoli e applica esenzioni manuali
- **Filtri**: Analisi per periodo/mese specifico
- **Export**: Scarica CSV (per contabilità) o PDF (per archiviazione)

## 🗂️ Database Comuni Italiani

### Comuni Supportati
Il sistema include regole specifiche per:
- **Lazio**: Roma
- **Lombardia**: Milano
- **Toscana**: Firenze
- **Veneto**: Venezia
- **Campania**: Napoli
- **Emilia-Romagna**: Bologna
- **Altri comuni** in continua espansione

### Aggiungere Nuovo Comune
Per aggiungere un nuovo comune, modifica `src/data/comuniItaliani.js`:

```javascript
"NomeComune": {
  nome_comune: "Nome Comune",
  regione: "Nome Regione",
  tariffa_default: 4.50,
  esenzione_eta: 12,
  max_notti_tassabili: 7,
  ha_stagionalita: true, // opzionale
  tariffa_alta_stagione: 6.00, // se stagionalità
  tariffa_bassa_stagione: 3.00,
  periodo_alta_stagione: "2025-06-01 to 2025-09-30"
}
```

## 🔐 Sicurezza e Privacy

- **Dati locali**: Tutti i file vengono elaborati localmente nel browser
- **Nessun upload server**: I dati non lasciano mai il dispositivo dell'utente
- **Storage persistente**: Solo preferenze UI e esenzioni manuali in localStorage
- **Autenticazione**: Sistema base per controllo accesso

## 📱 Compatibilità

### Browser Supportati
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivi
- **Desktop**: Esperienza completa
- **Tablet**: Layout ottimizzato
- **Mobile**: Funzionalità essenziali disponibili

## 🛠️ Personalizzazioni

### Temi
- Modalità chiara/scura automatica
- Persistenza preferenze utente
- Colori personalizzabili via Tailwind

### Configurazioni
- Tariffe personalizzate per comune custom
- Esenzioni manuali per casi specifici
- Paginazione tabella configurabile

## 📊 Formati Export

### CSV (Contabilità)
- Compatibile con principali software contabili
- Colonne: Nome, Ospiti, Notti, Tassa, Totale, Paese, Date
- Encoding UTF-8 con separatori italiani

### PDF (Archiviazione)
- Report completo con header comunale
- Tabelle formattate per stampa
- Statistiche riassuntive

## 🔧 Troubleshooting

### Problemi Comuni

**File non riconosciuto**
- Verifica formato (.xlsx, .xls, .csv)
- Controlla che il file contenga intestazioni colonne

**Calcoli errati**
- Verifica selezione comune corretto
- Controlla età bambini per esenzioni
- Verifica date arrivo/partenza

**Export fallito**
- Controlla popup browser bloccati
- Verifica spazio disponibile dispositivo

### Debug
```bash
# Modalità sviluppo con log dettagliati
npm start

# Console browser per errori JavaScript
F12 → Console
```

## 🤝 Contributi

Per segnalazioni bug o richieste funzionalità:
1. Verifica issues esistenti
2. Crea nuovo issue con template appropriato
3. Include informazioni sistema e passi riproduzione

## 📄 Licenza

Questo progetto è rilasciato sotto licenza MIT. Vedi file `LICENSE` per dettagli completi.

## 📞 Supporto

Per supporto tecnico o domande sull'utilizzo:
- Issues GitHub per bug/feature requests
- Documentazione tecnica in `CLAUDE.md`
- Guida integrata nell'applicazione (pulsante ?)

---

**Versione**: 1.0.0  
**Ultimo aggiornamento**: 2025  
**Compatibilità**: Normative comunali italiane 2025
