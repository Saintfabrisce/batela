import { Observable } from '@nativescript/core';
import { firebase } from '@nativescript/firebase';
import { Geolocation } from '@nativescript/geolocation';

export class FamilyDashboardViewModel extends Observable {
    fullName: string = '';
    phone: string = '';
    address: string = '';
    searchQuery: string = '';
    selectedTabIndex: number = 0;
    
    nannies: any[] = [];
    bookings: any[] = [];
    children: any[] = [];
    
    private userLocation: { latitude: number; longitude: number } | null = null;

    constructor() {
        super();
        this.loadUserData();
        this.loadBookings();
        this.loadChildren();
        this.initializeGeolocation();
    }

    private async initializeGeolocation() {
        try {
            const isEnabled = await Geolocation.isEnabled();
            if (!isEnabled) {
                await Geolocation.enableLocationRequest();
            }
            
            const location = await Geolocation.getCurrentLocation({
                desiredAccuracy: 3,
                maximumAge: 5000,
                timeout: 10000
            });
            
            this.userLocation = {
                latitude: location.latitude,
                longitude: location.longitude
            };
            
            this.loadNearbyNannies();
        } catch (error) {
            console.error('Error getting location:', error);
        }
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
                this.set('address', userData.address);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        }
    }

    private async loadNearbyNannies() {
        if (!this.userLocation) return;

        try {
            const nanniesSnapshot = await firebase.firestore
                .collection('users')
                .where('userType', '==', 'nanny')
                .where('isAvailable', '==', true)
                .get();

            const nannies = await Promise.all(nanniesSnapshot.docs.map(async doc => {
                const nannyData = doc.data();
                const distance = this.calculateDistance(
                    this.userLocation!.latitude,
                    this.userLocation!.longitude,
                    nannyData.location.latitude,
                    nannyData.location.longitude
                );

                return {
                    id: doc.id,
                    ...nannyData,
                    distance: Math.round(distance * 10) / 10
                };
            }));

            this.set('nannies', nannies.sort((a, b) => a.distance - b.distance));
        } catch (error) {
            console.error('Error loading nannies:', error);
        }
    }

    private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371; // Rayon de la Terre en km
        const dLat = this.deg2rad(lat2 - lat1);
        const dLon = this.deg2rad(lon2 - lon1);
        const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    }

    private deg2rad(deg: number): number {
        return deg * (Math.PI/180);
    }

    private async loadBookings() {
        try {
            const user = firebase.auth().currentUser;
            if (user) {
                const bookingsSnapshot = await firebase.firestore
                    .collection('bookings')
                    .where('familyId', '==', user.uid)
                    .orderBy('date', 'desc')
                    .get();

                const bookings = bookingsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    statusClass: this.getStatusClass(doc.data().status)
                }));

                this.set('bookings', bookings);
            }
        } catch (error) {
            console.error('Error loading bookings:', error);
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
                    ...doc.data()
                }));

                this.set('children', children);
            }
        } catch (error) {
            console.error('Error loading children:', error);
        }
    }

    async onBookNanny(args: any) {
        const nanny = args.object.bindingContext;
        // Navigation vers la page de réservation avec les détails de la nounou
        const frame = require('@nativescript/core').Frame;
        frame.topmost().navigate({
            moduleName: 'views/family/booking-page',
            context: { nannyId: nanny.id }
        });
    }

    async onCancelBooking(args: any) {
        const booking = args.object.bindingContext;
        try {
            await firebase.firestore
                .collection('bookings')
                .doc(booking.id)
                .update({
                    status: 'cancelled',
                    cancelledAt: firebase.firestore.FieldValue.serverTimestamp()
                });
            
            await this.loadBookings();
            alert('Réservation annulée avec succès');
        } catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Erreur lors de l\'annulation');
        }
    }

    async onAddChild() {
        // Navigation vers la page d'ajout d'enfant
        const frame = require('@nativescript/core').Frame;
        frame.topmost().navigate({
            moduleName: 'views/family/add-child-page'
        });
    }

    async onRemoveChild(args: any) {
        const child = args.object.bindingContext;
        try {
            const user = firebase.auth().currentUser;
            if (user) {
                await firebase.firestore
                    .collection('users')
                    .doc(user.uid)
                    .collection('children')
                    .doc(child.id)
                    .delete();
                
                await this.loadChildren();
            }
        } catch (error) {
            console.error('Error removing child:', error);
            alert('Erreur lors de la suppression');
        }
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
                        address: this.address
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