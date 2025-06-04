// app/signup.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { router } from 'expo-router';
import React from 'react';
import { Button, StyleSheet } from 'react-native';

export default function SignUpScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Sign Up</ThemedText>
      <ThemedText style={styles.text}>
        Create your new account.
      </ThemedText>
      {/* Add TextInputs for name, email, password, confirm password and a submit button here */}
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