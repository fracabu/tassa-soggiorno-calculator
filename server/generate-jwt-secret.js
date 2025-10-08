#!/usr/bin/env node

/**
 * Script per generare un JWT_SECRET sicuro
 *
 * Uso:
 *   node generate-jwt-secret.js
 */

const crypto = require('crypto');

console.log('🔐 Generazione JWT_SECRET sicuro...\n');

// Genera 64 byte casuali (512 bit)
const secret = crypto.randomBytes(64).toString('hex');

console.log('✅ JWT_SECRET generato:\n');
console.log('━'.repeat(80));
console.log(secret);
console.log('━'.repeat(80));
console.log('\n📋 Copia questo valore e aggiungilo come variabile d\'ambiente:\n');
console.log('Per Render.com:');
console.log('  Dashboard → Environment → Add Environment Variable');
console.log('  Key: JWT_SECRET');
console.log(`  Value: ${secret}\n`);
console.log('Per .env locale:');
console.log(`  JWT_SECRET=${secret}\n`);
console.log('⚠️  IMPORTANTE: Non committare mai questo valore nel repository!\n');
