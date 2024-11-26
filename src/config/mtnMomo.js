import axios from 'axios';
import crypto from 'crypto';

const config = {
  baseUrl: 'https://sandbox.momodeveloper.mtn.com',
  collectionPrimaryKey: process.env.MTN_COLLECTION_PRIMARY_KEY,
  collectionSecondaryKey: process.env.MTN_COLLECTION_SECONDARY_KEY,
  subscriptionKey: process.env.MTN_SUBSCRIPTION_KEY,
  apiUser: process.env.MTN_API_USER,
  apiKey: process.env.MTN_API_KEY,
  environment: process.env.MTN_ENVIRONMENT,
  callbackHost: process.env.MTN_CALLBACK_HOST
};

// Créer un utilisateur API
export const createApiUser = async () => {
  try {
    const referenceId = crypto.randomUUID();
    const response = await axios({
      method: 'POST',
      url: `${config.baseUrl}/v1_0/apiuser`,
      headers: {
        'X-Reference-Id': referenceId,
        'Ocp-Apim-Subscription-Key': config.subscriptionKey,
        'Content-Type': 'application/json'
      },
      data: {
        providerCallbackHost: config.callbackHost
      }
    });

    return { success: response.status === 201, referenceId };
  } catch (error) {
    throw new Error(`Erreur création utilisateur API: ${error.message}`);
  }
};

// Créer une clé API
export const createApiKey = async (referenceId) => {
  try {
    const response = await axios({
      method: 'POST',
      url: `${config.baseUrl}/v1_0/apiuser/${referenceId}/apikey`,
      headers: {
        'Ocp-Apim-Subscription-Key': config.subscriptionKey
      }
    });

    return response.data.apiKey;
  } catch (error) {
    throw new Error(`Erreur création clé API: ${error.message}`);
  }
};

// Obtenir un token d'accès
export const getAccessToken = async () => {
  try {
    const auth = Buffer.from(`${config.apiUser}:${config.apiKey}`).toString('base64');
    const response = await axios({
      method: 'POST',
      url: `${config.baseUrl}/collection/token/`,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Ocp-Apim-Subscription-Key': config.subscriptionKey,
        'X-Target-Environment': config.environment
      }
    });

    return response.data.access_token;
  } catch (error) {
    throw new Error(`Erreur token: ${error.response?.data?.message || error.message}`);
  }
};

// Demander un paiement
export const requestPayment = async (phoneNumber, amount) => {
  try {
    const accessToken = await getAccessToken();
    const referenceId = crypto.randomUUID();
    
    const response = await axios({
      method: 'POST',
      url: `${config.baseUrl}/collection/v1_0/requesttopay`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Reference-Id': referenceId,
        'X-Target-Environment': config.environment,
        'Ocp-Apim-Subscription-Key': config.subscriptionKey,
        'Content-Type': 'application/json'
      },
      data: {
        amount: amount.toString(),
        currency: 'XAF',
        externalId: Date.now().toString(),
        payer: {
          partyIdType: 'MSISDN',
          partyId: phoneNumber.replace('+', '')
        },
        payerMessage: 'Paiement Batela Connect',
        payeeNote: 'Paiement service'
      }
    });

    return { success: response.status === 202, referenceId };
  } catch (error) {
    throw new Error(`Erreur paiement: ${error.response?.data?.message || error.message}`);
  }
};

// Vérifier le statut d'un paiement
export const checkPaymentStatus = async (referenceId) => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      method: 'GET',
      url: `${config.baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Target-Environment': config.environment,
        'Ocp-Apim-Subscription-Key': config.subscriptionKey
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(`Erreur statut: ${error.response?.data?.message || error.message}`);
  }
};