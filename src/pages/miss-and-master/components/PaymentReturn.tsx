import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSEO } from '../../../hooks/useSEO';
import { votingService } from '../../../services/candidateService';

// Define the expected result type from handlePaymentReturn
interface PaymentResult {
  success: boolean;
  points?: number;
  error?: string;
}

const PaymentReturn: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');
  const [points, setPoints] = useState(0);
  const [candidateName, setCandidateName] = useState('');
  const [countdown, setCountdown] = useState(5);

  // SEO optimization based on payment status
  useSEO({
    title: status === 'success' 
      ? 'Paiement Réussi - Vote Confirmé | Miss & Master WAY 2025'
      : status === 'failed'
      ? 'Paiement Échoué | Miss & Master WAY 2025'
      : 'Vérification Paiement | Miss & Master WAY 2025',
    description: status === 'success'
      ? 'Votre vote a été confirmé avec succès ! Merci de votre participation au concours Miss & Master WAY 2025.'
      : status === 'failed'
      ? 'Échec du paiement. Veuillez réessayer pour confirmer votre vote au concours Miss & Master WAY 2025.'
      : 'Vérification de votre paiement en cours pour le concours Miss & Master WAY 2025.',
    keywords: 'paiement vote, Miss Master WAY 2025, vote confirmé, concours Cameroun',
    image: 'https://whataboutyou.cm/missandmasterhero.webp',
    url: `https://whataboutyou.cm/payment/${status}`,
    type: 'website'
  });

  useEffect(() => {
    handlePaymentReturn();
  }, []);

  // Countdown timer for success redirect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'success' && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (status === 'success' && countdown === 0) {
      navigate('/miss-and-master');
    }
    return () => clearTimeout(timer);
  }, [countdown, status, navigate]);

  const handlePaymentReturn = async () => {
    try {
      // Get URL parameters from Flutterwave redirect
      const txRef = searchParams.get('tx_ref');
      const paymentStatus = searchParams.get('status');
      const transactionId = searchParams.get('transaction_id');

      // Get candidate info from localStorage if available
      const pendingVote = JSON.parse(localStorage.getItem('pendingVote') || '{}');
      if (pendingVote.candidateName) {
        setCandidateName(pendingVote.candidateName);
      }

      // If we have URL parameters, check payment status first
      if (txRef && paymentStatus) {
        console.log('Payment return with params:', { txRef, paymentStatus, transactionId });

        if (paymentStatus === 'successful') {
          // Verify the payment with the backend
          const result: PaymentResult = await votingService.handlePaymentReturn() || { success: false };

          if (result && result.success) {
            setStatus('success');
            setMessage('Vote confirmé avec succès!');
            setPoints(result.points || 0);

            // Clean up localStorage
            localStorage.removeItem('pendingVote');
          } else {
            setStatus('failed');
            setMessage((result && result.error) || 'Échec de la confirmation du vote');
          }
        } else {
          setStatus('failed');
          setMessage('Le paiement a été annulé ou a échoué');
        }
      } else {
        // Fallback to original method if no URL params
        const result: PaymentResult = await votingService.handlePaymentReturn() || { success: false };

        if (result && result.success) {
          setStatus('success');
          setMessage('Vote confirmé avec succès!');
          setPoints(result.points || 0);

          // Clean up localStorage
          localStorage.removeItem('pendingVote');
        } else {
          setStatus('failed');
          setMessage((result && result.error) || 'Le paiement a échoué');
        }
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setStatus('failed');
      setMessage('Erreur lors de la vérification du paiement');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-md w-full text-center">
        {status === 'loading' && (
          <div>
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-pink-600 border-t-transparent mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Vérification du paiement</h2>
            <p className="text-gray-600">Veuillez patienter...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-green-600 mb-4 animate-pulse">Paiement réussi!</h2>
            <p className="text-gray-700 mb-4">{message}</p>
            {candidateName && (
              <div className="bg-white border-2 border-pink-200 rounded-xl p-4 mb-4">
                <p className="text-lg font-semibold text-gray-800">
                  Vote pour <span className="text-pink-600 font-bold">{candidateName}</span>
                </p>
                <div className="flex items-center justify-center mt-2">
                  <span className="text-2xl">👑</span>
                </div>
              </div>
            )}
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 mb-4 border-2 border-pink-200">
              <p className="text-xl font-bold text-gray-900">
                <span className="text-3xl text-pink-600 animate-bounce inline-block">+{points}</span> point{points > 1 ? 's' : ''} ajouté{points > 1 ? 's' : ''} !
              </p>
              <p className="text-sm text-gray-600 mt-1">Merci de votre soutien ! 🎉</p>
            </div>
            
            {/* Share buttons */}
            <div className="flex justify-center space-x-3 mb-6">
              <button 
                onClick={() => {
                  const text = `Je viens de voter pour ${candidateName || 'mon candidat préféré'} au concours Miss & Master WAY 2025 ! 👑✨ #WAY2025 #MissAndMaster`;
                  const url = 'https://whataboutyou.cm/miss-and-master';
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full transition-colors"
                title="Partager sur Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482 13.978 13.978 0 01-10.15-5.151 4.822 4.822 0 00-.665 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </button>
              <button 
                onClick={() => {
                  const text = `Je viens de voter pour ${candidateName || 'mon candidat préféré'} au concours Miss & Master WAY 2025 ! 👑✨`;
                  const url = 'https://whataboutyou.cm/miss-and-master';
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
                title="Partager sur Facebook"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>
            </div>
            <div className="flex flex-col items-center justify-center space-y-2 text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                <span>Redirection en cours...</span>
              </div>
              <div className="text-sm font-semibold">
                <span className="text-pink-600 text-lg">{countdown}</span> seconde{countdown > 1 ? 's' : ''}
              </div>
              <button
                onClick={() => navigate('/miss-and-master')}
                className="text-pink-600 hover:text-pink-800 text-sm font-medium underline"
              >
                Retourner maintenant
              </button>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-3xl font-black text-red-600 mb-4">Paiement échoué</h2>
            <p className="text-gray-700 mb-4">{message}</p>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-red-700">
                💡 <strong>Que faire ?</strong><br/>
                • Vérifiez votre connexion internet<br/>
                • Assurez-vous d'avoir suffisamment de fonds<br/>
                • Contactez-nous si le problème persiste
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/miss-and-master')}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                🏠 Retour aux candidats
              </button>
              <button
                onClick={handlePaymentReturn}
                className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200"
              >
                🔄 Réessayer la vérification
              </button>
              <a
                href="mailto:support@whataboutyou.cm"
                className="w-full bg-blue-50 text-blue-700 font-semibold py-3 px-6 rounded-xl hover:bg-blue-100 transition-all duration-200 text-center block"
              >
                📧 Contacter le support
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReturn;