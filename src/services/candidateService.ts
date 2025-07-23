import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === 'production'
    ? 'https://whataboutyou.net/api/'
    : 'http://localhost:3001/api/');

// Debug: Log the API base URL being used
console.log('🔗 API Base URL:', API_BASE_URL);
console.log('🔗 Environment Mode:', import.meta.env.MODE);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000, // 30 seconds for payment operations
  withCredentials: false, // Explicitly set credentials policy
});

// TypeScript Interfaces
export interface Candidate {
  id: string; // Mapped from _id
  _id?: string; // MongoDB ObjectId from API
  firestoreId?: string;
  name: string;
  category: 'miss' | 'master';
  ranking: number;
  points?: number; // Legacy field (1 point = 1 vote)
  votes: number;
  image: string;
  sash: string;
  age?: number;
  city?: string;
  profession?: string;
  hobbies?: string[];
  description?: string;
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
    _id?: string;
  };
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number; // MongoDB version key
}

export interface CreateVoteRequest {
  candidateId: string;
  phoneNumber: string;
  paymentMethod: 'MOMO CM' | 'OM CM'; // Backend expects these exact values
  amount: number;
  email: string;
  customerName: string;
}

export interface VoteResponse {
  success: boolean;
  data?: {
    paymentLink: string;
    txRef: string;
  };
  error?: string;
}

export interface PaymentVerification {
  txRef: string;
}

export interface PaymentResult {
  id: string;
  txRef: string;
  status: 'pending' | 'successful' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  phoneNumber: string;
  network: string;
  customerEmail: string;
  candidateId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CandidateListResponse extends ApiResponse<Candidate[]> {
  count: number;
}

export interface CandidateStats {
  total: number;
  byCategory: {
    miss: number;
    master: number;
  };
  active: number;
  inactive: number;
  totalVotes: number;
  averageAge: number;
}

// Error handling utility
export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return `Erreur de validation: ${data.error || data.message}`;
      case 404:
        return "Ressource non trouvée";
      case 429:
        return "Trop de requêtes. Veuillez patienter.";
      case 500:
        return "Erreur serveur. Veuillez réessayer.";
      default:
        return data.error || "Une erreur est survenue";
    }
  } else if (error.request) {
    // Network error
    return "Erreur de connexion. Vérifiez votre connexion internet.";
  } else {
    // Other error
    return error.message || "Une erreur inattendue s'est produite";
  }
};

