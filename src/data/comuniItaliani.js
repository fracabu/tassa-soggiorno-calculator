// Database comuni italiani con regole specifiche per tassa di soggiorno
export const comuniItaliani = {
  // Lazio
  "Roma": {
    nome_comune: "Roma",
    regione: "Lazio",
    tariffa_min: 3.00,
    tariffa_max: 10.00,
    tariffa_default: 6.00,
    esenzione_eta: 10,
    max_notti_tassabili: 10,
    ha_stagionalita: false,
    tariffa_alta_stagione: null,
    tariffa_bassa_stagione: null,
    periodo_alta_stagione: null,
    note: "Tariffe variabili per tipologia struttura"
  },

  // Lombardia  
  "Milano": {
    nome_comune: "Milano",
    regione: "Lombardia",
    tariffa_min: 1.00,
    tariffa_max: 5.00,
    tariffa_default: 3.00,
    esenzione_eta: 10,
    max_notti_tassabili: 14,
    ha_stagionalita: false,
    tariffa_alta_stagione: null,
    tariffa_bassa_stagione: null,
    periodo_alta_stagione: null,
    note: "Tariffe per categoria struttura"
  },

  // Toscana
  "Firenze": {
    nome_comune: "Firenze",
    regione: "Toscana", 
    tariffa_min: 1.00,
    tariffa_max: 5.00,
    tariffa_default: 4.50,
    esenzione_eta: 12,
    max_notti_tassabili: 7,
    ha_stagionalita: true,
    tariffa_alta_stagione: 5.00,
    tariffa_bassa_stagione: 3.00,
    periodo_alta_stagione: "2025-04-01 to 2025-10-31",
    note: "Stagionalità aprile-ottobre"
  },

  // Veneto
  "Venezia": {
    nome_comune: "Venezia",
    regione: "Veneto",
    tariffa_min: 1.00,
    tariffa_max: 5.00,
    tariffa_default: 4.00,
    esenzione_eta: 10,
    max_notti_tassabili: 5,
    ha_stagionalita: true,
    tariffa_alta_stagione: 5.00,
    tariffa_bassa_stagione: 2.50,
    periodo_alta_stagione: "2025-03-01 to 2025-11-30",
    note: "Stagionalità marzo-novembre, max 5 notti"
  },

  // Campania
  "Napoli": {
    nome_comune: "Napoli",
    regione: "Campania",
    tariffa_min: 1.00,
    tariffa_max: 4.00,
    tariffa_default: 2.50,
    esenzione_eta: 10,
    max_notti_tassabili: 10,
    ha_stagionalita: true,
    tariffa_alta_stagione: 4.00,
    tariffa_bassa_stagione: 2.00,
    periodo_alta_stagione: "2025-04-01 to 2025-10-31",
    note: "Stagionalità periodo turistico"
  },

  // Piemonte
  "Torino": {
    nome_comune: "Torino",
    regione: "Piemonte",
    tariffa_min: 1.40,
    tariffa_max: 3.70,
    tariffa_default: 2.50,
    esenzione_eta: 10,
    max_notti_tassabili: 7,
    ha_stagionalita: false,
    tariffa_alta_stagione: null,
    tariffa_bassa_stagione: null,
    periodo_alta_stagione: null,
    note: "Tariffe per tipologia struttura"
  },

  // Liguria
  "Genova": {
    nome_comune: "Genova",
    regione: "Liguria",
    tariffa_min: 1.00,
    tariffa_max: 3.00,
    tariffa_default: 2.00,
    esenzione_eta: 12,
    max_notti_tassabili: 10,
    ha_stagionalita: true,
    tariffa_alta_stagione: 3.00,
    tariffa_bassa_stagione: 1.50,
    periodo_alta_stagione: "2025-06-15 to 2025-09-15",
    note: "Stagionalità estiva"
  },

  // Emilia-Romagna
  "Bologna": {
    nome_comune: "Bologna",
    regione: "Emilia-Romagna",
    tariffa_min: 1.50,
    tariffa_max: 4.50,
    tariffa_default: 3.00,
    esenzione_eta: 14,
    max_notti_tassabili: 5,
    ha_stagionalita: false,
    tariffa_alta_stagione: null,
    tariffa_bassa_stagione: null,
    periodo_alta_stagione: null,
    note: "Max 5 notti consecutive"
  },

  "Rimini": {
    nome_comune: "Rimini",
    regione: "Emilia-Romagna",
    tariffa_min: 1.00,
    tariffa_max: 2.50,
    tariffa_default: 1.50,
    esenzione_eta: 14,
    max_notti_tassabili: 7,
    ha_stagionalita: true,
    tariffa_alta_stagione: 2.50,
    tariffa_bassa_stagione: 1.00,
    periodo_alta_stagione: "2025-06-01 to 2025-09-30",
    note: "Stagionalità balneare"
  },

  // Trentino-Alto Adige
  "Bolzano": {
    nome_comune: "Bolzano",
    regione: "Trentino-Alto Adige",
    tariffa_min: 1.00,
    tariffa_max: 3.50,
    tariffa_default: 2.30,
    esenzione_eta: 14,
    max_notti_tassabili: 7,
    ha_stagionalita: true,
    tariffa_alta_stagione: 3.50,
    tariffa_bassa_stagione: 2.00,
    periodo_alta_stagione: "2025-05-01 to 2025-10-31",
    note: "Stagionalità turistica montana"
  },

  // Sicilia
  "Palermo": {
    nome_comune: "Palermo",
    regione: "Sicilia",
    tariffa_min: 1.00,
    tariffa_max: 3.00,
    tariffa_default: 2.50,
    esenzione_eta: 10,
    max_notti_tassabili: 4,
    ha_stagionalita: true,
    tariffa_alta_stagione: 3.00,
    tariffa_bassa_stagione: 1.50,
    periodo_alta_stagione: "2025-05-01 to 2025-10-31",
    note: "Max 4 notti consecutive"
  },

  "Catania": {
    nome_comune: "Catania",
    regione: "Sicilia",
    tariffa_min: 1.00,
    tariffa_max: 2.00,
    tariffa_default: 1.50,
    esenzione_eta: 10,
    max_notti_tassabili: 4,
    ha_stagionalita: false,
    tariffa_alta_stagione: null,
    tariffa_bassa_stagione: null,
    periodo_alta_stagione: null,
    note: "Max 4 notti consecutive"
  },

  // Puglia
  "Bari": {
    nome_comune: "Bari",
    regione: "Puglia",
    tariffa_min: 1.00,
    tariffa_max: 2.00,
    tariffa_default: 1.50,
    esenzione_eta: 12,
    max_notti_tassabili: 5,
    ha_stagionalita: true,
    tariffa_alta_stagione: 2.00,
    tariffa_bassa_stagione: 1.00,
    periodo_alta_stagione: "2025-06-01 to 2025-09-30",
    note: "Stagionalità estiva"
  },

  // Marche
  "Ancona": {
    nome_comune: "Ancona",
    regione: "Marche",
    tariffa_min: 0.50,
    tariffa_max: 2.00,
    tariffa_default: 1.20,
    esenzione_eta: 12,
    max_notti_tassabili: 5,
    ha_stagionalita: true,
    tariffa_alta_stagione: 2.00,
    tariffa_bassa_stagione: 1.00,
    periodo_alta_stagione: "2025-06-15 to 2025-09-15",
    note: "Stagionalità balneare"
  },

  // Umbria
  "Perugia": {
    nome_comune: "Perugia",
    regione: "Umbria",
    tariffa_min: 1.00,
    tariffa_max: 2.50,
    tariffa_default: 2.00,
    esenzione_eta: 10,
    max_notti_tassabili: 5,
    ha_stagionalita: false,
    tariffa_alta_stagione: null,
    tariffa_bassa_stagione: null,
    periodo_alta_stagione: null,
    note: "Max 5 notti consecutive"
  },

  // Sardegna
  "Cagliari": {
    nome_comune: "Cagliari",
    regione: "Sardegna",
    tariffa_min: 1.00,
    tariffa_max: 2.50,
    tariffa_default: 2.00,
    esenzione_eta: 12,
    max_notti_tassabili: 7,
    ha_stagionalita: true,
    tariffa_alta_stagione: 2.50,
    tariffa_bassa_stagione: 1.50,
    periodo_alta_stagione: "2025-05-01 to 2025-10-31",
    note: "Stagionalità turistica"
  }
};

