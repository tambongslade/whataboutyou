import React, { useState } from 'react';

const EventsHeroSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Plus récent');

  const sortOptions = [
    'Plus récent',
    'Plus ancien',
    'Par popularité',
    'Par date'
  ];

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Hero Background Image Container */}
      <div className="relative w-full min-h-screen flex items-center justify-center">
        {/* Hero Background Image */}
        <div className="absolute inset-0">
          <img 
            src="/eventhero.png" 
            alt="Events Hero Background" 
            className="w-full h-full object-cover"
            onLoad={() => console.log('Background image loaded successfully')}
            onError={(e) => {
              console.error('Failed to load background image:', e);
              // Fallback: show a gradient background instead
              if (e.currentTarget.parentElement) {
                e.currentTarget.parentElement.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
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

        {/* Yellow Bulb Icon - Top Right */}
        <div className="absolute top-10 right-10 z-40">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-30 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
          {/* Title */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
            ÉVÉNEMENTS
          </h1>
          
          {/* Description */}
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonumy eirmod tempor invidunt ut 
            labore et dolore magna aliquyam erat
          </p>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              {/* Search Input */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Consulter les événements des années précédentes"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white text-gray-900 rounded-xl border-0 focus:ring-2 focus:ring-red-500 focus:outline-none placeholder-gray-500 text-lg"
                />
              </div>

              {/* Search Button */}
              <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors duration-300 flex items-center justify-center min-w-[120px]">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Rechercher
              </button>

              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-900/80 text-white px-6 py-4 rounded-xl border border-white/20 focus:ring-2 focus:ring-yellow-400 focus:outline-none cursor-pointer text-lg min-w-[160px]"
                >
                  {sortOptions.map((option) => (
                    <option key={option} value={option} className="bg-gray-900 text-white">
                      {option}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-100 to-transparent"></div>
        
        {/* Floating Yellow Elements */}
        <div className="absolute top-20 left-10 w-12 h-12 bg-yellow-400 rounded-full opacity-60 animate-pulse hidden lg:block"></div>
        <div className="absolute bottom-32 right-20 w-8 h-8 bg-yellow-400 rounded-full opacity-80 animate-bounce hidden lg:block" style={{ animationDelay: '1s' }}></div>
      </div>
    </section>
  );
};

export default EventsHeroSection; 