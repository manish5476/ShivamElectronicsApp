// src/api/InvoiceService.ts
import { BaseApiService } from './BaseApiService';

class InvoiceService extends BaseApiService {
  constructor() {
    super();
  }

  public async getAllinvoiceData(filterParams?: any): Promise<any[]> {
    try {
      const params = this.createHttpParams(filterParams);
      const response = await this.http.get<any[]>(`${this.baseUrl}/v1/invoices${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error: any) {
      return this.handleError('getAllInvoiceData', error);
    }
  }

  public async getinvoiceDataWithId(id: string): Promise<any> {
    try {
      const response = await this.http.get<any>(`${this.baseUrl}/v1/invoices/${id}`);
      return response.data;
    } catch (error: any) {
      return this.handleError('getInvoiceDataWithId', error);
    }
  }

  public async createNewinvoice(data: any): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/v1/invoices`, data);
      return response.data;
    } catch (error: any) {
      return this.handleError('createNewInvoice', error);
    }
  }

  public async getProductSales(data: any): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/v1/invoices/productSales`, data);
      return response.data;
    } catch (error: any) {
      return this.handleError('getProductSales', error);
    }
  }

  public async updateinvoice(invoiceId: string, data: any): Promise<any> {
    try {
      const response = await this.http.patch(`${this.baseUrl}/v1/invoices/${invoiceId}`, data);
      return response.data;
    } catch (error: any) {
      return this.handleError('updateInvoice', error);
    }
  }

  public async deleteinvoices(invoiceIds: string[]): Promise<any> {
    try {
      const endpoint = `${this.baseUrl}/v1/invoices/deletemany`;
      const response = await this.http.delete(endpoint, { data: { ids: invoiceIds } });
      return response.data;
    } catch (error: any) {
      return this.handleError('deleteInvoices', error);
    }
  }
}

export const invoiceService = new InvoiceService();