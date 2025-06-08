import axios from 'axios';
import { authService } from './AuthService';
import { environment } from './config/environment';

console.log('API Base URL:', environment.apiUrl); // Log the base URL

export const apiClient = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased timeout to 30 seconds
});

// Add request interceptor for auth token and logging
apiClient.interceptors.request.use(async (config) => {
  try {
    console.log('Making API Request:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      headers: config.headers
    });

    const token = await authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error in request interceptor:', error);
    return config;
  }
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  async (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      console.warn('Unauthorized request detected. Attempting re-authentication or logout.');
      await authService.logout();
      return Promise.reject(new Error('Unauthorized: Session expired. Please log in again.'));
    }

    // Handle timeout
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server took too long to respond');
      return Promise.reject(new Error('Request timeout - please try again'));
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network Error - No response received:', {
        message: error.message,
        code: error.code
      });
      return Promise.reject(new Error('Network error - please check your connection'));
    }

    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code
    });
    return Promise.reject(error);
  }
); 