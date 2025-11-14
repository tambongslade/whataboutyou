import { useState } from 'react';

interface TombolaRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ErrorType = 'validation' | 'network' | 'server' | 'duplicate' | 'unknown';

interface AppError {
  type: ErrorType;
  message: string;
  field?: string;
  retryable?: boolean;
}

interface FieldErrors {
  [key: string]: string;
}

const TombolaRegistrationModal = ({ isOpen, onClose }: TombolaRegistrationModalProps) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    numeroTelephone: '',
    nombreTickets: 1
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [purchaseNumber, setPurchaseNumber] = useState<string>('');

  const TICKET_PRICE = 1000; // Price per ticket in CFA

  const validateInternationalPhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/[\s\-().]/g, '');
    const phoneRegex = /^(\+|00)[\d\s\-().]{7,15}$/;
    return phoneRegex.test(cleanPhone);
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.nom.trim()) {
      errors.nom = 'Le nom est requis';
    }

    if (!formData.prenom.trim()) {
      errors.prenom = 'Le prénom est requis';
    }

    if (!formData.email.trim()) {
      errors.email = 'L\'email est requis';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = 'Format d\'email invalide';
      }
    }

    if (!formData.numeroTelephone.trim()) {
      errors.numeroTelephone = 'Le numéro de téléphone est requis';
    } else if (!validateInternationalPhone(formData.numeroTelephone)) {
      errors.numeroTelephone = 'Format de numéro invalide (ex: +237 6XX XXX XXX)';
    }

    if (formData.nombreTickets < 1 || formData.nombreTickets > 10) {
      errors.nombreTickets = 'Nombre de tickets doit être entre 1 et 10';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'nombreTickets' ? parseInt(value) || 1 : value
    }));

    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError({
        type: 'validation',
        message: 'Veuillez corriger les erreurs dans le formulaire'
      });
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Implement tombola service
      // const purchaseData: TicketPurchase = {
      //   ...formData,
      //   montantTotal: formData.nombreTickets * TICKET_PRICE
      // };
      // const result = await saveTombolaPurchase(purchaseData);
      
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockPurchaseNumber = `TOM${Date.now().toString().slice(-6)}`;
      setPurchaseNumber(mockPurchaseNumber);
      setShowSuccess(true);
      
    } catch (err: unknown) {
      console.error('Erreur lors de l\'achat des tickets:', err);
      setError({
        type: 'server',
        message: 'Erreur lors de l\'achat. Veuillez réessayer.',
        retryable: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      numeroTelephone: '',
      nombreTickets: 1
    });
    setError(null);
    setFieldErrors({});
    setShowSuccess(false);
    setPurchaseNumber('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {!showSuccess ? (
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Achat de tickets</h2>
              <button
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800 text-sm">{error.message}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom *
                </label>
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    fieldErrors.nom ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Votre nom"
                />
                {fieldErrors.nom && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.nom}</p>
                )}
              </div>

              {/* Prénom */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prénom *
                </label>
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    fieldErrors.prenom ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Votre prénom"
                />
                {fieldErrors.prenom && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.prenom}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="votre@email.com"
                />
                {fieldErrors.email && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Numéro de téléphone *
                </label>
                <input
                  type="tel"
                  name="numeroTelephone"
                  value={formData.numeroTelephone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    fieldErrors.numeroTelephone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+237 6XX XXX XXX"
                />
                {fieldErrors.numeroTelephone && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.numeroTelephone}</p>
                )}
              </div>

              {/* Nombre de tickets */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre de tickets *
                </label>
                <select
                  name="nombreTickets"
                  value={formData.nombreTickets}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 ${
                    fieldErrors.nombreTickets ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  {[1,2,3,4,5,6,7,8,9,10].map(num => (
                    <option key={num} value={num}>{num} ticket{num > 1 ? 's' : ''}</option>
                  ))}
                </select>
                {fieldErrors.nombreTickets && (
                  <p className="text-red-500 text-xs mt-1">{fieldErrors.nombreTickets}</p>
                )}
              </div>

              {/* Total */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Total à payer:</span>
                  <span className="text-xl font-bold text-red-600">
                    {(formData.nombreTickets * TICKET_PRICE).toLocaleString()} CFA
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {TICKET_PRICE.toLocaleString()} CFA par ticket
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:from-red-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Traitement en cours...
                  </span>
                ) : (
                  `Acheter ${formData.nombreTickets} ticket${formData.nombreTickets > 1 ? 's' : ''}`
                )}
              </button>
            </form>

            <p className="text-xs text-gray-500 mt-4 text-center">
              En achetant des tickets, vous participez automatiquement au tirage au sort pour gagner une PlayStation 5.
            </p>
          </div>
        ) : (
          /* Success State */
          <div className="p-6 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Achat confirmé !</h3>
              <p className="text-gray-600 mb-4">
                Vos tickets de tombola ont été achetés avec succès.
              </p>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <p className="text-sm text-gray-700">
                  <strong>Numéro d'achat:</strong> {purchaseNumber}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Tickets achetés:</strong> {formData.nombreTickets}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Montant payé:</strong> {(formData.nombreTickets * TICKET_PRICE).toLocaleString()} CFA
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Un email de confirmation a été envoyé à {formData.email}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300"
            >
              Fermer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TombolaRegistrationModal;