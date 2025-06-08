import { AxiosError } from 'axios';
import { Alert } from 'react-native'; // Or your preferred toast/message library

interface BackendErrorResponse {
  message?: string;
  errors?: {
    errors?: Array<{ message?: string; msg?: string }>; // For Mongoose-like validation errors
    [key: string]: any; // To allow other properties on the 'errors' object if they exist
  };
  status?: string;
  statusCode?: number;
}

interface BackendValidationErrors {
  [key: string]: string | string[] | Array<{ message?: string; msg?: string }>;
}

class ErrorhandlingService {
  /**
   * Handles API errors centrally.
   * @param {string} operation The name of the operation that failed.
   * @param {AxiosError} error The error object from axios.
   * @returns {Promise<never>} A rejected promise with a more informative error.
   */
  public handleError(operation: string = 'operation', error: AxiosError): Promise<never> {
    console.error(`Error in ${operation}:`, error);

    let errorMessage = 'An unexpected error occurred.';
    let displayMessage = 'Something went wrong. Please try again.';

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const data = error.response.data as BackendErrorResponse; // Cast to the new interface

      errorMessage = `Server Error (${status})`;

      if (typeof data === 'string') {
        displayMessage = data;
      } else if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
        displayMessage = data.message;
      } else if (data && data.errors) {
        // Handle nested validation errors from the backend
        const validationErrors = data.errors;
        if (validationErrors.errors && Array.isArray(validationErrors.errors)) {
          // If the backend returns an array of errors (e.g., Mongoose validation errors)
          displayMessage = validationErrors.errors.map((err: any) => err.message || err.msg || 'Validation error').join('\n');
        } else {
          // Fallback for other error object structures
          displayMessage = Object.values(validationErrors).map((value: any) => {
            if (Array.isArray(value)) {
              return value.join(', ');
            }
            return String(value);
          }).join('\n');
        }
        if (!displayMessage) { // If no specific error message was found, use a generic one
            displayMessage = `Server responded with status ${status}. Invalid input data.`;
        }
      } else {
        displayMessage = `Server responded with status ${status}.`;
      }

      if (status === 401) {
        // Specific handling for Unauthorized errors, e.g., auto-logout
        displayMessage = 'Session expired or invalid. Please log in again.';
        // Potentially trigger a global logout event here
      } else if (status >= 500) {
        displayMessage = 'Server is currently unavailable. Please try again later.';
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'Network Error: No response received.';
      displayMessage = 'Could not connect to the server. Please check your internet connection.';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMessage = `Request Error: ${error.message}`;
      displayMessage = `An error occurred: ${error.message}`;
    }

    Alert.alert('Error', displayMessage, [{ text: 'OK' }]);

    // Re-throw the error as a rejected promise to be caught by the caller
    return Promise.reject(new Error(errorMessage));
  }
}

export const errorhandlingService = new ErrorhandlingService();