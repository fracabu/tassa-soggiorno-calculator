# ⚡ Render Deploy - Quick Start (5 minuti)

## 🎯 Setup Rapido Backend

### 1️⃣ Crea Web Service su Render

```
URL: https://dashboard.render.com/select-repo
```

**Configurazione:**
- **Name:** `tassa-soggiorno-api`
- **Region:** `Frankfurt`
- **Root Directory:** `server`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Plan:** Free

### 2️⃣ Environment Variables (Render Dashboard)

```bash
NODE_ENV=production

# Genera JWT_SECRET (comando sotto)
JWT_SECRET=<genera-con-comando-sotto>

# La tua email admin
ADMIN_EMAILS=tua-email@example.com

# URL frontend Vercel (IMPORTANTE!)
FRONTEND_URL=https://tuo-app.vercel.app
```

**Genera JWT_SECRET sicuro:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3️⃣ Deploy!

Click **"Create Web Service"** → Attendi 2-3 minuti

### 4️⃣ Collega Frontend Vercel

**Vercel Dashboard:**
1. Settings → Environment Variables
2. Aggiungi/Aggiorna:
```
REACT_APP_API_URL=https://tassa-soggiorno-api.onrender.com/api
```
3. Deployments → Redeploy

### 5️⃣ Test

```bash
# Health check
curl https://tassa-soggiorno-api.onrender.com/api/health
```

✅ **Done!** Ora puoi usare l'app con backend live su Render.

---

## 🆘 Problemi Comuni

### "JWT_SECRET not configured"
→ Verifica variabile su Render Dashboard

### CORS Error
→ Verifica `FRONTEND_URL` sia esattamente: `https://tuo-dominio.vercel.app` (no trailing slash)

### Backend lento al primo accesso
→ Normale: Render Free si addormenta dopo 15 min di inattività (~30 sec risveglio)

---

📖 **Guida completa:** Vedi `DEPLOY_RENDER.md`
