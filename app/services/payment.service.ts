import { firebase } from '@nativescript/firebase';
import { Stripe } from 'nativescript-stripe';

export class PaymentService {
    private stripe: Stripe;

    constructor() {
        this.stripe = new Stripe('YOUR_STRIPE_PUBLISHABLE_KEY');
    }

    async processMobileMoneyPayment(amount: number, provider: 'MTN' | 'Airtel', phoneNumber: string) {
        try {
            // Simuler une requête à l'API de paiement mobile
            const paymentIntent = await firebase.functions().httpsCallable('createMobileMoneyPayment')({
                amount,
                provider,
                phoneNumber
            });

            return paymentIntent;
        } catch (error) {
            throw new Error(`Erreur de paiement: ${error.message}`);
        }
    }

    async processCardPayment(amount: number, cardToken: string) {
        try {
            const paymentIntent = await this.stripe.createPaymentIntent({
                amount,
                currency: 'XAF',
                payment_method_types: ['card']
            });

            const confirmedPayment = await this.stripe.confirmPayment(paymentIntent.client_secret, {
                payment_method: cardToken
            });

            return confirmedPayment;
        } catch (error) {
            throw new Error(`Erreur de paiement par carte: ${error.message}`);
        }
    }

    async createPaymentIntent(bookingId: string, amount: number) {
        try {
            const paymentIntent = await firebase.functions().httpsCallable('createPaymentIntent')({
                bookingId,
                amount
            });

            return paymentIntent;
        } catch (error) {
            throw new Error(`Erreur lors de la création du paiement: ${error.message}`);
        }
    }
}