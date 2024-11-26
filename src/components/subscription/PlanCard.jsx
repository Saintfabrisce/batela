import React from 'react';
import { Icon } from '@mdi/react';
import { mdiCheck } from '@mdi/js';

const PlanCard = ({ plan, isActive, onSelect }) => {
  const { name, price, features } = plan;

  return (
    <div className={`card hover-scale ${isActive ? 'border-2 border-[var(--primary-blue)]' : ''}`}>
      <h3 className="text-xl font-bold mb-4 text-center capitalize">{name}</h3>
      <div className="text-center mb-6">
        <span className="text-3xl font-bold">{price.toLocaleString()} FCFA</span>
        <span className="text-gray-500">/mois</span>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Icon path={mdiCheck} size={1} className="text-[var(--primary-blue)] mr-2" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <button 
        onClick={() => onSelect(plan)}
        className={`w-full ${isActive ? 'btn-primary' : 'btn-secondary'}`}
      >
        {isActive ? 'Plan actuel' : 'Choisir ce plan'}
      </button>
    </div>
  );
};

export default PlanCard;