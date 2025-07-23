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
// CONFIGURATION
// ==========================================

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://wayback-1xgm.onrender.com' // Your actual Render backend URL
  : 'http://localhost:3001';

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

  async confirmPayment(txRef: string): Promise<TicketConfirmResponse> {
    const response = await this.makeRequest<TicketConfirmResponse>(`/api/tickets/confirm/${txRef}`, {
      method: 'POST',
    });

    if (response.success) {
      return response;
    }
    
    throw new Error(response.message || 'Erreur lors de la confirmation du paiement');
  }

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

export const confirmTicketPayment = (txRef: string): Promise<TicketConfirmResponse> => 
  ticketAPI.confirmPayment(txRef);

export const validateTicket = (qrCode: string, validatedBy: string, validationLocation: string): Promise<TicketValidationResponse> => 
  ticketAPI.validateTicket(qrCode, validatedBy, validationLocation);

export const getTicketStatistics = (): Promise<TicketsStatistics> => 
  ticketAPI.getTicketStatistics();

export const searchTicketByEmail = (email: string): Promise<Ticket | null> => 
  ticketAPI.searchTicketByEmail(email);

// ==========================================
// ADDITIONAL EXPORTS
// ==========================================

export { ticketAPI };
export default ticketAPI;