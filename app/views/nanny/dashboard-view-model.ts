import { Observable } from '@nativescript/core';
import { firebase } from '@nativescript/firebase';

export class NannyDashboardViewModel extends Observable {
    fullName: string = '';
    phone: string = '';
    hourlyRate: number = 0;
    isAvailable: boolean = false;
    profileImage: string = '';
    selectedTabIndex: number = 0;
    
    reservations: any[] = [];
    availabilities: any[] = [];

    constructor() {
        super();
        this.loadUserData();
        this.loadReservations();
        this.initializeAvailabilities();
    }

    private async loadUserData() {
        try {
            const user = firebase.auth().currentUser;
            if (user) {
                const userDoc = await firebase.firestore
                    .collection('users')
                    .doc(user.uid)
                    .get();
                
                const userData = userDoc.data();
                this.set('fullName', userData.fullName);
                this.set('phone', userData.phone);
                this.set('hourlyRate', userData.hourlyRate);
                this.set('isAvailable', userData.isAvailable);
                this.set('profileImage', userData.profileImage);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    private async loadReservations() {
        try {
            const user = firebase.auth().currentUser;
            if (user) {
                const reservationsSnapshot = await firebase.firestore
                    .collection('reservations')
                    .where('nannyId', '==', user.uid)
                    .orderBy('date', 'desc')
                    .get();

                const reservations = reservationsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    statusClass: this.getStatusClass(doc.data().status)
                }));

                this.set('reservations', reservations);
            }
        } catch (error) {
            console.error('Error loading reservations:', error);
        }
    }

    private getStatusClass(status: string): string {
        switch (status) {
            case 'confirmed': return 'text-green-500';
            case 'pending': return 'text-yellow-500';
            case 'cancelled': return 'text-red-500';
            default: return '';
        }
    }

    private initializeAvailabilities() {
        const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
        this.set('availabilities', days.map(day => ({
            day,
            isAvailable: false
        })));
    }

    async onUpdateProfile() {
        try {
            const user = firebase.auth().currentUser;
            if (user) {
                await firebase.firestore
                    .collection('users')
                    .doc(user.uid)
                    .update({
                        fullName: this.fullName,
                        phone: this.phone,
                        hourlyRate: this.hourlyRate
                    });
                alert('Profil mis à jour avec succès');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Erreur lors de la mise à jour du profil');
        }
    }

    async onLogout() {
        try {
            await firebase.auth().signOut();
            this.navigateTo('views/auth/login-page');
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Erreur lors de la déconnexion');
        }
    }

    private navigateTo(page: string) {
        const frame = require('@nativescript/core').Frame;
        frame.topmost().navigate({
            moduleName: page,
            clearHistory: true
        });
    }
}