import { useEffect, useRef, useState } from 'react';

const IdentitySection = () => {
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

  return (
    <section 
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 via-blue-50 to-yellow-50"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <div className={`w-24 h-1 bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500 mx-auto mb-8 transition-all duration-700 delay-200 ${
            isVisible ? 'scale-x-100' : 'scale-x-0'
          }`}></div>
          
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 transition-all duration-1000 delay-300 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            NOTRE IDENTITÉ
          </h2>
          
          <p className={`text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            "Quelle est ta situation actuelle ?" - L'identité de WAY repose sur trois couleurs qui rassemblent les jeunes selon leur niveau éducatif et professionnel pour créer ensemble des opportunités entrepreneuriales.
          </p>
        </div>

        {/* Main Identity Content */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 delay-700 ease-out ${
            isVisible 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 -translate-x-12'
          }`}>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-3xl font-bold text-black mb-6">What About You (WAY)</h3>
              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  What About You, abrégé « WAY », dont le slogan est « Quelle est ta situation actuelle ? » renvoie à la fois à l'appartenance ethnique, à la classe sociale et aussi à sa position pour le développement communautaire.
                </p>
                <p className="leading-relaxed">
                  C'est une foire qui met en avant l'entrepreneuriat jeune dans un espace diversifiant. Cette identité est le cœur de la foire car elle crée une ambiance magique à travers laquelle les jeunes s'identifient facilement.
                </p>
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
                src="/Logo.webp" 
                alt="Logo What About You - Identité de marque WAY" 
                className="w-full h-[400px] object-contain bg-white"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23ffffff'/%3E%3Ctext x='200' y='200' text-anchor='middle' fill='%23666' font-family='Arial' font-size='24' font-weight='bold'%3EWAY%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>
        </div>

        {/* Color Identity System */}
        <div className={`transition-all duration-1000 delay-900 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <h3 className="text-3xl font-bold text-black text-center mb-12">
            Notre système de couleurs entrepreneuriales
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Rouge - Étudiant */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border-t-4 border-red-500">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🎓</span>
              </div>
              
              <h4 className="text-2xl font-bold text-red-600 mb-4 text-center">
                ROUGE
              </h4>
              
              <div className="text-center mb-4">
                <span className="inline-block px-6 py-3 bg-red-500 text-white font-semibold rounded-full">
                  Étudiant
                </span>
              </div>
              
              <p className="text-gray-600 text-center leading-relaxed">
                La couleur rouge identifie les étudiants universitaires, symbolisant la passion pour l'apprentissage et l'ambition entrepreneuriale. C'est une célébration de l'excellence académique et de l'innovation.
              </p>
            </div>

            {/* Bleu - Collégien */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border-t-4 border-blue-500">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">📚</span>
              </div>
              
              <h4 className="text-2xl font-bold text-blue-600 mb-4 text-center">
                BLEU
              </h4>
              
              <div className="text-center mb-4">
                <span className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-full">
                  Collégien
                </span>
              </div>
              
              <p className="text-gray-600 text-center leading-relaxed">
                Le bleu représente les collégiens, symbolisant la curiosité, l'apprentissage et le potentiel entrepreneurial en développement. C'est une célébration de la jeunesse et de l'exploration des opportunités.
              </p>
            </div>

            {/* Jaune - Travailleur */}
            <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 border-t-4 border-yellow-500">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">💼</span>
              </div>
              
              <h4 className="text-2xl font-bold text-yellow-600 mb-4 text-center">
                JAUNE
              </h4>
              
              <div className="text-center mb-4">
                <span className="inline-block px-6 py-3 bg-yellow-500 text-white font-semibold rounded-full">
                  Travailleur
                </span>
              </div>
              
              <p className="text-gray-600 text-center leading-relaxed">
                Le jaune identifie les travailleurs et professionnels, symbolisant l'énergie, la productivité et l'expérience entrepreneuriale. C'est une célébration de l'accomplissement professionnel et du leadership.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1200 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-black mb-4">
              Une identité qui rassemble
            </h3>
                         <p className="text-gray-600 leading-relaxed mb-6">
               Cette identité colorée est le cœur de la foire WAY car elle rassemble les jeunes de différents niveaux éducatifs et professionnels autour de l'entrepreneuriat. Elle favorise l'échange d'expériences, le mentorat et la création d'opportunités d'affaires.
             </p>
            
                         {/* Interactive color selector */}
             <div className="flex justify-center space-x-4 mb-6">
               <button className="group flex items-center space-x-3 px-6 py-4 bg-red-500 hover:bg-red-600 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105">
                 <div className="w-4 h-4 bg-white rounded-full"></div>
                 <span>Je suis étudiant</span>
               </button>
               <button className="group flex items-center space-x-3 px-6 py-4 bg-blue-500 hover:bg-blue-600 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105">
                 <div className="w-4 h-4 bg-white rounded-full"></div>
                 <span>Je suis collégien</span>
               </button>
               <button className="group flex items-center space-x-3 px-6 py-4 bg-yellow-500 hover:bg-yellow-600 rounded-xl text-white font-semibold transition-all duration-300 hover:scale-105">
                 <div className="w-4 h-4 bg-white rounded-full"></div>
                 <span>Je suis travailleur</span>
               </button>
             </div>
            
            <p className="text-sm text-gray-500">
              Choisissez votre couleur et rejoignez la communauté WAY !
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdentitySection; 