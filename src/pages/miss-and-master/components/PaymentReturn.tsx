import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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

  useEffect(() => {
    handlePaymentReturn();
  }, []);

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

            // Redirect to candidates page after 5 seconds
            setTimeout(() => {
              navigate('/miss-and-master');
            }, 5000);
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

          setTimeout(() => {
            navigate('/miss-and-master');
          }, 5000);
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
            <h2 className="text-3xl font-black text-green-600 mb-4">Paiement réussi!</h2>
            <p className="text-gray-700 mb-4">{message}</p>
            {candidateName && (
              <p className="text-lg font-semibold text-gray-800 mb-4">
                Vote pour <span className="text-pink-600">{candidateName}</span>
              </p>
            )}
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 mb-6">
              <p className="text-xl font-bold text-gray-900">
                <span className="text-2xl text-pink-600">{points}</span> point{points > 1 ? 's' : ''} ajouté{points > 1 ? 's' : ''} !
              </p>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
              <span>Redirection en cours...</span>
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
            <p className="text-gray-700 mb-6">{message}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/miss-and-master')}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
              >
                Retour aux candidats
              </button>
              <button
                onClick={handlePaymentReturn}
                className="w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 transition-all duration-200"
              >
                Réessayer la vérification
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentReturn;