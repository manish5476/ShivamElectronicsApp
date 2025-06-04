// app/login.tsx
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { authService } from '../../api/AuthService';

export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email || !password) {
      // You might want to use appMessageService.showError here for user feedback
      console.warn('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const loginData = { email, password };
      const response = await authService.login(loginData);

      if (response) {
        // Login successful - navigation is handled by _layout.tsx
      }
    } catch (error) {
      console.error('Login component caught error:', error);
      // Error handling is mostly done in authService, but you can add specific UI feedback here if needed
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ThemedView style={styles.contentContainer}>
        <ThemedText type="title" style={styles.title}>Welcome Back!</ThemedText>
        <ThemedText type="subtitle" style={styles.subtitle}>Sign in to continue</ThemedText>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <ThemedText style={styles.buttonText}>Log In</ThemedText>
          )}
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={() => router.push('/forgot-password')} style={styles.link}>
          <ThemedText type="link">Forgot Password?</ThemedText>
        </TouchableOpacity> */}

        <ThemedView style={styles.signUpContainer}>
          <ThemedText>Don't have an account? </ThemedText>
          {/* <TouchableOpacity onPress={() => router.push('/signup')}>
            <ThemedText type="link">Sign Up</ThemedText>
          </TouchableOpacity> */}
        </ThemedView>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // A light background for the login page
  },
  contentContainer: {
    width: '85%',
    maxWidth: 400,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333', // Darker text for contrast
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#007bff', // A vibrant blue for the button
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#a0c9ff', // Lighter blue when disabled
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 5,
    marginBottom: 20,
  },
  signUpContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
});