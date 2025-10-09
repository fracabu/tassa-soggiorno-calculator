# TODO - TourTax App

## 🔴 PRIORITÀ ALTA - Verificare Persistenza Database Railway

**Problema**: Utente registrato su Railway non riconosciuto (401)
**Da fare domani**:
- [ ] Testare login con utente esistente
- [ ] Se 401 persiste, verificare:
  - [ ] Railway database effettivamente persistente
  - [ ] JWT_SECRET coerente tra deploy
  - [ ] Logs Railway per errori database
- [ ] Considerare upgrade Railway plan o switch a PostgreSQL

---

## 🎨 MIGLIORAMENTI UX/UI

### 1. **Specifiche File Upload**
**Priorità**: Alta ⭐⭐⭐

Attualmente dice solo "Excel/CSV da Booking o Airbnb" - troppo generico!

**Migliorare con**:
```
Formati supportati:
✅ CSV Prenotazioni Booking.com
✅ CSV Pending Airbnb
✅ PDF Report Booking.com
✅ Excel personalizzato (.xlsx/.xls)

Dove trovare i file:
• Booking.com: Extranet → Prenotazioni → Esporta CSV
• Airbnb: Dashboard Host → Prenotazioni → Scarica CSV pending
```

**File da modificare**:
- `src/components/FileUpload.js` - aggiungere tooltip/dropdown con info
- Aggiungere icone per ogni tipo di file
- Mostrare esempi screenshot nella guida

---

### 2. **Validazione File più chiara**
**Priorità**: Media ⭐⭐

**Problema attuale**: Se il file non ha le colonne giuste, errore generico

**Migliorare con**:
- [ ] Mostrare preview prime righe file caricato
- [ ] Suggerire mapping colonne se non riconosciute
- [ ] Messaggio errore specifico: "Manca colonna 'Check-in', trovate: [elenco colonne]"
- [ ] Pulsante "Vedi esempio file valido"

---

### 3. **Guida Interattiva File**
**Priorità**: Media ⭐⭐

**Aggiungere**:
- [ ] Video/GIF animata che mostra come esportare da Booking
- [ ] Video/GIF animata che mostra come esportare da Airbnb
- [ ] Template file esempio scaricabile
- [ ] Sezione FAQ "File non riconosciuto? Ecco perché..."

---

### 4. **Supporto PDF Booking.com**
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

---

### 8. **Notifiche/Promemoria**
**Priorità**: Bassa ⭐

- [ ] Reminder automatico scadenze GECOS comunale
- [ ] Email mensile con riassunto calcoli (opzionale)

---

### 9. **Multi-lingua**
**Priorità**: Bassa ⭐

- [ ] Inglese (per strutture turistiche internazionali)
- [ ] Mantenere italiano come default

---

### 10. **Mobile UX**
**Priorità**: Media ⭐⭐

- [ ] Testare upload file da mobile
- [ ] Ottimizzare tabelle per scroll orizzontale mobile
- [ ] Touch-friendly controls

---

## 🐛 BUG DA FIXARE

- [ ] **Scrollbar orizzontale** - verificare se sparita con ultime modifiche
- [ ] **Badge numeri card** - verificare che stiano dentro card
- [ ] **Dark mode persistenza** - testare su più browser

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

---

## 📊 PRIORITÀ RACCOMANDATA (Domani)

1. ✅ **Verificare database Railway** (critico)
2. ⭐⭐⭐ **Migliorare specifiche file upload**
3. ⭐⭐⭐ **Supporto PDF Booking.com**
4. ⭐⭐ **Validazione file più chiara**
5. ⭐⭐ **Guida interattiva file**

---

# TODO - Fix Database Persistenza

## 🔴 PROBLEMA ATTUALE
Il database SQLite su Render Free Tier viene cancellato ad ogni restart del servizio.
- ✅ Registrazione funziona
- ❌ Al riavvio (dopo 15 min sleep) gli utenti vengono persi
- ❌ Login fallisce perché il database è vuoto

