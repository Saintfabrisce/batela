import { Observable } from '@nativescript/core';
import { Camera, ImageAsset } from '@nativescript/camera';
import { signUp } from '../../services/firebase.service';

export class SignupViewModel extends Observable {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  fullName: string = '';
  phone: string = '';
  userTypeIndex: number = 0;
  profileImage: ImageAsset | null = null;
  isLoading: boolean = false;

  constructor() {
    super();
  }

  get isNanny(): boolean {
    return this.userTypeIndex === 1;
  }

  async onTakePhoto() {
    try {
      const camera = new Camera();
      const options = {
        width: 300,
        height: 300,
        keepAspectRatio: true,
        saveToGallery: false
      };

      const imageAsset = await camera.takePicture(options);
      this.set('profileImage', imageAsset);
    } catch (error) {
      console.error('Error taking photo:', error);
      alert('Erreur lors de la prise de photo');
    }
  }

  async onSignup() {
    if (this.validateForm()) {
      this.set('isLoading', true);

      try {
        const userType = this.userTypeIndex === 0 ? 'family' : 'nanny';
        const user = await signUp(this.email, this.password, userType);
        
        // Upload profile image if it exists (for nannies)
        if (this.isNanny && this.profileImage) {
          await this.uploadProfileImage(user.uid);
        }

        // Navigate to appropriate dashboard
        const targetPage = userType === 'nanny' ? 'views/nanny/dashboard' : 'views/family/dashboard';
        this.navigateTo(targetPage);
      } catch (error) {
        alert('Erreur lors de l\'inscription: ' + error.message);
      } finally {
        this.set('isLoading', false);
      }
    }
  }

  private validateForm(): boolean {
    if (!this.email || !this.password || !this.confirmPassword || !this.fullName || !this.phone) {
      alert('Veuillez remplir tous les champs');
      return false;
    }

    if (this.password !== this.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return false;
    }

    if (this.isNanny && !this.profileImage) {
      alert('Une photo de profil est requise pour les nounous');
      return false;
    }

    return true;
  }

  private async uploadProfileImage(userId: string): Promise<void> {
    // Implementation of image upload to Firebase Storage
    // This will be implemented when we add Firebase Storage configuration
  }

  onNavigateToLogin() {
    this.navigateTo('views/auth/login-page');
  }

  private navigateTo(page: string) {
    const frame = require('@nativescript/core').Frame;
    frame.topmost().navigate({
      moduleName: page,
      clearHistory: true
    });
  }
}