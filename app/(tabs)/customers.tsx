// app/(tabs)/customers.tsx
import { Picker } from '@react-native-picker/picker'; // Install this if you haven't: npx expo install @react-native-picker/picker
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
// Import specific types from CustomerService for clarity
import { appMessageService } from '@/src/api/AppMessageService';
import { CustomerData, CustomerDropdownItem, customerService } from '@/src/api/CustomerService';

export default function CustomerDashboardScreen() {
  const [customersDropdown, setCustomersDropdown] = useState<CustomerDropdownItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loadingDropdown, setLoadingDropdown] = useState<boolean>(true);
  const [loadingCustomerData, setLoadingCustomerData] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false); // For RefreshControl
  const [error, setError] = useState<string | null>(null);

  const fetchDropdownAndInitialCustomer = async () => {
    setLoadingDropdown(true);
    setError(null); // Assuming you have an setError state defined
    try {
      const dropdownItems: CustomerDropdownItem[] = await customerService.getCustomerDropDown();
      if (dropdownItems && dropdownItems.length > 0) {
        setCustomersDropdown(dropdownItems);
        // Automatically select the first customer if no ID is already selected
        if (!selectedCustomerId) {
          setSelectedCustomerId(dropdownItems[0]._id);
        }
      } else {
        appMessageService.showError('No Customers', 'No customers found for the dropdown.');
        setCustomersDropdown([]);
        setSelectedCustomerId(null);
      }
    } catch (err: any) {
      appMessageService.showError('Fetch Error', err.message || 'Failed to load customer list.');
      setError(err.message || 'Failed to load customer list.');
    } finally {
      setLoadingDropdown(false);
      setRefreshing(false); // End refresh
    }
  };

  // Fetch dropdown data on component mount and on refresh
  useEffect(() => {
    fetchDropdownAndInitialCustomer();
  }, []);

  // Fetch detailed customer data when selectedCustomerId changes
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!selectedCustomerId) {
        setCustomerData(null); // Clear data if no customer is selected
        return;
      }

      setLoadingCustomerData(true);
      setError(null);
      try {
        // Corrected: customerService.getCustomerDataWithId now directly returns CustomerData or null
        const data: CustomerData | null = await customerService.getCustomerDataWithId(selectedCustomerId);

        if (data) { // Check if data itself exists
          setCustomerData(data);
        } else {
          setError('No customer details found for this ID.');
          setCustomerData(null);
        }
      } catch (err: any) {
        setError('Failed to fetch customer details.');
        setCustomerData(null);
      } finally {
        setLoadingCustomerData(false);
      }
    };
    fetchCustomerDetails();
  }, [selectedCustomerId]); // Re-run this effect whenever selectedCustomerId changes

  const onRefresh = () => {
    setRefreshing(true);
    fetchDropdownAndInitialCustomer(); // Re-fetch dropdown and customer data
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ThemedText type="title" style={styles.headerTitle}>Customer Dashboard</ThemedText>

        {/* Customer Dropdown */}
        {loadingDropdown ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.pickerLoading} />
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedCustomerId}
              onValueChange={(itemValue: string | null) => setSelectedCustomerId(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              {customersDropdown.length === 0 ? (
                <Picker.Item label="No customers available" value="" />
              ) : (
                customersDropdown.map((customer) => (
                  <Picker.Item key={customer._id} label={customer.fullname} value={customer._id} />
                ))
              )}
            </Picker>
          </View>
        )}

        {/* {error && <ThemedText style={styles.errorText}>{error}</ThemedText>} */}

        {/* Customer Details Display */}
        {loadingCustomerData ? (
          <ThemedView style={styles.centeredContent}>
            <ActivityIndicator size="large" color="#0000ff" />
            <ThemedText>Loading customer details...</ThemedText>
          </ThemedView>
        ) : customerData ? (
          <>
            {/* Customer Basic Info Card */}
            <ThemedView style={styles.card}>
              <ThemedText type="subtitle" style={styles.cardTitle}>Customer Info</ThemedText>
              <ThemedText>Full Name: <ThemedText type="defaultSemiBold">{customerData.fullname}</ThemedText></ThemedText>
              <ThemedText>Email: <ThemedText type="defaultSemiBold">{customerData.email}</ThemedText></ThemedText>
              <ThemedText>Mobile: <ThemedText type="defaultSemiBold">{customerData.mobileNumber}</ThemedText></ThemedText>
              <ThemedText>Status: <ThemedText type="defaultSemiBold">{customerData.status}</ThemedText></ThemedText>
              <ThemedText>Total Purchased: <ThemedText type="defaultSemiBold">${customerData.totalPurchasedAmount?.toFixed(2) || '0.00'}</ThemedText></ThemedText>
              <ThemedText>Remaining Amount: <ThemedText type="defaultSemiBold">${customerData.remainingAmount?.toFixed(2) || '0.00'}</ThemedText></ThemedText>
              {customerData.guaranteerId && (
                <ThemedText>Guaranteer ID: <ThemedText type="defaultSemiBold">{customerData.guaranteerId}</ThemedText></ThemedText>
              )}
            </ThemedView>

            {/* Cart Items Section */}
            {customerData.cart?.items && customerData.cart.items.length > 0 && (
              <ThemedView style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>Cart Items</ThemedText>
                <FlatList
                  data={customerData.cart.items}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <ThemedView style={styles.itemCard}>
                      <ThemedText type="defaultSemiBold" numberOfLines={1}>{item.productId.title}</ThemedText>
                      <ThemedText>Price: ${item.productId.price?.toFixed(2) || '0.00'}</ThemedText>
                      <ThemedText numberOfLines={2}>Desc: {item.productId.description}</ThemedText>
                      {item.invoiceIds && item.invoiceIds.length > 0 && (
                        <ThemedText style={styles.subDetail}>
                          Invoices: {item.invoiceIds.map((inv: { invoiceNumber: any; }) => inv.invoiceNumber).join(', ')}
                        </ThemedText>
                      )}
                    </ThemedView>
                  )}
                  numColumns={2} // Creates a 2-column grid
                  columnWrapperStyle={styles.row}
                  scrollEnabled={false} // Disable FlatList's own scrolling as it's inside a ScrollView
                />
              </ThemedView>
            )}

            {/* Phone Numbers Section */}
            {customerData.phoneNumbers && customerData.phoneNumbers.length > 0 && (
              <ThemedView style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>Phone Numbers</ThemedText>
                <FlatList
                  data={customerData.phoneNumbers}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <ThemedView style={styles.itemCard}>
                      <ThemedText type="defaultSemiBold">{item.number}</ThemedText>
                      <ThemedText>Type: {item.type}</ThemedText>
                      <ThemedText>Primary: {item.primary ? 'Yes' : 'No'}</ThemedText>
                    </ThemedView>
                  )}
                  numColumns={2}
                  columnWrapperStyle={styles.row}
                  scrollEnabled={false}
                />
              </ThemedView>
            )}

            {/* Addresses Section */}
            {customerData.addresses && customerData.addresses.length > 0 && (
              <ThemedView style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>Addresses</ThemedText>
                <FlatList
                  data={customerData.addresses}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <ThemedView style={styles.itemCard}>
                      <ThemedText type="defaultSemiBold">{item.type} Address</ThemedText>
                      <ThemedText>{item.street}, {item.city}</ThemedText>
                      <ThemedText>{item.state} - {item.zipCode}</ThemedText>
                      <ThemedText>{item.country}</ThemedText>
                    </ThemedView>
                  )}
                  numColumns={2}
                  columnWrapperStyle={styles.row}
                  scrollEnabled={false}
                />
              </ThemedView>
            )}

            {/* Payment History Section */}
            {customerData.paymentHistory && customerData.paymentHistory.length > 0 && (
              <ThemedView style={styles.section}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>Payment History</ThemedText>
                <FlatList
                  data={customerData.paymentHistory}
                  keyExtractor={(item) => item._id}
                  renderItem={({ item }) => (
                    <ThemedView style={styles.itemCard}>
                      <ThemedText type="defaultSemiBold">Amount: ${item.amount?.toFixed(2) || '0.00'}</ThemedText>
                      <ThemedText>Status: {item.status}</ThemedText>
                      <ThemedText>Transaction ID: {item.transactionId}</ThemedText>
                      <ThemedText>Date: {new Date(item.createdAt).toLocaleDateString()}</ThemedText>
                    </ThemedView>
                  )}
                  numColumns={2}
                  columnWrapperStyle={styles.row}
                  scrollEnabled={false}
                />
              </ThemedView>
            )}
          </>
        ) : (
          <ThemedView style={styles.centeredContent}>
            <ThemedText>Select a customer from the dropdown to view details.</ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 50, // Adjust for status bar/header
    backgroundColor: '#f0f4f8', // Light background for the screen
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
  centeredContent: {
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    padding: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden', // Ensures border radius applies to children
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  pickerItem: {
    fontSize: 16,
  },
  pickerLoading: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  row: {
    justifyContent: 'space-between',
  },
  itemCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    minWidth: '45%', // Approx half the width minus margin
  },
  subDetail: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
});
