# 🚀 Guida Setup - Tassa Soggiorno Calculator (Versione SaaS)

## 📋 Panoramica

Questa guida ti aiuterà a configurare l'applicazione come **servizio SaaS completo** con:
- ✅ Backend Node.js con autenticazione JWT
- ✅ Database SQLite per utenti e calcoli
- ✅ Sistema email per benvenuto e reset password
- ✅ Frontend React integrato
- ✅ Sicurezza avanzata (rate limiting, CORS, helmet)

---

## 🛠️ Prerequisiti

- Node.js >= 16.0.0
- npm >= 8.0.0
- Account email (Gmail, SendGrid, Mailgun, o SMTP personalizzato)

---

## 📦 Step 1: Installazione Dipendenze

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
cd ..
npm install
```

---

## ⚙️ Step 2: Configurazione Backend

### 2.1 Crea il file `.env` dal template

```bash
cd server
cp .env.example .env
```

### 2.2 Configura le variabili d'ambiente

Apri `server/.env` e configura:

```env
# ====================  SERVER ====================
PORT=3001
NODE_ENV=development

# ==================== SICUREZZA ====================
# Genera un JWT secret sicuro:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=<GENERA_UNA_STRINGA_CASUALE_LUNGA>

# ==================== FRONTEND ====================
FRONTEND_URL=http://localhost:3000

# ==================== EMAIL (Gmail) ====================
EMAIL_SERVICE=gmail
EMAIL_USER=tuo-email@gmail.com
EMAIL_PASSWORD=<APP_PASSWORD>
EMAIL_FROM=noreply@tassasoggiorno.com
```

### 2.3 Setup Email - Opzione A: Gmail (consigliato per sviluppo)

1. **Abilita verifica in 2 passaggi** nel tuo account Google:
   - Vai su https://myaccount.google.com/security
   - Attiva "Verifica in due passaggi"

2. **Genera App Password**:
   - Vai su https://myaccount.google.com/apppasswords
   - Seleziona "App: Mail" e "Dispositivo: Altro (nome personalizzato)"
   - Inserisci "Tassa Soggiorno App"
   - Copia la password generata (16 caratteri)

3. **Inserisci in `.env`**:
   ```env
   EMAIL_SERVICE=gmail
   EMAIL_USER=tuo-email@gmail.com
   EMAIL_PASSWORD=abcd efgh ijkl mnop  # La password app generata
   ```

### 2.4 Setup Email - Opzione B: SendGrid (consigliato per produzione)

1. **Crea account SendGrid**: https://signup.sendgrid.com
2. **Genera API Key**: Settings → API Keys → Create API Key
3. **Configura `.env`**:
   ```env
   EMAIL_SERVICE=
   SMTP_HOST=smtp.sendgrid.net
   SMTP_PORT=587
   SMTP_USER=apikey
   SMTP_PASSWORD=<TUA_SENDGRID_API_KEY>
   EMAIL_FROM=noreply@tuo-dominio.com
   ```

### 2.5 Setup Email - Opzione C: SMTP Personalizzato

```env
EMAIL_SERVICE=
SMTP_HOST=smtp.tuo-provider.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tuo-username-smtp
SMTP_PASSWORD=tua-password-smtp
EMAIL_FROM=noreply@tuo-dominio.com
```

---

## ⚙️ Step 3: Configurazione Frontend

### 3.1 Crea il file `.env.local`

```bash
cd ..  # Torna nella root del progetto
cp .env.example .env.local
```

### 3.2 Configura l'URL del backend

Apri `.env.local`:

```env
REACT_APP_API_URL=http://localhost:3001/api
```

Per produzione, cambia con l'URL del tuo server:
```env
REACT_APP_API_URL=https://api.tuo-dominio.com/api
```

---

## 🚀 Step 4: Avvio Applicazione

### Opzione A: Sviluppo (2 terminali separati)

**Terminale 1 - Backend:**
```bash
cd server
npm run dev
```

Output atteso:
```
🚀 Server avviato su http://localhost:3001
📊 Environment: development
✅ Database SQLite connesso
✅ Tabella users pronta
✅ Tabella calculations pronta
```

**Terminale 2 - Frontend:**
```bash
npm start
```

L'app si aprirà automaticamente su `http://localhost:3000`

