// import React from 'react';

interface Prize {
  id: number;
  rank: number;
  name: string;
  description: string;
  image: string;
  category: 'ps5';
}

interface TombolaPrizesSectionProps {
  onOpenModal: () => void;
}

const TombolaPrizesSection = ({ onOpenModal }: TombolaPrizesSectionProps) => {
  const prizes: Prize[] = [
    {
      id: 1,
      rank: 1,
      name: "PLAYSTATION 5",
      description: "Console de jeu nouvelle génération",
      image: "/tombola/ps5.webp",
      category: 'ps5'
    },
    {
      id: 2,
      rank: 2,
      name: "PLAYSTATION 5",
      description: "Console de jeu nouvelle génération",
      image: "/tombola/ps5.webp",
      category: 'ps5'
    },
    {
      id: 3,
      rank: 3,
      name: "PLAYSTATION 5",
      description: "Console de jeu nouvelle génération",
      image: "/tombola/ps5.webp",
      category: 'ps5'
    },
    {
      id: 4,
      rank: 4,
      name: "PLAYSTATION 5",
      description: "Console de jeu nouvelle génération",
      image: "/tombola/ps5.webp",
      category: 'ps5'
    },
    {
      id: 5,
      rank: 5,
      name: "PLAYSTATION 5",
      description: "Console de jeu nouvelle génération",
      image: "/tombola/ps5.webp",
      category: 'ps5'
    },
    {
      id: 6,
      rank: 6,
      name: "PLAYSTATION 5",
      description: "Console de jeu nouvelle génération",
      image: "/tombola/ps5.webp",
      category: 'ps5'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-1 bg-gray-800 mx-auto mb-6"></div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            LOTS À GAGNER
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Chaque participation compte. Soutenez le festival et tentez votre chance ! Voici quelques-uns des prix que 
            vous pourriez remporter pendant la tombola :
          </p>
        </div>

        {/* Prizes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {prizes.map((prize) => (
            <div 
              key={prize.id} 
              className="relative bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            >
              {/* Prize Image */}
              <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                <img 
                  src={prize.image} 
                  alt={prize.name}
                  className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Rank Badge */}
                <div className="absolute -top-3 -left-3 bg-yellow-400 text-black font-bold text-2xl w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-white z-10 group-hover:scale-110 transition-transform duration-300">
                  {prize.rank}
                </div>

                {/* Sparkle Effects */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-twinkle transition-opacity duration-300" style={{ animationDelay: '0.1s' }}></div>
                <div className="absolute bottom-6 left-6 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 animate-twinkle transition-opacity duration-300" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute top-1/2 right-6 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 animate-twinkle transition-opacity duration-300" style={{ animationDelay: '0.5s' }}></div>
              </div>

              {/* Prize Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors duration-300">
                  {prize.name}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {prize.description}
                </p>
                
                {/* Prize Category Badge */}
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.58,16.09l-1.09-7A1,1,0,0,0,19.5,8.5H4.5a1,1,0,0,0-1,0.59l-1.09,7a1,1,0,0,0,1,1.41H5v2a1,1,0,0,0,1,1H7a1,1,0,0,0,1-1V17.5H16V19a1,1,0,0,0,1,1h1a1,1,0,0,0,1-1V17.5h1.67A1,1,0,0,0,21.58,16.09ZM5.5,10.5H18.5l0.73,5H4.77Z"/>
                  </svg>
                  CONSOLE
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Prêt à participer ?
            </h3>
            <p className="text-gray-600 mb-6">
              Achetez vos tickets de tombola et maximisez vos chances de gagner ces prix incroyables !
            </p>
            <button 
              onClick={onOpenModal}
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                </svg>
                ACHETER DES TICKETS
              </span>
            </button>
          </div>
        </div>

        {/* Floating Animation Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-yellow-400 rounded-full opacity-60 animate-float hidden lg:block" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-32 right-16 w-6 h-6 bg-pink-400 rotate-45 opacity-50 animate-wiggle hidden lg:block" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 right-8 w-3 h-3 bg-cyan-400 rounded-full opacity-70 animate-bounce hidden lg:block" style={{ animationDelay: '3s' }}></div>
      </div>
    </section>
  );
};

export default TombolaPrizesSection; 