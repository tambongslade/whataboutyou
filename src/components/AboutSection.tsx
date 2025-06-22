import { useEffect, useRef, useState } from 'react';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFestivalVisible, setIsFestivalVisible] = useState(false);
  const [isFamilyVisible, setIsFamilyVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const festivalRef = useRef<HTMLDivElement>(null);
  const familyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '0px 0px -50px 0px' // Start animation 50px before the element comes into view
      }
    );

    const festivalObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsFestivalVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const familyObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsFamilyVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    if (festivalRef.current) {
      festivalObserver.observe(festivalRef.current);
    }

    if (familyRef.current) {
      familyObserver.observe(familyRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      if (festivalRef.current) {
        festivalObserver.unobserve(festivalRef.current);
      }
      if (familyRef.current) {
        familyObserver.unobserve(familyRef.current);
      }
    };
  }, []);

  return (
    <>
      <section 
        ref={sectionRef}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            {/* Decorative line */}
            <div className={`w-24 h-1 bg-black mx-auto mb-8 transition-all duration-700 delay-200 ${
              isVisible ? 'scale-x-100' : 'scale-x-0'
            }`}></div>
            
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 transition-all duration-1000 delay-300 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              A PROPOS DE NOUS
            </h2>
            
            <p className={`text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              Découvrez l'essence du festival WhatAboutYou : son histoire, sa vision et les valeurs qui l'animent. Nous vous en disons plus sur ce qui fait de WAY une expérience unique.
            </p>
          </div>

          {/* Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className={`space-y-8 transition-all duration-1000 delay-700 ease-out ${
              isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-12'
            }`}>
              {/* Red circular icon */}
              <div className={`w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-8 transition-all duration-800 delay-900 ${
                isVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
              }`}>
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path 
                    d="M8 12L10.5 14.5L16 9" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className={`text-3xl md:text-4xl font-bold text-black leading-tight transition-all duration-1000 delay-1000 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}>
                VALORISER LES JEUNES<br />
                CRÉATEURS
              </h3>

              <p className={`text-lg text-gray-600 leading-relaxed transition-all duration-1000 delay-1100 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}>
                Nous offrons une plateforme dynamique aux jeunes entrepreneurs, artistes et artisans pour exposer leurs talents, créations et projets.
              </p>

              {/* Additional features or stats */}
              <div className={`space-y-4 pt-6 transition-all duration-1000 delay-1200 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Soutien aux entrepreneurs émergents</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Mise en valeur des talents artistiques</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Création d'opportunités de networking</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className={`relative transition-all duration-1000 delay-800 ease-out ${
              isVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-12'
            }`}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/About 1.webp" 
                  alt="Groupe de jeunes créateurs au festival WhatAboutYou" 
                  className="w-full h-[500px] object-cover"
                  onError={(e) => {
                    // Fallback in case image doesn't load
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f3f4f6'/%3E%3Ctext x='200' y='250' text-anchor='middle' fill='%23666' font-family='Arial' font-size='16'%3EImage de groupe%3C/text%3E%3C/svg%3E";
                  }}
                />
                
                {/* Decorative overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Decorative elements */}
              <div className={`absolute -top-4 -right-4 w-8 h-8 bg-yellow-400 rounded-full opacity-80 transition-all duration-700 delay-1300 ${
                isVisible ? 'scale-100' : 'scale-0'
              }`}></div>
              <div className={`absolute -bottom-4 -left-4 w-6 h-6 bg-red-500 rounded-full opacity-80 transition-all duration-700 delay-1400 ${
                isVisible ? 'scale-100' : 'scale-0'
              }`}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Festival Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div 
          ref={festivalRef}
          className="max-w-7xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Image */}
            <div className={`relative transition-all duration-1000 delay-200 ease-out ${
              isFestivalVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-12'
            }`}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/About 2.webp" 
                  alt="Festival de plaisir et le partage" 
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    // Fallback in case image doesn't load
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='200' y='200' text-anchor='middle' fill='%23666' font-family='Arial' font-size='16'%3EFestival Image%3C/text%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>

            {/* Right Content */}
            <div className={`space-y-8 transition-all duration-1000 delay-400 ease-out ${
              isFestivalVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-12'
            }`}>
              {/* Blue circular icon */}
              <div className={`w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-8 transition-all duration-800 delay-600 ${
                isFestivalVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
              }`}>
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path 
                    d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" 
                    fill="currentColor"
                  />
                </svg>
              </div>

              <h3 className={`text-3xl md:text-4xl font-bold text-black leading-tight transition-all duration-1000 delay-700 ease-out ${
                isFestivalVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}>
                FESTIVAL DE PLAISIR ET<br />
                LE PARTAGE
              </h3>

              <p className={`text-lg text-gray-600 leading-relaxed transition-all duration-1000 delay-800 ease-out ${
                isFestivalVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}>
                Une célébration de la culture, de la créativité et de la convivialité. Nos événements sont pensés pour divertir, inspirer et rassembler.
              </p>

              {/* Additional features */}
              <div className={`space-y-4 pt-6 transition-all duration-1000 delay-900 ease-out ${
                isFestivalVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Événements culturels diversifiés</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Expériences interactives et immersives</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Moments de partage et de convivialité</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Family Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div 
          ref={familyRef}
          className="max-w-7xl mx-auto"
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <div className={`space-y-8 transition-all duration-1000 delay-200 ease-out ${
              isFamilyVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-12'
            }`}>
              {/* Yellow circular icon */}
              <div className={`w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-8 transition-all duration-800 delay-400 ${
                isFamilyVisible ? 'scale-100 rotate-0' : 'scale-0 rotate-180'
              }`}>
                <svg 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path 
                    d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7C14.6 7 14.2 7.1 13.9 7.4L12 9.3L10.1 7.4C9.8 7.1 9.4 7 9 7L3 7V9H8.8L12 12.2L15.2 9H21ZM12 13.5L8 17.5V22H10V18L12 16L14 18V22H16V17.5L12 13.5Z" 
                    fill="currentColor"
                  />
                </svg>
              </div>

              <h3 className={`text-3xl md:text-4xl font-bold text-black leading-tight transition-all duration-1000 delay-600 ease-out ${
                isFamilyVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}>
                FAMILLE VIBRANTE<br />
                ET INCLUSIVE
              </h3>

              <p className={`text-lg text-gray-600 leading-relaxed transition-all duration-1000 delay-700 ease-out ${
                isFamilyVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}>
                La diversité culturelle dans un espace où chacun peut être soi-même, rencontrer, partager et créer des souvenirs inoubliables.
              </p>

              {/* Additional features */}
              <div className={`space-y-4 pt-6 transition-all duration-1000 delay-800 ease-out ${
                isFamilyVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-700">Environnement inclusif et bienveillant</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-700">Célébration de la diversité culturelle</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-700">Création de liens authentiques</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className={`relative transition-all duration-1000 delay-300 ease-out ${
              isFamilyVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-12'
            }`}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/About 3.webp" 
                  alt="Famille vibrante et inclusive au festival WhatAboutYou" 
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    // Fallback in case image doesn't load
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='200' y='200' text-anchor='middle' fill='%23666' font-family='Arial' font-size='16'%3EFamille Inclusive%3C/text%3E%3C/svg%3E";
                  }}
                />
                
                {/* Decorative overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Decorative elements */}
              <div className={`absolute -top-4 -right-4 w-8 h-8 bg-blue-500 rounded-full opacity-80 transition-all duration-700 delay-900 ${
                isFamilyVisible ? 'scale-100' : 'scale-0'
              }`}></div>
              <div className={`absolute -bottom-4 -left-4 w-6 h-6 bg-yellow-400 rounded-full opacity-80 transition-all duration-700 delay-1000 ${
                isFamilyVisible ? 'scale-100' : 'scale-0'
              }`}></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection; 