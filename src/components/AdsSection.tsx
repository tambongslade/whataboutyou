import React, { useState, useEffect } from 'react';

interface Ad {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
  backgroundColor: string;
}

const AdsSection: React.FC = () => {
  const [currentAd, setCurrentAd] = useState(0);

  const ads: Ad[] = [
    {
      id: 1,
      title: "Découvrez nos créateurs",
      description: "Plus de 5000 jeunes talents vous attendent",
      image: "/way1/DSC_5572.webp",
      link: "/boutique",
      backgroundColor: "bg-gradient-to-r from-orange-500 to-red-500"
    },
    {
      id: 2,
      title: "Rejoignez la communauté",
      description: "Partagez vos créations avec le monde",
      image: "/way 2/EmptyName 243.webp",
      link: "/contact",
      backgroundColor: "bg-gradient-to-r from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "Événements exclusifs",
      description: "Participez à nos festivals créatifs",
      image: "/way 2/EmptyName 390.webp",
      link: "/posts",
      backgroundColor: "bg-gradient-to-r from-blue-500 to-cyan-500"
    }
  ];

  // Auto-rotate ads every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [ads.length]);

  const handleDotClick = (index: number) => {
    setCurrentAd(index);
  };

  const currentAdData = ads[currentAd];

  // Early return if no ads available
  if (!currentAdData || ads.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            NOS PARTENAIRES & PROMOTIONS
          </h2>
          <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
        </div>

        {/* Main Ad Banner */}
        <div className="max-w-6xl mx-auto">
          <div className={`${currentAdData.backgroundColor} rounded-2xl overflow-hidden shadow-2xl transition-all duration-500`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
              {/* Content Side */}
              <div className="flex items-center justify-center p-8 lg:p-12 text-white">
                <div className="text-center lg:text-left">
                  <h3 className="text-4xl lg:text-5xl font-bold mb-6">
                    {currentAdData.title}
                  </h3>
                  <p className="text-xl lg:text-2xl mb-8 text-white/90">
                    {currentAdData.description}
                  </p>
                  <a
                    href={currentAdData.link}
                    className="inline-block bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105"
                  >
                    En savoir plus
                  </a>
                </div>
              </div>

              {/* Image Side */}
              <div className="relative">
                <img
                  src={currentAdData.image}
                  alt={currentAdData.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/600x400/FF6B35/white?text=Advertisement';
                  }}
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {ads.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentAd
                    ? 'bg-red-500 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Secondary Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {/* Ad Card 1 */}
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white text-center hover:scale-105 transition-transform cursor-pointer">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h4 className="text-lg font-bold mb-2">Vente Flash</h4>
            <p className="text-sm opacity-90">-50% sur tous les produits créatifs</p>
          </div>

          {/* Ad Card 2 */}
          <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-xl p-6 text-white text-center hover:scale-105 transition-transform cursor-pointer">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold mb-2">Nouveau Créateur</h4>
            <p className="text-sm opacity-90">Inscription gratuite ce mois-ci</p>
          </div>

          {/* Ad Card 3 */}
          <div className="bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl p-6 text-white text-center hover:scale-105 transition-transform cursor-pointer">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-lg font-bold mb-2">Festival 2024</h4>
            <p className="text-sm opacity-90">Réservez vos places dès maintenant</p>
          </div>
        </div>

        {/* Newsletter Signup Ad */}
        <div className="mt-16 bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Ne ratez aucune opportunité !</h3>
          <p className="text-xl mb-6 text-gray-300">
            Recevez nos offres exclusives et découvrez les nouveaux talents en avant-première
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              S'abonner
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdsSection; 