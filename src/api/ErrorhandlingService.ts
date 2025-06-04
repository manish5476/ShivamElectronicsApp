// // src/api/ErrorhandlingService.ts
// import { AxiosError } from 'axios';
// import { Alert } from 'react-native'; // Or your preferred toast/message library

// class ErrorhandlingService {
//   /**
//    * Handles API errors centrally.
//    * @param {string} operation The name of the operation that failed.
//    * @param {AxiosError} error The error object from axios.
//    * @returns {Promise<never>} A rejected promise with a more informative error.
//    */
//   public handleError(operation: string = 'operation', error: AxiosError): Promise<never> {
//     console.error(`Error in ${operation}:`, error);

//     let errorMessage = 'An unexpected error occurred.';
//     let displayMessage = 'Something went wrong. Please try again.';

//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       const status = error.response.status;
//       const data = error.response.data;

//       errorMessage = `Server Error (${status})`;

//       if (typeof data === 'string') {
//         displayMessage = data;
//       } else if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
//         displayMessage = data.message;
//       } else {
//         displayMessage = `Server responded with status ${status}.`;
//       }

//       if (status === 401) {
//         // Specific handling for Unauthorized errors, e.g., auto-logout
//         displayMessage = 'Session expired or invalid. Please log in again.';
//         // Potentially trigger a global logout event here
//       } else if (status >= 500) {
//         displayMessage = 'Server is currently unavailable. Please try again later.';
//       }
//     } else if (error.request) {
//       // The request was made but no response was received
//       errorMessage = 'Network Error: No response received.';
//       displayMessage = 'Could not connect to the server. Please check your internet connection.';
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       errorMessage = `Request Error: ${error.message}`;
//       displayMessage = `An error occurred: ${error.message}`;
//     }

//     Alert.alert('Error', displayMessage, [{ text: 'OK' }]);

//     // Re-throw the error as a rejected promise to be caught by the caller
//     return Promise.reject(new Error(errorMessage));
//   }
// }

// export const errorhandlingService = new ErrorhandlingService();
// src/api/ErrorhandlingService.ts
import { AxiosError } from 'axios';
import { Alert } from 'react-native'; // Or your preferred toast/message library

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
      const data = error.response.data;

      errorMessage = `Server Error (${status})`;

      if (typeof data === 'string') {
        displayMessage = data;
      } else if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
        displayMessage = data.message;
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