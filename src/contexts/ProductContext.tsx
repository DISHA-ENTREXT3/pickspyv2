import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { Product, FAQ, CompetitorData, RedditThread } from '@/types/product';
import { supabase } from '@/lib/supabase';

interface ProductContextType {
  products: Product[];
  setProducts: (products: Product[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  refreshProducts: () => Promise<void>;
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
  // Start with empty state - will load from Supabase on mount
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  // Backend API URL - use environment variable or fall back to Render deployment
  const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL || 'https://pickspy-backend.onrender.com';

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
      console.log('Scraper raw data received:', data);
      
      const rawProducts: RawProduct[] = Array.isArray(data) ? data : (data.products || []);
      
      if (rawProducts.length === 0) {
        console.warn('Scraper returned no products. This might be due to anti-bot detection on the server.');
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
          console.log('No products in Supabase, triggering cloud refresh...');
          // Trigger initial scrape/fetch
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
    <ProductContext.Provider value={{ products, setProducts, isLoading, setIsLoading, refreshProducts }}>
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
