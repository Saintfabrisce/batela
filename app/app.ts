import { Application } from '@nativescript/core';
import { initializeFirebase } from './services/firebase.service';

// Initialize Firebase before starting the app
initializeFirebase()
  .then(() => {
    Application.run({ moduleName: 'app-root' });
  })
  .catch(error => {
    console.error('Error initializing Firebase:', error);
    Application.run({ moduleName: 'app-root' });
  });