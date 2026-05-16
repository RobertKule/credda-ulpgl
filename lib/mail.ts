import nodemailer from 'nodemailer';

if (!process.env.BREVO_SMTP_USER || !process.env.BREVO_SMTP_KEY) {
  console.error("⚠️ Les identifiants SMTP Brevo sont manquants dans le fichier d'environnement.");
}

export const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST || 'smtp-relay.brevo.com',
  port: parseInt(process.env.BREVO_SMTP_PORT || '587', 10),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY,
  },
});

export const getMailSender = () => {
  return process.env.BREVO_FROM_EMAIL || "contact@credda-ulpgl.org";
};
