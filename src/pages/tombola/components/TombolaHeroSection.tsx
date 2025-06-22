// import React from 'react';

const TombolaHeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Hero Background Image Container */}
      <div className="relative w-full min-h-screen flex items-center justify-center">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/tombolahero.png" 
            alt="Tombola Background" 
            className="w-full h-full object-cover"
            onLoad={() => console.log('Tombola background image loaded successfully')}
            onError={(e) => {
              console.error('Failed to load background image:', e);
              // Fallback: show a gradient background instead
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)';
              }
              e.currentTarget.style.display = 'none';
            }}
          />
          {/* Darker overlay for tombola theme */}
          <div className="absolute inset-0 bg-black opacity-50" style={{ zIndex: 0 }}></div>
        </div>

        {/* Geometric Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 15 }}>
          {/* Left side geometric pattern */}
          <div className="absolute top-0 left-0 w-[30%] h-full">
            <div className="absolute top-1/4 left-10 w-16 h-16 bg-yellow-400 transform rotate-45 opacity-80 animate-spin-slow"></div>
            <div className="absolute top-1/3 left-20 w-12 h-12 bg-red-500 transform rotate-12 opacity-70 animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-1/2 left-5 w-20 h-8 bg-cyan-400 transform -rotate-45 opacity-75 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/3 left-16 w-14 h-14 bg-green-400 rounded-full opacity-80 animate-ping" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute bottom-1/4 left-8 w-10 h-20 bg-purple-500 transform rotate-30 opacity-70 animate-wiggle" style={{ animationDelay: '2s' }}></div>
          </div>
          
          {/* Right side geometric pattern */}
          <div className="absolute top-0 right-0 w-[30%] h-full">
            <div className="absolute top-1/4 right-10 w-16 h-16 bg-orange-400 transform -rotate-45 opacity-80 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            <div className="absolute top-1/3 right-20 w-12 h-12 bg-pink-500 transform rotate-45 opacity-70 animate-spin-slow" style={{ animationDelay: '0.8s' }}></div>
            <div className="absolute top-1/2 right-5 w-20 h-8 bg-blue-400 transform rotate-45 opacity-75 animate-pulse" style={{ animationDelay: '1.3s' }}></div>
            <div className="absolute bottom-1/3 right-16 w-14 h-14 bg-yellow-500 rounded-full opacity-80 animate-ping" style={{ animationDelay: '1.8s' }}></div>
            <div className="absolute bottom-1/4 right-8 w-10 h-20 bg-red-400 transform -rotate-30 opacity-70 animate-wiggle" style={{ animationDelay: '2.3s' }}></div>
          </div>
        </div>

        {/* Floating Lottery Tickets */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ zIndex: 20 }}>
          {/* Ticket 1 */}
          <div className="absolute top-20 left-1/4 transform rotate-12 animate-bounce" style={{ animationDelay: '0s' }}>
            <div className="bg-white rounded-lg p-3 shadow-lg border-2 border-dashed border-gray-300">
              <div className="text-xs font-bold text-gray-800">#1205</div>
            </div>
          </div>
          
          {/* Ticket 2 */}
          <div className="absolute top-32 right-1/4 transform -rotate-12 animate-bounce" style={{ animationDelay: '1s' }}>
            <div className="bg-yellow-100 rounded-lg p-3 shadow-lg border-2 border-dashed border-yellow-400">
              <div className="text-xs font-bold text-yellow-800">#7749</div>
            </div>
          </div>
          
          {/* Ticket 3 */}
          <div className="absolute bottom-32 left-1/3 transform rotate-6 animate-bounce" style={{ animationDelay: '2s' }}>
            <div className="bg-cyan-100 rounded-lg p-3 shadow-lg border-2 border-dashed border-cyan-400">
              <div className="text-xs font-bold text-cyan-800">#3052</div>
            </div>
          </div>
          
          {/* Ticket 4 */}
          <div className="absolute bottom-40 right-1/3 transform -rotate-6 animate-bounce" style={{ animationDelay: '3s' }}>
            <div className="bg-pink-100 rounded-lg p-3 shadow-lg border-2 border-dashed border-pink-400">
              <div className="text-xs font-bold text-pink-800">#9826</div>
            </div>
          </div>
        </div>

        {/* Spinning Wheel Icon - Positioned to the right */}
        <div className="absolute top-10 right-10 hidden lg:block z-40">
          <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-spin-slow shadow-lg">
            <svg className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <path d="M12 6l-4 6h8l-4-6z"/>
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-30 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            TOMBOLA WAY
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Le festival WhataboutYou vous offre l'occasion de repartir avec des cadeaux incroyables grâce à notre grande tombola. Achetez un ou plusieurs tickets et tentez de faire partie des heureux gagnants !
          </p>

          {/* Carousel Dots */}
          <div className="flex justify-center space-x-2 mb-8">
            <div className="w-3 h-3 bg-white rounded-full opacity-50"></div>
            <div className="w-3 h-3 bg-white rounded-full"></div>
            <div className="w-3 h-3 bg-white rounded-full opacity-50"></div>
            <div className="w-3 h-3 bg-white rounded-full opacity-50"></div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <button className="group flex items-center justify-center bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[250px]">
              <div className="w-5 h-5 mr-3 flex-shrink-0">
                <svg className="w-full h-full" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                  <path d="M12 6l-4 6h8l-4-6z"/>
                </svg>
              </div>
              <span>PARTICIPER À LA TOMBOLA</span>
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-100 to-transparent"></div>
      </div>

      {/* Mobile Spinning Wheel - Smaller version for smaller screens */}
      <div className="absolute top-5 right-5 lg:hidden z-40">
        <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-spin-slow shadow-lg">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <path d="M12 6l-4 6h8l-4-6z"/>
          </svg>
        </div>
      </div>

      {/* Floating confetti-like elements */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-yellow-400 rotate-45 opacity-70 animate-ping hidden lg:block" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-red-400 rounded-full opacity-80 animate-pulse hidden lg:block" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-1/4 left-1/3 w-5 h-5 bg-cyan-400 rounded-full opacity-60 animate-bounce hidden lg:block" style={{ animationDelay: '3s' }}></div>
      <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-green-400 rotate-45 opacity-75 animate-pulse hidden lg:block" style={{ animationDelay: '4s' }}></div>
      
      {/* Additional floating elements */}
      <div className="absolute top-16 left-1/2 w-6 h-6 bg-purple-400 rounded-full opacity-60 animate-float hidden lg:block" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute top-1/2 left-1/5 w-8 h-2 bg-orange-400 opacity-70 animate-slide-right hidden lg:block" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute bottom-16 right-1/2 w-5 h-5 bg-pink-400 rotate-45 opacity-65 animate-wiggle hidden lg:block" style={{ animationDelay: '2.5s' }}></div>
      <div className="absolute top-2/3 right-1/5 w-3 h-8 bg-cyan-500 opacity-75 animate-slide-left hidden lg:block" style={{ animationDelay: '3.5s' }}></div>
      
      {/* Sparkling effects */}
      <div className="absolute top-20 right-1/3 w-2 h-2 bg-white rounded-full opacity-90 animate-twinkle hidden lg:block" style={{ animationDelay: '0.2s' }}></div>
      <div className="absolute top-1/3 left-1/3 w-1 h-1 bg-yellow-300 rounded-full opacity-95 animate-twinkle hidden lg:block" style={{ animationDelay: '1.2s' }}></div>
      <div className="absolute bottom-20 left-1/4 w-2 h-2 bg-white rounded-full opacity-85 animate-twinkle hidden lg:block" style={{ animationDelay: '2.2s' }}></div>
      <div className="absolute bottom-1/3 right-2/3 w-1 h-1 bg-cyan-300 rounded-full opacity-90 animate-twinkle hidden lg:block" style={{ animationDelay: '3.2s' }}></div>
    </section>
  );
};

export default TombolaHeroSection; 