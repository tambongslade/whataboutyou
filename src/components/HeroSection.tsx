import { useState, useEffect } from 'react';
import OptimizedImage from './OptimizedImage';
import TicketPurchaseModal from './TicketPurchaseModal';

const HeroSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  // Array of actual WAY images for the background slideshow
  const backgroundImages = [
    '/Header.webp',
    '/way1/DSC_5516.webp',
    '/way 2/EmptyName 390.webp',
    '/eventhero.webp'
  ];

  // Auto-change background every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <section className="relative min-h-screen overflow-hidden ">
      {/* Hero Background Image Container */}
      <div className="relative w-full min-h-screen flex items-center justify-center">
        {/* Hero Background Image */}
   
        <div className="absolute inset-0 ">
          <OptimizedImage 
            src={backgroundImages[currentBgIndex] || '/Header.webp'} 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            priority={true}
            loading="eager"
            sizes="100vw"
          />
          {/* Transparent overlay for text readability */}
          <div className="absolute inset-0 bg-black opacity-30" style={{ zIndex: 0 }}></div>
        </div>

        {/* Light Effects SVG - Positioned on top with 30% coverage on left and right */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 15 }}>
          {/* Left side lights - 30% width */}
          <img 
            src="/Lights.svg" 
            alt="Light Effects Left" 
            className="absolute top-0 left-0 w-[30%] h-full object-cover opacity-70"
          />
          
          {/* Right side lights - 30% width, mirrored */}
          <img 
            src="/Lights.svg" 
            alt="Light Effects Right" 
            className="absolute top-0 right-0 w-[30%] h-full object-cover opacity-70 scale-x-[-1]"
          />
        </div>

        {/* Bulb Image - Positioned to the right */}
        <div className="absolute top-10 right-10 hidden lg:block z-40">
          <OptimizedImage 
            src="/bulb.webp" 
            alt="Lightbulb" 
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain animate-pulse"
            loading="lazy"
          />
        </div>

        {/* Main Content */}
        <div className="relative z-30 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            QUELLE EST TA
            <br />
            <span className="text-yellow-400">SITUATION ACTUELLE</span> ?
          </h1>
          
          <div className="mb-8">
            <span className="text-2xl sm:text-3xl font-bold text-white bg-gradient-to-r from-red-500 to-orange-500 px-6 py-3 rounded-full">
              WHAT ABOUT YOU - WAY
            </span>
          </div>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Foire entrepreneuriale, socio-culturelle et de divertissement qui mobilise les jeunes autour de l'entrepreneuriat et de l'innovation. Rejoignez-nous pour des expositions, conférences, salon professionnel et divertissements uniques.
          </p>

          {/* Identity Colors */}
          {/* <div className="flex justify-center space-x-4 mb-8">
            <div className="flex items-center space-x-2 px-4 py-2 bg-red-500 rounded-full text-white font-semibold">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="text-sm sm:text-base">Rouge: Étudiant</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-blue-500 rounded-full text-white font-semibold">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="text-sm sm:text-base">Bleu: Collégien</span>
            </div>
            <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 rounded-full text-white font-semibold">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="text-sm sm:text-base">Jaune: Travailleur</span>
            </div>
          </div> */}

          {/* Action Button */}
          <div className="flex justify-center">
            <button 
              onClick={handleOpenModal}
              className="group flex items-center justify-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-12 py-6 rounded-xl font-bold text-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl"
            >
              <div className="w-8 h-8 mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path d="M22,15.04C22,17.23 20.24,19 18.07,19H5.93C3.76,19 2,17.23 2,15.04C2,13.07 3.43,11.44 5.31,11.14C5.28,11 5.27,10.86 5.27,10.71C5.27,9.33 6.38,8.2 7.76,8.2C8.37,8.2 8.94,8.43 9.37,8.8C10.14,7.05 11.13,5.44 13.91,5.44C17.28,5.44 18.87,8.06 18.87,10.83C18.87,10.94 18.87,11.06 18.86,11.17C20.65,11.54 22,13.13 22,15.04Z"/>
                </svg>
              </div>
              <span>ACHETEZ VOTRE TICKET!</span>
            </button>
          </div>
        </div>

        {/* Additional decorative light rays for bottom */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-100 to-transparent"></div>
      </div>

      {/* Mobile Bulb - Smaller version for smaller screens */}
      <div className="absolute top-5 right-5 lg:hidden z-40">
        <OptimizedImage 
          src="/bulb.webp" 
          alt="Lightbulb" 
          className="w-12 h-12 object-contain animate-pulse"
          loading="lazy"
        />
      </div>

      {/* Yellow floating elements (similar to the yellow corner in your design) */}
      <div className="absolute top-10 right-10 w-16 h-16 bg-yellow-400 rounded-full opacity-80 animate-bounce slow hidden lg:block" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 left-10 w-12 h-12 bg-yellow-400 rounded-full opacity-60 animate-pulse hidden lg:block"></div>

      {/* Ticket Purchase Modal */}
      <TicketPurchaseModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
    </section>
  );
};

export default HeroSection; 