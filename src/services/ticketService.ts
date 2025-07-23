// ==========================================
// INTERFACES AND TYPES
// ==========================================

export interface TicketPurchaseData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  situation: 'rouge' | 'bleu' | 'jaune';
  price: number; // Fixed price in FCFA
  validDate: string; // YYYY-MM-DD
  paymentMethod: 'MOMO CM' | 'OM CM'; // Backend expects these exact values
}

export interface Ticket {
  id?: string;
  ticketNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  situation: 'rouge' | 'bleu' | 'jaune';
  price: number;
  purchaseDate: any;
  validDate: string;
  qrCode: string;
  qrCodeImage: string;
  secretHash: string;
  paymentMethod: 'MOMO CM' | 'OM CM';
  paymentStatus: 'pending' | 'confirmed' | 'failed';
  soleasPayReference?: string;
  soleasOrderId?: string;
  txRef: string;
  isValidated: boolean;
  validatedAt?: any;
  validatedBy?: string;
  validationLocation?: string;
  validationCount: number;
  ipAddress?: string;
  userAgent?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface TicketPurchaseResponse {
  success: boolean;
  data: {
    paymentInstructions: string;
    soleasOrderId: string;
    txRef: string;
    ticketNumber: string;
  };
  message?: string;
}

export interface TicketConfirmResponse {
  success: boolean;
  data: {
    message: string;
    ticket: {
      ticketNumber: string;
      customerName: string;
      situation: 'rouge' | 'bleu' | 'jaune';
      validDate: string;
      qrCodeImage: string;
    };
  };
  message?: string;
}

export interface TicketValidationResponse {
  success: boolean;
  data: {
    message: string;
    ticket: {
      ticketNumber: string;
      customerName?: string;
      situation?: 'rouge' | 'bleu' | 'jaune';
      validDate?: string;
      validatedAt?: string;
      validatedBy?: string;
    };
    isValid: boolean;
  };
  message?: string;
}

export interface TicketsStatistics {
  total: number;
  confirmed: number;
  pending: number;
  validated: number;
  bySituation: {
    rouge: number;
    bleu: number;
    jaune: number;
  };
  todayValid: number;
  todayValidated: number;
  totalRevenue: number;
}

export interface TicketsStatisticsResponse {
  success: boolean;
  data: TicketsStatistics;
  error?: string;
}

// ==========================================
// API CONFIGURATION
// ==========================================

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.whataboutyou.net' // Updated to correct production URL
  : 'http://localhost:3001';

// Debug: Log the API base URL being used
console.log('🎫 Ticket API Base URL:', API_BASE_URL);
console.log('🎫 Environment:', process.env.NODE_ENV);

// ==========================================
// API SERVICE CLASS
// ==========================================

class TicketAPI {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      // Get JWT token from localStorage for admin authentication
      const token = localStorage.getItem('adminToken');
      
