import { CompetitorData } from '@/types/product';

export interface TrendDataPoint {
  date: string;
  velocity: number;
  saturation: number;
  mentions: number;
  sentiment: number;
}


export const mockTrendData: Record<string, TrendDataPoint[]> = {
  '1': [
    { date: 'Jan 1', velocity: 45, saturation: 15, mentions: 89, sentiment: 55 },
    { date: 'Jan 8', velocity: 52, saturation: 18, mentions: 112, sentiment: 58 },
    { date: 'Jan 15', velocity: 58, saturation: 20, mentions: 145, sentiment: 62 },
    { date: 'Jan 22', velocity: 63, saturation: 22, mentions: 178, sentiment: 65 },
    { date: 'Jan 29', velocity: 67, saturation: 24, mentions: 203, sentiment: 68 },
    { date: 'Feb 5', velocity: 72, saturation: 26, mentions: 234, sentiment: 70 },
    { date: 'Feb 12', velocity: 78, saturation: 28, mentions: 267, sentiment: 71 },
    { date: 'Feb 19', velocity: 82, saturation: 29, mentions: 298, sentiment: 72 },
    { date: 'Feb 26', velocity: 85, saturation: 30, mentions: 321, sentiment: 72 },
    { date: 'Mar 4', velocity: 87, saturation: 32, mentions: 342, sentiment: 72 },
  ],
  '3': [
    { date: 'Jan 1', velocity: 55, saturation: 12, mentions: 234, sentiment: 60 },
    { date: 'Jan 8', velocity: 62, saturation: 14, mentions: 289, sentiment: 62 },
    { date: 'Jan 15', velocity: 68, saturation: 15, mentions: 334, sentiment: 64 },
    { date: 'Jan 22', velocity: 75, saturation: 17, mentions: 389, sentiment: 65 },
    { date: 'Jan 29', velocity: 81, saturation: 18, mentions: 423, sentiment: 66 },
    { date: 'Feb 5', velocity: 85, saturation: 19, mentions: 467, sentiment: 67 },
    { date: 'Feb 12', velocity: 88, saturation: 21, mentions: 512, sentiment: 67 },
    { date: 'Feb 19', velocity: 90, saturation: 22, mentions: 545, sentiment: 68 },
    { date: 'Feb 26', velocity: 91, saturation: 23, mentions: 556, sentiment: 68 },
    { date: 'Mar 4', velocity: 91, saturation: 24, mentions: 567, sentiment: 68 },
  ],
};

export const mockCompetitors: Record<string, CompetitorData[]> = {
  '1': [
    {
      id: 'comp1',
      name: 'JISULIFE Portable Neck Fan',
      price: 29.99,
      rating: 4.3,
      reviews: 12453,
      marketplace: 'Amazon',
      shippingDays: 2,
      estimatedSales: '5K-10K/mo',
      trend: 'up',
    },
    {
      id: 'comp2',
      name: 'Bladeless Hanging Neck Fan',
      price: 8.99,
      rating: 4.0,
      reviews: 3421,
      marketplace: 'AliExpress',
      shippingDays: 15,
      estimatedSales: '20K-50K/mo',
      trend: 'stable',
    },
    {
      id: 'comp3',
      name: 'Premium Sports Neck Cooler',
      price: 34.99,
      rating: 4.5,
      reviews: 2156,
      marketplace: 'Amazon',
      shippingDays: 2,
      estimatedSales: '2K-5K/mo',
      trend: 'up',
    },
    {
      id: 'comp4',
      name: 'Personal Cooling Device',
      price: 24.99,
      rating: 4.1,
      reviews: 876,
      marketplace: 'eBay',
      shippingDays: 5,
      estimatedSales: '500-1K/mo',
      trend: 'down',
    },
  ],
  '3': [
    {
      id: 'comp5',
      name: 'Evoke Pro Posture Corrector',
      price: 34.99,
      rating: 4.4,
      reviews: 8923,
      marketplace: 'Amazon',
      shippingDays: 2,
      estimatedSales: '10K-20K/mo',
      trend: 'up',
    },
    {
      id: 'comp6',
      name: 'Back Support Belt Unisex',
      price: 6.99,
      rating: 3.9,
      reviews: 15234,
      marketplace: 'AliExpress',
      shippingDays: 12,
      estimatedSales: '50K+/mo',
      trend: 'stable',
    },
    {
      id: 'comp7',
      name: 'Orthopedic Posture Brace',
      price: 39.99,
      rating: 4.6,
      reviews: 3421,
      marketplace: 'Amazon',
      shippingDays: 2,
      estimatedSales: '5K-10K/mo',
      trend: 'up',
    },
  ],
};

// Generate default data for products without specific data
export const getTrendDataForProduct = (productId: string, weeklyGrowth?: number): TrendDataPoint[] => {
  if (mockTrendData[productId]) {
    return mockTrendData[productId];
  }
  
  // Generate random but realistic trend data
  const baseVelocity = Math.floor(Math.random() * 30) + 40;
  const baseSaturation = Math.floor(Math.random() * 30) + 30;
  
  return Array.from({ length: 10 }, (_, i) => ({
    date: `Week ${i + 1}`,
    velocity: Math.min(100, baseVelocity + Math.floor(Math.random() * 10) * (i / 3)),
    saturation: Math.min(100, baseSaturation + Math.floor(Math.random() * 5) * (i / 4)),
    mentions: Math.floor(100 + Math.random() * 50 * i),
    sentiment: Math.floor(40 + Math.random() * 30),
  }));
};

export const getCompetitorsForProduct = (productId: string, basePrice?: number): CompetitorData[] => {
  if (mockCompetitors[productId]) {
    return mockCompetitors[productId];
  }
  
  // Return generic competitors
  return [
    {
      id: 'gen1',
      name: 'Generic Competitor A',
      price: 19.99,
      rating: 4.0,
      reviews: 1234,
      marketplace: 'Amazon',
      shippingDays: 3,
      estimatedSales: '1K-5K/mo',
      trend: 'stable',
    },
    {
      id: 'gen2',
      name: 'Budget Option B',
      price: 7.99,
      rating: 3.8,
      reviews: 5678,
      marketplace: 'AliExpress',
      shippingDays: 14,
      estimatedSales: '10K-20K/mo',
      trend: 'stable',
    },
  ];
};
