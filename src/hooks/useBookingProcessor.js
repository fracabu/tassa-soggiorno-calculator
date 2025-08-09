import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const useBookingProcessor = () => {
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tariffePersonalizzate, setTariffePersonalizzate] = useState(6.00);
  const [filtroMese, setFiltroMese] = useState('');
  const [datiMensili, setDatiMensili] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [esenzioniManuali, setEsenzioniManuali] = useState(new Set());

  const MAX_NOTTI_TASSABILI = 10;
  const ETA_ESENZIONE_BAMBINI = 10;

  // Reset della pagina quando cambia il filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [filtroMese, itemsPerPage]);

  // Ricalcola quando cambia la tariffa o le esenzioni
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
      })));
    }
  }, [tariffePersonalizzate, esenzioniManuali]);

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
      if (prenotazione.stato === "OK" && !esenzioniManuali.has(prenotazione.nome)) {
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
      'Esente Manuale': esenzioniManuali.has(p.nome) ? 'Sì' : 'No',
      'Tassa Totale': p.tassaTotale.toFixed(2)
    }));
    
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
      
      // Header
      doc.setFontSize(16);
      doc.text('Dettaglio Tassa di Soggiorno Roma 2025', 14, 15);
      
      doc.setFontSize(10);
      doc.text(`Generato il: ${new Date().toLocaleDateString('it-IT')}`, 14, 25);
      
      // Riepilogo
      if (results) {
        doc.text(`Prenotazioni tassabili: ${results.prenotazioniTassabili}`, 14, 35);
        doc.text(`Totale incassi: €${results.totaleIncassi.toFixed(2)}`, 14, 40);
        doc.text(`Tariffa per persona/notte: €${tariffePersonalizzate.toFixed(2)}`, 14, 45);
      }
      
      // Tabella
      const tableData = prenotazioni.map(p => [
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
      
      autoTable(doc, {
        head: [[
          'Nome', 'Paese', 'Ospiti', 'Tassabili', 
          'Arrivo', 'Partenza', 'Notti', 'N.Tass', 
          'Stato', 'Esente', 'Tassa'
        ]],
        body: tableData,
        startY: 55,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [41, 128, 185] },
        columnStyles: {
          10: { halign: 'right' } // Align tassa column to right
        }
      });
      
      doc.save(`tassa_soggiorno_${new Date().toISOString().split('T')[0]}.pdf`);
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
    handleFileUpload,
    exportResultsCSV,
    exportResultsPDF,
    getCountryName
  };
};

export default useBookingProcessor;