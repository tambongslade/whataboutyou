import React, { useState, useEffect } from 'react';
import { votingService, candidateService, handleApiError, type Candidate } from '../services/candidateService';

interface VotingModalProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
  onVoteComplete?: () => void;
}

type ModalStep = 'payment' | 'polling' | 'success' | 'cancelled';

const VotingModal: React.FC<VotingModalProps> = ({ candidate, isOpen, onClose, onVoteComplete }) => {
  // Form states
  const [paymentMethod, setPaymentMethod] = useState<'MTN' | 'ORANGEMONEY'>('MTN');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState(500);
  const [amountInput, setAmountInput] = useState('500');
  const [email, setEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Modal flow states
  const [step, setStep] = useState<ModalStep>('payment');
  const [txRef, setTxRef] = useState('');
  const [, setPaymentInstructions] = useState('');
  const [votesEarned, setVotesEarned] = useState(0);
  const [pollCleanup, setPollCleanup] = useState<(() => void) | null>(null);

  // Calculate votes (100 FCFA = 1 vote)
  const votes = Math.floor(amount / 100);

  // Cleanup polling on unmount or close
  useEffect(() => {
    return () => {
      if (pollCleanup) {
        pollCleanup();
      }
    };
  }, [pollCleanup]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep('payment');
      setError(null);
      setTxRef('');
      setPaymentInstructions('');
      setVotesEarned(0);
    }
  }, [isOpen]);

  // Handle amount input changes
  const handleAmountChange = (value: string) => {
    setAmountInput(value);
    const numValue = parseInt(value) || 0;
    if (numValue >= 100) {
      setAmount(numValue);
    }
  };

  const handleAmountBlur = () => {
    const numValue = parseInt(amountInput) || 0;
    if (numValue < 100 || amountInput === '') {
      setAmountInput('100');
      setAmount(100);
    } else {
      setAmount(numValue);
    }
  };

  // Step 1: Handle payment form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Debug: Check candidate structure
      console.log('🗳️ Full candidate object:', candidate);
      console.log('🗳️ Available candidate fields:', Object.keys(candidate));
      console.log('🗳️ Candidate._id:', candidate._id);
      console.log('🗳️ Candidate.id:', candidate.id);
      
      // Extract candidate ID - try multiple possible field names
      const candidateId = candidate._id || candidate.id || (candidate as any).candidateId || (candidate as any).mongoId;
      
      console.log('🗳️ Extracted candidate ID:', candidateId);
      console.log('🗳️ CandidateId type:', typeof candidateId);
      console.log('🗳️ CandidateId length:', candidateId?.length);
      
      if (!candidateId || candidateId === '' || candidateId === 'undefined') {
        console.error('🗳️ No valid candidate ID found!');
        console.error('🗳️ candidate._id:', candidate._id);
        console.error('🗳️ candidate.id:', candidate.id);
        console.error('🗳️ Full candidate object:', JSON.stringify(candidate, null, 2));
        
        // Temporary fallback - use a test ID to verify the API works
        console.warn('🗳️ Using temporary test candidate ID');
        const testCandidateId = '507f1f77bcf86cd799439011'; // Use the test ID you provided
        
        // Create payload with test ID
        const testPayload = {
          candidateId: testCandidateId,
          phoneNumber: String(phoneNumber),
          paymentMethod: (paymentMethod === 'MTN' ? 'MOMO CM' : 'OM CM') as 'MOMO CM' | 'OM CM',
          amount: Number(amount),
          email: String(email),
          customerName: String(customerName)
        };
        
        console.log('🗳️ Sending test payload:', testPayload);
        
        try {
          const result = await candidateService.createVote(testPayload);
          console.log('🗳️ Test API call succeeded!', result);
          setError('Test réussi avec ID temporaire. Problème confirmé: extraction de candidateId');
        } catch (err) {
          console.error('🗳️ Test API call failed:', err);
          setError('Test échoué même avec ID temporaire. Problème: ' + handleApiError(err));
        }
        setLoading(false);
        return;
      }

      // Map payment method to backend format
      const backendPaymentMethod = paymentMethod === 'MTN' ? 'MOMO CM' : 'OM CM';
      
      // Create the exact payload format you specified
      const votePayload = {
        candidateId: String(candidateId), // Ensure it's a string
        phoneNumber: String(phoneNumber),
        paymentMethod: backendPaymentMethod as 'MOMO CM' | 'OM CM',
        amount: Number(amount),
        email: String(email),
        customerName: String(customerName)
      };

      console.log('🗳️ Sending vote payload:', votePayload);
      
      // Final validation before sending
      const requiredFields = ['candidateId', 'phoneNumber', 'paymentMethod', 'amount', 'email', 'customerName'];
      const missingFields = requiredFields.filter(field => !votePayload[field as keyof typeof votePayload]);
      
      if (missingFields.length > 0) {
        console.error('🗳️ CRITICAL: Payload missing required fields:', missingFields);
        console.error('🗳️ Current payload:', votePayload);
        throw new Error(`Champs requis manquants: ${missingFields.join(', ')}`);
      }
      
      console.log('🗳️ ✅ Payload validation passed. Sending:', votePayload);

      const result = await candidateService.createVote(votePayload);

      if (result.success && result.data) {
        setTxRef(result.data.txRef || '');
        setPaymentInstructions(result.data.paymentLink || `Paiement initié. Référence: ${result.data.txRef}`);
        setStep('polling');
        startPolling(result.data.txRef || '');
      } else {
        setError(result.error || 'Erreur lors de la création du vote');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Start payment status polling
  const startPolling = async (transactionRef: string) => {
    try {
      const cleanup = await votingService.startModalPolling(
        transactionRef,
        (status) => {
          console.log('🗳️ Payment status:', status);
        },
        (data) => {
          console.log('🗳️ Payment confirmed:', data);
          setVotesEarned(data.votes || data.points || 0);
          setStep('success');
          setTimeout(() => {
            handleClose();
            if (onVoteComplete) onVoteComplete();
          }, 3000);
        },
        (error) => {
          console.error('🗳️ Payment polling failed:', error);
          setError(error);
        }
      );
      
      setPollCleanup(() => cleanup);
    } catch (error) {
      console.error('Failed to start polling:', error);
      setError('Erreur lors de la vérification du paiement');
    }
  };

  // Step 3: Manual verification fallback
  const handleManualVerification = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await votingService.handleManualVerification(txRef);
      
      if (result.success) {
        setVotesEarned(result.data?.votes || result.data?.points || 0);
        setStep('success');
        if (pollCleanup) pollCleanup();
        setTimeout(() => {
          handleClose();
          if (onVoteComplete) onVoteComplete();
        }, 3000);
      } else {
        setError(result.error || 'Vérification manuelle échouée');
      }
    } catch {
      setError('Erreur lors de la vérification manuelle');
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close - only allow on payment step or after success/cancel
  const handleClose = () => {
    if (step === 'payment' || step === 'success' || step === 'cancelled') {
      if (pollCleanup) {
        pollCleanup();
      }
      onClose();
    } else if (step === 'polling') {
      if (confirm('Voulez-vous vraiment annuler? Le paiement pourrait encore être traité automatiquement.')) {
        if (pollCleanup) {
          pollCleanup();
        }
        setStep('cancelled');
        setTimeout(() => onClose(), 1000);
      }
    }
  };

  if (!isOpen) return null;

  // Step 1: Payment Form
  if (step === 'payment') {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <div>
                  <span className="font-bold text-white text-lg">Voter pour {candidate.name}</span>
                  <p className="text-white/80 text-sm">100 FCFA = 1 VOTE • Minimum: 100 FCFA</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            {/* Left: Candidate Image */}
            <div className="lg:w-1/2 p-8">
              <div className="relative">
                <img
                  src={candidate.image}
                  alt={candidate.name}
                  className="w-full h-80 object-cover rounded-2xl shadow-xl"
                />
                <div className="absolute top-4 left-4 bg-yellow-400 text-black font-bold px-3 py-2 rounded-full">
                  #{candidate.ranking}
                </div>
                <div className="absolute top-4 right-4 bg-white/90 text-gray-800 font-bold px-3 py-2 rounded-full">
                  {candidate.votes} votes
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="lg:w-1/2 p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Méthode de paiement
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as 'MTN' | 'ORANGEMONEY')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="MTN">🟡 MTN Mobile Money</option>
                    <option value="ORANGEMONEY">🟠 Orange Money</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Numéro de téléphone
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="674123456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Montant (FCFA)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amountInput}
                      onChange={(e) => handleAmountChange(e.target.value)}
                      onBlur={handleAmountBlur}
                      min="100"
                      step="100"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                      FCFA
                    </span>
                  </div>
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Votes à donner: {votes}</strong> • 100 FCFA = 1 vote
                    </p>
                  </div>
                  
                  {/* Quick amount buttons */}
                  <div className="mt-3 grid grid-cols-4 gap-2">
                    {[100, 500, 1000, 2500].map((quickAmount) => (
                      <button
                        key={quickAmount}
                        type="button"
                        onClick={() => {
                          setAmount(quickAmount);
                          setAmountInput(quickAmount.toString());
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          amount === quickAmount
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {quickAmount}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !candidate.isActive}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Traitement...</span>
                    </>
                  ) : (
                    <>
                      <span>VOTER MAINTENANT - {amount.toLocaleString()} FCFA</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Polling Status
  if (step === 'polling') {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
          
          <h3 className="text-2xl font-bold text-blue-600 mb-4">
            Vérification du paiement... 📱
          </h3>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800 font-semibold mb-2">Vote pour: {candidate.name}</p>
            <p className="text-sm text-blue-700 mb-2">Référence: {txRef}</p>
            <p className="text-sm text-blue-700 mb-2">Montant: {amount.toLocaleString()} FCFA</p>
            <p className="text-sm text-blue-700">Votes à donner: {votes}</p>
          </div>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Que se passe-t-il?</h4>
            <p className="text-sm text-yellow-700 mb-2">
              • Nous vérifions votre paiement toutes les 3 secondes
            </p>
            <p className="text-sm text-yellow-700 mb-2">
              • Notre système automatique vérifie aussi toutes les 5 minutes
            </p>
            <p className="text-sm text-yellow-600">
              • Même si vous fermez cette fenêtre, votre vote sera confirmé automatiquement
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
          
          <div className="flex flex-col space-y-3">
            <button
              onClick={handleManualVerification}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Forcer la vérification</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleClose}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-xl transition-colors"
            >
              Fermer (le vote continuera en arrière-plan)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 3: Success
  if (step === 'success') {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-green-600 mb-4">
            Vote confirmé! 🎉
          </h3>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-green-800 font-semibold mb-2">
              ✅ Vote enregistré pour {candidate.name}
            </p>
            <p className="text-sm text-green-700 mb-2">
              💰 Montant: {amount.toLocaleString()} FCFA
            </p>
            <p className="text-sm text-green-700">
              ⭐ Votes ajoutés: +{votesEarned}
            </p>
          </div>
          
          <p className="text-gray-600 text-sm mb-6">
            Merci pour votre soutien! Le classement sera mis à jour automatiquement.
          </p>
          
          <button
            onClick={handleClose}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  // Step 4: Cancelled
  if (step === 'cancelled') {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center">
          <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5l-6.928-12c-.77-.833-2.694-.833-3.464 0l-6.928 12c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          
          <h3 className="text-2xl font-bold text-orange-600 mb-4">
            Vote en attente ⏳
          </h3>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-orange-800 font-semibold mb-2">
              🔄 Votre vote est toujours en cours de traitement
            </p>
            <p className="text-sm text-orange-700 mb-2">
              Référence: {txRef}
            </p>
            <p className="text-sm text-orange-700">
              Notre système automatique continuera à vérifier votre paiement toutes les 5 minutes.
            </p>
          </div>
          
          <p className="text-gray-600 text-sm mb-6">
            Si votre paiement est validé, votre vote sera automatiquement confirmé!
          </p>
          
          <button
            onClick={handleClose}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Fermer
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default VotingModal; 