      // Debug: Log token status for admin endpoints
      if (endpoint.includes('/statistics') || endpoint.includes('/admin')) {
        console.log('🔐 Admin token status:', {
          hasToken: !!token,
          tokenLength: token?.length || 0,
          endpoint
        });
      }
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      // Add any additional headers from options
      if (options.headers) {
        Object.assign(headers, options.headers);
      }
      
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Une erreur réseau s\'est produite');
    }
  }

  async purchaseTicket(ticketData: TicketPurchaseData): Promise<TicketPurchaseResponse> {
    // Debug: Log the data being sent to backend
    console.log('🎫 Sending ticket purchase data:', ticketData);
    
    const response = await this.makeRequest<TicketPurchaseResponse>('/api/tickets/purchase', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    });

    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Erreur lors de l\'achat du ticket');
  }

  // New methods for modal flow - Check ticket payment status
  async checkTicketStatus(txRef: string): Promise<{
    success: boolean;
    data?: {
      txRef: string;
      paymentStatus: 'pending' | 'confirmed' | 'failed';
      ticketNumber: string;
      amount: number;
      customerName: string;
      situation: 'rouge' | 'bleu' | 'jaune';
      createdAt: string;
    };
    message?: string;
  }> {
    console.log('🎫 Checking ticket status for:', txRef);
    
    const response = await this.makeRequest<{
      success: boolean;
      data?: {
        txRef: string;
        paymentStatus: 'pending' | 'confirmed' | 'failed';
        ticketNumber: string;
        amount: number;
        customerName: string;
        situation: 'rouge' | 'bleu' | 'jaune';
        createdAt: string;
      };
      message?: string;
    }>(`/api/tickets/status/${txRef}`);

    return response;
  }

  // New methods for modal flow - Manually verify ticket payment
  async verifyTicketPayment(txRef: string): Promise<{
    success: boolean;
    data?: {
      verified: boolean;
      paymentStatus: 'confirmed' | 'failed';
      message: string;
      ticketNumber?: string;
      qrCode?: string;
    };
    message?: string;
  }> {
    console.log('🎫 Manually verifying ticket payment for:', txRef);
    
    const response = await this.makeRequest<{
      success: boolean;
      data?: {
        verified: boolean;
        paymentStatus: 'confirmed' | 'failed';
        message: string;
        ticketNumber?: string;
        qrCode?: string;
      };
      message?: string;
    }>(`/api/tickets/verify-payment/${txRef}`, {
      method: 'POST',
    });

    return response;
  }

  async confirmPayment(txRef: string): Promise<TicketConfirmResponse> {
    const response = await this.makeRequest<TicketConfirmResponse>(`/api/tickets/confirm/${txRef}`, {
      method: 'POST',
    });

    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Erreur lors de la confirmation du paiement');
  }

  // Option 1: QR Code Validation (existing method)
  async validateTicket(qrCode: string, validatedBy: string, validationLocation: string): Promise<TicketValidationResponse> {
    const response = await this.makeRequest<TicketValidationResponse>('/api/tickets/validate', {
      method: 'POST',
      body: JSON.stringify({
        qrCode,
        validatedBy,
        validationLocation
      }),
    });

    return response;
  }

  // Option 2: ID-Only Validation (new method)
  async validateTicketById(ticketNumber: string, validatedBy: string, validationLocation: string): Promise<TicketValidationResponse> {
    const response = await this.makeRequest<TicketValidationResponse>('/api/tickets/validate', {
      method: 'POST',
      body: JSON.stringify({
        ticketNumber,
        idOnlyValidation: true,
        validatedBy,
        validationLocation
      }),
    });

    return response;
  }

  // Option 3: Convenient ID Endpoint (new)
  async validateTicketByIdEndpoint(ticketNumber: string, validatedBy: string, validationLocation: string): Promise<TicketValidationResponse> {
    const response = await this.makeRequest<TicketValidationResponse>(`/api/tickets/validate-by-id/${encodeURIComponent(ticketNumber)}`, {
      method: 'POST',
      body: JSON.stringify({
        validatedBy,
        validationLocation
      }),
    });

    return response;
  }

  async getTicketStatistics(): Promise<TicketsStatistics> {
    const response = await this.makeRequest<TicketsStatisticsResponse>('/api/tickets/statistics');
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error || 'Erreur lors de la récupération des statistiques');
    }
  }

  async searchTicketByEmail(email: string): Promise<Ticket | null> {
    try {
      const response = await this.makeRequest<{ success: boolean; data: Ticket; found: boolean; error?: string }>(
        `/api/tickets/search?email=${encodeURIComponent(email)}`
      );
      return response.success && response.found ? response.data : null;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async healthCheck(): Promise<{ status: string; message: string }> {
    const response = await this.makeRequest<{ status: string; message: string }>('/api/health');
    return response;
  }
}

// ==========================================
// SINGLETON INSTANCE
// ==========================================

const ticketAPI = new TicketAPI();

// ==========================================
// EXPORTED FUNCTIONS
// ==========================================

export const purchaseTicket = (data: TicketPurchaseData): Promise<TicketPurchaseResponse> => 
  ticketAPI.purchaseTicket(data);

export const confirmPayment = (txRef: string): Promise<TicketConfirmResponse> => 
  ticketAPI.confirmPayment(txRef);

export const checkTicketStatusAPI = (txRef: string) => 
  ticketAPI.checkTicketStatus(txRef);

export const verifyTicketPaymentAPI = (txRef: string) => 
  ticketAPI.verifyTicketPayment(txRef);

// ==========================================
// TICKET MODAL FLOW UTILITIES
// ==========================================

export const ticketModalService = {
  // Start polling ticket payment status for modal flow
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
        
        const result = await ticketAPI.checkTicketStatus(txRef);
        
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
          onError('Délai d\'attente dépassé. Le ticket pourrait encore être traité par notre système automatique.');
          return;
        }
        
      } catch (error) {
        console.error('Ticket polling error:', error);
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
      const result = await ticketAPI.verifyTicketPayment(txRef);
      
      if (result.success && result.data && result.data.verified) {
        return { success: true, data: result.data };
      } else {
        return { 
          success: false, 
          error: result.data?.message || 'Vérification échouée. Le ticket sera vérifié automatiquement par notre système.' 
        };
      }
    } catch (error) {
      console.error('Manual ticket verification failed:', error);
      return { 
        success: false, 
        error: 'Erreur de vérification. Notre système automatique continuera à vérifier le paiement.' 
      };
    }
  },
};

export const validateTicket = (qrCode: string, validatedBy: string, validationLocation: string): Promise<TicketValidationResponse> => 
  ticketAPI.validateTicket(qrCode, validatedBy, validationLocation);

export const validateTicketById = (ticketNumber: string, validatedBy: string, validationLocation: string): Promise<TicketValidationResponse> => 
  ticketAPI.validateTicketById(ticketNumber, validatedBy, validationLocation);

export const validateTicketByIdEndpoint = (ticketNumber: string, validatedBy: string, validationLocation: string): Promise<TicketValidationResponse> => 
  ticketAPI.validateTicketByIdEndpoint(ticketNumber, validatedBy, validationLocation);

export const getTicketStatistics = (): Promise<TicketsStatistics> => 
  ticketAPI.getTicketStatistics();

export const searchTicketByEmail = (email: string): Promise<Ticket | null> => 
  ticketAPI.searchTicketByEmail(email);

// ==========================================
// ADDITIONAL EXPORTS
// ==========================================

export { ticketAPI };
export default ticketAPI;