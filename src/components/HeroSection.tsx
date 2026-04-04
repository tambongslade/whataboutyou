import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

const HeroSection = () => {
  const navigate = useNavigate();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  const backgroundImages = [
    '/Header.webp',
    '/way1/DSC_5516.webp',
    '/way 2/EmptyName 390.webp',
    '/eventhero.webp'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image Container */}
      <div className="relative w-full min-h-screen flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0">
          <OptimizedImage
            src={backgroundImages[currentBgIndex] || '/Header.webp'}
            alt="Hero Background"
            className="w-full h-full object-cover"
            priority={true}
            loading="eager"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50"></div>
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

        {/* Main Content */}
        <div className="relative z-30 text-center px-6 sm:px-8 lg:px-12 max-w-6xl mx-auto flex flex-col items-center">
          {/* 3D Logo */}
          <div className="mb-2 md:mb-4 w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] max-w-5xl">
            <img
              src="/logog final 3D.webp"
              alt="What About You"
              className="w-full h-auto drop-shadow-2xl"
            />
          </div>

          {/* Tagline */}
          <p className="font-nekst text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed tracking-wide">
            Partagez où vous en êtes aujourd'hui — étudiant, jeune actif ou entrepreneur — pour rejoindre une communauté qui évolue avec vous et vous ouvre de nouvelles opportunités.
          </p>

          {/* CTA Buttons — Angled/Chevron Shape */}
          <div className="flex flex-col sm:flex-row items-center justify-center">
            {/* EXPLORER — White with angled right edge */}
            <button
              onClick={() => navigate('/way-4')}
              className="font-azonix flex items-center gap-3 bg-white text-black pl-8 pr-12 py-4 text-sm sm:text-base font-bold tracking-wider hover:bg-gray-100 transition-all duration-200 cursor-pointer relative"
              style={{ clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 100%, 0 100%)' }}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              EXPLORER
            </button>

            {/* DÉCOUVRIR — Red with angled left edge, overlaps slightly */}
            <button
              onClick={() => navigate('/way-1')}
              className="font-azonix flex items-center gap-3 bg-red-600 text-white pl-10 pr-8 py-4 text-sm sm:text-base font-bold tracking-wider hover:bg-red-700 transition-all duration-200 cursor-pointer -ml-3 sm:-ml-5 relative"
              style={{ clipPath: 'polygon(20px 0, 100% 0, 100% 100%, 0 100%)' }}
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              DÉCOUVRIR LES ÉDITIONS PRÉCÉDENTES
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
