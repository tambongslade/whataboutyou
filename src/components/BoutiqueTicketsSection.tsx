import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const slides = [
  {
    title: 'BOUTIQUE WAY –\nACHAT DES TICKETS',
    description:
      "Réserve dès maintenant ton pass pour la 5ᵉ édition de WAY et vis l'expérience complète : concerts, ateliers, conférences, expositions et animations culturelles.",
    cta: 'ACHETER MES TICKETS MAINTENANT',
    link: '/boutique',
  },
  {
    title: 'MISS & MASTER\nWAY 2025',
    description:
      "Découvre les candidats de cette édition et vote pour ton favori. Le spectacle promet d'être inoubliable !",
    cta: 'DÉCOUVRIR LES CANDIDATS',
    link: '/miss-and-master',
  },
  {
    title: 'TOMBOLA WAY –\nTENTE TA CHANCE',
    description:
      'Participe à la grande tombola WAY et gagne des lots incroyables. Chaque ticket est une chance de repartir avec un cadeau.',
    cta: 'PARTICIPER À LA TOMBOLA',
    link: '/tombola',
  },
];

const BoutiqueTicketsSection = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();
  const slide = slides[current];

  return (
    <section className="relative bg-white overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-1/3 h-full opacity-10 pointer-events-none">
        <img src="/Header.webp" alt="" className="w-full h-full object-cover" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — Text */}
          <div>
            <h2 className="font-azonix text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6 leading-tight whitespace-pre-line">
              {slide?.title}
            </h2>

            <p className="font-nekst text-gray-500 text-base md:text-lg leading-relaxed mb-8 max-w-lg">
              {slide?.description}
            </p>

            <button
              onClick={() => navigate(slide?.link || '/boutique')}
              className="font-azonix inline-flex items-center gap-3 bg-red-600 text-white px-8 py-4 rounded-full text-sm font-bold tracking-wider hover:bg-red-700 transition-all duration-200 cursor-pointer"
            >
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {slide?.cta}
            </button>
          </div>

          {/* Right — Ticket image with decorative shapes */}
          <div className="relative flex items-center justify-center">
            {/* Decorative triangles */}
            <div className="absolute top-4 right-16 w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-b-[30px] border-b-blue-500 rotate-12"></div>
            <div className="absolute bottom-8 left-8 w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[24px] border-b-red-500 -rotate-12"></div>
            <div className="absolute top-1/2 right-4 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-b-[20px] border-b-yellow-400 rotate-45"></div>

            {/* Ticket card */}
            <div className="relative transform rotate-[-8deg] hover:rotate-0 transition-transform duration-500">
              <div className="bg-gradient-to-br from-yellow-300 via-yellow-400 to-green-400 rounded-3xl p-1 shadow-2xl">
                <div className="bg-gradient-to-br from-yellow-200 via-green-300 to-cyan-400 rounded-3xl w-[320px] sm:w-[400px] h-[200px] sm:h-[240px] flex items-center justify-center overflow-hidden">
                  <img
                    src="/logog final 3D.webp"
                    alt="WAY Ticket"
                    className="w-[80%] h-auto drop-shadow-xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dot pagination */}
        <div className="flex items-center justify-center gap-3 mt-14">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
                i === current ? 'bg-black scale-125' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BoutiqueTicketsSection;
