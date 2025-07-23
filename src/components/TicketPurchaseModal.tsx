import { useState } from 'react';
import { purchaseTicket, type TicketPurchaseData } from '../services/ticketService';

interface TicketPurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}


interface SituationOption {
  id: 'rouge' | 'bleu' | 'jaune';
  name: string;
  color: string;
  bgColor: string;
  description: string;
  features: string[];
}

const TicketPurchaseModal = ({ isOpen, onClose }: TicketPurchaseModalProps) => {
  // Helper function to get today's date - tickets are only valid for the current day
  const getTodayDateString = (): string => {
    const today = new Date();
    // Format as YYYY-MM-DD for API compatibility
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [selectedSituation, setSelectedSituation] = useState<'rouge' | 'bleu' | 'jaune' | ''>('');
  const [validDate] = useState<string>(getTodayDateString()); // Tickets only valid for today
  const [paymentMethod, setPaymentMethod] = useState<'MOMO' | 'OM'>('MOMO');  
  const [buyerInfo, setBuyerInfo] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPaymentInstructions, setShowPaymentInstructions] = useState(false);
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [ticketNumber, setTicketNumber] = useState('');



  const situationOptions: SituationOption[] = [
    {
      id: 'rouge',
      name: 'Section Rouge',
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      description: 'Places dans la section rouge - Même accès pour tous',
      features: [
        'Accès à toutes les conférences',
        'Participation aux activités',
        'Certificat de participation',
        'Places réservées section rouge'
      ]
    },
    {
      id: 'bleu',
      name: 'Section Bleue',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200',
      description: 'Places dans la section bleue - Même accès pour tous',
      features: [
        'Accès à toutes les conférences',
        'Participation aux activités',
        'Certificat de participation',
        'Places réservées section bleue'
      ]
    },
    {
      id: 'jaune',
      name: 'Section Jaune',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50 border-yellow-200',
      description: 'Places dans la section jaune - Même accès pour tous',
      features: [
        'Accès à toutes les conférences',
        'Participation aux activités',
        'Certificat de participation',
        'Places réservées section jaune'
      ]
    }
  ];

  // Payment methods as per API specification - Only MTN MOMO and Orange OM
  const paymentMethods = [
    { id: 'MOMO' as const, name: 'MTN Mobile Money', description: 'MTN Mobile Money (MOMO)', icon: '📱' },
    { id: 'OM' as const, name: 'Orange Money', description: 'Orange Money (OM)', icon: '🟠' }
  ];

  const selectedSituationData = situationOptions.find(situation => situation.id === selectedSituation);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBuyerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!selectedSituation) {
        throw new Error('Veuillez sélectionner une situation');
      }

      // Normalize phone number for Cameroon
      let normalizedPhone = buyerInfo.customerPhone.trim();
      
      // Remove any spaces, dashes, or dots
      normalizedPhone = normalizedPhone.replace(/[\s\-\.]/g, '');
      
      // Handle different phone number formats
      if (normalizedPhone.startsWith('+237')) {
        // Remove +237 to get local format
        normalizedPhone = normalizedPhone.substring(4);
      } else if (normalizedPhone.startsWith('237')) {
        // Remove 237 to get local format
        normalizedPhone = normalizedPhone.substring(3);
      } else if (normalizedPhone.startsWith('0')) {
        // Remove leading 0 for local format
        normalizedPhone = normalizedPhone.substring(1);
      }
      
      // Validate that we have a 9-digit Cameroon number
      if (!/^[67]\d{8}$/.test(normalizedPhone)) {
        throw new Error('Veuillez saisir un numéro de téléphone camerounais valide (ex: 695123456 ou 670527426)');
      }

      // Map frontend payment method to backend format
      const paymentMethodMap = {
        'MOMO': 'MOMO CM',     // MTN Mobile Money Cameroon
        'OM': 'OM CM'          // Orange Money Cameroon
      } as const;
      
      const backendPaymentMethod = paymentMethodMap[paymentMethod];
      
      console.log('🎫 Payment method mapping:', {
        frontend: paymentMethod,
        backend: backendPaymentMethod
      });
      
      const ticketData: TicketPurchaseData = {
        customerName: buyerInfo.customerName.trim(),
        customerEmail: buyerInfo.customerEmail.trim().toLowerCase(),
        customerPhone: normalizedPhone, // Send in local format without country code
        situation: selectedSituation as 'rouge' | 'bleu' | 'jaune',
        price: 1000, // Fixed price in FCFA as per API specification
        validDate: validDate, // YYYY-MM-DD format
        paymentMethod: backendPaymentMethod
      };

      // Debug log before sending - matches backend format exactly
      console.log('🎫 Ticket payload being sent to backend:', JSON.stringify(ticketData, null, 2));
      console.log('🎫 Raw ticket data:', ticketData);

      // Validate all required fields are present
      const requiredFields = ['customerName', 'customerEmail', 'customerPhone', 'situation', 'price', 'validDate', 'paymentMethod'];
      const missingFields = requiredFields.filter(field => !ticketData[field as keyof TicketPurchaseData]);
      if (missingFields.length > 0) {
        throw new Error(`Champs manquants: ${missingFields.join(', ')}`);
      }

      // Call ticket purchase API using service
      const result = await purchaseTicket(ticketData);

      setPaymentInstructions(result.data.paymentInstructions);
      setTicketNumber(result.data.ticketNumber);
      setShowPaymentInstructions(true);
      
      setTimeout(() => {
        setShowPaymentInstructions(false);
        onClose();
        // Reset form
        setSelectedSituation('');
        setBuyerInfo({ customerName: '', customerEmail: '', customerPhone: '' });
        setPaymentInstructions('');
        setTicketNumber('');
        // Note: validDate is fixed to today's date, no need to reset
      }, 8000); // Increased timeout to give more time to read instructions
    } catch (error) {
      console.error('Erreur lors de l\'achat:', error);
      alert('Erreur lors de l\'achat du ticket. Veuillez réessayer.');
    }
    
    setIsSubmitting(false);
  };

  if (!isOpen) return null;

  if (showPaymentInstructions) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl p-8 max-w-lg w-full text-center">
          <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-orange-600 mb-4">Commande créée - Paiement requis 📱</h3>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800 font-semibold mb-2">⚠️ TICKET NON CONFIRMÉ</p>
            <p className="text-sm text-red-700">Vous devez compléter le paiement maintenant</p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 font-semibold mb-2">Numéro de commande: {ticketNumber}</p>
            <p className="text-sm text-blue-700 font-medium mb-2">ÉTAPES À SUIVRE:</p>
            <p className="text-blue-900 font-medium">{paymentInstructions}</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-yellow-800">
              <span className="font-semibold">Important:</span> Votre ticket sera confirmé uniquement après le paiement. 
              Vous recevrez le QR code par email une fois le paiement traité.
            </p>
          </div>
          
          <p className="text-gray-600 text-sm font-medium mb-4">
            💳 Effectuez le paiement maintenant pour confirmer votre ticket
          </p>
          
          <button
            onClick={() => {
              setShowPaymentInstructions(false);
              onClose();
              // Reset form
              setSelectedSituation('');
              setBuyerInfo({ customerName: '', customerEmail: '', customerPhone: '' });
              setPaymentInstructions('');
              setTicketNumber('');
            }}
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">Achetez votre ticket WAY 2025</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Important Notice */}
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-blue-800">Important :</span>
              </div>
              <p className="text-blue-700 text-sm">
                <strong>Ce ticket est valide uniquement pour aujourd'hui</strong> ({new Date(validDate).toLocaleDateString('fr-FR', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}).<br/>
                Vous devez présenter ce ticket le jour même de l'achat pour accéder à l'événement.
              </p>
            </div>
          </div>

          {/* Situation Selection */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Choisissez votre section</h3>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-semibold text-orange-800">Tarif unique :</span>
              </div>
              <p className="text-orange-700 text-sm">
                <strong>Tous les tickets coûtent 1,000 FCFA</strong> et donnent le même accès. 
                Les sections (rouge/bleue/jaune) sont uniquement pour l'organisation des places.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {situationOptions.map((situation) => (
                <div 
                  key={situation.id}
                  className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedSituation === situation.id 
                      ? `border-${situation.id === 'rouge' ? 'red' : situation.id === 'bleu' ? 'blue' : 'yellow'}-500 ${situation.bgColor}` 
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                  onClick={() => setSelectedSituation(situation.id)}
                >
                  <div className="text-center mb-3">
                    <h4 className={`font-bold text-lg ${situation.color}`}>{situation.name}</h4>
                    <div className="text-2xl font-bold text-orange-600">
                      1,000 FCFA
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{situation.description}</p>
                    <div className="text-xs text-orange-600 font-medium bg-orange-100 px-2 py-1 rounded-full mt-2 inline-block">
                      Valide uniquement aujourd'hui ({new Date(validDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })})
                    </div>
                  </div>
                  
                  <ul className="space-y-1">
                    {situation.features.map((feature, index) => (
                      <li key={index} className="text-sm flex items-center">
                        <span className="text-green-500 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <input 
                    type="radio" 
                    name="situation" 
                    value={situation.id}
                    checked={selectedSituation === situation.id}
                    onChange={() => setSelectedSituation(situation.id)}
                    className="absolute top-2 right-2"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          {selectedSituation && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Méthode de paiement</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => (
                  <div 
                    key={method.id}
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      paymentMethod === method.id 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="mr-3"
                      />
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{method.icon}</span>
                        <div>
                          <h4 className="font-semibold">{method.name}</h4>
                          <p className="text-sm text-gray-600">{method.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Buyer Information */}
          {selectedSituation && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Informations acheteur</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={buyerInfo.customerName}
                    onChange={handleInputChange}
                    required
                    placeholder="Nom et prénom"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="customerEmail"
                    value={buyerInfo.customerEmail}
                    onChange={handleInputChange}
                    required
                    placeholder="votre@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de téléphone *
                  </label>
                  <input
                    type="tel"
                    name="customerPhone"
                    value={buyerInfo.customerPhone}
                    onChange={handleInputChange}
                    required
                    placeholder="695123456"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Format: 695123456, 670527426 ou +237695123456
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order Summary & Submit */}
          {selectedSituation && (
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">Résumé de commande</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span>Ticket {selectedSituationData?.name}</span>
                  <span>1,000 FCFA</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Date de validité</span>
                  <span>Aujourd'hui uniquement ({new Date(validDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })})</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Méthode de paiement</span>
                  <span>{paymentMethods.find(m => m.id === paymentMethod)?.name}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-600">1,000 FCFA</span>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting || !selectedSituation || !buyerInfo.customerName || !buyerInfo.customerEmail || !buyerInfo.customerPhone}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Traitement...
                  </div>
                ) : (
                  'Commander votre ticket - 1,000 FCFA'
                )}
              </button>
              
              <div className="text-center mt-4 text-sm text-gray-600">
                <p>🔒 Paiement sécurisé via Mobile Money</p>
                <p>📧 QR Code envoyé par email après paiement</p>
              </div>
            </div>
          )}

          {!selectedSituation && (
            <div className="text-center py-8">
              <p className="text-gray-500">Sélectionnez une section pour continuer</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default TicketPurchaseModal;