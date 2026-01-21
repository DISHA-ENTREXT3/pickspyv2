// Reddit Types - used for live and dynamically generated data
export interface RedditComment {
  id: string;
  author: string;
  text: string;
  upvotes: number;
  timeAgo: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  replies?: RedditComment[];
}

export interface RedditThread {
  id: string;
  subreddit: string;
  title: string;
  author: string;
  upvotes: number;
  commentCount: number;
  timeAgo: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  preview: string;
  comments: RedditComment[];
}

// Trend Data Types
export interface TrendDataPoint {
  date: string;
  velocity: number;
  saturation: number;
  mentions: number;
  sentiment: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  velocityScore: number;
  saturationScore: number;
  demandSignal: 'bullish' | 'caution' | 'bearish' | 'neutral';
  weeklyGrowth: number;
  redditMentions: number;
  sentimentScore: number;
  topRedditThemes: string[];
  lastUpdated: string;
  source?: 'amazon' | 'ebay' | 'flipkart' | 'alibaba' | 'taobao' | 'tmall' | 'etsy' | 'walmart' | 'aliexpress' | 'mercadolibre' | 'shopee' | 'rakuten' | 'shopify' | 'bigcommerce' | 'woocommerce' | 'wix' | 'squarespace' | 'magento' | string;
  rating?: number;
  reviewCount?: number;
  adSignal?: 'high' | 'medium' | 'low';
  redditThreads?: RedditThread[];
  faqs?: FAQ[];
  competitors?: CompetitorData[];
  socialSignals?: string[];
}

export interface CompetitorData {
  id: string;
  name: string;
  price: number;
  rating: number;
  reviews: number;
  marketplace: 'Amazon' | 'AliExpress' | 'eBay' | 'Shopify Store' | 'Walmart' | string;
  shippingDays: number;
  estimatedSales: string;
  trend: 'up' | 'down' | 'stable';
}

export interface ProductAnalysis {
  viabilityScore: number;
  recommendation: 'dropship' | 'white-label' | 'skip';
  topRisks: {
    risk: string;
    severity: 'high' | 'medium' | 'low';
  }[];
  suggestions: {
    type: 'price' | 'angle' | 'feature' | 'audience';
    suggestion: string;
  }[];
  reasoning: string;
}

export type Category = 
  | 'all'
  | 'electronics'
  | 'home-garden'
  | 'fashion'
  | 'beauty'
  | 'sports'
  | 'toys'
  | 'automotive'
  | 'pet-supplies';

export type PriceBand = 'all' | 'under-25' | '25-50' | '50-100' | 'over-100';

export type TrendVelocity = 'all' | 'explosive' | 'rising' | 'stable' | 'declining';

export type SaturationLevel = 'all' | 'low' | 'medium' | 'high';

export interface FilterState {
  category: Category;
  priceBand: PriceBand;
  trendVelocity: TrendVelocity;
  saturation: SaturationLevel;
  searchQuery: string;
}
