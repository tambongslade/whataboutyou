import { useEffect, useRef, useState } from 'react';

const PartnersSection = () => {
  const [isVisible, setIsVisible] = useState(false);
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

  // Partner logos data
  const partners = [
    { name: 'Orange', logo: 'orange' },
    { name: 'Orange', logo: 'orange' },
    { name: 'Orange', logo: 'orange' },
    { name: 'Orange', logo: 'orange' },
    { name: 'Orange', logo: 'orange' },
    { name: 'Orange', logo: 'orange' },
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
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

        {/* Partners Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center transition-all duration-1000 delay-700 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-12'
        }`}>
          {partners.map((partner, index) => (
            <div
              key={index}
              className={`group cursor-pointer transition-all duration-500 ease-out ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
              }`}
              style={{ 
                transitionDelay: `${800 + index * 100}ms` 
              }}
            >
              <div className="bg-orange-500 hover:bg-orange-600 transition-colors duration-300 rounded-lg p-6 h-24 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
                <span className="text-white font-bold text-lg">
                  {partner.logo}
                </span>
              </div>
            </div>
          ))}
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