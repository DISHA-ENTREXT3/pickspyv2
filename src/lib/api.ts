import { supabase } from './supabase';

const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

if (!BACKEND_API_URL) {
  console.warn("⚠️ VITE_BACKEND_API_URL is not set. API calls will fail.");
}

/**
 * API Service for PickSpy backend
 * Handles all API calls and integrations with the backend
 */

export interface SaveProductResponse {
  success: boolean;
  message: string;
}

export interface SavedProductsResponse {
  user_id: string;
  saved_products: string[];
  count: number;
}

export interface ComparisonResponse {
  success: boolean;
  message: string;
  comparison_id?: string;
}

export interface ComparisonData {
  id: string;
  created_at: string;
  products: string[];
  notes?: string;
}

export interface UserComparisonsResponse {
  user_id: string;
  comparisons: ComparisonData[];
  count: number;
}

export interface ActivityTrackingResponse {
  success: boolean;
  message: string;
}

export interface AnalyticsResponse {
  total_products: number;
  activities_last_7_days: number;
  success: boolean;
  error?: string;
}

class APIService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BACKEND_API_URL;
  }

  /**
   * Make API call with error handling
   */
  private async apiCall<T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'DELETE' = 'GET',
    body?: unknown,
    useAuth = false
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth token if needed
    if (useAuth) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }
    }

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Refresh products from scrapers
   */
  async refreshProducts(): Promise<unknown> {
    return this.apiCall('/refresh', 'POST');
  }

  /**
   * Trigger deep scan in background
   */
  async triggerDeepScan(): Promise<unknown> {
    return this.apiCall('/deep-scan', 'POST');
  }

  /**
   * Get health status
   */
  async getHealth(): Promise<unknown> {
    return this.apiCall('/health', 'GET');
  }

  /**
   * Save product to user's favorites
   */
  async saveProduct(userId: string, productId: string): Promise<SaveProductResponse> {
    return this.apiCall(
      '/user/save-product',
      'POST',
      { user_id: userId, product_id: productId },
      true
    );
  }

  /**
   * Remove saved product
   */
  async removeSavedProduct(userId: string, productId: string): Promise<SaveProductResponse> {
    return this.apiCall(
      `/user/saved-product/${userId}/${productId}`,
      'DELETE',
      undefined,
      true
    );
  }

  /**
   * Get user's saved products
   */
  async getSavedProducts(userId: string): Promise<SavedProductsResponse> {
    return this.apiCall(
      `/user/saved-products/${userId}`,
      'GET',
      undefined,
      true
    );
  }

  /**
   * Create a product comparison
   */
  async createComparison(
    userId: string,
    productIds: string[],
    notes?: string
  ): Promise<ComparisonResponse> {
    return this.apiCall(
      '/user/create-comparison',
      'POST',
      { user_id: userId, product_ids: productIds, notes },
      true
    );
  }

  /**
   * Get user's comparisons
   */
  async getComparisons(userId: string): Promise<UserComparisonsResponse> {
    return this.apiCall(
      `/user/comparisons/${userId}`,
      'GET',
      undefined,
      true
    );
  }

  /**
   * Track user activity
   */
  async trackActivity(
    userId: string,
    activityType: 'view' | 'analyze' | 'compare' | 'search',
    productId?: string,
    metadata?: Record<string, unknown>
  ): Promise<ActivityTrackingResponse> {
    return this.apiCall(
      '/user/track-activity',
      'POST',
      { user_id: userId, activity_type: activityType, product_id: productId, metadata },
      true
    );
  }

  /**
   * Get analytics data
   */
  async getAnalytics(): Promise<AnalyticsResponse> {
    return this.apiCall('/analytics/products', 'GET');
  }

  /**
   * Get comprehensive product analysis from all scrapers
   */
  async getProductAnalysis(productName: string): Promise<Record<string, unknown>> {
    try {
      const response = await fetch(`${this.baseUrl}/api/product-analysis/${encodeURIComponent(productName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching product analysis for ${productName}:`, error);
      throw error;
    }
  }
}

// Export singleton instance
export const apiService = new APIService();

// Export hooks for React components
export function useAPIService() {
  return apiService;
}
