import { useEffect, useRef, useState } from 'react';

const PartnersSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
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

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Partner logos data
  interface Partner {
    name: string;
    logo: string;
    isPrimary?: boolean;
  }

  const partners: Partner[] = [
    { name: 'Solution +', logo: '/paternaire/pat1.jpg' },
    { name: 'Partenaire Premium', logo: '/paternaire/patenaire premium.png', isPrimary: true },
    { name: 'Partenaire 2', logo: '/paternaire/pat2.jpg' },
    { name: 'Partenaire 3', logo: '/paternaire/pat3.png' },
    { name: 'Partenaire 4', logo: '/paternaire/pat4.png' },
    { name: 'Partenaire 5', logo: '/paternaire/pat5.jpg' },
    { name: 'Partenaire 6', logo: '/paternaire/pat6.png' },
    { name: 'Partenaire 7', logo: '/paternaire/pat 7.jpg' },
    { name: 'Partenaire 8', logo: '/paternaire/pat9jpg.jpg' },
    { name: 'Partenaire 9', logo: '/paternaire/v1.png' },
  ];

  // Carousel navigation functions
  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % partners.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + partners.length) % partners.length);
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, []);

  // Get visible partners for carousel
  const getVisiblePartners = (): (Partner & { index: number })[] => {
    const visibleCount = windowWidth >= 1024 ? 6 : windowWidth >= 768 ? 3 : 2; // Responsive count: 6 on desktop, 3 on tablet, 2 on mobile
    const visible: (Partner & { index: number })[] = [];
    for (let i = 0; i < visibleCount; i++) {
      const index = (currentIndex + i) % partners.length;
      const partner = partners[index];
      if (partner) {
        visible.push({ 
          name: partner.name,
          logo: partner.logo,
          isPrimary: partner.isPrimary,
          index 
        });
      }
    }
    return visible;
  };

  return (
    <section 
      ref={sectionRef}
      className="py-16  sm:px-6 lg:px-8 bg-white"
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
            NOS PARTENAIRES
          </h2>
          
          <p className={`text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            Découvrez les entreprises et organisations qui nous accompagnent dans cette aventure et partagent notre vision d'un festival inclusif et créatif.
          </p>
        </div>

        {/* Partners Carousel */}
        <div className={`relative transition-all duration-1000 delay-700 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-12'
        }`}>
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black hover:bg-gray-800 shadow-lg rounded-full p-3 transition-colors duration-300 border border-gray-600"
            aria-label="Previous partners"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black hover:bg-gray-800 shadow-lg rounded-full p-3 transition-colors duration-300 border border-gray-600"
            aria-label="Next partners"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Carousel Container */}
          <div className="overflow-hidden mx-12">
            <div className="flex gap-6 md:gap-8 transition-transform duration-500 ease-in-out">
              {getVisiblePartners().map((partner, displayIndex) => (
                <div
                  key={`${partner.index}-${displayIndex}`}
                  className="flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/6 group cursor-pointer"
                >
                  <div className="relative bg-black hover:bg-gray-800 transition-colors duration-300 rounded-lg p-8 h-56 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300 border border-gray-600">
                    {/* Star for primary partner */}
                    {partner.isPrimary && (
                      <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2 shadow-lg">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                    )}
                    
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-w-full max-h-full object-contain transition-all duration-300"
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-8 space-x-2">
            {partners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === currentIndex ? 'bg-orange-500' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to partner ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1400 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-lg text-gray-600 mb-8">
            Vous souhaitez devenir partenaire du festival WhatAboutYou ?
          </p>
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
            Devenir Partenaire
          </button>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection; 