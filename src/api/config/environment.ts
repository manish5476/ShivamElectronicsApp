// src/api/config/environment.ts
import Constants from 'expo-constants';
// import { API_URL } from '@env'; // Import from react-native-dotenv
// API_URL=https://shivamelectronicsbackend.onrender.com/api

interface Environment {
  production: boolean;
  apiUrl: string;
}

export const environment: Environment = {
  // production: Constants.manifest?.extra?.production || false, // Use if you configure production via app.json extra
  production: false, // For simplicity, hardcoding as per your example
  apiUrl: 'https://shivamelectronicsbackend.onrender.com/api', // Fallback if @env fails
};