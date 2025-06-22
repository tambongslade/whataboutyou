// import React from 'react';

const MissAndMasterHeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Hero Background Image Container */}
      <div className="relative w-full min-h-screen flex items-center justify-center">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/missandmasterhero.png" 
            alt="Miss & Master Background" 
            className="w-full h-full object-cover"
            onLoad={() => console.log('Miss & Master background image loaded successfully')}
            onError={(e) => {
              console.error('Failed to load background image:', e);
              // Fallback: show a gradient background instead
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
              }
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Transparent overlay for text readability */}
          <div className="absolute inset-0 bg-black opacity-40" style={{ zIndex: 0 }}></div>
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

        {/* Crown Icon - Positioned to the right */}
        <div className="absolute top-10 right-10 hidden lg:block z-40">
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center bg-yellow-400 rounded-full animate-pulse">
            <svg className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 16L3 8l5.5 2L12 4l3.5 6L21 8l-2 8H5zm2.7-2h8.6l.9-4.4-2.6 1-2-3.4-2 3.4-2.6-1L7.7 14z"/>
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-30 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            MISS & MASTER
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Découvrez les candidats, les beauté créée d'esprit et d'âme, la popularité et concours de l'élégance
          </p>

          <p className="text-base sm:text-lg text-gray-300 mb-12 max-w-2xl mx-auto">
            Chaque participant - organisé dans un style américain fashion!
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher un candidat..."
                className="w-full px-6 py-4 pr-16 rounded-full text-gray-800 text-lg font-medium bg-white/90 backdrop-blur-sm border-2 border-transparent focus:border-yellow-400 focus:outline-none transition-all duration-300"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white p-3 rounded-full transition-colors duration-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Participate Button */}
            <button className="group flex items-center justify-center bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[200px]">
              <div className="w-5 h-5 mr-3 flex-shrink-0">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 16L3 8l5.5 2L12 4l3.5 6L21 8l-2 8H5zm2.7-2h8.6l.9-4.4-2.6 1-2-3.4-2 3.4-2.6-1L7.7 14z"/>
                </svg>
              </div>
              <span>PARTICIPER</span>
            </button>

            {/* View Candidates Button */}
            <button className="group flex items-center justify-center bg-white text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[200px]">
              <div className="w-5 h-5 mr-3 flex-shrink-0">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 7V9C15 10.1 14.1 11 13 11V22H11V16H9V22H7V11C5.9 11 5 10.1 5 9V7H3V9C3 11.2 4.8 13 7 13V22H17V13C19.2 13 21 11.2 21 9Z"/>
                </svg>
              </div>
              <span>VOIR CANDIDATS</span>
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-100 to-transparent"></div>
      </div>

      {/* Mobile Crown - Smaller version for smaller screens */}
      <div className="absolute top-5 right-5 lg:hidden z-40">
        <div className="w-12 h-12 flex items-center justify-center bg-yellow-400 rounded-full animate-pulse">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M5 16L3 8l5.5 2L12 4l3.5 6L21 8l-2 8H5zm2.7-2h8.6l.9-4.4-2.6 1-2-3.4-2 3.4-2.6-1L7.7 14z"/>
          </svg>
        </div>
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 w-16 h-16 bg-pink-400 rounded-full opacity-80 animate-bounce slow hidden lg:block" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-20 right-10 w-12 h-12 bg-purple-400 rounded-full opacity-60 animate-pulse hidden lg:block"></div>
      
      {/* Confetti-like decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rotate-45 opacity-70 animate-ping hidden lg:block" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-pink-400 rounded-full opacity-80 animate-pulse hidden lg:block" style={{ animationDelay: '3s' }}></div>
    </section>
  );
};

export default MissAndMasterHeroSection; 