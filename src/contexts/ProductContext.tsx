import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Product } from '@/types/product';
import { mockProducts } from '@/data/mockProducts';
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
}

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isLoading, setIsLoading] = useState(false);

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
            demandSignal: (item.demand_signal || 'neutral') as any,
            weeklyGrowth: Number(item.weekly_growth) || 0,
            redditMentions: item.reddit_mentions || 0,
            sentimentScore: item.sentiment_score || 0,
            topRedditThemes: item.top_reddit_themes || [],
            lastUpdated: item.last_updated || 'Just now',
          }));
          setProducts(mappedProducts);
        }
      } catch (error) {
        console.error('Error fetching from Supabase:', error);
      }
    };

    fetchProducts();
  }, []);

  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      // Note: Scrapping is usually performed by a backend service.
      // In a serverless live app, this would be a Supabase Edge Function or an external worker.
      // Since we are shifting to a live app without local base, we will fetch from an edge service or
      // if not available, we can trigger a cloud refresh.
      
      // For now, let's keep the logic where the frontend fetches updated data.
      // If you have a deployed scraper API, use that URL here.
      // To simulate "live" data without local backend, we fetch from our data source.
      
      // Placeholder for your deployed scraper API URL
      const SCRAPER_API_URL = 'https://pickspy-backend.onrender.com/refresh'; 
      
      const response = await fetch(SCRAPER_API_URL, {
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
        demandSignal: (item.demandSignal || item.demand_signal || 'neutral').toLowerCase() as any,
        weeklyGrowth: Number(item.weeklyGrowth) || Number(item.weekly_growth) || 0,
        redditMentions: Number(item.redditMentions) || Number(item.reddit_mentions) || 0,
        sentimentScore: Number(item.sentimentScore) || Number(item.sentiment_score) || 0,
        topRedditThemes: Array.isArray(item.topRedditThemes) ? item.topRedditThemes : 
                         (Array.isArray(item.top_reddit_themes) ? item.top_reddit_themes :
                         (typeof item.top_reddit_themes === 'string' ? item.top_reddit_themes.split(',') : [])),
        lastUpdated: item.lastUpdated || item.last_updated || 'Just now',
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
              created_at: new Date().toISOString()
            }))
          );

        if (upsertError) console.error('Error syncing with Supabase:', upsertError);
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Refresh error:', error);
      // Fallback for demo: if no cloud service is available, 
      // users can still see current Supabase/Mock data.
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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
