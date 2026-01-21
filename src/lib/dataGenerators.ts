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
 * Generates product-specific Social Threads (Instagram/Viral/Community)
 */
export function generateRedditThreads(productName: string, productId: string): RedditThread[] {
  const seed = hashString(productName + productId);
  const random = seededRandom(seed);
  
  // Updated source context to Instagram/Social
  const sources = ['Instagram Reel', 'Viral Post', 'Tech Community', 'Gadget Review', 'Flipkart Review'];
  const performanceKeywords = ['quality', 'delivery', 'trend', 'viral factor', 'price drop', 'unboxing'];
  
  const threadCount = 3 + Math.floor(random() * 3);
  const threads: RedditThread[] = [];
  
  for (let i = 0; i < threadCount; i++) {
    const source = sources[Math.floor(random() * sources.length)];
    const keyword = performanceKeywords[Math.floor(random() * performanceKeywords.length)];
    const upvotes = Math.floor(random() * 5000) + 100;
    const commentCount = Math.floor(random() * 200) + 20;
    const daysAgo = Math.floor(random() * 5) + 1;
    
    const sentiments: ('positive' | 'neutral' | 'negative')[] = ['positive', 'neutral', 'negative', 'positive'];
    const sentiment = sentiments[Math.floor(random() * sentiments.length)];
    
    threads.push({
      id: `social-${seed % 10000}-${i}`,
      subreddit: `${source}`, // Reusing subreddit field for Source Name
      title: `Viral discussion on ${productName.slice(0, 30)}: ${keyword} analysis`,
      author: `user_${Math.floor(random() * 900) + 100}`,
      upvotes,
      commentCount,
      timeAgo: `${daysAgo}d ago`,
      sentiment,
      preview: `Saw this on ${source}. The ${keyword} is crazy. Everyone is talking about ${productName.slice(0, 15)}. Is it worth the hype?`,
      comments: [
        {
          id: `c-${seed % 1000}-${i}`,
          author: 'influncr_01',
          text: `I posted a reel about this. Got 50k views. The ${keyword} is real.`,
          upvotes: Math.floor(random() * 500) + 50,
          timeAgo: '2h ago',
          sentiment: 'positive' as const,
        },
        {
          id: `c2-${seed % 1000}-${i}`,
          author: 'monitor_bot',
          text: `Price dropped on Flipkart/Amazon today. Best time to buy ${productName.slice(0, 10)}.`,
          upvotes: Math.floor(random() * 100) + 10,
          timeAgo: '5h ago',
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
  
  // RESTRICTED TO AMAZON AND FLIPKART
  const marketplaces: CompetitorData['marketplace'][] = ['Amazon', 'Flipkart'];
  const priceModifiers = [0.90, 1.05, 1.15, 0.95];
  
  return priceModifiers.map((mod, i) => {
    const marketplace = marketplaces[Math.floor(random() * marketplaces.length)];
    const trends: CompetitorData['trend'][] = ['up', 'stable', 'up', 'down'];
    
    return {
      id: `comp-${i}-${seed % 1000}`,
      name: `${productName.slice(0, 15)} Alt ${i + 1}`,
      price: Math.round(basePrice * mod * 100) / 100,
      rating: Math.round((3.8 + random() * 1.1) * 10) / 10,
      reviews: Math.floor(random() * 10000) + 100,
      marketplace,
      shippingDays: [2, 3, 5, 7][Math.floor(random() * 4)],
      estimatedSales: `${Math.floor(random() * 10) + 1}K/mo`,
      trend: trends[Math.floor(random() * trends.length)],
    };
  });
}
