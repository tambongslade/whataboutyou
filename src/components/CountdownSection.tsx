import { useEffect, useRef, useState } from 'react';

const CountdownSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const targetDate = new Date('2025-07-21T00:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Update immediately
    updateCountdown();

    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #7c2d12, #991b1b, #dc2626)',
      }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/Countdown.webp" 
          alt="Festival Background" 
          className="w-full h-full object-cover opacity-100"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/30 to-black/20"></div>
      </div>

      <div className="relative max-w-7xl mx-auto text-center">
        {/* Festival Title */}
        <div className={`mb-12 transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-4 tracking-wider">
            WAY
          </h1>
          <p className="text-xl md:text-2xl text-white/90 font-medium tracking-widest">
            4<sup className="text-base">ÈME</sup> ÉDITION
          </p>
        </div>

        {/* Countdown Timer */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-500 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-12'
        }`}>
          {/* Days */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
            <div className="text-4xl md:text-6xl font-bold text-white mb-2">
              {formatNumber(timeLeft.days)}
            </div>
            <div className="text-sm md:text-base text-white/80 uppercase tracking-wider">
              JOURS
            </div>
          </div>

          {/* Hours */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
            <div className="text-4xl md:text-6xl font-bold text-white mb-2">
              {formatNumber(timeLeft.hours)}
            </div>
            <div className="text-sm md:text-base text-white/80 uppercase tracking-wider">
              HEURES
            </div>
          </div>

          {/* Minutes */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
            <div className="text-4xl md:text-6xl font-bold text-white mb-2">
              {formatNumber(timeLeft.minutes)}
            </div>
            <div className="text-sm md:text-base text-white/80 uppercase tracking-wider">
              MINUTES
            </div>
          </div>

          {/* Seconds */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20">
            <div className="text-4xl md:text-6xl font-bold text-white mb-2">
              {formatNumber(timeLeft.seconds)}
            </div>
            <div className="text-sm md:text-base text-white/80 uppercase tracking-wider">
              SECONDES
            </div>
          </div>
        </div>

        {/* Event Date */}
        <div className={`mt-12 transition-all duration-1000 delay-700 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <p className="text-lg md:text-xl text-white/90 mb-6">
            Rendez-vous du <span className="font-bold">21 au 26 juillet</span>
          </p>
          <button className="bg-white text-red-800 hover:bg-red-50 font-semibold px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl">
            Réserver Maintenant
          </button>
        </div>

        {/* Decorative Elements */}
        <div className={`absolute top-10 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 transition-all duration-1000 delay-900 ${
          isVisible ? 'scale-100' : 'scale-0'
        }`}></div>
        <div className={`absolute bottom-10 right-10 w-16 h-16 bg-blue-400 rounded-full opacity-20 transition-all duration-1000 delay-1000 ${
          isVisible ? 'scale-100' : 'scale-0'
        }`}></div>
        <div className={`absolute top-1/2 left-20 w-12 h-12 bg-green-400 rounded-full opacity-15 transition-all duration-1000 delay-1100 ${
          isVisible ? 'scale-100' : 'scale-0'
        }`}></div>
      </div>
    </section>
  );
};

export default CountdownSection; 