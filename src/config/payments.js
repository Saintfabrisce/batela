import Stripe from 'stripe';
import axios from 'axios';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Configuration MTN Mobile Money
const MTN_API_URL = process.env.MTN_API_URL;
const MTN_API_KEY = process.env.MTN_API_KEY;

// Configuration Airtel Money
const AIRTEL_API_URL = process.env.AIRTEL_API_URL;
const AIRTEL_API_KEY = process.env.AIRTEL_API_KEY;

export const processStripePayment = async (amount, currency, paymentMethod) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethod,
      confirm: true
    });
    return paymentIntent;
  } catch (error) {
    throw new Error(`Erreur de paiement Stripe: ${error.message}`);
  }
};

export const processMTNPayment = async (phoneNumber, amount) => {
  try {
    const response = await axios.post(MTN_API_URL + '/collections', {
      amount,
      currency: 'XAF',
      phoneNumber,
      externalId: Date.now().toString()
    }, {
      headers: {
        'Authorization': `Bearer ${MTN_API_KEY}`,
        'X-Reference-Id': crypto.randomUUID(),
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erreur MTN Mobile Money: ${error.message}`);
  }
};

export const processAirtelPayment = async (phoneNumber, amount) => {
  try {
    const response = await axios.post(AIRTEL_API_URL + '/payments', {
      amount,
      currency: 'XAF',
      phoneNumber,
      reference: Date.now().toString()
    }, {
      headers: {
        'Authorization': `Bearer ${AIRTEL_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(`Erreur Airtel Money: ${error.message}`);
  }
};