### Opzione B: Sviluppo (1 terminale con concurrently)

Installa concurrently:
```bash
npm install --save-dev concurrently
```

Aggiungi script in `package.json` principale:
```json
"scripts": {
  "start": "react-scripts start",
  "start:backend": "cd server && npm run dev",
  "start:all": "concurrently \"npm run start:backend\" \"npm start\"",
  "build": "react-scripts build",
  "test": "react-scripts test"
}
```

Poi avvia tutto:
```bash
npm run start:all
```

---

## 🧪 Step 5: Test del Sistema

### 5.1 Test Backend API

```bash
# Health check
curl http://localhost:3001/api/health

# Test registrazione
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "nome": "Mario",
    "cognome": "Rossi"
  }'
```

### 5.2 Test Frontend

1. Apri `http://localhost:3000`
2. Clicca "Registrati"
3. Compila il form con i tuoi dati
4. Dovresti ricevere:
   - ✅ Email di benvenuto
   - ✅ Redirect automatico a `/app`
   - ✅ Accesso all'applicazione

### 5.3 Test Reset Password

1. Vai su `http://localhost:3000/login`
2. Clicca "Password dimenticata?"
3. Inserisci la tua email
4. Controlla l'email ricevuta
5. Clicca sul link per reset password
6. Imposta nuova password

---

## 📊 Step 6: Verifica Database

Il database SQLite viene creato automaticamente in `server/database.sqlite`.

Per visualizzare i dati:

```bash
cd server
sqlite3 database.sqlite

# Comandi SQLite
.tables                          # Mostra tabelle
SELECT * FROM users;             # Mostra utenti
SELECT * FROM calculations;      # Mostra calcoli salvati
SELECT * FROM login_history;     # Mostra storico login
.quit                            # Esci
```

