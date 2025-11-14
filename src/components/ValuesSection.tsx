import { useEffect, useRef, useState } from 'react';

const ValuesSection = () => {
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

  const values = [
    {
      title: "Innovation et créativité",
      description: "Encourager l'innovation et la créativité dans les produits et services présentés.",
      icon: "💡",
      color: "from-blue-500 to-cyan-500"
    },
    {
      title: "Éducation et apprentissage",
      description: "Offrir des opportunités d'apprentissage et d'éducation aux participants sur l'entrepreneuriat et les compétences professionnelles.",
      icon: "📚",
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Esprit d'entreprise",
      description: "Promouvoir l'esprit d'entreprise en offrant une plateforme aux entrepreneurs pour présenter leurs idées et leurs produits.",
      icon: "🚀",
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Diversité culturelle",
      description: "Célébrer la diversité culturelle en mettant en avant les traditions, l'artisanat, la musique et la cuisine de différentes régions.",
      icon: "🌍",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Réseautage / Networking",
      description: "Faciliter le réseautage entre entrepreneurs, investisseurs, institutions financières et autres parties prenantes.",
      icon: "🤝",
      color: "from-teal-500 to-blue-500"
    },
    {
      title: "Développement économique local",
      description: "Contribuer au développement économique local en mettant en valeur les entreprises locales et en encourageant le commerce.",
      icon: "📈",
      color: "from-indigo-500 to-purple-500"
    },
    {
      title: "Durabilité",
      description: "Encourager des pratiques commerciales durables et responsables sur le plan environnemental et social.",
      icon: "🌱",
      color: "from-green-600 to-lime-500"
    },
    {
      title: "Égalité des genres",
      description: "Promouvoir l'égalité des genres en offrant des opportunités égales aux entrepreneurs de tous les genres.",
      icon: "⚖️",
      color: "from-pink-500 to-rose-500"
    },
    {
      title: "Engagement communautaire",
      description: "Impliquer la communauté locale dans l'événement et encourager la participation active des résidents.",
      icon: "👥",
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "Partage des connaissances",
      description: "Faciliter le partage des connaissances et des expériences entre les participants pour favoriser la croissance personnelle et professionnelle.",
      icon: "🔄",
      color: "from-cyan-500 to-blue-600"
    }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <div className={`w-24 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto mb-8 transition-all duration-700 delay-200 ${
            isVisible ? 'scale-x-100' : 'scale-x-0'
          }`}></div>
          
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 transition-all duration-1000 delay-300 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            NOS VALEURS
          </h2>
          
          <p className={`text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 delay-500 ease-out ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          }`}>
            Ces valeurs contribuent à faire de What About You un événement enrichissant à la fois sur le plan économique, social et culturel.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div 
              key={index}
              className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 cursor-pointer border border-gray-100 hover:border-gray-200 transition-all duration-1000 delay-${600 + index * 100} ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Icon with gradient background */}
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-3xl filter drop-shadow-lg">{value.icon}</span>
              </div>
              
              <h3 className="text-xl font-bold text-black mb-4 text-center group-hover:text-gray-800 transition-colors duration-300">
                {value.title}
              </h3>
              
              <p className="text-gray-600 text-center leading-relaxed text-sm group-hover:text-gray-700 transition-colors duration-300">
                {value.description}
              </p>

              {/* Decorative dot */}
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${value.color} mx-auto mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <div className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-black mb-4">
              Des valeurs qui nous guident
            </h3>
            <p className="text-gray-600 leading-relaxed mb-6">
              Chez What About You, nous croyons que ces valeurs sont essentielles pour créer un environnement où l'innovation, la collaboration et le développement durable peuvent prospérer. Chaque événement que nous organisons reflète ces principes fondamentaux.
            </p>
                         <div className="flex justify-center space-x-4">
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuesSection; 