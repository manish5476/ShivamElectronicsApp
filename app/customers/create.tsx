import { autopopulateService } from '@/src/api/AutopopulateService'; // Import your service
import { customerService } from '@/src/api/CustomerService';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react'; // Import useEffect
import {
  ActivityIndicator,
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

// --- Types ---
interface PhoneNumber {
  number: string;
  type: string;
  primary: boolean;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: string;
  primary: boolean;
}

interface Customer {
  _id?: string; // Add _id for fetched customers
  profileImg: string;
  status: string;
  fullname: string;
  email: string;
  phoneNumbers: PhoneNumber[];
  addresses: Address[];
  guarantorId: string | null;
}

interface RouteParams {
  params?: {
    customer?: Customer;
  };
}

// --- Replicating your color theme ---
const COLORS = {
  primary: '#4F46E5',
  primaryHover: '#4338CA',
  border: '#E5E7EB',
  bgBase: '#F9FAFB',
  textBase: '#1F2937',
  textMuted: '#6B7280',
  error: '#EF4444',
  success: '#10B981',
  white: '#FFFFFF',
  textInverted: '#FFFFFF',
};

// --- Initial Data Structure (for a new customer) ---
const initialCustomerState: Customer = {
  profileImg: '',
  status: 'active',
  fullname: '',
  email: '',
  phoneNumbers: [],
  addresses: [],
  guarantorId: null,
};

// --- Main Screen Component ---
export default function CustomerMasterScreen({ route }: { route: RouteParams }) {
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<Customer>(initialCustomerState);
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [editingPhone, setEditingPhone] = useState<PhoneNumber | null>(null);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [guarantorOptions, setGuarantorOptions] = useState<{ label: string; value: string }[]>([]);
  const [loadingGuarantors, setLoadingGuarantors] = useState(true); // New loading state for guarantors

  // --- Mock Data for Dropdowns (Keep these for now, or replace completely) ---
  const statuses = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Pending', value: 'pending' },
    { label: 'Suspended', value: 'suspended' },
    { label: 'Blocked', value: 'blocked' },
  ];

  const phoneTypes = [{ label: 'Mobile', value: 'mobile' }, { label: 'Home', value: 'home' }, { label: 'Work', value: 'work' }];
  const addressTypes = [{ label: 'Home', value: 'home' }, { label: 'Work', value: 'work' }, { label: 'Billing', value: 'billing' }, { label: 'Shipping', value: 'shipping' }];


  // --- Fetch Guarantor Data on Component Mount ---
  useEffect(() => {
    const fetchGuarantors = async () => {
      try {
        setLoadingGuarantors(true);
        const data: Customer[] = await autopopulateService.fetchModuleData('customers');
        // Map fetched customer data to the format required by RNPickerSelect
        // Exclude the current customer from the guarantor list if editing
        const currentCustomerId = customer._id; // Assuming customer has an _id after fetching/creating
        const options = data
          .filter(cust => cust._id !== currentCustomerId) // Exclude self from guarantor list
          .map(cust => ({
            label: cust.fullname,
            value: cust._id!, // Use _id as the value for Mongoose ObjectId reference
          }));
        setGuarantorOptions(options);
      } catch (error) {
        console.error('Error fetching guarantor data:', error);
        Alert.alert('Error', 'Failed to load guarantor list. Please try again.');
      } finally {
        setLoadingGuarantors(false);
      }
    };

    fetchGuarantors();
  }, [customer._id]); // Re-fetch if the customer ID changes (e.g., when editing an existing customer)


  // --- Handlers ---
  const handleValueChange = (key: keyof Customer, value: any) => {
    setCustomer(prev => ({ ...prev, [key]: value }));
  };

  const handleSavePhone = (newPhone: PhoneNumber) => {
    let updatedPhones;
    if (editingPhone) {
      updatedPhones = customer.phoneNumbers.map(p => p.number === editingPhone.number ? newPhone : p);
    } else {
      updatedPhones = [...customer.phoneNumbers, newPhone];
    }
    handleValueChange('phoneNumbers', updatedPhones);
    setPhoneModalVisible(false);
    setEditingPhone(null);
  };

  const handleDeletePhone = (phoneToDelete: PhoneNumber) => {
    const updatedPhones = customer.phoneNumbers.filter(p => p.number !== phoneToDelete.number);
    handleValueChange('phoneNumbers', updatedPhones);
  };

  const handleSaveAddress = (newAddress: Address) => {
    let updatedAddresses;
    if (editingAddress) {
      updatedAddresses = customer.addresses.map(a =>
        (a.street === editingAddress.street && a.zipCode === editingAddress.zipCode) // Simple identification for editing
          ? newAddress
          : a
      );
    } else {
      updatedAddresses = [...customer.addresses, newAddress];
    }
    // Ensure only one address is primary if a new one is set as primary
    if (newAddress.primary) {
      updatedAddresses = updatedAddresses.map(addr => ({
        ...addr,
        isDefault: (addr === newAddress) ? true : false // Assuming 'isDefault' is 'primary' in your schema
      }));
    }
    handleValueChange('addresses', updatedAddresses);
    setAddressModalVisible(false);
    setEditingAddress(null);
  };

  const handleDeleteAddress = (addressToDelete: Address) => {
    const updatedAddresses = customer.addresses.filter(
      a => !(a.street === addressToDelete.street && a.zipCode === addressToDelete.zipCode)
    );
    handleValueChange('addresses', updatedAddresses);
  };


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      handleValueChange('profileImg', result.assets[0].uri);
    }
  };

  const saveCustomer = async () => {
    // Basic validation
    if (!customer.fullname || !customer.email) {
      Alert.alert('Validation Error', 'Full Name and Email are required.');
      return;
    }

    // Validate phone numbers if no guarantor
    if (!customer.guarantorId && customer.phoneNumbers.length === 0) {
      Alert.alert('Validation Error', 'At least one phone number is required if no guarantor is provided.');
      return;
    }

    // Validate addresses
    if (customer.addresses.length === 0) {
      Alert.alert('Validation Error', 'At least one address is required.');
      return;
    }

    setLoading(true);
    try {
      const response = await customerService.createNewCustomer(customer);
      if (response) {
        Alert.alert('Success', 'Customer created successfully', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error) { 
      console.log(error)
      console.error('Error creating customer:', error);
      Alert.alert('Error', 'Failed to create customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        data={[1]} // Single item since we're using it as a container
        renderItem={() => (
          <>
            {/* --- Profile Image & Status Section --- */}
            <View style={styles.card}>
              <TouchableOpacity style={styles.profileImageContainer} onPress={pickImage}>
                {customer.profileImg ? (
                  <Image source={{ uri: customer.profileImg }} style={styles.profileImage} />
                ) : (
                  <Feather name="user" size={60} color={COLORS.textMuted} />
                )}
              </TouchableOpacity>
              <Text style={styles.label}>Profile Image</Text>
            </View>

            <View style={styles.card}>
              <StyledPicker
                label="Status *"
                value={customer.status}
                onValueChange={(value) => handleValueChange('status', value)}
                items={statuses}
                placeholder={{ label: 'Select status...', value: null }}
              />
              {loadingGuarantors ? (
                <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 10 }} />
              ) : (
                <StyledPicker
                  label="Guarantor"
                  value={customer.guarantorId}
                  onValueChange={(value) => handleValueChange('guarantorId', value)}
                  items={guarantorOptions}
                  placeholder={{ label: 'Select a guarantor...', value: null }}
                />
              )}
            </View>

            {/* --- Personal Information Section --- */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Personal Information</Text>
              <StyledTextInput
                label="Full Name *"
                value={customer.fullname}
                onChangeText={(text: string) => handleValueChange('fullname', text)}
                placeholder="Enter full name"
                error=""
              />
              <StyledTextInput
                label="Email *"
                value={customer.email}
                onChangeText={(text: string) => handleValueChange('email', text)}
                placeholder="Enter email address"
                keyboardType="email-address"
                autoCapitalize="none"
                error=""
              />
            </View>

            {/* --- Phone Numbers Section --- */}
            <View style={styles.card}>
              <View style={styles.listHeader}>
                <Text style={styles.cardTitle}>Phone Numbers</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => { setEditingPhone(null); setPhoneModalVisible(true); }}>
                  <Feather name="plus" size={16} color={COLORS.textInverted} />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={customer.phoneNumbers}
                keyExtractor={(item, index) => `${item.number}-${index}`}
                renderItem={({ item }) => (
                  <View style={styles.listItem}>
                    <View>
                      <Text style={styles.listItemText}>{item.number}</Text>
                      <Text style={styles.listItemSubText}>{item.type}{item.primary ? ' (Primary)' : ''}</Text>
                    </View>
                    <View style={styles.actionsContainer}>
                      <TouchableOpacity onPress={() => { setEditingPhone(item); setPhoneModalVisible(true); }}>
                        <Feather name="edit-2" size={20} color={COLORS.textMuted} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeletePhone(item)}>
                        <Feather name="trash-2" size={20} color={COLORS.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyListText}>No phone numbers added.</Text>}
                scrollEnabled={false}
              />
            </View>

            {/* --- Addresses Section --- */}
            <View style={styles.card}>
              <View style={styles.listHeader}>
                <Text style={styles.cardTitle}>Addresses</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => { setEditingAddress(null); setAddressModalVisible(true); }}>
                  <Feather name="plus" size={16} color={COLORS.textInverted} />
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={customer.addresses}
                keyExtractor={(item, index) => `${item.street}-${item.zipCode}-${index}`}
                renderItem={({ item }) => (
                  <View style={styles.listItem}>
                    <View>
                      <Text style={styles.listItemText}>{item.street}, {item.city}</Text>
                      <Text style={styles.listItemSubText}>{item.state} {item.zipCode}, {item.country} ({item.type})</Text>
                    </View>
                    <View style={styles.actionsContainer}>
                      <TouchableOpacity onPress={() => { setEditingAddress(item); setAddressModalVisible(true); }}>
                        <Feather name="edit-2" size={20} color={COLORS.textMuted} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteAddress(item)}>
                        <Feather name="trash-2" size={20} color={COLORS.error} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyListText}>No addresses added.</Text>}
                scrollEnabled={false}
              />
            </View>
          </>
        )}
      />

      {/* --- Modals --- */}
      <PhoneFormModal
        visible={phoneModalVisible}
        onClose={() => setPhoneModalVisible(false)}
        onSave={handleSavePhone}
        phoneData={editingPhone}
        phoneTypes={phoneTypes}
      />

      <AddressFormModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onSave={handleSaveAddress}
        addressData={editingAddress}
        addressTypes={addressTypes}
      />

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveCustomer}>
          <Text style={styles.saveButtonText}>Save Customer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- Reusable Form Components (No changes here unless requested) ---

