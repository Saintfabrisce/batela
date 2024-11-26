import React from 'react';
import { Icon } from '@mdi/react';
import { mdiClockOutline, mdiCheckCircle, mdiAlertCircle } from '@mdi/js';

const SubscriptionStatus = ({ subscription }) => {
  const getStatusIcon = () => {
    switch (subscription.status) {
      case 'active':
        return mdiCheckCircle;
      case 'expired':
        return mdiAlertCircle;
      default:
        return mdiClockOutline;
    }
  };

  const getStatusColor = () => {
    switch (subscription.status) {
      case 'active':
        return 'text-green-500';
      case 'expired':
        return 'text-red-500';
      default:
        return 'text-yellow-500';
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Statut de l'abonnement</h3>
        <Icon 
          path={getStatusIcon()} 
          size={1} 
          className={getStatusColor()}
        />
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Plan actuel</p>
          <p className="font-semibold capitalize">{subscription.name}</p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Date de fin</p>
          <p className="font-semibold">
            {new Date(subscription.endDate).toLocaleDateString()}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Dernier paiement</p>
          <p className="font-semibold">
            {subscription.paymentHistory[0]?.amount.toLocaleString()} FCFA
          </p>
        </div>
      </div>

      {subscription.status === 'expired' && (
        <button className="btn-primary w-full mt-6">
          Renouveler l'abonnement
        </button>
      )}
    </div>
  );
};

export default SubscriptionStatus;