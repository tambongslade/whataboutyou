import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">À PROPOS DE WHAT ABOUT YOU</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            "Quelle est ta situation actuelle ?" - Une foire entrepreneuriale, socio-culturelle et de divertissement
          </p>
          <div className="flex justify-center space-x-4">
            <span className="px-4 py-2 bg-red-500 rounded-full text-white font-semibold">Rouge: Étudiant</span>
            <span className="px-4 py-2 bg-blue-500 rounded-full text-white font-semibold">Bleu: Collégien</span>
            <span className="px-4 py-2 bg-yellow-500 rounded-full text-white font-semibold">Jaune: Travailleur</span>
          </div>
        </div>
      </section>

      {/* Identity Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">NOTRE IDENTITÉ</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold mb-6">What About You (WAY)</h3>
              <div className="space-y-4 text-gray-700">
                <p>
                  What About You, abrégé « WAY », dont le slogan est « Quelle est ta situation actuelle ? » rassemble les jeunes de différents niveaux éducatifs et professionnels autour de l'entrepreneuriat et du développement communautaire.
                </p>
                <p>
                  C'est une foire qui met en avant l'entrepreneuriat jeune dans un espace diversifiant. Cette identité est le cœur de la foire car elle crée une ambiance magique à travers laquelle les jeunes s'identifient facilement selon leur parcours éducatif et professionnel.
                </p>
              </div>
            </div>
            <div>
              <img
                src="/About 1.webp"
                alt="Identité What About You"
                className="w-full h-auto rounded-2xl shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/600x400/gray/white?text=What+About+You';
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Goals Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">VISION - MISSION - BUTS</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Vision */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">NOTRE VISION</h3>
              <p className="text-gray-600 text-center">
                Créer un environnement dynamique et stimulant qui favorise les échanges commerciaux, l'innovation, la promotion l'entrepreneuriat et la croissance économique en réunissant des entrepreneurs, des investisseurs et d'autres acteurs clés de l'écosystème entrepreneurial.
              </p>
            </div>
            
            {/* Mission */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">NOTRE MISSION</h3>
              <p className="text-gray-600 text-center">
                Fournir une plateforme dynamique où les entrepreneurs peuvent présenter leurs produits et services, partager leurs idées, leurs expériences et leurs connaissances, établir des partenariats et obtenir des ressources pour faire croître leurs entreprises.
              </p>
            </div>
            
            {/* Goals */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-center">NOTRE BUT</h3>
              <p className="text-gray-600 text-center">
                Contribuer à la croissance économique en favorisant l'émergence de nouvelles entreprises, la création d'emplois, l'innovation et le développement durable tout en renforçant l'écosystème entrepreneurial.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">NOS OBJECTIFS</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Favoriser le réseautage et les partenariats</h4>
                  <p className="text-gray-600">Offrir aux participants la possibilité de rencontrer des partenaires potentiels, des clients, des investisseurs et d'autres acteurs clés de l'écosystème entrepreneurial.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Promouvoir l'innovation et la créativité</h4>
                  <p className="text-gray-600">Mettre en avant les nouvelles idées, les produits et services innovants développés par les entrepreneurs et les startups.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Fournir des ressources et des conseils</h4>
                  <p className="text-gray-600">Proposer des ateliers, des conférences et des sessions de mentorat pour aider les entrepreneurs à développer leurs compétences.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-start space-x-4">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
            <div>
                  <h4 className="text-lg font-semibold mb-2">Stimuler l'investissement</h4>
                  <p className="text-gray-600">Faciliter les rencontres entre entrepreneurs à la recherche de financement et investisseurs intéressés par de nouvelles opportunités.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">NOS VALEURS</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Ces valeurs contribuent à faire de What About You un événement enrichissant à la fois sur le plan économique, social et culturel.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Innovation et créativité",
                description: "Encourager l'innovation et la créativité dans les produits et services présentés.",
                icon: "💡"
              },
              {
                title: "Éducation et apprentissage",
                description: "Offrir des opportunités d'apprentissage aux participants sur l'entrepreneuriat et les compétences professionnelles.",
                icon: "📚"
              },
              {
                title: "Esprit d'entreprise",
                description: "Promouvoir l'esprit d'entreprise en offrant une plateforme aux entrepreneurs pour présenter leurs idées.",
                icon: "🚀"
              },
              {
                title: "Diversité culturelle",
                description: "Célébrer la diversité culturelle en mettant en avant les traditions, l'artisanat et la cuisine.",
                icon: "🌍"
              },
              {
                title: "Réseautage / Networking",
                description: "Faciliter le réseautage entre entrepreneurs, investisseurs et autres parties prenantes.",
                icon: "🤝"
              },
              {
                title: "Développement économique local",
                description: "Contribuer au développement économique local en valorisant les entreprises locales.",
                icon: "📈"
              },
              {
                title: "Durabilité",
                description: "Encourager des pratiques commerciales durables et responsables sur le plan environnemental.",
                icon: "🌱"
              },
              {
                title: "Égalité des genres",
                description: "Promouvoir l'égalité des genres en offrant des opportunités égales aux entrepreneurs.",
                icon: "⚖️"
              },
              {
                title: "Engagement communautaire",
                description: "Impliquer la communauté locale et encourager la participation active des résidents.",
                icon: "👥"
              },
              {
                title: "Partage des connaissances",
                description: "Faciliter le partage des connaissances et expériences entre participants.",
                icon: "🔄"
              }
            ].map((value, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">{value.icon}</div>
                <h3 className="text-lg font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Context Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">CONTEXTE ET DÉMARCHE</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Une foire unique au Cameroun</h3>
                <div className="space-y-4 text-gray-700">
                  <p>
                    What About You est une foire organisée au Cameroun, alliant activités culturelles, entrepreneuriales et de divertissement. Elle représente une plateforme dynamique favorisant l'échange, l'innovation et le développement économique.
                  </p>
                  <p>
                    Dans un cadre festif, elle offre aux entrepreneurs l'opportunité de présenter leurs produits et services tout en créant des liens avec d'autres acteurs du secteur.
                  </p>
                  <p>
                    Cette démarche vise à stimuler l'entrepreneuriat, encourager l'investissement et dynamiser l'économie locale.
                  </p>
                </div>
            </div>
            <div>
                <img
                  src="/About 2.webp"
                  alt="Contexte What About You"
                  className="w-full h-auto rounded-2xl shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/600x400/gray/white?text=Contexte+WAY';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Salon Professional Section */}
      <section className="py-16 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">SALON PROFESSIONNEL</h2>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Deux jours d'échanges B2B</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Directeurs d'entreprise et représentants d'institutions</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Directeurs marketing et jeunes entrepreneurs expérimentés</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Médias publiques et privés pour la diffusion</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Clôture avec un dîner professionnel</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-6">Objectifs du salon</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Faciliter l'éducation des jeunes sur l'entrepreneuriat</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Conseils en discipline financière et psychologique</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Orientation pour l'auto-emploi</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p>Réseautage et création de valeur économique</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Challenges Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">GRANDS DÉFIS</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pour une foire entrepreneuriale réussie, nous devons relever plusieurs défis essentiels.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Visibilité",
                description: "Attirer l'attention des participants et des médias pour maximiser la visibilité des entreprises exposantes.",
                icon: "👁️"
              },
              {
                title: "Concurrence",
                description: "Se démarquer parmi les nombreux exposants et attirer les clients potentiels malgré la concurrence.",
                icon: "⚡"
              },
              {
                title: "Gestion des coûts",
                description: "Optimiser les frais de stand, logistique, communication et marketing avec une gestion financière efficace.",
                icon: "💰"
              },
              {
                title: "Réseautage",
                description: "Maximiser les opportunités de réseautage pour établir des contacts commerciaux et partenariats stratégiques.",
                icon: "🔗"
              },
              {
                title: "Gestion du temps",
                description: "Planifier efficacement les journées chargées pour maximiser les interactions et opportunités.",
                icon: "⏰"
              },
              {
                title: "Suivi post-foire",
                description: "Assurer un suivi adéquat avec les contacts établis pour maintenir l'intérêt et conclure des affaires.",
                icon: "📞"
              },
              {
                title: "Innovation",
                description: "Présenter des produits ou services innovants pour captiver l'intérêt des visiteurs.",
                icon: "🔬"
              },
              {
                title: "Satisfaction client",
                description: "Offrir une expérience positive aux visiteurs pour favoriser la confiance et la fidélité.",
                icon: "😊"
              }
            ].map((challenge, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">{challenge.icon}</div>
                <h3 className="text-lg font-semibold mb-3">{challenge.title}</h3>
                <p className="text-gray-600 text-sm">{challenge.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-red-500 to-orange-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">REJOIGNEZ-NOUS</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Faites partie de cette aventure entrepreneuriale unique et contribuez au développement économique du Cameroun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-red-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Devenir exposant
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-red-500 transition">
              Participer au salon
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage; 