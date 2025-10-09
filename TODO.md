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
