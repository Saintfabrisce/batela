import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendPaymentConfirmation = async (email, payment) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Confirmation de paiement - Batela Connect',
    html: `
      <h1>Merci pour votre paiement</h1>
      <p>Votre paiement de ${payment.amount} FCFA a été confirmé.</p>
      <p>Détails de la transaction:</p>
      <ul>
        <li>ID Transaction: ${payment.transactionId}</li>
        <li>Date: ${new Date(payment.createdAt).toLocaleDateString()}</li>
        <li>Méthode: ${payment.method}</li>
      </ul>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendSubscriptionConfirmation = async (email, subscription) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Confirmation d\'abonnement - Batela Connect',
    html: `
      <h1>Merci pour votre abonnement</h1>
      <p>Votre abonnement ${subscription.name} est maintenant actif.</p>
      <p>Détails:</p>
      <ul>
        <li>Plan: ${subscription.name}</li>
        <li>Début: ${new Date(subscription.startDate).toLocaleDateString()}</li>
        <li>Fin: ${new Date(subscription.endDate).toLocaleDateString()}</li>
      </ul>
    `
  };

  await transporter.sendMail(mailOptions);
};