import React from 'react';
import { useSEO } from '../hooks/useSEO';

const BoutiquePage: React.FC = () => {
  useSEO({
    title: 'Boutique WAY 2026 | Produits Exclusifs - What About You',
    description: 'La boutique officielle WAY 2026 arrive bientôt. Produits exclusifs créés par de jeunes talents camerounais.',
    keywords: 'boutique WAY 2026, produits jeunes talents Cameroun',
    image: 'https://whataboutyou.cm/Store.webp',
    url: 'https://whataboutyou.cm/boutique',
    type: 'website'
  });

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center px-6 max-w-2xl mx-auto">
        <div className="mb-8">
          <img src="/Logo.webp" alt="WAY" className="h-24 mx-auto mb-6" />
        </div>
        <h1 className="font-clash text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 uppercase tracking-tight">
          Coming Soon
        </h1>
        <p className="font-nekst text-gray-400 text-base md:text-lg leading-relaxed mb-10">
          Notre boutique en ligne arrive bientôt. Restez connectés pour découvrir des produits exclusifs créés par de jeunes talents camerounais.
        </p>
        <div className="w-16 h-1 bg-red-600 mx-auto"></div>
      </div>
    </div>
  );
};

export default BoutiquePage;
