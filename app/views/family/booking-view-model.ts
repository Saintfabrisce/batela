import { Observable } from '@nativescript/core';
import { firebase } from '@nativescript/firebase';
import { LocalNotifications } from '@nativescript/local-notifications';

export class BookingViewModel extends Observable {
    nanny: any = null;
    date: Date = new Date();
    time: Date = new Date();
    duration: number = 2;
    specialInstructions: string = '';
    children: any[] = [];
    isLoading: boolean = false;
    paymentMethods: string[] = ['MTN Mobile Money', 'Airtel Money', 'Espèces'];
    selectedPaymentMethodIndex: number = 0;

    constructor(private nannyId: string) {
        super();
        this.loadNannyData();
        this.loadChildren();
        this.setupNotifications();
    }

    get totalAmount(): number {
        return this.duration * (this.nanny?.hourlyRate || 0);
    }

    private async setupNotifications() {
        const hasPermission = await LocalNotifications.requestPermission();
        if (!hasPermission) {
            console.log('Notifications permission denied');
        }
    }

    private async loadNannyData() {
        try {
            const nannyDoc = await firebase.firestore
                .collection('users')
                .doc(this.nannyId)
                .get();
            
            this.set('nanny', { id: nannyDoc.id, ...nannyDoc.data() });
        } catch (error) {
            console.error('Error loading nanny data:', error);
            alert('Erreur lors du chargement des données de la nounou');
        }
    }

    private async loadChildren() {
        try {
            const user = firebase.auth().currentUser;
            if (user) {
                const childrenSnapshot = await firebase.firestore
                    .collection('users')
                    .doc(user.uid)
                    .collection('children')
                    .get();

                const children = childrenSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    isSelected: false
                }));

                this.set('children', children);
            }
        } catch (error) {
            console.error('Error loading children:', error);
        }
    }

    async onConfirmBooking() {
        if (!this.validateBooking()) {
            return;
        }

        this.set('isLoading', true);

        try {
            const user = firebase.auth().currentUser;
            if (!user) throw new Error('Utilisateur non connecté');

            const selectedChildren = this.children.filter(child => child.isSelected);
            const bookingDate = new Date(this.date);
            bookingDate.setHours(this.time.getHours(), this.time.getMinutes());

            const booking = {
                nannyId: this.nannyId,
                familyId: user.uid,
                date: firebase.firestore.Timestamp.fromDate(bookingDate),
                duration: this.duration,
                children: selectedChildren.map(child => ({
                    id: child.id,
                    name: child.name,
                    age: child.age
                })),
                specialInstructions: this.specialInstructions,
                status: 'pending',
                totalAmount: this.totalAmount,
                paymentMethod: this.paymentMethods[this.selectedPaymentMethodIndex],
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            const bookingRef = await firebase.firestore
                .collection('bookings')
                .add(booking);

            // Envoyer une notification à la nounou
            await this.sendNotificationToNanny(booking);

            // Planifier une notification locale pour rappel
            await this.scheduleReminder(bookingDate);

            alert('Réservation effectuée avec succès');
            this.navigateBack();
        } catch (error) {
            console.error('Error creating booking:', error);
            alert('Erreur lors de la création de la réservation');
        } finally {
            this.set('isLoading', false);
        }
    }

    private validateBooking(): boolean {
        if (!this.duration || this.duration < 1) {
            alert('Veuillez entrer une durée valide');
            return false;
        }

        const selectedChildren = this.children.filter(child => child.isSelected);
        if (selectedChildren.length === 0) {
            alert('Veuillez sélectionner au moins un enfant');
            return false;
        }

        const bookingDate = new Date(this.date);
        bookingDate.setHours(this.time.getHours(), this.time.getMinutes());
        if (bookingDate < new Date()) {
            alert('La date de réservation doit être dans le futur');
            return false;
        }

        return true;
    }

    private async sendNotificationToNanny(booking: any) {
        // Cette fonction sera implémentée quand nous ajouterons
        // la gestion des notifications push avec Firebase
    }

    private async scheduleReminder(bookingDate: Date) {
        try {
            const reminderDate = new Date(bookingDate);
            reminderDate.setHours(reminderDate.getHours() - 1);

            await LocalNotifications.schedule([{
                id: Date.now(),
                title: 'Rappel de garde d\'enfants',
                body: `Rappel: Vous avez une réservation avec ${this.nanny.fullName} dans 1 heure`,
                at: reminderDate
            }]);
        } catch (error) {
            console.error('Error scheduling reminder:', error);
        }
    }

    private navigateBack() {
        const frame = require('@nativescript/core').Frame;
        frame.topmost().goBack();
    }
}