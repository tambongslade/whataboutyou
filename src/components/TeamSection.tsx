import React, { useState } from 'react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  image: string;
  colorBg: string;
}

const TeamSection: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number | null>(2); // Default to middle card active

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: "SARAH WILSON",
      role: "CREATIVE DIRECTOR",
      image: "/About 1.png",
      colorBg: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400"
    },
    {
      id: 2,
      name: "TIANA BROWN", 
      role: "HR MANAGER",
      image: "/About 2.png",
      colorBg: "bg-gradient-to-br from-cyan-400 via-blue-500 to-yellow-400"
    },
    {
      id: 3,
      name: "MAYA JOHNSON",
      role: "MARKETING LEAD", 
      image: "/About 3.png",
      colorBg: "bg-gradient-to-br from-red-500 via-pink-500 to-purple-600"
    },
    {
      id: 4,
      name: "ALEX MARTIN",
      role: "DESIGN LEAD",
      image: "/About 1.png", // Reusing image
      colorBg: "bg-gradient-to-br from-green-400 via-teal-500 to-blue-500"
    }
  ];

  return (
    <section className="py-8 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
            A PROPOS DE NOUS
          </h2>
          <div className="w-16 md:w-24 h-1 bg-red-500 mx-auto mb-4 md:mb-6"></div>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonumy eiusmod tempor invidunt ut
            labore et dolore magna aliquyam erat.
          </p>
        </div>

        {/* Team Cards */}
        <div className="flex flex-col md:flex-row justify-center items-center md:items-end space-y-4 md:space-y-0 md:space-x-4 mb-8">
          {/* Navigation Arrows - Hidden on mobile */}
          <button className="hidden md:flex w-12 h-12 rounded-full border-2 border-gray-300 items-center justify-center hover:border-gray-400 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Team Member Cards Container */}
          <div className="w-full md:w-auto">
            {/* Mobile: Horizontal scrollable carousel */}
            <div className="md:hidden overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 px-4 pb-4" style={{ scrollSnapType: 'x mandatory' }}>
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className={`relative cursor-pointer transition-all duration-500 transform hover:scale-105 flex-shrink-0 ${
                      activeCard === member.id 
                        ? 'w-72 h-80' 
                        : 'w-56 h-72'
                    }`}
                    style={{ scrollSnapAlign: 'center' }}
                    onClick={() => setActiveCard(activeCard === member.id ? null : member.id)}
                  >
                    {/* Card Container */}
                    <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-lg ${
                      activeCard === member.id ? member.colorBg : 'bg-white'
                    }`}>
                      
                      {/* Member Image */}
                      <div className={`absolute inset-0 transition-all duration-500 ${
                        activeCard === member.id ? 'scale-110 translate-y-4' : 'scale-100'
                      }`}>
                        <img
                          src={member.image}
                          alt={member.name}
                          className={`w-full h-full object-cover transition-all duration-500 ${
                            activeCard === member.id ? 'grayscale-0' : 'grayscale'
                          }`}
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/300x400/gray/white?text=Team+Member';
                          }}
                        />
                      </div>

                      {/* Active Card Content Overlay */}
                      {activeCard === member.id && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 text-white z-10">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-3 h-3 bg-white rounded-full flex items-center justify-center">
                              <svg className="w-1.5 h-1.5 text-gray-800" fill="currentColor" viewBox="0 0 8 8">
                                <circle cx="4" cy="4" r="3"/>
                              </svg>
                            </div>
                            <span className="text-xs font-medium opacity-90">{member.role}</span>
                          </div>
                          <h3 className="text-lg font-bold mb-1">{member.name}</h3>
                        </div>
                      )}

                      {/* Subtle overlay for inactive cards */}
                      {activeCard !== member.id && (
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      )}
                    </div>

                    {/* Overflow Effect for Active Card */}
                    {activeCard === member.id && (
                      <div className="absolute -top-2 -left-2 -right-2 -bottom-2 pointer-events-none">
                        <div className={`w-full h-full rounded-2xl ${member.colorBg} opacity-20 blur-xl`}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop: Regular flex layout */}
            <div className="hidden md:flex space-x-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className={`relative cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                    activeCard === member.id 
                      ? 'w-80 h-96' 
                      : 'w-64 h-80'
                  }`}
                  onClick={() => setActiveCard(activeCard === member.id ? null : member.id)}
                >
                  {/* Card Container */}
                  <div className={`relative w-full h-full rounded-2xl overflow-hidden shadow-lg ${
                    activeCard === member.id ? member.colorBg : 'bg-white'
                  }`}>
                    
                    {/* Member Image */}
                    <div className={`absolute inset-0 transition-all duration-500 ${
                      activeCard === member.id ? 'scale-110 translate-y-4' : 'scale-100'
                    }`}>
                      <img
                        src={member.image}
                        alt={member.name}
                        className={`w-full h-full object-cover transition-all duration-500 ${
                          activeCard === member.id ? 'grayscale-0' : 'grayscale'
                        }`}
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/300x400/gray/white?text=Team+Member';
                        }}
                      />
                    </div>

                    {/* Active Card Content Overlay */}
                    {activeCard === member.id && (
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                            <svg className="w-2 h-2 text-gray-800" fill="currentColor" viewBox="0 0 8 8">
                              <circle cx="4" cy="4" r="3"/>
                            </svg>
                          </div>
                          <span className="text-sm font-medium opacity-90">{member.role}</span>
                        </div>
                        <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                      </div>
                    )}

                    {/* Subtle overlay for inactive cards */}
                    {activeCard !== member.id && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    )}
                  </div>

                  {/* Overflow Effect for Active Card */}
                  {activeCard === member.id && (
                    <div className="absolute -top-4 -left-4 -right-4 -bottom-4 pointer-events-none">
                      <div className={`w-full h-full rounded-2xl ${member.colorBg} opacity-20 blur-xl`}></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow - Hidden on mobile */}
          <button className="hidden md:flex w-12 h-12 rounded-full border-2 border-gray-300 items-center justify-center hover:border-gray-400 transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-semibold transition-colors text-sm md:text-base">
            VOIR L'EQUIPE
          </button>
        </div>
      </div>
    </section>
  );
};

export default TeamSection; 