import React, { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    acceptTerms: false
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup') {
      console.log('Signup:', formData);
      // Handle signup logic
    } else {
      console.log('Login:', { email: formData.email, password: formData.password });
      // Handle login logic
    }
    onClose();
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      acceptTerms: false
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Switch Mode Button */}
        <button
          onClick={switchMode}
          className="absolute top-4 right-12 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-semibold hover:bg-yellow-500 transition-colors"
        >
          {mode === 'login' ? 'CRÉER UN COMPTE' : 'SE CONNECTER'}
        </button>

        {/* Decorative Elements */}
        <div className="absolute top-8 left-8 animate-float">
          {/* Popcorn Icon */}
          <div className="w-12 h-16 relative">
            <div className="w-8 h-10 bg-red-500 rounded-t-full mx-auto"></div>
            <div className="w-12 h-8 bg-yellow-400 rounded-b-lg relative -mt-2">
              <div className="absolute top-1 left-2 w-2 h-2 bg-white rounded-full"></div>
              <div className="absolute top-3 right-2 w-1 h-1 bg-white rounded-full"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="absolute top-12 right-16 animate-wiggle" style={{ animationDelay: '1s' }}>
          {/* Drink Icon */}
          <div className="w-8 h-12 relative">
            <div className="w-8 h-10 bg-red-500 rounded-lg relative">
              <div className="w-6 h-8 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-lg mx-auto mt-1"></div>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-4 h-2 bg-gray-700 rounded-t-lg"></div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 animate-bounce" style={{ animationDelay: '2s' }}>
          {/* Party Popper Icon */}
          <div className="w-10 h-12 relative">
            <div className="w-3 h-8 bg-yellow-400 rounded-full transform rotate-12 mx-auto"></div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-1 bg-red-400 rounded-full absolute -top-1 -left-1"></div>
              <div className="w-1 h-1 bg-blue-400 rounded-full absolute -top-2 left-1"></div>
              <div className="w-1 h-1 bg-green-400 rounded-full absolute -top-1 left-3"></div>
              <div className="w-1 h-1 bg-purple-400 rounded-full absolute top-0 left-4"></div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-12 right-8 animate-pulse" style={{ animationDelay: '3s' }}>
          {/* Cup Icon */}
          <div className="w-8 h-10 relative">
            <div className="w-8 h-8 bg-red-500 rounded-b-lg"></div>
            <div className="w-6 h-6 bg-gradient-to-b from-yellow-400 to-red-400 rounded-b-lg mx-auto -mt-1"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 pt-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {mode === 'login' ? 'CONNECTEZ-VOUS' : 'CRÉER UN COMPTE'}
            </h2>
            <p className="text-gray-600">
              {mode === 'login' 
                ? "Déjà inscrit ? Entrez vos identifiants pour retrouver vos activités et participer pleinement au festival."
                : "Rejoignez la communauté du festival WhataboutYou et accédez à toutes les événements."
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Entrez votre nom"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Entrez votre prénom"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse e-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Entrez votre e-mail"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder={mode === 'login' ? 'Entrez votre mot de passe' : 'Créez un mot de passe'}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {mode === 'signup' && (
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  required
                />
                <label className="text-sm text-gray-600">
                  J'accepte les Conditions Générales d'Utilisation et la Politique de Confidentialité.
                </label>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mode === 'login' ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                )}
              </svg>
              <span>{mode === 'login' ? 'SE CONNECTER' : 'CRÉER VOTRE COMPTE'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal; 