interface StyledTextInputProps {
  label: string;
  error?: string;
  [key: string]: any;
}

const StyledTextInput = ({ label, error, ...props }: StyledTextInputProps) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} placeholderTextColor={COLORS.textMuted} {...props} />
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

interface StyledPickerProps {
  label: string;
  items: Array<{ label: string; value: string }>;
  onValueChange: (value: string) => void;
  value: string | null;
  placeholder: { label: string; value: null };
}

const StyledPicker = ({ label, items, onValueChange, value, placeholder }: StyledPickerProps) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <RNPickerSelect
      onValueChange={onValueChange}
      items={items}
      value={value}
      style={pickerSelectStyles}
      placeholder={placeholder}
      useNativeAndroidPickerStyle={false}
      Icon={() => <Feather name="chevron-down" size={20} color={COLORS.textMuted} />}
    />
  </View>
);


// --- Modal for Adding/Editing Phone Numbers (No changes here unless requested) ---
interface PhoneFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (phone: PhoneNumber) => void;
  phoneData: PhoneNumber | null;
  phoneTypes: Array<{ label: string; value: string }>;
}

const PhoneFormModal = ({ visible, onClose, onSave, phoneData, phoneTypes }: PhoneFormModalProps) => {
  const [phone, setPhone] = useState<PhoneNumber>({ number: '', type: 'mobile', primary: false });

  React.useEffect(() => {
    if (phoneData) {
      setPhone(phoneData);
    } else {
      setPhone({ number: '', type: 'mobile', primary: false }); // Reset when adding new
    }
  }, [phoneData, visible]); // Depend on visible to reset when opening for new

  const handleSave = () => {
    if (!phone.number || !phone.type) {
      Alert.alert('Error', 'Number and Type are required.');
      return;
    }
    onSave(phone);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{phoneData ? 'Edit' : 'Add'} Phone Number</Text>
          <StyledTextInput
            label="Phone Number *"
            value={phone.number}
            onChangeText={(text: string) => setPhone(p => ({ ...p, number: text }))}
            keyboardType="phone-pad"
            error=""
          />
          <StyledPicker
            label="Phone Type *"
            value={phone.type}
            onValueChange={(value: string) => setPhone(p => ({ ...p, type: value }))}
            items={phoneTypes}
            placeholder={{ label: 'Select phone type...', value: null }}
          />
          <View style={styles.modalActions}>
            <Button title="Cancel" onPress={onClose} color={COLORS.textMuted} />
            <Button title={phoneData ? "Update" : "Add"} onPress={handleSave} color={COLORS.primary} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

// --- New: Modal for Adding/Editing Addresses ---
interface AddressFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (address: Address) => void;
  addressData: Address | null;
  addressTypes: Array<{ label: string; value: string }>;
}

const AddressFormModal = ({ visible, onClose, onSave, addressData, addressTypes }: AddressFormModalProps) => {
  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India', // Default country
    type: 'home',     // Default type
    primary: false,
  });

  React.useEffect(() => {
    if (addressData) {
      setAddress(addressData);
    } else {
      setAddress({
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
        type: 'home',
        primary: false,
      }); // Reset when adding new
    }
  }, [addressData, visible]);

  const handleSave = () => {
    if (!address.street || !address.city || !address.state || !address.zipCode || !address.country || !address.type) {
      Alert.alert('Error', 'All address fields are required.');
      return;
    }
    onSave(address);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{addressData ? 'Edit' : 'Add'} Address</Text>
          <StyledTextInput
            label="Street *"
            value={address.street}
            onChangeText={(text: string) => setAddress(a => ({ ...a, street: text }))}
            placeholder="Enter street address"
          />
          <StyledTextInput
            label="City *"
            value={address.city}
            onChangeText={(text: string) => setAddress(a => ({ ...a, city: text }))}
            placeholder="Enter city"
          />
          <StyledTextInput
            label="State *"
            value={address.state}
            onChangeText={(text: string) => setAddress(a => ({ ...a, state: text }))}
            placeholder="Enter state"
          />
          <StyledTextInput
            label="ZIP Code *"
            value={address.zipCode}
            onChangeText={(text: string) => setAddress(a => ({ ...a, zipCode: text }))}
            placeholder="Enter ZIP code"
            keyboardType="numeric"
          />
          <StyledTextInput
            label="Country *"
            value={address.country}
            onChangeText={(text: string) => setAddress(a => ({ ...a, country: text }))}
            placeholder="Enter country"
          />
          <StyledPicker
            label="Address Type *"
            value={address.type}
            onValueChange={(value: string) => setAddress(a => ({ ...a, type: value }))}
            items={addressTypes}
            placeholder={{ label: 'Select address type...', value: null }}
          />
          {/* You might want a toggle for 'primary' address here */}
          <View style={styles.modalActions}>
            <Button title="Cancel" onPress={onClose} color={COLORS.textMuted} />
            <Button title={addressData ? "Update" : "Add"} onPress={handleSave} color={COLORS.primary} />
          </View>
        </View>
      </View>
    </Modal>
  );
};


