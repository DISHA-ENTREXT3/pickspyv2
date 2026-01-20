import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types/product';
import { mockProducts } from '@/data/mockProducts';

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

  const refreshProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://hook.us2.make.com/7j6vji8umwx0beu42jqk1jejy3in2r25', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          timestamp: new Date().toISOString(),
          source: 'webapp_refresh'
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Transformation logic - "modifies it as per our webapp"
      // We ensure the data matches the Product interface
      const rawProducts: RawProduct[] = Array.isArray(data) ? data : (data.products || []);
      
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

      if (mappedProducts.length > 0) {
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Refresh error:', error);
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
