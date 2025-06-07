import { autopopulateService } from '@/src/api/AutopopulateService';
import { useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function CustomerListScreen() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    autopopulateService.fetchModuleData('customers')
      .then((data: any) => {
        setCustomers(data);
        setFiltered(data);
      })
      .catch((error: any) => console.error('Error fetching customers:', error))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    const lowerText = text.toLowerCase();

    const filteredList = customers.filter(customer => {
      const nameMatch = customer.fullname?.toLowerCase().includes(lowerText);
      const emailMatch = customer.email?.toLowerCase().includes(lowerText);
      const mobileMatch = customer.mobileNumber?.includes(lowerText);

      const phoneMatch = customer.phoneNumbers?.some((p: any) =>
        p.number?.includes(lowerText)
      );

      return nameMatch || emailMatch || mobileMatch || phoneMatch;
    });

    setFiltered(filteredList);
  };

  const handlePress = (id: string) => {
    router.push(`/customers/${id}`);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#007bff" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer List</Text>
      <TextInput
        placeholder="Search by name, email or mobile..."
        style={styles.input}
        value={search}
        onChangeText={handleSearch}
      />
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handlePress(item.id)}>
            <Text style={styles.name}>{item.fullname}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.email}>📞 {item.mobileNumber}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f7fa' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: '600', color: '#333' },
  email: { fontSize: 14, color: '#666', marginTop: 2 },
});
