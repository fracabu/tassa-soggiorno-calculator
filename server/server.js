const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const crypto = require('crypto');
const { body, validationResult } = require('express-validator');
const { sendWelcomeEmail, sendResetPasswordEmail } = require('./config/email');
const db = require('./database'); // Database adapter (SQLite + PostgreSQL)
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy per Render/produzione (necessario per rate limiter)
app.set('trust proxy', 1);

// SICUREZZA: Validazione JWT_SECRET in produzione
if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32)) {
  console.error('❌ ERRORE CRITICO: JWT_SECRET non configurato o troppo corto in produzione!');
  console.error('💡 Genera un secret sicuro con: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
  process.exit(1);
}

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ==================== MIDDLEWARE ====================

// Security headers
app.use(helmet());

// CORS configurato per frontend specifico
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parser
app.use(express.json());

// Rate limiting globale
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 100, // 100 richieste per IP
  message: { error: 'Troppi tentativi, riprova tra 15 minuti' }
});
app.use(globalLimiter);

// Rate limiting per auth (più restrittivo)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minuti
  max: 5, // Solo 5 tentativi di login/registrazione
  message: { error: 'Troppi tentativi di accesso, riprova tra 15 minuti' },
  skipSuccessfulRequests: true
});

// Inizializza database (SQLite o PostgreSQL based on env)
db.initDatabase().catch(err => {
  console.error('❌ Fatal: Impossibile inizializzare database');
  process.exit(1);
});

// Middleware autenticazione
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token mancante' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token non valido' });
    }
    req.user = user;
    next();
  });
};

// ==================== API ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server attivo' });
});

// Registrazione utente
app.post('/api/register', authLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password minimo 8 caratteri'),
  body('nome').trim().notEmpty(),
  body('cognome').trim().notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, nome, cognome, azienda, telefono } = req.body;

  try {
    // Verifica se email esiste già
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [email]);

    if (existingUser) {
      return res.status(400).json({ error: 'Email già registrata' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Inserisci nuovo utente
    const result = await db.run(
      `INSERT INTO users (email, password, nome, cognome, azienda, telefono)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, hashedPassword, nome, cognome, azienda || null, telefono || null]
    );

    // Genera JWT
    const token = jwt.sign(
      { id: result.lastID, email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Registrazione completata',
      token,
      user: {
        id: result.lastID,
        email,
        nome,
        cognome
      }
    });
  } catch (error) {
    console.error('Errore registrazione:', error);
    res.status(500).json({ error: 'Errore server' });
  }
});

// Login utente
app.post('/api/login', authLimiter, [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await db.get('SELECT * FROM users WHERE email = ? AND is_active = 1', [email]);

    if (!user) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    // Verifica password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenziali non valide' });
    }

    // Aggiorna last_login
    await db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

    // Log accesso
    const ip = req.ip || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'];
    await db.run(
      'INSERT INTO login_history (user_id, ip_address, user_agent) VALUES (?, ?, ?)',
      [user.id, ip, userAgent]
    );

    // Genera JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login effettuato',
      token,
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        cognome: user.cognome,
        azienda: user.azienda
      }
    });
  } catch (error) {
    console.error('Errore login:', error);
    res.status(500).json({ error: 'Errore server' });
  }
});

// Profilo utente (protetto)
app.get('/api/profile', authenticateToken, (req, res) => {
  db.get(
    'SELECT id, email, nome, cognome, azienda, telefono, created_at, last_login FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Errore database' });
      }
      if (!user) {
        return res.status(404).json({ error: 'Utente non trovato' });
      }
      res.json({ user });
    }
  );
});

// Forgot Password - richiesta reset
app.post('/api/forgot-password', authLimiter, [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: 'Errore database' });
    }

    // Non rivelare se l'email esiste (sicurezza)
    if (!user) {
      return res.json({ message: 'Se l\'email esiste, riceverai un link per il reset' });
    }

    // Genera token reset (valido 1 ora)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpires = new Date(Date.now() + 3600000); // 1 ora

    // Salva token nel DB
    db.run(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?',
      [resetTokenHash, resetTokenExpires.toISOString(), user.id],
      async (err) => {
        if (err) {
          return res.status(500).json({ error: 'Errore durante il reset' });
        }

        // Invia email con link reset
        const resetUrl = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
        await sendResetPasswordEmail(user.email, user.nome, resetUrl);

        res.json({ message: 'Se l\'email esiste, riceverai un link per il reset' });
      }
    );
  });
});

// Reset Password - conferma con token
app.post('/api/reset-password', authLimiter, [
  body('token').notEmpty(),
  body('password').isLength({ min: 8 }).withMessage('Password minimo 8 caratteri')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { token, password } = req.body;

  // Hash del token ricevuto
  const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

  db.get(
    'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > ?',
    [resetTokenHash, new Date().toISOString()],
    async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Errore database' });
      }

      if (!user) {
        return res.status(400).json({ error: 'Token non valido o scaduto' });
      }

      // Hash nuova password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Aggiorna password e rimuovi token
      db.run(
        'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
        [hashedPassword, user.id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Errore durante il reset' });
          }

          res.json({ message: 'Password aggiornata con successo' });
        }
      );
    }
  );
});

// Salva calcolo (protetto)
app.post('/api/calculations', authenticateToken, [
  body('comune').notEmpty(),
  body('data').isObject()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { comune, file_name, total_prenotazioni, total_notti, total_tassa, data } = req.body;

  db.run(
    `INSERT INTO calculations (user_id, comune, file_name, total_prenotazioni, total_notti, total_tassa, data)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [req.user.id, comune, file_name, total_prenotazioni, total_notti, total_tassa, JSON.stringify(data)],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Errore salvataggio calcolo' });
      }

      res.status(201).json({
        message: 'Calcolo salvato',
        calculation_id: this.lastID
      });
    }
  );
});

