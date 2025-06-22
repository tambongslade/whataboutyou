import React from 'react';

const HistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">NOTRE HISTOIRE</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Découvrez comment WhataboutYou est né et a évolué pour devenir une plateforme de référence pour les jeunes créateurs
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">NOTRE PARCOURS</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            {/* Timeline Item 1 */}
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <div className="bg-red-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4 mx-auto md:mx-0">
                  1
                </div>
                <h3 className="text-2xl font-bold mb-2">2020 - L'idée naît</h3>
                <p className="text-gray-600">
                  Pendant la pandémie, nous avons réalisé que de nombreux jeunes créateurs avaient du mal à 
                  présenter leur travail. L'idée de WhataboutYou est née de ce constat.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-red-200 to-orange-200 rounded-xl h-64 flex items-center justify-center">
                  <span className="text-red-600 font-bold text-lg">2020</span>
                </div>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div className="flex flex-col md:flex-row-reverse items-center mb-12">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pl-8">
                <div className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4 mx-auto md:mx-0">
                  2
                </div>
                <h3 className="text-2xl font-bold mb-2">2021 - Premiers pas</h3>
                <p className="text-gray-600">
                  Lancement de la première version de la plateforme avec 50 créateurs. 
                  Nous avons organisé notre premier événement virtuel.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-blue-200 to-cyan-200 rounded-xl h-64 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-lg">2021</span>
                </div>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div className="flex flex-col md:flex-row items-center mb-12">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4 mx-auto md:mx-0">
                  3
                </div>
                <h3 className="text-2xl font-bold mb-2">2022 - Expansion</h3>
                <p className="text-gray-600">
                  Ouverture de notre boutique en ligne et partenariats avec des marques locales. 
                  La communauté atteint 1000 membres.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-green-200 to-teal-200 rounded-xl h-64 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-lg">2022</span>
                </div>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div className="flex flex-col md:flex-row-reverse items-center mb-12">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pl-8">
                <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4 mx-auto md:mx-0">
                  4
                </div>
                <h3 className="text-2xl font-bold mb-2">2023 - Innovation</h3>
                <p className="text-gray-600">
                  Lancement de nouveaux outils pour les créateurs et organisation de notre premier 
                  festival créatif en présentiel.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-purple-200 to-pink-200 rounded-xl h-64 flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-lg">2023</span>
                </div>
              </div>
            </div>

            {/* Timeline Item 5 */}
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <div className="bg-cyan-500 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4 mx-auto md:mx-0">
                  5
                </div>
                <h3 className="text-2xl font-bold mb-2">2024 - Aujourd'hui</h3>
                <p className="text-gray-600">
                  Plus de 500 créateurs actifs, 10 000 membres dans la communauté et des projets 
                  d'expansion internationale en cours.
                </p>
              </div>
              <div className="md:w-1/2">
                <div className="bg-gradient-to-br from-cyan-200 to-blue-200 rounded-xl h-64 flex items-center justify-center">
                  <span className="text-cyan-600 font-bold text-lg">2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">NOTRE MISSION</h2>
          <div className="w-24 h-1 bg-red-500 mx-auto mb-8"></div>
          <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
            "Depuis le début, notre mission est simple : donner aux jeunes créateurs les outils et la visibilité 
            qu'ils méritent. Nous croyons que chaque talent mérite d'être découvert et que l'innovation naît 
            de la diversité des perspectives créatives."
          </p>
          <div className="mt-8">
            <span className="text-gray-500 italic">- L'équipe fondatrice de WhataboutYou</span>
          </div>
        </div>
      </section>

      {/* Future Vision */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">VERS L'AVENIR</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Notre vision pour les prochaines années : devenir la plateforme de référence mondiale 
            pour les jeunes créateurs
          </p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Rejoindre l'aventure
          </button>
        </div>
      </section>
    </div>
  );
};

export default HistoryPage; 