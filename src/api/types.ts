// src/api/CustomerService.ts (Updated with Interfaces)

// --- Interfaces for Customer Service Responses ---

// For customer detail data (returned by getCustomerDataWithId)
export interface ProductDetails {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  finalPrice: number | null;
  id: string;
}

export interface InvoiceDetails {
  _id: string;
  invoiceNumber: string;
  invoiceDate: string;
  totalAmount: number;
  status: string;
  sellerDetails: any; // Consider specific types here if possible
  buyerDetails: any; // Consider specific types here if possible
  itemDetails: any[]; // Consider specific types here if possible
  id: string;
}

export interface CartItem {
  productId: ProductDetails;
  invoiceIds: InvoiceDetails[];
  _id: string;
}

export interface PhoneNumber {
  number: string;
  type: string;
  primary: boolean;
  _id: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  type: string;
  isDefault: boolean;
  _id: string;
}

export interface PaymentHistoryItem {
  _id: string;
  amount: number;
  status: string;
  transactionId: string;
  createdAt: string;
  // Assuming these fields based on common payment history
  // Add other fields from your actual API if available
}

// This is the core data structure for a single customer's details
export interface CustomerData {
  cart?: { // Make cart optional as it might be empty or missing
    items: CartItem[];
  };
  _id: string;
  status: string;
  profileImg: string;
  email: string;
  fullname: string;
  mobileNumber: string;
  phoneNumbers: PhoneNumber[];
  addresses: Address[];
  guaranteerId?: string; // Optional field
  totalPurchasedAmount?: number; // Optional/nullable based on API
  remainingAmount?: number; // Optional/nullable based on API
  paymentHistory?: PaymentHistoryItem[]; // Optional field
  metadata?: {}; // Optional field
  createdAt: string;
  updatedAt: string;
  __v?: number; // Optional Mongoose version key
  id?: string; // Often an alias for _id
}

// For the customer dropdown (returned by getCustomerDropDown)
export interface CustomerDropdownItem {
  _id: string;
  fullname: string;
  // Add other relevant fields if the dropdown returns them, e.g., email
}

// No explicit ApiResponse wrapper for getCustomerDataWithId, as it returns data directly
// No explicit ApiResponse wrapper for getCustomerDropDown, as it returns data[] directly

// --- End Interfaces ---

// src/api/types.ts

// ... (existing ProductDetails, InvoiceDetails, CartItem, PhoneNumber, Address, PaymentHistoryItem interfaces)

// Core Customer Data structure
export interface CustomerData {
  cart?: {
    items: CartItem[];
  };
  _id: string;
  status: string;
  profileImg: string;
  email: string;
  fullname: string;
  mobileNumber: string;
  phoneNumbers: PhoneNumber[];
  addresses: Address[];
  guaranteerId?: string;
  totalPurchasedAmount?: number;
  remainingAmount?: number;
  paymentHistory?: PaymentHistoryItem[];
  metadata?: {};
  createdAt: string;
  updatedAt: string;
  __v?: number;
  id?: string;
}

// For customer dropdown (CustomerDashboardScreen) and search autocomplete (CustomerDetailsScreen)
export interface CustomerDropdownItem { // Used for Picker on Dashboard
  _id: string;
  fullname: string;
}

export interface CustomerSearchItem { // Used for search results on Details Screen
  _id: string;
  fullname: string;
  mobileNumber?: string; // Added for search display
  email?: string;       // Added for search display
}