# 🚀 Guida Deployment - Calcolatore Tassa di Soggiorno

## Panoramica

Questa applicazione è composta da:
- **Frontend**: React SPA (Single Page Application)
- **Backend**: Node.js/Express API con SQLite database

## Opzioni di Deployment

### 1️⃣ DEPLOYMENT COMPLETO (Raccomandato)

#### **Render.com** (Full-Stack - GRATIS)

**Backend:**
1. Vai su [render.com](https://render.com) e crea un account
2. Crea un nuovo **Web Service**
3. Connetti il repository GitHub
4. Configurazione:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

5. Aggiungi le variabili d'ambiente:
   ```
   JWT_SECRET=<genera-una-stringa-casuale-lunga>
   ADMIN_EMAILS=tua-email@example.com
   NODE_ENV=production
   FRONTEND_URL=<url-del-frontend>
   ```

   Per generare JWT_SECRET sicuro:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

6. Deploy! L'URL sarà tipo: `https://tassa-soggiorno-api.onrender.com`

**Frontend:**
1. Crea un nuovo **Static Site** su Render
2. Configurazione:
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`

3. Aggiungi variabile d'ambiente:
   ```
   REACT_APP_API_URL=<url-backend-da-passo-6>
   ```

4. Deploy!

---

### 2️⃣ DEPLOYMENT SEPARATO

#### **Backend: Railway.app** (GRATIS con $5/mese di crediti)

1. Vai su [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Seleziona il repository
4. Vai in **Settings**:
   - **Root Directory**: `server`
   - **Start Command**: `npm start`

5. Vai in **Variables** e aggiungi:
   ```
   JWT_SECRET=<stringa-casuale>
   ADMIN_EMAILS=tua-email@example.com
   NODE_ENV=production
   ```

6. Railway genererà un URL pubblico

#### **Frontend: Vercel** (GRATIS)

1. Vai su [vercel.com](https://vercel.com)
2. "Import Project" dal tuo GitHub
3. Configurazione:
   - **Framework Preset**: Create React App
   - **Root Directory**: `./` (lascia vuoto)

4. Aggiungi Environment Variable:
   ```
   REACT_APP_API_URL=<url-backend-railway>
   ```

5. Deploy!

---

### 3️⃣ DEPLOYMENT VPS (Per utenti avanzati)

**Requisiti**: Server Linux con Node.js 18+

#### Setup Backend:

```bash
# 1. Clona repository
git clone <your-repo-url>
cd tassa-soggiorno-calculator/server

# 2. Installa dipendenze
npm install --production

# 3. Crea file .env
cp .env.example .env
nano .env  # Configura le variabili

# 4. Installa PM2 (process manager)
npm install -g pm2

# 5. Avvia il server
pm2 start server.js --name tassa-soggiorno-api
pm2 save
pm2 startup  # Segui le istruzioni per auto-start
```

#### Setup Frontend:

```bash
# 1. Build
cd ../
npm install
REACT_APP_API_URL=http://your-backend-url npm run build

# 2. Servi con nginx
sudo apt install nginx
sudo cp -r build/* /var/www/html/
sudo systemctl restart nginx
```

---

## ⚙️ Configurazione Ambiente di Produzione

### Variabili Backend (`.env`)

```env
# OBBLIGATORIE
JWT_SECRET=<genera-stringa-64-caratteri-casuali>
ADMIN_EMAILS=admin@tassa.it,altro@admin.it
NODE_ENV=production
FRONTEND_URL=https://tua-app-frontend.com

# OPZIONALI (Email)
EMAIL_SERVICE=gmail
EMAIL_USER=tua-email@gmail.com
EMAIL_PASSWORD=app-specific-password
EMAIL_FROM=noreply@tassasoggiorno.it
```

### Variabili Frontend

Crea file `.env.production` nella root:

```env
REACT_APP_API_URL=https://tua-api-backend.com
```

---

## 📋 Checklist Pre-Deployment

- [ ] ✅ `.gitignore` esclude `.env` e `database.sqlite`
- [ ] ✅ JWT_SECRET generato in modo sicuro
- [ ] ✅ ADMIN_EMAILS configurate correttamente
- [ ] ✅ CORS configurato per URL frontend corretto
- [ ] ✅ Database SQLite funzionante (verrà creato automaticamente)
- [ ] ✅ Test locale completato (frontend + backend)

---

## 🔒 Sicurezza

### Database
- Il database SQLite viene creato automaticamente al primo avvio
- **IMPORTANTE**: Il file `database.sqlite` è in `.gitignore` e NON verrà pushato
- Per backup: salva regolarmente il file `database.sqlite` dal server

### Password e Secrets
- ❌ **MAI** committare file `.env` nel repository
- ✅ Usa sempre `.env.example` come template
- ✅ Genera JWT_SECRET unico per ogni ambiente

---

## 🧪 Test Pre-Deployment

```bash
# Backend
cd server
npm install
npm run dev
# Testa: http://localhost:3001/health

# Frontend
cd ..
npm install
npm start
# Testa: http://localhost:3000
```

---

## 🚨 Troubleshooting

### Errore: "CORS blocked"
- Verifica che `FRONTEND_URL` nel backend corrisponda all'URL del frontend

### Database non si crea
- Controlla permessi directory `server/`
- Verifica che SQLite sia supportato dalla piattaforma

### Admin non funziona
- Controlla che `ADMIN_EMAILS` sia configurato correttamente
- Verifica che l'email dell'utente loggato sia nella lista

---

## 📞 Supporto

Per problemi:
1. Controlla i log del server: `pm2 logs` o nella dashboard della piattaforma
2. Verifica tutte le variabili d'ambiente
3. Consulta la documentazione della piattaforma di hosting

---

## 🔄 Aggiornamenti

Per deployare modifiche:

```bash
git add .
git commit -m "Descrizione modifiche"
git push origin main
```

Le piattaforme come Render/Vercel/Railway faranno auto-deploy automaticamente!

---

**Buon deployment! 🎉**