// Recupera calcoli utente (protetto)
app.get('/api/calculations', authenticateToken, (req, res) => {
  const { limit = 50, offset = 0 } = req.query;

  db.all(
    'SELECT id, comune, file_name, total_prenotazioni, total_notti, total_tassa, created_at FROM calculations WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [req.user.id, parseInt(limit), parseInt(offset)],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Errore database' });
      }

      res.json({ calculations: rows });
    }
  );
});

// Recupera singolo calcolo con dettagli (protetto)
app.get('/api/calculations/:id', authenticateToken, (req, res) => {
  db.get(
    'SELECT * FROM calculations WHERE id = ? AND user_id = ?',
    [req.params.id, req.user.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Errore database' });
      }

      if (!row) {
        return res.status(404).json({ error: 'Calcolo non trovato' });
      }

      // Parse JSON data
      row.data = JSON.parse(row.data);

      res.json({ calculation: row });
    }
  );
});

// ==================== ADMIN ROUTES ====================

// Middleware per verificare admin (semplificato - basato su email)
const isAdmin = (req, res, next) => {
  try {
    // In produzione usare un campo is_admin nel database
    const adminEmails = (process.env.ADMIN_EMAILS || 'admin@tassasoggiorno.it')
      .split(',')
      .map(email => email.trim());

    console.log('🔐 Admin check:', {
      userEmail: req.user?.email,
      adminEmails: adminEmails,
      isAdmin: adminEmails.includes(req.user?.email)
    });

    if (!req.user || !req.user.email) {
      return res.status(401).json({ error: 'Autenticazione richiesta' });
    }

    if (!adminEmails.includes(req.user.email)) {
      return res.status(403).json({ error: 'Accesso negato - Solo amministratori' });
    }

    next();
  } catch (error) {
    console.error('❌ Errore in isAdmin middleware:', error);
    return res.status(500).json({ error: 'Errore verifica permessi' });
  }
};

// Lista tutti gli utenti (protetto admin)
app.get('/api/admin/users', authenticateToken, isAdmin, (req, res) => {
  console.log('📋 Richiesta lista utenti da:', req.user.email);

  db.all(
    `SELECT id, email, nome, cognome, azienda, telefono, created_at, last_login, is_active
     FROM users
     ORDER BY created_at DESC`,
    [],
    (err, rows) => {
      if (err) {
        console.error('❌ Errore query utenti:', err);
        return res.status(500).json({ error: 'Errore database' });
      }
      console.log(`✅ Trovati ${rows.length} utenti`);
      res.json({ users: rows });
    }
  );
});

// Aggiorna utente (protetto admin)
app.put('/api/admin/users/:id', authenticateToken, isAdmin, [
  body('email').optional().isEmail().normalizeEmail(),
  body('nome').optional().trim(),
  body('cognome').optional().trim(),
  body('is_active').optional().isBoolean()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { email, nome, cognome, azienda, telefono, is_active } = req.body;

  const updates = [];
  const values = [];

  if (email !== undefined) {
    updates.push('email = ?');
    values.push(email);
  }
  if (nome !== undefined) {
    updates.push('nome = ?');
    values.push(nome);
  }
  if (cognome !== undefined) {
    updates.push('cognome = ?');
    values.push(cognome);
  }
  if (azienda !== undefined) {
    updates.push('azienda = ?');
    values.push(azienda);
  }
  if (telefono !== undefined) {
    updates.push('telefono = ?');
    values.push(telefono);
  }
  if (is_active !== undefined) {
    updates.push('is_active = ?');
    values.push(is_active ? 1 : 0);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'Nessun campo da aggiornare' });
  }

  values.push(id);

  db.run(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    values,
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Errore durante l\'aggiornamento' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Utente non trovato' });
      }
      res.json({ message: 'Utente aggiornato con successo' });
    }
  );
});

// Elimina utente (protetto admin)
app.delete('/api/admin/users/:id', authenticateToken, isAdmin, (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Errore durante l\'eliminazione' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Utente non trovato' });
    }
    res.json({ message: 'Utente eliminato con successo' });
  });
});

// Statistiche admin
app.get('/api/admin/stats', authenticateToken, isAdmin, (req, res) => {
  db.get('SELECT COUNT(*) as total_users FROM users WHERE is_active = 1', (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Errore database' });
    }

    db.get('SELECT COUNT(*) as total_calculations FROM calculations', (err2, row2) => {
      if (err2) {
        return res.status(500).json({ error: 'Errore database' });
      }

      res.json({
        total_users: row.total_users,
        total_calculations: row2.total_calculations,
        timestamp: new Date()
      });
    });
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Errore interno del server' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server avviato su http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await db.close();
  process.exit(0);
});
