import OptimizedImage from './OptimizedImage';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden ">
      {/* Hero Background Image Container */}
      <div className="relative w-full min-h-screen flex items-center justify-center">
        {/* Hero Background Image */}
   
        <div className="absolute inset-0 ">
          <OptimizedImage 
            src="/Header.webp" 
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
            QUEL EST VOTRE
            <br />
            <span className="text-yellow-400">SITUATION AMOUREUSE</span> ?
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* First Button with Bulb Icon */}
            <button className="group flex items-center justify-center bg-white text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[200px]">
              <div className="w-5 h-5 mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="17.298" height="24" viewBox="0 0 17.298 24" className="w-full h-full">
                  <g transform="translate(-4.246 -1.279)">
                    <path d="M12.9,1.279a8.639,8.639,0,0,1,4.817,15.814l-.006,0a1.395,1.395,0,0,0-.628,1.164v1.707a.837.837,0,0,1-.837.837H9.551a.837.837,0,0,1-.837-.837V18.261A1.395,1.395,0,0,0,8.079,17.1l-.011-.007A8.647,8.647,0,0,1,4.252,9.607V9.595a8.758,8.758,0,0,1,8.487-8.314C12.792,1.279,12.845,1.279,12.9,1.279ZM16.785,15.7a6.967,6.967,0,0,0-4-12.748,7.085,7.085,0,0,0-6.86,6.719A6.973,6.973,0,0,0,9,15.7a3.068,3.068,0,0,1,1.39,2.558v.873h5.021v-.87a3.068,3.068,0,0,1,1.377-2.56Z" fill="currentColor"/>
                    <path d="M12.434,23.079A6.456,6.456,0,0,1,8.585,21.8a.837.837,0,1,1,1-1.339,4.742,4.742,0,0,0,5.69,0,.837.837,0,1,1,1,1.339A6.456,6.456,0,0,1,12.434,23.079Z" transform="translate(0.463 2.2)" fill="currentColor"/>
                    <path d="M12.327,15.489a.837.837,0,0,1-.716-1.269l1.874-3.113a.054.054,0,0,0,.006-.025.056.056,0,0,0-.056-.056H11.206A1.729,1.729,0,0,1,9.715,8.4l1.85-3.1A.837.837,0,1,1,13,6.156l-1.852,3.1-.006.01a.055.055,0,0,0-.008.028.056.056,0,0,0,.056.057h2.241a1.729,1.729,0,0,1,1.488,2.615l-1.876,3.116A.836.836,0,0,1,12.327,15.489Z" transform="translate(0.603 0.418)" fill="currentColor"/>
                  </g>
                </svg>
              </div>
              <span>LOREM IPSUM</span>
            </button>

            {/* Second Button with Bulb Icon */}
            <button className="group flex items-center justify-center bg-red-500 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg min-w-[200px]">
              <div className="w-5 h-5 mr-3 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="17.298" height="24" viewBox="0 0 17.298 24" className="w-full h-full">
                  <g transform="translate(-4.246 -1.279)">
                    <path d="M12.9,1.279a8.639,8.639,0,0,1,4.817,15.814l-.006,0a1.395,1.395,0,0,0-.628,1.164v1.707a.837.837,0,0,1-.837.837H9.551a.837.837,0,0,1-.837-.837V18.261A1.395,1.395,0,0,0,8.079,17.1l-.011-.007A8.647,8.647,0,0,1,4.252,9.607V9.595a8.758,8.758,0,0,1,8.487-8.314C12.792,1.279,12.845,1.279,12.9,1.279ZM16.785,15.7a6.967,6.967,0,0,0-4-12.748,7.085,7.085,0,0,0-6.86,6.719A6.973,6.973,0,0,0,9,15.7a3.068,3.068,0,0,1,1.39,2.558v.873h5.021v-.87a3.068,3.068,0,0,1,1.377-2.56Z" fill="currentColor"/>
                    <path d="M12.434,23.079A6.456,6.456,0,0,1,8.585,21.8a.837.837,0,1,1,1-1.339,4.742,4.742,0,0,0,5.69,0,.837.837,0,1,1,1,1.339A6.456,6.456,0,0,1,12.434,23.079Z" transform="translate(0.463 2.2)" fill="currentColor"/>
                    <path d="M12.327,15.489a.837.837,0,0,1-.716-1.269l1.874-3.113a.054.054,0,0,0,.006-.025.056.056,0,0,0-.056-.056H11.206A1.729,1.729,0,0,1,9.715,8.4l1.85-3.1A.837.837,0,1,1,13,6.156l-1.852,3.1-.006.01a.055.055,0,0,0-.008.028.056.056,0,0,0,.056.057h2.241a1.729,1.729,0,0,1,1.488,2.615l-1.876,3.116A.836.836,0,0,1,12.327,15.489Z" transform="translate(0.603 0.418)" fill="currentColor"/>
                  </g>
                </svg>
              </div>
              <span>LOREM IPSUM</span>
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
    </section>
  );
};

export default HeroSection; 