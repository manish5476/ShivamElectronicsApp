// // src/api/BaseApiService.ts
// import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
// import { authService } from './AuthService'; // Will be imported for token retrieval
// import { environment } from './config/environment';
// import { errorhandlingService } from './ErrorhandlingService';

// class BaseApiService {
//   protected http: AxiosInstance;
//   protected baseUrl: string = environment.apiUrl;

//   constructor() {
//     this.http = axios.create({
//       baseURL: this.baseUrl,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       timeout: 10000, // 10 seconds timeout
//     });

//     // Request Interceptor: Attach token to outgoing requests
//     this.http.interceptors.request.use(
//       async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
//         const token = await authService.getToken(); // Retrieve token from AuthService
//         if (token) {
//           if (!config.headers) {
//             config.headers = {};
//           }
//           config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//       },
//       (error: AxiosError): Promise<AxiosError> => {
//         return Promise.reject(error);
//       }
//     );

//     // Response Interceptor: Handle global errors (e.g., 401 Unauthorized)
//     this.http.interceptors.response.use(
//       (response: AxiosResponse): AxiosResponse => response,
//       async (error: AxiosError): Promise<AxiosError> => {
//         if (error.response && error.response.status === 401) {
//           console.warn('Unauthorized request detected. Attempting re-authentication or logout.');
//           // You might have a refresh token logic here.
//           // For now, let's just log out the user.
//           await authService.logout(); // Trigger logout logic
//           // Optionally, throw a specific error that components can catch to handle UI
//           return Promise.reject(new Error('Unauthorized: Session expired. Please log in again.'));
//         }
//         return Promise.reject(error); // Re-throw the error for specific service handling
//       }
//     );
//   }

//   /**
//    * Creates URL query parameters from a filter object.
//    * @param {any} filterParams Object containing key-value pairs for filters.
//    * @returns {string} A URL-encoded query string (e.g., "key1=value1&key2=value2").
//    */
//   protected createHttpParams(filterParams?: any): string {
//     if (!filterParams) {
//       return '';
//     }
//     const params = new URLSearchParams();
//     Object.entries(filterParams).forEach(([key, value]) => {
//       if (value !== undefined && value !== null && value !== '') {
//         params.append(key, String(value));
//       }
//     });
//     return params.toString();
//   }

//   /**
//    * Delegates error handling to the centralized ErrorhandlingService.
//    * @param {string} operation Name of the API operation.
//    * @param {AxiosError} error The Axios error object.
//    * @returns {Promise<never>} A rejected promise.
//    */
//   protected handleError(operation: string, error: AxiosError): Promise<never> {
//     return errorhandlingService.handleError(operation, error);
//   }
// }

// export { BaseApiService };
// src/api/BaseApiService.ts
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
// Note: Changed AxiosRequestConfig to InternalAxiosRequestConfig in the import above

import { authService } from './AuthService';
import { environment } from './config/environment';
import { errorhandlingService } from './ErrorhandlingService';

class BaseApiService {
  protected http: AxiosInstance;
  protected baseUrl: string = environment.apiUrl;

  constructor() {
    this.http = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000, // 10 seconds timeout
    });

    // Request Interceptor: Attach token to outgoing requests
    this.http.interceptors.request.use(
      // === FIX IS HERE ===
      // Change config: AxiosRequestConfig to config: InternalAxiosRequestConfig
      async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        const token = await authService.getToken(); // Retrieve token from AuthService
        if (token) {
          // In newer Axios versions, config.headers is guaranteed to be an object
          // so the 'if (!config.headers)' check is often no longer strictly needed
          // and might even cause type issues if you try to assign {} to it.
          // Directly assign to config.headers.Authorization.
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
      }
    );

    // Response Interceptor: Handle global errors (e.g., 401 Unauthorized)
    this.http.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => response,
      async (error: AxiosError): Promise<AxiosError> => {
        if (error.response && error.response.status === 401) {
          console.warn('Unauthorized request detected. Attempting re-authentication or logout.');
          await authService.logout(); // Trigger logout logic
          return Promise.reject(new Error('Unauthorized: Session expired. Please log in again.'));
        }
        return Promise.reject(error); // Re-throw the error for specific service handling
      }
    );
  }

  /**
   * Creates URL query parameters from a filter object.
   * @param {any} filterParams Object containing key-value pairs for filters.
   * @returns {string} A URL-encoded query string (e.g., "key1=value1&key2=value2").
   */
  protected createHttpParams(filterParams?: any): string {
    if (!filterParams) {
      return '';
    }
    const params = new URLSearchParams();
    Object.entries(filterParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.append(key, String(value));
      }
    });
    return params.toString();
  }

  /**
   * Delegates error handling to the centralized ErrorhandlingService.
   * @param {string} operation Name of the API operation.
   * @param {AxiosError} error The Axios error object.
   * @returns {Promise<never>} A rejected promise.
   */
  protected handleError(operation: string, error: AxiosError): Promise<never> {
    return errorhandlingService.handleError(operation, error);
  }
}

export { BaseApiService };
