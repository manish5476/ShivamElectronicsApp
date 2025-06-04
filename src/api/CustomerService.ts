// // src/api/CustomerService.ts (Updated with Interfaces)
// import { BaseApiService } from './BaseApiService';

// // --- Interfaces for Customer Service Responses ---

// // For customer detail data (returned by getCustomerDataWithId)
// export interface ProductDetails {
//   _id: string;
//   title: string;
//   description: string;
//   thumbnail: string;
//   price: number;
//   finalPrice: number | null;
//   id: string;
// }

// export interface InvoiceDetails {
//   _id: string;
//   invoiceNumber: string;
//   invoiceDate: string;
//   totalAmount: number;
//   status: string;
//   sellerDetails: any; // Consider specific types here if possible
//   buyerDetails: any; // Consider specific types here if possible
//   itemDetails: any[]; // Consider specific types here if possible
//   id: string;
// }

// export interface CartItem {
//   productId: ProductDetails;
//   invoiceIds: InvoiceDetails[];
//   _id: string;
// }

// export interface PhoneNumber {
//   number: string;
//   type: string;
//   primary: boolean;
//   _id: string;
// }

// export interface Address {
//   street: string;
//   city: string;
//   state: string;
//   zipCode: string;
//   country: string;
//   type: string;
//   isDefault: boolean;
//   _id: string;
// }

// export interface PaymentHistoryItem {
//   _id: string;
//   amount: number;
//   status: string;
//   transactionId: string;
//   createdAt: string;
//   // Assuming these fields based on common payment history
//   // Add other fields from your actual API if available
// }

// // This is the core data structure for a single customer's details
// export interface CustomerData {
//   cart?: { // Make cart optional as it might be empty or missing
//     items: CartItem[];
//   };
//   _id: string;
//   status: string;
//   profileImg: string;
//   email: string;
//   fullname: string;
//   mobileNumber: string;
//   phoneNumbers: PhoneNumber[];
//   addresses: Address[];
//   guaranteerId?: string; // Optional field
//   totalPurchasedAmount?: number; // Optional/nullable based on API
//   remainingAmount?: number; // Optional/nullable based on API
//   paymentHistory?: PaymentHistoryItem[]; // Optional field
//   metadata?: {}; // Optional field
//   createdAt: string;
//   updatedAt: string;
//   __v?: number; // Optional Mongoose version key
//   id?: string; // Often an alias for _id
// }

// // For the customer dropdown (returned by getCustomerDropDown)
// export interface CustomerDropdownItem {
//   _id: string;
//   fullname: string;
//   // Add other relevant fields if the dropdown returns them, e.g., email
// }

// // No explicit ApiResponse wrapper for getCustomerDataWithId, as it returns data directly
// // No explicit ApiResponse wrapper for getCustomerDropDown, as it returns data[] directly

// // --- End Interfaces ---


// class CustomerService extends BaseApiService {
//   constructor() {
//     super(); // Call the constructor of BaseApiService
//   }

//   // Helper method to create URL search params
//   protected createHttpParams(filterParams: any): string {
//     if (!filterParams) return '';
//     const params = new URLSearchParams();
//     for (const key in filterParams) {
//       if (filterParams.hasOwnProperty(key) && filterParams[key] !== undefined && filterParams[key] !== null) {
//         params.append(key, filterParams[key].toString());
//       }
//     }
//     return params.toString();
//   }

//   public async getAllCustomerData(filterParams?: any): Promise<CustomerData[]> { // Added CustomerData[] type
//     try {
//       const params = this.createHttpParams(filterParams);
//       const response = await this.http.get<CustomerData[]>(`${this.baseUrl}/v1/customers${params ? `?${params}` : ''}`);
//       return response.data;
//     } catch (error: any) {
//       // Use handleError, which should ideally return a specific error type or throw, not 'any'
//       this.handleError('getAllCustomerData', error);
//       return []; // Return empty array on error to match Promise<CustomerData[]>
//     }
//   }

//   public async uploadProfileImage(formData: FormData, customerId: string): Promise<any> {
//     try {
//       const apiUrl = `${this.baseUrl}/v1/image/postImages`; // Verify if customerId is needed in URL
//       const response = await this.http.post(apiUrl, formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data', // Axios handles this well with FormData
//         },
//       });
//       return response.data;
//     } catch (error: any) {
//       console.error('Upload Error:', error);
//       this.handleError('uploadProfileImage', error);
//       throw error; // Propagate error
//     }
//   }

//   // Changed return type to CustomerData | null
//   public async getCustomerDataWithId(id: string): Promise<CustomerData | null> {
//     try {
//       const response = await this.http.get<CustomerData>(`${this.baseUrl}/v1/customers/${id}`);
//       // Assuming your API returns CustomerData directly as response.data for this endpoint
//       // If it's wrapped like {status, statusCode, data: CustomerData}, it should be response.data.data
//       return response.data;
//     } catch (error: any) {
//       this.handleError('getCustomerDataWithId', error);
//       return null; // Return null on error
//     }
//   }

