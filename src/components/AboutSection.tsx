import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

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
              À PROPOS DE WHAT ABOUT YOU
            </h2>
            
            <p className={`text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ease-out ${
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              "Quelle est ta situation actuelle ?" - Découvrez WAY, une foire entrepreneuriale, socio-culturelle et de divertissement qui mobilise les jeunes autour de l'entrepreneuriat et de l'innovation.
            </p>
          </div>

          {/* Identity Colors */}
          <div className={`flex justify-center space-x-4 mb-16 transition-all duration-1000 delay-600 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <div className="flex items-center space-x-2 px-4 py-2 bg-red-500 rounded-full text-white font-semibold">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span>Rouge: Étudiant</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500 rounded-full text-white font-semibold">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span>Bleu: Collégien</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 rounded-full text-white font-semibold">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span>Jaune: Travailleur</span>
            </div>
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
                UNE FOIRE ENTREPRENEURIALE<br />
                QUI MOBILISE LES JEUNES
              </h3>

              <p className={`text-lg text-gray-600 leading-relaxed transition-all duration-1000 delay-1100 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}>
                What About You est une foire entrepreneuriale, socio-culturelle et de divertissement dont le but est de mobiliser et rassembler les jeunes autour d'un objectif commun afin de faire valoir leurs savoir-faire.
              </p>

              {/* Key features */}
              <div className={`space-y-4 pt-6 transition-all duration-1000 delay-1200 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Plateforme pour l'entrepreneuriat jeune</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Échanges socio-culturels et divertissement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-gray-700">Réseautage et opportunités d'affaires</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Développement économique local</span>
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
                  alt="Foire entrepreneuriale What About You - Jeunes entrepreneurs au Cameroun" 
                  className="w-full h-[500px] object-cover"
                  onError={(e) => {
                    // Fallback in case image doesn't load
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23f3f4f6'/%3E%3Ctext x='200' y='250' text-anchor='middle' fill='%23666' font-family='Arial' font-size='16'%3EFoire WAY%3C/text%3E%3C/svg%3E";
                  }}
                />
                
                {/* Decorative overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Decorative floating elements */}
              <div className={`absolute -top-6 -right-6 w-24 h-24 bg-yellow-400 rounded-full opacity-20 transition-all duration-1000 delay-1400 ${
                isVisible ? 'scale-100' : 'scale-0'
              }`}></div>
              <div className={`absolute -bottom-6 -left-6 w-16 h-16 bg-blue-400 rounded-full opacity-20 transition-all duration-1000 delay-1500 ${
                isVisible ? 'scale-100' : 'scale-0'
              }`}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section 
        ref={festivalRef}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-black mb-6 transition-all duration-1000 ease-out ${
              isFestivalVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              NOTRE MISSION
            </h2>
            
            <p className={`text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ease-out ${
              isFestivalVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              Fournir une plateforme dynamique où les entrepreneurs peuvent présenter leurs produits et services, partager leurs idées et établir des partenariats pour faire croître leurs entreprises.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Image */}
            <div className={`relative transition-all duration-1000 delay-400 ease-out ${
              isFestivalVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 -translate-x-12'
            }`}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/missandmasterhero.webp" 
                  alt="Mission What About You - Entrepreneurs au salon professionnel" 
                  className="w-full h-[400px] object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f3f4f6'/%3E%3Ctext x='200' y='200' text-anchor='middle' fill='%23666' font-family='Arial' font-size='14'%3EMission WAY%3C/text%3E%3C/svg%3E";
                  }}
                />
                
                {/* Decorative overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
              </div>
            </div>

            {/* Right Content */}
            <div className={`space-y-8 transition-all duration-1000 delay-600 ease-out ${
              isFestivalVisible 
                ? 'opacity-100 translate-x-0' 
                : 'opacity-0 translate-x-12'
            }`}>
              {/* Blue circular icon */}
              <div className={`w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-8 transition-all duration-800 delay-800 ${
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
                    d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className={`text-3xl md:text-4xl font-bold text-black leading-tight transition-all duration-1000 delay-1000 ease-out ${
                isFestivalVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}>
                PROMOUVOIR L'INNOVATION<br />
                ET LA CROISSANCE
              </h3>

              <p className={`text-lg text-gray-600 leading-relaxed transition-all duration-1000 delay-1100 ease-out ${
                isFestivalVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}>
                En tant qu'événement fédérateur, What About You vise à stimuler l'entrepreneuriat local, encourager l'innovation et contribuer au développement économique et social du Cameroun.
              </p>

              {/* Key objectives */}
              <div className={`space-y-4 pt-6 transition-all duration-1000 delay-1200 ease-out ${
                isFestivalVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-6'
              }`}>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Favoriser le réseautage et les partenariats</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Stimuler l'investissement et le financement</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700">Fournir des ressources et conseils</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">Créer des opportunités d'emploi</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Preview Section */}
      <section 
        ref={familyRef}
        className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className={`text-4xl md:text-5xl font-bold text-black mb-6 transition-all duration-1000 ease-out ${
              isFamilyVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              NOS VALEURS
            </h2>
            
            <p className={`text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-200 ease-out ${
              isFamilyVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}>
              Des valeurs qui nous guident pour faire de WAY un événement enrichissant sur tous les plans.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: "Innovation",
                description: "Encourager la créativité et l'innovation dans tous les domaines",
                icon: "💡",
                color: "from-blue-500 to-cyan-500"
              },
              {
                title: "Diversité",
                description: "Célébrer la diversité culturelle et promouvoir l'inclusion",
                icon: "🌍",
                color: "from-green-500 to-emerald-500"
              },
              {
                title: "Entrepreneuriat",
                description: "Promouvoir l'esprit d'entreprise chez les jeunes",
                icon: "🚀",
                color: "from-purple-500 to-pink-500"
              },
              {
                title: "Réseautage",
                description: "Faciliter les connexions et les partenariats",
                icon: "🤝",
                color: "from-orange-500 to-red-500"
              }
            ].map((value, index) => (
              <div 
                key={index}
                className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer transition-all duration-1000 delay-${400 + index * 200} ease-out ${
                  isFamilyVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 mx-auto`}>
                  <span className="text-2xl">{value.icon}</span>
                </div>
                
                <h3 className="text-xl font-bold text-black mb-4 text-center">
                  {value.title}
                </h3>
                
                <p className="text-gray-600 text-center leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className={`text-center mt-12 transition-all duration-1000 delay-1000 ease-out ${
            isFamilyVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            <Link 
              to="/about"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Découvrir toutes nos valeurs
              <svg 
                className="ml-2 w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutSection; 