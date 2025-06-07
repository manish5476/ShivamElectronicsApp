import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { authService } from '../../src/api/AuthService';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const scaleAnim = new Animated.Value(1);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login({ email, password });

      if (response) {
        // Navigate to the main app screen
        router.replace('/customers');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        error instanceof Error ? error.message : 'An error occurred during login. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/customers/auth/forgot-password');
  };

  const handleSignUp = () => {
    router.push('/customers/auth/signup');
  };

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => handleLogin());
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Log in to your account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          editable={!loading}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          editable={!loading}
        />

        <Animated.View style={{ transform: [{ scale: scaleAnim }], width: '100%' }}>
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={animatePress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Log In</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>New here? </Text>
          <TouchableOpacity onPress={handleSignUp}>
            <Text style={styles.signUpLink}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
  },
  input: {
    height: 50,
    backgroundColor: '#f1f3f6',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  button: {
    backgroundColor: '#007bff',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: '#a0c9ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  forgot: {
    color: '#007bff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  signUpText: {
    fontSize: 14,
    color: '#444',
  },
  signUpLink: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007bff',
  },
});

// app/login.tsx
// import React, { useState } from 'react';
// import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';
// import { authService } from '../../api/AuthService';

// export default function LoginScreen() {
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(false);

//   const handleLogin = async () => {
//     if (!email || !password) {
//       // You might want to use appMessageService.showError here for user feedback
//       console.warn('Please enter both email and password.');
//       return;
//     }

//     setLoading(true);
//     try {
//       const loginData = { email, password };
//       const response = await authService.login(loginData);

//       if (response) {
//         // Login successful - navigation is handled by _layout.tsx
//       }
//     } catch (error) {
//       console.error('Login component caught error:', error);
//       // Error handling is mostly done in authService, but you can add specific UI feedback here if needed
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ThemedView style={styles.contentContainer}>
//         <ThemedText type="title" style={styles.title}>Welcome Back!</ThemedText>
//         <ThemedText type="subtitle" style={styles.subtitle}>Sign in to continue</ThemedText>
//         <TextInput
//           style={styles.input}
//           placeholder="Email"
//           placeholderTextColor="#999"
//           keyboardType="email-address"
//           autoCapitalize="none"
//           value={email}
//           onChangeText={setEmail}
//           editable={!loading}
//         />
//         <TextInput
//           style={styles.input}
//           placeholder="Password"
//           placeholderTextColor="#999"
//           secureTextEntry
//           value={password}
//           onChangeText={setPassword}
//           editable={!loading}
//         />

//         <TouchableOpacity
//           style={[styles.button, loading && styles.buttonDisabled]}
//           onPress={handleLogin}
//           disabled={loading}
//         >
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <ThemedText style={styles.buttonText}>Log In</ThemedText>
//           )}
//         </TouchableOpacity>

//         {/* <TouchableOpacity onPress={() => router.push('/forgot-password')} style={styles.link}>
//           <ThemedText type="link">Forgot Password?</ThemedText>
//         </TouchableOpacity> */}

//         <ThemedView style={styles.signUpContainer}>
//           <ThemedText>Don't have an account? </ThemedText>
//           {/* <TouchableOpacity onPress={() => router.push('/signup')}>
//             <ThemedText type="link">Sign Up</ThemedText>
//           </TouchableOpacity> */}
//         </ThemedView>
//       </ThemedView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0', // A light background for the login page
//   },
//   contentContainer: {
//     width: '85%',
//     maxWidth: 400,
//     padding: 25,
//     borderRadius: 15,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 8,
//   },
//   title: {
//     fontSize: 32,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333', // Darker text for contrast
//   },
//   subtitle: {
//     fontSize: 18,
//     color: '#666',
//     marginBottom: 30,
//   },
//   input: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     paddingHorizontal: 15,
//     marginBottom: 15,
//     fontSize: 16,
//     color: '#333',
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   button: {
//     width: '100%',
//     height: 50,
//     backgroundColor: '#007bff', // A vibrant blue for the button
//     borderRadius: 10,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 10,
//     marginBottom: 15,
//   },
//   buttonDisabled: {
//     backgroundColor: '#a0c9ff', // Lighter blue when disabled
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   link: {
//     marginTop: 5,
//     marginBottom: 20,
//   },
//   signUpContainer: {
//     flexDirection: 'row',
//     marginTop: 20,
//     alignItems: 'center',
//   },
// });