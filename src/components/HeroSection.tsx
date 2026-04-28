import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OptimizedImage from './OptimizedImage';

interface HeroSectionProps {
  onOpenRegistration?: () => void;
}

const HeroSection = ({ onOpenRegistration: _onOpenRegistration }: HeroSectionProps) => {
  const navigate = useNavigate();
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const backgroundImages = [
    '/Header.webp',
    '/way1/DSC_5516.webp',
    '/way 2/EmptyName 390.webp',
    '/eventhero.webp',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const targetDate = new Date('2026-07-25T00:00:00').getTime();
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = targetDate - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, []);

  const fmt = (n: number) => n.toString().padStart(2, '0');

  const countdownItems = [
    { value: timeLeft.days, label: 'JOURS' },
    { value: timeLeft.hours, label: 'HEURES' },
    { value: timeLeft.minutes, label: 'MINUTES' },
    { value: timeLeft.seconds, label: 'SECONDES' },
  ];

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <OptimizedImage
          src={backgroundImages[currentBgIndex] || '/Header.webp'}
          alt="Hero Background"
          className="w-full h-full object-cover"
          priority={true}
          loading="eager"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Light Effects */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 15 }}>
        <img src="/Lights.svg" alt="" className="absolute top-0 left-0 w-[30%] h-full object-cover opacity-70" />
        <img src="/Lights.svg" alt="" className="absolute top-0 right-0 w-[30%] h-full object-cover opacity-70 scale-x-[-1]" />
      </div>

      {/* Main Content */}
      <div className="relative z-30 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 text-center pt-16 pb-10">

        {/* 3D Logo */}
        <div className="mb-1 w-[80vw] sm:w-[70vw] md:w-[55vw] lg:w-[45vw] max-w-3xl">
          <img
            src="/logog final 3D.webp"
            alt="What About You"
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>

        <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white/90 tracking-[0.3em] mb-6 sm:mb-8">
          <span className="text-4xl sm:text-5xl md:text-6xl leading-none">5</span>
          <sup className="text-xs align-super">ÈME</sup>&nbsp;ÉDITION
        </p>

        {/* Countdown Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mb-6 sm:mb-8">
          {countdownItems.map(({ value, label }) => (
            <div key={label} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-5 md:p-6 border border-white/20">
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 tabular-nums">
                {fmt(value)}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-white/80 uppercase tracking-wider">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Date */}
        <p className="text-sm sm:text-base md:text-lg text-white/90 mb-8">
          Rendez-vous du <span className="font-bold">25 Juillet au 01 Août</span>
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Primary — Bleu */}
          <button
            onClick={() => navigate('/boutique')}
            className="font-azonix border-2 border-blue-500 bg-blue-500/10 text-white hover:bg-blue-500 font-semibold px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
          >
            Réserver Votre Stand
          </button>

          {/* Secondary — Rouge */}
          <button
            onClick={() => navigate('/miss-and-master')}
            className="font-azonix border-2 border-red-500 bg-red-500/10 text-white hover:bg-red-500 font-semibold px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30"
          >
           Voter Votre Miss
          </button>

          {/* Tertiary — Jaune */}
          <button
            onClick={() => navigate('/events')}
            className="font-azonix border-2 border-yellow-400 bg-yellow-400/10 text-white hover:bg-yellow-400 hover:text-black font-semibold px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base tracking-wider transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-400/30"
          >
            Accéder a la Conférence
          </button>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
