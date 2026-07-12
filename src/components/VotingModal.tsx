import React, { useState, useEffect } from 'react';
import { votingService, candidateService, getImageUrl, handleApiError, VOTE_TIERS, type VoteAmount, type Candidate } from '../services/candidateService';

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
  const [amount, setAmount] = useState<VoteAmount>(500);
  const [email, setEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal flow states
  const [step, setStep] = useState<ModalStep>('payment');
  const [txRef, setTxRef] = useState('');
  const [paymentInstructions, setPaymentInstructions] = useState('');
  const [votesEarned, setVotesEarned] = useState(0);
  const [pollCleanup, setPollCleanup] = useState<(() => void) | null>(null);
  const [canForceVerify, setCanForceVerify] = useState(false);

  // Votes for the selected tier (500 → 5, 1000 → 11, 5000 → 55)
  const votes = VOTE_TIERS[amount];

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
      setCanForceVerify(false);
    }
  }, [isOpen]);

  // Enable the force-verify button after 60s of pending polling
  useEffect(() => {
    if (step !== 'polling') return;
    const timer = setTimeout(() => setCanForceVerify(true), 60000);
    return () => clearTimeout(timer);
  }, [step]);

  // Step 1: Handle payment form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const candidateId = candidate._id || candidate.id;

      if (!candidateId) {
        setError('Candidat invalide. Veuillez recharger la page et réessayer.');
        setLoading(false);
        return;
      }

      const result = await candidateService.createVote({
        candidateId: String(candidateId),
        phoneNumber: phoneNumber.replace(/\s/g, ''),
        paymentMethod: paymentMethod === 'MTN' ? 'MOMO CM' : 'OM CM',
        amount,
        email: email.trim(),
        customerName: customerName.trim()
      });

      if (result.success && result.data) {
        setTxRef(result.data.txRef || '');
        setPaymentInstructions(result.data.paymentInstructions || `Paiement initié. Référence: ${result.data.txRef}`);
        setStep('polling');
        startPolling(result.data.txRef || '');
      } else {
        // Business errors arrive with success:false (e.g. candidat inactif, méthode non supportée)
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
          <div className="relative bg-gradient-to-r from-[#2A1C36] to-[#140D18] p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-[#E8C15C]/15 p-2 rounded-full">
                  <svg className="w-6 h-6 text-[#E8C15C]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M5 16L3 8l5.5 2L12 4l3.5 6L21 8l-2 8H5zm2.7-2h8.6l.9-4.4-2.6 1-2-3.4-2 3.4-2.6-1L7.7 14z" />
                  </svg>
                </div>
                <div>
                  <span className="font-clash font-semibold text-white text-lg">Voter pour {candidate.name}</span>
                  <p className="text-[#E8C15C] text-sm">500 FCFA = 5 votes • 1000 = 11 • 5000 = 55</p>
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
                  src={getImageUrl(candidate.image)}
                  alt={candidate.name}
                  className="w-full h-80 object-cover rounded-2xl shadow-xl"
                />
                <div className="absolute top-4 left-4 bg-[#E8C15C] text-[#140D18] font-bold px-3 py-2 rounded-full">
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C89B3C] focus:border-[#C89B3C]"
                  >
                    <option value="MTN">🟡 MTN Mobile Money</option>
                    <option value="ORANGEMONEY">🟠 Orange Money</option>
                  </select>
                </div>

                {/* Phone Number (mobile money wallet) */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Numéro Mobile Money (qui paie)
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="674123456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C89B3C] focus:border-[#C89B3C]"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Le numéro du compte {paymentMethod === 'MTN' ? 'MTN Mobile Money' : 'Orange Money'} qui effectuera le paiement
                  </p>
                </div>

                {/* Vote tier */}
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Choisissez votre pack de votes
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(Object.entries(VOTE_TIERS) as unknown as [string, number][]).map(([tierAmount, tierVotes]) => {
                      const tier = Number(tierAmount) as VoteAmount;
                      return (
                        <button
                          key={tier}
                          type="button"
                          onClick={() => setAmount(tier)}
                          className={`p-4 rounded-xl border-2 text-center transition-all ${
                            amount === tier
                              ? 'border-[#C89B3C] bg-[#C89B3C]/10 shadow-md'
                              : 'border-gray-200 bg-white hover:border-[#C89B3C]/50'
                          }`}
                        >
                          <p className={`text-lg font-bold ${amount === tier ? 'text-[#8A6A1F]' : 'text-gray-800'}`}>
                            {tier.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500 mb-1">FCFA</p>
                          <p className={`text-sm font-semibold ${amount === tier ? 'text-[#8A6A1F]' : 'text-gray-600'}`}>
                            {tierVotes} votes
                          </p>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Votes à donner: {votes}</strong> pour {amount.toLocaleString()} FCFA
                    </p>
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C89B3C] focus:border-[#C89B3C]"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#C89B3C] focus:border-[#C89B3C]"
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
                  className="w-full bg-[#E8C15C] hover:bg-[#D9AF45] text-[#140D18] font-bold py-4 px-6 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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

          {paymentInstructions && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-purple-800 font-semibold">{paymentInstructions}</p>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2">💡 Que se passe-t-il?</h4>
            <p className="text-sm text-yellow-700 mb-2">
              • Validez le paiement sur votre téléphone (suivez les instructions ci-dessus)
            </p>
            <p className="text-sm text-yellow-700 mb-2">
              • Nous vérifions votre paiement toutes les 5 secondes
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
            {canForceVerify ? (
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
                    <span>J'ai payé — vérifier maintenant</span>
                  </>
                )}
              </button>
            ) : (
              <p className="text-xs text-gray-500">
                Un bouton de vérification manuelle apparaîtra si le paiement n'est pas confirmé d'ici une minute.
              </p>
            )}

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
              Si le paiement aboutit, vos votes seront crédités automatiquement. Conservez cette référence.
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