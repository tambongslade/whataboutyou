import React, { useState } from 'react';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  message: string;
  avatar: string;
  color: string;
}

const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "MARIE KAMDEM",
      role: "Directrice Générale WAY",
      message: "What About You a été créé avec une vision claire : donner aux jeunes les moyens de réaliser leurs rêves entrepreneuriaux. Chaque édition nous rappelle pourquoi cette mission est si importante. Voir ces jeunes talents grandir et réussir, c'est notre plus grande récompense.",
      avatar: "/Notre Equipe/IMG_8877.webp",
      color: "bg-red-500"
    },
    {
      id: 2,
      name: "PAUL MBALLA",
      role: "Directeur Marketing WAY",
      message: "L'impact de WAY sur la communauté entrepreneuriale camerounaise est extraordinaire. Nous avons accompagné plus de 3000 jeunes dans leur parcours. L'énergie et la créativité de chaque édition me motivent chaque jour à repousser les limites.",
      avatar: "/Notre Equipe/IMG_8876.webp",
      color: "bg-blue-500"
    },
    {
      id: 3,
      name: "GRACE NKOMO",
      role: "Responsable Événementiel WAY",
      message: "Organiser chaque édition de WAY est un défi passionnant. Voir l'évolution des participants, leurs échanges, leurs collaborations... C'est magique ! WAY est devenu bien plus qu'un événement, c'est une famille entrepreneuriale.",
      avatar: "/Notre Equipe/IMG_8875.webp",
      color: "bg-yellow-500"
    },
    {
      id: 4,
      name: "JEAN TSAFACK",
      role: "Chef de Projet WAY",
      message: "La force de WAY réside dans sa capacité à rassembler des jeunes de tous horizons autour d'un objectif commun. Chaque projet que nous accompagnons, chaque success story que nous célébrons, renforce notre conviction que nous sommes sur la bonne voie.",
      avatar: "/Notre Equipe/IMG_8874.webp",
      color: "bg-green-500"
    },
    {
      id: 5,
      name: "SANDRA FOUDA",
      role: "Responsable Communication WAY",
      message: "Raconter l'histoire de WAY, c'est raconter l'histoire de centaines de jeunes qui ont osé croire en leurs rêves. Chaque témoignage, chaque photo, chaque moment partagé contribue à inspirer la prochaine génération d'entrepreneurs.",
      avatar: "/Notre Equipe/IMG_8873.webp",
      color: "bg-purple-500"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            TÉMOIGNAGES
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Découvrez les expériences inspirantes de nos participants qui ont transformé leurs rêves entrepreneuriaux en réalité grâce à What About You.
          </p>
          
          {/* Navigation Arrows */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={prevTestimonial}
              className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center hover:bg-gray-800 transition-colors"
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Follower Count Badge */}
        <div className="flex justify-end mb-8">
          <div className="bg-yellow-400 text-black px-6 py-8 font-bold text-lg transform rotate-90 origin-center">
            +300K
            <div className="text-sm font-normal mt-1">FOLLOWERS</div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`relative bg-gray-900 rounded-2xl p-6 text-white transition-all duration-500 ${
                index === currentIndex ? 'scale-105 shadow-2xl' : 'opacity-70'
              }`}
            >
              {/* Quote Icon */}
              <div className={`absolute top-4 left-4 w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center`}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
              </div>

              {/* Profile Image */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-20 h-20 rounded-full object-cover border-4 border-white"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/80x80/gray/white?text=User';
                    }}
                  />
                  <div className={`absolute -bottom-2 -right-2 w-6 h-6 ${testimonial.color} rounded-full border-2 border-white`}></div>
                </div>
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-center mb-2">{testimonial.name}</h3>
              
              {/* Role */}
              <p className="text-gray-400 text-center text-sm mb-4">{testimonial.role}</p>

              {/* Quote Marks */}
              <div className="flex justify-center mb-4">
                <div className="flex space-x-2">
                  <span className={`text-2xl ${testimonial.color.replace('bg-', 'text-')}`}>"</span>
                  <span className={`text-2xl ${testimonial.color.replace('bg-', 'text-')}`}>"</span>
                </div>
              </div>

              {/* Message */}
              <p className="text-gray-300 text-center leading-relaxed">
                {testimonial.message}
              </p>

              {/* Quote Marks End */}
              <div className="flex justify-center mt-4">
                <div className="flex space-x-2">
                  <span className={`text-2xl ${testimonial.color.replace('bg-', 'text-')}`}>"</span>
                  <span className={`text-2xl ${testimonial.color.replace('bg-', 'text-')}`}>"</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-12 space-x-3">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gray-900 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">Rejoignez des milliers de créateurs satisfaits</p>
          <button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
            Commencer maintenant
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 