import React from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  message: string;
  iconColor: string;
  iconImage: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'KEVIN NDZIÉ',
    role: 'ENTREPRENEUR',
    message: "WAY, ce n'est pas juste un événement, c'est une vraie opportunité. J'ai rencontré des personnes qui m'ont aidé à développer mon projet.",
    iconColor: 'bg-blue-400',
    iconImage: '/Group 520.webp',
  },
  {
    id: 2,
    name: 'ARNAUD TCHOUMI',
    role: 'EXPOSANT',
    message: "Grâce à WAY, j'ai pu exposer mes produits et avoir mes premiers clients. C'est un vrai tremplin pour nous les jeunes.",
    iconColor: 'bg-red-500',
    iconImage: '/Group 512.webp',
  },
  {
    id: 3,
    name: 'MIREILLE ESSOMBA',
    role: 'PARTICIPANTE',
    message: "L'ambiance est incroyable, mais au-delà de ça, tu repars avec des contacts et des idées concrètes.",
    iconColor: 'bg-red-600',
    iconImage: '/Group 512.webp',
  },
  {
    id: 4,
    name: 'AYOBA',
    role: '',
    message: 'À travers WAY, nous touchons une audience dynamique et engagée, en parfaite adéquation avec notre vision digitale.',
    iconColor: 'bg-yellow-400',
    iconImage: '/Group 521.webp',
  },
  {
    id: 5,
    name: 'VGROUP',
    role: '',
    message: "Notre présence à WAY renforce notre engagement envers l'innovation et l'entrepreneuriat jeune.",
    iconColor: 'bg-blue-400',
    iconImage: '/Group 520.webp',
  },
  {
    id: 6,
    name: 'KEVIN NDZIÉ',
    role: 'ENTREPRENEUR',
    message: "WAY, ce n'est pas juste un événement, c'est une vraie opportunité. J'ai rencontré des personnes qui m'ont aidé à développer mon projet.",
    iconColor: 'bg-yellow-400',
    iconImage: '/Group 521.webp',
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-azonix text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-wide">
            TÉMOIGNAGES
          </h2>
          <p className="font-nekst text-gray-500 max-w-3xl mx-auto text-base md:text-lg leading-relaxed">
            WhatAboutYou est une plateforme innovante et unique qui connecte directement les marques à une jeunesse dynamique, engagée et en quête de nouvelles expériences, en favorisant des interactions authentiques et des opportunités de collaboration enrichissantes.
          </p>
        </div>

        {/* Testimonial Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div key={t.id} className="relative pt-8">
              {/* Icon circle — overlapping top of card */}
              <div className="absolute top-0 left-8 z-10">
                <img
                  src={t.iconImage}
                  alt=""
                  className="w-16 h-16 drop-shadow-lg"
                />
              </div>

              {/* Card */}
              <div className="bg-gray-900 rounded-2xl p-8 pt-12 text-white min-h-[220px] flex flex-col justify-between">
                <div>
                  {t.role && (
                    <p className="font-nekst text-gray-400 text-xs tracking-widest uppercase mb-1">
                      {t.role}
                    </p>
                  )}
                  <h3 className="font-clash text-xl md:text-2xl font-bold mb-4">
                    {t.name}
                  </h3>
                  <p className="font-nekst text-gray-300 text-sm leading-relaxed">
                    {t.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
