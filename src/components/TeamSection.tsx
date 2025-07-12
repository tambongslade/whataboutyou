import React, { useState } from 'react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  colorBg: string;
}

const TeamSection: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "EDZOGO AKINI FRANCK DONALD",
      role: "PRÉSIDENT DE L'APAEC",
      image: "/Notre Equipe/IMG_0831.webp",
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
      image: "/Notre Equipe/IMG_8877.webp",
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
      image: "/Notre Equipe/IMG_8869.webp",
      colorBg: "bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500"
    }
  ];

  return (
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            À PROPOS DE NOUS
          </h2>
          <div className="w-16 md:w-24 h-1 bg-red-500 mx-auto mb-4 md:mb-6"></div>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Découvrez l'équipe passionnée et déterminée qui œuvre pour faire de What About You un événement entrepreneurial unique au Cameroun. 
            Ensemble, nous créons des opportunités et inspirons la prochaine génération d'entrepreneurs.
          </p>
        </div>

        {/* Team Grid - All Members Visible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {teamMembers.map((member) => (
            <div
              key={member.id}
              className="group relative cursor-pointer transition-all duration-300 transform hover:scale-105"
              onClick={() => setActiveCard(activeCard === member.id ? null : member.id)}
            >
              {/* Card Container */}
              <div className={`relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-lg transition-all duration-300 ${
                activeCard === member.id ? member.colorBg : 'bg-white'
              } group-hover:shadow-xl`}>
                
                {/* Member Image */}
                <div className={`absolute inset-0 transition-all duration-300 ${
                  activeCard === member.id ? 'scale-110' : 'scale-100 group-hover:scale-105'
                }`}>
                  <img
                    src={member.image}
                    alt={member.name}
                    className={`w-full h-full object-cover transition-all duration-300 ${
                      activeCard === member.id ? 'grayscale-0' : 'grayscale-0'
                    }`}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x400/gray/white?text=Team+Member';
                    }}
                  />
                </div>

                {/* Default Card Content - Always Visible */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                  <h3 className="text-sm font-bold mb-1 leading-tight">{member.name}</h3>
                  <p className="text-xs text-white/90">{member.role}</p>
                </div>

                {/* Active Card Enhanced Content */}
                {activeCard === member.id && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-6 text-white">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                          <svg className="w-1.5 h-1.5 text-gray-800" fill="currentColor" viewBox="0 0 8 8">
                            <circle cx="4" cy="4" r="3"/>
                          </svg>
                        </div>
                        <span className="text-xs font-medium opacity-90">ÉQUIPE WAY</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2 leading-tight">{member.name}</h3>
                      <p className="text-sm text-white/90 mb-2">{member.role}</p>
                      <div className="text-xs text-white/80">
                        Membre de l'équipe organisatrice de What About You 2024
                      </div>
                    </div>
                  </div>
                )}

                {/* Hover Effect for Non-Active Cards */}
                {activeCard !== member.id && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                )}
              </div>

              {/* Glow Effect for Active Card */}
              {activeCard === member.id && (
                <div className="absolute -top-2 -left-2 -right-2 -bottom-2 pointer-events-none">
                  <div className={`w-full h-full rounded-2xl ${member.colorBg} opacity-30 blur-xl`}></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Scroll Hint */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 mb-4">
            Cliquez sur une carte pour plus d'informations
          </p>
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base">
            VOIR TOUS LES MEMBRES
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeamSection; 