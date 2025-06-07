

// import { useLocalSearchParams } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import {
//   ActivityIndicator,
//   Image,
//   ScrollView, StyleSheet, Text, View
// } from 'react-native';
// import { customerService } from '../../src/api/CustomerService';

// export default function CustomerDetailScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const [customer, setCustomer] = useState<any | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     if (id) {
//       customerService.getCustomerDataWithId(id)
//         .then(data => setCustomer(data))
//         .catch(console.error)
//         .finally(() => setLoading(false));
//     }
//   }, [id]);

//   if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007bff" />;
//   if (!customer) return <Text style={styles.error}>Customer not found</Text>;

//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.section}>
//         {customer.profileImg ? (
//           <Image source={{ uri: customer.profileImg }} style={styles.profileImg} />
//         ) : null}
//         <Text style={styles.title}>{customer.fullname}</Text>
//         <Text style={styles.label}>Email: {customer.email}</Text>
//         <Text style={styles.label}>Mobile: {customer.mobileNumber}</Text>
//         <Text style={styles.label}>Status: {customer.status}</Text>
//         <Text style={styles.label}>Total Purchased: ₹{customer.totalPurchasedAmount}</Text>
//         <Text style={styles.label}>Remaining Amount: ₹{customer.remainingAmount}</Text>
//       </View>

//       {/* Phone Numbers */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Phone Numbers</Text>
//         {customer.phoneNumbers?.map((phone: any, index: number) => (
//           <Text key={index} style={styles.label}>
//             {phone.type}: {phone.number} {phone.primary ? '(Primary)' : ''}
//           </Text>
//         ))}
//       </View>

//       {/* Addresses */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Addresses</Text>
//         {customer.addresses?.map((addr: any, index: number) => (
//           <Text key={index} style={styles.label}>
//             {addr.type?.toUpperCase()}: {addr.street}, {addr.city}, {addr.state}, {addr.zipCode}, {addr.country}
//           </Text>
//         ))}
//       </View>

//       {/* Cart */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Cart Items</Text>
//         {customer.cart?.items?.map((item: any, index: number) => (
//           <View key={index} style={styles.card}>
//             <Text style={styles.itemTitle}>{item.productId?.title}</Text>
//             <Text style={styles.label}>Description: {item.productId?.description}</Text>
//             <Text style={styles.label}>Price: ₹{item.productId?.price}</Text>
//             {item.invoiceIds?.map((inv: any, i: number) => (
//               <View key={i} style={styles.subCard}>
//                 <Text style={styles.label}>Invoice #{inv.invoiceNumber}</Text>
//                 <Text style={styles.label}>Date: {new Date(inv.invoiceDate).toLocaleDateString()}</Text>
//                 <Text style={styles.label}>Amount: ₹{inv.totalAmount}</Text>
//                 <Text style={styles.label}>Status: {inv.status}</Text>
//               </View>
//             ))}
//           </View>
//         ))}
//       </View>

//       {/* Payment History */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Payment History</Text>
//         {customer.paymentHistory?.map((pay: any, index: number) => (
//           <View key={index} style={styles.card}>
//             <Text style={styles.label}>Transaction ID: {pay.transactionId}</Text>
//             <Text style={styles.label}>Amount: ₹{pay.amount}</Text>
//             <Text style={styles.label}>Status: {pay.status}</Text>
//             <Text style={styles.label}>Date: {new Date(pay.createdAt).toLocaleString()}</Text>
//           </View>
//         ))}
//       </View>

//       {/* Meta + Timestamps */}
//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>System Info</Text>
//         <Text style={styles.label}>Customer ID: {customer._id}</Text>
//         <Text style={styles.label}>Created At: {new Date(customer.createdAt).toLocaleString()}</Text>
//         <Text style={styles.label}>Updated At: {new Date(customer.updatedAt).toLocaleString()}</Text>
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#f5f7fa' },
//   section: {
//     backgroundColor: '#fff',
//     padding: 16,
//     margin: 12,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOpacity: 0.05,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: '700',
//     marginBottom: 8,
//     color: '#222',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginBottom: 8,
//     color: '#333',
//   },
//   label: {
//     fontSize: 15,
//     color: '#555',
//     marginBottom: 4,
//   },
//   error: {
//     fontSize: 18,
//     color: 'red',
//     marginTop: 20,
//     textAlign: 'center',
//   },
//   card: {
//     backgroundColor: '#f1f5f9',
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   subCard: {
//     backgroundColor: '#e9f0f6',
//     padding: 8,
//     borderRadius: 6,
//     marginTop: 6,
//   },
//   itemTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 4,
//   },
//   profileImg: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     alignSelf: 'center',
//     marginBottom: 16,
//   },
// });
import { Feather } from '@expo/vector-icons'; // Using Feather icons for a clean look
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView, StyleSheet, Text, View
} from 'react-native';
import { customerService } from '../../src/api/CustomerService';

// Helper to format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

// Helper to get status color
const getStatusStyle = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'unpaid':
    case 'pending':
      return { backgroundColor: '#FFF5E1', color: '#FF9F43' }; // Orange/Yellow
    case 'active':
    case 'paid':
      return { backgroundColor: '#E5F7F0', color: '#2ECC71' }; // Green
    default:
      return { backgroundColor: '#F0F0F0', color: '#888' }; // Gray
  }
};


