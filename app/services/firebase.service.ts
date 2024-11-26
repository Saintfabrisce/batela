import { firebase } from '@nativescript/firebase';

export async function initializeFirebase() {
  try {
    await firebase.init({
      persist: true,
      showNotifications: true,
      showNotificationsWhenInForeground: true,
    });
    return true;
  } catch (error) {
    console.error('Firebase init error:', error);
    return false;
  }
}

export async function signIn(email: string, password: string) {
  try {
    const user = await firebase.login({
      type: firebase.LoginType.PASSWORD,
      passwordOptions: {
        email,
        password
      }
    });
    return user;
  } catch (error) {
    throw error;
  }
}

export async function signUp(email: string, password: string, userType: 'family' | 'nanny') {
  try {
    const user = await firebase.createUser({
      email,
      password
    });
    
    // Create user profile in Firestore
    await firebase.firestore.collection('users').doc(user.uid).set({
      email,
      userType,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      isVerified: false
    });
    
    return user;
  } catch (error) {
    throw error;
  }
}