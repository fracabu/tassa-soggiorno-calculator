# Backend Node.js - Tassa Soggiorno Calculator

## Setup

```bash
cd server
npm install
cp .env.example .env
# Modifica .env con i tuoi valori
npm run dev
```

## API Endpoints

### Pubblici
- `GET /api/health` - Health check
- `POST /api/register` - Registrazione utente
- `POST /api/login` - Login utente

### Protetti (richiedono JWT token)
- `GET /api/profile` - Profilo utente
- `GET /api/admin/stats` - Statistiche (admin)

## Esempio Registrazione

```bash
curl -X POST http://localhost:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "utente@example.com",
    "password": "password123",
    "nome": "Mario",
    "cognome": "Rossi",
    "azienda": "Hotel Roma",
    "telefono": "+39 123456789"
  }'
```

## Esempio Login

```bash
curl -X POST http://localhost:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "utente@example.com",
    "password": "password123"
  }'
```

## Database

SQLite database: `database.sqlite`

### Tabelle
- `users` - Utenti registrati
- `login_history` - Storia accessi

## Sicurezza

- Password hashate con bcryptjs
- JWT per autenticazione
- Validazione input con express-validator
- CORS abilitato per frontend

## Deploy

Per produzione, usa PM2:

```bash
npm install -g pm2
pm2 start server.js --name tassa-backend
pm2 save
pm2 startup
```
