import React, { useState } from 'react';
import { Icon } from '@mdi/react';
import { mdiCalendar, mdiClockOutline, mdiMapMarker } from '@mdi/js';

const Bookings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');

  // Exemple de réservations
  const bookings = {
    upcoming: [
      {
        id: 1,
        nanny: 'Marie K.',
        date: '2024-01-15',
        time: '14:00 - 18:00',
        location: 'Brazzaville',
        status: 'confirmed'
      }
    ],
    past: [
      {
        id: 2,
        nanny: 'Sophie M.',
        date: '2023-12-20',
        time: '09:00 - 17:00',
        location: 'Brazzaville',
        status: 'completed'
      }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-500';
      case 'completed':
        return 'text-blue-500';
      case 'cancelled':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mes Réservations</h1>

      {/* Tabs */}
      <div className="flex space-x-4 border-b">
        <button
          className={`pb-2 px-4 ${
            activeTab === 'upcoming'
              ? 'border-b-2 border-[var(--primary-blue)] text-[var(--primary-blue)]'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('upcoming')}
        >
          À venir
        </button>
        <button
          className={`pb-2 px-4 ${
            activeTab === 'past'
              ? 'border-b-2 border-[var(--primary-blue)] text-[var(--primary-blue)]'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('past')}
        >
          Historique
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings[activeTab].map((booking) => (
          <div key={booking.id} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">{booking.nanny}</h3>
              <span className={`font-medium ${getStatusColor(booking.status)}`}>
                {booking.status === 'confirmed' ? 'Confirmé' : 'Terminé'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <Icon path={mdiCalendar} size={1} className="text-gray-400 mr-2" />
                <span>{new Date(booking.date).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center">
                <Icon path={mdiClockOutline} size={1} className="text-gray-400 mr-2" />
                <span>{booking.time}</span>
              </div>

              <div className="flex items-center">
                <Icon path={mdiMapMarker} size={1} className="text-gray-400 mr-2" />
                <span>{booking.location}</span>
              </div>
            </div>

            <div className="mt-4 flex space-x-4">
              {booking.status === 'confirmed' && (
                <>
                  <button className="btn-primary">
                    Modifier
                  </button>
                  <button className="btn-secondary">
                    Annuler
                  </button>
                </>
              )}
              {booking.status === 'completed' && (
                <button className="btn-primary">
                  Laisser un avis
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;