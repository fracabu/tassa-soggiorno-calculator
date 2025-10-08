# 🚀 Guida Deploy Backend su Render.com

## 📋 Prerequisiti

- Account Render.com (gratuito): https://render.com
- Repository GitHub con il codice
- Frontend già deployato su Vercel (es: `https://tuo-app.vercel.app`)

---

## 🔧 Metodo 1: Deploy Manuale (Raccomandato per la prima volta)

### Step 1: Crea il Web Service

1. Vai su https://dashboard.render.com
2. Click su **"New +"** → **"Web Service"**
3. Connetti il tuo repository GitHub
4. Configura:

```
Name: tassa-soggiorno-api
Region: Frankfurt (più vicino all'Italia)
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
Instance Type: Free
```

### Step 2: Configura le Environment Variables

Nella sezione **"Environment"**, aggiungi queste variabili:

#### ⚠️ OBBLIGATORIE

```bash
NODE_ENV=production

# JWT Secret - GENERA UNO NUOVO!
# Comando: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=<tua-stringa-casuale-di-64-caratteri>

# Email admin (sostituisci con la tua)
ADMIN_EMAILS=tua-email@example.com

# URL frontend Vercel (IMPORTANTE!)
FRONTEND_URL=https://tuo-app.vercel.app
```

#### 📧 OPZIONALI (Email)

Se vuoi abilitare email di benvenuto/reset password:

```bash
EMAIL_SERVICE=gmail
EMAIL_USER=tua-email@gmail.com
EMAIL_PASSWORD=tua-app-password-gmail
EMAIL_FROM=noreply@tassasoggiorno.it
```

**Per Gmail App Password:**
1. Abilita 2FA su Google Account
2. Vai su https://myaccount.google.com/apppasswords
3. Crea una "App Password" per "Mail"
4. Usa quella password (NON la tua password Gmail normale)

### Step 3: Deploy!

1. Click su **"Create Web Service"**
2. Render inizierà il build (ci vogliono ~2-3 minuti)
3. Una volta completato, vedrai: ✅ **"Live"**
4. L'URL sarà tipo: `https://tassa-soggiorno-api.onrender.com`

---

## 🔗 Step 4: Collega Frontend Vercel

### Aggiorna variabile d'ambiente su Vercel

1. Vai su https://vercel.com/dashboard
2. Apri il tuo progetto frontend
3. Vai in **Settings** → **Environment Variables**
4. Aggiorna o aggiungi:

```
REACT_APP_API_URL=https://tassa-soggiorno-api.onrender.com/api
```

5. Vai in **Deployments** → Click sui tre puntini dell'ultimo deploy → **"Redeploy"**
6. Seleziona **"Use existing Build Cache"** e deploy

---

## ✅ Step 5: Verifica Funzionamento

### Test Backend

```bash
# Health check
curl https://tassa-soggiorno-api.onrender.com/api/health

# Risposta attesa:
{"status":"OK","message":"Server attivo"}
```

### Test Frontend

1. Apri il tuo frontend Vercel
2. Prova a registrare un nuovo utente
3. Verifica login funzionante
4. Carica un file Excel di test

---

## 🔧 Metodo 2: Deploy con Blueprint (Automatico)

### Usa il file render.yaml

1. Il file `render.yaml` è già configurato nella root
2. Su Render, vai su **"New +"** → **"Blueprint"**
3. Connetti repository e seleziona `render.yaml`
4. Render leggerà la configurazione automaticamente
5. Dovrai comunque configurare manualmente le variabili sensibili

---

## 🐛 Troubleshooting

### Errore: "JWT_SECRET non configurato"

**Causa:** Variabile d'ambiente mancante o troppo corta

**Fix:**
```bash
# Genera un secret sicuro:
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Copia l'output e aggiungilo come JWT_SECRET su Render
```

### Errore CORS: "Access blocked"

**Causa:** FRONTEND_URL non corrisponde all'URL Vercel

**Fix:**
```bash
# Su Render, verifica che FRONTEND_URL sia:
FRONTEND_URL=https://tuo-dominio-esatto.vercel.app

# NOTA: NO trailing slash, HTTPS obbligatorio
```

### Database non si crea

**Causa:** Permessi directory

