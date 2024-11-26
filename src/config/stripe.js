import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16'
});

export const createPaymentIntent = async (amount, currency = 'XAF') => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Conversion en centimes
      currency,
      payment_method_types: ['card'],
      metadata: {
        integration_check: 'accept_a_payment',
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    };
  } catch (error) {
    throw new Error(`Erreur Stripe: ${error.message}`);
  }
};

export const confirmPayment = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    throw new Error(`Erreur confirmation: ${error.message}`);
  }
};