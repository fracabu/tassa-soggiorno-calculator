import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { comuniItaliani, isAltaStagione, getTariffaPerComune } from '../data/comuniItaliani';

const useBookingProcessor = (comuneSelezionato = 'Roma') => {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tariffePersonalizzate, setTariffePersonalizzate] = useState(6.00);
  const [filtroMese, setFiltroMese] = useState('');
  const [datiMensili, setDatiMensili] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [esenzioniManuali, setEsenzioniManuali] = useState(() => {
    // Carica esenzioni salvate da localStorage
    const savedEsenzioni = localStorage.getItem('taxCalculatorEsenzioni');
    return savedEsenzioni ? new Set(JSON.parse(savedEsenzioni)) : new Set();
  });

  // Regole dinamiche basate sul comune selezionato
  const getRegolaComune = (nomeComune) => {
    if (nomeComune === 'custom' || !comuniItaliani[nomeComune]) {
      return {
        MAX_NOTTI_TASSABILI: 10,
        ETA_ESENZIONE_BAMBINI: 10,
        nome_comune: 'Personalizzato'
      };
    }
    return {
      MAX_NOTTI_TASSABILI: comuniItaliani[nomeComune].max_notti_tassabili,
      ETA_ESENZIONE_BAMBINI: comuniItaliani[nomeComune].esenzione_eta,
      nome_comune: nomeComune,
      ha_stagionalita: comuniItaliani[nomeComune].ha_stagionalita,
      periodo_alta_stagione: comuniItaliani[nomeComune].periodo_alta_stagione,
      tariffa_alta_stagione: comuniItaliani[nomeComune].tariffa_alta_stagione,
      tariffa_bassa_stagione: comuniItaliani[nomeComune].tariffa_bassa_stagione
    };
  };

  // Reset della pagina quando cambia il filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [filtroMese, itemsPerPage]);

  // Salva esenzioni in localStorage quando cambiano
  useEffect(() => {
    localStorage.setItem('taxCalculatorEsenzioni', JSON.stringify([...esenzioniManuali]));
  }, [esenzioniManuali]);

  // Ricalcola quando cambia la tariffa, le esenzioni o il comune
  useEffect(() => {
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
      })), comuneSelezionato);
    }
  }, [tariffePersonalizzate, esenzioniManuali, comuneSelezionato]);

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
      
      const nome = obj['Nome ospite(i)'] || obj['Prenotato da'] || obj['Booker'] || obj['Nome'] || obj['Guest Name'] || `Ospite ${index + 1}`;
      const persone = parseInt(obj['Persone'] || obj['Ospiti'] || obj['Adults'] || obj['Total Guests'] || 1);
      const bambini = parseInt(obj['Bambini'] || obj['Children'] || 0);
      const paese = obj['Booker country'] || obj['Paese'] || obj['Country'] || 'IT';
      const stato = mapStatus(obj['Stato'] || obj['Status'] || 'OK');
      
      const etaBambiniStr = obj['Età dei bambini'] || obj['Età Bambini'] || obj['Children Ages'] || '';
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

  const detectCsvFormat = (data) => {
    if (data.length === 0) return 'unknown';

    const firstRow = data[0];
    const headers = Object.keys(firstRow).map(h => h.toLowerCase());

    // Controlla se è Airbnb (supporta sia formato vecchio che nuovo)
    if (headers.includes('codice di conferma') ||
        headers.includes('ospite') ||
        headers.includes('nome dell\'ospite') ||
        headers.includes('n. di adulti') ||
        (headers.includes('tipo') && headers.includes('notti'))) {
      return 'airbnb';
    }

    // Controlla se è Booking.com
    if (headers.includes('booker country') || headers.includes('prenotato da') || headers.includes('nome ospite(i)')) {
      return 'booking';
    }

    return 'generic';
  };

  const mapCsvData = (data) => {
    const format = detectCsvFormat(data);
    
    if (format === 'airbnb') {
      return mapAirbnbData(data);
    } else {
      return mapBookingCsvData(data);
    }
  };

  const mapAirbnbData = (data) => {
    // Filtra solo le righe di tipo "Prenotazione", escludendo ritenute fiscali e altri tipi
    const bookingsOnly = data.filter(row => {
      const tipo = (row['Tipo'] || '').toLowerCase();
      return !tipo || tipo.includes('prenotazione') || tipo.includes('booking');
    });

    return bookingsOnly.map((row, index) => {
      // Supporta sia il formato vecchio (con N. di adulti) che il nuovo (senza ospiti specificati)
      const adulti = parseInt(row['N. di adulti'] || row['N di adulti'] || row['Adulti'] || 1);
      const bambini = parseInt(row['N. di bambini'] || row['N di bambini'] || row['Bambini'] || 0);
      const neonati = parseInt(row['N. di neonati'] || row['N di neonati'] || row['Neonati'] || 0);

      // Nel nuovo formato, se non ci sono dati sugli ospiti, assumiamo 2 adulti come default
      const hasGuestInfo = row['N. di adulti'] || row['Adulti'];
      const ospiti = hasGuestInfo ? (adulti + bambini + neonati) : 2;

      // Mappiamo lo stato Airbnb
      let stato = 'OK';
      const statoAirbnb = (row['Stato'] || row['Status'] || '').toLowerCase();
      if (statoAirbnb.includes('cancellat') || statoAirbnb.includes('cancel')) {
        stato = 'Cancellata';
      }

      return {
        nome: row['Ospite'] || row['Nome dell\'ospite'] || row['Guest Name'] || `Ospite ${index + 1}`,
        ospiti: ospiti,
        bambini: bambini + neonati, // Contiamo tutti i minori
        etaBambini: [], // Airbnb non fornisce età specifiche nel CSV standard
        arrivo: formatAirbnbDate(row['Data di inizio'] || row['Check-in'] || ''),
        partenza: formatAirbnbDate(row['Data di fine'] || row['Check-out'] || ''),
        stato: stato,
        paese: row['Paese'] || row['Country'] || 'IT', // Airbnb non sempre fornisce il paese
        fonte: 'Airbnb' // Aggiungiamo un campo per identificare la fonte
      };
    });
  };

  const mapBookingCsvData = (data) => {
    return data.map((row, index) => ({
      nome: row.Nome || row['Nome ospite'] || row['Guest Name'] || `Ospite ${index + 1}`,
      ospiti: parseInt(row.Ospiti || row['Numero Ospiti'] || row['Total Guests'] || row.Persone || 1),
      bambini: parseInt(row.Bambini || row.Children || 0),
      etaBambini: row['Età Bambini'] ?
        row['Età Bambini'].split(',').map(Number) : [],
      arrivo: row.Arrivo || row.Checkin || row['Check-in'] || '',
      partenza: row.Partenza || row.Checkout || row['Check-out'] || '',
      stato: mapStatus(row.Stato || row.Status || 'OK'),
      paese: row['Booker country'] || row.Paese || row.Country || 'unknown',
      fonte: 'Booking.com' // Identifica la fonte
    }));
  };

  const formatAirbnbDate = (dateStr) => {
    if (!dateStr) return new Date().toISOString().split('T')[0];

    // Airbnb usa formato MM/DD/YYYY (formato americano)
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [month, day, year] = parts;
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return dateStr;
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
    const statusLower = status.toString().toLowerCase().trim();
    if (statusLower.includes('cancel') || statusLower.includes('annull')) return 'Cancellata';
    if (statusLower.includes('no_show') || statusLower.includes('no-show') || statusLower === 'no_show' || statusLower.includes('mancata')) return 'Mancata presentazione';
    if (statusLower === 'ok') return 'OK';
    return 'OK';
  };

  const processPrenotazioni = (data, comuneCorrente = comuneSelezionato) => {
    const regole = getRegolaComune(comuneCorrente);
    
    const risultati = data.map(prenotazione => {
      const notti = calcolaNotti(prenotazione.arrivo, prenotazione.partenza);
      const nottiTassabili = Math.min(notti, regole.MAX_NOTTI_TASSABILI);
      
      let adultiTassabili = prenotazione.ospiti;
      let bambiniEsenti = 0;
      let bambiniTassabili = 0;
      
      if (prenotazione.bambini > 0 && prenotazione.etaBambini && prenotazione.etaBambini.length > 0) {
        bambiniEsenti = prenotazione.etaBambini.filter(eta => eta < regole.ETA_ESENZIONE_BAMBINI).length;
        bambiniTassabili = prenotazione.etaBambini.filter(eta => eta >= regole.ETA_ESENZIONE_BAMBINI).length;
        adultiTassabili = prenotazione.ospiti - prenotazione.bambini + bambiniTassabili;
      }
      
      let tassaTotale = 0;
      if (prenotazione.stato === "OK" && !esenzioniManuali.has(prenotazione.nome)) {
        // Calcola tariffa considerando stagionalità se applicabile
        let tariffa = tariffePersonalizzate;
        if (regole.ha_stagionalita && comuneCorrente !== 'custom') {
          const altaStagione = isAltaStagione(comuneCorrente, prenotazione.arrivo);
          tariffa = altaStagione ? regole.tariffa_alta_stagione : regole.tariffa_bassa_stagione;
        }
        
        tassaTotale = adultiTassabili * nottiTassabili * tariffa;
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
    
    setResults({
      totaleIncassi,
      prenotazioniTassabili,
      prenotazioneCancellate,
      totaleTotale: risultati.length
    });

    calcolaDatiMensili(risultati);
  };

  const calcolaDatiMensili = (risultati) => {
    const datiPerMese = {};
    
    risultati.forEach(prenotazione => {
      if (prenotazione.stato !== "OK") return;
      
      const dataArrivo = new Date(prenotazione.arrivo);
      const meseArrivo = `${dataArrivo.getFullYear()}-${String(dataArrivo.getMonth() + 1).padStart(2, '0')}`;
      
      if (!datiPerMese[meseArrivo]) {
        datiPerMese[meseArrivo] = {
          totaleOspiti: 0,
          totalePernottamenti: 0,
          totaleImporto: 0,
          prenotazioni: []
        };
      }
      
      datiPerMese[meseArrivo].totaleOspiti += prenotazione.ospiti;
      datiPerMese[meseArrivo].totalePernottamenti += prenotazione.ospiti * prenotazione.notti;
      datiPerMese[meseArrivo].totaleImporto += prenotazione.tassaTotale;
      datiPerMese[meseArrivo].prenotazioni.push(prenotazione);
    });
    
    setDatiMensili(datiPerMese);
  };

  const calcolaNotti = (arrivo, partenza) => {
    const dataArrivo = new Date(arrivo);
    const dataPartenza = new Date(partenza);
    const diffTime = Math.abs(dataPartenza - dataArrivo);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

  const exportResultsCSV = () => {
    if (!prenotazioni || prenotazioni.length === 0) return;
    
    const { trimestri, totaliGenerali } = raggruppaNeiTrimestri(prenotazioni);
    const csvData = [];
    
    // Aggiungi prenotazioni raggruppate per trimestre
    Object.keys(trimestri).sort().forEach(trimestre => {
      // Header trimestre
      csvData.push({
        'Nome': `=== ${trimestre} ===`,
        'Paese': '',
        'Ospiti': '',
        'Bambini': '',
        'Bambini Esenti': '',
        'Adulti Tassabili': '',
        'Arrivo': '',
        'Partenza': '',
        'Notti': '',
        'Notti Tassabili': '',
        'Stato': '',
        'Trimestre': trimestre,
        'Esente Manuale': '',
        'Tassa Totale': ''
      });
      
      // Prenotazioni del trimestre
      trimestri[trimestre].prenotazioni.forEach(p => {
        csvData.push({
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
          'Trimestre': getTrimestre(p.arrivo),
          'Esente Manuale': esenzioniManuali.has(p.nome) ? 'Sì' : 'No',
          'Tassa Totale': p.tassaTotale.toFixed(2)
        });
      });
      
      // Totale trimestre
      csvData.push({
        'Nome': `TOTALE ${trimestre}`,
        'Paese': '',
        'Ospiti': trimestri[trimestre].totali.ospiti,
        'Bambini': trimestri[trimestre].totali.bambini,
        'Bambini Esenti': trimestri[trimestre].totali.bambiniEsenti,
        'Adulti Tassabili': trimestri[trimestre].totali.adultiTassabili,
        'Arrivo': '',
        'Partenza': '',
        'Notti': trimestri[trimestre].totali.notti,
        'Notti Tassabili': trimestri[trimestre].totali.nottiTassabili,
        'Stato': '',
        'Trimestre': '',
        'Esente Manuale': '',
        'Tassa Totale': trimestri[trimestre].totali.tassa.toFixed(2)
      });
      
      // Riga vuota
      csvData.push({
        'Nome': '',
        'Paese': '',
        'Ospiti': '',
        'Bambini': '',
        'Bambini Esenti': '',
        'Adulti Tassabili': '',
        'Arrivo': '',
        'Partenza': '',
        'Notti': '',
        'Notti Tassabili': '',
        'Stato': '',
        'Trimestre': '',
        'Esente Manuale': '',
        'Tassa Totale': ''
      });
    });
    
    // Totale generale
    csvData.push({
      'Nome': '=== TOTALE GENERALE ===',
      'Paese': '',
      'Ospiti': totaliGenerali.ospiti,
      'Bambini': totaliGenerali.bambini,
      'Bambini Esenti': totaliGenerali.bambiniEsenti,
      'Adulti Tassabili': totaliGenerali.adultiTassabili,
      'Arrivo': '',
      'Partenza': '',
      'Notti': totaliGenerali.notti,
      'Notti Tassabili': totaliGenerali.nottiTassabili,
      'Stato': '',
      'Trimestre': '',
      'Esente Manuale': '',
      'Tassa Totale': totaliGenerali.tassa.toFixed(2)
    });
    
    try {
      // Configurazione Papa Parse per CSV ben formattato
      const csv = Papa.unparse(csvData, {
        delimiter: ';',
        header: true,
        encoding: 'utf-8'
      });
      
      // Aggiungi BOM per Excel
      const csvWithBOM = '\uFEFF' + csv;
      
      const blob = new Blob([csvWithBOM], { 
        type: 'text/csv;charset=utf-8;' 
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tassa_soggiorno_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Errore nell\'export CSV:', error);
      alert('Errore durante l\'export del CSV. Riprova.');
    }
  };

  const exportResultsPDF = () => {
    if (!prenotazioni || prenotazioni.length === 0) return;
    
    try {
      const doc = new jsPDF();
      const { trimestri, totaliGenerali } = raggruppaNeiTrimestri(prenotazioni);
      let currentY = 15;
      
      // Header
      doc.setFontSize(16);
      doc.text('Tassa di Soggiorno Roma 2025 - Report Trimestrale', 14, currentY);
      currentY += 10;
      
      doc.setFontSize(10);
      doc.text(`Generato il: ${new Date().toLocaleDateString('it-IT')}`, 14, currentY);
      currentY += 5;
      
      // Riepilogo generale
      if (results) {
        doc.text(`Prenotazioni tassabili totali: ${results.prenotazioniTassabili}`, 14, currentY);
        currentY += 5;
        doc.text(`Totale generale: €${totaliGenerali.tassa.toFixed(2)}`, 14, currentY);
        currentY += 5;
        doc.text(`Tariffa per persona/notte: €${tariffePersonalizzate.toFixed(2)}`, 14, currentY);
        currentY += 15;
      }
      
      // Tabelle per trimestre
      Object.keys(trimestri).sort().forEach((trimestre, index) => {
        if (index > 0 && currentY > 200) {
          doc.addPage();
          currentY = 15;
        }
        
        // Header trimestre
        doc.setFontSize(12);
        const trimestreText = `${trimestre} - Totale: €${trimestri[trimestre].totali.tassa.toFixed(2)}`;
        doc.text(trimestreText, 14, currentY);
        currentY += 10;
        
        // Dati trimestre
        const tableData = trimestri[trimestre].prenotazioni.map(p => [
          p.nome,
          getCountryName(p.paese),
          p.ospiti.toString(),
          p.adultiTassabili.toString(),
          p.arrivo,
          p.partenza,
          p.notti.toString(),
          p.nottiTassabili.toString(),
          p.stato,
          esenzioniManuali.has(p.nome) ? 'Sì' : 'No',
          `€${p.tassaTotale.toFixed(2)}`
        ]);
        
        // Aggiungi riga totale
        tableData.push([
          'TOTALE TRIMESTRE', 
          '', 
          trimestri[trimestre].totali.ospiti.toString(),
          trimestri[trimestre].totali.adultiTassabili.toString(),
          '', 
          '', 
          trimestri[trimestre].totali.notti.toString(),
          trimestri[trimestre].totali.nottiTassabili.toString(),
          '', 
          '',
          `€${trimestri[trimestre].totali.tassa.toFixed(2)}`
        ]);
        
        autoTable(doc, {
          head: [[
            'Nome', 'Paese', 'Ospiti', 'Tassabili', 
            'Arrivo', 'Partenza', 'Notti', 'N.Tass', 
            'Stato', 'Esente', 'Tassa'
          ]],
          body: tableData,
          startY: currentY,
          styles: { fontSize: 7 },
          headStyles: { fillColor: [41, 128, 185] },
          columnStyles: {
            10: { halign: 'right' }
          },
          // Stile speciale per riga totale
          didParseCell: function(data) {
            if (data.row.index === tableData.length - 1) {
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.fillColor = [240, 240, 240];
            }
          }
        });
        
        currentY = doc.lastAutoTable.finalY + 15;
      });
      
      // Totale generale finale
      if (currentY > 250) {
        doc.addPage();
        currentY = 15;
      }
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(`TOTALE GENERALE: €${totaliGenerali.tassa.toFixed(2)}`, 14, currentY);
      currentY += 10;
      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');
      doc.text(`Ospiti totali: ${totaliGenerali.ospiti} | Notti totali: ${totaliGenerali.notti} | Notti tassabili: ${totaliGenerali.nottiTassabili}`, 14, currentY);
      
      doc.save(`tassa_soggiorno_trimestri_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error('Errore nell\'export PDF:', error);
      alert('Errore durante l\'export del PDF. Riprova.');
    }
  };

  const toggleEsenzione = (nomeOspite) => {
    const newEsenzioni = new Set(esenzioniManuali);
    if (newEsenzioni.has(nomeOspite)) {
      newEsenzioni.delete(nomeOspite);
    } else {
      newEsenzioni.add(nomeOspite);
    }
    setEsenzioniManuali(newEsenzioni);
  };

  const clearEsenzioni = () => {
    setEsenzioniManuali(new Set());
    localStorage.removeItem('taxCalculatorEsenzioni');
  };

  const getTrimestre = (dataArrivo) => {
    const data = new Date(dataArrivo);
    const mese = data.getMonth() + 1; // getMonth() returns 0-11
    
    if (mese >= 1 && mese <= 3) return 'Q1 (Gen-Mar) - Scadenza 16 Apr';
    if (mese >= 4 && mese <= 6) return 'Q2 (Apr-Giu) - Scadenza 16 Lug';
    if (mese >= 7 && mese <= 9) return 'Q3 (Lug-Set) - Scadenza 16 Ott';
    return 'Q4 (Ott-Dic) - Scadenza 16 Gen';
  };

  const raggruppaNeiTrimestri = (prenotazioni) => {
    const trimestri = {};
    let totaliGenerali = {
      ospiti: 0,
      bambini: 0,
      bambiniEsenti: 0,
      adultiTassabili: 0,
      notti: 0,
      nottiTassabili: 0,
      tassa: 0
    };
    
    prenotazioni.forEach(p => {
      if (p.stato === 'OK') {
        const trimestre = getTrimestre(p.arrivo);
        if (!trimestri[trimestre]) {
          trimestri[trimestre] = { 
            prenotazioni: [], 
            totali: {
              ospiti: 0,
              bambini: 0,
              bambiniEsenti: 0,
              adultiTassabili: 0,
              notti: 0,
              nottiTassabili: 0,
              tassa: 0
            }
          };
        }
        
        trimestri[trimestre].prenotazioni.push(p);
        trimestri[trimestre].totali.ospiti += p.ospiti;
        trimestri[trimestre].totali.bambini += p.bambini || 0;
        trimestri[trimestre].totali.bambiniEsenti += p.bambiniEsenti || 0;
        trimestri[trimestre].totali.adultiTassabili += p.adultiTassabili;
        trimestri[trimestre].totali.notti += p.notti;
        trimestri[trimestre].totali.nottiTassabili += p.nottiTassabili;
        trimestri[trimestre].totali.tassa += p.tassaTotale;
        
        // Totali generali
        totaliGenerali.ospiti += p.ospiti;
        totaliGenerali.bambini += p.bambini || 0;
        totaliGenerali.bambiniEsenti += p.bambiniEsenti || 0;
        totaliGenerali.adultiTassabili += p.adultiTassabili;
        totaliGenerali.notti += p.notti;
        totaliGenerali.nottiTassabili += p.nottiTassabili;
        totaliGenerali.tassa += p.tassaTotale;
      }
    });
    
    return { trimestri, totaliGenerali };
  };

  const resetData = () => {
    setPrenotazioni([]);
    setResults(null);
    setError('');
    setFiltroMese('');
    setDatiMensili(null);
    setCurrentPage(1);
  };

  return {
    prenotazioni,
    results,
    error,
    isProcessing,
    tariffePersonalizzate,
    setTariffePersonalizzate,
    filtroMese,
    setFiltroMese,
    datiMensili,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    esenzioniManuali,
    toggleEsenzione,
    clearEsenzioni,
    handleFileUpload,
    exportResultsCSV,
    exportResultsPDF,
    getCountryName,
    resetData
  };
};

export default useBookingProcessor;