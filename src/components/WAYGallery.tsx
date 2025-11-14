import React, { useState, useEffect } from 'react';

interface GalleryItem {
  id: string;
  type: 'image' | 'video';
  src: string;
  thumbnail?: string;
  alt: string;
  caption?: string;
}

interface WAYGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  edition: string;
}

const WAYGallery: React.FC<WAYGalleryProps> = ({ isOpen, onClose, edition }) => {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // WAY 1ère édition gallery items
  const way1Images: GalleryItem[] = [
    { id: '1', type: 'image', src: '/way1/DSC_5516.webp', alt: 'WAY 1ère édition - Moment 1', caption: 'Ouverture de la première édition de What About You' },
    { id: '2', type: 'image', src: '/way1/DSC_5527.webp', alt: 'WAY 1ère édition - Moment 2', caption: 'Entrepreneurs présentant leurs projets' },
    { id: '3', type: 'image', src: '/way1/DSC_5572.webp', alt: 'WAY 1ère édition - Moment 3', caption: 'Échanges entre participants' },
    { id: '4', type: 'image', src: '/way1/DSC_5628.webp', alt: 'WAY 1ère édition - Moment 4', caption: 'Stand d\'exposition créatif' },
    { id: '5', type: 'image', src: '/way1/DSC_5636.webp', alt: 'WAY 1ère édition - Moment 5', caption: 'Présentation de produits innovants' },
    { id: '6', type: 'image', src: '/way1/DSC_5652.webp', alt: 'WAY 1ère édition - Moment 6', caption: 'Networking entre jeunes entrepreneurs' },
    { id: '7', type: 'image', src: '/way1/DSC_5737.webp', alt: 'WAY 1ère édition - Moment 7', caption: 'Conférence entrepreneuriale' },
    { id: '8', type: 'image', src: '/way1/DSC_5795.webp', alt: 'WAY 1ère édition - Moment 8', caption: 'Démonstration de savoir-faire' },
    { id: '9', type: 'image', src: '/way1/DSC_5904.webp', alt: 'WAY 1ère édition - Moment 9', caption: 'Ambiance festive et entrepreneuriale' },
    { id: '10', type: 'image', src: '/way1/DSC_5918.webp', alt: 'WAY 1ère édition - Moment 10', caption: 'Jeunes talents en action' },
    { id: '11', type: 'image', src: '/way1/DSC_5942.webp', alt: 'WAY 1ère édition - Moment 11', caption: 'Créativité et innovation' },
    { id: '12', type: 'image', src: '/way1/DSC_5983.webp', alt: 'WAY 1ère édition - Moment 12', caption: 'Rencontres professionnelles' },
    { id: '13', type: 'image', src: '/way1/DSC_6003.webp', alt: 'WAY 1ère édition - Moment 13', caption: 'Exposition de projets étudiants' },
    { id: '14', type: 'image', src: '/way1/DSC_6021.webp', alt: 'WAY 1ère édition - Moment 14', caption: 'Moments de partage et d\'apprentissage' },
    { id: '15', type: 'image', src: '/way1/DSC_6025.webp', alt: 'WAY 1ère édition - Moment 15', caption: 'Clôture mémorable de la première édition' },
    { id: '16', type: 'image', src: '/way1/DSC_6107.webp', alt: 'WAY 1ère édition - Moment 16', caption: 'Innovation technologique jeune' },
    { id: '17', type: 'image', src: '/way1/DSC_6113.webp', alt: 'WAY 1ère édition - Moment 17', caption: 'Entrepreneuriat social en action' },
    { id: '18', type: 'image', src: '/way1/DSC_6151.webp', alt: 'WAY 1ère édition - Moment 18', caption: 'Diversité culturelle et entrepreneuriale' },
    { id: '19', type: 'image', src: '/way1/DSC_6172.webp', alt: 'WAY 1ère édition - Moment 19', caption: 'Succès et célébration' },
    { id: '20', type: 'image', src: '/way1/DSC_6217.webp', alt: 'WAY 1ère édition - Moment 20', caption: 'L\'avenir de l\'entrepreneuriat jeune' },
  ];

  // WAY 2ème édition gallery items
  const way2Images: GalleryItem[] = [
    // Photos
    { id: '2-1', type: 'image', src: '/way 2/EmptyName.webp', alt: 'WAY 2ème édition - Moment 1', caption: 'Ouverture spectaculaire de la deuxième édition' },
    { id: '2-2', type: 'image', src: '/way 2/EmptyName 3.webp', alt: 'WAY 2ème édition - Moment 2', caption: 'Innovation et créativité à l\'honneur' },
    { id: '2-3', type: 'image', src: '/way 2/EmptyName 15.webp', alt: 'WAY 2ème édition - Moment 3', caption: 'Jeunes entrepreneurs en action' },
    { id: '2-4', type: 'image', src: '/way 2/EmptyName 18.webp', alt: 'WAY 2ème édition - Moment 4', caption: 'Stands créatifs et innovants' },
    { id: '2-5', type: 'image', src: '/way 2/EmptyName 22.webp', alt: 'WAY 2ème édition - Moment 5', caption: 'Networking et échanges professionnels' },
    { id: '2-6', type: 'image', src: '/way 2/EmptyName 23.webp', alt: 'WAY 2ème édition - Moment 6', caption: 'Présentation de projets innovants' },
    { id: '2-7', type: 'image', src: '/way 2/EmptyName 27 copy.webp', alt: 'WAY 2ème édition - Moment 7', caption: 'Ambiance festive et entrepreneuriale' },
    { id: '2-8', type: 'image', src: '/way 2/EmptyName 36.webp', alt: 'WAY 2ème édition - Moment 8', caption: 'Diversité des participants' },
    { id: '2-9', type: 'image', src: '/way 2/EmptyName 40.webp', alt: 'WAY 2ème édition - Moment 9', caption: 'Collaboration inter-générationnelle' },
    { id: '2-10', type: 'image', src: '/way 2/EmptyName 46.webp', alt: 'WAY 2ème édition - Moment 10', caption: 'Succès et célébration' },
    { id: '2-11', type: 'image', src: '/way 2/EmptyName 59.webp', alt: 'WAY 2ème édition - Moment 11', caption: 'Innovation technologique' },
    { id: '2-12', type: 'image', src: '/way 2/EmptyName 70.webp', alt: 'WAY 2ème édition - Moment 12', caption: 'Entrepreneuriat social' },
    { id: '2-13', type: 'image', src: '/way 2/EmptyName 71 copy.webp', alt: 'WAY 2ème édition - Moment 13', caption: 'Moments de partage et d\'apprentissage' },
    { id: '2-14', type: 'image', src: '/way 2/EmptyName 75.webp', alt: 'WAY 2ème édition - Moment 14', caption: 'Créativité des jeunes talents' },
    { id: '2-15', type: 'image', src: '/way 2/EmptyName 79 copy.webp', alt: 'WAY 2ème édition - Moment 15', caption: 'Vision entrepreneuriale' },
    { id: '2-16', type: 'image', src: '/way 2/EmptyName 92 copy.webp', alt: 'WAY 2ème édition - Moment 16', caption: 'Développement économique local' },
    { id: '2-17', type: 'image', src: '/way 2/EmptyName 141.webp', alt: 'WAY 2ème édition - Moment 17', caption: 'Échanges culturels et économiques' },
    { id: '2-18', type: 'image', src: '/way 2/EmptyName 144.webp', alt: 'WAY 2ème édition - Moment 18', caption: 'Partenariats stratégiques' },
    { id: '2-19', type: 'image', src: '/way 2/EmptyName 149.webp', alt: 'WAY 2ème édition - Moment 19', caption: 'Démonstrations innovantes' },
    { id: '2-20', type: 'image', src: '/way 2/EmptyName 205.webp', alt: 'WAY 2ème édition - Moment 20', caption: 'Réseautage professionnel' },
    { id: '2-21', type: 'image', src: '/way 2/EmptyName 216.webp', alt: 'WAY 2ème édition - Moment 21', caption: 'Inspiration entrepreneuriale' },
    { id: '2-22', type: 'image', src: '/way 2/EmptyName 243.webp', alt: 'WAY 2ème édition - Moment 22', caption: 'Solutions créatives' },
    { id: '2-23', type: 'image', src: '/way 2/EmptyName 283.webp', alt: 'WAY 2ème édition - Moment 23', caption: 'Écosystème entrepreneurial' },
    { id: '2-24', type: 'image', src: '/way 2/EmptyName 295.webp', alt: 'WAY 2ème édition - Moment 24', caption: 'Innovation durable' },
    { id: '2-25', type: 'image', src: '/way 2/EmptyName 353.webp', alt: 'WAY 2ème édition - Moment 25', caption: 'Impact social positif' },
    { id: '2-26', type: 'image', src: '/way 2/EmptyName 371.webp', alt: 'WAY 2ème édition - Moment 26', caption: 'Excellence entrepreneuriale' },
    { id: '2-27', type: 'image', src: '/way 2/EmptyName 372.webp', alt: 'WAY 2ème édition - Moment 27', caption: 'Succès de la deuxième édition' },
    { id: '2-28', type: 'image', src: '/way 2/EmptyName 390.webp', alt: 'WAY 2ème édition - Moment 28', caption: 'Croissance entrepreneuriale' },
    { id: '2-29', type: 'image', src: '/way 2/EmptyName 391.webp', alt: 'WAY 2ème édition - Moment 29', caption: 'Avenir prometteur' },
    
    // Drone photos
    { id: '2-30', type: 'image', src: '/way 2/dji_fly_20230721_221928_583_1690010984233_photo.webp', alt: 'WAY 2ème édition - Vue aérienne 1', caption: 'Vue aérienne spectaculaire de l\'événement' },
    { id: '2-31', type: 'image', src: '/way 2/dji_fly_20230723_190932_645_1690158914563_photo.webp', alt: 'WAY 2ème édition - Vue aérienne 2', caption: 'Ampleur et envergure de WAY 2ème édition' },
    { id: '2-32', type: 'image', src: '/way 2/dji_fly_20230723_210652_649_1690158906603_photo.webp', alt: 'WAY 2ème édition - Vue aérienne 3', caption: 'Perspective unique sur l\'événement' },
    { id: '2-33', type: 'image', src: '/way 2/dji_fly_20230723_210912_651_1690158901756_photo.webp', alt: 'WAY 2ème édition - Vue aérienne 4', caption: 'Impact visuel de la deuxième édition' },
    
    // Videos
    { id: '2-v1', type: 'video', src: '/way 2/360061454_820511212648692_509885440515438493_n.mp4', alt: 'WAY 2ème édition - Highlights vidéo 1', caption: 'Résumé vidéo des meilleurs moments de la 2ème édition' },
    { id: '2-v2', type: 'video', src: '/way 2/MVI_7365~1.mp4', alt: 'WAY 2ème édition - Highlights vidéo 2', caption: 'Ambiance et énergie de WAY 2ème édition' },
  ];

  const galleryItems = edition === '1ère' ? way1Images : edition === '2ème' ? way2Images : [];

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      document.body.style.overflow = 'hidden';
      // Simulate loading time for better UX
      setTimeout(() => setIsLoading(false), 500);
    } else {
      document.body.style.overflow = 'unset';
      setSelectedItem(null);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const openLightbox = (item: GalleryItem, index: number) => {
    setSelectedItem(item);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedItem(null);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : galleryItems.length - 1;
    setCurrentIndex(newIndex);
    const newItem = galleryItems[newIndex];
    if (newItem) {
      setSelectedItem(newItem);
    }
  };

  const goToNext = () => {
    const newIndex = currentIndex < galleryItems.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    const newItem = galleryItems[newIndex];
    if (newItem) {
      setSelectedItem(newItem);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  useEffect(() => {
    if (selectedItem) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [selectedItem, currentIndex]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-yellow-50 z-50 overflow-y-auto">
      {/* Gallery Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 z-10 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 via-blue-600 to-yellow-600 bg-clip-text text-transparent">
              WHAT ABOUT YOU - {edition.toUpperCase()} ÉDITION
            </h2>
            <p className="text-gray-600 mt-2 text-lg">
              {galleryItems.filter(item => item.type === 'image').length} photos
              {galleryItems.filter(item => item.type === 'video').length > 0 && 
                ` • ${galleryItems.filter(item => item.type === 'video').length} vidéos`
              } de l'événement entrepreneurial
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-red-500 p-3 rounded-full hover:bg-red-50 transition-all duration-300 shadow-md bg-white border border-gray-200"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-yellow-400 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-700 text-xl font-medium">Chargement de la galerie...</p>
            <p className="text-gray-500 text-sm mt-2">Préparer vos souvenirs entrepreneuriaux</p>
          </div>
        </div>
      )}

      {/* Gallery Grid */}
      {!isLoading && (
        <div className="p-6 max-w-7xl mx-auto">
          {/* Decorative Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-16 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded"></div>
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div className="w-16 h-1 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Moments Entrepreneuriaux</h3>
            <p className="text-gray-600">Revivez les meilleurs moments de notre édition {edition}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {galleryItems.map((item, index) => (
              <div
                key={item.id}
                className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer transform hover:scale-105 hover:rotate-1 transition-all duration-500 shadow-lg hover:shadow-2xl bg-white border-2 border-gray-100 hover:border-yellow-300"
                onClick={() => openLightbox(item, index)}
              >
                {item.type === 'video' ? (
                  <video
                    src={item.src}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    onError={(e) => {
                      console.error('Video failed to load:', item.src);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.alt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error('Image failed to load:', item.src);
                      e.currentTarget.src = 'https://via.placeholder.com/400x400/E5E7EB/6B7280?text=Image+Non+Disponible';
                    }}
                  />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <div className="transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <div className="bg-white shadow-xl rounded-full p-4 border-2 border-yellow-400">
                      {item.type === 'video' ? (
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Media type indicator */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-700 text-sm px-3 py-1 rounded-full flex items-center space-x-2 shadow-md border border-gray-200">
                  {item.type === 'video' && (
                    <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                  <span className="font-medium">{index + 1}</span>
                </div>

                {/* Decorative corner */}
                <div className="absolute top-3 right-3 w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full opacity-80 group-hover:scale-125 transition-transform duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-md z-60 flex items-center justify-center p-6">
          <div className="relative max-w-7xl max-h-full w-full">
            {/* Navigation Buttons */}
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-700 p-4 rounded-full transition-all duration-300 z-10 shadow-xl border border-gray-200 hover:border-blue-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-gray-700 p-4 rounded-full transition-all duration-300 z-10 shadow-xl border border-gray-200 hover:border-blue-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Close Button */}
            <button
              onClick={closeLightbox}
              className="absolute top-4 right-4 bg-white hover:bg-red-50 text-gray-700 hover:text-red-500 p-3 rounded-full transition-all duration-300 z-10 shadow-xl border border-gray-200 hover:border-red-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Main Media */}
            <div className="flex items-center justify-center bg-white rounded-2xl shadow-2xl p-4 border border-gray-200">
              {selectedItem.type === 'video' ? (
                <video
                  src={selectedItem.src}
                  className="max-w-full max-h-[70vh] rounded-xl shadow-lg"
                  controls
                  autoPlay
                  muted
                  onError={(e) => {
                    console.error('Lightbox video failed to load:', selectedItem.src);
                    e.currentTarget.src = '';
                  }}
                />
              ) : (
                <img
                  src={selectedItem.src}
                  alt={selectedItem.alt}
                  className="max-w-full max-h-[70vh] rounded-xl object-contain shadow-lg"
                  onError={(e) => {
                    console.error('Lightbox image failed to load:', selectedItem.src);
                    e.currentTarget.src = 'https://via.placeholder.com/800x600/E5E7EB/6B7280?text=Image+Non+Disponible';
                  }}
                />
              )}
            </div>

            {/* Caption */}
            {selectedItem.caption && (
              <div className="mt-6 text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-200">
                <p className="text-gray-800 text-xl font-medium mb-2">{selectedItem.caption}</p>
                <div className="flex items-center justify-center space-x-4 text-gray-500">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {currentIndex + 1} / {galleryItems.length}
                  </span>
                  <span className="text-sm">
                    {selectedItem.type === 'video' ? '🎥 Vidéo' : '📸 Photo'}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WAYGallery; 