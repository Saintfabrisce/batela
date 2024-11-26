import { Observable } from '@nativescript/core';
import { signIn } from '../../services/firebase.service';

export class LoginViewModel extends Observable {
  email: string = '';
  password: string = '';
  isLoading: boolean = false;

  constructor() {
    super();
  }

  async onLogin() {
    if (!this.email || !this.password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    this.set('isLoading', true);

    try {
      const user = await signIn(this.email, this.password);
      // Navigate to appropriate dashboard based on user type
      const userType = await this.getUserType(user.uid);
      const targetPage = userType === 'nanny' ? 'views/nanny/dashboard' : 'views/family/dashboard';
      this.navigateTo(targetPage);
    } catch (error) {
      alert('Erreur de connexion: ' + error.message);
    } finally {
      this.set('isLoading', false);
    }
  }

  onNavigateToSignup() {
    this.navigateTo('views/auth/signup-page');
  }

  private async getUserType(uid: string): Promise<'family' | 'nanny'> {
    const userDoc = await firebase.firestore.collection('users').doc(uid).get();
    return userDoc.data().userType;
  }

  private navigateTo(page: string) {
    const frame = require('@nativescript/core').Frame;
    frame.topmost().navigate({
      moduleName: page,
      clearHistory: true
    });
  }
}