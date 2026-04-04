import { useEffect, useRef, useState } from 'react';

const AboutSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
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

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h2 className="font-azonix text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-wide">
            A PROPOS DE NOUS
          </h2>
          <p className="font-nekst text-base md:text-lg text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Découvrez l'essence du festival WhataboutYou : son histoire, sa vision et les valeurs qui l'animent. Nous vous en disons plus sur ce qui fait de WAY une expérience unique.
          </p>
        </div>

        {/* Row 1: Image left (wide), Text right */}
        <div className={`grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8 items-center transition-all duration-1000 delay-300 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="lg:col-span-3 overflow-hidden rounded-3xl">
            <img
              src="/way1/DSC_5918.webp"
              alt="Concert WAY - Valoriser les jeunes créateurs"
              className="w-full h-[300px] md:h-[380px] object-cover"
            />
          </div>

          <div className="lg:col-span-2 flex flex-col justify-center">
            {/* Red circle — chat icon */}
            <img src="/Group 512.webp" alt="" className="w-14 h-14 mb-5" />

            <h3 className="font-clash text-2xl md:text-3xl font-bold text-black mb-4 leading-tight tracking-wide">
              VALORISER LES<br />JEUNES CRÉATEURS
            </h3>

            <p className="font-nekst text-gray-500 leading-relaxed text-sm md:text-base">
              Nous offrons une plateforme dynamique aux jeunes entrepreneurs, artisans et artistes pour exposer leurs talents, créations et projets.
            </p>
          </div>
        </div>

        {/* Row 2: Text left, Image right (wide) */}
        <div className={`grid grid-cols-1 lg:grid-cols-5 gap-8 mb-8 items-center transition-all duration-1000 delay-600 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="lg:col-span-2 flex flex-col justify-center order-2 lg:order-1">
            {/* Yellow circle — chat icon */}
            <img src="/Group 521.webp" alt="" className="w-14 h-14 mb-5" />

            <h3 className="font-clash text-2xl md:text-3xl font-bold text-black mb-4 leading-tight tracking-wide">
              FESTIVAL DE PLAISIR<br />ET LE PARTAGE
            </h3>

            <p className="font-nekst text-gray-500 leading-relaxed text-sm md:text-base">
              Une célébration de la culture, de la créativité et de la communauté. Nos événements sont pensés pour divertir, inspirer et rassembler.
            </p>
          </div>

          <div className="lg:col-span-3 overflow-hidden rounded-3xl order-1 lg:order-2">
            <img
              src="/way 2/EmptyName 371.webp"
              alt="Festival WAY - Plaisir et partage"
              className="w-full h-[300px] md:h-[380px] object-cover"
            />
          </div>
        </div>

        {/* Row 3: Image left (wide), Text right */}
        <div className={`grid grid-cols-1 lg:grid-cols-5 gap-8 items-center transition-all duration-1000 delay-900 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="lg:col-span-3 overflow-hidden rounded-3xl">
            <img
              src="/Way 3/DSC_6166.webp"
              alt="Famille WAY - Vibrante et inclusive"
              className="w-full h-[300px] md:h-[380px] object-cover"
            />
          </div>

          <div className="lg:col-span-2 flex flex-col justify-center">
            {/* Blue circle — chat icon */}
            <img src="/Group 520.webp" alt="" className="w-14 h-14 mb-5" />

            <h3 className="font-clash text-2xl md:text-3xl font-bold text-black mb-4 leading-tight tracking-wide">
              FAMILLE VIBRANTE<br />ET INCLUSIVE
            </h3>

            <p className="font-nekst text-gray-500 leading-relaxed text-sm md:text-base">
              La diversité culturelle dans un espace où chacun peut être soi-même, rencontrer, partager et créer des souvenirs inoubliables.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
