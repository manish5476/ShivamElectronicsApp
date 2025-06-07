import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { environment } from './config/environment';

console.log('API Base URL:', environment.apiUrl); // Log the base URL

export const apiClient = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Add timeout 
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

    const token = await AsyncStorage.getItem('token');
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
  (error) => {
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return Promise.reject(error);
  }
); 