// src/api/AppMessageService.ts
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Alert } from 'react-native';

class AppMessageService {
  public showSuccess(title: string, message: string): void {
    console.log(`SUCCESS - ${title}: ${message}`);
    Alert.alert(title, message, [{ text: 'OK' }]);
  }

  public showError(title: string, message: string): void {
    console.error(`ERROR - ${title}: ${message}`);
    Alert.alert(title, message, [{ text: 'OK' }]);
  }

  /**
   * Handles an Axios response or error, displaying appropriate messages.
   * @param {AxiosResponse | AxiosError} responseOrError The Axios response object or error object.
   * @param {string} successTitle Title for success message.
   * @param {string} successMessage Message for success.
   * @param {string} errorTitle Optional: Title for error message (defaults to 'Error').
   * @param {string} defaultErrorMessage Optional: Default message for error (defaults to 'Something went wrong.').
   */
  public handleResponse(
    responseOrError: AxiosResponse | AxiosError,
    successTitle: string,
    successMessage: string,
    errorTitle: string = 'Error',
    defaultErrorMessage: string = 'Something went wrong. Please try again.'
  ): void {
    if (axios.isAxiosError(responseOrError)) {
      // It's an error
      let displayMessage = defaultErrorMessage;
      if (responseOrError.response && responseOrError.response.data) {
        const data = responseOrError.response.data;
        if (typeof data === 'string') {
          displayMessage = data;
        } else if (typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
          displayMessage = data.message;
        }
      }
      this.showError(errorTitle, displayMessage);
    } else if (responseOrError && responseOrError.status >= 200 && responseOrError.status < 300) {
      // It's a successful response
      this.showSuccess(successTitle, successMessage);
    } else {
      // Fallback for unexpected cases (e.g., non-Axios error passed)
      this.showError(errorTitle, defaultErrorMessage);
    }
  }
}

export const appMessageService = new AppMessageService();