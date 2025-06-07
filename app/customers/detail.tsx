// import { useLocalSearchParams } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
// import { customerService } from '../../src/api/CustomerService';

// export default function CustomerDetailScreen() {
//   const { customerId } = useLocalSearchParams<{ customerId: string }>();
//   const [customer, setCustomer] = useState<any | null>(null);

//   useEffect(() => {
//     if (customerId) {
//       console.log('Fetching customer with ID:', customerId);
//       customerService.getCustomerDataWithId(customerId)
//         .then(data => {
//           console.log('Customer data received:', data);
//           setCustomer(data);
//         })
//         .catch(error => {
//           console.error('Error fetching customer:', error);
//         });
//     }
//   }, [customerId]);

//   if (!customer) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007bff" />;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{customer.fullname}</Text>
//       <Text style={styles.label}>Email: {customer.email}</Text>
//       <Text style={styles.label}>Items in Cart: {customer.cart?.items?.length || 0}</Text>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: '#fff' },
//   title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
//   label: { fontSize: 16, marginBottom: 10 },
// }); 
// app/customers/[customerId].tsx
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';
import { customerService } from '../../src/api/CustomerService';

export default function CustomerDetailScreen() {
  const { customerId } = useLocalSearchParams<{ customerId: string }>();
  const [customer, setCustomer] = useState<any | null>(null);
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'info', title: 'Info' },
    { key: 'contact', title: 'Contact' },
    { key: 'orders', title: 'Orders' },
    { key: 'payments', title: 'Payments' },
    { key: 'summary', title: 'Summary' },
  ]);

  useEffect(() => {
    if (customerId) {
      customerService.getCustomerDataWithId(customerId)
        .then(setCustomer)
        .catch(console.error);
    }
  }, [customerId]);

  if (!customer) {
    return <ActivityIndicator style={{ flex: 1 }} size="large" color="#4F46E5" />;
  }

  const InfoRoute = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Account Details</Text>
      <Text style={styles.text}>ID: {customer._id}</Text>
      <Text style={styles.text}>Guarantor ID: {customer.guaranteerId}</Text>
      <Text style={styles.text}>Created: {new Date(customer.createdAt).toDateString()}</Text>
      <Text style={styles.text}>Updated: {new Date(customer.updatedAt).toLocaleString()}</Text>
    </ScrollView>
  );

  const ContactRoute = () => (
    <ScrollView style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Phone Numbers</Text>
      {customer.phoneNumbers?.map((phone: any, i: number) => (
        <View key={i} style={styles.card}>
          <Text>Type: {phone.type}</Text>
          <Text>Number: {phone.number}</Text>
          <Text>Primary: {phone.primary ? 'Yes' : 'No'}</Text>
        </View>
      ))}
      <Text style={styles.sectionTitle}>Addresses</Text>
      {customer.addresses?.map((address: any, i: number) => (
        <View key={i} style={styles.card}>
          <Text>{address.street}, {address.city}, {address.state}, {address.zipCode}, {address.country}</Text>
        </View>
      ))}
    </ScrollView>
  );

  const OrdersRoute = () => (
    <ScrollView style={styles.tabContent}>
      {customer.cart?.items?.length > 0 ? (
        customer.cart.items.map((item: any, i: number) => (
          <View key={i} style={styles.card}>
            <Text>Product ID: {item.productId}</Text>
            <Text>Invoices: {item.invoiceIds?.join(', ')}</Text>
          </View>
        ))
      ) : (
        <Text>No recent orders.</Text>
      )}
    </ScrollView>
  );

  const PaymentsRoute = () => (
    <ScrollView style={styles.tabContent}>
      {customer.paymentHistory?.length > 0 ? (
        customer.paymentHistory.map((payment: any, i: number) => (
          <View key={i} style={styles.card}>
            <Text>Payment ID: {payment}</Text>
            <Text>Details not available</Text>
          </View>
        ))
      ) : (
        <Text>No payment history available.</Text>
      )}
    </ScrollView>
  );

  const SummaryRoute = () => (
    <ScrollView style={styles.tabContent}>
      <Text>Status: {customer.status}</Text>
      <Text>Total Purchases: ${customer.totalPurchasedAmount || 0}</Text>
      <Text>Remaining Balance: ${customer.remainingAmount || 0}</Text>
    </ScrollView>
  );

  const renderScene = SceneMap({
    info: InfoRoute,
    contact: ContactRoute,
    orders: OrdersRoute,
    payments: PaymentsRoute,
    summary: SummaryRoute,
  });

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: customer.profileImg || 'https://placekitten.com/150/150' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>{customer.fullname}</Text>
        <Text style={styles.email}>{customer.email}</Text>
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={props => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: '#4F46E5' }}
            style={{ backgroundColor: '#f3f4f6' }}
            tabStyle={{ backgroundColor: '#f3f4f6' }}
            activeColor="#4F46E5"
            inactiveColor="#111827"
            scrollEnabled
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#4F46E5',
    paddingVertical: 30,
  },
  profileImage: {
    width: 100, height: 100, borderRadius: 50,
    borderWidth: 2, borderColor: '#fff', marginBottom: 10,
  },
  name: {
    fontSize: 22, color: '#fff', fontWeight: 'bold',
  },
  email: {
    fontSize: 14, color: '#E0E7FF',
  },
  tabContent: {
    padding: 16,
    backgroundColor: '#fff',
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18, fontWeight: 'bold', marginBottom: 10,
  },
  text: {
    fontSize: 16, marginBottom: 8,
  },
  card: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
