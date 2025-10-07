// Test email rapido
const nodemailer = require('nodemailer');
require('dotenv').config();

console.log('Nodemailer version:', require('nodemailer/package.json').version);

const transporter = nodemailer.createTransporter({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

console.log('📧 Testing email con:', process.env.SMTP_USER);
console.log('🔑 Password:', process.env.SMTP_PASSWORD ? '***' + process.env.SMTP_PASSWORD.slice(-4) : 'MANCANTE');

transporter.sendMail({
  from: process.env.EMAIL_FROM,
  to: process.env.SMTP_USER, // Manda a te stesso
  subject: '🧪 Test Email - Tassa Soggiorno',
  text: 'Se ricevi questa email, il sistema funziona!',
  html: '<h1>✅ Email funzionante!</h1><p>Il sistema è configurato correttamente.</p>'
})
.then(info => {
  console.log('✅ EMAIL INVIATA CON SUCCESSO!');
  console.log('📬 Message ID:', info.messageId);
  console.log('📊 Response:', info.response);
  process.exit(0);
})
.catch(err => {
  console.error('❌ ERRORE INVIO EMAIL:');
  console.error(err);
  process.exit(1);
});
