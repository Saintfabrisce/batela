import { firebase } from '@nativescript/firebase';
import { LocalNotifications } from '@nativescript/local-notifications';
import { PushNotifications } from '@nativescript/push-notifications';

export class NotificationService {
    private static instance: NotificationService;

    private constructor() {
        this.initializePushNotifications();
    }

    static getInstance(): NotificationService {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }

    private async initializePushNotifications() {
        try {
            const pushToken = await PushNotifications.register();
            
            if (firebase.auth().currentUser) {
                await this.updateUserPushToken(pushToken);
            }

            PushNotifications.addOnMessageReceivedCallback((message) => {
                this.handlePushNotification(message);
            });
        } catch (error) {
            console.error('Error initializing push notifications:', error);
        }
    }

    private async updateUserPushToken(token: string) {
        const user = firebase.auth().currentUser;
        if (user) {
            await firebase.firestore
                .collection('users')
                .doc(user.uid)
                .update({
                    pushToken: token,
                    lastTokenUpdate: firebase.firestore.FieldValue.serverTimestamp()
                });
        }
    }

    private handlePushNotification(message: any) {
        // Afficher la notification locale même si l'app est en premier plan
        LocalNotifications.schedule([{
            id: Date.now(),
            title: message.title,
            body: message.body,
            sound: true,
            badge: 1
        }]);
    }

    async sendBookingNotification(bookingId: string, recipientId: string, type: 'new' | 'accepted' | 'rejected' | 'cancelled') {
        try {
            await firebase.functions().httpsCallable('sendBookingNotification')({
                bookingId,
                recipientId,
                type
            });
        } catch (error) {
            console.error('Error sending booking notification:', error);
        }
    }

    async scheduleBookingReminder(booking: any) {
        const reminderTime = new Date(booking.date.toDate());
        reminderTime.setHours(reminderTime.getHours() - 1);

        await LocalNotifications.schedule([{
            id: parseInt(booking.id, 16),
            title: 'Rappel de garde d\'enfants',
            body: `Vous avez une séance de garde dans 1 heure`,
            at: reminderTime,
            sound: true,
            badge: 1
        }]);
    }

    async sendPaymentNotification(bookingId: string, recipientId: string, status: 'success' | 'failed') {
        try {
            await firebase.functions().httpsCallable('sendPaymentNotification')({
                bookingId,
                recipientId,
                status
            });
        } catch (error) {
            console.error('Error sending payment notification:', error);
        }
    }

    async sendEmergencyAlert(userId: string, location: { latitude: number; longitude: number }) {
        try {
            await firebase.functions().httpsCallable('sendEmergencyAlert')({
                userId,
                location
            });
        } catch (error) {
            console.error('Error sending emergency alert:', error);
        }
    }
}