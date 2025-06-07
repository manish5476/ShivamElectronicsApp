import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { customerService } from '../../src/api/CustomerService';

export default function CreateCustomerScreen() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    mobileNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
  });

  const handleSubmit = async () => {
    // Basic validation
    if (!formData.fullname || !formData.email || !formData.mobileNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const customerData = {
        fullname: formData.fullname,
        email: formData.email,
        mobileNumber: formData.mobileNumber,
        addresses: [{
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          type: 'home',
          primary: true,
        }],
        status: 'active',
        totalPurchasedAmount: 0,
        remainingAmount: 0,
      };

      const response = await customerService.createNewCustomer(customerData);
      if (response) {
        Alert.alert('Success', 'Customer created successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      console.error('Error creating customer:', error);
      Alert.alert('Error', 'Failed to create customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Create New Customer</Text>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Full Name *"
              value={formData.fullname}
              onChangeText={(text) => setFormData({ ...formData, fullname: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email *"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Mobile Number *"
              keyboardType="phone-pad"
              value={formData.mobileNumber}
              onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
            />
          </View>

          {/* Address Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Address Information</Text>
            <TextInput
              style={styles.input}
              placeholder="Street Address"
              value={formData.street}
              onChangeText={(text) => setFormData({ ...formData, street: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={formData.city}
              onChangeText={(text) => setFormData({ ...formData, city: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="State"
              value={formData.state}
              onChangeText={(text) => setFormData({ ...formData, state: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="ZIP Code"
              keyboardType="numeric"
              value={formData.zipCode}
              onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Create Customer</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#4F46E5',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#A5B4FC',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
}); 