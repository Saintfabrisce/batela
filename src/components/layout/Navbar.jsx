import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Icon } from '@mdi/react';
import { mdiHome, mdiMagnify, mdiAccount, mdiCalendarCheck, mdiCrown } from '@mdi/js';
import Logo from './Logo';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: mdiHome, label: 'Accueil' },
    { path: '/search', icon: mdiMagnify, label: 'Rechercher' },
    { path: '/bookings', icon: mdiCalendarCheck, label: 'Réservations' },
    { path: '/subscription', icon: mdiCrown, label: 'Abonnement' },
    { path: '/profile', icon: mdiAccount, label: 'Profil' }
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center">
            <Logo className="h-10" />
          </Link>

          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center px-3 py-2 rounded-md text-sm font-medium
                  transition-colors duration-200
                  ${location.pathname === item.path
                    ? 'text-[var(--primary-blue)]'
                    : 'text-gray-500 hover:text-[var(--primary-blue)]'
                  }`}
              >
                <Icon path={item.icon} size={1} />
                <span className="mt-1">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile menu */}
          <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center px-3 py-2 text-xs
                  ${location.pathname === item.path
                    ? 'text-[var(--primary-blue)]'
                    : 'text-gray-500'
                  }`}
              >
                <Icon path={item.icon} size={0.8} />
                <span className="mt-1">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;