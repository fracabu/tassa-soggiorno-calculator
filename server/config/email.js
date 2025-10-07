const nodemailer = require('nodemailer');

// Configurazione trasporto email
const createTransporter = () => {
  // Supporta sia SMTP che servizi come Gmail, SendGrid, Mailgun
  if (process.env.EMAIL_SERVICE) {
    // Servizio pre-configurato (Gmail, Outlook, etc)
    return nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  } else {
    // SMTP personalizzato
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === 'true', // true per 465, false per altri
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });
  }
};

const transporter = createTransporter();

// Template email di benvenuto
const getWelcomeEmailTemplate = (nome, email, loginUrl) => {
  return {
    subject: '🎉 Benvenuto su Tassa Soggiorno Calculator!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
          .credentials { background: white; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🏨 Tassa Soggiorno Calculator</h1>
            <p>Il tuo strumento professionale per il calcolo della tassa di soggiorno</p>
          </div>
          <div class="content">
            <h2>Ciao ${nome}! 👋</h2>
            <p>Grazie per esserti registrato al nostro servizio. Siamo felici di averti con noi!</p>

            <div class="credentials">
              <strong>📧 Email di accesso:</strong> ${email}<br>
              <small style="color: #6b7280;">Usa questa email e la password che hai scelto per accedere</small>
            </div>

            <p><strong>Cosa puoi fare con Tassa Soggiorno Calculator:</strong></p>
            <ul>
              <li>📊 Calcolo automatico tassa di soggiorno per tutti i comuni italiani</li>
              <li>📁 Importazione file Excel/CSV da Booking.com e Airbnb</li>
              <li>💾 Salvataggio automatico dei tuoi calcoli</li>
              <li>📈 Report mensili e analisi geografiche</li>
              <li>📄 Export CSV e PDF per la contabilità</li>
            </ul>

            <p style="text-align: center;">
              <a href="${loginUrl}" class="button">🚀 Inizia Subito</a>
            </p>

            <p style="color: #6b7280; font-size: 14px;">
              Se hai domande o hai bisogno di supporto, rispondi a questa email. Siamo qui per aiutarti!
            </p>
          </div>
          <div class="footer">
            <p>© 2025 Tassa Soggiorno Calculator. Tutti i diritti riservati.</p>
            <p style="font-size: 11px; margin-top: 10px;">
              Questa email è stata inviata a ${email} perché ti sei registrato al nostro servizio.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Benvenuto su Tassa Soggiorno Calculator!

Ciao ${nome},

Grazie per esserti registrato al nostro servizio!

Email di accesso: ${email}
Usa questa email e la password che hai scelto per accedere.

Accedi ora: ${loginUrl}

Cosa puoi fare:
- Calcolo automatico tassa di soggiorno per tutti i comuni italiani
- Importazione file Excel/CSV da Booking.com e Airbnb
- Salvataggio automatico dei tuoi calcoli
- Report mensili e analisi geografiche
- Export CSV e PDF per la contabilità

Per supporto, rispondi a questa email.

© 2025 Tassa Soggiorno Calculator
    `
  };
};

// Template email reset password
const getResetPasswordEmailTemplate = (nome, resetUrl) => {
  return {
    subject: '🔐 Reset Password - Tassa Soggiorno Calculator',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #dc2626; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
          .warning { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔐 Reset Password</h1>
          </div>
          <div class="content">
            <h2>Ciao ${nome},</h2>
            <p>Hai richiesto il reset della tua password per Tassa Soggiorno Calculator.</p>

            <p style="text-align: center;">
              <a href="${resetUrl}" class="button">🔓 Reset Password</a>
            </p>

            <div class="warning">
              <strong>⚠️ Importante:</strong><br>
              Questo link è valido per <strong>1 ora</strong>.<br>
              Se non hai richiesto tu questo reset, ignora questa email e la tua password rimarrà invariata.
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              Se il pulsante non funziona, copia e incolla questo link nel browser:<br>
              <code style="background: white; padding: 5px; display: inline-block; margin-top: 5px;">${resetUrl}</code>
            </p>
          </div>
          <div class="footer">
            <p>© 2025 Tassa Soggiorno Calculator</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Reset Password - Tassa Soggiorno Calculator

Ciao ${nome},

Hai richiesto il reset della tua password.

Clicca qui per resettare la password: ${resetUrl}

Questo link è valido per 1 ora.

Se non hai richiesto tu questo reset, ignora questa email.

© 2025 Tassa Soggiorno Calculator
    `
  };
};

// Funzione per inviare email di benvenuto
const sendWelcomeEmail = async (email, nome, loginUrl) => {
  try {
    const emailContent = getWelcomeEmailTemplate(nome, email, loginUrl);

    await transporter.sendMail({
      from: `"Tassa Soggiorno Calculator" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });

    console.log(`✅ Email di benvenuto inviata a ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Errore invio email di benvenuto:', error);
    return { success: false, error: error.message };
  }
};

// Funzione per inviare email reset password
const sendResetPasswordEmail = async (email, nome, resetUrl) => {
  try {
    const emailContent = getResetPasswordEmailTemplate(nome, resetUrl);

    await transporter.sendMail({
      from: `"Tassa Soggiorno Calculator" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    });

    console.log(`✅ Email reset password inviata a ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Errore invio email reset password:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendResetPasswordEmail
};
