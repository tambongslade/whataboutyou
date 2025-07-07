import React, { useState, useEffect, useRef } from 'react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  colorBg: string;
}

const TeamSection: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number | null>(2); // Default to middle card active
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  // Check if desktop on mount and window resize
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Auto-advance carousel on desktop
  useEffect(() => {
    if (isDesktop) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % Math.ceil(teamMembers.length / 4));
      }, 5000); // Change every 5 seconds
      
      return () => clearInterval(interval);
    }
  }, [isDesktop]);

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "MARIE KAMDEM",
      role: "DIRECTRICE GÉNÉRALE",
      image: "/Notre Equipe/IMG_8877.webp",
      colorBg: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
    },
    {
      id: 2,
      name: "PAUL MBALLA", 
      role: "DIRECTEUR MARKETING",
      image: "/Notre Equipe/IMG_8876.webp",
      colorBg: "bg-gradient-to-br from-cyan-400 via-blue-500 to-yellow-400"
    },
    {
      id: 3,
      name: "GRACE NKOMO",
      role: "RESPONSABLE ÉVÉNEMENTIEL", 
      image: "/Notre Equipe/IMG_8875.webp",
      colorBg: "bg-gradient-to-br from-red-500 via-pink-500 to-purple-600"
    },
    {
      id: 4,
      name: "JEAN TSAFACK",
      role: "CHEF DE PROJET",
      image: "/Notre Equipe/IMG_8874.webp",
      colorBg: "bg-gradient-to-br from-green-400 via-teal-500 to-blue-500"
    },
    {
      id: 5,
      name: "SANDRA FOUDA",
      role: "RESPONSABLE COMMUNICATION",
      image: "/Notre Equipe/IMG_8873.webp",
      colorBg: "bg-gradient-to-br from-orange-400 via-red-500 to-pink-500"
    },
    {
      id: 6,
      name: "MICHEL NJOYA",
      role: "DIRECTEUR TECHNIQUE",
      image: "/Notre Equipe/IMG_8872.webp",
      colorBg: "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"
    },
    {
      id: 7,
      name: "LINDA BIYA",
      role: "COORDINATRICE LOGISTIQUE",
      image: "/Notre Equipe/IMG_8871.webp",
      colorBg: "bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-500"
    },
    {
      id: 8,
      name: "BORIS TCHUENTE",
      role: "RESPONSABLE PARTENARIATS",
      image: "/Notre Equipe/IMG_8870.webp",
      colorBg: "bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500"
    },
    {
      id: 9,
      name: "CLAIRE ONANA",
      role: "GESTIONNAIRE FINANCIER",
      image: "/Notre Equipe/IMG_8869.webp",
      colorBg: "bg-gradient-to-br from-violet-500 via-purple-500 to-indigo-500"
    },
    {
      id: 10,
      name: "DANIEL MEVA",
      role: "CHARGÉ DE MISSION",
      image: "/Notre Equipe/IMG_8868.webp",
      colorBg: "bg-gradient-to-br from-teal-400 via-green-500 to-emerald-500"
    },
    {
      id: 11,
      name: "VANESSA NDONGO",
      role: "ASSISTANTE DIRECTION",
      image: "/Notre Equipe/IMG_8878.webp",
      colorBg: "bg-gradient-to-br from-rose-400 via-pink-500 to-purple-500"
    },
    {
      id: 12,
      name: "HERVÉ MANGA",
      role: "RESPONSABLE SÉCURITÉ",
      image: "/Notre Equipe/IMG_7489.webp",
      colorBg: "bg-gradient-to-br from-slate-500 via-gray-500 to-zinc-500"
    },
    {
      id: 13,
      name: "PATRICIA EYOUM",
      role: "CHARGÉE DES RELATIONS PUBLIQUES",
      image: "/Notre Equipe/IMG_0038.webp",
      colorBg: "bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500"
    },
    {
      id: 14,
      name: "ALAIN MOUKOURI",
      role: "COORDINATEUR TECHNIQUE",
      image: "/Notre Equipe/IMG_0831.webp",
      colorBg: "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500"
    }
  ];

  // Navigation functions
  const goToNext = () => {
    if (isDesktop) {
      setCurrentIndex((prev) => (prev + 1) % Math.ceil(teamMembers.length / 4));
    } else {
      // Mobile: scroll to next member
      const container = carouselRef.current;
      if (container) {
        const cardWidth = container.querySelector('.team-card')?.clientWidth || 0;
        container.scrollBy({ left: cardWidth + 16, behavior: 'smooth' }); // 16px for gap
      }
    }
  };

  const goToPrevious = () => {
    if (isDesktop) {
      setCurrentIndex((prev) => (prev - 1 + Math.ceil(teamMembers.length / 4)) % Math.ceil(teamMembers.length / 4));
    } else {
      // Mobile: scroll to previous member
      const container = carouselRef.current;
      if (container) {
        const cardWidth = container.querySelector('.team-card')?.clientWidth || 0;
        container.scrollBy({ left: -(cardWidth + 16), behavior: 'smooth' }); // 16px for gap
      }
    }
  };

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchStartX.current = e.touches[0].clientX;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      touchEndX.current = e.touches[0].clientX;
    }
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const swipeDistance = touchStartX.current - touchEndX.current;
    
    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        goToNext(); // Swipe left - go to next
      } else {
        goToPrevious(); // Swipe right - go to previous
      }
    }
  };

  // Get visible team members for desktop
  const getVisibleMembers = () => {
    const itemsPerPage = 4;
    const startIndex = currentIndex * itemsPerPage;
    return teamMembers.slice(startIndex, startIndex + itemsPerPage);
  };

  return (
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            A PROPOS DE NOUS
          </h2>
          <div className="w-16 md:w-24 h-1 bg-red-500 mx-auto mb-4 md:mb-6"></div>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonumy eiusmod tempor invidunt ut
            labore et dolore magna aliquyam erat.
          </p>
        </div>

        {/* Team Cards */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-end space-y-4 md:space-y-0 md:space-x-4 mb-8">
          {/* Navigation Arrows - Desktop */}
          <button 
            onClick={goToPrevious}
            className="hidden md:flex w-14 h-14 rounded-full bg-white shadow-lg border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-6 h-6 text-gray-600 hover:text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Team Member Cards Container */}
          <div className="w-full md:w-auto">
            {/* Mobile: Touch-enabled horizontal scrollable carousel */}
            <div className="md:hidden">
              <div 
                ref={carouselRef}
                className="flex overflow-x-auto scrollbar-hide space-x-4 px-4 pb-4 scroll-smooth"
                style={{ scrollSnapType: 'x mandatory' }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`team-card relative cursor-pointer transition-all duration-500 transform hover:scale-105 flex-shrink-0 ${
                      activeCard === member.id 
                        ? 'w-72 h-80' 
                        : 'w-56 h-72'
                    }`}
                    style={{ scrollSnapAlign: 'center' }}
                    onClick={() => setActiveCard(activeCard === member.id ? null : member.id)}
                  >
                    {/* Card Container */}
                    <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ${
                      activeCard === member.id ? member.colorBg : 'bg-white'
                    }`}>
                      
                      {/* Member Image */}
                      <div className={`absolute inset-0 transition-all duration-500 ${
                        activeCard === member.id ? 'scale-110 translate-y-4' : 'scale-100'
                      }`}>
                        <img
                          src={member.image}
                          alt={member.name}
                          className={`w-full h-full object-cover transition-all duration-500 ${
                            activeCard === member.id ? 'grayscale-0' : 'grayscale'
                          }`}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x400/gray/white?text=Team+Member';
                          }}
                        />
                      </div>

                      {/* Active Card Content Overlay */}
                      {activeCard === member.id && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                              <svg className="w-1.5 h-1.5 text-gray-800" fill="currentColor" viewBox="0 0 8 8">
                                <circle cx="4" cy="4" r="3"/>
                              </svg>
                            </div>
                            <span className="text-xs font-medium opacity-90">{member.role}</span>
                          </div>
                          <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                        </div>
                      )}

                      {/* Subtle overlay for inactive cards */}
                      {activeCard !== member.id && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      )}
                    </div>

                    {/* Overflow Effect for Active Card */}
                    {activeCard === member.id && (
                      <div className="absolute -top-2 -left-2 -right-2 -bottom-2 pointer-events-none">
                        <div className={`w-full h-full rounded-2xl ${member.colorBg} opacity-20 blur-xl`}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Carousel with 4 cards at a time */}
            <div className="hidden md:block">
              <div className="flex space-x-4 transition-all duration-700 ease-in-out">
                {getVisibleMembers().map((member) => (
                  <div
                    key={member.id}
                    className={`relative cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                      activeCard === member.id 
                        ? 'w-80 h-96' 
                        : 'w-64 h-80'
                    }`}
                    onClick={() => setActiveCard(activeCard === member.id ? null : member.id)}
                  >
                    {/* Card Container */}
                    <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ${
                      activeCard === member.id ? member.colorBg : 'bg-white'
                    }`}>
                      
                      {/* Member Image */}
                      <div className={`absolute inset-0 transition-all duration-500 ${
                        activeCard === member.id ? 'scale-110 translate-y-4' : 'scale-100'
                      }`}>
                        <img
                          src={member.image}
                          alt={member.name}
                          className={`w-full h-full object-cover transition-all duration-500 ${
                            activeCard === member.id ? 'grayscale-0' : 'grayscale'
                          }`}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x400/gray/white?text=Team+Member';
                          }}
                        />
                      </div>

                      {/* Active Card Content Overlay */}
                      {activeCard === member.id && (
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                              <svg className="w-2 h-2 text-gray-800" fill="currentColor" viewBox="0 0 8 8">
                                <circle cx="4" cy="4" r="3"/>
                              </svg>
                            </div>
                            <span className="text-sm font-medium opacity-90">{member.role}</span>
                          </div>
                          <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                        </div>
                      )}

                      {/* Subtle overlay for inactive cards */}
                      {activeCard !== member.id && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      )}
                    </div>

                    {/* Overflow Effect for Active Card */}
                    {activeCard === member.id && (
                      <div className="absolute -top-4 -left-4 -right-4 -bottom-4 pointer-events-none">
                        <div className={`w-full h-full rounded-2xl ${member.colorBg} opacity-20 blur-xl`}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Next Arrow - Desktop */}
          <button 
            onClick={goToNext}
            className="hidden md:flex w-14 h-14 rounded-full bg-white shadow-lg border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 items-center justify-center hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-6 h-6 text-gray-600 hover:text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Carousel Indicators - Desktop */}
        <div className="hidden md:flex justify-center space-x-2 mt-6">
          {Array.from({ length: Math.ceil(teamMembers.length / 4) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                currentIndex === index 
                  ? 'bg-yellow-400 scale-125' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Mobile Navigation Hint */}
        <div className="md:hidden text-center mt-4">
          <p className="text-sm text-gray-500 flex items-center justify-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Glissez pour naviguer
            <svg className="w-4 h-4 ml-1 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base">
            VOIR L'EQUIPE
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeamSection; 