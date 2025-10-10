# TODO - Taxly App

## ✅ COMPLETATI OGGI (10 Ottobre 2025)

### Backend & Database
- ✅ **Migrazione PostgreSQL Railway** - Database persistente funzionante
- ✅ **Database adapter** - Supporto SQLite (dev) + PostgreSQL (prod)
- ✅ **Fix admin endpoints** - Convertiti tutti da callback a async/await
- ✅ **Fix admin page 500 error** - Risolto problema con db.all()
- ✅ **Rimozione campi inutili** - Rimossi azienda/telefono da DB e form
- ✅ **Pulizia admin panel** - Rimossa card "Calcoli Totali" (non attiva)
- ✅ **Rimozione debug logs** - Rimossi console.log dalle API

### Brand & Design
- ✅ **Rebrand Taxly** - Cambio nome da TourTax a Taxly
- ✅ **Nuovo logo minimale** - Edificio allargato, no cerchio, 5x5 finestre
- ✅ **Font Poppins** - Sostituito Inter con Poppins (più moderno)
- ✅ **Badge € ottimizzato** - Posizionato in alto a destra

---

## 🔴 PRIORITÀ ALTA

### 1. **Specifiche File Upload**
**Priorità**: Alta ⭐⭐⭐

Attualmente dice solo "Excel/CSV da Booking o Airbnb" - troppo generico!

**Migliorare con**:
```
Formati supportati:
✅ CSV Prenotazioni Booking.com
✅ CSV Pending Airbnb
✅ PDF Report Booking.com (DA IMPLEMENTARE)
✅ Excel personalizzato (.xlsx/.xls)

Dove trovare i file:
• Booking.com: Extranet → Prenotazioni → Esporta CSV
• Airbnb: Dashboard Host → Prenotazioni → Scarica CSV pending
```

**File da modificare**:
- [ ] `src/components/FileUpload.js` - aggiungere tooltip/dropdown con info
- [ ] Aggiungere icone per ogni tipo di file
- [ ] Mostrare esempi screenshot nella guida

---

### 2. **Supporto PDF Booking.com**
**Priorità**: Alta ⭐⭐⭐

**Attualmente**: Solo Excel/CSV
**Richiesto**: Anche PDF di Booking.com

**Da implementare**:
- [ ] Installare `pdf-parse` o `pdfjs-dist`
- [ ] Parser per estrarre testo da PDF Booking
- [ ] Regex per identificare pattern prenotazioni nel PDF
- [ ] Mapping dati PDF → struttura booking interna
- [ ] Test con vari formati PDF Booking

**Libreria consigliata**: `pdf-parse`
```bash
npm install pdf-parse
```

---

### 3. **Validazione File più chiara**
**Priorità**: Media ⭐⭐

**Problema attuale**: Se il file non ha le colonne giuste, errore generico

**Migliorare con**:
- [ ] Mostrare preview prime righe file caricato
- [ ] Suggerire mapping colonne se non riconosciute
- [ ] Messaggio errore specifico: "Manca colonna 'Check-in', trovate: [elenco colonne]"
- [ ] Pulsante "Vedi esempio file valido"

---

## 🎨 MIGLIORAMENTI UX/UI

### 4. **Visual Design & Immagini**
**Priorità**: Alta ⭐⭐⭐

**Rendere l'esperienza utente più "fica" con elementi visual**

**Hero Section**:
- [ ] Background image professionale (hotel/resort/turismo)
- [ ] Gradient overlay per leggibilità testo
- [ ] Animazioni subtle (parallax, fade-in)
- [ ] Illustrazioni SVG custom (edifici, mappe Italia)

**Sezioni Landing Page**:
- [ ] Immagini per "Come Funziona" (screenshots app in uso)
- [ ] Icone custom invece di Heroicons (più personalizzate)
- [ ] Screenshot app nella sezione features
- [ ] Testimonianze con foto utenti (mockup)

**Immagini Consigliate**:
- Hero: Vista aerea resort italiano al tramonto
- Features: Dashboard screenshot con blur effect
- Testimonials: Foto stock manager hotel italiani
- Footer: Pattern geometrico sottile

