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
  refreshDates: string[];
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
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
  detailed_analysis?: Record<string, unknown>;
  created_at?: string;
}

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const { user, profile } = useAuth();
  
  // Start with empty state - will load from Supabase on mount
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [refreshDates, setRefreshDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const BACKEND_API_URL = import.meta.env.VITE_BACKEND_API_URL;

  const getDemoProducts = (): Product[] => {
    const pexels = (id: string) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=800`;
    
    // Helper to generate trend data
    const generateTrendData = (baseVelocity: number, baseSaturation: number) => {
      return Array.from({ length: 7 }).map((_, i) => ({
        date: `2024-0${i + 1}-01`,
        velocity: Math.min(100, Math.max(0, baseVelocity + (Math.random() * 20 - 10))),
        saturation: Math.min(100, Math.max(0, baseSaturation + (Math.random() * 10 - 5))),
        mentions: Math.floor(Math.random() * 500 + 200),
        sentiment: Math.floor(Math.random() * 40 + 40)
      }));
    };

    // Helper for demo FAQs
    const generateFAQs = (name: string): FAQ[] => [
      { question: `Is the ${name} waterproof?`, answer: "It has an IPX7 rating, making it splash-proof and suitable for light rain, but not full submersion." },
      { question: `What is the shipping time for ${name}?`, answer: "Standard shipping takes 5-7 business days within the US. Express options are available at checkout." },
      { question: `Does ${name} come with a warranty?`, answer: "Yes, it includes a 12-month manufacturer warranty covering all technical defects." }
    ];

    // Helper for demo Reddit threads
    const generateRedditThreads = (name: string): RedditThread[] => [
      {
        id: 't1',
        subreddit: 'r/gadgets',
        title: `Anyone tried the new ${name} yet?`,
        author: 'tech_enthusiast',
        upvotes: 450,
        commentCount: 85,
        timeAgo: '2 days ago',
        sentiment: 'positive',
        preview: `I've been looking at the ${name} for a while. The specs look great for the price, but I want to know about real-world performance...`,
        comments: [
          { id: 'c1', author: 'user123', text: 'Battery life is incredible, easily lasts all day.', upvotes: 45, timeAgo: '1 day ago', sentiment: 'positive' },
          { id: 'c2', author: 'tester_pro', text: 'Build quality is solid, but the app could use some work.', upvotes: 22, timeAgo: '20 hours ago', sentiment: 'neutral' }
        ]
      }
    ];

    // Helper for competitors
    const generateCompetitors = (name: string, price: number): CompetitorData[] => [
      { id: 'comp1', name: `Generic ${name}`, price: price * 0.8, rating: 4.1, reviews: 1200, marketplace: 'AliExpress', shippingDays: 15, estimatedSales: '5k+', trend: 'stable' },
      { id: 'comp2', name: `Premium ${name} Clone`, price: price * 1.1, rating: 4.6, reviews: 850, marketplace: 'Amazon', shippingDays: 2, estimatedSales: '2k+', trend: 'up' }
    ];

    return [
      {
        id: '1',
        name: 'Wireless Earbuds Pro',
        category: 'electronics',
        price: 129.99,
        imageUrl: pexels('3780681'),
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
        lastUpdated: 'Just now',
        trendData: generateTrendData(85, 45),
        faqs: generateFAQs('Wireless Earbuds Pro'),
        redditThreads: generateRedditThreads('Wireless Earbuds Pro'),
        competitors: generateCompetitors('Wireless Earbuds Pro', 129.99)
      },
      {
        id: '2',
        name: 'Smart Watch Ultra',
        category: 'electronics',
        price: 299.99,
        imageUrl: pexels('437037'),
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
        lastUpdated: 'Just now',
        trendData: generateTrendData(92, 38),
        faqs: generateFAQs('Smart Watch Ultra'),
        redditThreads: generateRedditThreads('Smart Watch Ultra'),
        competitors: generateCompetitors('Smart Watch Ultra', 299.99)
      },
      {
        id: '3',
        name: 'Portable Projector 4K',
        category: 'electronics',
        price: 599.99,
        imageUrl: pexels('7245535'),
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
        lastUpdated: 'Just now',
        trendData: generateTrendData(76, 52),
        faqs: generateFAQs('Portable Projector 4K'),
        redditThreads: generateRedditThreads('Portable Projector 4K'),
        competitors: generateCompetitors('Portable Projector 4K', 599.99)
      },
      {
        id: '4',
        name: 'USB-C Hub Multi-Port',
        category: 'accessories',
        price: 49.99,
        imageUrl: pexels('4065876'),
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
        lastUpdated: 'Just now',
        trendData: generateTrendData(88, 35),
        faqs: generateFAQs('USB-C Hub Multi-Port'),
        redditThreads: generateRedditThreads('USB-C Hub Multi-Port'),
        competitors: generateCompetitors('USB-C Hub Multi-Port', 49.99)
      },
      {
        id: '5',
        name: 'Gaming Mouse Pro',
        category: 'gaming',
        price: 79.99,
        imageUrl: pexels('2106216'),
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
        lastUpdated: 'Just now',
        trendData: generateTrendData(82, 48),
        faqs: generateFAQs('Gaming Mouse Pro'),
        redditThreads: generateRedditThreads('Gaming Mouse Pro'),
        competitors: generateCompetitors('Gaming Mouse Pro', 79.99)
      }
    ];
  };

  const trackProductView = useCallback(async (productId: string) => {
    if (!user?.id) return;
    try {
      await apiService.trackActivity(user.id, 'view', productId);
    } catch (error) {
      console.debug('Failed to track product view activity');
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
      console.warn('Could not retrieve saved products');
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
      
      const rawProducts: RawProduct[] = Array.isArray(data) ? data : 
                                      (data.products || data.preview || data.data || []);
      
      if (rawProducts.length === 0) {
        console.info('ℹ️ Live data currently unavailable. Displaying demo products for demonstration.');
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

      setProducts(mappedProducts);
      
      // Extract unique dates for history
      const dates = Array.from(new Set(mappedProducts.map(p => p.created_at?.split('T')[0]).filter(Boolean) as string[]))
        .sort((a, b) => b.localeCompare(a));
      setRefreshDates(dates);
      if (!selectedDate && dates.length > 0) setSelectedDate(dates[0]);
    } catch (error) {
      console.error('Refresh error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [BACKEND_API_URL, selectedDate]);

  // Fetch initial data and subscribe to realtime updates
  useEffect(() => {
    const fetchInitialProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map(mapSupabaseToProduct);
          setProducts(mapped);
        } else {
          refreshProducts();
        }
      } catch (err) {
        console.error('Supabase fetch error:', err);
        refreshProducts();
      } finally {
        setIsLoading(false);
        setHasLoaded(true);
      }
    };

    // 1. Initial Load
    fetchInitialProducts();

    // 2. Realtime Subscription
    // This allows the frontend to update automatically as the backend background scraper
    // saves items to the database. No page refresh needed!
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for INSERT, UPDATE, DELETE
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('🔔 Realtime Update Received:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newProduct = mapSupabaseToProduct(payload.new);
            setProducts(prev => {
              // Avoid duplicates
              if (prev.find(p => p.id === newProduct.id)) return prev;
              return [newProduct, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updatedProduct = mapSupabaseToProduct(payload.new);
            setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(p => p.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refreshProducts]);

  // Helper to map DB record to Product type
  const mapSupabaseToProduct = (item: RawProduct): Product => ({
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
    socialSignals: item.social_signals || [],
    detailed_analysis: item.detailed_analysis,
    created_at: item.created_at,
  });

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
      trackProductView,
      refreshDates,
      selectedDate,
      setSelectedDate,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
