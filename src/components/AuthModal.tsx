import React, { useState, useEffect } from 'react';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://api.whataboutyou.net/api').replace(/\/+$/, '');

export interface AuthUser {
  id?: string;
  email: string;
  nom?: string;
  prenom?: string;
  numeroTelephone?: string;
  role?: string;
  [key: string]: unknown;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onSuccess?: (user: AuthUser, token: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login', onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    password: '',
    numeroTelephone: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError('');
    }
  }, [isOpen, initialMode]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = mode === 'signup' ? '/auth/register' : '/auth/login';
      const body =
        mode === 'signup'
          ? {
              nom: formData.nom,
              prenom: formData.prenom,
              email: formData.email,
              password: formData.password,
              ...(formData.numeroTelephone.trim() ? { numeroTelephone: formData.numeroTelephone.trim() } : {}),
            }
          : { email: formData.email, password: formData.password };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message =
          errorData.message ||
          (mode === 'signup' ? 'Inscription échouée. Veuillez réessayer.' : 'Email ou mot de passe incorrect.');
        setError(Array.isArray(message) ? message.join(' ') : String(message));
        setLoading(false);
        return;
      }

      const data = await response.json();
      const token = data.access_token || data.token || '';
      const user: AuthUser = data.user || { email: formData.email };

      if (token) localStorage.setItem('userToken', token);
      localStorage.setItem('userAuthenticated', 'true');
      localStorage.setItem('userInfo', JSON.stringify(user));

      onSuccess?.(user, token);
      onClose();
    } catch (err) {
      console.error('Auth error:', err);
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (next: 'login' | 'signup') => {
    if (next === mode) return;
    setMode(next);
    setError('');
    setFormData({ prenom: '', nom: '', email: '', password: '', numeroTelephone: '', acceptTerms: false });
  };

  if (!isOpen) return null;

  const tabClass = (active: boolean) =>
    `font-nekst flex-1 text-center text-xs tracking-[0.2em] uppercase py-3 transition-colors border-b-2 ${
      active
        ? 'text-black border-red-500'
        : 'text-gray-400 border-transparent hover:text-gray-700'
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[95vh] bg-white shadow-2xl overflow-hidden flex"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Fermer"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left brand panel — desktop only */}
        <div className="hidden md:flex md:w-5/12 bg-black text-white p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-yellow-400 blur-3xl" />
            <div className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full bg-red-500 blur-3xl" />
          </div>

          <div className="relative">
            <div className="font-nekst text-xs tracking-[0.3em] uppercase text-gray-400 mb-2">
              What About You
            </div>
            <div className="font-nekst text-2xl tracking-widest flex items-center gap-2">
              <span>WAY 2026</span>
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full" />
            </div>
          </div>

          <div className="relative space-y-4">
            <div className="w-12 h-1 bg-yellow-400" />
            <h2 className="font-nekst text-3xl leading-tight tracking-wide">
              {mode === 'login' ? 'Bon retour parmi nous.' : (
                <>Rejoignez <span className="text-yellow-400">l'aventure.</span></>
              )}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              {mode === 'login'
                ? "Accédez à votre compte pour retrouver vos billets, votes et inscriptions."
                : "Créez votre compte pour participer aux événements, voter et acheter vos billets."}
            </p>
          </div>

          <div className="relative font-nekst text-[10px] tracking-[0.3em] uppercase text-gray-500">
            <span className="text-red-500">23 — 26 janvier</span> · Édition 2026
          </div>
        </div>

        {/* Right form panel */}
        <div className="w-full md:w-7/12 flex flex-col max-h-[95vh]">
          {/* Tab switcher */}
          <div className="flex border-b border-gray-200 px-2 pt-6">
            <button onClick={() => switchMode('login')} className={tabClass(mode === 'login')}>
              Connexion
            </button>
            <button onClick={() => switchMode('signup')} className={tabClass(mode === 'signup')}>
              Inscription
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-8 sm:px-10 py-8">
            <div className="mb-6">
              <h3 className="font-nekst text-2xl tracking-wide text-black">
                {mode === 'login' ? 'Connectez-vous' : 'Créez votre compte'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {mode === 'login'
                  ? 'Entrez vos identifiants pour continuer.'
                  : 'Quelques informations pour démarrer.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="border border-red-200 bg-red-50 text-red-700 px-4 py-3 rounded text-sm">
                  {error}
                </div>
              )}

              {mode === 'signup' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                        Prénom
                      </label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleInputChange}
                        placeholder="John"
                        className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleInputChange}
                        placeholder="Doe"
                        className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                      Téléphone <span className="text-gray-400 normal-case tracking-normal">(optionnel)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </span>
                      <input
                        type="tel"
                        name="numeroTelephone"
                        value={formData.numeroTelephone}
                        onChange={handleInputChange}
                        placeholder="+237 6 00 00 00 00"
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider mb-2">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="vous@exemple.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    required
                    autoComplete="email"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Mot de passe
                  </label>
                  {mode === 'login' && (
                    <button type="button" className="text-xs text-gray-500 hover:text-red-500 underline-offset-2 hover:underline">
                      Mot de passe oublié ?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.105.895-2 2-2s2 .895 2 2v2H8v-2c0-1.105.895-2 2-2zm-7 9a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2H7a2 2 0 00-2 2v7z" />
                    </svg>
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={mode === 'login' ? 'Votre mot de passe' : 'Au moins 8 caractères'}
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                    aria-label={showPassword ? 'Masquer' : 'Afficher'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {showPassword ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      ) : (
                        <>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </>
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {mode === 'signup' && (
                <label className="flex items-start gap-3 text-sm text-gray-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="mt-0.5 w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500 accent-red-500"
                    required
                  />
                  <span>
                    J'accepte les{' '}
                    <a href="#" className="underline hover:text-red-500">Conditions Générales</a>
                    {' '}et la{' '}
                    <a href="#" className="underline hover:text-red-500">Politique de Confidentialité</a>.
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={loading}
                className="font-nekst w-full bg-red-500 text-white text-sm tracking-[0.2em] uppercase py-4 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-lg hover:shadow-red-500/30"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    <span>{mode === 'login' ? 'Connexion...' : 'Création...'}</span>
                  </>
                ) : (
                  <span>{mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</span>
                )}
              </button>

              <div className="text-center text-sm text-gray-500 pt-2">
                {mode === 'login' ? (
                  <>
                    Pas encore de compte ?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('signup')}
                      className="text-red-500 font-medium hover:underline"
                    >
                      Inscrivez-vous
                    </button>
                  </>
                ) : (
                  <>
                    Déjà un compte ?{' '}
                    <button
                      type="button"
                      onClick={() => switchMode('login')}
                      className="text-red-500 font-medium hover:underline"
                    >
                      Connectez-vous
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
