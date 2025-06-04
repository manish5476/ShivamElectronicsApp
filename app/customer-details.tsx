// import { debounce } from 'lodash';
// import React, { useCallback, useEffect, useState } from 'react';
// import { ActivityIndicator, FlatList, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// // Assuming ThemedText and ThemedView are your custom components.
// // If they are just styled versions of Text and View, this is fine.
// // For this example, I'll provide basic fallbacks if they are not found,
// // but you should ensure these are correctly imported from your project.
// let ThemedText:any, ThemedView:any;
// try {
//   ThemedText = require('@/components/ThemedText').ThemedText;
//   ThemedView = require('@/components/ThemedView').ThemedView;
// } catch (e) {
//   console.warn("ThemedText/ThemedView not found, using basic Text/View. Ensure path is correct or provide components.");
//   ThemedText = ({ style, children, ...props }: any) => <Text style={style} {...props}>{children}</Text>;
//   ThemedView = ({ style, children, ...props }: any) => <View style={style} {...props}>{children}</View>;
// }


// import { CustomerData, CustomerSearchItem } from '@/src/api/types'; // Import types from the new types file
// import { appMessageService } from '../src/api/AppMessageService';
// import { autopopulateService } from '../src/api/AutopopulateService';
// import { customerService } from '../src/api/CustomerService';

// export default function CustomerDetailsScreen() {
//   const [searchText, setSearchText] = useState<string>('');
//   const [searchResults, setSearchResults] = useState<CustomerSearchItem[]>([]);
//   const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
//   const [customerData, setCustomerData] = useState<CustomerData | null>(null);
//   const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
//   const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const debouncedSearch = useCallback(
//     debounce(async (query: string) => {
//       if (!query.trim()) {
//         setSearchResults([]);
//         setLoadingSearch(false);
//         return;
//       }
//       setLoadingSearch(true);
//       setError(null);
//       try {
//         const results = await autopopulateService.fetchModuleData('customers', query);
//         setSearchResults(results as CustomerSearchItem[]);
//       } catch (err: any) {
//         const errorMessage = err.message || 'Failed to search customers.';
//         appMessageService.showError('Search Error', errorMessage);
//         setError(errorMessage);
//         setSearchResults([]);
//       } finally {
//         setLoadingSearch(false);
//       }
//     }, 500),
//     []
//   );

//   useEffect(() => {
//     debouncedSearch(searchText);
//     return () => {
//       debouncedSearch.cancel();
//     };
//   }, [searchText, debouncedSearch]);

//   useEffect(() => {
//     const fetchCustomerDetails = async () => {
//       if (!selectedCustomerId) {
//         setCustomerData(null);
//         return;
//       }
//       setLoadingDetails(true);
//       setError(null);
//       try {
//         const data: CustomerData | null = await customerService.getCustomerDataWithId(selectedCustomerId);
//         if (data) {
//           setCustomerData(data);
//           // appMessageService.showSuccess('Customer Loaded', `Details for ${data.fullname} loaded.`);
//         } else {
//           setError('No customer details found.');
//           setCustomerData(null);
//         }
//       } catch (err: any) {
//         const errorMessage = err.message || 'Failed to fetch customer details.';
//         appMessageService.showError('Fetch Error', errorMessage);
//         setError(errorMessage);
//         setCustomerData(null);
//       } finally {
//         setLoadingDetails(false);
//       }
//     };
//     fetchCustomerDetails();
//   }, [selectedCustomerId]);

//   const handleSelectCustomer = (id: string) => {
//     setSelectedCustomerId(id);
//     setSearchResults([]);
//     setSearchText('');
//   };

//   // Prepare rows for Customer Info card dynamically
//   const customerInfoRows = customerData ? [
//     { label: "Full Name", value: customerData.fullname, type: "defaultSemiBold" },
//     { label: "Email", value: customerData.email },
//     { label: "Mobile", value: customerData.mobileNumber },
//     { label: "Status", value: customerData.status ? customerData.status.charAt(0).toUpperCase() + customerData.status.slice(1) : 'N/A' },
//     { label: "Total Purchased", value: `$${customerData.totalPurchasedAmount?.toFixed(2) || '0.00'}` },
//     { label: "Remaining Amount", value: `$${customerData.remainingAmount?.toFixed(2) || '0.00'}` },
//     ...(customerData.guaranteerId ? [{ label: "Guaranteer ID", value: customerData.guaranteerId }] : [])
//   ].filter(row => row.value !== undefined && row.value !== null && row.value !== '') : [];

//   return (
//     <ThemedView style={styles.container}>
//       <ScrollView 
//         contentContainerStyle={styles.scrollViewContent} 
//         keyboardShouldPersistTaps="handled"
//         showsVerticalScrollIndicator={false}
//       >
//         <ThemedText type="title" style={styles.headerTitle}>Customer Insights</ThemedText>

//         {/* Search Input */}
//         <ThemedView style={styles.searchContainer}>
//           <TextInput
//             style={styles.searchInput}
//             placeholder="Search customers (e.g., name, email)"
//             placeholderTextColor="#A0AEC0" // Updated placeholder color
//             value={searchText}
//             onChangeText={setSearchText} // Directly use setSearchText for debouncing effect
//             returnKeyType="search"
//           />
//           {loadingSearch && <ActivityIndicator size="small" color="#4A90E2" style={styles.searchIndicator} />}
//         </ThemedView>

//         {/* Search Results Dropdown */}
//         {searchResults.length > 0 && searchText.length > 0 && (
//           <ThemedView style={styles.searchResultsContainer}>
//             <FlatList
//               data={searchResults}
//               keyExtractor={(item) => item._id}
//               renderItem={({ item, index }) => (
//                 <TouchableOpacity
//                   onPress={() => handleSelectCustomer(item._id)}
//                   style={[
//                     styles.searchResultItem,
//                     index === searchResults.length - 1 ? styles.searchResultItemLast : {}
//                   ]}
//                 >
//                   <ThemedText style={styles.searchResultText}>{item.fullname}</ThemedText>
//                   {item.email && <ThemedText style={styles.searchSubText}>Email: {item.email}</ThemedText>}
//                   {item.mobileNumber && <ThemedText style={styles.searchSubText}>Mobile: {item.mobileNumber}</ThemedText>}
//                 </TouchableOpacity>
//               )}
//               nestedScrollEnabled
//             />
//           </ThemedView>
//         )}

//         {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

//         {/* Customer Details Display Area */}
//         {loadingDetails ? (
//           <ThemedView style={styles.centeredMessageContainer}>
//             <ActivityIndicator size="large" color="#4A90E2" />
//             <ThemedText style={styles.centeredMessageText}>Fetching Customer Data...</ThemedText>
//           </ThemedView>
//         ) : customerData ? (
//           <>
//             {/* --- Customer Basic Info Card --- */}
//             <ThemedView style={styles.card}>
//               <ThemedText type="subtitle" style={styles.cardTitle}>🔑 Customer Profile</ThemedText>
//               {customerInfoRows.map((row, index) => (
//                 <ThemedView
//                   key={row.label}
//                   style={[
//                     styles.infoRow,
//                     index === customerInfoRows.length - 1 ? styles.infoRowLast : {}
//                   ]}
//                 >
//                   <ThemedText style={styles.infoLabel}>{row.label}:</ThemedText>
//                   <ThemedText style={styles.infoValue} type={row.type || 'default'}>{row.value}</ThemedText>
//                 </ThemedView>
//               ))}
//             </ThemedView>

