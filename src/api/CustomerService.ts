
import { BaseApiService } from './BaseApiService';
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
      console.log(data)
      const response = await this.http.post(`${this.baseUrl}/v1/customers/`, data);
      console.log(response)
      return response.data;
    } catch (error: any) {
      console.log(error)
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