**Fix:**
- Render crea automaticamente la cartella writable
- Se persiste, controlla logs su Render Dashboard

### Rate Limit troppo aggressivo

**Causa:** IP condiviso su Render Free tier

**Fix:**
```javascript
// server/server.js - Aumenta limite temporaneamente
max: 200  // invece di 100
```

### Backend si addormenta dopo 15 minuti

**Causa:** Piano Free di Render mette in sleep servizi inattivi

**Fix:**
- Upgrade a piano Starter ($7/mese)
- Oppure: Usa servizio come **UptimeRobot** (gratuito) per ping ogni 5 minuti

---

## 📊 Monitoraggio

### Dashboard Render

- **Logs in tempo reale:** Dashboard → Service → Logs
- **Metrics:** CPU, Memory, Request/s
- **Restart service:** Settings → Manual Deploy

### Comandi utili

```bash
# Visualizza logs
# (dalla dashboard Render, sezione "Logs")

# Rebuild manuale
# Dashboard → Manual Deploy → Clear build cache & deploy
```

---

## 🔒 Sicurezza Produzione

### Checklist Pre-Go-Live

- [ ] JWT_SECRET almeno 64 caratteri casuali
- [ ] FRONTEND_URL esatto (no trailing slash)
- [ ] ADMIN_EMAILS configurato
- [ ] CORS limitato solo a frontend Vercel
- [ ] Rate limiting attivo
- [ ] Helmet headers attivi
- [ ] Database backup strategy (Render non fa backup automatici per SQLite)

### Backup Database SQLite

**IMPORTANTE:** Render Free tier NON ha persistenza garantita!

**Soluzione Raccomandata:**
1. Implementa backup periodici su cloud storage (AWS S3, Cloudflare R2)
2. Oppure: Migra a PostgreSQL (Render offre PostgreSQL managed gratis)

```javascript
// Esempio backup automatico giornaliero
const cron = require('node-cron');
const fs = require('fs');
const AWS = require('aws-sdk');

cron.schedule('0 2 * * *', async () => {
  // Backup alle 2 AM ogni giorno
  const dbPath = './database.sqlite';
  const s3 = new AWS.S3();

  const fileContent = fs.readFileSync(dbPath);
  const params = {
    Bucket: 'tuo-bucket',
    Key: `backups/db-${Date.now()}.sqlite`,
    Body: fileContent
  };

  await s3.upload(params).promise();
  console.log('✅ Backup database completato');
});
```

---

## 🚀 Ottimizzazioni Performance

### 1. Usa CDN per Assets Statici

Frontend su Vercel già usa CDN globale Vercel Edge Network.

### 2. Abilita Compression

```javascript
// server/server.js - Aggiungi dopo helmet()
const compression = require('compression');
app.use(compression());
```

### 3. Connection Pooling

```javascript
// Usa better-sqlite3 invece di sqlite3 per performance
const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');
```

---

## 💰 Costi

### Piano Free Render (Attuale)
- ✅ 750 ore/mese compute gratuito
- ✅ Sleep dopo 15 min inattività
- ✅ Risveglio automatico al primo request (~30 sec)
- ❌ No persistenza garantita per SQLite
- ❌ IP condiviso

### Upgrade Consigliato ($7/mese)
- ✅ Sempre attivo (no sleep)
- ✅ Maggiore CPU/RAM
- ✅ IP dedicato
- ✅ Persistenza disco garantita

---

## 📞 Supporto

- **Render Docs:** https://render.com/docs
- **Community Forum:** https://community.render.com
- **Status Page:** https://status.render.com

---

## 🎉 Checklist Finale

Prima di considerare il deploy completo:

- [ ] Backend risponde a `https://tuo-backend.onrender.com/api/health`
- [ ] Frontend Vercel configurato con nuovo REACT_APP_API_URL
- [ ] Registrazione nuovo utente funziona
- [ ] Login funziona
- [ ] Upload file Excel funziona
- [ ] Export CSV/PDF funziona
- [ ] Admin panel accessibile (se sei admin)
- [ ] Nessun errore CORS nei logs
- [ ] JWT_SECRET sicuro configurato
- [ ] Backup strategy implementata (o pianificata)

**Deploy completato! 🎉**
