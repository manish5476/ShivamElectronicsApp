// src/api/PaymentService.ts
import { BaseApiService } from './BaseApiService';

class PaymentService extends BaseApiService {
  constructor() {
    super();
  }

  public async getAllpaymentData(filterParams?: any): Promise<any[]> {
    try {
      const params = this.createHttpParams(filterParams);
      const response = await this.http.get<any[]>(`${this.baseUrl}/v1/payments${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error: any) {
      return this.handleError('getAllPaymentData', error);
    }
  }

  public async getpaymentDataWithId(id: string): Promise<any> {
    try {
      const response = await this.http.get<any>(`${this.baseUrl}/v1/payments/${id}`);
      return response.data;
    } catch (error: any) {
      return this.handleError('getPaymentDataWithId', error);
    }
  }

  public async createNewpayment(data: any): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/v1/payments`, data);
      return response.data;
    } catch (error: any) {
      return this.handleError('createNewPayment', error);
    }
  }

  public async updatepayment(paymentId: string, data: any): Promise<any> {
    try {
      const response = await this.http.patch(`${this.baseUrl}/v1/payments/${paymentId}`, data);
      return response.data;
    } catch (error: any) {
      return this.handleError('updatePayment', error);
    }
  }

  public async deletepayments(paymentIds: string[]): Promise<any> {
    try {
      const endpoint = `${this.baseUrl}/v1/payments/deletemany`;
      const response = await this.http.delete(endpoint, { data: { ids: paymentIds } });
      return response.data;
    } catch (error: any) {
      return this.handleError('deletePayments', error);
    }
  }
}

export const paymentService = new PaymentService();