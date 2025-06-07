// screens/CustomerDetailScreen.tsx

import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
// import { Customer, CustomerService } from '../api/CustomerService';
import { customerService } from '@/src/api/CustomerService';
export default function CustomerDetailScreen() {
  const { customerId } = useLocalSearchParams<{ customerId: string }>();
  const [customer, setCustomer] = useState<any | null>(null);

  useEffect(() => {
    if (customerId) {
      customerService.getCustomerDataWithId(customerId).then(setCustomer);
    }
  }, [customerId]);

  if (!customer) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007bff" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{customer.fullname}</Text>
      <Text style={styles.label}>Email: {customer.email}</Text>
      <Text style={styles.label}>Items in Cart: {customer.cart.items.length}</Text>
      {/* Add more info as needed */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  label: { fontSize: 16, marginBottom: 10 },
});
