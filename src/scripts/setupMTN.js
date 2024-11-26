import { createApiUser, createApiKey } from '../config/mtnMomo.js';

async function setupMTNAPI() {
  try {
    // 1. Créer un utilisateur API
    console.log('Création utilisateur API...');
    const { referenceId } = await createApiUser();
    console.log('User ID créé:', referenceId);

    // 2. Créer une clé API
    console.log('Création clé API...');
    const apiKey = await createApiKey(referenceId);
    console.log('Clé API créée');

    console.log('\nCopiez ces valeurs dans votre .env :');
    console.log(`MTN_USER_ID=${referenceId}`);
    console.log(`MTN_API_KEY=${apiKey}`);
  } catch (error) {
    console.error('Erreur:', error.message);
  }
}

setupMTNAPI();