// Candidate Service Functions
export const candidateService = {
  // Get all candidates
  async getAllCandidates(): Promise<CandidateListResponse> {
    try {
      const response = await apiClient.get('/candidates');
      return response.data;
    } catch (error) {
      console.error('Error fetching candidates:', error);
      throw error;
    }
  },

  // Get candidates by category
  async getCandidatesByCategory(category: 'miss' | 'master'): Promise<CandidateListResponse> {
    try {
      const response = await apiClient.get(`/candidates?category=${category}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${category} candidates:`, error);
      throw error;
    }
  },

  // Get Miss candidates
  async getMissCandidates(): Promise<CandidateListResponse> {
    return this.getCandidatesByCategory('miss');
  },

  // Get Master candidates
  async getMasterCandidates(): Promise<CandidateListResponse> {
    return this.getCandidatesByCategory('master');
  },

  // Get single candidate
  async getCandidate(candidateId: string): Promise<ApiResponse<Candidate>> {
    try {
      const response = await apiClient.get(`/candidates/${candidateId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching candidate:', error);
      throw error;
    }
  },

  // Get candidate statistics
  async getCandidateStats(): Promise<ApiResponse<CandidateStats>> {
    try {
      const response = await apiClient.get('/candidates/statistics');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Create vote with payment
  async createVote(voteData: CreateVoteRequest): Promise<VoteResponse> {
    try {
      console.log('🗳️ Sending vote data to backend:', voteData);
      console.log('🗳️ Candidate ID in request:', voteData.candidateId);
      console.log('🗳️ Full vote API URL:', `${API_BASE_URL}/candidates/votes`);
      
      const response = await apiClient.post('/candidates/votes', voteData);
      return response.data;
    } catch (error: any) {
      console.error('Error creating vote:', error);
      
      // Log the error response for debugging
      if (error?.response) {
        console.error('🗳️ Backend error response:', error.response.data);
        console.error('🗳️ Backend error status:', error.response.status);
        console.error('🗳️ Full error URL:', error.config?.url);
      }
      
      throw error;
    }
  },

  // Check vote payment status (new endpoint for modal flow)
  async checkVoteStatus(txRef: string): Promise<ApiResponse<{
    txRef: string;
    paymentStatus: 'pending' | 'confirmed' | 'failed';
    candidateId: string;
    amount: number;
    points: number;
    createdAt: string;
    confirmedAt?: string;
  }>> {
    try {
      const response = await apiClient.get(`/candidates/votes/status/${txRef}`);
      return response.data;
    } catch (error) {
      console.error('Error checking vote status:', error);
      throw error;
    }
  },

  // Manually verify vote payment (new endpoint for modal flow)
  async verifyVotePayment(txRef: string): Promise<ApiResponse<{
    verified: boolean;
    paymentStatus: 'confirmed' | 'failed';
    message: string;
    points?: number;
  }>> {
    try {
      const response = await apiClient.post(`/candidates/votes/${txRef}/verify-payment`);
      return response.data;
    } catch (error) {
      console.error('Error verifying vote payment:', error);
      throw error;
    }
  },

  // Verify payment
  async verifyPayment(txRef: string): Promise<PaymentResult> {
    try {
      const response = await apiClient.post('/payments/verify', { txRef });
      return response.data;
    } catch (error) {
      console.error('Payment verification failed:', error);
      throw error;
    }
  },

  // Confirm vote after successful payment
  async confirmVote(txRef: string): Promise<ApiResponse<{ points: number }>> {
    try {
      const response = await apiClient.post(`/candidates/votes/${txRef}/confirm`);
      return response.data;
    } catch (error) {
      console.error('Vote confirmation failed:', error);
      throw error;
    }
  }
};

// Payment method mapping utility
const mapPaymentMethod = (frontendMethod: 'MTN' | 'ORANGEMONEY'): 'MOMO CM' | 'OM CM' => {
  const methodMap = {
    'MTN': 'MOMO CM',           // MTN Mobile Money Cameroon
    'ORANGEMONEY': 'OM CM'      // Orange Money Cameroon
  } as const;
  
  return methodMap[frontendMethod];
};

// Voting flow utilities
export const votingService = {
  // Complete voting flow
  async handleVoteSubmission(
    candidateId: string,
    voterInfo: { phone: string; email: string; name: string },
    amount: number,
    paymentMethod: 'MTN' | 'ORANGEMONEY',
    candidateName?: string
  ) {
    try {
      // Map frontend payment method to backend format
      const backendPaymentMethod = mapPaymentMethod(paymentMethod);
      
      console.log('🗳️ Payment method mapping:', {
        frontend: paymentMethod,
        backend: backendPaymentMethod
      });

      // Step 1: Create vote and get payment link
      const voteResponse = await candidateService.createVote({
        candidateId,
        phoneNumber: voterInfo.phone,
        paymentMethod: backendPaymentMethod,
        amount,
        email: voterInfo.email,
        customerName: voterInfo.name
      });

      if (!voteResponse.success) {
        throw new Error(voteResponse.error);
      }

      const { paymentLink, txRef } = voteResponse.data!;

      // Step 2: Store transaction reference for later verification
      localStorage.setItem('pendingVote', JSON.stringify({
        txRef,
        candidateId,
        candidateName,
        amount,
        timestamp: Date.now(),
        voterInfo
      }));

      // Step 3: Return payment info for modal handling (no redirect)
      console.log('🗳️ Payment link generated:', paymentLink);

      return { success: true, txRef, paymentLink };
    } catch (error) {
      console.error('Vote submission failed:', error);
      return { success: false, error: handleApiError(error) };
    }
  },

  // Modal flow polling (new method for secure polling)
  async startModalPolling(
    txRef: string, 
    onStatusChange: (status: 'pending' | 'confirmed' | 'failed') => void,
    onSuccess: (data: any) => void,
    onError: (error: string) => void
  ): Promise<() => void> {
    let pollInterval: NodeJS.Timeout;
    let totalAttempts = 0;
    const maxAttempts = 100; // Poll for up to 5 minutes (100 * 3 seconds)
    
    const poll = async (): Promise<void> => {
      try {
        totalAttempts++;
        
        const result = await candidateService.checkVoteStatus(txRef);
        
        if (result.success && result.data) {
          const { paymentStatus } = result.data;
          onStatusChange(paymentStatus);
          
          if (paymentStatus === 'confirmed') {
            clearInterval(pollInterval);
            onSuccess(result.data);
            return;
          }
          
          if (paymentStatus === 'failed') {
            clearInterval(pollInterval);
            onError('Paiement échoué ou expiré');
            return;
          }
        }
        
        // Continue polling if pending
        if (totalAttempts >= maxAttempts) {
          clearInterval(pollInterval);
          onError('Délai d\'attente dépassé. Le paiement pourrait encore être traité par notre système automatique.');
          return;
        }
        
      } catch (error) {
        console.error('Polling error:', error);
        totalAttempts++;
        
        if (totalAttempts >= maxAttempts) {
          clearInterval(pollInterval);
          onError('Erreur lors de la vérification du paiement');
          return;
        }
      }
    };
    
    // Start polling every 3 seconds
    pollInterval = setInterval(poll, 3000);
    
    // Initial poll
    poll();
    
    // Return cleanup function
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  },

  // Enhanced manual verification for modal flow
  async handleManualVerification(txRef: string): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const result = await candidateService.verifyVotePayment(txRef);
      
      if (result.success && result.data && result.data.verified) {
        return { success: true, data: result.data };
      } else {
        return { 
          success: false, 
          error: result.data?.message || 'Vérification échouée. Le paiement sera vérifié automatiquement par notre système.' 
        };
      }
    } catch (error) {
      console.error('Manual verification failed:', error);
      return { 
        success: false, 
        error: 'Erreur de vérification. Notre système automatique continuera à vérifier le paiement.' 
      };
    }
  },

  // Handle payment return and verification
  async handlePaymentReturn() {
    const pendingVote = JSON.parse(localStorage.getItem('pendingVote') || '{}');

    if (!pendingVote.txRef) {
      console.error('No pending vote found');
      return { success: false, error: 'Aucun vote en attente trouvé' };
    }

    try {
      // Verify payment with Flutterwave
      const paymentResult = await candidateService.verifyPayment(pendingVote.txRef);

      if (paymentResult.status === 'successful') {
        // Confirm vote and add points
        const voteResult = await candidateService.confirmVote(pendingVote.txRef);

        if (voteResult.success) {
          console.log(`Vote confirmed! ${voteResult.data?.points} points added`);
          localStorage.removeItem('pendingVote');

          return { success: true, points: voteResult.data?.points || 0 };
        }
      } else {
        console.error('Payment failed or pending');
        return { success: false, error: 'Paiement non complété' };
      }
    } catch (error) {
      console.error('Verification failed:', error);
      return { success: false, error: handleApiError(error) };
    }
  },

  // Poll payment status for better UX
  async pollPaymentStatus(txRef: string, maxAttempts: number = 20) {
    let attempts = 0;

    const poll = async (): Promise<any> => {
      try {
        const result = await candidateService.verifyPayment(txRef);

        if (result.status === 'successful') {
          return { status: 'completed', data: result };
        } else if (result.status === 'failed') {
          return { status: 'failed', data: result };
        }

        attempts++;
        if (attempts >= maxAttempts) {
          return { status: 'timeout', data: null };
        }

        // Wait 3 seconds before next attempt
        await new Promise(resolve => setTimeout(resolve, 3000));
        return poll();
      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) {
          return { status: 'error', error: handleApiError(error) };
        }

        await new Promise(resolve => setTimeout(resolve, 3000));
        return poll();
      }
    };

    return poll();
  }
};

export default candidateService;