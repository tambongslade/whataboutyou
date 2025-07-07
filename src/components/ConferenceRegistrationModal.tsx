import { useState } from 'react';
import { saveRegistration, type ConferenceRegistration } from '../services/registrationService';

interface ConferenceRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registrationNumber, setRegistrationNumber] = useState<string>('');

  // Phone number validation for Cameroon
  const validateCameroonPhone = (phone: string): boolean => {
    // Remove spaces and special characters
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    // Check if it matches Cameroon phone pattern
    return /^(\+237|237)?[6-9]\d{8}$/.test(cleanPhone);
  };

  const formatPhoneNumber = (phone: string): string => {
    // Remove all non-numeric characters except +
    const cleaned = phone.replace(/[^\d+]/g, '');
    
    // If it starts with +237, format it
    if (cleaned.startsWith('+237')) {
      const number = cleaned.slice(4);
      if (number.length <= 9) {
        return `+237 ${number.slice(0, 1)} ${number.slice(1, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7, 9)}`.trim();
      }
    }
    // If it starts with 237, format it
    else if (cleaned.startsWith('237')) {
      const number = cleaned.slice(3);
      if (number.length <= 9) {
        return `+237 ${number.slice(0, 1)} ${number.slice(1, 3)} ${number.slice(3, 5)} ${number.slice(5, 7)} ${number.slice(7, 9)}`.trim();
      }
    }
    // If it's just the number (starts with 6-9)
    else if (/^[6-9]/.test(cleaned)) {
      if (cleaned.length <= 9) {
        return `+237 ${cleaned.slice(0, 1)} ${cleaned.slice(1, 3)} ${cleaned.slice(3, 5)} ${cleaned.slice(5, 7)} ${cleaned.slice(7, 9)}`.trim();
      }
    }
    
    return cleaned;
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
    
    // Clear error when user starts typing
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Validate phone number
    if (!validateCameroonPhone(formData.numeroTelephone)) {
      setError('Veuillez saisir un numéro de téléphone camerounais valide (ex: +237 6 XX XX XX XX)');
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Save registration to Firebase
      const regNumber = await saveRegistration(formData as ConferenceRegistration);
      
      // Show success modal with registration number
      setRegistrationNumber(regNumber);
      setShowSuccess(true);
      
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
      setError(error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'inscription.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center p-4 z-50 backdrop-blur-md">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/30">
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Inscription à la Conférence
              </h2>
              <p className="text-gray-600">
                Rejoignez-nous pour une expérience entrepreneuriale unique
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl transition-colors duration-200 hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Situation Actuelle */}
            <div>
              <label className="block text-lg font-semibold text-gray-800 mb-6">
                Choisissez votre situation actuelle *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Rouge - Étudiants */}
                <div 
                  className={`relative cursor-pointer transition-all duration-300 ${
                    formData.situation === 'rouge' 
                      ? 'ring-2 ring-red-500 bg-red-50 border-red-500' 
                      : 'hover:bg-red-50 hover:border-red-300 bg-gray-50'
                  } border-2 border-gray-200 rounded-xl p-6 group`}
                  onClick={() => setFormData(prev => ({ ...prev, situation: 'rouge' }))}
                >
                  <input
                    type="radio"
                    name="situation"
                    value="rouge"
                    checked={formData.situation === 'rouge'}
                    onChange={handleInputChange}
                    className="sr-only"
                    required
                  />
                  <div className="text-center">
                    <div className="text-4xl mb-3">🔴</div>
                    <div className="text-red-600 font-bold text-sm mb-2">ROUGE</div>
                    <div className="text-gray-700 text-sm font-medium">
                      ÉTUDIANTS<br/>
                    </div>
                  </div>
                  {formData.situation === 'rouge' && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Bleu - Travailleurs */}
                <div 
                  className={`relative cursor-pointer transition-all duration-300 ${
                    formData.situation === 'bleu' 
                      ? 'ring-2 ring-blue-500 bg-blue-50 border-blue-500' 
                      : 'hover:bg-blue-50 hover:border-blue-300 bg-gray-50'
                  } border-2 border-gray-200 rounded-xl p-6 group`}
                  onClick={() => setFormData(prev => ({ ...prev, situation: 'bleu' }))}
                >
                  <input
                    type="radio"
                    name="situation"
                    value="bleu"
                    checked={formData.situation === 'bleu'}
                    onChange={handleInputChange}
                    className="sr-only"
                    required
                  />
                  <div className="text-center">
                    <div className="text-4xl mb-3">🔵</div>
                    <div className="text-blue-600 font-bold text-sm mb-2">BLEU</div>
                    <div className="text-gray-700 text-sm font-medium">
                    COLLÉGIENS
                    </div>
                  </div>
                  {formData.situation === 'bleu' && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Jaune - Collégiens */}
                <div 
                  className={`relative cursor-pointer transition-all duration-300 ${
                    formData.situation === 'jaune' 
                      ? 'ring-2 ring-yellow-500 bg-yellow-50 border-yellow-500' 
                      : 'hover:bg-yellow-50 hover:border-yellow-300 bg-gray-50'
                  } border-2 border-gray-200 rounded-xl p-6 group`}
                  onClick={() => setFormData(prev => ({ ...prev, situation: 'jaune' }))}
                >
                  <input
                    type="radio"
                    name="situation"
                    value="jaune"
                    checked={formData.situation === 'jaune'}
                    onChange={handleInputChange}
                    className="sr-only"
                    required
                  />
                  <div className="text-center">
                    <div className="text-4xl mb-3">🟡</div>
                    <div className="text-yellow-600 font-bold text-sm mb-2">JAUNE</div>
                    <div className="text-gray-700 text-sm font-medium">
                      TRAVAILLEURS
                    </div>
                  </div>
                  {formData.situation === 'jaune' && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Personnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Âge *
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    min="1"
                    max="120"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quartier *
                  </label>
                  <input
                    type="text"
                    name="quartier"
                    value={formData.quartier}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sexe *
                  </label>
                  <select
                    name="sexe"
                    value={formData.sexe}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="Homme">Homme</option>
                    <option value="Femme">Femme</option>
                    {/* <option value="Autre">Autre</option> */}
                  </select>
                </div>
                
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations de Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de Téléphone *
                  </label>
                  <input
                    type="tel"
                    name="numeroTelephone"
                    value={formData.numeroTelephone}
                    onChange={handleInputChange}
                    required
                    placeholder="6 XX XX XX XX ou +237 6 XX XX XX XX"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: 6XXXXXXXX, 237XXXXXXXXX ou +237XXXXXXXXX
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nationalité *
                </label>
                <input
                  type="text"
                  name="nationalite"
                  value={formData.nationalite}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                />
              </div>
            </div>

            {/* Status and Organization */}
            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations Professionnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Statut *
                  </label>
                  <select
                    name="statut"
                    value={formData.statut}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  >
                    <option value="">Sélectionnez...</option>
                    <option value="eleve">Élève</option>
                    <option value="etudiant">Étudiant</option>
                    <option value="travailleur">Travailleur</option>
                    <option value="entrepreneur">Entrepreneur</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organisation / Entreprise
                  </label>
                  <input
                    type="text"
                    name="organisation"
                    value={formData.organisation}
                    onChange={handleInputChange}
                    placeholder="Optionnel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Conference Experience */}
            <div className="bg-yellow-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Expérience de Conférence</h3>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Avez-vous déjà participé à une conférence ? *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  className={`relative cursor-pointer transition-all duration-300 ${
                    formData.aDejaParticipe === 'oui' 
                      ? 'ring-2 ring-green-500 bg-green-50 border-green-500' 
                      : 'hover:bg-green-50 hover:border-green-300 bg-white'
                  } border-2 border-gray-200 rounded-lg p-4`}
                  onClick={() => setFormData(prev => ({ ...prev, aDejaParticipe: 'oui' }))}
                >
                  <input
                    type="radio"
                    name="aDejaParticipe"
                    value="oui"
                    checked={formData.aDejaParticipe === 'oui'}
                    onChange={handleInputChange}
                    className="sr-only"
                    required
                  />
                  <div className="flex items-center justify-center">
                    <div className="text-2xl mr-3">✅</div>
                    <span className="font-medium text-gray-700">Oui</span>
                  </div>
                  {formData.aDejaParticipe === 'oui' && (
                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                <div 
                  className={`relative cursor-pointer transition-all duration-300 ${
                    formData.aDejaParticipe === 'non' 
                      ? 'ring-2 ring-red-500 bg-red-50 border-red-500' 
                      : 'hover:bg-red-50 hover:border-red-300 bg-white'
                  } border-2 border-gray-200 rounded-lg p-4`}
                  onClick={() => setFormData(prev => ({ ...prev, aDejaParticipe: 'non' }))}
                >
                  <input
                    type="radio"
                    name="aDejaParticipe"
                    value="non"
                    checked={formData.aDejaParticipe === 'non'}
                    onChange={handleInputChange}
                    className="sr-only"
                    required
                  />
                  <div className="flex items-center justify-center">
                    <div className="text-2xl mr-3">❌</div>
                    <span className="font-medium text-gray-700">Non</span>
                  </div>
                  {formData.aDejaParticipe === 'non' && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-8 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200 hover:border-gray-400"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 flex items-center justify-center ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Inscription en cours...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    S'inscrire à la Conférence
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-60">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center animate-bounce">
            <div className="mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Inscription Réussie!</h3>
              <p className="text-gray-600 mb-4">Votre inscription a été enregistrée avec succès.</p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-2">Votre numéro d'inscription:</p>
                <p className="text-2xl font-bold text-green-600">{registrationNumber}</p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-center mb-2">
                  <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <p className="text-sm font-medium text-blue-700">Email de confirmation</p>
                </div>
                <p className="text-xs text-blue-600">
                  Vous recevrez un email de confirmation sous peu avec tous les détails de votre inscription.
                </p>
              </div>
            </div>
            
            <button
              onClick={() => {
                setShowSuccess(false);
                onClose();
              }}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105"
            >
              Parfait!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConferenceRegistrationModal; 