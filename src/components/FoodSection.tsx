import React, { useState } from 'react';

interface FoodCreator {
  id: number;
  name: string;
  specialty: string;
  description: string;
  image: string;
  location: string;
}

const FoodSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const foodCreators: FoodCreator[] = [
    {
      id: 1,
      name: "Chef Marina",
      specialty: "Cuisine Fusion",
      description: "Spécialiste de la cuisine fusion africaine-européenne, Marina transforme les traditions culinaires en expériences gustatives uniques.",
      image: "/About 1.png",
      location: "Paris, France"
    },
    {
      id: 2,
      name: "Ahmed's Kitchen",
      specialty: "Street Food",
      description: "Créateur de street food authentique, Ahmed propose des saveurs du monde dans des concepts innovants et accessibles.",
      image: "/About 2.png",
      location: "Lyon, France"
    },
    {
      id: 3,
      name: "Bella Pasta",
      specialty: "Cuisine Italienne",
      description: "Passionnée de cuisine italienne traditionnelle, Bella partage ses recettes familiales et ses créations modernes.",
      image: "/About 3.png",
      location: "Marseille, France"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % foodCreators.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + foodCreators.length) % foodCreators.length);
  };

  // Get current food creator with safety check
  const currentCreator = foodCreators[currentSlide];
  
  // Early return if no creators available
  if (!currentCreator || foodCreators.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content Side */}
          <div className="order-2 lg:order-1">
            {/* Navigation Arrows */}
            <div className="flex space-x-4 mb-8">
              <button
                onClick={prevSlide}
                className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors"
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              RESTAURATION ET<br />
              GASTRONOMIE
            </h2>

            <p className="text-gray-600 mb-6 leading-relaxed">
              Que vous soyez chef, restaurateur ou passionné de cuisine, WhataboutYou vous offre 
              la plateforme idéale pour faire découvrir vos créations culinaires à un large public.
            </p>

            <p className="text-gray-600 mb-8 leading-relaxed">
              Imaginez vos plats servis sur la scène d'un festival vibrant, où votre talent peut inspirer 
              des milliers de personnes. C'est l'opportunité de donner à vos saveurs la visibilité 
              qu'elles méritent et de transformer chaque dégustation en une expérience inoubliable.
            </p>

            <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              LOREM IPSUM
            </button>

            {/* Creator Showcase */}
            <div className="mt-12 bg-white rounded-xl p-6 shadow-lg">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={currentCreator.image}
                  alt={currentCreator.name}
                  className="w-16 h-16 rounded-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/64x64/gray/white?text=Chef';
                  }}
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{currentCreator.name}</h3>
                  <p className="text-red-500 font-medium">{currentCreator.specialty}</p>
                  <p className="text-gray-500 text-sm">{currentCreator.location}</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">
                {currentCreator.description}
              </p>
            </div>
          </div>

          {/* Image Side */}
          <div className="order-1 lg:order-2 relative">
            {/* Follower Count Badge */}
            <div className="absolute top-4 right-4 z-10">
              <div className="bg-yellow-400 text-black px-4 py-2 font-bold text-lg">
                +300K
                <div className="text-xs font-normal">FOLLOWERS</div>
              </div>
            </div>

            {/* Main Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="/Store.png"
                alt="Market scene with food vendors"
                className="w-full h-[500px] object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x500/4A5568/white?text=Food+Market';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            {/* Food Categories */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-gradient-to-br from-orange-400 to-red-500 rounded-xl p-4 text-white text-center hover:scale-105 transition-transform cursor-pointer">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="font-bold text-sm">Recettes</h4>
                <p className="text-xs opacity-90">Traditionnelles</p>
              </div>

              <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-xl p-4 text-white text-center hover:scale-105 transition-transform cursor-pointer">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className="font-bold text-sm">Innovation</h4>
                <p className="text-xs opacity-90">Culinaire</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-red-500 mb-2">150+</div>
            <div className="text-gray-600">Chefs Partenaires</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-orange-500 mb-2">500+</div>
            <div className="text-gray-600">Recettes Partagées</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-green-500 mb-2">25+</div>
            <div className="text-gray-600">Événements Culinaires</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-blue-500 mb-2">50K+</div>
            <div className="text-gray-600">Gourmets Connectés</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FoodSection; 