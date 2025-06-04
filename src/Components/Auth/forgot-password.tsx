// app/forgot-password.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React from 'react';
import { Button, StyleSheet } from 'react-native';

export default function ForgotPasswordScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Forgot Password</ThemedText>
      <ThemedText style={styles.text}>
        Enter your email to receive a password reset link.
      </ThemedText>
      {/* Add TextInput for email and a submit button here */}
      <Button title="Go Back to Login" onPress={() => router.back()} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginBottom: 20,
    textAlign: 'center',
  },
});