export default function CustomerDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [customer, setCustomer] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      customerService.getCustomerDataWithId(id)
        .then(data => {
          setCustomer(data.data)})
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  if (!customer) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Customer not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* --- Profile Header --- */}
      <View style={styles.header}>
        <Image
          source={customer.profileImg ? { uri: customer.profileImg } : require('../../assets/images/v.jpg')} // Fallback to a local default image
          style={styles.profileImg}
        />
        <Text style={styles.fullName}>{customer.fullname}</Text>
        <Text style={styles.email}>{customer.email}</Text>
        <View style={[styles.statusBadge, getStatusStyle(customer.status)]}>
          <Text style={[styles.statusText, getStatusStyle(customer.status)]}>{customer.status}</Text>
        </View>
      </View>

      {/* --- Financial Summary --- */}
      <View style={styles.financialSummary}>
         <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>Total Purchased</Text>
            <Text style={styles.financialValue}>{formatCurrency(customer.totalPurchasedAmount)}</Text>
         </View>
         <View style={styles.financialItem}>
            <Text style={styles.financialLabel}>Remaining Due</Text>
            <Text style={[styles.financialValue, {color: '#E74C3C'}]}>{formatCurrency(customer.remainingAmount)}</Text>
         </View>
      </View>


      {/* --- Contact Info Card --- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Contact Information</Text>
        <View style={styles.infoRow}>
          <Feather name="smartphone" size={18} color="#555" />
          <Text style={styles.infoText}>{customer.mobileNumber}</Text>
        </View>
        {customer.addresses?.map((addr: any) => (
          <View key={addr._id} style={styles.infoRow}>
            <Feather name="map-pin" size={18} color="#555" />
            <Text style={styles.infoText}>
              {`${addr.street}, ${addr.city}, ${addr.state} ${addr.zipCode}`}
            </Text>
          </View>
        ))}
      </View>

      {/* --- Cart & Invoices Card --- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Cart Items & Invoices</Text>
        {customer.cart?.items?.length > 0 ? customer.cart.items.map((item: any) => (
          <View key={item._id} style={styles.listItem}>
            <Text style={styles.itemTitle}>{item.productId?.title}</Text>
            <Text style={styles.itemSubtitle}>Price: {formatCurrency(item.productId?.price)}</Text>
            {item.invoiceIds?.map((inv: any) => (
              <View key={inv._id} style={styles.subListItem}>
                 <View style={styles.subListHeader}>
                    <Text style={styles.invoiceNumber}>Invoice #{inv.invoiceNumber}</Text>
                    <View style={[styles.statusBadge, getStatusStyle(inv.status)]}>
                        <Text style={[styles.statusText, getStatusStyle(inv.status)]}>{inv.status}</Text>
                    </View>
                 </View>
                 <Text style={styles.subListText}>Date: {new Date(inv.invoiceDate).toLocaleDateString()}</Text>
                 <Text style={styles.subListText}>Amount: {formatCurrency(inv.totalAmount)}</Text>
              </View>
            ))}
          </View>
        )) : <Text style={styles.infoText}>No items in cart.</Text>}
      </View>

      {/* --- Payment History Card --- */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Payment History</Text>
        {customer.paymentHistory?.length > 0 ? customer.paymentHistory.map((pay: any) => (
          <View key={pay._id} style={styles.listItem}>
            <View style={styles.subListHeader}>
               <Text style={styles.itemTitle}>Amount: {formatCurrency(pay.amount)}</Text>
               <View style={[styles.statusBadge, getStatusStyle(pay.status)]}>
                 <Text style={[styles.statusText, getStatusStyle(pay.status)]}>{pay.status}</Text>
               </View>
            </View>
            <Text style={styles.itemSubtitle}>Transaction ID: {pay.transactionId}</Text>
            <Text style={styles.itemSubtitle}>Date: {new Date(pay.createdAt).toLocaleString()}</Text>
          </View>
        )) : <Text style={styles.infoText}>No payment history found.</Text>}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // --- Containers & Layout ---
  container: {
    flex: 1,
    backgroundColor: '#F4F7FC',
  },
  contentContainer: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F4F7FC',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#AAB8C2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  // --- Header ---
  header: {
    alignItems: 'center',
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
  },
  profileImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#4A90E2',
    marginBottom: 12,
  },
  fullName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A253C',
  },
  email: {
    fontSize: 16,
    color: '#657786',
    marginBottom: 10,
  },

  // --- Financial ---
  financialSummary: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
      backgroundColor: '#fff',
      padding: 16,
      borderRadius: 12,
  },
  financialItem: {
      alignItems: 'center',
  },
  financialLabel: {
      fontSize: 14,
      color: '#657786',
      marginBottom: 4,
  },
  financialValue: {
      fontSize: 20,
      fontWeight: '700',
      color: '#1A253C',
  },

  // --- Typography & Text ---
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A253C',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#E74C3C',
  },
  infoText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
    flex: 1, // Allow text to wrap
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#7F8C8D',
    marginTop: 2,
  },
  invoiceNumber: {
    fontSize: 15,
    fontWeight: '500',
    color: '#34495E',
  },
  subListText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },

  // --- Row & List Items ---
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  listItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF2F7',
  },
  subListItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  subListHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
  },

  // --- Badges ---
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});