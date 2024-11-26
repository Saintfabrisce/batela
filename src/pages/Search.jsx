import React, { useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiMapMarker, mdiStar, mdiCheck } from '@mdi/js';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    experience: '',
    availability: '',
    price: ''
  });

  // Exemple de données de nounous
  const nannies = [
    {
      id: 1,
      name: 'Marie K.',
      photo: '/nanny1.jpg',
      rating: 4.8,
      experience: '5 ans',
      location: 'Brazzaville',
      price: '2000 FCFA/h',
      available: true
    },
    // Ajoutez plus de nounous ici
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Filtres */}
      <div className="md:col-span-1">
        <div className="card p-4">
          <h2 className="font-bold text-lg mb-4">Filtres</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Expérience</label>
              <select 
                className="input-field"
                value={filters.experience}
                onChange={(e) => setFilters({...filters, experience: e.target.value})}
              >
                <option value="">Tous</option>
                <option value="1-3">1-3 ans</option>
                <option value="3-5">3-5 ans</option>
                <option value="5+">5+ ans</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Disponibilité</label>
              <select 
                className="input-field"
                value={filters.availability}
                onChange={(e) => setFilters({...filters, availability: e.target.value})}
              >
                <option value="">Tous</option>
                <option value="full-time">Temps plein</option>
                <option value="part-time">Temps partiel</option>
                <option value="weekends">Weekends</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Prix/heure</label>
              <select 
                className="input-field"
                value={filters.price}
                onChange={(e) => setFilters({...filters, price: e.target.value})}
              >
                <option value="">Tous</option>
                <option value="0-2000">0-2000 FCFA</option>
                <option value="2000-4000">2000-4000 FCFA</option>
                <option value="4000+">4000+ FCFA</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Résultats de recherche */}
      <div className="md:col-span-3">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Rechercher une nounou..."
            className="input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {nannies.map((nanny) => (
            <div key={nanny.id} className="card p-4">
              <div className="flex items-center space-x-4">
                <img 
                  src={nanny.photo} 
                  alt={nanny.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">{nanny.name}</h3>
                    <div className="flex items-center">
                      <Icon path={mdiStar} size={1} className="text-yellow-400" />
                      <span className="ml-1">{nanny.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 mt-1">
                    <Icon path={mdiMapMarker} size={0.8} />
                    <span className="ml-1">{nanny.location}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-[var(--primary-blue)] font-semibold">
                      {nanny.price}
                    </span>
                    <span className="mx-2">•</span>
                    <span>{nanny.experience} d'expérience</span>
                  </div>
                </div>
                <button className="btn-primary">
                  Voir le profil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;