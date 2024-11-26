import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@mdi/react';
import { mdiMagnify, mdiShieldCheck, mdiHeart } from '@mdi/js';

const Home = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">
          Trouvez la nounou idéale pour vos enfants
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Une communauté de confiance pour la garde d'enfants
        </p>
        <Link to="/search" className="btn-primary text-lg px-8 py-3">
          Commencer la recherche
        </Link>
      </section>

      {/* Features Section */}
      <section className="grid md:grid-cols-3 gap-8">
        <div className="card text-center p-6">
          <Icon path={mdiMagnify} size={2} className="text-[var(--primary-blue)] mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Recherche Simple</h3>
          <p className="text-gray-600">
            Trouvez rapidement des nounous qualifiées dans votre région
          </p>
        </div>

        <div className="card text-center p-6">
          <Icon path={mdiShieldCheck} size={2} className="text-[var(--primary-blue)] mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Vérification Complète</h3>
          <p className="text-gray-600">
            Profils vérifiés et références contrôlées pour votre tranquillité
          </p>
        </div>

        <div className="card text-center p-6">
          <Icon path={mdiHeart} size={2} className="text-[var(--primary-blue)] mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Service Personnalisé</h3>
          <p className="text-gray-600">
            Des nounous qui s'adaptent à vos besoins spécifiques
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--primary-blue)] text-white rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-4">
          Prêt à trouver la nounou parfaite ?
        </h2>
        <p className="text-xl mb-8">
          Inscrivez-vous maintenant et commencez votre recherche
        </p>
        <Link to="/subscription" className="btn-secondary bg-white text-[var(--primary-blue)] text-lg px-8 py-3">
          Voir les abonnements
        </Link>
      </section>
    </div>
  );
};

export default Home;