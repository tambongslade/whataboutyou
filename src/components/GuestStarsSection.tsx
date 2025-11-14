import React, { useState } from 'react';

interface GuestStar {
  id: number;
  name: string;
  role: string;
  description: string;
  image: string;
  isHighlighted?: boolean;
}

const GuestStarsSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(2); // Start with highlighted card

  const guestStars: GuestStar[] = [
    {
      id: 1,
      name: "Sarah Wilson",
      role: "Artiste Musicale",
      description: "Chanteuse internationale qui a illuminé notre Festival Créatif 2024 avec ses performances exceptionnelles.",
      image: "/About 1.webp"
    },
    {
      id: 2,
      name: "Maya Johnson",
      role: "Influenceuse Mode",
      description: "Créatrice de contenu reconnue qui a partagé son expertise lors de nos ateliers créatifs.",
      image: "/About 2.webp"
    },
    {
      id: 3,
      name: "Tiana Brown",
      role: "Artiste Performeuse",
      description: "Danseuse et chorégraphe de renommée mondiale, invitée d'honneur de notre Nuit de l'Innovation.",
      image: "/About 3.webp",
      isHighlighted: true
    },
    {
      id: 4,
      name: "Alex Martin",
      role: "Créateur Digital",
      description: "Expert en création numérique qui a animé nos masterclasses sur l'art digital et l'innovation.",
      image: "/About 1.webp"
    },
    {
      id: 5,
      name: "Jordan Smith",
      role: "Producteur Musical",
      description: "Producteur de talents émergents qui découvre les nouveaux artistes lors de nos événements.",
      image: "/About 2.webp"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % guestStars.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + guestStars.length) % guestStars.length);
  };

  // Get visible cards (show 4 cards at a time)
  const getVisibleCards = (): GuestStar[] => {
    const cards: GuestStar[] = [];
    for (let i = 0; i < 4; i++) {
      const index = (currentSlide + i) % guestStars.length;
      const star = guestStars[index];
      if (star) {
        cards.push(star);
      }
    }
    return cards;
  };

  const visibleCards = getVisibleCards();

  // Early return if no guest stars available
  if (guestStars.length === 0) {
    return null;
  }

  return (
    <section className="relative py-16 bg-gray-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/70 z-10"></div>
        <div className="w-full h-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
      </div>

      {/* Content */}
      <div className="relative z-20 container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            {/* Navigation Arrows */}
            <div className="flex space-x-4 mr-8">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border-2 border-white/30 flex items-center justify-center hover:border-white/50 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Title */}
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              GUEST STARS
            </h2>
          </div>

          {/* Description */}
          <p className="text-white/80 max-w-2xl mx-auto leading-relaxed">
            Découvrez les personnalités influentes et les créateurs de contenu qui participent à What About You. 
            Ces leaders d'opinion inspirent notre communauté et partagent leur expertise avec les jeunes entrepreneurs.
          </p>
        </div>

        {/* Follower Count Badge */}
        <div className="absolute top-8 right-8 z-30">
          <div className="bg-yellow-400 text-black px-6 py-3 font-bold text-xl transform rotate-3">
            +300K
            <div className="text-sm font-normal">FOLLOWERS</div>
          </div>
        </div>

        {/* Guest Stars Carousel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {visibleCards.map((star, index) => (
            <div
              key={`${star.id}-${currentSlide}-${index}`}
              className={`relative group cursor-pointer transition-all duration-300 ${
                star.isHighlighted && index === 2
                  ? 'transform scale-105 z-10'
                  : 'hover:scale-105'
              }`}
            >
              {/* Card */}
              <div className={`relative rounded-2xl overflow-hidden shadow-2xl ${
                star.isHighlighted && index === 2
                  ? 'bg-gradient-to-br from-cyan-400 to-blue-500'
                  : 'bg-white'
              }`}>
                {/* Image */}
                <div className="aspect-[3/4] relative">
                  <img
                    src={star.image}
                    alt={star.name}
                    className={`w-full h-full object-cover ${
                      star.isHighlighted && index === 2 ? '' : 'grayscale group-hover:grayscale-0'
                    } transition-all duration-300`}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x400/gray/white?text=Guest+Star';
                    }}
                  />
                  
                  {/* Overlay for highlighted card */}
                  {star.isHighlighted && index === 2 && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  )}
                </div>

                {/* Content Overlay for highlighted card */}
                {star.isHighlighted && index === 2 && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-sm font-medium mb-1 opacity-90">{star.role.toUpperCase()}</p>
                    <h3 className="text-xl font-bold">{star.name.toUpperCase()}</h3>
                  </div>
                )}

                {/* Regular card content */}
                {!(star.isHighlighted && index === 2) && (
                  <div className="p-4 text-center">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{star.name}</h3>
                    <p className="text-red-500 font-medium text-sm">{star.role}</p>
                  </div>
                )}
              </div>

              {/* Hover overlay with description */}
              <div className="absolute inset-0 bg-black/90 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                <div className="text-center text-white">
                  <h3 className="text-xl font-bold mb-2">{star.name}</h3>
                  <p className="text-yellow-400 font-medium mb-3">{star.role}</p>
                  <p className="text-sm leading-relaxed">{star.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-8 space-x-2">
          {guestStars.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-yellow-400 scale-125'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default GuestStarsSection; 