import React, { useState, useEffect } from 'react';
import PlanCard from '../components/subscription/PlanCard';
import PaymentForm from '../components/payment/PaymentForm';

const SubscriptionPage = () => {
  const [plans, setPlans] = useState([
    {
      id: 'basic',
      name: 'Basic',
      price: 5000,
      features: [
        'Accès aux profils de base',
        '5 contacts par mois',
        'Support par email'
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 15000,
      features: [
        'Accès aux profils détaillés',
        'Contacts illimités',
        'Support prioritaire',
        'Vérification avancée'
      ]
    },
    {
      id: 'business',
      name: 'Business',
      price: 30000,
      features: [
        'Tout du plan Premium',
        'Gestion multi-comptes',
        'API access',
        'Support dédié 24/7'
      ]
    }
  ]);

  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPayment, setShowPayment] = useState(false);

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const handlePayment = async (paymentDetails) => {
    try {
      // Logique de paiement à implémenter
      console.log('Processing payment:', paymentDetails);
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Choisissez votre abonnement
      </h1>

      {!showPayment ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isActive={selectedPlan?.id === plan.id}
              onSelect={handlePlanSelect}
            />
          ))}
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setShowPayment(false)}
            className="text-[var(--primary-blue)] mb-4"
          >
            ← Retour aux plans
          </button>
          <PaymentForm
            amount={selectedPlan.price}
            onSubmit={handlePayment}
          />
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;