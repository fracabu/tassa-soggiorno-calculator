# ✅ Checklist Deploy - Tassa Soggiorno Calculator

## 📋 Pre-Deploy

### Frontend (Vercel)
- [ ] Codice pushato su GitHub
- [ ] Build locale funzionante (`npm run build`)
- [ ] Nessun errore TypeScript/ESLint
- [ ] `.env.example` aggiornato con variabili necessarie
- [ ] `.gitignore` esclude `.env`, `.env.local`

### Backend (Render)
- [ ] Server funziona localmente (`npm run dev`)
- [ ] Endpoint `/api/health` risponde
- [ ] Database SQLite si crea correttamente
- [ ] JWT_SECRET generato con script (`npm run generate-secret`)
- [ ] `.env.example` aggiornato
- [ ] `.gitignore` esclude `.env`, `*.sqlite`, `*.db`

---

## 🚀 Durante Deploy

### Backend su Render
- [ ] Web Service creato con nome: `tassa-soggiorno-api`
- [ ] Region: Frankfurt (o più vicina)
- [ ] Root Directory: `server`
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] Environment Variables configurate:
  - [ ] `NODE_ENV=production`
  - [ ] `JWT_SECRET=<64-char-random>`
  - [ ] `ADMIN_EMAILS=tua-email@example.com`
  - [ ] `FRONTEND_URL=https://tuo-app.vercel.app`
- [ ] Build completato con successo
- [ ] Status: **Live** ✅

### Frontend su Vercel
- [ ] Environment Variable aggiornata:
  - [ ] `REACT_APP_API_URL=https://tassa-soggiorno-api.onrender.com/api`
- [ ] Redeploy triggerato
- [ ] Build completato con successo
- [ ] Status: **Ready** ✅

---

## 🧪 Post-Deploy Testing

### 1. Backend Health Check
```bash
curl https://tassa-soggiorno-api.onrender.com/api/health
```
**Risposta attesa:**
```json
{"status":"OK","message":"Server attivo"}
```
- [ ] Endpoint risponde correttamente
- [ ] Response time < 5 sec (primo request ~30 sec se cold start)

### 2. Frontend Accessibile
- [ ] Sito caricato: `https://tuo-app.vercel.app`
- [ ] Landing page visualizzata correttamente
- [ ] Nessun errore in Console Browser (F12)
- [ ] Dark mode funziona

### 3. Registrazione Utente
- [ ] Form registrazione compilabile
- [ ] Email valida richiesta
- [ ] Password minimo 8 caratteri
- [ ] Registrazione completata con successo
- [ ] Redirect automatico a `/app`

### 4. Login
- [ ] Login con credenziali appena create funziona
- [ ] JWT token salvato in localStorage
- [ ] User info salvato in localStorage
- [ ] Redirect a `/app` dopo login

### 5. Upload File
- [ ] Upload file Excel (.xlsx) funziona
- [ ] Upload file CSV funziona
- [ ] Parsing dati corretto
- [ ] Calcoli tassa visualizzati
- [ ] Nessun errore CORS

### 6. Export Dati
- [ ] Export CSV funziona
- [ ] CSV scaricabile e leggibile in Excel
- [ ] Export PDF funziona
- [ ] PDF scaricabile e formattato correttamente

### 7. Admin Panel (se applicabile)
- [ ] Accesso a `/admin` funziona (solo se email in ADMIN_EMAILS)
- [ ] Lista utenti visualizzata
- [ ] Statistiche visibili

### 8. Mobile Responsive
- [ ] Design responsive su mobile (width < 768px)
- [ ] Touch targets sufficientemente grandi
- [ ] Tabelle scrollabili orizzontalmente
- [ ] Upload file funziona da mobile

---

## 🔒 Security Checklist

### Backend
- [ ] JWT_SECRET almeno 64 caratteri casuali
- [ ] JWT_SECRET NON committato su GitHub
- [ ] CORS limitato solo a frontend URL
- [ ] Rate limiting attivo (100 req/15min globale, 5 req/15min auth)
- [ ] Helmet security headers attivi
- [ ] Password hash con bcrypt (10 rounds)
- [ ] Input validation con express-validator
- [ ] SQL injection protected (prepared statements)

