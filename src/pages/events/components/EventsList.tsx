import React, { useState } from 'react';
import WAYGallery from '../../../components/WAYGallery';

interface Event {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  location: string;
  dateRange: string;
  featured?: boolean;
  likes?: number;
  comments?: number;
}

const EventsList: React.FC = () => {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [selectedEdition, setSelectedEdition] = useState<string>('');

  const handleGalleryOpen = (edition: string) => {
    setSelectedEdition(edition);
    setGalleryOpen(true);
  };

  const events: Event[] = [
    {
      id: 1,
      title: "WHATABOUTYOU",
      subtitle: "4ÈME ÉDITION",
      description: "La quatrième édition de What About You promet d'être exceptionnelle ! Rejoignez-nous pour une grande foire entrepreneuriale jeune avec exposition vente, conférences inspirantes, concours Miss What About You, manèges et concerts divertissants. Un événement qui transforme les rêves en réalité.",
      image: "/eventhero.webp",
      location: "PALAIS DE CONGRÈS",
      dateRange: "21 - 26 JUILLET 2024",
      featured: true,
      likes: 342,
      comments: 89
    },
    {
      id: 2,
      title: "WHATABOUTYOU",
      subtitle: "3ÈME ÉDITION",
      description: "La troisième édition a marqué un tournant dans l'histoire de What About You. Avec plus de 3000 participants, cette édition a démontré la force de l'entrepreneuriat jeune au Cameroun. Des moments inoubliables, des connexions précieuses et des opportunités uniques.",
      image: "/WhatAboutYou - Events.webp",
      location: "PALAIS DE CONGRÈS",
      dateRange: "9 - 13 JUILLET 2024",
      likes: 298,
      comments: 67
    },
    {
      id: 3,
      title: "WHATABOUTYOU",
      subtitle: "2ÈME ÉDITION",
      description: "La deuxième édition a consolidé les bases de What About You en tant qu'événement phare de l'entrepreneuriat jeune. Une expérience enrichissante qui a inspiré des centaines de jeunes à poursuivre leurs rêves et à croire en leurs capacités.",
      image: "/way 2/EmptyName 3.webp",
      location: "PALAIS DE CONGRÈS",
      dateRange: "19 - 23 JUILLET 2023",
      likes: 187,
      comments: 43
    },
    {
      id: 4,
      title: "WHATABOUTYOU",
      subtitle: "1ÈRE ÉDITION",
      description: "Le commencement d'une grande aventure ! La première édition de What About You a posé les premières pierres d'un événement qui allait changer la vie de nombreux jeunes entrepreneurs. Un moment historique qui a marqué le début d'un mouvement inspirant.",
      image: "/way1/DSC_5516.webp",
      location: "PALAIS DE CONGRÈS",
      dateRange: "6 - 8 AVRIL 2023",
      likes: 156,
      comments: 34
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-1 bg-gray-800 mx-auto mb-6"></div>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            NOS ÉDITIONS
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez l'évolution de What About You à travers ses différentes éditions
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
                        PROCHAINE ÉDITION
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
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2 2v12a2 2 0 002 2z" />
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

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Like Button */}
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="font-medium">{event.likes}</span>
                      </button>

                      {/* Comment Button */}
                      <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="font-medium">{event.comments}</span>
                      </button>
                    </div>

                    {/* Info Button */}
                    <button 
                      onClick={() => {
                        if (event.subtitle === "1ÈRE ÉDITION") {
                          handleGalleryOpen('1ère');
                        } else if (event.subtitle === "2ÈME ÉDITION") {
                          handleGalleryOpen('2ème');
                        } else {
                          // Handle other editions or general info
                          console.log('Info for', event.subtitle);
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-base transition-colors duration-300 flex items-center"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {(event.subtitle === "1ÈRE ÉDITION" || event.subtitle === "2ÈME ÉDITION") ? "VOIR LA GALERIE" : "EN SAVOIR PLUS"}
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

      {/* WAY Gallery Modal */}
      <WAYGallery 
        isOpen={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        edition={selectedEdition}
      />
    </section>
  );
};

export default EventsList; 