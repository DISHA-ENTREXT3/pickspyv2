export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  imageUrl: string;
  velocityScore: number; // 0-100, trend momentum
  saturationScore: number; // 0-100, market saturation (lower is better)
  demandSignal: 'bullish' | 'caution' | 'bearish' | 'neutral';
  weeklyGrowth: number; // percentage
  redditMentions: number;
  sentimentScore: number; // -100 to 100
  topRedditThemes: string[];
  lastUpdated: string;
  source?: 'amazon' | 'ebay';
  rating?: number;
  reviewCount?: number;
  adSignal?: 'high' | 'medium' | 'low';
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
