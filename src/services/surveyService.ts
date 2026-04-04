import axios from 'axios';

// API base URL - uses environment variable or defaults to production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.whataboutyou.net/api';

// Survey categories type
export type SurveyCategory =
  | 'Exposant'
  | 'Participant étudiant'
  | 'Participant collégien'
  | 'Participant travailleur'
  | 'Participant partenaire';

// Survey submission data interface
export interface SurveySubmissionData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  category: SurveyCategory;
  occupationDetails: string;
  previousParticipation: 'Oui' | 'Non';
  categoryResponses: {
    q1: string;
    q2: string;
    q3: string;
    q4: string;
  };
  plusGrandeForce: string;
  pointAmeliorer: string;
  recommandation: 'Oui' | 'Peut-être' | 'Non';
}

// Survey response interface (what we get back from backend)
export interface SurveyResponse extends SurveySubmissionData {
  id: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
  ipAddress?: string;
  userAgent?: string;
}

// Paginated response interface
export interface PaginatedSurveysResponse {
  success: boolean;
  data: {
    surveys: SurveyResponse[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Statistics response interface
export interface SurveyStatistics {
  success: boolean;
  data: {
    total: number;
    byCategory: Record<string, number>;
    recommendations: {
      oui: number;
      peutEtre: number;
      non: number;
    };
    previousParticipation: {
      oui: number;
      non: number;
    };
  };
}

// Submit survey response
export const submitSurvey = async (data: SurveySubmissionData): Promise<{ success: boolean; message: string; data?: { id: string; submittedAt: string } }> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/surveys`, data);
    return response.data;
  } catch (error: unknown) {
    // Handle specific error messages from backend
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      if (Array.isArray(error.response.data.message)) {
        // Validation errors array
        throw new Error(error.response.data.message.join(', '));
      }
      throw new Error(error.response.data.message);
    }

    // Handle rate limiting
    if (axios.isAxiosError(error) && error.response?.status === 429) {
      throw new Error('Vous avez soumis trop de sondages. Veuillez réessayer plus tard.');
    }

    // Generic error
    throw new Error('Une erreur s\'est produite lors de l\'envoi du sondage. Veuillez réessayer.');
  }
};

// Get all surveys (Admin only - requires authentication)
export const getAllSurveys = async (
  page: number = 1,
  limit: number = 50,
  category?: string,
  search?: string
): Promise<PaginatedSurveysResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sort: 'desc'
    });

    if (category && category !== 'all') {
      params.append('category', category);
    }

    if (search && search.trim()) {
      params.append('search', search.trim());
    }

    const response = await axios.get(`${API_BASE_URL}/surveys?${params.toString()}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching surveys:', error);
    const message = axios.isAxiosError(error) && error.response?.data?.message
      ? error.response.data.message
      : 'Une erreur s\'est produite lors de la récupération des sondages.';
    throw new Error(message);
  }
};

// Get survey statistics (Admin only)
export const getSurveyStatistics = async (): Promise<SurveyStatistics> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/surveys/statistics`);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching survey statistics:', error);
    const message = axios.isAxiosError(error) && error.response?.data?.message
      ? error.response.data.message
      : 'Une erreur s\'est produite lors de la récupération des statistiques.';
    throw new Error(message);
  }
};

// Get single survey by ID (Admin only)
export const getSurveyById = async (id: string): Promise<{ success: boolean; data: SurveyResponse }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/surveys/${id}`);
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching survey:', error);
    const message = axios.isAxiosError(error) && error.response?.data?.message
      ? error.response.data.message
      : 'Une erreur s\'est produite lors de la récupération du sondage.';
    throw new Error(message);
  }
};

// Export surveys to Excel (Admin only)
export const exportSurveysToExcel = async (
  category?: string,
  search?: string,
  sort?: 'asc' | 'desc'
): Promise<Blob> => {
  try {
    const params = new URLSearchParams();

    if (category && category !== 'all') {
      params.append('category', category);
    }

    if (search && search.trim()) {
      params.append('search', search.trim());
    }

    if (sort) {
      params.append('sort', sort);
    }

    const response = await axios.get(
      `${API_BASE_URL}/surveys/export/excel${params.toString() ? `?${params.toString()}` : ''}`,
      {
        responseType: 'blob', // Important for file download
      }
    );

    return response.data;
  } catch (error: unknown) {
    console.error('Error exporting surveys to Excel:', error);
    const message = axios.isAxiosError(error) && error.response?.data?.message
      ? error.response.data.message
      : 'Une erreur s\'est produite lors de l\'export des sondages.';
    throw new Error(message);
  }
};

// Export API base URL for reference
export { API_BASE_URL };