O usa un tool grafico come [DB Browser for SQLite](https://sqlitebrowser.org/).

---

## 🔐 Sicurezza - Checklist

### Prima di andare in produzione:

- [ ] **JWT_SECRET**: Generato con `crypto.randomBytes(64).toString('hex')`
- [ ] **CORS**: Configurato solo per il dominio frontend
- [ ] **Email**: Usa SendGrid/Mailgun in produzione (non Gmail)
- [ ] **HTTPS**: Backend e frontend su HTTPS
- [ ] **Environment**: `NODE_ENV=production`
- [ ] **Database**: Backup automatici configurati
- [ ] **Rate Limiting**: Verificato funzionante
- [ ] **Password Policy**: Minimo 8 caratteri (già implementato)

---

## 🚢 Step 7: Deploy Produzione

### Backend - Opzione A: Heroku

```bash
cd server

# Crea Procfile
echo "web: node server.js" > Procfile

# Deploy
heroku create tassa-soggiorno-api
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=<tuo-secret>
heroku config:set EMAIL_SERVICE=...
# ... altre variabili
git add .
git commit -m "Deploy backend"
git push heroku main
```

### Backend - Opzione B: VPS (Ubuntu/Debian)

```bash
# Sul server
sudo npm install -g pm2

# Copia file
scp -r server user@tuo-server:/var/www/tassa-backend

# Sul server
cd /var/www/tassa-backend
npm install --production
pm2 start server.js --name tassa-backend
pm2 save
pm2 startup
```

### Frontend - Netlify/Vercel

```bash
# Build produzione
npm run build

# Deploy Netlify
npm install -g netlify-cli
netlify deploy --prod

# O deploy Vercel
npm install -g vercel
vercel --prod
```

**Importante**: Configura le variabili d'ambiente nel pannello di Netlify/Vercel:
- `REACT_APP_API_URL=https://api.tuo-dominio.com/api`

---

## 📧 Template Email Personalizzati

I template email si trovano in `server/config/email.js`.

### Personalizzare colori e testo:

```javascript
// Cambia il gradiente header
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
// Diventa
background: linear-gradient(135deg, #TUO_COLORE1 0%, #TUO_COLORE2 100%);

// Cambia il testo di benvenuto
<p>Grazie per esserti registrato al nostro servizio...</p>
// Diventa
<p>Il tuo messaggio personalizzato...</p>
```

---

## 🐛 Troubleshooting

### Problema: Email non inviate

**Causa**: Configurazione email errata

**Soluzione**:
```bash
# Test manuale email
cd server
node -e "
const { sendWelcomeEmail } = require('./config/email');
sendWelcomeEmail('test@example.com', 'Mario', 'http://localhost:3000/app')
  .then(() => console.log('Email inviata!'))
  .catch(err => console.error('Errore:', err));
"
```

### Problema: CORS Error nel browser

**Causa**: FRONTEND_URL non configurato correttamente

**Soluzione**: In `server/.env`:
```env
FRONTEND_URL=http://localhost:3000
```

In produzione:
```env
FRONTEND_URL=https://tuo-dominio.com
```

### Problema: JWT Token Invalid

**Causa**: Token scaduto o secret cambiato

**Soluzione**:
```javascript
// Nel browser console
localStorage.clear();
// Poi ri-effettua il login
```

### Problema: Database locked

**Causa**: SQLite non supporta accessi concorrenti

**Soluzione**: Per produzione ad alto traffico, migra a PostgreSQL:
```bash
npm install pg
# Modifica server.js per usare PostgreSQL invece di SQLite
```

---

## 📚 API Endpoints Disponibili

### Pubblici (no auth)
- `GET /api/health` - Health check
- `POST /api/register` - Registrazione utente
- `POST /api/login` - Login
- `POST /api/forgot-password` - Richiesta reset password
- `POST /api/reset-password` - Conferma reset password

### Protetti (richiede JWT token)
- `GET /api/profile` - Profilo utente corrente
- `POST /api/calculations` - Salva nuovo calcolo
- `GET /api/calculations` - Lista calcoli utente
- `GET /api/calculations/:id` - Dettaglio singolo calcolo
- `GET /api/admin/stats` - Statistiche admin

### Formato chiamata protetta:
```javascript
fetch('http://localhost:3001/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## 🎓 Prossimi Step Consigliati

1. **Implementa salvataggio automatico calcoli**
   - Ogni volta che l'utente processa un file, salvalo nel DB
   - Usa `saveCalculation()` da `src/services/api.js`

2. **Aggiungi dashboard storico**
   - Nuova route `/storico`
   - Mostra lista calcoli precedenti
   - Permetti ri-apertura e export

3. **Implementa piani/subscription**
   - Free: 10 calcoli/mese
   - Pro: Illimitati
   - Integra Stripe per pagamenti

4. **Analytics**
   - Traccia uso app con Google Analytics
   - Monitora errori con Sentry

5. **Testing**
   - Unit tests per API backend
   - Integration tests per flow utente
   - E2E tests con Cypress

---

## 📞 Supporto

Per problemi o domande:
1. Verifica i log: `cd server && npm run dev` (modalità verbose)
2. Controlla il database: `sqlite3 server/database.sqlite`
3. Testa API manualmente con curl o Postman
4. Apri issue su GitHub (se repository pubblico)

---

## 🎉 Congratulazioni!

Il tuo servizio SaaS è ora operativo! 🚀

**Checklist finale**:
- ✅ Backend avviato e funzionante
- ✅ Frontend connesso al backend
- ✅ Email di benvenuto ricevute
- ✅ Reset password funzionante
- ✅ Login/Logout funzionanti
- ✅ Calcoli tassa di soggiorno operativi

**Prossimo obiettivo**: Portare in produzione! 🌐