// Utility per ottenere lista comuni ordinata per regione
export const getComuniByRegione = () => {
  const regioniComuni = {};
  
  Object.values(comuniItaliani).forEach(comune => {
    if (!regioniComuni[comune.regione]) {
      regioniComuni[comune.regione] = [];
    }
    regioniComuni[comune.regione].push(comune);
  });
  
  // Ordina regioni alfabeticamente
  const regioniOrdinate = Object.keys(regioniComuni).sort();
  const risultato = {};
  
  regioniOrdinate.forEach(regione => {
    risultato[regione] = regioniComuni[regione].sort((a, b) => 
      a.nome_comune.localeCompare(b.nome_comune)
    );
  });
  
  return risultato;
};

// Utility per ottenere tutti i comuni come lista piatta
export const getTuttiComuni = () => {
  return Object.values(comuniItaliani).sort((a, b) => 
    a.nome_comune.localeCompare(b.nome_comune)
  );
};

// Utility per verificare se è alta stagione per un comune
export const isAltaStagione = (nomeComune, data) => {
  const comune = comuniItaliani[nomeComune];
  if (!comune || !comune.ha_stagionalita || !comune.periodo_alta_stagione) {
    return false;
  }
  
  const [inizio, fine] = comune.periodo_alta_stagione.split(' to ');
  const dataCheck = new Date(data);
  const dataInizio = new Date(inizio);
  const dataFine = new Date(fine);
  
  return dataCheck >= dataInizio && dataCheck <= dataFine;
};

// Utility per ottenere la tariffa corretta per comune e periodo
export const getTariffaPerComune = (nomeComune, data = new Date()) => {
  const comune = comuniItaliani[nomeComune];
  if (!comune) return null;
  
  if (comune.ha_stagionalita) {
    const altaStagione = isAltaStagione(nomeComune, data);
    return altaStagione ? comune.tariffa_alta_stagione : comune.tariffa_bassa_stagione;
  }
  
  return comune.tariffa_default;
};