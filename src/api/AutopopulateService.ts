// src/api/AutopopulateService.ts

import { appMessageService } from './AppMessageService'; // Adjust path as needed
import { BaseApiService } from './BaseApiService'; // Adjust path as needed

// --- Interfaces for API Responses ---
// Assuming all master-list endpoints return { data: any[] }
interface AutopopulateResponse<T> {
  data: T[];
  status: string;
  statusCode: number;
}

export interface Customer {
  id: string;
  label: string;
  fullname: string;
  email: string;
  cart: {
    items: any[];
  };
}

type AutopopulateModuleData = any;

class AutopopulateService extends BaseApiService {
 public masterCache: Map<string, AutopopulateModuleData[]> = new Map();
  public pendingFetches: Map<string, Promise<AutopopulateModuleData[]>> = new Map();

  constructor() {
    super();
  }

  /**
   * Fetches data for a specific module, using cache if available.
   * If data is being fetched, it returns the existing promise.
   *
   * @param {string} module The name of the module (e.g., 'products', 'customers').
   * @returns {Promise<AutopopulateModuleData[]>} A promise that resolves with the module's data.
   */
  public async getModuleData(module: string): Promise<AutopopulateModuleData[]> {
    const key = module.toLowerCase();

    // 1. Check if data is already in cache
    if (this.masterCache.has(key)) {
      return this.masterCache.get(key)!; // Use ! because we checked .has()
    }

    // 2. Check if there's a pending fetch for this module
    if (this.pendingFetches.has(key)) {
      return this.pendingFetches.get(key)!;
    }

    // 3. No cache, no pending fetch - initiate new fetch
    const fetchPromise = this.fetchModuleData(key);
    this.pendingFetches.set(key, fetchPromise); // Store the promise

    try {
      const data = await fetchPromise;
      this.masterCache.set(key, data); // Cache the data after successful fetch
      return data;
    } catch (error) {
      // Error handling already in fetchModuleData, just rethrow or return empty
      return [];
    } finally {
      this.pendingFetches.delete(key); // Remove pending fetch regardless of outcome
    }
  }

  /**
   * Manually refreshes data for a specific module, bypassing the cache.
   *
   * @param {string} module The name of the module.
   * @returns {Promise<AutopopulateModuleData[]>} A promise that resolves with the refreshed data.
   */
  public async refreshModuleData(module: string): Promise<AutopopulateModuleData[]> {
    const key = module.toLowerCase();
    this.masterCache.delete(key); // Invalidate cache for this module
    if (this.pendingFetches.has(key)) {
      // If a fetch is pending, wait for it instead of starting a new one
      // This is a strategic choice: you could also cancel and restart if needed.
      return this.pendingFetches.get(key)!;
    }

    const fetchPromise = this.fetchModuleData(key);
    this.pendingFetches.set(key, fetchPromise);

    try {
      const data = await fetchPromise;
      this.masterCache.set(key, data); // Cache the refreshed data
      return data;
    } catch (error) {
      return [];
    } finally {
      this.pendingFetches.delete(key);
    }
  }

  /**
   * Performs a live search for data within a specific module (no caching for search results).
   *
   * @param {string} module The name of the module.
   * @param {string} query The search query.
   * @returns {Promise<AutopopulateModuleData[]>} A promise resolving with search results.
   */
  public async searchModuleData(module: string, query: string): Promise<AutopopulateModuleData[]> {
    try {
      const url = `${this.baseUrl}/v1/master-list/search/${module}?search=${encodeURIComponent(query)}`;
      const response = await this.http.get<AutopopulateResponse<AutopopulateModuleData>>(url);
      return response.data.data || [];
    } catch (error: any) {
      appMessageService.showError(`Search Error`, error.message || `Could not search ${module}.`);
      return []; // Return empty array on error
    }
  }

  /**
   * Internal method to fetch module data from the API.
   * Handles errors and displays messages.
   *
   * @param {string} module The name of the module.
   * @returns {Promise<AutopopulateModuleData[]>} A promise resolving with the fetched data.
   */
  public async fetchModuleData(module: string): Promise<AutopopulateModuleData[]> {
    try {
      const url = `${this.baseUrl}/v1/master-list/${module}`;
      const response = await this.http.get<AutopopulateResponse<AutopopulateModuleData>>(url);
      return response.data.data || [];
    } catch (error: any) {
      appMessageService.showError(`Fetch Error`, `Failed to load ${module} data.`);
      console.error(`Error fetching ${module} data:`, error);
      throw error; // Propagate error so consuming code can handle it (e.g., set loading state to false)
    }
  }


  /**
   * Loads data for all specified modules concurrently, caching the results.
   *
   * @returns {Promise<void>}
   */
  public async loadAllModulesData(): Promise<void> {
    const modules = ['products', 'users', 'customers', 'sellers', 'payments', 'invoices', 'orders'];
    const promises = modules.map(module => this.refreshModuleData(module)); // Use refresh to ensure fetching and caching

    try {
      await Promise.all(promises);
    } catch (error) {
      console.error('Error loading all autopopulate modules:', error);
      // Errors are already handled by individual refreshModuleData calls via appMessageService
    }
  }

  /**
   * Fetches data for all specified modules concurrently, returning results in an object.
   * This is similar to your `getAllModulesData` using `forkJoin`.
   *
   * @returns {Promise<{[key: string]: AutopopulateModuleData[]}>} A promise that resolves with an object
   * where keys are module names and values are their respective data arrays.
   */
  public async getAllModulesData(): Promise<{ [key: string]: AutopopulateModuleData[] }> {
    const modules = ['products', 'users', 'customers', 'sellers', 'payments', 'invoices', 'orders'];
    const promises: { [key: string]: Promise<AutopopulateModuleData[]> } = {};

    modules.forEach(module => {
      // Use getModuleData here to leverage caching or pending fetches
      // but also wrap in catch to ensure all promises resolve for Promise.all
      promises[module] = this.getModuleData(module).catch(err => {
        console.warn(`Failed to get data for module ${module}:`, err.message);
        return []; // Return empty array for failed modules to prevent Promise.all from rejecting
      });
    });

    const resultsArray = await Promise.all(Object.values(promises));
    const resultObject: { [key: string]: AutopopulateModuleData[] } = {};
    Object.keys(promises).forEach((moduleName, index) => {
      resultObject[moduleName] = resultsArray[index];
    });

    return resultObject;
  }
}

export const autopopulateService = new AutopopulateService();