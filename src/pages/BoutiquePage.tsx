import React from 'react';

const BoutiquePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">BOUTIQUE</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Découvrez notre collection exclusive de produits créés par de jeunes talents
          </p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Voir les produits
          </button>
        </div>
      </section>

      {/* Store Image Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <img
              src="/Store.png"
              alt="Notre boutique"
              className="w-full h-auto rounded-2xl shadow-lg"
              onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/800x600/gray/white?text=Store+Coming+Soon';
              }}
            />
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">NOS PRODUITS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Product Cards */}
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="bg-gray-100 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-64 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="text-gray-600 font-medium">Produit {item}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">Produit créatif {item}</h3>
                  <p className="text-gray-600 mb-4">Description du produit créé par nos jeunes talents.</p>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-purple-600">€29.99</span>
                    <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      Ajouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-pink-500 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous êtes créateur ?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez notre plateforme et vendez vos créations
          </p>
          <button className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Devenir partenaire
          </button>
        </div>
      </section>
    </div>
  );
};

export default BoutiquePage; 