// src/api/ProductService.ts
import { BaseApiService } from './BaseApiService';

class ProductService extends BaseApiService {
  constructor() {
    super();
  }

  public async getAutopopulateData(): Promise<any> {
    try {
      const response = await this.http.get(`${this.baseUrl}/v1/products/autopopulate`);
      return response.data;
    } catch (error: any) {
      return this.handleError('getAutopopulateData', error);
    }
  }

  public async getAllProductData(filterParams?: any): Promise<any[]> {
    try {
      const params = this.createHttpParams(filterParams);
      const response = await this.http.get<any[]>(`${this.baseUrl}/v1/products${params ? `?${params}` : ''}`);
      return response.data;
    } catch (error: any) {
      return this.handleError('getAllProductData', error);
    }
  }

  public async getProductDataWithId(id: string): Promise<any> {
    try {
      const response = await this.http.get<any>(`${this.baseUrl}/v1/products/${id}`);
      return response.data;
    } catch (error: any) {
      return this.handleError('getProductDataWithId', error);
    }
  }

  public async createNewProduct(data: any): Promise<any> {
    try {
      const response = await this.http.post(`${this.baseUrl}/v1/products`, data);
      return response.data;
    } catch (error: any) {
      return this.handleError('createNewProduct', error);
    }
  }

  public async updateProduct(productId: string, data: any): Promise<any> {
    try {
      const response = await this.http.patch(`${this.baseUrl}/v1/products/${productId}`, data);
      return response.data;
    } catch (error: any) {
      return this.handleError('updateProduct', error);
    }
  }

  public async deleteSingleProduct(id: string): Promise<any> {
    try {
      const endpoint = `${this.baseUrl}/v1/products/${id}`;
      const response = await this.http.delete(endpoint);
      return response.data;
    } catch (error: any) {
      return this.handleError('deleteSingleProduct', error);
    }
  }

  public async deleteProduct(productIds: string[]): Promise<any> {
    try {
      const endpoint = `${this.baseUrl}/v1/products/deletemany`;
      const response = await this.http.delete(endpoint, { data: { ids: productIds } });
      return response.data;
    } catch (error: any) {
      return this.handleError('deleteProduct', error);
    }
  }
}

export const productService = new ProductService();