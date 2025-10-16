import { API_BASE_URL } from '../constants/Config';
import authService from './authService';

interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

class ApiService {
  private static instance: ApiService;

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, 'GET');
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, 'POST', data);
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, 'PUT', data);
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, 'DELETE');
  }

  async updateProfile(fullName: string, role: string): Promise<ApiResponse<any>> {
    return this.post('/api/update-profile', { fullName, role });
  }

  private async makeRequest<T>(
    endpoint: string,
    method: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const headers = await authService.getAuthenticatedHeaders();
      
      const config: RequestInit = {
        method,
        headers,
      };

      if (data) {
        if (data instanceof FormData) {
          // Let the browser set the Content-Type header for FormData
          delete headers['Content-Type'];
          config.body = data;
        } else {
          config.body = JSON.stringify(data);
        }
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

      // Handle 401 errors with automatic retry
      if (response.status === 401) {
        try {
          const newToken = await authService.refreshAccessToken();
          const newHeaders = {
            ...headers,
            'Authorization': `Bearer ${newToken}`,
          };

          const retryConfig: RequestInit = {
            ...config,
            headers: newHeaders,
          };

          // Re-run the request with the new token
          const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, retryConfig);

          return await this.handleResponse<T>(retryResponse);
        } catch (refreshError) {
          // Token refresh failed, redirect to login
          throw new Error('SESSION_EXPIRED');
        }
      }

      return await this.handleResponse<T>(response);
    } catch (error: any) {
      if (error.message === 'SESSION_EXPIRED') {
        throw error;
      }
      throw new Error(`Request failed: ${error.message}`);
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return {
        data,
        status: response.status,
        message: data.message,
      };
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return {
      data: null as T,
      status: response.status,
    };
  }
}

export const getNotifications = async (userId: string): Promise<any[]> => {
  try {
    const response = await ApiService.getInstance().get<any[]>(`/api/notifications/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const getUnreadNotificationsCount = async (userId: string): Promise<number> => {
  try {
    const response = await ApiService.getInstance().get<{ count: number }>(`/api/notifications/unread-count/${userId}`);
    return response.data.count;
  } catch (error) {
    console.error('Error fetching unread notifications count:', error);
    return 0;
  }
};

export default ApiService.getInstance();
