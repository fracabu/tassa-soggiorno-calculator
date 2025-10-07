# 🚀 AVVIO RAPIDO - Tassa Soggiorno Calculator

## ⚡ Setup Veloce (5 minuti)

### 📧 Step 1: Configura Email Gmail

1. **Vai su**: https://myaccount.google.com/apppasswords
   - Se richiesto, abilita prima la "Verifica in due passaggi"

2. **Genera App Password**:
   - App: Mail
   - Dispositivo: Altro (nome: "Tassa Soggiorno")
   - Copia la password di 16 caratteri

3. **Apri** `server/.env` e sostituisci:
   ```env
   EMAIL_USER=TUA-EMAIL@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # La password app generata
   ```

### 🔧 Step 2: Installa Dipendenze

**Opzione A - Se hai già node_modules:**
```bash
cd server
npm install
```

**Opzione B - Prima installazione completa:**
```bash
# Backend
cd server
npm install

# Frontend (torna alla root)
cd ..
npm install
```

### 🚀 Step 3: Avvia l'Applicazione

**Serve 2 terminali separati:**

#### Terminale 1 - Backend
```bash
cd server
npm run dev
```

**Output atteso:**
```
🚀 Server avviato su http://localhost:3001
📊 Environment: development
✅ Database SQLite connesso
✅ Tabella users pronta
✅ Tabella calculations pronta
```

#### Terminale 2 - Frontend
```bash
npm start
```

L'app si aprirà automaticamente su **http://localhost:3000**

---

## 🧪 Step 4: Test del Sistema

### Test 1: Registrazione
1. Apri http://localhost:3000
2. Clicca **"Registrati"** (o vai direttamente su /register)
3. Compila il form:
   - Nome: Mario
   - Cognome: Rossi
   - Email: tua-email@gmail.com
   - Password: password123 (minimo 8 caratteri)
   - Azienda: Hotel Roma (opzionale)
4. Clicca **"Registrati"**

**Risultato atteso:**
- ✅ Redirect automatico a `/app`
- ✅ Email di benvenuto ricevuta nella tua casella
- ✅ Accesso all'applicazione

### Test 2: Login
1. Fai logout (pulsante in alto a destra)
2. Vai su http://localhost:3000/login
3. Inserisci email e password
4. Clicca **"Accedi"**

**Risultato atteso:**
- ✅ Accesso effettuato
- ✅ Redirect a `/app`

### Test 3: Password Dimenticata
1. Su http://localhost:3000/login
2. Clicca **"Password dimenticata?"**
3. Inserisci la tua email
4. Controlla l'email ricevuta
5. Clicca sul link nel messaggio
6. Imposta nuova password

**Risultato atteso:**
- ✅ Email con link reset ricevuta
- ✅ Nuova password impostata
- ✅ Login con nuova password funzionante

### Test 4: Funzionalità Calcolo Tassa
1. Dopo il login, vai su `/app`
2. **Step 1**: Seleziona comune (es. Roma)
3. **Step 2**: Carica file Excel/CSV di test
4. **Step 3**: Visualizza risultati e scarica PDF/CSV

---

## 🐛 Troubleshooting Rapido

### ❌ Errore: "Email non inviata"

**Causa**: Email non configurata correttamente

**Soluzione**:
1. Verifica `server/.env`:
   - `EMAIL_USER` = tua email Gmail completa
   - `EMAIL_PASSWORD` = app password Gmail (16 caratteri, NO la tua password normale)
2. Riavvia il backend

### ❌ Errore: "CORS Policy"

**Soluzione**: Assicurati che in `server/.env`:
```env
FRONTEND_URL=http://localhost:3000
```

### ❌ Errore: "Cannot connect to server"

**Soluzione**:
1. Verifica che il backend sia avviato su porta 3001
2. Controlla `.env.local` nella root:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   ```

### ❌ Errore: "Port 3000/3001 already in use"

**Soluzione**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <numero> /F

# Alternative: cambia porta in .env
PORT=3002
```

---

## 📊 Verifica Database

Per vedere i dati salvati:

```bash
cd server
sqlite3 database.sqlite

# Comandi SQLite
.tables                    # Mostra tabelle
SELECT * FROM users;       # Mostra utenti registrati
SELECT * FROM calculations; # Mostra calcoli salvati
.quit                      # Esci
```

**Tool grafico** (consigliato): [DB Browser for SQLite](https://sqlitebrowser.org/)

---

## 📁 Struttura File Importante

```
/
├── server/
│   ├── .env              ← CONFIGURA QUI EMAIL!
│   ├── server.js         ← Backend principale
│   ├── config/email.js   ← Template email
│   └── database.sqlite   ← Database (auto-generato)
│
├── src/
│   ├── services/api.js   ← API calls al backend
│   ├── components/
│   │   ├── LoginPage.js
│   │   ├── ResetPassword.js
│   │   └── PrivateRoute.js
│   └── App.js            ← Router principale
│
├── .env.local            ← Config frontend (già ok)
└── START_HERE.md         ← QUESTO FILE
```

---

## ✅ Checklist Setup Completo

- [ ] Configurato `server/.env` con email Gmail
- [ ] Installato dipendenze backend (`cd server && npm install`)
- [ ] Installato dipendenze frontend (`npm install`)
- [ ] Avviato backend (porta 3001)
- [ ] Avviato frontend (porta 3000)
- [ ] Testato registrazione → email ricevuta
- [ ] Testato login → accesso ok
- [ ] Testato reset password → funziona
- [ ] Testato calcolo tassa → risultati ok

---

## 🎉 Pronto per l'Uso!

Ora hai un **servizio SaaS completo** con:
- ✅ Autenticazione JWT sicura
- ✅ Email automatiche professionali
- ✅ Database utenti e calcoli
- ✅ Password recovery
- ✅ Calcolatore tassa di soggiorno

---

## 📚 Documentazione Aggiuntiva

- **Setup Dettagliato**: `GUIDA_SETUP_SAAS.md`
- **Analisi Completa**: `ANALISI_COMPLETA.md`
- **API Endpoints**: Vedi `GUIDA_SETUP_SAAS.md` - sezione "API Endpoints"

---

## 💡 Prossimi Passi (Opzionali)

1. **Salvataggio Automatico Calcoli**
   - Ogni calcolo viene salvato nel DB automaticamente
   - Visualizza storico in nuova sezione

2. **Deploy in Produzione**
   - Backend: Heroku/Railway/VPS
   - Frontend: Netlify/Vercel
   - Vedi `GUIDA_SETUP_SAAS.md` - sezione "Deploy"

3. **Personalizzazioni**
   - Modifica colori in `tailwind.config.js`
   - Personalizza email in `server/config/email.js`
   - Aggiungi comuni in `src/data/comuniItaliani.js`

---

## 🆘 Bisogno di Aiuto?

1. **Controlla i log del backend** - mostrano errori dettagliati
2. **Apri console browser** (F12) - per errori frontend
3. **Verifica database** con SQLite Browser
4. **Leggi documentazione** completa in `GUIDA_SETUP_SAAS.md`

**Buon lavoro! 🚀**
