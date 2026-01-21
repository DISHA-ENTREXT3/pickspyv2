/**
 * Dynamic Data Generators
 * These functions generate product-specific data dynamically based on
 * product properties. This replaces static mock data with dynamic generation.
 */

import { RedditThread, TrendDataPoint, CompetitorData } from '@/types/product';

// Simple string hashing function for deterministic random generation
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Helper for deterministic random based on seed
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

/**
 * Generates product-specific Reddit threads with realistic content
 */
export function generateRedditThreads(productName: string, productId: string): RedditThread[] {
  const seed = hashString(productName + productId);
  const random = seededRandom(seed);
  
  const subreddits = ['dropshipping', 'eCommerce', 'amazonFBA', 'Entrepreneur', 'Gadgets', 'SmartHome', 'BeautyGuru'];
  const performanceKeywords = ['margin', 'conversion', 'supplier', 'ads spend', 'quality', 'shipping', 'scaling'];
  
  const threadCount = 3 + Math.floor(random() * 3);
  const threads: RedditThread[] = [];
  
  for (let i = 0; i < threadCount; i++) {
    const subreddit = subreddits[Math.floor(random() * subreddits.length)];
    const keyword = performanceKeywords[Math.floor(random() * performanceKeywords.length)];
    const upvotes = Math.floor(random() * 1200) + 10;
    const commentCount = Math.floor(random() * 80) + 5;
    const daysAgo = Math.floor(random() * 10) + 1;
    
    const sentiments: ('positive' | 'neutral' | 'negative')[] = ['positive', 'neutral', 'negative', 'positive'];
    const sentiment = sentiments[Math.floor(random() * sentiments.length)];
    
    threads.push({
      id: `rt-${seed % 10000}-${i}`,
      subreddit: `r/${subreddit}`,
      title: `The brutal truth about ${productName.slice(0, 35)}... ${keyword} is the key factor.`,
      author: `merchant_${Math.floor(random() * 900) + 100}`,
      upvotes,
      commentCount,
      timeAgo: `${daysAgo}d ago`,
      sentiment,
      preview: `Sharing my results for ${productName.slice(0, 25)}. The ${keyword} started high but now saturation on ${subreddit} is making it tough. Anyone found a better angle?`,
      comments: [
        {
          id: `c-${seed % 1000}-${i}`,
          author: 'growth_expert',
          text: `Stop using generic ads for ${productName.slice(0, 15)}. Move to user-generated content on TikTok. That saved my ${keyword}.`,
          upvotes: Math.floor(random() * 300) + 5,
          timeAgo: '2d ago',
          sentiment: 'positive' as const,
        },
        {
          id: `c2-${seed % 1000}-${i}`,
          author: 'data_ninja',
          text: `Check the ${subreddit} wiki. We talked about ${productName.slice(0, 10)} last week. The main issue is the ${keyword} from suppliers.`,
          upvotes: Math.floor(random() * 50) + 2,
          timeAgo: '1d ago',
          sentiment: 'neutral' as const,
        },
      ],
    });
  }
  
  return threads;
}

/**
 * Generates product-specific trend data
 */
export function generateTrendData(productId: string, currentVelocity: number = 70, weeklyGrowth: number = 10): TrendDataPoint[] {
  const seed = hashString(productId);
  const random = seededRandom(seed);
  
  const data: TrendDataPoint[] = [];
  const weeks = ['Jan 1', 'Jan 8', 'Jan 15', 'Jan 22', 'Jan 29', 'Feb 5', 'Feb 12', 'Feb 19', 'Feb 26', 'Mar 4'];
  
  const baseVelocity = Math.max(20, currentVelocity - (weeklyGrowth * 2));
  const baseSaturation = 10 + Math.floor(random() * 15);
  const baseMentions = 50 + Math.floor(random() * 50);
  const baseSentiment = 40 + Math.floor(random() * 20);
  
  for (let i = 0; i < weeks.length; i++) {
    const velocityGrowth = (weeklyGrowth / 5) * (1 + random() * 0.3);
    const saturationGrowth = (Math.abs(weeklyGrowth) / 10) * (1 + random() * 0.2);
    const mentionsGrowth = 20 + Math.floor(random() * 30);
    const sentimentChange = (random() - 0.4) * 5;
    
    data.push({
      date: weeks[i],
      velocity: Math.min(100, Math.max(0, Math.floor(baseVelocity + velocityGrowth * i))),
      saturation: Math.min(100, Math.max(0, Math.floor(baseSaturation + saturationGrowth * i))),
      mentions: Math.floor(baseMentions + mentionsGrowth * i),
      sentiment: Math.min(100, Math.max(0, Math.floor(baseSentiment + sentimentChange * i))),
    });
  }
  
  return data;
}

/**
 * Generates competitor data based on product name and price
 */
export function generateCompetitors(productName: string, basePrice: number): CompetitorData[] {
  const seed = hashString(productName);
  const random = seededRandom(seed);
  
  const marketplaces: CompetitorData['marketplace'][] = ['Amazon', 'AliExpress', 'eBay', 'Shopify Store', 'Walmart'];
  const priceModifiers = [0.75, 0.95, 1.15, 1.35];
  
  return priceModifiers.map((mod, i) => {
    const marketplace = marketplaces[Math.floor(random() * marketplaces.length)];
    const trends: CompetitorData['trend'][] = ['up', 'stable', 'up', 'down'];
    
    return {
      id: `comp-${i}-${seed % 1000}`,
      name: `${productName.slice(0, 15)} Alternative #${i + 1}`,
      price: Math.round(basePrice * mod * 100) / 100,
      rating: Math.round((3.5 + random() * 1.4) * 10) / 10,
      reviews: Math.floor(random() * 25000) + 200,
      marketplace,
      shippingDays: [2, 5, 7, 12, 14][Math.floor(random() * 5)],
      estimatedSales: `${Math.floor(random() * 20) + 1}K/mo`,
      trend: trends[Math.floor(random() * trends.length)],
    };
  });
}
