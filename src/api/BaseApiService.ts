import { AxiosError } from 'axios';
import { apiClient } from './ApiClient';
import { environment } from './config/environment';
import { errorhandlingService } from './ErrorhandlingService';

class BaseApiService {
  protected http = apiClient;
  protected baseUrl: string = environment.apiUrl;

  constructor() {
    // No need to create new axios instance, using the configured apiClient
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

