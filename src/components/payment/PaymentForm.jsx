import React, { useState } from 'react';
import PaymentMethodSelector from './PaymentMethodSelector';

const PaymentForm = ({ amount, onSubmit }) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      method: paymentMethod,
      phoneNumber,
      cardDetails
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4">Méthode de paiement</h2>
        <PaymentMethodSelector
          selectedMethod={paymentMethod}
          onSelect={setPaymentMethod}
        />
      </div>

      {(paymentMethod === 'mtn' || paymentMethod === 'airtel') && (
        <div>
          <label className="block text-sm font-medium mb-2">
            Numéro de téléphone
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Ex: 066123456"
            className="input-field"
            required
          />
        </div>
      )}

      {paymentMethod === 'card' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Numéro de carte
            </label>
            <input
              type="text"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
              placeholder="1234 5678 9012 3456"
              className="input-field"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Date d'expiration
              </label>
              <input
                type="text"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                placeholder="MM/AA"
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                CVC
              </label>
              <input
                type="text"
                value={cardDetails.cvc}
                onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                placeholder="123"
                className="input-field"
                required
              />
            </div>
          </div>
        </div>
      )}

      <div className="pt-4">
        <button type="submit" className="btn-primary w-full">
          Payer {amount.toLocaleString()} FCFA
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;