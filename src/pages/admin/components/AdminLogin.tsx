import { useState, useEffect } from 'react';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Background images array
  const backgroundImages = [
    '/Header.webp',
    '/eventhero.webp',
    '/missandmasterhero.webp',
    '/tombolahero.webp',
    '/WhatAboutYou - Events.webp',
    '/Photo.webp'
  ];

  // Auto-change background images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await onLogin(formData.username, formData.password);
      
      if (!success) {
        setError('Email ou mot de passe incorrect');
      }
    } catch (error) {
      setError('Erreur de connexion. Veuillez réessayer.');
    }
    
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden">
      {/* Background Images with Slideshow */}
      <div className="absolute inset-0">
        {backgroundImages.map((image, index) => (
          <div
            key={image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img 
              src={image} 
              alt={`Background ${index + 1}`} 
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      {/* Image Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {backgroundImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                index === currentImageIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      <div className="relative z-10 max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-3xl font-bold text-gray-800 mb-2">
            WhatAboutYou
          </div>
          <div className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded-full inline-block mb-4">
            Administration
          </div>
          <h2 className="text-xl text-gray-600">
            Connexion Administrateur
          </h2>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Entrez votre email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
              placeholder="Entrez votre mot de passe"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Connexion...
              </div>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        {/* Demo Credentials */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 text-center">
            <div className="font-medium mb-2">Identifiants de démonstration:</div>
            <div className="space-y-1">
              <div>Email: <span className="font-mono bg-gray-200 px-2 py-1 rounded">admin@wayback.com</span></div>
              <div>Mot de passe: <span className="font-mono bg-gray-200 px-2 py-1 rounded">Contactez l'administrateur</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 