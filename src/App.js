import React, { useState, useEffect } from 'react';
import { Upload, FileText, Calculator, Download, Globe } from 'lucide-react';
import * as XLSX from 'xlsx';
import Papa from 'papaparse';
import * as d3 from 'd3';

const TassaSoggiornoCalculator = () => {
  const [file, setFile] = useState(null);
  const [prenotazioni, setPrenotazioni] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [showCancelled, setShowCancelled] = useState(true);
  const [ospitesByCountry, setOspitesByCountry] = useState({});

  const TARIFFA_PER_NOTTE = 6.00;
  const MAX_NOTTI_TASSABILI = 10;
  const ETA_ESENZIONE_BAMBINI = 10;

  const handleFileUpload = async (uploadedFile) => {
    setIsProcessing(true);
    setFile(uploadedFile);
    setError(null);
    
    try {
      if (uploadedFile.type === 'application/pdf') {
        setError('Il parsing PDF è in fase di sviluppo. Ti consiglio di usare il file Excel (.xls) che hai caricato prima - funziona perfettamente con tutte le colonne di Booking.com!');
      } else if (uploadedFile.name.endsWith('.csv')) {
        const text = await readTextFile(uploadedFile);
        const data = Papa.parse(text, { header: true, skipEmptyLines: true }).data;
        const mappedData = mapCsvData(data);
        processPrenotazioni(mappedData);
      } else {
        const fileContent = await readFile(uploadedFile);
        const data = await processExcelFile(fileContent);
        processPrenotazioni(data);
      }
    } catch (error) {
      console.error('Errore nel processare il file:', error);
      setError(`Errore nel processare il file: ${error.message}. Ti consiglio di usare il file Excel (.xls) da Booking.com che funziona perfettamente!`);
    } finally {
      setIsProcessing(false);
    }
  };

  const readFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const readTextFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const processExcelFile = async (fileContent) => {
    const workbook = XLSX.read(fileContent);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log('=== LETTURA FILE BOOKING.COM ===');
    console.log(`Trovate ${data.length} prenotazioni`);
    
    return data.map((row, index) => {
      const nome = row['Nome ospite(i)'] || row['Prenotato da'] || `Ospite ${index + 1}`;
      const persone = parseInt(row['Persone'] || 1);
      const adulti = parseInt(row['Adulti'] || persone);
      const bambini = parseInt(row['Bambini'] || 0);
      const paese = row['Booker country'] || 'unknown';
      
      let etaBambini = [];
      if (bambini > 0 && row['Età dei bambini']) {
        const etaStr = row['Età dei bambini'].toString();
        if (etaStr.includes(',')) {
          etaBambini = etaStr.split(',').map(age => parseInt(age.trim())).filter(age => !isNaN(age));
        } else {
          const eta = parseInt(etaStr);
          if (!isNaN(eta)) {
            etaBambini = [eta];
          }
        }
        
        if (etaBambini.length === 1 && bambini > 1) {
          etaBambini = Array(bambini).fill(etaBambini[0]);
        }
      }
      
      let stato = 'OK';
      const statoRaw = (row['Stato'] || '').toLowerCase();
      if (statoRaw.includes('cancel')) {
        stato = 'Cancellata';
      } else if (statoRaw.includes('no-show') || statoRaw.includes('mancata')) {
        stato = 'Mancata presentazione';
      }
      
      console.log(`${index + 1}. ${nome}:`);
      console.log(`   Persone: ${persone}, Adulti: ${adulti}, Bambini: ${bambini}`);
      console.log(`   Età bambini: [${etaBambini.join(', ')}]`);
      console.log(`   Paese: ${paese}, Stato: ${stato}`);
      
      const mappedData = {
        nome: nome,
        ospiti: persone,
        bambini: bambini,
        etaBambini: etaBambini,
        arrivo: formatDate(row['Arrivo'] || ''),
        partenza: formatDate(row['Partenza'] || ''),
        stato: stato,
        paese: paese
      };
      
      return mappedData;
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
      etaBambini: row['Età Bambini'] ? row['Età Bambini'].split(',').map(Number) : [],
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
        tassaTotale = adultiTassabili * nottiTassabili * TARIFFA_PER_NOTTE;
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
    const csvData = prenotazioni.map(p => ({
      Nome: p.nome,
      Paese: getCountryName(p.paese),
      Ospiti: p.ospiti,
      Bambini: p.bambini || 0,
      'Bambini Esenti': p.bambiniEsenti,
      'Adulti Tassabili': p.adultiTassabili,
      Arrivo: p.arrivo,
      Partenza: p.partenza,
      Notti: p.notti,
      'Notti Tassabili': p.nottiTassabili,
      Stato: p.stato,
      'Tassa Totale (€)': p.tassaTotale.toFixed(2)
    }));
    
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tassa_soggiorno_roma_con_paesi.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const WorldMap = ({ countries }) => {
    const mapRef = React.useRef();
    
    React.useEffect(() => {
      if (!countries || Object.keys(countries).length === 0) return;
      
      d3.select(mapRef.current).selectAll("*").remove();
      
      const width = 400;
      const height = 240;
      
      const svg = d3.select(mapRef.current)
        .attr("width", width)
        .attr("height", height);
      
      const maxOspiti = Math.max(...Object.values(countries).map(c => c.ospiti));
      const colorScale = d3.scaleSequential(d3.interpolateBlues)
        .domain([0, maxOspiti]);
      
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
        .attr("fill", "#374151")
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
        .attr("stroke", "#e5e7eb")
        .attr("rx", 3)
        .style("cursor", "pointer")
        .on("mouseover", function(event, d) {
          d3.select(this).attr("opacity", 0.8);
          
          const tooltip = svg.append("g")
            .attr("class", "tooltip")
            .attr("transform", `translate(${120 + (d[1].ospiti / maxOspiti) * maxBarWidth + 10}, ${30 + topCountries.indexOf(d) * (barHeight + 4)})`);
          
          tooltip.append("rect")
            .attr("width", 120)
            .attr("height", 60)
            .attr("fill", "#1f2937")
            .attr("rx", 4)
            .attr("opacity", 0.9);
          
          tooltip.append("text")
            .attr("x", 8)
            .attr("y", 15)
            .attr("fill", "white")
            .attr("font-size", "11px")
            .attr("font-weight", "600")
            .text(d[1].nome);
          
          tooltip.append("text")
            .attr("x", 8)
            .attr("y", 30)
            .attr("fill", "#d1d5db")
            .attr("font-size", "10px")
            .text(`${d[1].ospiti} ospiti`);
          
          tooltip.append("text")
            .attr("x", 8)
            .attr("y", 45)
            .attr("fill", "#d1d5db")
            .attr("font-size", "10px")
            .text(`€${d[1].incassi.toFixed(0)} incassati`);
        })
        .on("mouseout", function() {
          d3.select(this).attr("opacity", 1);
          svg.selectAll(".tooltip").remove();
        });
      
      bars.append("circle")
        .attr("cx", 105)
        .attr("cy", barHeight / 2)
        .attr("r", 8)
        .attr("fill", "#f3f4f6")
        .attr("stroke", "#d1d5db");
      
      bars.append("text")
        .attr("x", 105)
        .attr("y", barHeight / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("font-size", "8px")
        .attr("font-weight", "600")
        .attr("fill", "#374151")
        .text(d => d[0].toUpperCase());
      
      bars.append("text")
        .attr("x", 90)
        .attr("y", barHeight / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .attr("font-size", "11px")
        .attr("font-weight", "500")
        .attr("fill", "#374151")
        .text(d => d[1].nome.length > 12 ? d[1].nome.substring(0, 12) + '...' : d[1].nome);
      
      bars.append("text")
        .attr("x", d => 125 + Math.max(2, (d[1].ospiti / maxOspiti) * maxBarWidth))
        .attr("y", barHeight / 2)
        .attr("dy", "0.35em")
        .attr("font-size", "10px")
        .attr("font-weight", "500")
        .attr("fill", "#6b7280")
        .text(d => d[1].ospiti);
      
    }, [countries]);
    
    return (
      <div className="relative">
        <svg ref={mapRef}></svg>
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Passa sopra le barre per più dettagli</span>
          <span>{Object.keys(countries).length} paesi totali</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gray-800 mb-2">
            Calcolatore Tassa di Soggiorno
          </h1>
          <p className="text-gray-600">Roma 2025 • €6,00 per persona/notte • Max 10 notti</p>
        </div>

        {!prenotazioni.length && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex">
                  <div className="text-red-600 text-sm">
                    {error}
                  </div>
                </div>
              </div>
            )}
            
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDrop={(e) => {
                e.preventDefault();
                const droppedFile = e.dataTransfer.files[0];
                if (droppedFile) handleFileUpload(droppedFile);
              }}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('fileInput').click()}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                  <span className="text-gray-600">Elaborazione in corso...</span>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800 mb-2">
                    Carica il file delle prenotazioni
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Trascina il file qui o clicca per selezionare
                  </p>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Seleziona File
                  </button>
                </>
              )}
            </div>
            <input
              id="fileInput"
              type="file"
              accept=".pdf,.xlsx,.xls,.csv"
              onChange={(e) => {
                const selectedFile = e.target.files[0];
                if (selectedFile) handleFileUpload(selectedFile);
              }}
              className="hidden"
            />
          </div>
        )}

        {/* Geographic Analysis */}
        {results && Object.keys(ospitesByCountry).length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="h-5 w-5 text-blue-600" />
                <h3 className="text-lg font-medium text-gray-800">Mappa Mondiale Ospiti</h3>
              </div>
              <WorldMap countries={ospitesByCountry} />
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Top 5 Paesi</h3>
              <div className="space-y-3">
                {results.topCountries.map(([code, stats], index) => (
                  <div key={code} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{stats.nome}</div>
                        <div className="text-sm text-gray-500">{stats.ospiti} ospiti</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{stats.count} prenotazioni</div>
                      <div className="text-sm text-green-600">€{stats.incassi.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        {results && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-green-600">€{results.totaleIncassi.toFixed(2)}</div>
              <div className="text-sm text-gray-600">Totale Tassa Soggiorno</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{results.prenotazioniTassabili}</div>
              <div className="text-sm text-gray-600">Prenotazioni Tassabili</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-red-600">{results.prenotazioneCancellate}</div>
              <div className="text-sm text-gray-600">Cancellazioni</div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <div className="text-2xl font-bold text-gray-600">{results.totaleTotale}</div>
              <div className="text-sm text-gray-600">Totale Prenotazioni</div>
            </div>
          </div>
        )}

        {prenotazioni.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-medium text-gray-800">Dettaglio Prenotazioni</h2>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={showCancelled}
                    onChange={(e) => setShowCancelled(e.target.checked)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-600">Mostra cancellazioni</span>
                </label>
              </div>
              <button
                onClick={exportResults}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4" />
                Esporta CSV
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ospite</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ospiti</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notti</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tassa</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prenotazioni
                    .filter(p => showCancelled || p.stato === 'OK')
                    .map((prenotazione, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{prenotazione.nome}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(prenotazione.arrivo).toLocaleDateString('it-IT')} - {new Date(prenotazione.partenza).toLocaleDateString('it-IT')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {prenotazione.adultiTassabili} {prenotazione.adultiTassabili === 1 ? 'adulto' : 'adulti'}
                          {prenotazione.bambiniEsenti > 0 && (
                            <div className="text-xs text-green-600">
                              +{prenotazione.bambiniEsenti} {prenotazione.bambiniEsenti === 1 ? 'bambino esente' : 'bambini esenti'} (&lt;10 anni)
                            </div>
                          )}
                          {prenotazione.bambini > prenotazione.bambiniEsenti && (
                            <div className="text-xs text-orange-600">
                              +{prenotazione.bambini - prenotazione.bambiniEsenti} {(prenotazione.bambini - prenotazione.bambiniEsenti) === 1 ? 'bambino tassabile' : 'bambini tassabili'} (≥10 anni)
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {prenotazione.nottiTassabili}
                          {prenotazione.notti > MAX_NOTTI_TASSABILI && (
                            <span className="text-xs text-orange-600"> (max 10)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          prenotazione.stato === 'OK' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {prenotazione.stato}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          €{prenotazione.tassaTotale.toFixed(2)}
                        </div>
                        {prenotazione.tassaTotale > 0 && (
                          <div className="text-xs text-gray-500">
                            {prenotazione.adultiTassabili} × {prenotazione.nottiTassabili} × €6,00
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
            <p className="text-gray-500 text-sm">
              💡 <strong>Consigliato:</strong> File Excel (.xls) da Booking.com - funziona perfettamente!<br/>
              Supporta anche PDF e CSV (in fase di sviluppo)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TassaSoggiornoCalculator;