//   public async createNewCustomer(data: CustomerData): Promise<CustomerData | null> { // Added type
//     try {
//       const response = await this.http.post<CustomerData>(`${this.baseUrl}/v1/customers/`, data);
//       return response.data;
//     } catch (error: any) {
//       this.handleError('createNewCustomer', error);
//       return null;
//     }
//   }

//   public async updateCustomer(customerId: string, data: Partial<CustomerData>): Promise<CustomerData | null> { // Added type, Partial for updates
//     try {
//       const response = await this.http.patch<CustomerData>(`${this.baseUrl}/v1/customers/${customerId}`, data);
//       return response.data;
//     } catch (error: any) {
//       this.handleError('updateCustomer', error);
//       return null;
//     }
//   }

//   /**
//    * @deprecated Potentially incorrect implementation. Use deleteCustomers method instead.
//    */
//   public async deleteCustomerID(customerIds: string[]): Promise<any> { // This method's return type is less critical due to deprecation
//     console.warn('deleteCustomerID is deprecated and likely uses an incorrect API pattern. Prefer deleteCustomers.');
//     try {
//       const endpoint = `${this.baseUrl}/v1/customers/${customerIds.join(',')}`;
//       const response = await this.http.delete(endpoint);
//       return response.data;
//     } catch (error: any) {
//       this.handleError('deleteCustomerID_DEPRECATED', error);
//       throw error;
//     }
//   }

//   public async deleteCustomers(customerIds: string[]): Promise<any> { // This method's return type depends on API
//     try {
//       const endpoint = `${this.baseUrl}/v1/customers/deletemany`;
//       const response = await this.http.delete(endpoint, { data: { ids: customerIds } });
//       return response.data;
//     } catch (error: any) {
//       this.handleError('deleteCustomers', error);
//       throw error;
//     }
//   }

//   // Changed return type to CustomerDropdownItem[]
//   public async getCustomerDropDown(): Promise<CustomerDropdownItem[]> {
//     try {
//       const response = await this.http.get<CustomerDropdownItem[]>(`${this.baseUrl}/v1/customers/customerDropDown`);
//       return response.data;
//     } catch (error: any) {
//       this.handleError('getCustomerDropDown', error);
//       return []; // Return empty array on error
//     }
//   }
// }

// export const customerService = new CustomerService();
// // // src/api/CustomerService.ts
// // import { BaseApiService } from './BaseApiService';

// // class CustomerService extends BaseApiService {
// //   constructor() {
// //     super(); // Call the constructor of BaseApiService
// //   }

// //   public async getAllCustomerData(filterParams?: any): Promise<any[]> {
// //     try {
// //       const params = this.createHttpParams(filterParams);
// //       const response = await this.http.get<any[]>(`${this.baseUrl}/v1/customers${params ? `?${params}` : ''}`);
// //       return response.data;
// //     } catch (error: any) {
// //       return this.handleError('getAllCustomerData', error);
// //     }
// //   }

// //   public async uploadProfileImage(formData: FormData, customerId: string): Promise<any> {
// //     try {
// //       const apiUrl = `${this.baseUrl}/v1/image/postImages`; // Verify if customerId is needed in URL
// //       const response = await this.http.post(apiUrl, formData, {
// //         headers: {
// //           'Content-Type': 'multipart/form-data', // Axios handles this well with FormData
// //         },
// //       });
// //       return response.data;
// //     } catch (error: any) {
// //       console.error('Upload Error:', error);
// //       return this.handleError('uploadProfileImage', error);
// //     }
// //   }

// //   public async getCustomerDataWithId(id: string): Promise<any> {
// //     try {
// //       const response = await this.http.get<any>(`${this.baseUrl}/v1/customers/${id}`);
// //       return response.data;
// //     } catch (error: any) {
// //       return this.handleError('getCustomerDataWithId', error);
// //     }
// //   }

// //   public async createNewCustomer(data: any): Promise<any> {
// //     try {
// //       const response = await this.http.post(`${this.baseUrl}/v1/customers/`, data);
// //       return response.data;
// //     } catch (error: any) {
// //       return this.handleError('createNewCustomer', error);
// //     }
// //   }

// //   public async updateCustomer(customerId: string, data: any): Promise<any> {
// //     try {
// //       const response = await this.http.patch(`${this.baseUrl}/v1/customers/${customerId}`, data);
// //       return response.data;
// //     } catch (error: any) {
// //       return this.handleError('updateCustomer', error);
// //     }
// //   }

