// ==========================================
// INTERFACES AND TYPES
// ==========================================

export interface ConferenceRegistration {
  id?: string;
  registrationNumber?: string;
  situation: string;
  nom: string;
  prenom: string;
  age: string;
  sexe: string;
  numeroTelephone: string;
  email: string;
  quartier: string;
  statut: string;
  organisation?: string;
  aDejaParticipe: string;
  nationalite: string;
  createdAt?: any;
  updatedAt?: any;
  emailSent?: boolean;
  emailSentAt?: any;
}

export interface RegistrationResponse {
  success: boolean;
  registrationNumber: string;
  message: string;
  data?: ConferenceRegistration;
}

export interface RegistrationListResponse {
  success: boolean;
  data: ConferenceRegistration[];
  count: number;
  error?: string;
}

export interface RegistrationStatistics {
  total: number;
  byStatus: {
    rouge: number;
    bleu: number;
    jaune: number;
  };
  byExperience: {
    oui: number;
    non: number;
  };
  emailStats: {
    sent: number;
    pending: number;
  };
  averageAge: number;
  todayRegistrations: number;
}

export interface RegistrationStatisticsResponse {
  success: boolean;
  data: RegistrationStatistics;
  error?: string;
}

// ==========================================
// CONFIGURATION
// ==========================================

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://whataboutyou.net' // Your actual Render backend URL
  : 'http://localhost:3001';

// ==========================================
// API SERVICE CLASS
// ==========================================

class RegistrationAPI {
  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
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

  async saveRegistration(registrationData: ConferenceRegistration): Promise<string> {
    const response = await this.makeRequest<RegistrationResponse>('/api/registrations', {
      method: 'POST',
      body: JSON.stringify(registrationData),
    });

    if (response.success) {
      return response.registrationNumber;
    }
    
    throw new Error(response.message || 'Erreur lors de l\'enregistrement');
  }

  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await this.makeRequest<{ success: boolean; data: ConferenceRegistration; found: boolean; error?: string }>(
        `/api/registrations/search/email?email=${encodeURIComponent(email)}`
      );
      return response.success && response.found;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return false;
      }
      throw error;
    }
  }

  async getAllRegistrations(): Promise<ConferenceRegistration[]> {
    const response = await this.makeRequest<RegistrationListResponse>('/api/registrations');
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error || 'Erreur lors de la récupération des inscriptions');
    }
  }

  async getRegistrationStatistics(): Promise<RegistrationStatistics> {
    const response = await this.makeRequest<RegistrationStatisticsResponse>('/api/registrations/statistics');
    
    if (response.success) {
      return response.data;
    } else {
      throw new Error(response.error || 'Erreur lors de la récupération des statistiques');
    }
  }

  async getRegistrationByNumber(registrationNumber: string): Promise<ConferenceRegistration | null> {
    try {
      const response = await this.makeRequest<{ success: boolean; data: ConferenceRegistration; found: boolean; error?: string }>(
        `/api/registrations/search/number?number=${encodeURIComponent(registrationNumber)}`
      );
      return response.success && response.found ? response.data : null;
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }

  async resendConfirmationEmail(registrationId: string): Promise<void> {
    const response = await this.makeRequest<{ success: boolean; data?: any; error?: string }>(
      `/api/registrations/${registrationId}/resend-email`, 
      {
        method: 'POST',
      }
    );
    
    if (!response.success) {
      throw new Error(response.error || 'Erreur lors du renvoi de l\'email de confirmation');
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

const registrationAPI = new RegistrationAPI();

// ==========================================
// EXPORTED FUNCTIONS (Backward Compatibility)
// ==========================================

export const saveRegistration = (data: ConferenceRegistration): Promise<string> => 
  registrationAPI.saveRegistration(data);

export const checkEmailExists = (email: string): Promise<boolean> => 
  registrationAPI.checkEmailExists(email);

export const getAllRegistrations = (): Promise<ConferenceRegistration[]> => 
  registrationAPI.getAllRegistrations();

export const getRegistrationById = (id: string): Promise<ConferenceRegistration | null> => 
  registrationAPI.getRegistrationByNumber(id);

export const getRegistrationStatistics = (): Promise<RegistrationStatistics> => 
  registrationAPI.getRegistrationStatistics();

export const resendConfirmationEmail = (id: string): Promise<void> => 
  registrationAPI.resendConfirmationEmail(id);

// ==========================================
// ADDITIONAL EXPORTS
// ==========================================

export { registrationAPI };
export default registrationAPI; 