import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

interface ShowcaseImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  edition: '1ère' | '2ème';
  category: 'entrepreneurship' | 'networking' | 'innovation' | 'culture';
}

const WAYShowcaseSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [visibleImages, setVisibleImages] = useState<ShowcaseImage[]>([]);

  const showcaseImages: ShowcaseImage[] = [
    // WAY 1ère édition highlights
    {
      id: '1-1',
      src: '/way1/DSC_5516.webp',
      alt: 'WAY 1ère édition - Ouverture',
      caption: 'Ouverture spectaculaire de la première édition',
      edition: '1ère',
      category: 'entrepreneurship'
    },
    {
      id: '1-2',
      src: '/way1/DSC_5527.webp',
      alt: 'WAY 1ère édition - Présentation',
      caption: 'Jeunes entrepreneurs présentant leurs projets',
      edition: '1ère',
      category: 'entrepreneurship'
    },
    {
      id: '1-3',
      src: '/way1/DSC_5572.webp',
      alt: 'WAY 1ère édition - Échanges',
      caption: 'Moments d\'échange et de networking',
      edition: '1ère',
      category: 'networking'
    },
    {
      id: '1-4',
      src: '/way1/DSC_5628.webp',
      alt: 'WAY 1ère édition - Stands',
      caption: 'Stands créatifs et innovants',
      edition: '1ère',
      category: 'innovation'
    },
    {
      id: '1-5',
      src: '/way1/DSC_5636.webp',
      alt: 'WAY 1ère édition - Produits',
      caption: 'Présentation de produits innovants',
      edition: '1ère',
      category: 'innovation'
    },
    {
      id: '1-6',
      src: '/way1/DSC_5640.webp',
      alt: 'WAY 1ère édition - Ambiance',
      caption: 'Ambiance festive et entrepreneuriale',
      edition: '1ère',
      category: 'culture'
    },
    
    // WAY 2ème édition highlights
    {
      id: '2-1',
      src: '/way 2/EmptyName 3.webp',
      alt: 'WAY 2ème édition - Innovation',
      caption: 'Innovation et créativité à l\'honneur',
      edition: '2ème',
      category: 'innovation'
    },
    {
      id: '2-2',
      src: '/way 2/EmptyName 15.webp',
      alt: 'WAY 2ème édition - Action',
      caption: 'Jeunes entrepreneurs en action',
      edition: '2ème',
      category: 'entrepreneurship'
    },
    {
      id: '2-3',
      src: '/way 2/EmptyName 22.webp',
      alt: 'WAY 2ème édition - Networking',
      caption: 'Networking et échanges professionnels',
      edition: '2ème',
      category: 'networking'
    },
    {
      id: '2-4',
      src: '/way 2/EmptyName 40.webp',
      alt: 'WAY 2ème édition - Collaboration',
      caption: 'Collaboration inter-générationnelle',
      edition: '2ème',
      category: 'networking'
    },
    {
      id: '2-5',
      src: '/way 2/EmptyName 75.webp',
      alt: 'WAY 2ème édition - Talents',
      caption: 'Créativité des jeunes talents',
      edition: '2ème',
      category: 'culture'
    },
    {
      id: '2-6',
      src: '/way 2/EmptyName 390.webp',
      alt: 'WAY 2ème édition - Croissance',
      caption: 'Croissance entrepreneuriale',
      edition: '2ème',
      category: 'entrepreneurship'
    }
  ];

  const filters = [
    { key: 'all', label: 'Tous', color: 'bg-gray-600' },
    { key: 'entrepreneurship', label: 'Entrepreneuriat', color: 'bg-red-500' },
    { key: 'networking', label: 'Networking', color: 'bg-blue-500' },
    { key: 'innovation', label: 'Innovation', color: 'bg-yellow-500' },
    { key: 'culture', label: 'Culture', color: 'bg-green-500' }
  ];

  useEffect(() => {
    const filtered = activeFilter === 'all' 
      ? showcaseImages 
      : showcaseImages.filter(img => img.category === activeFilter);
    setVisibleImages(filtered);
  }, [activeFilter]);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            NOS PLUS BEAUX MOMENTS
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 via-blue-500 to-yellow-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez les moments forts de nos éditions précédentes - entrepreneuriat, innovation, networking et culture
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 transform hover:scale-105 ${
                activeFilter === filter.key 
                  ? `${filter.color} shadow-lg` 
                  : 'bg-gray-400 hover:bg-gray-500'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105"
              style={{
                animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
              }}
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x400/E5E7EB/6B7280?text=WAY+Image';
                  }}
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      image.edition === '1ère' ? 'bg-red-500' : 'bg-blue-500'
                    }`}>
                      {image.edition} édition
                    </span>
                    <span className="text-xs opacity-75 capitalize">{image.category}</span>
                  </div>
                  <p className="text-sm font-medium">{image.caption}</p>
                </div>
              </div>

              {/* Edition Badge */}
              <div className="absolute top-4 left-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                  image.edition === '1ère' ? 'bg-red-500' : 'bg-blue-500'
                }`}>
                  {image.edition === '1ère' ? '1' : '2'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            Vous voulez voir plus de moments comme ceux-ci ? Participez à notre prochaine édition !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/events"
              className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
            >
              Voir toutes les éditions
            </Link>
            <Link
              to="/contact"
              className="border-2 border-blue-500 text-blue-500 px-8 py-4 rounded-lg font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300 transform hover:scale-105"
            >
              Nous rejoindre
            </Link>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
    </section>
  );
};

export default WAYShowcaseSection; 