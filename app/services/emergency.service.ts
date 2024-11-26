import { firebase } from '@nativescript/firebase';
import { Geolocation } from '@nativescript/geolocation';
import { NotificationService } from './notification.service';

export class EmergencyService {
    private static instance: EmergencyService;
    private notificationService: NotificationService;

    private constructor() {
        this.notificationService = NotificationService.getInstance();
    }

    static getInstance(): EmergencyService {
        if (!EmergencyService.instance) {
            EmergencyService.instance = new EmergencyService();
        }
        return EmergencyService.instance;
    }

    async triggerEmergencyAlert() {
        try {
            const user = firebase.auth().currentUser;
            if (!user) throw new Error('Utilisateur non connecté');

            // Obtenir la position actuelle
            const location = await Geolocation.getCurrentLocation({
                desiredAccuracy: 3,
                maximumAge: 5000,
                timeout: 10000
            });

            // Créer une alerte d'urgence
            const emergencyData = {
                userId: user.uid,
                location: {
                    latitude: location.latitude,
                    longitude: location.longitude
                },
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            };

            const emergencyRef = await firebase.firestore
                .collection('emergencies')
                .add(emergencyData);

            // Envoyer des notifications
            await this.notificationService.sendEmergencyAlert(user.uid, {
                latitude: location.latitude,
                longitude: location.longitude
            });

            // Démarrer le suivi de localisation
            this.startLocationTracking(emergencyRef.id);

            return emergencyRef.id;
        } catch (error) {
            console.error('Error triggering emergency alert:', error);
            throw error;
        }
    }

    private startLocationTracking(emergencyId: string) {
        // Mettre à jour la position toutes les 30 secondes
        const watchId = Geolocation.watchLocation(
            async (location) => {
                try {
                    await firebase.firestore
                        .collection('emergencies')
                        .doc(emergencyId)
                        .update({
                            'location.latitude': location.latitude,
                            'location.longitude': location.longitude,
                            lastUpdate: firebase.firestore.FieldValue.serverTimestamp()
                        });
                } catch (error) {
                    console.error('Error updating location:', error);
                }
            },
            (error) => {
                console.error('Error watching location:', error);
            },
            {
                desiredAccuracy: 3,
                updateDistance: 10,
                minimumUpdateTime: 30000 // 30 secondes
            }
        );

        // Arrêter le suivi après 1 heure
        setTimeout(() => {
            Geolocation.clearWatch(watchId);
        }, 3600000);
    }

    async resolveEmergency(emergencyId: string) {
        try {
            await firebase.firestore
                .collection('emergencies')
                .doc(emergencyId)
                .update({
                    status: 'resolved',
                    resolvedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
        } catch (error) {
            console.error('Error resolving emergency:', error);
            throw error;
        }
    }
}