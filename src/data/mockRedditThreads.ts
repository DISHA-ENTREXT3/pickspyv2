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

export interface RedditComment {
  id: string;
  author: string;
  text: string;
  upvotes: number;
  timeAgo: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  replies?: RedditComment[];
}

export const mockRedditThreads: Record<string, RedditThread[]> = {
  '1': [
    {
      id: 'r1',
      subreddit: 'r/dropshipping',
      title: 'Portable Neck Fan absolutely crushing it this summer - 40% conversion rate',
      author: 'dropship_guru',
      upvotes: 234,
      commentCount: 67,
      timeAgo: '2d ago',
      sentiment: 'positive',
      preview: 'Been selling these for 3 weeks now. Started with $50/day ad spend, now scaling to $500...',
      comments: [
        {
          id: 'c1',
          author: 'ecom_hustler',
          text: 'Which supplier are you using? AliExpress ones have quality issues.',
          upvotes: 45,
          timeAgo: '2d ago',
          sentiment: 'neutral',
          replies: [
            {
              id: 'c1r1',
              author: 'dropship_guru',
              text: 'CJ Dropshipping, way better quality. Shipping is 8-12 days to US.',
              upvotes: 32,
              timeAgo: '2d ago',
              sentiment: 'positive',
            },
          ],
        },
        {
          id: 'c2',
          author: 'newbie_seller',
          text: 'What price point are you selling at? Seeing them everywhere for $15-30.',
          upvotes: 28,
          timeAgo: '1d ago',
          sentiment: 'neutral',
        },
        {
          id: 'c3',
          author: 'marketing_pro',
          text: 'The TikTok angle with outdoor workers is fire. Construction guys love these.',
          upvotes: 89,
          timeAgo: '1d ago',
          sentiment: 'positive',
        },
      ],
    },
    {
      id: 'r2',
      subreddit: 'r/Entrepreneur',
      title: 'Summer product ideas - neck fans are having a moment',
      author: 'startup_steve',
      upvotes: 156,
      commentCount: 43,
      timeAgo: '5d ago',
      sentiment: 'positive',
      preview: 'Looking at Google Trends, portable cooling is up 300% YoY. The bladeless neck fan design...',
      comments: [
        {
          id: 'c4',
          author: 'data_driven',
          text: 'Confirmed. My store did $12K last month with these alone.',
          upvotes: 67,
          timeAgo: '5d ago',
          sentiment: 'positive',
        },
      ],
    },
    {
      id: 'r3',
      subreddit: 'r/amazonFBA',
      title: 'Warning: Neck fan returns are killing my margins',
      author: 'fba_reality',
      upvotes: 89,
      commentCount: 31,
      timeAgo: '1w ago',
      sentiment: 'negative',
      preview: 'Had 15% return rate last month. Main complaints: battery life and noise level...',
      comments: [
        {
          id: 'c5',
          author: 'quality_first',
          text: 'This is why I always order samples first. Cheap ones are trash.',
          upvotes: 45,
          timeAgo: '1w ago',
          sentiment: 'neutral',
        },
      ],
    },
  ],
  '3': [
    {
      id: 'r4',
      subreddit: 'r/WFH',
      title: 'Posture corrector changed my life after 2 years of back pain',
      author: 'remote_worker',
      upvotes: 1289,
      commentCount: 234,
      timeAgo: '3d ago',
      sentiment: 'positive',
      preview: 'Was skeptical at first but after 3 weeks of consistent use, my chronic back pain is gone...',
      comments: [
        {
          id: 'c6',
          author: 'desk_jockey',
          text: 'Which brand did you buy? There are so many knockoffs.',
          upvotes: 156,
          timeAgo: '3d ago',
          sentiment: 'neutral',
        },
        {
          id: 'c7',
          author: 'physio_expert',
          text: 'As a PT, these work great as a reminder tool. Just dont rely on them 24/7.',
          upvotes: 234,
          timeAgo: '3d ago',
          sentiment: 'positive',
        },
      ],
    },
    {
      id: 'r5',
      subreddit: 'r/dropshipping',
      title: 'Posture correctors - the sleeper hit of 2024',
      author: 'trend_spotter',
      upvotes: 178,
      commentCount: 56,
      timeAgo: '1w ago',
      sentiment: 'positive',
      preview: 'Everyone sleeping on this niche. WFH trend isnt going anywhere and people need solutions...',
      comments: [
        {
          id: 'c8',
          author: 'health_niche',
          text: 'Been selling these for 6 months. Consistent $200/day profit.',
          upvotes: 89,
          timeAgo: '1w ago',
          sentiment: 'positive',
        },
      ],
    },
  ],
};

// Generate threads for products that don't have specific ones
export const getThreadsForProduct = (productId: string): RedditThread[] => {
  if (mockRedditThreads[productId]) {
    return mockRedditThreads[productId];
  }
  
  // Return generic threads for other products
  return [
    {
      id: 'generic1',
      subreddit: 'r/dropshipping',
      title: 'Has anyone tested this product niche lately?',
      author: 'curious_seller',
      upvotes: 45,
      commentCount: 12,
      timeAgo: '3d ago',
      sentiment: 'neutral',
      preview: 'Looking for feedback from anyone whos tested this category recently...',
      comments: [
        {
          id: 'gc1',
          author: 'experienced_ds',
          text: 'Market seems decent but margins are tight. Need good creatives.',
          upvotes: 23,
          timeAgo: '3d ago',
          sentiment: 'neutral',
        },
      ],
    },
  ];
};