//             {/* --- Cart Items Section --- */}
//             {customerData.cart?.items && customerData.cart.items.length > 0 && (
//               <ThemedView style={styles.sectionCard}>
//                 <ThemedText type="subtitle" style={styles.sectionTitle}>🛒 Cart Items</ThemedText>
//                 <FlatList
//                   data={customerData.cart.items}
//                   keyExtractor={(item) => item._id || item.productId?._id || Math.random().toString()}
//                   renderItem={({ item }) => (
//                     <ThemedView style={styles.itemCard}>
//                       <ThemedText style={styles.itemCardTitle} numberOfLines={1}>{item.productId?.title || 'N/A'}</ThemedText>
//                       <ThemedText style={styles.itemCardPrice}>${item.productId?.price?.toFixed(2) || '0.00'}</ThemedText>
//                       <ThemedText style={styles.itemCardDescription} numberOfLines={2}>{item.productId?.description || 'No description available.'}</ThemedText>
//                       {item.invoiceIds && item.invoiceIds.length > 0 && (
//                         <ThemedText style={styles.itemCardSubDetailText}>
//                           Invoices: {item.invoiceIds.map((inv: { invoiceNumber: any; }) => inv.invoiceNumber).join(', ')}
//                         </ThemedText>
//                       )}
//                     </ThemedView>
//                   )}
//                   numColumns={2}
//                   columnWrapperStyle={styles.listRow}
//                   scrollEnabled={false} 
//                 />
//               </ThemedView>
//             )}

//             {/* --- Phone Numbers Section --- */}
//             {customerData.phoneNumbers && customerData.phoneNumbers.length > 0 && (
//               <ThemedView style={styles.sectionCard}>
//                 <ThemedText type="subtitle" style={styles.sectionTitle}>📞 Contact Numbers</ThemedText>
//                 <FlatList
//                   data={customerData.phoneNumbers}
//                   keyExtractor={(item) => item._id || item.number}
//                   renderItem={({ item }) => (
//                     <ThemedView style={styles.itemCard}>
//                       <ThemedText style={styles.itemCardAccentText}>{item.number}</ThemedText>
//                       <ThemedText style={styles.itemCardDetailText}>Type: {item.type || 'N/A'}</ThemedText>
//                       <ThemedText style={styles.itemCardDetailText}>Primary: {item.primary ? 'Yes' : 'No'}</ThemedText>
//                     </ThemedView>
//                   )}
//                   numColumns={2}
//                   columnWrapperStyle={styles.listRow}
//                   scrollEnabled={false}
//                 />
//               </ThemedView>
//             )}

//             {/* --- Addresses Section --- */}
//             {customerData.addresses && customerData.addresses.length > 0 && (
//               <ThemedView style={styles.sectionCard}>
//                 <ThemedText type="subtitle" style={styles.sectionTitle}>🏠 Addresses</ThemedText>
//                 <FlatList
//                   data={customerData.addresses}
//                   keyExtractor={(item) => item._id || `${item.street}-${item.city}`}
//                   renderItem={({ item }) => (
//                     <ThemedView style={styles.itemCard}>
//                       <ThemedText style={styles.itemCardTitleSm}>{item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'Address'}</ThemedText>
//                       <ThemedText style={styles.itemCardDetailText} numberOfLines={2}>{item.street || 'N/A'}, {item.city || 'N/A'}</ThemedText>
//                       <ThemedText style={styles.itemCardDetailText}>{item.state || 'N/A'} - {item.zipCode || 'N/A'}</ThemedText>
//                       <ThemedText style={styles.itemCardSubDetailText}>{item.country || 'N/A'}</ThemedText>
//                     </ThemedView>
//                   )}
//                   numColumns={2}
//                   columnWrapperStyle={styles.listRow}
//                   scrollEnabled={false}
//                 />
//               </ThemedView>
//             )}

