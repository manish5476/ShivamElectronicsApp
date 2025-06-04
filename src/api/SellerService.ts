// src/api/SellerService.ts
import { BaseApiService } from './BaseApiService';

class SellerService extends BaseApiService {
  constructor() {
    super();
  }

  public async getSellerDataWithId(id: string): Promise<any> {
    try {
      const response = await this.http.get<any>(`${this.baseUrl}/v1/sellers/${id}`);
      return response.data;
    } catch (error: any) {
      return this.handleError('getSellerDataWithId', error);
    }
  }

  public async createNewSeller(data: any): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/v1/sellers/`, data);
      return response.data;
    } catch (error: any) {
      return this.handleError('createNewSeller', error);
    }
  }

  public async getAllSellersdata(filterParams?: any): Promise<any[]> {
    try {
      const params = this.createHttpParams(filterParams);
      const response = await this.http.get<any[]>(`${this.baseUrl}/v1/sellers${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error: any) {
      return this.handleError('getAllSellersdata', error);
    }
  }

  public async updateSellersdata(sellersId: string, data: any): Promise<any> {
    try {
      const response = await this.http.patch(`${this.baseUrl}/v1/sellers/${sellersId}`, data);
      return response.data;
    } catch (error: any) {
      return this.handleError('updateSellersdata', error);
    }
  }
}

export const sellerService = new SellerService();