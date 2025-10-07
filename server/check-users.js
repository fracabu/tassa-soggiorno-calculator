const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Errore connessione database:', err);
    process.exit(1);
  }
  console.log('✅ Database connesso');
});

db.all('SELECT id, email, nome, cognome, created_at, is_active FROM users', [], (err, rows) => {
  if (err) {
    console.error('❌ Errore query:', err);
    process.exit(1);
  }

  console.log(`\n📊 Totale utenti: ${rows.length}\n`);

  if (rows.length > 0) {
    console.log('Lista utenti:');
    console.table(rows);
  } else {
    console.log('⚠️  Nessun utente trovato nel database');
  }

  db.close();
});