### Frontend
- [ ] API URL configurato via env var
- [ ] Nessun secret committato nel codice
- [ ] HTTPS enforced (Vercel default)
- [ ] Auth token in localStorage (nota: vulnerabile a XSS ma accettabile per MVP)

### Database
- [ ] SQLite file in `.gitignore`
- [ ] Backup strategy pianificata (Render Free non garantisce persistenza!)
- [ ] Considerare migrazione a PostgreSQL per produzione seria

---

## 📊 Monitoring Setup

### Render Dashboard
- [ ] Logs in tempo reale configurati
- [ ] Metrics monitorate (CPU, Memory, Requests)
- [ ] Alert email configurate (opzionale)

### Vercel Dashboard
- [ ] Analytics attivato
- [ ] Error reporting verificato
- [ ] Deployment notifications (opzionale)

### External Monitoring (Opzionale)
- [ ] UptimeRobot configurato (mantiene Render awake)
- [ ] Sentry per error tracking (opzionale)
- [ ] Plausible/Umami Analytics (opzionale)

---

## 🐛 Troubleshooting Comune

### CORS Error
**Sintomo:** Console error "CORS blocked"
**Fix:** Verifica `FRONTEND_URL` su Render sia esattamente uguale a URL Vercel (no trailing slash)

### JWT Error
**Sintomo:** "Token non valido" dopo riavvio server
**Fix:** JWT_SECRET deve essere persistente, verifica sia configurato su Render

### Database Vuoto Dopo Deploy
**Sintomo:** Utenti spariti dopo redeploy
**Causa:** Render Free non garantisce persistenza SQLite
**Fix:** Implementa backup o migra a PostgreSQL

### Backend Lento
**Sintomo:** Primo request impiega ~30 secondi
**Causa:** Render Free va in sleep dopo 15 min inattività
**Fix:** Upgrade a piano Starter ($7/mese) o usa UptimeRobot per keep-alive

### Email Non Funzionano
**Sintomo:** Email benvenuto/reset non arrivano
**Fix:** Configura `EMAIL_*` env vars su Render (opzionale per funzionamento base)

---

## 📈 Performance Optimization (Post-Launch)

### Immediato
- [ ] Verifica bundle size frontend < 500KB (Vercel Analytics)
- [ ] Lazy loading componenti pesanti
- [ ] Compressione immagini

### Breve Termine (1-2 settimane)
- [ ] Implementa caching strategico
- [ ] Code splitting per routes
- [ ] Virtual scrolling per tabelle grandi

### Lungo Termine (1+ mesi)
- [ ] Migra a PostgreSQL per produzione
- [ ] Implementa CDN per assets statici
- [ ] Considera Redis per session storage
- [ ] Upgrade Render a piano Starter per performance

---

## 💰 Cost Estimation

### Attuale (Free Tier)
- Vercel: $0/mese
- Render: $0/mese
- **Totale: $0/mese**

**Limitazioni:**
- Render sleep dopo 15 min
- No persistenza garantita SQLite
- Bandwidth limitato
- Build time limitato

### Upgrade Raccomandato (Produzione)
- Vercel Pro: $20/mese (opzionale, hobby sufficiente per MVP)
- Render Starter: $7/mese (raccomandato per no-sleep)
- Render PostgreSQL: $7/mese (raccomandato per persistenza)
- **Totale: ~$14-34/mese**

---

## 🎉 Go-Live Checklist

Prima di annunciare pubblicamente l'app:

- [ ] Tutti i test sopra passati ✅
- [ ] Security checklist completata ✅
- [ ] Monitoring attivo ✅
- [ ] Backup strategy implementata ✅
- [ ] Dominio custom configurato (opzionale)
- [ ] Privacy Policy, Terms of Service aggiornati
- [ ] Cookie Banner funzionante
- [ ] Analytics configurato
- [ ] Error tracking attivo
- [ ] Documentazione utente pronta

---

## 📞 Support Contacts

- **Render Support:** https://render.com/docs/support
- **Vercel Support:** https://vercel.com/support
- **Community Help:** GitHub Issues del repository

---

**Ultimo aggiornamento:** 2025
**Versione Checklist:** 1.0
