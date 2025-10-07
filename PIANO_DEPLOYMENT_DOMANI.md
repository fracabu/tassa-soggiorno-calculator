# 📋 Piano Deployment Completo - Domani

> **Obiettivo**: Collegare frontend Vercel con nuovo backend e rendere l'app completamente funzionante in produzione

---

## ✅ Stato Attuale

- [x] Frontend deployato su Vercel
- [x] Backend pronto in locale (cartella `server/`)
- [x] Codice pushato su GitHub
- [x] Database SQLite funzionante in locale
- [x] Admin panel testato in locale
- [ ] Backend deployato in produzione
- [ ] Frontend collegato al backend
- [ ] App funzionante online

---

## 🎯 FASE 1: Deploy Backend su Render.com (30 min)

### Step 1.1: Registrazione Render
1. Vai su [render.com](https://render.com)
2. Clicca "Get Started for Free"
3. Registrati con GitHub (consigliato) o email
4. Conferma l'email

### Step 1.2: Crea Web Service
1. Dalla dashboard: **"New +"** → **"Web Service"**
2. Connetti il repository GitHub: `fracabu/tassa-soggiorno-calculator`
3. Autorizza Render ad accedere al repository

### Step 1.3: Configurazione Servizio
Compila il form con questi dati:

```
Name: tassa-soggiorno-backend
Region: Frankfurt (EU Central)
Branch: main
Root Directory: server
Runtime: Node
Build Command: npm install
Start Command: npm start
```

### Step 1.4: Scegli il Piano
- Seleziona: **"Free"** (0$/mese)
- ⚠️ Nota: il free tier ha cold start dopo 15min di inattività

### Step 1.5: Aggiungi Environment Variables
Clicca "Add Environment Variable" per ciascuna:

```env
JWT_SECRET = <copia-output-comando-sotto>
ADMIN_EMAILS = fracabu@gmail.com,admin@tassasoggiorno.it
NODE_ENV = production
PORT = 3001
```

**Genera JWT_SECRET sicuro:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copia l'output e usalo come valore per `JWT_SECRET`

### Step 1.6: Deploy!
1. Clicca **"Create Web Service"**
2. Aspetta 3-5 minuti per il build
3. ✅ Quando vedi "Live", copia l'URL (es: `https://tassa-soggiorno-backend.onrender.com`)

### Step 1.7: Test Backend
```bash
# Testa che il backend risponda
curl https://tuo-backend.onrender.com/health

# Dovresti vedere: {"status":"ok"}
```

---

## 🎯 FASE 2: Collega Frontend al Backend (10 min)

### Step 2.1: Aggiungi URL Backend a Vercel
1. Vai su [vercel.com](https://vercel.com/dashboard)
2. Apri il progetto `tassa-soggiorno-calculator`
3. Vai in **Settings** → **Environment Variables**
4. Aggiungi nuova variabile:
   ```
   Name: REACT_APP_API_URL
   Value: https://tassa-soggiorno-backend.onrender.com
   ```
5. Seleziona tutti gli ambienti: **Production**, **Preview**, **Development**
6. Clicca **"Save"**

### Step 2.2: Redeploy Frontend
1. Vai in **Deployments**
2. Trova l'ultimo deployment
3. Clicca i tre puntini ⋯ → **"Redeploy"**
4. Conferma "Redeploy"
5. Aspetta 1-2 minuti

---

## 🎯 FASE 3: Aggiorna CORS sul Backend (5 min)

### Step 3.1: Aggiungi URL Frontend al Backend
1. Torna su Render.com
2. Vai nel tuo Web Service
3. **Environment** → **Add Environment Variable**:
   ```
   Name: FRONTEND_URL
   Value: https://tuo-frontend.vercel.app
   ```
4. Clicca **"Save Changes"**
5. Il servizio si riavvierà automaticamente (1-2 min)

---

## 🎯 FASE 4: Test Completo App Online (10 min)

### Checklist Test:

#### 4.1 Test Registrazione
1. Vai su `https://tuo-frontend.vercel.app`
2. Compila form registrazione:
   - Nome: Mario
   - Cognome: Rossi
   - Email: test@test.it
   - Password: Test1234!
3. ✅ Verifica messaggio di successo
4. ✅ Verifica redirect a login

#### 4.2 Test Login
1. Inserisci credenziali appena create
2. ✅ Verifica redirect alla dashboard
3. ✅ Verifica che vedi header con nome utente

#### 4.3 Test Calcolatore
1. Seleziona un comune (es: Roma)
2. Carica file Excel di test
3. ✅ Verifica che calcoli funzionino
4. ✅ Verifica export CSV

#### 4.4 Test Admin Panel
1. Logout
2. Login con: `fracabu@gmail.com` (deve essere in ADMIN_EMAILS)
3. ✅ Verifica che appare bottone "Admin" in header
4. Clicca "Admin"
5. ✅ Verifica lista utenti
6. ✅ Testa modifica utente
7. ✅ Testa eliminazione utente di test

---

## 🚨 Troubleshooting

### Problema: "Failed to fetch" o CORS error
**Soluzione:**
1. Controlla che `FRONTEND_URL` su Render sia corretto
2. Controlla che `REACT_APP_API_URL` su Vercel sia corretto
3. Redeploy entrambi i servizi

### Problema: Admin panel dà "Accesso negato"
**Soluzione:**
1. Verifica che `ADMIN_EMAILS` su Render contenga la tua email
2. Verifica che stai loggato con quella email
3. Controlla log su Render: Dashboard → Logs

### Problema: Backend in "cold start" (lento)
**Soluzione:**
- È normale per il free tier
- Primo caricamento: ~30 secondi
- Opzione: upgrade a piano paid ($7/mese) per evitare sleep

### Problema: Database vuoto dopo redeploy
**Soluzione:**
- Render ricrea il container ad ogni deploy
- Per persistere dati: usa Render Disks (paid) o PostgreSQL esterno
- Alternativa free: Railway con volume persistente

---

## 📊 Riepilogo Finale

Dopo aver completato tutte le fasi:

✅ **Frontend (Vercel)**
- URL: https://tuo-frontend.vercel.app
- Env: `REACT_APP_API_URL` configurato

✅ **Backend (Render)**
- URL: https://tassa-soggiorno-backend.onrender.com
- Env: `JWT_SECRET`, `ADMIN_EMAILS`, `FRONTEND_URL` configurati

✅ **Funzionalità Attive**
- Registrazione utenti
- Login/Logout
- Calcolatore tassa soggiorno
- Admin panel (per email autorizzate)
- Privacy Policy / Terms / Cookie Policy

---

## 🔐 Backup Database (IMPORTANTE!)

Il database SQLite su Render NON è persistente. Per backup:

### Opzione 1: Download Manuale (ogni settimana)
```bash
# Dalla dashboard Render, vai in Shell e esegui:
cat database.sqlite | base64 > db_backup.txt
# Copia l'output e salvalo localmente
```

### Opzione 2: Migration a PostgreSQL (consigliato per produzione)
- Usa Render PostgreSQL (free tier disponibile)
- Modifica `server/server.js` per usare `pg` invece di `sqlite3`
- I dati persisteranno tra deploy

---

## 📝 Checklist Pre-Deploy

Prima di iniziare domani, verifica:

- [ ] Account Render.com creato
- [ ] Account Vercel accessibile
- [ ] Repository GitHub aggiornato (`git pull`)
- [ ] Credenziali admin pronte (fracabu@gmail.com)
- [ ] File Excel di test per testare calcolatore

---

## ⏱️ Tempo Totale Stimato: **55 minuti**

- Fase 1 (Backend): 30 min
- Fase 2 (Frontend): 10 min
- Fase 3 (CORS): 5 min
- Fase 4 (Test): 10 min

---

## 📞 Supporto

Se riscontri problemi:

1. **Verifica log Render**: Dashboard → Logs
2. **Verifica log Vercel**: Deployment → Function Logs
3. **Test API manualmente**:
   ```bash
   curl -X POST https://tuo-backend.onrender.com/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@test.it","password":"Test1234!"}'
   ```

---

**Buon deployment! 🚀**

*Ultimo aggiornamento: 2025-10-07*
