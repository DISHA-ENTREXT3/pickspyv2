import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Product, FAQ, CompetitorData, RedditThread } from '@/types/product';
import { supabase } from '@/lib/supabase';
import { apiService } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface ProductContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  refreshProducts: () => Promise<void>;
  saveProduct: (productId: string) => Promise<void>;
  removeSavedProduct: (productId: string) => Promise<void>;
  getSavedProducts: () => Promise<string[]>;
  createComparison: (productIds: string[], notes?: string) => Promise<string | null>;
  trackProductView: (productId: string) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface RawProduct {
  id?: string | number;
  name?: string;
  product_name?: string;
  category?: string;
  price?: string | number;
  imageUrl?: string;
  image_url?: string;
  velocityScore?: string | number;
  velocity_score?: string | number;
  saturationScore?: string | number;
  saturation_score?: string | number;
  demandSignal?: string;
  demand_signal?: string;
  weeklyGrowth?: string | number;
  weekly_growth?: string | number;
  redditMentions?: string | number;
  reddit_mentions?: string | number;
  sentimentScore?: string | number;
  sentiment_score?: string | number;
  topRedditThemes?: string[];
  top_reddit_themes?: string | string[];
  lastUpdated?: string;
  last_updated?: string;
  source?: string;
  rating?: number;
  review_count?: number;
  ad_signal?: string;
  reddit_threads?: RedditThread[];
  faqs?: FAQ[];
  competitors?: CompetitorData[];
  social_signals?: string[];
}

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const { user, profile } = useAuth();
  
  // Start with empty state - will load from Supabase on mount
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'https://pickspy-backend.onrender.com';

  const getDemoProducts = (): Product[] => {
    return [
      {
        id: '1',
        name: 'Wireless Earbuds Pro',
        category: 'electronics',
        price: 129.99,
        imageUrl: '/placeholder.svg',
        velocityScore: 85,
        saturationScore: 45,
        demandSignal: 'bullish',
        weeklyGrowth: 23.5,
        redditMentions: 1250,
        sentimentScore: 78,
        topRedditThemes: ['battery life', 'noise cancellation', 'value for money'],
        rating: 4.5,
        reviewCount: 2800,
        adSignal: 'high',
        source: 'amazon',
        lastUpdated: 'Just now'
      },
      {
        id: '2',
        name: 'Smart Watch Ultra',
        category: 'electronics',
        price: 299.99,
        imageUrl: '/placeholder.svg',
        velocityScore: 92,
        saturationScore: 38,
        demandSignal: 'bullish',
        weeklyGrowth: 31.2,
        redditMentions: 890,
        sentimentScore: 82,
        topRedditThemes: ['health tracking', 'fitness features', 'design'],
        rating: 4.7,
        reviewCount: 3200,
        adSignal: 'high',
        source: 'amazon',
        lastUpdated: 'Just now'
      },
      {
        id: '3',
        name: 'Portable Projector 4K',
        category: 'electronics',
        price: 599.99,
        imageUrl: '/placeholder.svg',
        velocityScore: 76,
        saturationScore: 52,
        demandSignal: 'caution',
        weeklyGrowth: 15.8,
        redditMentions: 650,
        sentimentScore: 71,
        topRedditThemes: ['brightness', 'connectivity', 'price'],
        rating: 4.3,
        reviewCount: 1900,
        adSignal: 'medium',
        source: 'amazon',
        lastUpdated: 'Just now'
      },
      {
        id: '4',
        name: 'USB-C Hub Multi-Port',
        category: 'accessories',
        price: 49.99,
        imageUrl: '/placeholder.svg',
        velocityScore: 88,
        saturationScore: 35,
        demandSignal: 'bullish',
        weeklyGrowth: 28.9,
        redditMentions: 1100,
        sentimentScore: 79,
        topRedditThemes: ['compatibility', 'build quality', 'value'],
        rating: 4.6,
        reviewCount: 2200,
        adSignal: 'high',
        source: 'amazon',
        lastUpdated: 'Just now'
      },
      {
        id: '5',
        name: 'Gaming Mouse Pro',
        category: 'gaming',
        price: 79.99,
        imageUrl: '/placeholder.svg',
        velocityScore: 82,
        saturationScore: 48,
        demandSignal: 'bullish',
        weeklyGrowth: 21.5,
        redditMentions: 950,
        sentimentScore: 75,
        topRedditThemes: ['precision', 'ergonomics', 'dpi'],
        rating: 4.4,
        reviewCount: 1850,
        adSignal: 'medium',
        source: 'amazon',
        lastUpdated: 'Just now'
      }
    ];
  };

  const trackProductView = useCallback(async (productId: string) => {
    if (!user?.id) return;
    try {
      await apiService.trackActivity(user.id, 'view', productId);
    } catch (error) {
      console.warn('Failed to track product view:', error);
    }
  }, [user?.id]);

  const saveProduct = useCallback(async (productId: string) => {
    if (!user?.id) throw new Error('User not authenticated');
    try {
      await apiService.saveProduct(user.id, productId);
      // Also track the activity
      await trackProductView(productId);
    } catch (error) {
      console.error('Error saving product:', error);
      throw error;
    }
  }, [user?.id, trackProductView]);

  const removeSavedProduct = useCallback(async (productId: string) => {
    if (!user?.id) throw new Error('User not authenticated');
    try {
      await apiService.removeSavedProduct(user.id, productId);
    } catch (error) {
      console.error('Error removing saved product:', error);
      throw error;
    }
  }, [user?.id]);

  const getSavedProducts = useCallback(async () => {
    if (!user?.id) throw new Error('User not authenticated');
    try {
      const result = await apiService.getSavedProducts(user.id);
      return result.saved_products;
    } catch (error) {
      console.error('Error getting saved products:', error);
      return [];
    }
  }, [user?.id]);

  const createComparison = useCallback(async (productIds: string[], notes?: string) => {
    if (!user?.id) throw new Error('User not authenticated');
    try {
      const result = await apiService.createComparison(user.id, productIds, notes);
      // Track the activity
      await apiService.trackActivity(user.id, 'compare', undefined, { product_ids: productIds });
      return result.comparison_id || null;
    } catch (error) {
      console.error('Error creating comparison:', error);
      throw error;
    }
  }, [user?.id]);

  const refreshProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BACKEND_API_URL}/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to trigger cloud refresh`);
      }

      const data = await response.json();
      // console.log('Scraper raw data received:', data);
      
      const rawProducts: RawProduct[] = Array.isArray(data) ? data : (data.products || []);
      
      if (rawProducts.length === 0) {
        console.warn('Scraper returned no products. Using demo data for preview.');
        // Use demo data if scraper fails
        const demoProducts = getDemoProducts();
        setProducts(demoProducts);
        setIsLoading(false);
        return;
      }
      
      const mappedProducts: Product[] = rawProducts.map((item) => ({
        id: item.id?.toString() || Math.random().toString(36).substr(2, 9),
        name: item.name || item.product_name || 'Unnamed Product',
        category: item.category || 'electronics',
        price: Number(item.price) || 0,
        imageUrl: item.imageUrl || item.image_url || '/placeholder.svg',
        velocityScore: Number(item.velocityScore) || Number(item.velocity_score) || 0,
        saturationScore: Number(item.saturationScore) || Number(item.saturation_score) || 0,
        demandSignal: (item.demandSignal || item.demand_signal || 'neutral').toLowerCase() as Product['demandSignal'],
        weeklyGrowth: Number(item.weeklyGrowth) || Number(item.weekly_growth) || 0,
        redditMentions: Number(item.redditMentions) || Number(item.reddit_mentions) || 0,
        sentimentScore: Number(item.sentimentScore) || Number(item.sentiment_score) || 0,
        topRedditThemes: Array.isArray(item.topRedditThemes) ? item.topRedditThemes : 
                         (Array.isArray(item.top_reddit_themes) ? item.top_reddit_themes :
                         (typeof item.top_reddit_themes === 'string' ? item.top_reddit_themes.split(',') : [])),
        lastUpdated: item.lastUpdated || item.last_updated || 'Just now',
        source: item.source as Product['source'],
        rating: Number(item.rating) || 0,
        reviewCount: Number(item.review_count) || 0,
        adSignal: (item.ad_signal || 'low') as Product['adSignal'],
        redditThreads: item.reddit_threads || [],
        faqs: item.faqs || [],
        competitors: item.competitors || [],
        socialSignals: item.social_signals || [],
      }));

      // Sync with Supabase (Upsert)
      if (mappedProducts.length > 0) {
        const { error: upsertError } = await supabase
          .from('products')
          .upsert(
            mappedProducts.map(p => ({
              id: p.id,
              name: p.name,
              category: p.category,
              price: p.price,
              image_url: p.imageUrl,
              velocity_score: p.velocityScore,
              saturation_score: p.saturationScore,
              demand_signal: p.demandSignal,
              weekly_growth: p.weeklyGrowth,
              reddit_mentions: p.redditMentions,
              sentiment_score: p.sentimentScore,
              top_reddit_themes: p.topRedditThemes,
              last_updated: p.lastUpdated,
              source: p.source,
              rating: p.rating,
              review_count: p.reviewCount,
              ad_signal: p.adSignal,
              reddit_threads: p.redditThreads || [],
              faqs: p.faqs || [],
              competitors: p.competitors || [],
              social_signals: p.socialSignals || [],
              created_at: new Date().toISOString()
            }))
          );

        if (upsertError) console.error('Error syncing with Supabase:', upsertError);
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Refresh error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [BACKEND_API_URL]);

  // Fetch initial data from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mappedProducts: Product[] = data.map(item => ({
            id: item.id,
            name: item.name,
            category: item.category,
            price: Number(item.price),
            imageUrl: item.image_url || '/placeholder.svg',
            velocityScore: item.velocity_score || 0,
            saturationScore: item.saturation_score || 0,
            demandSignal: (item.demand_signal || 'neutral') as Product['demandSignal'],
            weeklyGrowth: Number(item.weekly_growth) || 0,
            redditMentions: item.reddit_mentions || 0,
            sentimentScore: item.sentiment_score || 0,
            topRedditThemes: item.top_reddit_themes || [],
            lastUpdated: item.last_updated || 'Just now',
            source: item.source,
            rating: item.rating,
            reviewCount: item.review_count,
            adSignal: item.ad_signal,
            redditThreads: item.reddit_threads || [],
            faqs: item.faqs || [],
          }));
          setProducts(mappedProducts);
        } else {
          // No products in Supabase, triggering cloud refresh
          refreshProducts();
        }
      } catch (error) {
        console.error('Error fetching from Supabase:', error);
        // Also trigger refresh on error (e.g. no supabase connection)
        refreshProducts();
      } finally {
        setIsLoading(false);
        setHasLoaded(true);
      }
    };

    fetchProducts();
  }, [refreshProducts]);

  return (
    <ProductContext.Provider value={{ 
      products, 
      setProducts, 
      isLoading, 
      setIsLoading, 
      refreshProducts,
      saveProduct,
      removeSavedProduct,
      getSavedProducts,
      createComparison,
      trackProductView
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
