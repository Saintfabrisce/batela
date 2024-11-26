import { Observable } from '@nativescript/core';
import { firebase } from '@nativescript/firebase';

export class AddChildViewModel extends Observable {
    name: string = '';
    birthDate: Date = new Date();
    medicalInfo: string = '';
    specialNeeds: string = '';
    isLoading: boolean = false;

    constructor() {
        super();
    }

    async onAddChild() {
        if (!this.validateForm()) {
            return;
        }

        this.set('isLoading', true);

        try {
            const user = firebase.auth().currentUser;
            if (!user) throw new Error('Utilisateur non connecté');

            const age = this.calculateAge(this.birthDate);
            
            const childData = {
                name: this.name,
                birthDate: firebase.firestore.Timestamp.fromDate(this.birthDate),
                age,
                medicalInfo: this.medicalInfo,
                specialNeeds: this.specialNeeds,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await firebase.firestore
                .collection('users')
                .doc(user.uid)
                .collection('children')
                .add(childData);

            alert('Enfant ajouté avec succès');
            this.navigateBack();
        } catch (error) {
            console.error('Error adding child:', error);
            alert('Erreur lors de l\'ajout de l\'enfant');
        } finally {
            this.set('isLoading', false);
        }
    }

    private validateForm(): boolean {
        if (!this.name) {
            alert('Veuillez entrer le nom de l\'enfant');
            return false;
        }

        if (this.birthDate > new Date()) {
            alert('La date de naissance ne peut pas être dans le futur');
            return false;
        }

        return true;
    }

    private calculateAge(birthDate: Date): number {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }

    private navigateBack() {
        const frame = require('@nativescript/core').Frame;
        frame.topmost().goBack();
    }
}