import { useState, useEffect } from 'react';
import { saveRegistration, checkEmailExists, getAvailablePlaces, type ConferenceRegistration, type PlacesInfo } from '../services/registrationService';

interface ConferenceRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Error types for better handling
type ErrorType = 'validation' | 'network' | 'server' | 'duplicate' | 'unknown';

interface AppError {
  type: ErrorType;
  message: string;
  field?: string;
  retryable?: boolean;
}

// Field validation errors
interface FieldErrors {
  [key: string]: string;
}

const ConferenceRegistrationModal = ({ isOpen, onClose }: ConferenceRegistrationModalProps) => {
  const [formData, setFormData] = useState({
    situation: '',
    nom: '',
    prenom: '',
    age: '',
    sexe: '',
    numeroTelephone: '',
    email: '',
    quartier: '',
    statut: '',
    organisation: '',
    aDejaParticipe: '',
    nationalite: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [placesInfo, setPlacesInfo] = useState<PlacesInfo | null>(null);

  // Fetch available places when modal opens
  useEffect(() => {
    if (isOpen) {
      getAvailablePlaces()
        .then(setPlacesInfo)
        .catch(() => setPlacesInfo(null));
    }
  }, [isOpen]);

  // International phone number validation
  const validateInternationalPhone = (phone: string): boolean => {
    // Remove spaces and special characters
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    // Basic international phone validation - starts with + followed by 1-4 digits for country code, then 4-15 digits
    return /^\+\d{1,4}\d{4,15}$/.test(cleanPhone);
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-numeric characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // If it doesn't start with +, add it
    if (!cleaned.startsWith('+') && cleaned.length > 0) {
      return `+${cleaned}`;
    }
    
    return cleaned;
  };

  // Comprehensive form validation
  const validateForm = (): FieldErrors => {
    const errors: FieldErrors = {};

    // Required field validation
    if (!formData.situation) errors.situation = 'Veuillez sélectionner votre situation actuelle';
    if (!formData.nom.trim()) errors.nom = 'Le nom est requis';
    if (!formData.prenom.trim()) errors.prenom = 'Le prénom est requis';
    if (!formData.age) errors.age = 'L\'âge est requis';
    if (!formData.sexe) errors.sexe = 'Le sexe est requis';
    if (!formData.numeroTelephone.trim()) errors.numeroTelephone = 'Le numéro de téléphone est requis';
    if (!formData.email.trim()) errors.email = 'L\'email est requis';
    if (!formData.quartier.trim()) errors.quartier = 'Le quartier est requis';
    if (!formData.statut) errors.statut = 'Le statut est requis';
    if (!formData.aDejaParticipe) errors.aDejaParticipe = 'Veuillez indiquer si vous avez déjà participé à une conférence';
    if (!formData.nationalite.trim()) errors.nationalite = 'La nationalité est requise';

    // Specific field validation
    if (formData.nom && formData.nom.trim().length < 2) {
      errors.nom = 'Le nom doit contenir au moins 2 caractères';
    }
    if (formData.prenom && formData.prenom.trim().length < 2) {
      errors.prenom = 'Le prénom doit contenir au moins 2 caractères';
    }
    if (formData.age && (parseInt(formData.age) < 5 || parseInt(formData.age) > 120)) {
      errors.age = 'L\'âge doit être entre 5 et 120 ans';
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Veuillez saisir une adresse email valide';
    }
    if (formData.numeroTelephone && !validateInternationalPhone(formData.numeroTelephone)) {
      errors.numeroTelephone = 'Veuillez saisir un numéro de téléphone international valide (ex: +237 6XX XX XX XX)';
    }

    return errors;
  };

  // Create specific error objects
  const createError = (type: ErrorType, message: string, field?: string, retryable: boolean = false): AppError => ({
    type,
    message,
    field,
    retryable
  });

  // Handle network and server errors
  const handleSubmissionError = (error: unknown): AppError => {
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      // Network errors
      if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('connexion')) {
        return createError('network', 'Erreur de connexion. Vérifiez votre connexion internet et réessayez.', undefined, true);
      }
      
      // Duplicate email
      if (errorMessage.includes('email') && (errorMessage.includes('exist') || errorMessage.includes('déjà'))) {
        return createError('duplicate', 'Cette adresse email est déjà utilisée pour une inscription.', 'email');
      }
      
      // Server errors
      if (errorMessage.includes('500') || errorMessage.includes('server') || errorMessage.includes('serveur')) {
        return createError('server', 'Erreur du serveur. Notre équipe technique a été notifiée.', undefined, true);
      }
      
      // Client errors
      if (errorMessage.includes('400') || errorMessage.includes('invalid')) {
        return createError('validation', 'Données invalides. Veuillez vérifier vos informations.', undefined, false);
      }
      
      // Generic server error with the actual message
      return createError('server', error.message, undefined, true);
    }
    
    return createError('unknown', 'Une erreur inattendue s\'est produite. Veuillez réessayer.', undefined, true);
  };

  // Check if email exists before submission
  const checkEmailAvailability = async (email: string): Promise<boolean> => {
    try {
      setIsCheckingEmail(true);
      const exists = await checkEmailExists(email);
      if (exists) {
        setFieldErrors(prev => ({ ...prev, email: 'Cette adresse email est déjà utilisée pour une inscription.' }));
        return false;
      }
      // Clear email field error if it was previously set
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.email;
        return newErrors;
      });
      return true;
    } catch (error) {
      // If email check fails, allow submission to proceed (don't block user)
      console.warn('Email check failed:', error);
      return true;
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone number formatting
    if (name === 'numeroTelephone') {
      const formattedPhone = formatPhoneNumber(value);
      setFormData(prev => ({
        ...prev,
        [name]: formattedPhone
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    // Clear general error when user modifies form
    if (error) setError(null);
  };

  // Email blur validation
  const handleEmailBlur = async () => {
    if (formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      await checkEmailAvailability(formData.email);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});
    
    try {
      // Check if places are full
      if (placesInfo?.isFull) {
        setError(createError('validation', 'Désolé, toutes les places sont prises. Les inscriptions sont complètes.'));
        setIsSubmitting(false);
        return;
      }

      // Client-side validation
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setFieldErrors(validationErrors);
        setError(createError('validation', 'Veuillez corriger les erreurs dans le formulaire.'));
        setIsSubmitting(false);
        return;
      }

      // Check email availability one more time before submission
      const emailAvailable = await checkEmailAvailability(formData.email);
      if (!emailAvailable) {
        setError(createError('duplicate', 'Cette adresse email est déjà utilisée. Veuillez utiliser une autre adresse.', 'email'));
        setIsSubmitting(false);
        return;
      }
      
      // Save registration to Firebase
      const regNumber = await saveRegistration(formData as ConferenceRegistration);
      
      // Show success modal with registration number
      setRegistrationNumber(regNumber);
      setShowSuccess(true);
      setRetryCount(0); // Reset retry count on success
      
      // Reset form
      setFormData({
        situation: '',
        nom: '',
        prenom: '',
        age: '',
        sexe: '',
        numeroTelephone: '',
        email: '',
        quartier: '',
        statut: '',
        organisation: '',
        aDejaParticipe: '',
        nationalite: ''
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      const appError = handleSubmissionError(error);
      setError(appError);
      
      // Increment retry count for retryable errors
      if (appError.retryable) {
        setRetryCount(prev => prev + 1);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Retry submission
  const handleRetry = () => {
    setError(null);
    handleSubmit(new Event('submit') as any);
  };

  if (!isOpen) return null;

  const inputClass = (fieldName: string) =>
    `w-full px-4 py-3 bg-white border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 text-sm ${
      fieldErrors[fieldName]
        ? 'border-red-300 focus:ring-red-400 bg-red-50/50'
        : 'border-gray-200 focus:ring-black/20 focus:border-gray-400 hover:border-gray-300'
    }`;

  const fieldError = (fieldName: string) =>
    fieldErrors[fieldName] ? (
      <p className="text-red-500 text-xs mt-1.5">{fieldErrors[fieldName]}</p>
    ) : null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-3 sm:p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">

        {/* Sticky Header */}
        <div className="px-6 sm:px-8 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
                Inscription Conférence
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                4 Juillet 2026 &middot; Palais des Congrès de Yaoundé
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Places Remaining — compact */}
          {placesInfo && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className={`font-semibold ${
                  placesInfo.isFull ? 'text-red-600' : placesInfo.remainingPlaces <= 50 ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {placesInfo.isFull
                    ? 'Complet'
                    : `${placesInfo.remainingPlaces} place${placesInfo.remainingPlaces > 1 ? 's' : ''} restante${placesInfo.remainingPlaces > 1 ? 's' : ''}`
                  }
                </span>
                <span className="text-gray-400">{placesInfo.totalRegistered}/{placesInfo.maxCapacity}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ${
                    placesInfo.isFull ? 'bg-red-500' : placesInfo.remainingPlaces <= 50 ? 'bg-orange-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min((placesInfo.totalRegistered / placesInfo.maxCapacity) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 sm:px-8 py-6">

          {/* Error Message */}
          {error && (
            <div className={`rounded-xl p-4 mb-6 flex items-start gap-3 ${
              error.type === 'network' ? 'bg-orange-50 text-orange-800' :
              error.type === 'duplicate' ? 'bg-amber-50 text-amber-800' :
              error.type === 'validation' ? 'bg-blue-50 text-blue-800' :
              'bg-red-50 text-red-800'
            }`}>
              <div className="flex-1 text-sm">
                <p className="font-medium">{error.message}</p>
                {error.retryable && (
                  <button
                    onClick={handleRetry}
                    disabled={isSubmitting}
                    className="mt-2 text-xs font-semibold underline underline-offset-2 hover:no-underline disabled:opacity-50"
                  >
                    Réessayer {retryCount > 0 && `(${retryCount}/3)`}
                  </button>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7">

            {/* ── Step 1: Situation ── */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Votre situation actuelle
              </label>
              {fieldErrors.situation && (
                <p className="text-red-500 text-xs mb-3">{fieldErrors.situation}</p>
              )}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'rouge', label: 'Étudiants', color: 'red' },
                  { value: 'bleu', label: 'Collégiens', color: 'blue' },
                  { value: 'jaune', label: 'Travailleurs', color: 'yellow' },
                ].map(({ value, label, color }) => {
                  const isSelected = formData.situation === value;
                  const colorMap: Record<string, { ring: string; bg: string; dot: string; text: string }> = {
                    red: { ring: 'ring-red-500', bg: 'bg-red-50', dot: 'bg-red-500', text: 'text-red-700' },
                    blue: { ring: 'ring-blue-500', bg: 'bg-blue-50', dot: 'bg-blue-500', text: 'text-blue-700' },
                    yellow: { ring: 'ring-yellow-500', bg: 'bg-yellow-50', dot: 'bg-yellow-500', text: 'text-yellow-700' },
                  };
                  const c = colorMap[color] ?? { ring: 'ring-gray-500', bg: 'bg-gray-50', dot: 'bg-gray-500', text: 'text-gray-700' };
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, situation: value }))}
                      className={`relative rounded-2xl p-4 text-center transition-all duration-200 border-2 cursor-pointer ${
                        isSelected
                          ? `${c.ring} ring-2 ${c.bg} border-transparent`
                          : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full ${c.dot} mx-auto mb-2`} />
                      <div className={`text-xs font-bold uppercase tracking-wide ${isSelected ? c.text : 'text-gray-600'}`}>
                        {label}
                      </div>
                      {isSelected && (
                        <div className={`absolute top-2 right-2 ${c.dot} text-white rounded-full w-5 h-5 flex items-center justify-center`}>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Step 2: Personal Info ── */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Informations personnelles
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom *</label>
                  <input type="text" name="nom" value={formData.nom} onChange={handleInputChange} required placeholder="Votre nom" className={inputClass('nom')} />
                  {fieldError('nom')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom *</label>
                  <input type="text" name="prenom" value={formData.prenom} onChange={handleInputChange} required placeholder="Votre prénom" className={inputClass('prenom')} />
                  {fieldError('prenom')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Âge *</label>
                  <input type="number" name="age" value={formData.age} onChange={handleInputChange} required min="1" max="120" placeholder="Ex: 22" className={inputClass('age')} />
                  {fieldError('age')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Sexe *</label>
                  <select name="sexe" value={formData.sexe} onChange={handleInputChange} required className={inputClass('sexe')}>
                    <option value="">Sélectionnez</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                  </select>
                  {fieldError('sexe')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Quartier *</label>
                  <input type="text" name="quartier" value={formData.quartier} onChange={handleInputChange} required placeholder="Ex: Bastos, Bonamoussadi..." className={inputClass('quartier')} />
                  {fieldError('quartier')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Nationalité *</label>
                  <input type="text" name="nationalite" value={formData.nationalite} onChange={handleInputChange} required placeholder="Ex: Camerounaise" className={inputClass('nationalite')} />
                  {fieldError('nationalite')}
                </div>
              </div>
            </div>

            {/* ── Step 3: Contact ── */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Contact
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone *</label>
                  <input type="tel" name="numeroTelephone" value={formData.numeroTelephone} onChange={handleInputChange} required placeholder="+237 6XX XX XX XX" className={inputClass('numeroTelephone')} />
                  {fieldErrors.numeroTelephone ? (
                    <p className="text-red-500 text-xs mt-1.5">{fieldErrors.numeroTelephone}</p>
                  ) : (
                    <p className="text-gray-400 text-xs mt-1">Format international avec indicatif pays</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <div className="relative">
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} onBlur={handleEmailBlur} required placeholder="vous@email.com" className={inputClass('email')} />
                    {isCheckingEmail && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <svg className="w-4 h-4 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  {fieldError('email')}
                </div>
              </div>
            </div>

            {/* ── Step 4: Professional ── */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Situation professionnelle
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Statut *</label>
                  <select name="statut" value={formData.statut} onChange={handleInputChange} required className={inputClass('statut')}>
                    <option value="">Sélectionnez</option>
                    <option value="eleve">Élève</option>
                    <option value="etudiant">Étudiant</option>
                    <option value="travailleur">Travailleur</option>
                    <option value="entrepreneur">Entrepreneur</option>
                    <option value="autre">Autre</option>
                  </select>
                  {fieldError('statut')}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Organisation</label>
                  <input type="text" name="organisation" value={formData.organisation} onChange={handleInputChange} placeholder="Optionnel" className={inputClass('organisation')} />
                </div>
              </div>
            </div>

            {/* ── Step 5: Experience ── */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Avez-vous déjà participé à une conférence ?
              </label>
              {fieldErrors.aDejaParticipe && (
                <p className="text-red-500 text-xs mb-3">{fieldErrors.aDejaParticipe}</p>
              )}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'oui', label: 'Oui', selectedBg: 'bg-green-50', selectedRing: 'ring-green-500', selectedText: 'text-green-700' },
                  { value: 'non', label: 'Non', selectedBg: 'bg-gray-100', selectedRing: 'ring-gray-400', selectedText: 'text-gray-700' },
                ].map(({ value, label, selectedBg, selectedRing, selectedText }) => {
                  const isSelected = formData.aDejaParticipe === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, aDejaParticipe: value }))}
                      className={`rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200 border-2 cursor-pointer ${
                        isSelected
                          ? `${selectedRing} ring-2 ${selectedBg} border-transparent ${selectedText}`
                          : 'border-gray-100 text-gray-500 hover:border-gray-200 bg-gray-50/50'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Submit ── */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 sm:flex-none px-6 py-3 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-3 px-6 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                  isSubmitting
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-black text-white hover:bg-gray-800 active:scale-[0.98]'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Inscription en cours...
                  </>
                ) : (
                  "S'inscrire"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-[60] backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-sm w-full p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Inscription réussie !</h3>
            <p className="text-sm text-gray-500 mb-6">Votre place est confirmée.</p>

            <div className="bg-gray-50 rounded-2xl p-5 mb-5">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-medium">Numéro d'inscription</p>
              <p className="text-2xl font-bold text-gray-900 tracking-wide">{registrationNumber}</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <p className="text-sm font-medium text-blue-800">Email de confirmation envoyé</p>
              </div>
              <p className="text-xs text-blue-600 pl-6">
                Conservez votre numéro d'inscription, il vous sera demandé le jour de l'événement.
              </p>
            </div>

            <button
              onClick={() => {
                setShowSuccess(false);
                onClose();
              }}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold text-sm hover:bg-gray-800 transition-colors active:scale-[0.98]"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConferenceRegistrationModal; 