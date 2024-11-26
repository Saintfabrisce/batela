import { 
  processStripePayment, 
  processMTNPayment, 
  processAirtelPayment 
} from '../config/payments.js';
import { systemLog } from '../services/logService.js';

export const processPayment = async (req, res) => {
  try {
    const { method, amount, phoneNumber, cardDetails } = req.body;
    let paymentResult;

    switch (method) {
      case 'card':
        paymentResult = await processStripePayment(
          amount * 100, // Stripe utilise les centimes
          'XAF',
          cardDetails
        );
        break;

      case 'mtn':
        paymentResult = await processMTNPayment(phoneNumber, amount);
        break;

      case 'airtel':
        paymentResult = await processAirtelPayment(phoneNumber, amount);
        break;

      default:
        throw new Error('Méthode de paiement non supportée');
    }

    await systemLog.info('Paiement réussi', {
      userId: req.user.id,
      amount,
      method,
      transactionId: paymentResult.id
    });

    res.json({
      success: true,
      transactionId: paymentResult.id,
      message: 'Paiement traité avec succès'
    });

  } catch (error) {
    await systemLog.error('Erreur de paiement', {
      userId: req.user.id,
      error: error.message
    });

    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(payments);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};