import React from 'react';
import { Icon } from '@mdi/react';
import { mdiCreditCard, mdiCellphone, mdiCheckCircle } from '@mdi/js';

const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
  const paymentMethods = [
    {
      id: 'card',
      name: 'Carte bancaire',
      icon: mdiCreditCard,
      description: 'Paiement sécurisé par carte'
    },
    {
      id: 'mtn',
      name: 'MTN Mobile Money',
      icon: mdiCellphone,
      description: 'Paiement via MTN Mobile Money'
    },
    {
      id: 'airtel',
      name: 'Airtel Money',
      icon: mdiCellphone,
      description: 'Paiement via Airtel Money'
    }
  ];

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <div
          key={method.id}
          onClick={() => onSelect(method.id)}
          className={`card cursor-pointer flex items-center p-4 ${
            selectedMethod === method.id ? 'border-2 border-[var(--primary-blue)]' : ''
          }`}
        >
          <Icon path={method.icon} size={1.5} className="text-[var(--primary-blue)] mr-4" />
          <div className="flex-grow">
            <h3 className="font-semibold">{method.name}</h3>
            <p className="text-sm text-gray-500">{method.description}</p>
          </div>
          {selectedMethod === method.id && (
            <Icon path={mdiCheckCircle} size={1} className="text-[var(--primary-blue)]" />
          )}
        </div>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;