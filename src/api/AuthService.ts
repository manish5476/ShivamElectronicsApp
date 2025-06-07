// src/api/AuthService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { router } from 'expo-router';
import { appMessageService } from './AppMessageService';
import { environment } from './config/environment';

export interface LoginResponse {
  token: string;
  refresh_token?: string;
  data: {
    user: any; // Define a more specific user interface if possible
  };
}

class AuthService {
  private tokenKey = 'authToken';
  private userKey = 'user';
  private baseUrl = environment.apiUrl;

  // IMPORTANT: Use a separate Axios instance for Auth-related API calls (login, signup)
  // This prevents circular dependency with BaseApiService's interceptors.
  private authHttp: AxiosInstance;

  constructor() {
    this.authHttp = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });
  }

  // --- AsyncStorage Wrapper Methods ---
  public async setItem(key: string, value: any): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`AuthService - Error saving item to AsyncStorage for key: ${key}`, error);
    }
  }

  public async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : null;
    } catch (error) {
      console.error(`AuthService - Error parsing item from AsyncStorage for key: ${key}`, error);
      await this.removeItem(key); // Clear potentially corrupted data
      return null;
    }
  }

  public async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`AuthService - Error removing item from AsyncStorage for key: ${key}`, error);
    }
  }
  // --- End AsyncStorage Wrapper Methods ---

  public async getToken(): Promise<string | null> {
    const stored = await this.getItem<string>(this.tokenKey);
    return stored;
  }

  public async getUser(): Promise<any | null> {
    const stored = await this.getItem<any>(this.userKey);
    return stored;
  }

  private async handleAuthTokens(response: LoginResponse): Promise<void> {
    await this.setItem(this.tokenKey, response.token);
    await this.setItem(this.userKey, response.data.user);
    console.log('AuthService: Tokens and user data stored.');
  }

  public async login(data: any): Promise<LoginResponse | null> {
    try {
      const response: AxiosResponse<LoginResponse> = await this.authHttp.post<LoginResponse>(`${this.baseUrl}/v1/users/login`, data);
      await this.handleAuthTokens(response.data);
      appMessageService.handleResponse(response, 'Login Successful', 'You have been successfully logged in.');
      router.replace('/customers/index');

      return response.data;
    } catch (error: any) {
      appMessageService.handleResponse(error, 'Login Failed', 'Invalid credentials or server error.');
      console.error('AuthService - Login error:', error);
      return null;
    }
  }

  public async resetPassword(data: { password: string; passwordConfirm: string }): Promise<LoginResponse | null> {
    try {
       const token = await this.getItem<string>(this.tokenKey); // Assuming the token for reset is in storage.
      if (!token) {
        appMessageService.showError('Reset Password Failed', 'No valid token found for password reset.');
        return null;
      }
      const response: AxiosResponse<LoginResponse> = await this.authHttp.patch<LoginResponse>(`${this.baseUrl}/v1/users/resetPassword/${token}`, data);
      await this.handleAuthTokens(response.data); // Log the user in after password reset (if it returns a new token)
      appMessageService.showSuccess('Password Reset', 'Your password has been successfully reset.');
router.replace('/customers' as const);
      return response.data;
    } catch (error: any) {
      appMessageService.handleResponse(error, 'Reset Failed', 'Invalid token or server error.');
      console.error('AuthService - Reset password error:', error);
      return null;
    }
  }

  public async forgotPassword(email: string): Promise<any> {
    try {
      const response: AxiosResponse<any> = await this.authHttp.post(`${this.baseUrl}/v1/users/forgotPassword`, { email });
      appMessageService.showSuccess('Forgot Password', 'Password reset email sent. Please check your inbox.');
      return response.data;
    } catch (error: any) {
      appMessageService.handleResponse(error, 'Forgot Password Failed', 'Failed to send password reset email.');
      console.error('AuthService - Forgot password error:', error);
      throw error;
    }
  }

  public async updatePassword(data: { currentPassword: string; password: string; passwordConfirm: string }): Promise<LoginResponse | null> {
    try {
      const response: AxiosResponse<LoginResponse> = await this.authHttp.patch<LoginResponse>(`${this.baseUrl}/v1/users/updatePassword`, data);
      await this.handleAuthTokens(response.data);
      appMessageService.showSuccess('Password Updated', 'Your password has been successfully updated.');
      return response.data;
    } catch (error: any) {
      appMessageService.handleResponse(error, 'Update Failed', 'Could not update password.');
      console.error('AuthService - Update password error:', error);
      return null;
    }
  }

  public async signUp(data: any): Promise<LoginResponse | null> {
    try {
      const response: AxiosResponse<LoginResponse> = await this.authHttp.post<LoginResponse>(`${this.baseUrl}/v1/users/signup`, data);
      await this.handleAuthTokens(response.data);
      appMessageService.showSuccess('Sign Up Successful', 'Your account has been created.');
router.replace('/customers' as const);
      return response.data;
    } catch (error: any) {
      appMessageService.handleResponse(error, 'Sign Up Failed', 'Failed to create account.');
      console.error('AuthService - Signup error:', error);
      return null;
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    if (!token) {
      return false;
    }
    return !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) {
        console.error('AuthService - Token payload missing.');
        return true;
      }
      const payload = JSON.parse(atob(payloadBase64));
      if (typeof payload.exp !== 'number') {
        console.error('AuthService - Token expiration time (exp) is missing or invalid.');
        return true;
      }
      const isExpired = payload.exp * 1000 < Date.now();
      return isExpired;
    } catch (error) {
      console.error('AuthService - Error decoding or checking token expiration:', error);
      return true;
    }
  }

  public async logout(): Promise<void> {
    await this.removeItem(this.tokenKey);
    await this.removeItem(this.userKey);
    console.log('AuthService: User logged out.');
    router.replace('/auth/login');
  }
}

export const authService = new AuthService();