---

## 🎯 SOLUZIONI POSSIBILI

### OPZIONE 1: Railway (CONSIGLIATA - Zero modifiche)
**Costo**: Gratis (con $5 crediti mensili)
**Effort**: ⭐ Basso
**Modifiche codice**: Nessuna

**Steps**:
1. [ ] Vai su [railway.app](https://railway.app)
2. [ ] "New Project" → "Deploy from GitHub repo"
3. [ ] Seleziona repository
4. [ ] Settings → Root Directory: `server`
5. [ ] Settings → Start Command: `npm start`
6. [ ] Variables → Aggiungi:
   - `JWT_SECRET`
   - `ADMIN_EMAILS`
   - `NODE_ENV=production`
   - `FRONTEND_URL` (URL Vercel)
7. [ ] Copia URL generato da Railway
8. [ ] Aggiorna `REACT_APP_API_URL` su Vercel con nuovo URL Railway

**Pro**:
- ✅ Zero modifiche al codice
- ✅ Filesystem persistente (SQLite funziona)
- ✅ Gratuito
- ✅ Auto-deploy da GitHub

**Contro**:
- ❌ $5 crediti/mese (dovrebbe bastare)

---

### OPZIONE 2: Render Starter ($7/mese)
**Costo**: $7/mese
**Effort**: ⭐ Basso
**Modifiche codice**: Nessuna

**Steps**:
1. [ ] Vai su dashboard Render
2. [ ] Upgrade servizio a "Starter Plan" ($7/mese)
3. [ ] Fatto! Il filesystem diventa persistente

**Pro**:
- ✅ Zero modifiche al codice
- ✅ Sempre attivo (no sleep)
- ✅ 512 MB RAM

**Contro**:
- ❌ Costa $7/mese

---

### OPZIONE 3: Turso SQLite Cloud (Gratis - Modifiche minime)
**Costo**: Gratis
**Effort**: ⭐⭐ Medio
**Modifiche codice**: Minime (~10 righe)

**Steps**:
1. [ ] Installa Turso: `npm install -g @turso/cli`
2. [ ] Login: `turso auth signup`
3. [ ] Crea DB: `turso db create tassa-soggiorno`
4. [ ] Ottieni URL: `turso db show tassa-soggiorno --url`
5. [ ] Crea token: `turso db tokens create tassa-soggiorno`
6. [ ] Installa SDK: `cd server && npm install @libsql/client`
7. [ ] Modifica `server.js` per usare Turso invece di SQLite locale
8. [ ] Aggiungi variabili su Render:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`

**Pro**:
- ✅ Gratuito
- ✅ SQLite cloud (stesso DB)
- ✅ Veloce

**Contro**:
- ❌ Richiede modifiche al codice

---

### OPZIONE 4: PostgreSQL Render (Gratis - Refactor DB)
**Costo**: Gratis
**Effort**: ⭐⭐⭐ Alto
**Modifiche codice**: Medie (refactor completo DB layer)

**Steps**:
1. [ ] Crea PostgreSQL database su Render
2. [ ] Installa `pg`: `cd server && npm install pg`
3. [ ] Crea `database.js` adapter per PostgreSQL/SQLite
4. [ ] Refactor `server.js` per usare il nuovo adapter
5. [ ] Converti query SQLite → PostgreSQL
6. [ ] Test completo
7. [ ] Deploy

**Pro**:
- ✅ Gratuito
- ✅ Database "serio" (scalabile)
- ✅ Standard industry

**Contro**:
- ❌ Richiede refactor significativo
- ❌ Rischio di bug

---

## 🏆 RACCOMANDAZIONE

**Vai con Railway (Opzione 1)** → Zero modifiche, zero costi, funziona subito.

Se preferisci tenere Render:
- Budget disponibile → Opzione 2 (Render $7/mese)
- Budget zero → Opzione 4 (PostgreSQL gratis ma più lavoro)
