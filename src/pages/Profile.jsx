import React, { useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiEmail, mdiPhone, mdiMapMarker, mdiCreditCard } from '@mdi/js';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+242 068668982',
    address: 'Brazzaville, Congo',
    subscription: 'Premium'
  });

  const handleChange = (field) => (event) => {
    setUserData({
      ...userData,
      [field]: event.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    console.log('Profile update:', userData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Informations principales */}
      <div className="md:col-span-2">
        <form onSubmit={handleSubmit} className="card p-6">
          <h2 className="text-2xl font-bold mb-6">Mon Profil</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nom complet</label>
              <input 
                type="text" 
                className="input-field"
                value={userData.name}
                onChange={handleChange('name')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="flex items-center">
                <Icon path={mdiEmail} size={1} className="text-gray-400 mr-2" />
                <input 
                  type="email" 
                  className="input-field"
                  value={userData.email}
                  onChange={handleChange('email')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Téléphone</label>
              <div className="flex items-center">
                <Icon path={mdiPhone} size={1} className="text-gray-400 mr-2" />
                <input 
                  type="tel" 
                  className="input-field"
                  value={userData.phone}
                  onChange={handleChange('phone')}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Adresse</label>
              <div className="flex items-center">
                <Icon path={mdiMapMarker} size={1} className="text-gray-400 mr-2" />
                <input 
                  type="text" 
                  className="input-field"
                  value={userData.address}
                  onChange={handleChange('address')}
                />
              </div>
            </div>

            <button type="submit" className="btn-primary">
              Mettre à jour le profil
            </button>
          </div>
        </form>
      </div>

      {/* Sidebar */}
      <div className="md:col-span-1 space-y-6">
        {/* Abonnement */}
        <div className="card p-6">
          <h3 className="font-bold mb-4">Abonnement actuel</h3>
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">{userData.subscription}</span>
            <Icon path={mdiCreditCard} size={1} className="text-[var(--primary-blue)]" />
          </div>
          <button className="btn-secondary w-full">
            Gérer l'abonnement
          </button>
        </div>

        {/* Sécurité */}
        <div className="card p-6">
          <h3 className="font-bold mb-4">Sécurité</h3>
          <button className="btn-secondary w-full mb-3">
            Changer le mot de passe
          </button>
          <button className="text-red-500 w-full">
            Supprimer le compte
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;