// --- Styles (No changes here unless requested) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgBase,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 100, // Space for the save button
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.textBase,
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bgBase,
    alignSelf: 'center',
    marginBottom: 8,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.textMuted,
    marginBottom: 8,
    // alignSelf: 'center' // Removed as it aligns labels for text inputs oddly
  },
  input: {
    backgroundColor: COLORS.bgBase,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: COLORS.textBase,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    color: COLORS.textInverted,
    marginLeft: 4,
    fontWeight: '600',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listItemText: {
    fontSize: 16,
    color: COLORS.textBase,
  },
  listItemSubText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  emptyListText: {
    textAlign: 'center',
    color: COLORS.textMuted,
    padding: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: COLORS.border,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.textInverted,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    color: COLORS.textBase,
    paddingRight: 30, // to ensure the text is never behind the icon
    backgroundColor: COLORS.bgBase,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    color: COLORS.textBase,
    paddingRight: 30,
    backgroundColor: COLORS.bgBase,
  },
  iconContainer: {
    top: 15,
    right: 15,
  },
});
// import { router } from 'expo-router';
// import React, { useState } from 'react';
// import {
//   ActivityIndicator,
//   Alert,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import { customerService } from '../../src/api/CustomerService';

// interface FormData {
//   fullname: string;
//   email: string;
//   mobileNumber: string;
//   street: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
// }

