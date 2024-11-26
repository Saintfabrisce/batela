import dotenv from 'dotenv';
import axios from 'axios';
import crypto from 'crypto';

dotenv.config();

const config = {
  baseUrl: 'https://sandbox.momodeveloper.mtn.com',
  subscriptionKey: process.env.MTN_SUBSCRIPTION_KEY,
  apiUser: process.env.MTN_API_USER,
  apiKey: process.env.MTN_API_KEY
};

async function getAccessToken() {
  try {
    const auth = Buffer.from(`${config.apiUser}:${config.apiKey}`).toString('base64');
    const response = await axios({
      method: 'POST',
      url: `${config.baseUrl}/collection/token/`,
      headers: {
        'Authorization': `Basic ${auth}`,
        'Ocp-Apim-Subscription-Key': config.subscriptionKey,
        'X-Target-Environment': 'sandbox'
      }
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Erreur token:', error.response?.data || error.message);
    throw error;
  }
}

async function requestPayment(phoneNumber, amount) {
  try {
    const accessToken = await getAccessToken();
    const referenceId = crypto.randomUUID();
    
    console.log('Token obtenu, envoi de la demande de paiement...');
    
    const response = await axios({
      method: 'POST',
      url: `${config.baseUrl}/collection/v1_0/requesttopay`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Reference-Id': referenceId,
        'X-Target-Environment': 'sandbox',
        'Ocp-Apim-Subscription-Key': config.subscriptionKey,
        'Content-Type': 'application/json'
      },
      data: {
        amount: amount.toString(),
        currency: 'EUR',
        externalId: Date.now().toString(),
        payer: {
          partyIdType: 'MSISDN',
          partyId: phoneNumber
        },
        payerMessage: 'Test paiement Batela Connect',
        payeeNote: 'Test API'
      }
    });

    return { success: response.status === 202, referenceId };
  } catch (error) {
    console.error('Erreur paiement:', error.response?.data || error.message);
    throw error;
  }
}

async function checkPaymentStatus(referenceId) {
  try {
    const accessToken = await getAccessToken();
    const response = await axios({
      method: 'GET',
      url: `${config.baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-Target-Environment': 'sandbox',
        'Ocp-Apim-Subscription-Key': config.subscriptionKey
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erreur vérification:', error.response?.data || error.message);
    throw error;
  }
}

async function testPayment() {
  try {
    console.log('Démarrage du test de paiement...');
    
    const phoneNumber = '68668982';
    const amount = 100;
    
    console.log(`Demande de paiement: ${amount} FCFA au ${phoneNumber}`);
    const { success, referenceId } = await requestPayment(phoneNumber, amount);

    if (success) {
      console.log('Demande envoyée avec succès');
      console.log('Reference ID:', referenceId);
      console.log('\nVérification du statut...');
      
      // Vérifier le statut toutes les 10 secondes pendant 2 minutes
      for (let i = 0; i < 12; i++) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        const status = await checkPaymentStatus(referenceId);
        console.log(`Statut (${i + 1}/12):`, status.status);
        
        if (status.status === 'SUCCESSFUL') {
          console.log('\nPaiement réussi!');
          break;
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors du test:', error.message);
  }
}

testPayment();