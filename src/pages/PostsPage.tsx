import React from 'react';

const PostsPage: React.FC = () => {
  const posts = [
    {
      id: 1,
      title: "Les tendances créatives de 2024",
      excerpt: "Découvrez les dernières tendances qui façonnent le monde créatif cette année.",
      author: "Sarah Wilson",
      date: "15 Mars 2024",
      category: "Tendances",
      image: "/msg - blue.png"
    },
    {
      id: 2,
      title: "Comment valoriser son travail créatif",
      excerpt: "Conseils pratiques pour mettre en valeur vos créations et toucher votre audience.",
      author: "Tiana Brown",
      date: "12 Mars 2024",
      category: "Conseils",
      image: "/msg - red.png"
    },
    {
      id: 3,
      title: "Portrait : Maya, designer émergente",
      excerpt: "Rencontre avec une jeune créatrice qui révolutionne le design graphique.",
      author: "Alex Martin",
      date: "10 Mars 2024",
      category: "Portrait",
      image: "/msg-yellow.png"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">POSTS & ACTUALITÉS</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Restez informé des dernières actualités, tendances et histoires inspirantes de la communauté créative
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">ARTICLE À LA UNE</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl overflow-hidden shadow-lg">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 lg:p-12 text-white">
                  <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full text-sm font-medium mb-4 inline-block">
                    FEATURED
                  </span>
                  <h3 className="text-3xl font-bold mb-4">
                    L'avenir de la créativité numérique
                  </h3>
                  <p className="text-lg mb-6 text-blue-100">
                    Comment les nouvelles technologies transforment la façon dont les jeunes créateurs 
                    s'expriment et partagent leur art avec le monde.
                  </p>
                  <div className="flex items-center space-x-4 mb-6">
                    <span className="text-blue-100">Par Sarah Wilson</span>
                    <span className="text-blue-100">•</span>
                    <span className="text-blue-100">18 Mars 2024</span>
                  </div>
                  <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    Lire l'article
                  </button>
                </div>
                <div className="h-64 lg:h-auto">
                  <img
                    src="/msg - blue.png"
                    alt="Featured post"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/600x400/4F46E5/white?text=Featured+Post';
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">DERNIERS ARTICLES</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-48 relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300/gray/white?text=Blog+Post';
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-3 hover:text-purple-600 transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">CATÉGORIES</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto mb-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Tendances", count: 15, color: "bg-blue-500" },
              { name: "Conseils", count: 23, color: "bg-green-500" },
              { name: "Portraits", count: 18, color: "bg-purple-500" },
              { name: "Événements", count: 12, color: "bg-orange-500" }
            ].map((category) => (
              <div key={category.name} className={`${category.color} text-white rounded-xl p-6 text-center hover:scale-105 transition-transform cursor-pointer`}>
                <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                <p className="text-sm opacity-90">{category.count} articles</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-purple-500 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Restez informé</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Abonnez-vous à notre newsletter pour recevoir les derniers articles et actualités
          </p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              S'abonner
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PostsPage; 