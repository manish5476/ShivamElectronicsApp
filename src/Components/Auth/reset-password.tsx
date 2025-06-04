// app/reset-password.tsx
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function ResetPasswordScreen() { // <--- THIS LINE IS CRUCIAL
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Reset Your Password</ThemedText>
      {/* Add your actual password reset form here */}
      <ThemedText>Input fields for new password and confirm password</ThemedText>
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
});