//             {/* --- Payment History Section --- */}
//             {customerData.paymentHistory && customerData.paymentHistory.length > 0 && (
//               <ThemedView style={styles.sectionCard}>
//                 <ThemedText type="subtitle" style={styles.sectionTitle}>💳 Payment History</ThemedText>
//                 <FlatList
//                   data={customerData.paymentHistory}
//                   keyExtractor={(item) => item._id || item.transactionId}
//                   renderItem={({ item }) => (
//                     <ThemedView style={styles.itemCard}>
//                       <ThemedText style={styles.itemCardPrice}>${item.amount?.toFixed(2) || '0.00'}</ThemedText>
//                       <ThemedText 
//                         style={[
//                           styles.itemCardDetailText, 
//                           item.status?.toLowerCase() === 'completed' ? styles.statusCompleted : 
//                           item.status?.toLowerCase() === 'pending' ? styles.statusPending : 
//                           styles.statusFailed
//                         ]}
//                       >
//                         Status: {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'N/A'}
//                       </ThemedText>
//                       <ThemedText style={styles.itemCardSubDetailText} numberOfLines={1} ellipsizeMode="tail">ID: {item.transactionId || 'N/A'}</ThemedText>
//                       <ThemedText style={styles.itemCardSubDetailText}>Date: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</ThemedText>
//                     </ThemedView>
//                   )}
//                   numColumns={2}
//                   columnWrapperStyle={styles.listRow}
//                   scrollEnabled={false}
//                 />
//               </ThemedView>
//             )}
//           </>
//         ) : !loadingDetails && !error && ( 
//           <ThemedView style={styles.centeredMessageContainer}>
//             <ThemedText style={styles.centeredMessageText}>
//               ✨ Please search for a customer to view their details.
//             </ThemedText>
//           </ThemedView>
//         )}
//       </ScrollView>
//     </ThemedView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#F8F9FA', // Lighter, cleaner background
//   },
//   scrollViewContent: {
//     padding: 20, // Uniform padding
//     paddingBottom: 40, // Extra space at bottom
//   },
//   centeredMessageContainer: { // Renamed from centeredContent for clarity
//     justifyContent: 'center',
//     alignItems: 'center',
//     minHeight: 200,
//     padding: 20,
//     marginTop: 30,
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16, // Softer radius
//     shadowColor: '#6B7280',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.05,
//     shadowRadius: 6,
//     elevation: 3,
//   },
//   centeredMessageText: {
//     fontSize: 16,
//     color: '#4B5563', // Softer text color
//     textAlign: 'center',
//     lineHeight: 24,
//   },
//   headerTitle: {
//     fontSize: 30, // Slightly larger
//     fontWeight: 'bold', // Ensure ThemedText type="title" doesn't override this if it has its own weight
//     marginBottom: 28,
//     textAlign: 'center',
//     color: '#1F2937', // Darker, more prominent title
//   },
//   searchContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12, // Consistent radius
//     paddingHorizontal: 18,
//     paddingVertical: Platform.OS === 'ios' ? 14 : 10,
//     marginBottom: 20,
//     shadowColor: '#9CA3AF',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 8,
//     elevation: 4,
//     borderWidth: 1,
//     borderColor: '#E5E7EB', // Subtle border
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     color: '#374151',
//     height: Platform.OS === 'ios' ? undefined : 40,
//   },
//   searchIndicator: {
//     marginLeft: 12,
//   },
//   searchResultsContainer: {
//     backgroundColor: '#FFFFFF',
//     borderRadius: 12,
//     marginBottom: 20,
//     shadowColor: '#9CA3AF',
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 5,
//     maxHeight: 260, // Slightly more room
//     overflow: 'hidden',
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   searchResultItem: {
//     paddingHorizontal: 20,
//     paddingVertical: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6', // Very light separator
//   },
//   searchResultItemLast: {
//     borderBottomWidth: 0,
//   },
//   searchResultText: {
//     fontSize: 17, // Slightly larger for better tap target
//     color: '#1F2937',
//     fontWeight: '500', // Medium weight for readability
//   },
//   searchSubText: {
//     fontSize: 14,
//     color: '#6B7280', // Softer secondary text
//     marginTop: 5,
//   },
//   card: { // Main customer info card
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 24,
//     marginBottom: 30,
//     shadowColor: '#9CA3AF',
//     shadowOffset: { width: 0, height: 5 },
//     shadowOpacity: 0.12,
//     shadowRadius: 12,
//     elevation: 6,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   cardTitle: { // For "Customer Profile"
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#111827',
//     paddingBottom: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   infoRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-start', // Better for potentially multi-line values
//     paddingVertical: 14, // Increased padding
//     borderBottomWidth: 1,
//     borderBottomColor: '#F9FAFB', // Extremely light separator
//   },
//   infoLabel: {
//     fontSize: 15,
//     color: '#4B5563',
//     fontWeight: '500',
//     marginRight: 12,
//   },
//   infoValue: {
//     fontSize: 15,
//     color: '#1F2937',
//     textAlign: 'right',
//     flexShrink: 1, // Allow value to wrap if long
//     fontWeight: '500',
//   },
//   infoRowLast: {
//     borderBottomWidth: 0,
//   },
//   sectionCard: { // For sections like Cart, Phones, etc.
//     backgroundColor: '#FFFFFF',
//     borderRadius: 16,
//     padding: 20,
//     marginBottom: 25,
//     shadowColor: '#9CA3AF',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.08,
//     shadowRadius: 10,
//     elevation: 4,
//     borderWidth: 1,
//     borderColor: '#E5E7EB',
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '600', // Semi-bold
//     marginBottom: 18,
//     color: '#111827',
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: '#F3F4F6',
//   },
//   listRow: { // columnWrapperStyle for FlatList
//     justifyContent: 'space-between',
//   },
//   itemCard: {
//     flex: 1, 
//     maxWidth: '48.5%', // Adjust for spacing, ensures two columns
//     backgroundColor: '#F9FAFB', // Slightly off-white card background
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 16, // Space between rows of cards
//     shadowColor: '#D1D5DB',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//     borderWidth: 1,
//     borderColor: '#E5E7EB'
//   },
//   itemCardTitle: { // For main title in item card (e.g., product name)
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#1F2937',
//     marginBottom: 6,
//   },
//   itemCardTitleSm: { // For smaller titles (e.g., address type)
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#374151',
//     marginBottom: 6,
//   },
//   itemCardPrice: {
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#059669', // Green for price/amount
//     marginBottom: 4,
//   },
//   itemCardAccentText: { // For primary info like phone number
//     fontSize: 15,
//     fontWeight: '600',
//     color: '#2563EB', // Blue for accent
//     marginBottom: 6,
//   },
//   itemCardDescription: { // For product description
//     fontSize: 13,
//     color: '#4B5563',
//     marginBottom: 8,
//     lineHeight: 18,
//   },
//   itemCardDetailText: { // For general details within item cards
//     fontSize: 14,
//     color: '#374151',
//     marginBottom: 4,
//     lineHeight: 20,
//   },
//   itemCardSubDetailText: { // For less prominent details (e.g., invoices, country, transaction ID)
//     fontSize: 12,
//     color: '#6B7280',
//     marginTop: 6,
//   },
//   statusCompleted: { color: '#059669' }, // Green
//   statusPending: { color: '#D97706' },   // Amber/Orange
//   statusFailed: { color: '#DC2626' },     // Red
//   errorText: {
//     color: '#C53030',
//     textAlign: 'center',
//     marginBottom: 20,
//     paddingVertical: 14,
//     paddingHorizontal: 18,
//     backgroundColor: '#FEE2E2', // Lighter red background
//     borderRadius: 10,
//     fontSize: 15,
//     borderWidth: 1,
//     borderColor: '#FCA5A5', // Softer red border
//     fontWeight: '500',
//   },
// });
// // import { debounce } from 'lodash';
// // import React, { useCallback, useEffect, useState } from 'react';
// // import { ActivityIndicator, FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

// // import { ThemedText } from '@/components/ThemedText';
// // import { ThemedView } from '@/components/ThemedView';
// // import { CustomerData, CustomerSearchItem } from '@/src/api/types'; // Import types from the new types file
// // import { appMessageService } from '../src/api/AppMessageService'; // Adjust path
// // import { autopopulateService } from '../src/api/AutopopulateService'; // Adjust path
// // import { customerService } from '../src/api/CustomerService'; // Import customerService

// // export default function CustomerDetailsScreen() {
// //   const [searchText, setSearchText] = useState<string>('');
// //   const [searchResults, setSearchResults] = useState<CustomerSearchItem[]>([]);
// //   const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
// //   const [customerData, setCustomerData] = useState<CustomerData | null>(null);
// //   const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
// //   const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
// //   const [error, setError] = useState<string | null>(null);

// //   // Debounced search function: This hits the API for suggestions
// //   // only after the user stops typing for 500ms.
// //   const debouncedSearch = useCallback(
// //     debounce(async (query: string) => {
// //       if (!query) {
// //         setSearchResults([]);
// //         setLoadingSearch(false);
// //         return;
// //       }
// //       setLoadingSearch(true);
// //       setError(null);
// //       try {
// //         // Cast the 'any[]' response to CustomerSearchItem[]
// //         // Ensure your autopopulateService returns _id, fullname, mobileNumber, email
// //         const results = await autopopulateService.fetchModuleData('customers', query);
// //         console.log(results,"margin")
// //         setSearchResults(results as CustomerSearchItem[]);
// //       } catch (err: any) {
// //         appMessageService.showError('Search Error', err.message || 'Failed to search customers.');
// //         setError(err.message || 'Failed to search customers.');
// //         setSearchResults([]);
// //       } finally {
// //         setLoadingSearch(false);
// //       }
// //     }, 500), 
// //     [] // Empty dependency array means this function is created once
// //   );

// //   useEffect(() => {
// //     debouncedSearch(searchText);
// //     return () => {
// //       debouncedSearch.cancel(); 
// //     };
// //   }, [searchText, debouncedSearch]);
// //   useEffect(() => {
// //     const fetchCustomerDetails = async () => {
// //       if (!selectedCustomerId) {
// //         setCustomerData(null);
// //         return;
// //       }

// //       setLoadingDetails(true);
// //       setError(null);
// //       try {
// //         // customerService.getCustomerDataWithId returns 'any', which we cast to CustomerData | null
// //         const data: CustomerData | null = await customerService.getCustomerDataWithId(selectedCustomerId);

// //         if (data) {
// //           setCustomerData(data);
// //           console.log(customerData)
// //           appMessageService.showSuccess('Customer Loaded', `Details for ${data.fullname} loaded successfully.`);
// //         } else {
// //           setError('No customer details found for this ID.');
// //           setCustomerData(null);
// //         }
// //       } catch (err: any) {
// //         setError('Failed to fetch customer details.');
// //         setCustomerData(null);
// //       } finally {
// //         setLoadingDetails(false);
// //       }
// //     };
// //     fetchCustomerDetails();
// //   }, [selectedCustomerId]); // Re-run when selectedCustomerId changes

// //   const handleSelectCustomer = (id: string) => {
// //     setSelectedCustomerId(id);
// //     setSearchResults([]); // Clear search results after selection
// //     setSearchText(''); // Clear search text in the input
// //   };

// //   return (
// //     <ThemedView style={styles.container}>
// //       <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
// //         <ThemedText type="title" style={styles.headerTitle}>Customer Details</ThemedText>

// //         {/* Search Input (acting as the "type-ahead" part of the dropdown) */}
// //         <ThemedView style={styles.searchContainer}>
// //           <TextInput
// //             style={styles.searchInput}
// //             placeholder="Search by name, email, or mobile number..."
// //             placeholderTextColor="#888"
// //             value={searchText}
// //             onChangeText={setSearchText}
// //           />
// //           {loadingSearch && <ActivityIndicator size="small" color="#0000ff" style={styles.searchIndicator} />}
// //         </ThemedView>

// //         {/* Search Results (the "dropdown" list) */}
// //         {searchResults.length > 0 && searchText.length > 0 && ( // Only show if search text is active and results exist
// //           <ThemedView style={styles.searchResultsContainer}>
// //             <FlatList
// //               data={searchResults}
// //               keyExtractor={(item) => item._id}
// //               renderItem={({ item }) => (
// //                 <TouchableOpacity onPress={() => handleSelectCustomer(item._id)} style={styles.searchResultItem}>
// //                   <ThemedText style={styles.searchResultText}>{item.fullname}</ThemedText>
// //                   {item.email && <ThemedText style={styles.searchSubText}>Email: {item.email}</ThemedText>}
// //                   {item.mobileNumber && <ThemedText style={styles.searchSubText}>Mobile: {item.mobileNumber}</ThemedText>}
// //                 </TouchableOpacity>
// //               )}
// //               style={styles.searchResultsList}
// //               nestedScrollEnabled // Important for FlatList inside ScrollView
// //             />
// //           </ThemedView>
// //         )}

// //         {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

// //         {/* Customer Details Display */}
// //         {loadingDetails ? (
// //           <ThemedView style={styles.centeredContent}>
// //             <ActivityIndicator size="large" color="#0000ff" />
// //             <ThemedText>Loading customer details...</ThemedText>
// //           </ThemedView>
// //         ) : customerData ? (
// //           <>
// //             {/* Customer Basic Info Card */}
// //             <ThemedView style={styles.card}>
// //               <ThemedText type="subtitle" style={styles.cardTitle}>Customer Info</ThemedText>
// //               <ThemedText>Full Name: <ThemedText type="title">{customerData.fullname}</ThemedText></ThemedText>
// //               <ThemedText>Email: <ThemedText type="title">{customerData.email}</ThemedText></ThemedText>
// //               <ThemedText>Mobile: <ThemedText type="title">{customerData.mobileNumber}</ThemedText></ThemedText>
// //               <ThemedText>Status: <ThemedText type="title">{customerData.status}</ThemedText></ThemedText>
// //               <ThemedText>Total Purchased: <ThemedText type="title">${customerData.totalPurchasedAmount?.toFixed(2) || '0.00'}</ThemedText></ThemedText>
// //               <ThemedText>Remaining Amount: <ThemedText type="title">${customerData.remainingAmount?.toFixed(2) || '0.00'}</ThemedText></ThemedText>
// //               {customerData.guaranteerId && (
// //                 <ThemedText>Guaranteer ID: <ThemedText type="title">{customerData.guaranteerId}</ThemedText></ThemedText>
// //               )}
// //             </ThemedView>

// //             {/* Cart Items Section */}
// //             {customerData.cart?.items && customerData.cart.items.length > 0 && (
// //               <ThemedView style={styles.section}>
// //                 <ThemedText type="subtitle" style={styles.sectionTitle}>Cart Items</ThemedText>
// //                 <FlatList
// //                   data={customerData.cart.items}
// //                   keyExtractor={(item) => item._id}
// //                   renderItem={({ item }) => (
// //                     <ThemedView style={styles.itemCard}>
// //                       <ThemedText type="defaultSemiBold" numberOfLines={1}>{item.productId.title}</ThemedText>
// //                       <ThemedText>Price: ${item.productId.price?.toFixed(2) || '0.00'}</ThemedText>
// //                       <ThemedText numberOfLines={2}>Desc: {item.productId.description}</ThemedText>
// //                       {item.invoiceIds && item.invoiceIds.length > 0 && (
// //                         <ThemedText style={styles.subDetail}>
// //                           Invoices: {item.invoiceIds.map((inv: { invoiceNumber: any; }) => inv.invoiceNumber).join(', ')}
// //                         </ThemedText>
// //                       )}
// //                     </ThemedView>
// //                   )}
// //                   numColumns={2} // Creates a 2-column grid
// //                   columnWrapperStyle={styles.row}
// //                   scrollEnabled={false} // Disable FlatList's own scrolling as it's inside a ScrollView
// //                 />
// //               </ThemedView>
// //             )}

// //             {/* Phone Numbers Section */}
// //             {customerData.phoneNumbers && customerData.phoneNumbers.length > 0 && (
// //               <ThemedView style={styles.section}>
// //                 <ThemedText type="subtitle" style={styles.sectionTitle}>Phone Numbers</ThemedText>
// //                 <FlatList
// //                   data={customerData.phoneNumbers}
// //                   keyExtractor={(item) => item._id}
// //                   renderItem={({ item }) => (
// //                     <ThemedView style={styles.itemCard}>
// //                       <ThemedText type="defaultSemiBold">{item.number}</ThemedText>
// //                       <ThemedText>Type: {item.type}</ThemedText>
// //                       <ThemedText>Primary: {item.primary ? 'Yes' : 'No'}</ThemedText>
// //                     </ThemedView>
// //                   )}
// //                   numColumns={2}
// //                   columnWrapperStyle={styles.row}
// //                   scrollEnabled={false}
// //                 />
// //               </ThemedView>
// //             )}

// //             {/* Addresses Section */}
// //             {customerData.addresses && customerData.addresses.length > 0 && (
// //               <ThemedView style={styles.section}>
// //                 <ThemedText type="subtitle" style={styles.sectionTitle}>Addresses</ThemedText>
// //                 <FlatList
// //                   data={customerData.addresses}
// //                   keyExtractor={(item) => item._id}
// //                   renderItem={({ item }) => (
// //                     <ThemedView style={styles.itemCard}>
// //                       <ThemedText type="defaultSemiBold">{item.type} Address</ThemedText>
// //                       <ThemedText>{item.street}, {item.city}</ThemedText>
// //                       <ThemedText>{item.state} - {item.zipCode}</ThemedText>
// //                       <ThemedText>{item.country}</ThemedText>
// //                     </ThemedView>
// //                   )}
// //                   numColumns={2}
// //                   columnWrapperStyle={styles.row}
// //                   scrollEnabled={false}
// //                 />
// //               </ThemedView>
// //             )}

// //             {/* Payment History Section */}
// //             {customerData.paymentHistory && customerData.paymentHistory.length > 0 && (
// //               <ThemedView style={styles.section}>
// //                 <ThemedText type="subtitle" style={styles.sectionTitle}>Payment History</ThemedText>
// //                 <FlatList
// //                   data={customerData.paymentHistory}
// //                   keyExtractor={(item) => item._id}
// //                   renderItem={({ item }) => (
// //                     <ThemedView style={styles.itemCard}>
// //                       <ThemedText type="defaultSemiBold">Amount: ${item.amount?.toFixed(2) || '0.00'}</ThemedText>
// //                       <ThemedText>Status: {item.status}</ThemedText>
// //                       <ThemedText>Transaction ID: {item.transactionId}</ThemedText>
// //                       <ThemedText>Date: {new Date(item.createdAt).toLocaleDateString()}</ThemedText>
// //                     </ThemedView>
// //                   )}
// //                   numColumns={2}
// //                   columnWrapperStyle={styles.row}
// //                   scrollEnabled={false}
// //                 />
// //               </ThemedView>
// //             )}
// //           </>
// //         ) : (
// //           <ThemedView style={styles.centeredContent}>
// //             <ThemedText>Start typing to search for a customer.</ThemedText>
// //           </ThemedView>
// //         )}
// //       </ScrollView>
// //     </ThemedView>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     padding: 16,
// //     paddingTop: 50, // Adjust for status bar/header
// //     backgroundColor: '#f0f4f8', // Light background for the screen
// //   },
// //   scrollViewContent: {
// //     paddingBottom: 20,
// //   },
// //   centeredContent: {
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     minHeight: 200,
// //     padding: 16,
// //   },
// //   headerTitle: {
// //     fontSize: 28,
// //     fontWeight: 'bold',
// //     marginBottom: 20,
// //     textAlign: 'center',
// //     color: '#2c3e50',
// //   },
// //   searchContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     backgroundColor: '#fff',
// //     borderRadius: 12,
// //     paddingHorizontal: 15,
// //     marginBottom: 15,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   searchInput: {
// //     flex: 1,
// //     height: 50,
// //     fontSize: 16,
// //     color: '#333',
// //   },
// //   searchIndicator: {
// //     marginLeft: 10,
// //   },
// //   searchResultsContainer: {
// //     backgroundColor: '#fff',
// //     borderRadius: 12,
// //     marginTop: -10, // Overlap slightly with search container
// //     marginBottom: 15,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //     maxHeight: 200, // Limit height to avoid taking too much screen
// //     overflow: 'hidden',
// //   },
// //   searchResultsList: {
// //     paddingVertical: 5,
// //   },
// //   searchResultItem: {
// //     padding: 15,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#eee',
// //   },
// //   searchResultText: {
// //     fontSize: 16,
// //     color: '#333',
// //   },
// //   searchSubText: {
// //     fontSize: 14,
// //     color: '#666',
// //   },
// //   card: {
// //     backgroundColor: '#fff',
// //     borderRadius: 12,
// //     padding: 20,
// //     marginBottom: 20,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     elevation: 3,
// //   },
// //   cardTitle: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     marginBottom: 10,
// //     color: '#2c3e50',
// //   },
// //   section: {
// //     marginBottom: 20,
// //   },
// //   sectionTitle: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     marginBottom: 10,
// //     color: '#2c3e50',
// //   },
// //   row: {
// //     justifyContent: 'space-between',
// //   },
// //   itemCard: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //     borderRadius: 10,
// //     padding: 15,
// //     marginHorizontal: 5,
// //     marginBottom: 10,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 1 },
// //     shadowOpacity: 0.08,
// //     shadowRadius: 3,
// //     elevation: 2,
// //     minWidth: '45%',
// //   },
// //   subDetail: {
// //     fontSize: 12,
// //     color: '#666',
// //     marginTop: 5,
// //   },
// //   errorText: {
// //     color: 'red',
// //     textAlign: 'center',
// //     marginBottom: 10,
// //   },
// // });























// // // // app/customer-details.tsx
// // // import { debounce } from 'lodash'; // You might need to install lodash: npm install lodash or yarn add lodash
// // // import React, { useCallback, useEffect, useState } from 'react';
// // // import { ActivityIndicator, FlatList, ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

// // // import { ThemedText } from '@/components/ThemedText';
// // // import { ThemedView } from '@/components/ThemedView';
// // // import { appMessageService } from '../src/api/AppMessageService'; // Adjust path
// // // import { autopopulateService } from '../src/api/AutopopulateService'; // Adjust path
// // // import { CustomerData, customerService } from '../src/api/CustomerService'; // Import CustomerData for types

// // // // Define a simple interface for the customer search result from autopopulate
// // // // Assuming autopopulate service returns _id and fullname at a minimum
// // // interface AutocompleteCustomer {
// // //   _id: string;
// // //   fullname: string;
// // //   // Add other relevant fields returned by autopopulate if necessary, e.g., email, mobileNumber
// // // }

// // // export default function CustomerDetailsScreen() {
// // //   const [searchText, setSearchText] = useState<string>('');
// // //   const [searchResults, setSearchResults] = useState<AutocompleteCustomer[]>([]);
// // //   const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
// // //   const [customerData, setCustomerData] = useState<CustomerData | null>(null);
// // //   const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
// // //   const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
// // //   const [error, setError] = useState<string | null>(null);

// // //   // Debounced search function
// // //   const debouncedSearch = useCallback(
// // //     debounce(async (query: string) => {
// // //       if (!query) {
// // //         setSearchResults([]);
// // //         setLoadingSearch(false);
// // //         return;
// // //       }
// // //       setLoadingSearch(true);
// // //       setError(null);
// // //       try {
// // //         // The autopopulateService.searchModuleData for 'customers' should return AutocompleteCustomer[]
// // //         const results = await autopopulateService.searchModuleData('customers', query);
// // //         setSearchResults(results as AutocompleteCustomer[]); // Type assertion
// // //       } catch (err: any) {
// // //         appMessageService.showError('Search Error', err.message || 'Failed to search customers.');
// // //         setError(err.message || 'Failed to search customers.');
// // //         setSearchResults([]);
// // //       } finally {
// // //         setLoadingSearch(false);
// // //       }
// // //     }, 500), // 500ms debounce time
// // //     [] // Empty dependency array means this function is created once
// // //   );

// // //   // Effect to trigger debounced search when searchText changes
// // //   useEffect(() => {
// // //     debouncedSearch(searchText);
// // //     return () => {
// // //       debouncedSearch.cancel(); // Clean up on unmount or if searchText changes before debounce fires
// // //     };
// // //   }, [searchText, debouncedSearch]);

// // //   // Effect to fetch detailed customer data when selectedCustomerId changes
// // //   useEffect(() => {
// // //     const fetchCustomerDetails = async () => {
// // //       if (!selectedCustomerId) {
// // //         setCustomerData(null);
// // //         return;
// // //       }

// // //       setLoadingDetails(true);
// // //       setError(null);
// // //       try {
// // //         // CORRECTED: customerService.getCustomerDataWithId now directly returns CustomerData or null
// // //         const data: CustomerData | null = await customerService.getCustomerDataWithId(selectedCustomerId);

// // //         if (data) { // Check if data itself exists
// // //           setCustomerData(data);
// // //         } else {
// // //           // Error message already shown by service via appMessageService, so just update state
// // //           setError('No customer details found.');
// // //           setCustomerData(null);
// // //         }
// // //       } catch (err: any) {
// // //         // Error message already shown by service via appMessageService
// // //         setError('Failed to fetch customer details.');
// // //         setCustomerData(null);
// // //       } finally {
// // //         setLoadingDetails(false);
// // //       }
// // //     };
// // //     fetchCustomerDetails();
// // //   }, [selectedCustomerId]); // Re-run when selectedCustomerId changes

// // //   const handleSelectCustomer = (id: string) => {
// // //     setSelectedCustomerId(id);
// // //     setSearchResults([]); // Clear search results after selection
// // //     setSearchText(''); // Clear search text
// // //   };

// // //   return (
// // //     <ThemedView style={styles.container}>
// // //       <ScrollView contentContainerStyle={styles.scrollViewContent} keyboardShouldPersistTaps="handled">
// // //         <ThemedText type="title" style={styles.headerTitle}>Customer Details</ThemedText>

// // //         {/* Search Input */}
// // //         <ThemedView style={styles.searchContainer}>
// // //           <TextInput
// // //             style={styles.searchInput}
// // //             placeholder="Search customer by name or email..."
// // //             placeholderTextColor="#888"
// // //             value={searchText}
// // //             onChangeText={setSearchText}
// // //           />
// // //           {loadingSearch && <ActivityIndicator size="small" color="#0000ff" style={styles.searchIndicator} />}
// // //         </ThemedView>

// // //         {/* Search Results */}
// // //         {searchResults.length > 0 && searchText.length > 0 && ( // Only show if search text is active and results exist
// // //           <ThemedView style={styles.searchResultsContainer}>
// // //             <FlatList
// // //               data={searchResults}
// // //               keyExtractor={(item) => item._id}
// // //               renderItem={({ item }) => (
// // //                 <TouchableOpacity onPress={() => handleSelectCustomer(item._id)} style={styles.searchResultItem}>
// // //                   <ThemedText style={styles.searchResultText}>{item.fullname}</ThemedText>
// // //                   {/* You could add more details here, e.g., email, mobile number */}
// // //                 </TouchableOpacity>
// // //               )}
// // //               style={styles.searchResultsList}
// // //               nestedScrollEnabled // Important for FlatList inside ScrollView
// // //             />
// // //           </ThemedView>
// // //         )}

// // //         {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

// // //         {/* Customer Details Display */}
// // //         {loadingDetails ? (
// // //           <ThemedView style={styles.centeredContent}>
// // //             <ActivityIndicator size="large" color="#0000ff" />
// // //             <ThemedText>Loading customer details...</ThemedText>
// // //           </ThemedView>
// // //         ) : customerData ? (
// // //           <>
// // //             {/* Customer Basic Info Card */}
// // //             <ThemedView style={styles.card}>
// // //               <ThemedText type="subtitle" style={styles.cardTitle}>Customer Info</ThemedText>
// // //               <ThemedText>Full Name: <ThemedText type="defaultSemiBold">{customerData.fullname}</ThemedText></ThemedText>
// // //               <ThemedText>Email: <ThemedText type="defaultSemiBold">{customerData.email}</ThemedText></ThemedText>
// // //               <ThemedText>Mobile: <ThemedText type="defaultSemiBold">{customerData.mobileNumber}</ThemedText></ThemedText>
// // //               <ThemedText>Status: <ThemedText type="defaultSemiBold">{customerData.status}</ThemedText></ThemedText>
// // //               <ThemedText>Total Purchased: <ThemedText type="defaultSemiBold">${customerData.totalPurchasedAmount?.toFixed(2) || '0.00'}</ThemedText></ThemedText>
// // //               <ThemedText>Remaining Amount: <ThemedText type="defaultSemiBold">${customerData.remainingAmount?.toFixed(2) || '0.00'}</ThemedText></ThemedText>
// // //               {customerData.guaranteerId && (
// // //                 <ThemedText>Guaranteer ID: <ThemedText type="defaultSemiBold">{customerData.guaranteerId}</ThemedText></ThemedText>
// // //               )}
// // //             </ThemedView>

// // //             {/* Cart Items Section */}
// // //             {customerData.cart?.items && customerData.cart.items.length > 0 && (
// // //               <ThemedView style={styles.section}>
// // //                 <ThemedText type="subtitle" style={styles.sectionTitle}>Cart Items</ThemedText>
// // //                 <FlatList
// // //                   data={customerData.cart.items}
// // //                   keyExtractor={(item) => item._id}
// // //                   renderItem={({ item }) => (
// // //                     <ThemedView style={styles.itemCard}>
// // //                       <ThemedText type="defaultSemiBold" numberOfLines={1}>{item.productId.title}</ThemedText>
// // //                       <ThemedText>Price: ${item.productId.price?.toFixed(2) || '0.00'}</ThemedText>
// // //                       <ThemedText numberOfLines={2}>Desc: {item.productId.description}</ThemedText>
// // //                       {item.invoiceIds && item.invoiceIds.length > 0 && (
// // //                         <ThemedText style={styles.subDetail}>
// // //                           Invoices: {item.invoiceIds.map(inv => inv.invoiceNumber).join(', ')}
// // //                         </ThemedText>
// // //                       )}
// // //                     </ThemedView>
// // //                   )}
// // //                   numColumns={2} // Creates a 2-column grid
// // //                   columnWrapperStyle={styles.row}
// // //                   scrollEnabled={false} // Disable FlatList's own scrolling as it's inside a ScrollView
// // //                 />
// // //               </ThemedView>
// // //             )}

// // //             {/* Phone Numbers Section */}
// // //             {customerData.phoneNumbers && customerData.phoneNumbers.length > 0 && (
// // //               <ThemedView style={styles.section}>
// // //                 <ThemedText type="subtitle" style={styles.sectionTitle}>Phone Numbers</ThemedText>
// // //                 <FlatList
// // //                   data={customerData.phoneNumbers}
// // //                   keyExtractor={(item) => item._id}
// // //                   renderItem={({ item }) => (
// // //                     <ThemedView style={styles.itemCard}>
// // //                       <ThemedText type="defaultSemiBold">{item.number}</ThemedText>
// // //                       <ThemedText>Type: {item.type}</ThemedText>
// // //                       <ThemedText>Primary: {item.primary ? 'Yes' : 'No'}</ThemedText>
// // //                     </ThemedView>
// // //                   )}
// // //                   numColumns={2}
// // //                   columnWrapperStyle={styles.row}
// // //                   scrollEnabled={false}
// // //                 />
// // //               </ThemedView>
// // //             )}

// // //             {/* Addresses Section */}
// // //             {customerData.addresses && customerData.addresses.length > 0 && (
// // //               <ThemedView style={styles.section}>
// // //                 <ThemedText type="subtitle" style={styles.sectionTitle}>Addresses</ThemedText>
// // //                 <FlatList
// // //                   data={customerData.addresses}
// // //                   keyExtractor={(item) => item._id}
// // //                   renderItem={({ item }) => (
// // //                     <ThemedView style={styles.itemCard}>
// // //                       <ThemedText type="defaultSemiBold">{item.type} Address</ThemedText>
// // //                       <ThemedText>{item.street}, {item.city}</ThemedText>
// // //                       <ThemedText>{item.state} - {item.zipCode}</ThemedText>
// // //                       <ThemedText>{item.country}</ThemedText>
// // //                     </ThemedView>
// // //                   )}
// // //                   numColumns={2}
// // //                   columnWrapperStyle={styles.row}
// // //                   scrollEnabled={false}
// // //                 />
// // //               </ThemedView>
// // //             )}

// // //             {/* Payment History Section */}
// // //             {customerData.paymentHistory && customerData.paymentHistory.length > 0 && (
// // //               <ThemedView style={styles.section}>
// // //                 <ThemedText type="subtitle" style={styles.sectionTitle}>Payment History</ThemedText>
// // //                 <FlatList
// // //                   data={customerData.paymentHistory}
// // //                   keyExtractor={(item) => item._id}
// // //                   renderItem={({ item }) => (
// // //                     <ThemedView style={styles.itemCard}>
// // //                       <ThemedText type="defaultSemiBold">Amount: ${item.amount?.toFixed(2) || '0.00'}</ThemedText>
// // //                       <ThemedText>Status: {item.status}</ThemedText>
// // //                       <ThemedText>Transaction ID: {item.transactionId}</ThemedText>
// // //                       <ThemedText>Date: {new Date(item.createdAt).toLocaleDateString()}</ThemedText>
// // //                     </ThemedView>
// // //                   )}
// // //                   numColumns={2}
// // //                   columnWrapperStyle={styles.row}
// // //                   scrollEnabled={false}
// // //                 />
// // //               </ThemedView>
// // //             )}
// // //           </>
// // //         ) : (
// // //           <ThemedView style={styles.centeredContent}>
// // //             <ThemedText>Start typing to search for a customer.</ThemedText>
// // //           </ThemedView>
// // //         )}
// // //       </ScrollView>
// // //     </ThemedView>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     padding: 16,
// // //     paddingTop: 50, // Adjust for status bar/header
// // //     backgroundColor: '#f0f4f8', // Light background for the screen
// // //   },
// // //   scrollViewContent: {
// // //     paddingBottom: 20,
// // //   },
// // //   centeredContent: {
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     minHeight: 200,
// // //     padding: 16,
// // //   },
// // //   headerTitle: {
// // //     fontSize: 28,
// // //     fontWeight: 'bold',
// // //     marginBottom: 20,
// // //     textAlign: 'center',
// // //     color: '#2c3e50',
// // //   },
// // //   searchContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     backgroundColor: '#fff',
// // //     borderRadius: 12,
// // //     paddingHorizontal: 15,
// // //     marginBottom: 15,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //   },
// // //   searchInput: {
// // //     flex: 1,
// // //     height: 50,
// // //     fontSize: 16,
// // //     color: '#333',
// // //   },
// // //   searchIndicator: {
// // //     marginLeft: 10,
// // //   },
// // //   searchResultsContainer: {
// // //     backgroundColor: '#fff',
// // //     borderRadius: 12,
// // //     marginTop: -10, // Overlap slightly with search container
// // //     marginBottom: 15,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //     maxHeight: 200, // Limit height to avoid taking too much screen
// // //     overflow: 'hidden',
// // //   },
// // //   searchResultsList: {
// // //     paddingVertical: 5,
// // //   },
// // //   searchResultItem: {
// // //     padding: 15,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#eee',
// // //   },
// // //   searchResultText: {
// // //     fontSize: 16,
// // //     color: '#333',
// // //   },
// // //   card: {
// // //     backgroundColor: '#fff',
// // //     borderRadius: 12,
// // //     padding: 20,
// // //     marginBottom: 20,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     elevation: 3,
// // //   },
// // //   cardTitle: {
// // //     fontSize: 20,
// // //     fontWeight: 'bold',
// // //     marginBottom: 10,
// // //     color: '#2c3e50',
// // //   },
// // //   section: {
// // //     marginBottom: 20,
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 20,
// // //     fontWeight: 'bold',
// // //     marginBottom: 10,
// // //     color: '#2c3e50',
// // //   },
// // //   row: {
// // //     justifyContent: 'space-between',
// // //   },
// // //   itemCard: {
// // //     flex: 1,
// // //     backgroundColor: '#fff',
// // //     borderRadius: 10,
// // //     padding: 15,
// // //     marginHorizontal: 5,
// // //     marginBottom: 10,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 1 },
// // //     shadowOpacity: 0.08,
// // //     shadowRadius: 3,
// // //     elevation: 2,
// // //     minWidth: '45%',
// // //   },
// // //   subDetail: {
// // //     fontSize: 12,
// // //     color: '#666',
// // //     marginTop: 5,
// // //   },
// // //   errorText: {
// // //     color: 'red',
// // //     textAlign: 'center',
// // //     marginBottom: 10,
// // //   },
// // // });
// // // app/customer-details.tsx
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Assuming ThemedText and ThemedView are your custom components.
let ThemedText:any, ThemedView:any;
try {
  ThemedText = require('@/components/ThemedText').ThemedText;
  ThemedView = require('@/components/ThemedView').ThemedView;
} catch (e) {
  console.warn("ThemedText/ThemedView not found, using basic Text/View. Ensure path is correct or provide components.");
  ThemedText = ({ style, children, ...props }: any) => <Text style={style} {...props}>{children}</Text>;
  ThemedView = ({ style, children, ...props }: any) => <View style={style} {...props}>{children}</View>;
}

import { CustomerData, CustomerSearchItem } from '@/src/api/types';
import { appMessageService } from '../src/api/AppMessageService';
import { autopopulateService } from '../src/api/AutopopulateService';
import { customerService } from '../src/api/CustomerService';

export default function CustomerDetailsScreen() {
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<CustomerSearchItem[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSearchResults([]);
        setLoadingSearch(false);
        return;
      }
      setLoadingSearch(true);
      setError(null);
      try {
        const results = await autopopulateService.fetchModuleData('customers', query);
        setSearchResults(results as CustomerSearchItem[]);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to search customers.';
        appMessageService.showError('Search Error', errorMessage);
        setError(errorMessage);
        setSearchResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchText);
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchText, debouncedSearch]);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      if (!selectedCustomerId) {
        setCustomerData(null);
        return;
      }
      setLoadingDetails(true);
      setError(null);
      try {
        const data: CustomerData | null = await customerService.getCustomerDataWithId(selectedCustomerId);
        if (data) {
          setCustomerData(data);
        } else {
          setError('No customer details found.');
          setCustomerData(null);
        }
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to fetch customer details.';
        appMessageService.showError('Fetch Error', errorMessage);
        setError(errorMessage);
        setCustomerData(null);
      } finally {
        setLoadingDetails(false);
      }
    };
    fetchCustomerDetails();
  }, [selectedCustomerId]);

  const handleSelectCustomer = (id: string) => {
    setSelectedCustomerId(id);
    setSearchResults([]);
    setSearchText('');
  };

  const customerInfoRows = customerData ? [
    { label: "Full Name", value: customerData.fullname, type: "defaultSemiBold" },
    { label: "Email", value: customerData.email },
    { label: "Mobile", value: customerData.mobileNumber },
    { label: "Status", value: customerData.status ? customerData.status.charAt(0).toUpperCase() + customerData.status.slice(1) : 'N/A' },
    { label: "Total Purchased", value: `$${customerData.totalPurchasedAmount?.toFixed(2) || '0.00'}` },
    { label: "Remaining Amount", value: `$${customerData.remainingAmount?.toFixed(2) || '0.00'}` },
    ...(customerData.guaranteerId ? [{ label: "Guaranteer ID", value: customerData.guaranteerId }] : [])
  ].filter(row => row.value !== undefined && row.value !== null && row.value !== '') : [];

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollViewContent} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ThemedText type="title" style={styles.headerTitle}>Customer Insights</ThemedText>

        <ThemedView style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers (e.g., name, email)"
            placeholderTextColor="#A0AEC0"
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
          />
          {loadingSearch && <ActivityIndicator size="small" color="#4A90E2" style={styles.searchIndicator} />}
        </ThemedView>

        {searchResults.length > 0 && searchText.length > 0 && (
          <ThemedView style={styles.searchResultsContainer}>
            <FlatList // This FlatList for search results is acceptable if container has maxHeight
              data={searchResults}
              keyExtractor={(item) => item._id}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => handleSelectCustomer(item._id)}
                  style={[
                    styles.searchResultItem,
                    index === searchResults.length - 1 ? styles.searchResultItemLast : {}
                  ]}
                >
                  <ThemedText style={styles.searchResultText}>{item.fullname}</ThemedText>
                  {item.email && <ThemedText style={styles.searchSubText}>Email: {item.email}</ThemedText>}
                  {item.mobileNumber && <ThemedText style={styles.searchSubText}>Mobile: {item.mobileNumber}</ThemedText>}
                </TouchableOpacity>
              )}
              nestedScrollEnabled // Important for independent scroll within bounded container
            />
          </ThemedView>
        )}

        {error && <ThemedText style={styles.errorText}>{error}</ThemedText>}

        {loadingDetails ? (
          <ThemedView style={styles.centeredMessageContainer}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <ThemedText style={styles.centeredMessageText}>Fetching Customer Data...</ThemedText>
          </ThemedView>
        ) : customerData ? (
          <>
            <ThemedView style={styles.card}>
              <ThemedText type="subtitle" style={styles.cardTitle}>🔑 Customer Profile</ThemedText>
              {customerInfoRows.map((row, index) => (
                <ThemedView
                  key={row.label}
                  style={[
                    styles.infoRow,
                    index === customerInfoRows.length - 1 ? styles.infoRowLast : {}
                  ]}
                >
                  <ThemedText style={styles.infoLabel}>{row.label}:</ThemedText>
                  <ThemedText style={styles.infoValue} type={row.type || 'default'}>{row.value}</ThemedText>
                </ThemedView>
              ))}
            </ThemedView>

            {/* --- Cart Items Section (using map) --- */}
            {customerData.cart?.items && customerData.cart.items.length > 0 && (
              <ThemedView style={styles.sectionCard}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>🛒 Cart Items</ThemedText>
                <ThemedView style={styles.mappedItemsContainer}>
                  {customerData.cart.items.map((item) => (
                    <ThemedView key={item._id || item.productId?._id} style={styles.itemCard}>
                      <ThemedText style={styles.itemCardTitle} numberOfLines={1}>{item.productId?.title || 'N/A'}</ThemedText>
                      <ThemedText style={styles.itemCardPrice}>${item.productId?.price?.toFixed(2) || '0.00'}</ThemedText>
                      <ThemedText style={styles.itemCardDescription} numberOfLines={2}>{item.productId?.description || 'No description.'}</ThemedText>
                      {item.invoiceIds && item.invoiceIds.length > 0 && (
                        <ThemedText style={styles.itemCardSubDetailText}>
                          Invoices: {item.invoiceIds.map((inv: { invoiceNumber: any; }) => inv.invoiceNumber).join(', ')}
                        </ThemedText>
                      )}
                    </ThemedView>
                  ))}
                </ThemedView>
              </ThemedView>
            )}

            {/* --- Phone Numbers Section (using map) --- */}
            {customerData.phoneNumbers && customerData.phoneNumbers.length > 0 && (
              <ThemedView style={styles.sectionCard}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>📞 Contact Numbers</ThemedText>
                <ThemedView style={styles.mappedItemsContainer}>
                  {customerData.phoneNumbers.map((item) => (
                    <ThemedView key={item._id || item.number} style={styles.itemCard}>
                      <ThemedText style={styles.itemCardAccentText}>{item.number}</ThemedText>
                      <ThemedText style={styles.itemCardDetailText}>Type: {item.type || 'N/A'}</ThemedText>
                      <ThemedText style={styles.itemCardDetailText}>Primary: {item.primary ? 'Yes' : 'No'}</ThemedText>
                    </ThemedView>
                  ))}
                </ThemedView>
              </ThemedView>
            )}

            {/* --- Addresses Section (using map) --- */}
            {customerData.addresses && customerData.addresses.length > 0 && (
              <ThemedView style={styles.sectionCard}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>🏠 Addresses</ThemedText>
                <ThemedView style={styles.mappedItemsContainer}>
                  {customerData.addresses.map((item) => (
                    <ThemedView key={item._id || `${item.street}-${item.city}`} style={styles.itemCard}>
                      <ThemedText style={styles.itemCardTitleSm}>{item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'Address'}</ThemedText>
                      <ThemedText style={styles.itemCardDetailText} numberOfLines={2}>{item.street || 'N/A'}, {item.city || 'N/A'}</ThemedText>
                      <ThemedText style={styles.itemCardDetailText}>{item.state || 'N/A'} - {item.zipCode || 'N/A'}</ThemedText>
                      <ThemedText style={styles.itemCardSubDetailText}>{item.country || 'N/A'}</ThemedText>
                    </ThemedView>
                  ))}
                </ThemedView>
              </ThemedView>
            )}

            {/* --- Payment History Section (using map) --- */}
            {customerData.paymentHistory && customerData.paymentHistory.length > 0 && (
              <ThemedView style={styles.sectionCard}>
                <ThemedText type="subtitle" style={styles.sectionTitle}>💳 Payment History</ThemedText>
                <ThemedView style={styles.mappedItemsContainer}>
                  {customerData.paymentHistory.map((item) => (
                    <ThemedView key={item._id || item.transactionId} style={styles.itemCard}>
                      <ThemedText style={styles.itemCardPrice}>${item.amount?.toFixed(2) || '0.00'}</ThemedText>
                      <ThemedText 
                        style={[
                          styles.itemCardDetailText, 
                          item.status?.toLowerCase() === 'completed' ? styles.statusCompleted : 
                          item.status?.toLowerCase() === 'pending' ? styles.statusPending : 
                          styles.statusFailed
                        ]}
                      >
                        Status: {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'N/A'}
                      </ThemedText>
                      <ThemedText style={styles.itemCardSubDetailText} numberOfLines={1} ellipsizeMode="tail">ID: {item.transactionId || 'N/A'}</ThemedText>
                      <ThemedText style={styles.itemCardSubDetailText}>Date: {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A'}</ThemedText>
                    </ThemedView>
                  ))}
                </ThemedView>
              </ThemedView>
            )}
          </>
        ) : !loadingDetails && !error && ( 
          <ThemedView style={styles.centeredMessageContainer}>
            <ThemedText style={styles.centeredMessageText}>
              ✨ Please search for a customer to view their details.
            </ThemedText>
          </ThemedView>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA', 
  },
  scrollViewContent: {
    padding: 20, 
    paddingBottom: 40, 
  },
  centeredMessageContainer: { 
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
    padding: 20,
    marginTop: 30,
    backgroundColor: '#FFFFFF',
    borderRadius: 16, 
    shadowColor: '#6B7280',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  centeredMessageText: {
    fontSize: 16,
    color: '#4B5563', 
    textAlign: 'center',
    lineHeight: 24,
  },
  headerTitle: {
    fontSize: 30, 
    fontWeight: 'bold', 
    marginBottom: 28,
    textAlign: 'center',
    color: '#1F2937', 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12, 
    paddingHorizontal: 18,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    marginBottom: 20,
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB', 
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    height: Platform.OS === 'ios' ? undefined : 40,
  },
  searchIndicator: {
    marginLeft: 12,
  },
  searchResultsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    maxHeight: 260, 
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchResultItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6', 
  },
  searchResultItemLast: {
    borderBottomWidth: 0,
  },
  searchResultText: {
    fontSize: 17, 
    color: '#1F2937',
    fontWeight: '500', 
  },
  searchSubText: {
    fontSize: 14,
    color: '#6B7280', 
    marginTop: 5,
  },
  card: { 
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 30,
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardTitle: { 
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#111827',
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start', 
    paddingVertical: 14, 
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB', 
  },
  infoLabel: {
    fontSize: 15,
    color: '#4B5563',
    fontWeight: '500',
    marginRight: 12,
  },
  infoValue: {
    fontSize: 15,
    color: '#1F2937',
    textAlign: 'right',
    flexShrink: 1, 
    fontWeight: '500',
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  sectionCard: { 
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#9CA3AF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600', 
    marginBottom: 18,
    color: '#111827',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  // Style for the container of mapped items (replaces FlatList's columnWrapperStyle)
  mappedItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Allows items to wrap to the next line
    justifyContent: 'space-between', // Distributes space between items in a row
  },
  itemCard: {
    width: '48.5%', // Each card takes up slightly less than half the width to allow for space-between
    backgroundColor: '#F9FAFB', 
    borderRadius: 12,
    padding: 16,
    marginBottom: 16, 
    shadowColor: '#D1D5DB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  itemCardTitle: { 
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  itemCardTitleSm: { 
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  itemCardPrice: {
    fontSize: 15,
    fontWeight: '600',
    color: '#059669', 
    marginBottom: 4,
  },
  itemCardAccentText: { 
    fontSize: 15,
    fontWeight: '600',
    color: '#2563EB', 
    marginBottom: 6,
  },
  itemCardDescription: { 
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 8,
    lineHeight: 18,
  },
  itemCardDetailText: { 
    fontSize: 14,
    color: '#374151',
    marginBottom: 4,
    lineHeight: 20,
  },
  itemCardSubDetailText: { 
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
  },
  statusCompleted: { color: '#059669' }, 
  statusPending: { color: '#D97706' },   
  statusFailed: { color: '#DC2626' },     
  errorText: {
    color: '#C53030',
    textAlign: 'center',
    marginBottom: 20,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#FEE2E2', 
    borderRadius: 10,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#FCA5A5', 
    fontWeight: '500',
  },
});