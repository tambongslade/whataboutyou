import axios from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://https://wayback-1xgm.onrender.com:3001/api' 
    : 'http://localhost:3001/api');

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds for payment operations
});

// TypeScript Interfaces
export interface Candidate {
  id: string;
  name: string;
  category: 'miss' | 'master';
  ranking: number;
  points: number;
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
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVoteRequest {
  candidateId: string;
  phoneNumber: string;
  paymentMethod: 'MTN' | 'ORANGEMONEY';
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
      const response = await apiClient.post('/candidates/votes', voteData);
      return response.data;
    } catch (error) {
      console.error('Error creating vote:', error);
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
      // Step 1: Create vote and get payment link
      const voteResponse = await candidateService.createVote({
        candidateId,
        phoneNumber: voterInfo.phone,
        paymentMethod,
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

      // Step 3: Redirect to Flutterwave payment
      window.location.href = paymentLink;

      return { success: true, txRef, paymentLink };
    } catch (error) {
      console.error('Vote submission failed:', error);
      return { success: false, error: handleApiError(error) };
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