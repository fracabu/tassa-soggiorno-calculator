# TODO - Deployment e Configurazioni Finali

Data: 10 Ottobre 2025

## 🎯 Priorità Alta

### 1. Configurare Disco Persistente su Render
**Problema**: Il database SQLite si resetta ad ogni deploy/riavvio, perdendo tutti gli utenti registrati.

**Soluzione**:
- [ ] Andare su Render Dashboard → Servizio Backend
- [ ] Click su **"Disks"** nel menu laterale
- [ ] Click **"Add Disk"**
  - Nome: `database-disk`
  - Mount Path: `/var/data`
  - Size: **1 GB** (gratuito nel free tier)
- [ ] Salvare

**Modifica Codice** (dopo aver creato il disco):
- [ ] Modificare `server/server.js` riga 58
  - Da: `const db = new sqlite3.Database('./database.sqlite')`
  - A: `const db = new sqlite3.Database('/var/data/database.sqlite')`
- [ ] Commit e push modifiche
- [ ] Verificare che il database persista tra i deploy

---

### 2. Configurare Email Recovery Password
**Email da usare**: `info@ospitly.it`

**Credenziali SMTP Aruba**:
- [ ] Recuperare password email `info@ospitly.it` da Aruba
- [ ] Verificare impostazioni SMTP Aruba:
  - Host: `smtp.aruba.it` o `smtps.aruba.it`
  - Port: `465` (SSL) o `587` (TLS)
  - Secure: `true` per porta 465

**Configurare Environment Variables su Render**:
- [ ] Andare su Render → Environment Variables
- [ ] Aggiungere/Modificare:
  ```
  SMTP_HOST=smtp.aruba.it
  SMTP_PORT=465
  SMTP_SECURE=true
  SMTP_USER=info@ospitly.it
  SMTP_PASSWORD=<password-da-inserire>
  EMAIL_FROM=info@ospitly.it
  ```
- [ ] Salvare (il servizio si riavvierà automaticamente)

**Testing**:
- [ ] Testare "Password dimenticata?" sulla landing page
- [ ] Verificare ricezione email su casella test
- [ ] Verificare funzionamento link reset password

---

### 3. Aggiornare Ospitly.it
**CTA da modificare**:
- [ ] Cambiare da "Richiedi Credenziali" a **"Prova Ora!"**
- [ ] Link al calcolatore:
  - Opzione A: `https://tassa-soggiorno-calculator.vercel.app`
  - Opzione B: Configurare dominio custom (es. `calc.ospitly.it`)

**Comunicazione agli utenti esistenti** (opzionale):
- [ ] Email a utenti che avevano richiesto credenziali
- [ ] Informarli della nuova registrazione self-service

---

## 📋 Priorità Media

### 4. Miglioramenti Email Templates
- [ ] Personalizzare email di benvenuto (`server/config/email.js`)
  - Logo Ospitly/TourTax
  - Branding coerente
  - Link rapidi (guida, supporto)

- [ ] Personalizzare email reset password
  - Design professionale
  - Istruzioni chiare
  - Link con scadenza (già 1 ora)

### 5. Backup Manuale Utenti
- [ ] Esportare CSV utenti attuali dal pannello admin
- [ ] Salvare in locale come backup
- [ ] Dopo configurazione disco persistente, re-importare se necessario

---

## 🔧 Priorità Bassa (Opzionale)

### 6. Dominio Custom
Se vuoi un dominio più professionale:
- [ ] Configurare `calc.ospitly.it` o `tassa.ospitly.it`
- [ ] DNS su Aruba → CNAME → Vercel
- [ ] Aggiornare `FRONTEND_URL` su Render

### 7. Monitoraggio
- [ ] Configurare alerting per downtime Render (UptimeRobot gratuito)
- [ ] Verificare logs Render per errori
- [ ] Testare caricamento da mobile

### 8. SEO e Analytics (se necessario)
- [ ] Google Analytics su landing page
- [ ] Aggiornare meta description
- [ ] Sitemap.xml

---

## 📝 Note Tecniche

### Impostazioni SMTP Aruba (riferimento)
Documentazione: https://guide.aruba.it/hosting/configurazione-client-posta/parametri-server-posta-aruba.aspx

**Server in uscita (SMTP)**:
- Server: `smtp.aruba.it` o `smtps.aruba.it`
- Porta SSL: `465`
- Porta TLS: `587`
- Autenticazione: Richiesta
- Username: indirizzo email completo (`info@ospitly.it`)

### Environment Variables Render (Riepilogo Completo)
```env
# Backend
PORT=10000
NODE_ENV=production

# Security
JWT_SECRET=<già-configurato-su-render>

# Admin
ADMIN_EMAILS=fracabu@gmail.com,admin@tassasoggiorno.it,francesco@admin.com

# Frontend
FRONTEND_URL=https://tassa-soggiorno-calculator.vercel.app

# Email (DA CONFIGURARE)
SMTP_HOST=smtp.aruba.it
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=info@ospitly.it
SMTP_PASSWORD=<password-email-ospitly>
EMAIL_FROM=info@ospitly.it
```

---

## ✅ Checklist Pre-Launch

Prima di annunciare pubblicamente:
- [ ] Disco persistente configurato e testato
- [ ] Email recovery funzionante
- [ ] Almeno 3 registrazioni di test completate
- [ ] Export CSV funzionante
- [ ] Pannello admin accessibile
- [ ] App testata su mobile (iOS/Android)
- [ ] Backup database esportato
- [ ] CTA su Ospitly.it aggiornata

---

## 🚀 Deploy Checklist (Ordine Consigliato)

1. **Mattina** - Configurazioni Render
   - Disco persistente
   - Email SMTP
   - Test completo

2. **Pomeriggio** - Testing
   - Registrazione nuovi utenti
   - Recovery password
   - Export CSV

3. **Sera** - Go Live
   - Aggiornare Ospitly.it
   - Annuncio (se applicabile)

---

## 📞 Supporto

**Render Support**: https://render.com/docs
**Aruba Email**: https://guide.aruba.it/
**Vercel Docs**: https://vercel.com/docs

---

**Ultima modifica**: 9 Ottobre 2025
**Creato da**: Claude Code
