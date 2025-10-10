// Database adapter: SQLite (sviluppo) + PostgreSQL (produzione)
const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');

const usePostgres = !!process.env.DATABASE_URL;

let db;
let pool;

// ==================== CONNESSIONE ====================

if (usePostgres) {
  console.log('🐘 Connessione PostgreSQL...');
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: false
    } : false
  });

  pool.on('error', (err) => {
    console.error('❌ Errore PostgreSQL:', err);
  });
} else {
  console.log('📁 Connessione SQLite locale...');
  db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
      console.error('❌ Errore SQLite:', err);
    } else {
      console.log('✅ SQLite connesso');
    }
  });
}

// ==================== HELPER FUNCTIONS ====================

// Converti placeholder ? in $1, $2 per PostgreSQL
function convertPlaceholders(sql, params) {
  if (!usePostgres || params.length === 0) return { sql, params };

  let index = 1;
  const newSql = sql.replace(/\?/g, () => `$${index++}`);
  return { sql: newSql, params };
}

// Query multipla (SELECT)
function query(sql, params = []) {
  return new Promise((resolve, reject) => {
    const { sql: finalSql, params: finalParams } = convertPlaceholders(sql, params);

    if (usePostgres) {
      pool.query(finalSql, finalParams, (err, result) => {
        if (err) return reject(err);
        resolve(result.rows || []);
      });
    } else {
      db.all(sql, params, (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    }
  });
}

// Get singolo record
function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    const { sql: finalSql, params: finalParams } = convertPlaceholders(sql, params);

    if (usePostgres) {
      pool.query(finalSql, finalParams, (err, result) => {
        if (err) return reject(err);
        resolve(result.rows[0] || null);
      });
    } else {
      db.get(sql, params, (err, row) => {
        if (err) return reject(err);
        resolve(row || null);
      });
    }
  });
}

// Run (INSERT/UPDATE/DELETE)
function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    let { sql: finalSql, params: finalParams } = convertPlaceholders(sql, params);

    if (usePostgres) {
      // Aggiungi RETURNING id per INSERT
      if (finalSql.trim().toUpperCase().startsWith('INSERT')) {
        finalSql += ' RETURNING id';
      }

      pool.query(finalSql, finalParams, (err, result) => {
        if (err) return reject(err);
        resolve({
          lastID: result.rows?.[0]?.id || null,
          changes: result.rowCount || 0
        });
      });
    } else {
      db.run(sql, params, function(err) {
        if (err) return reject(err);
        resolve({
          lastID: this.lastID,
          changes: this.changes
        });
      });
    }
  });
}

// ==================== INIZIALIZZAZIONE TABELLE ====================

async function initDatabase() {
  try {
    if (usePostgres) {
      console.log('📊 Creazione tabelle PostgreSQL...');

      // Users
      await run(`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          nome TEXT,
          cognome TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP,
          is_active BOOLEAN DEFAULT TRUE,
          email_verified BOOLEAN DEFAULT FALSE,
          reset_token TEXT,
          reset_token_expires TIMESTAMP
        )
      `);

      // Login history
      await run(`
        CREATE TABLE IF NOT EXISTS login_history (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id),
          login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          ip_address TEXT,
          user_agent TEXT
        )
      `);

      // Calculations
      await run(`
        CREATE TABLE IF NOT EXISTS calculations (
          id SERIAL PRIMARY KEY,
          user_id INTEGER NOT NULL REFERENCES users(id),
          comune TEXT NOT NULL,
          file_name TEXT,
          total_prenotazioni INTEGER,
          total_notti INTEGER,
          total_tassa REAL,
          data JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      console.log('✅ Tabelle PostgreSQL pronte');
    } else {
      console.log('📊 Creazione tabelle SQLite...');

      await run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          nome TEXT,
          cognome TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          last_login DATETIME,
          is_active BOOLEAN DEFAULT 1,
          email_verified BOOLEAN DEFAULT 0,
          reset_token TEXT,
          reset_token_expires DATETIME
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS login_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER,
          login_time DATETIME DEFAULT CURRENT_TIMESTAMP,
          ip_address TEXT,
          user_agent TEXT,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      await run(`
        CREATE TABLE IF NOT EXISTS calculations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          comune TEXT NOT NULL,
          file_name TEXT,
          total_prenotazioni INTEGER,
          total_notti INTEGER,
          total_tassa REAL,
          data JSON,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id)
        )
      `);

      console.log('✅ Tabelle SQLite pronte');
    }
  } catch (error) {
    console.error('❌ Errore inizializzazione database:', error);
    throw error;
  }
}

// ==================== SHUTDOWN ====================

function close() {
  return new Promise((resolve) => {
    if (usePostgres) {
      pool.end(() => {
        console.log('🛑 PostgreSQL chiuso');
        resolve();
      });
    } else {
      db.close((err) => {
        if (err) console.error(err.message);
        console.log('🛑 SQLite chiuso');
        resolve();
      });
    }
  });
}

module.exports = {
  query,
  get,
  run,
  initDatabase,
  close,
  isPostgres: usePostgres
};
