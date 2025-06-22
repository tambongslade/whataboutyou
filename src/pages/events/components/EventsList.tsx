import React from 'react';

interface Event {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  location: string;
  dateRange: string;
  featured?: boolean;
}

const EventsList: React.FC = () => {
  const events: Event[] = [
    {
      id: 1,
      title: "WHATABOUTYOU",
      subtitle: "4 EME EDITION",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Sed dita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet, consectetur adipiscing elit...",
      image: "/About 1.png",
      location: "HOTEL DE VILLE YDE",
      dateRange: "23 JUIN - 30 JUIN 2023",
      featured: true
    },
    {
      id: 2,
      title: "FESTIVAL CRÉATIF",
      subtitle: "3 EME EDITION",
      description: "Un événement exceptionnel qui rassemble les créateurs de tous horizons pour célébrer l'innovation et la créativité. Découvrez les dernières tendances et rencontrez les talents émergents.",
      image: "/About 2.png",
      location: "PALAIS DES CONGRÈS",
      dateRange: "15 MARS - 22 MARS 2023",
    },
    {
      id: 3,
      title: "NUIT DE L'INNOVATION",
      subtitle: "GALA PREMIUM",
      description: "Une soirée exclusive dédiée aux innovations les plus remarquables avec remise de prix, networking privilégié et showcase des meilleurs projets de l'année.",
      image: "/About 3.png",
      location: "CENTRE CULTUREL",
      dateRange: "10 FÉVRIER 2023",
    },
    {
      id: 4,
      title: "MARCHÉ DES TALENTS",
      subtitle: "EXPOSITION",
      description: "Une exposition unique mettant en avant les œuvres de nos jeunes créateurs avec des démonstrations en direct, ateliers interactifs et vente d'œuvres originales.",
      image: "/About 1.png",
      location: "ESPACE EXPO YAOUNDÉ",
      dateRange: "05 JANVIER - 12 JANVIER 2023",
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-1 bg-gray-800 mx-auto mb-6"></div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            ÉVÉNEMENTS PASSÉS
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les moments forts de nos précédents événements et revivez l'expérience créative
          </p>
        </div>

        {/* Events List */}
        <div className="space-y-8 max-w-7xl mx-auto">
          {events.map((event) => (
            <div
              key={event.id}
              className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ${
                event.featured ? 'ring-2 ring-yellow-400' : ''
              }`}
            >
              {/* Event Card */}
              <div className="flex flex-col lg:flex-row">
                {/* Image Section */}
                <div className="lg:w-2/5 xl:w-1/2 relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-64 lg:h-80 xl:h-96 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/600x400/4A5568/white?text=Event+Image';
                    }}
                  />
                  {event.featured && (
                    <div className="absolute top-4 left-4">
                      <div className="bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold">
                        FEATURED
                      </div>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="lg:w-3/5 xl:w-1/2 p-8 lg:p-10 flex flex-col justify-between">
                  {/* Event Details */}
                  <div>
                    {/* Location and Date Badges */}
                    <div className="flex flex-wrap gap-3 mb-6">
                      <div className="flex items-center bg-yellow-400 text-black px-4 py-2 rounded-full text-sm font-medium">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </div>
                      <div className="flex items-center bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm font-medium">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {event.dateRange}
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                      {event.title}
                      {event.subtitle && (
                        <span className="block text-xl lg:text-2xl text-gray-600 font-medium mt-2">
                          {event.subtitle}
                        </span>
                      )}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-base lg:text-lg leading-relaxed mb-8">
                      {event.description}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div>
                    <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-base transition-colors duration-300 flex items-center">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      LOREM IPSUM
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-4 rounded-lg font-semibold transition-colors duration-300">
            VOIR PLUS D'ÉVÉNEMENTS
          </button>
        </div>
      </div>
    </section>
  );
};

export default EventsList; 