// //   /**
// //    * @deprecated Potentially incorrect implementation. Use deleteCustomers method instead.
// //    */
// //   public async deleteCustomerID(customerIds: string[]): Promise<any> {
// //     console.warn('deleteCustomerID is deprecated and likely uses an incorrect API pattern. Prefer deleteCustomers.');
// //     try {
// //       // This endpoint format is unusual - double-check backend implementation
// //       const endpoint = `${this.baseUrl}/v1/customers/${customerIds.join(',')}`;
// //       const response = await this.http.delete(endpoint);
// //       return response.data;
// //     } catch (error: any) {
// //       return this.handleError('deleteCustomerID_DEPRECATED', error);
// //     }
// //   }

// //   public async deleteCustomers(customerIds: string[]): Promise<any> {
// //     try {
// //       const endpoint = `${this.baseUrl}/v1/customers/deletemany`;
// //       // For DELETE requests with a body, Axios uses the 'data' property in the config object
// //       const response = await this.http.delete(endpoint, { data: { ids: customerIds } });
// //       return response.data;
// //     } catch (error: any) {
// //       return this.handleError('deleteCustomers', error);
// //     }
// //   }

// //   public async getCustomerDropDown(): Promise<any[]> {
// //     try {
// //       const response = await this.http.get<any[]>(`${this.baseUrl}/v1/customers/customerDropDown`);
// //       return response.data;
// //     } catch (error: any) {
// //       return this.handleError('getCustomerDropDown', error);
// //     }
// //   }
// // }

// // export const customerService = new CustomerService();

// src/api/CustomerService.ts
import { BaseApiService } from './BaseApiService';

// IMPORTANT: The specific data interfaces (CustomerData, CustomerDropdownItem, etc.)
// are assumed to be defined in a separate file like 'src/api/types.ts'
// and are not explicitly used in the return types here, as per your request for 'any'.

class CustomerService extends BaseApiService {
  constructor() {
    super(); // Call the constructor of BaseApiService
  }

  // NOTE: This method assumes `this.createHttpParams` is defined in `BaseApiService`.
  public async getAllCustomerData(filterParams?: any): Promise<any[]> {
    try {
      const params = this.createHttpParams(filterParams);
      const response = await this.http.get<any[]>(`${this.baseUrl}/v1/customers${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error: any) {
      return this.handleError('getAllCustomerData', error);
    }
  }

  public async uploadProfileImage(formData: FormData, customerId: string): Promise<any> {
    try {
      const apiUrl = `${this.baseUrl}/v1/image/postImages`; // Verify if customerId is needed in URL
      const response = await this.http.post(apiUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Axios handles this well with FormData
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Upload Error:', error);
      return this.handleError('uploadProfileImage', error);
    }
  }

  public async getCustomerDataWithId(id: string): Promise<any> {
    try {
      const response = await this.http.get<any>(`${this.baseUrl}/v1/customers/${id}`);
      return response.data;
    } catch (error: any) {
      return this.handleError('getCustomerDataWithId', error);
    }
  }

  public async createNewCustomer(data: any): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/v1/customers/`, data);
      return response.data;
    } catch (error: any) {
      return this.handleError('createNewCustomer', error);
    }
  }

  public async updateCustomer(customerId: string, data: any): Promise<any> {
    try {
      const response = await this.http.patch(`${this.baseUrl}/v1/customers/${customerId}`, data);
      return response.data;
    } catch (error: any) {
      return this.handleError('updateCustomer', error);
    }
  }

  /**
   * @deprecated Potentially incorrect implementation. Use deleteCustomers method instead.
   */
  public async deleteCustomerID(customerIds: string[]): Promise<any> {
    console.warn('deleteCustomerID is deprecated and likely uses an incorrect API pattern. Prefer deleteCustomers.');
    try {
      // This endpoint format is unusual - double-check backend implementation
      const endpoint = `${this.baseUrl}/v1/customers/${customerIds.join(',')}`;
      const response = await this.http.delete(endpoint);
      return response.data;
    } catch (error: any) {
      return this.handleError('deleteCustomerID_DEPRECATED', error);
    }
  }

  public async deleteCustomers(customerIds: string[]): Promise<any> {
    try {
      const endpoint = `${this.baseUrl}/v1/customers/deletemany`;
      // For DELETE requests with a body, Axios uses the 'data' property in the config object
      const response = await this.http.delete(endpoint, { data: { ids: customerIds } });
      return response.data;
    } catch (error: any) {
      return this.handleError('deleteCustomers', error);
    }
  }

  public async getCustomerDropDown(): Promise<any[]> {
    try {
      const response = await this.http.get<any[]>(`${this.baseUrl}/v1/customers/customerDropDown`);
      return response.data;
    } catch (error: any) {
      return this.handleError('getCustomerDropDown', error);
    }
  }
}

export const customerService = new CustomerService();