**Risorse**:
- Unsplash API per immagini gratis
- Illustrazioni: undraw.co, storyset.com
- Pattern: heropatterns.com

---

### 5. **Guida Interattiva File**
**Priorità**: Media ⭐⭐

**Aggiungere**:
- [ ] Video/GIF animata che mostra come esportare da Booking
- [ ] Video/GIF animata che mostra come esportare da Airbnb
- [ ] Template file esempio scaricabile
- [ ] Sezione FAQ "File non riconosciuto? Ecco perché..."

---

### 5. **Miglioramenti Tabella Risultati**
**Priorità**: Bassa ⭐

- [ ] Export Excel (non solo CSV/PDF)
- [ ] Filtri avanzati (per paese, per periodo, per importo)
- [ ] Ordinamento colonne
- [ ] Evidenziare righe con esenzioni manuali

---

### 6. **Dashboard Analytics**
**Priorità**: Bassa ⭐

- [ ] Grafico trend prenotazioni per mese
- [ ] Top 5 paesi ospiti
- [ ] Confronto anno precedente (se disponibile)
- [ ] Statistiche occupazione media

---

### 7. **Salvataggio Calcoli (Backend)**
**Priorità**: Media ⭐⭐

**Già presente endpoint** (`POST /api/calculations`) ma non usato!

**Da fare**:
- [ ] Aggiungere pulsante "Salva Calcolo" nell'app
- [ ] Mostrare storico calcoli salvati
- [ ] Permettere riapertura calcolo salvato
- [ ] Export tutti i calcoli del mese
- [ ] Riattivare card "Calcoli Totali" in admin panel

---

### 8. **Mobile UX**
**Priorità**: Media ⭐⭐

- [ ] Testare upload file da mobile
- [ ] Ottimizzare tabelle per scroll orizzontale mobile
- [ ] Touch-friendly controls

---

### 9. **Notifiche/Promemoria**
**Priorità**: Bassa ⭐

- [ ] Reminder automatico scadenze GECOS comunale
- [ ] Email mensile con riassunto calcoli (opzionale)

---

### 10. **Multi-lingua**
**Priorità**: Bassa ⭐

- [ ] Inglese (per strutture turistiche internazionali)
- [ ] Mantenere italiano come default

---

## 🐛 BUG DA VERIFICARE

- [ ] **Scrollbar orizzontale** - verificare se sparita con ultime modifiche
- [ ] **Dark mode persistenza** - testare su più browser
- [ ] **Upload file mobile** - testare su iOS/Android

---

## 🔧 REFACTORING TECNICO

### Code Quality
- [ ] Aggiungere PropTypes o TypeScript
- [ ] Separare meglio business logic da UI
- [ ] Test unitari per `useBookingProcessor.js`
- [ ] E2E test con Playwright/Cypress

### Performance
- [ ] Code splitting React.lazy()
- [ ] Ottimizzare bundle size (tree shaking)
- [ ] Service Worker per offline support
- [ ] Lazy load delle immagini

---

## 📊 PRIORITÀ RACCOMANDATA (Prossimi passi)

1. ⭐⭐⭐ **Visual Design & Immagini** (impatto WOW immediato!)
2. ⭐⭐⭐ **Supporto PDF Booking.com** (richiesto spesso)
3. ⭐⭐⭐ **Migliorare specifiche file upload** (UX critica)
4. ⭐⭐ **Validazione file più chiara** (riduce errori utente)
5. ⭐⭐ **Salvataggio calcoli** (feature già pronta backend)
6. ⭐⭐ **Mobile UX testing** (molti utenti da mobile)

---

## 🚀 DEPLOYMENT

### Produzione Attuale
- **Frontend**: Vercel (https://tassa-soggiorno-calculator.vercel.app)
- **Backend**: Railway (PostgreSQL persistente)
- **Database**: PostgreSQL Railway (Free tier)

### Note
- ✅ Render cancellato (obsoleto)
- ✅ Railway con PostgreSQL funzionante
- ✅ Auto-deploy da GitHub su push
- ✅ Environment variables configurate
