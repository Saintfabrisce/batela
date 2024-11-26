import { firebase } from '@nativescript/firebase';

export class RatingService {
    async submitRating(bookingId: string, nannyId: string, rating: number, comment: string) {
        try {
            const user = firebase.auth().currentUser;
            if (!user) throw new Error('Utilisateur non connecté');

            const ratingData = {
                bookingId,
                nannyId,
                familyId: user.uid,
                rating,
                comment,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };

            await firebase.firestore
                .collection('ratings')
                .add(ratingData);

            // Mettre à jour la note moyenne de la nounou
            await this.updateNannyAverageRating(nannyId);

            return true;
        } catch (error) {
            console.error('Error submitting rating:', error);
            throw error;
        }
    }

    private async updateNannyAverageRating(nannyId: string) {
        const ratingsSnapshot = await firebase.firestore
            .collection('ratings')
            .where('nannyId', '==', nannyId)
            .get();

        const ratings = ratingsSnapshot.docs.map(doc => doc.data().rating);
        const averageRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;

        await firebase.firestore
            .collection('users')
            .doc(nannyId)
            .update({
                averageRating,
                totalRatings: ratings.length
            });
    }

    async getRatingsForNanny(nannyId: string, limit: number = 10) {
        try {
            const ratingsSnapshot = await firebase.firestore
                .collection('ratings')
                .where('nannyId', '==', nannyId)
                .orderBy('createdAt', 'desc')
                .limit(limit)
                .get();

            return ratingsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error('Error getting ratings:', error);
            throw error;
        }
    }
}