// export default function CreateCustomerScreen() {
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState<FormData>({
//     fullname: '',
//     email: '',
//     mobileNumber: '',
//     street: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: 'India',
//   });

//   const validateForm = () => {
//     if (!formData.fullname.trim()) {
//       Alert.alert('Error', 'Please enter full name');
//       return false;
//     }
//     if (!formData.email.trim()) {
//       Alert.alert('Error', 'Please enter email');
//       return false;
//     }
//     if (!formData.mobileNumber.trim()) {
//       Alert.alert('Error', 'Please enter mobile number');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async () => {
//     if (!validateForm()) return;

//     setLoading(true);
//     try {
//       const customerData = {
//         fullname: formData.fullname,
//         email: formData.email,
//         mobileNumber: formData.mobileNumber,
//         addresses: [{
//           street: formData.street,
//           city: formData.city,
//           state: formData.state,
//           zipCode: formData.zipCode,
//           country: formData.country,
//           type: 'home',
//           primary: true,
//         }],
//         status: 'active',
//         totalPurchasedAmount: 0,
//         remainingAmount: 0,
//       };

//       const response = await customerService.createNewCustomer(customerData);
//       if (response) {
//         Alert.alert('Success', 'Customer created successfully', [
//           { text: 'OK', onPress: () => router.back() }
//         ]);
//       }
//     } catch (error) {
//       console.error('Error creating customer:', error);
//       Alert.alert('Error', 'Failed to create customer. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//     >
//       <ScrollView style={styles.scrollView}>
//         <View style={styles.formContainer}>
//           <Text style={styles.title}>Create New Customer</Text>

//           {/* Personal Information */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Personal Information</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Full Name *"
//               value={formData.fullname}
//               onChangeText={(text) => setFormData({ ...formData, fullname: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Email *"
//               keyboardType="email-address"
//               autoCapitalize="none"
//               value={formData.email}
//               onChangeText={(text) => setFormData({ ...formData, email: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Mobile Number *"
//               keyboardType="phone-pad"
//               value={formData.mobileNumber}
//               onChangeText={(text) => setFormData({ ...formData, mobileNumber: text })}
//             />
//           </View>

//           {/* Address Information */}
//           <View style={styles.section}>
//             <Text style={styles.sectionTitle}>Address Information</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Street Address"
//               value={formData.street}
//               onChangeText={(text) => setFormData({ ...formData, street: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="City"
//               value={formData.city}
//               onChangeText={(text) => setFormData({ ...formData, city: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="State"
//               value={formData.state}
//               onChangeText={(text) => setFormData({ ...formData, state: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="ZIP Code"
//               keyboardType="numeric"
//               value={formData.zipCode}
//               onChangeText={(text) => setFormData({ ...formData, zipCode: text })}
//             />
//           </View>

//           <TouchableOpacity
//             style={[styles.button, loading && styles.buttonDisabled]}
//             onPress={handleSubmit}
//             disabled={loading}
//           >
//             {loading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.buttonText}>Create Customer</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f7fa',
//   },
//   scrollView: {
//     flex: 1,
//   },
//   formContainer: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   section: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 15,
//   },
//   input: {
//     backgroundColor: '#f8f9fa',
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//     fontSize: 16,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   button: {
//     backgroundColor: '#4F46E5',
//     borderRadius: 8,
//     padding: 15,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   buttonDisabled: {
//     backgroundColor: '#A5B4FC',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '600',
//   },
// });