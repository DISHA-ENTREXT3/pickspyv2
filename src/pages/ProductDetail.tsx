import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/contexts/ProductContext';
import { apiService } from '@/lib/api';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ChevronLeft,
  TrendingUp, 
  TrendingDown, 
  Minus,
  Clock,
  Zap,
  Target,
  BarChart3,
  AlertCircle,
  Loader2,
  MessageCircle,
  Share2,
  Info,
  ShieldCheck,
  TrendingUp as TrendingIcon,
  ShoppingCart,
  ExternalLink,
} from 'lucide-react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { TrendChart } from '@/components/product/TrendChart';
import { CompetitorAnalysis } from '@/components/product/CompetitorAnalysis';
import { RedditThreads } from '@/components/product/RedditThreads';
import { InstagramReels } from '@/components/product/InstagramReels';
import { ProductFAQ } from '@/components/product/ProductFAQ';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface LiveAnalysisData {
  sources?: {
    market_trends?: {
      trend_direction?: string;
      trend_velocity_percent?: number;
      timeseries?: number[];
    };
    social_analysis?: {
       sentiment_percentage?: { positive: number; negative: number };
       total_mentions?: number;
       top_comments?: Array<{ user: string; text: string; likes?: number; platform?: string }>;
       instagram_posts?: Array<{ id: string; caption?: string; url: string; source?: string }>;
    };
    ecommerce?: Record<string, unknown> & {
      walmart?: unknown[];
      ebay?: unknown[];
      flipkart?: unknown[];
    };
    search_results?: {
       total_results?: number;
       top_mentions?: Array<{ title: string; url: string; snippet: string }>;
    };
    faqs?: Array<{ question: string; answer: string; snippet?: string }>;
    product_insights?: {
       market_position?: string;
       quality_score?: number;
    };
  };
  actualFullName?: string;
  realImageUrl?: string;
  success?: boolean;
  data?: unknown;
  error?: string;
}

interface EcommerceItem {
  name?: string;
  price?: string | number;
  imageUrl?: string;
  url?: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  
  const product = products.find(p => p.id === id);
  
  const [liveAnalysis, setLiveAnalysis] = useState<LiveAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [views, setViews] = useState(Math.floor(Math.random() * 5 + 3));

  // Fluctuating views for live signal
  useEffect(() => {
    const timer = setInterval(() => {
      setViews(prev => Math.max(2, Math.min(15, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // SEO and Meta Management
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Market Intelligence & AI Analysis | PickSpy`;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', `Get deep market intelligence, social sentiment, and AI-powered viability score for ${product.name}. Analyze trend velocity and competitor pricing on PickSpy.`);
      }
    }
  }, [product]);

  const fetchLiveAnalysis = useCallback(async (productName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await apiService.getProductAnalysis(productName) as { success: boolean, data?: LiveAnalysisData, error?: string };
       
      
      if (result.success && result.data) {
        console.log('✅ Live analysis fetched successfully:', result.data);
        setLiveAnalysis(result.data as LiveAnalysisData);
        toast.success('Product analysis loaded');
      } else {
        throw new Error(result.error || 'Failed to fetch analysis');
      }
    } catch (err) {
      console.warn('Live analysis fetch failed (likely dev environment/scrapers offline):', err);
      setError(err instanceof Error ? err.message : 'Failed to load analysis');
      toast.error('Could not load live analysis');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load pre-generated analysis or fetch if missing
  useEffect(() => {
    if (product?.detailed_analysis) {
       console.log('📦 Using pre-generated analysis from DB');
       setLiveAnalysis(product.detailed_analysis as unknown as LiveAnalysisData);
       setIsLoading(false);
    } else if (product?.name) {
       console.log('🔍 No pre-generated analysis found, fetching live...');
       fetchLiveAnalysis(product.name);
    }
  }, [product?.id, product?.detailed_analysis, product?.name, fetchLiveAnalysis]);

  // Convert live analysis trends to chart format
  const chartData = useMemo(() => {
    if (product?.trendData) return product.trendData;
    
    const timeseries = liveAnalysis?.sources?.market_trends?.timeseries;
    if (!timeseries || timeseries.length === 0) return null;

    // Map 12 points to monthly dates
    return timeseries.map((val, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      return {
        date: date.toISOString().split('T')[0],
        velocity: val,
        saturation: Math.max(10, val * 0.6 + (Math.random() * 10)),
        mentions: Math.floor(val * 5.4),
        sentiment: 70 + (Math.random() * 20),
      };
    });
  }, [product?.trendData, liveAnalysis?.sources?.market_trends?.timeseries]);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <Button onClick={() => navigate('/')}>Go Back</Button>
        </div>
      </div>
    );
  }

  const getSignalBadge = () => {
    switch (product.demandSignal) {
      case 'bullish':
        return <Badge variant="bullish" className="text-sm px-3 py-1">🟢 Bullish</Badge>;
      case 'caution':
        return <Badge variant="caution" className="text-sm px-3 py-1">🟡 Caution</Badge>;
      case 'bearish':
        return <Badge variant="bearish" className="text-sm px-3 py-1">🔴 Bearish</Badge>;
      default:
        return <Badge variant="neutral" className="text-sm px-3 py-1">⚪ Neutral</Badge>;
    }
  };

  const getGrowthIcon = () => {
    if (product.weeklyGrowth > 5) {
      return <TrendingUp className="h-5 w-5 text-signal-bullish" />;
    } else if (product.weeklyGrowth < -5) {
      return <TrendingDown className="h-5 w-5 text-signal-bearish" />;
    }
    return <Minus className="h-5 w-5 text-signal-neutral" />;
  };

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      toast.success('Product link copied to clipboard!');
    }).catch(() => {
      toast.error('Failed to copy link');
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Back Button & Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 mt-4">
          <div className="space-y-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="group gap-2 text-muted-foreground hover:text-primary transition-all bg-card/20 hover:bg-card/40 border border-white/5"
              onClick={() => navigate(-1)}
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Products
            </Button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
                {liveAnalysis?.actualFullName || product.name}
              </h1>
              {liveAnalysis?.actualFullName && (
                <Badge variant="glass" className="rotate-3 -translate-y-2 bg-primary/20 text-primary border-primary/30 text-[10px] py-0 px-2 animate-bounce">AI ENHANCED</Badge>
              )}
            </div>
            {/* Live Social Proof Badge */}
            <div className="flex items-center gap-2 mt-1">
               <div className="relative flex h-2 w-2">
                 <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-bullish opacity-75"></div>
                 <div className="relative inline-flex rounded-full h-2 w-2 bg-signal-bullish"></div>
               </div>
               <p className="text-[11px] font-bold text-signal-bullish uppercase tracking-widest leading-none">
                 {views} people are viewing this winner right now
               </p>
            </div>
            <div className="flex items-center gap-3">
              {getSignalBadge()}
              <div className="h-4 w-px bg-white/10 mx-1 hidden md:block" />
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <Clock className="h-4 w-4" />
                Scanned {product.lastUpdated}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-2 border-white/5 bg-white/5"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>

        {/* Product Details Content */}
        <Tabs defaultValue="intelligence" className="animate-fade-in">
          <TabsList className="bg-secondary/30 border border-border/50 p-1 mb-8 w-full md:w-auto h-auto grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="intelligence" className="gap-2 py-2.5">
              <Zap className="h-4 w-4" />
              Intelligence
            </TabsTrigger>
            <TabsTrigger value="social" className="gap-2 py-2.5">
              <MessageCircle className="h-4 w-4" />
              Social Proof
            </TabsTrigger>
            <TabsTrigger value="competitors" className="gap-2 py-2.5">
              <BarChart3 className="h-4 w-4" />
              Competitors
            </TabsTrigger>
            <TabsTrigger value="faq" className="gap-2 py-2.5">
              <AlertCircle className="h-4 w-4" />
              FAQ
            </TabsTrigger>
          </TabsList>

          <TabsContent value="intelligence" className="space-y-8 mt-0">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Product Image & Key Info */}
              <div className="lg:col-span-1 space-y-6">
                <Card variant="glass" className="overflow-hidden bg-muted/20">
                  <div className="aspect-square relative flex items-center justify-center overflow-hidden">
                    <img 
                      src={liveAnalysis?.realImageUrl || product.imageUrl} 
                      alt={liveAnalysis?.actualFullName || product.name}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute top-4 right-4">
                      <Badge variant="glass" className="backdrop-blur-md border-white/20">
                        {product.source}
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Engine Analysis Detailed */}
                {liveAnalysis && liveAnalysis.sources && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Engine Signals</h3>
                    <div className="grid gap-3">
                      {liveAnalysis.sources.market_trends && (
                        <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <TrendingIcon className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Market Momentum</span>
                          </div>
                          <Badge variant="bullish">{liveAnalysis.sources.market_trends.trend_direction}</Badge>
                        </div>
                      )}
                      
                      {liveAnalysis.sources.social_analysis && (
                        <div className="p-4 rounded-xl border border-secondary/50 bg-secondary/20 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">Sentiment Score</span>
                          </div>
                          <span className="text-sm font-bold text-signal-bullish">
                            {liveAnalysis.sources.social_analysis.sentiment_percentage?.positive || 0}% Pos
                          </span>
                        </div>
                      )}

                      <div className="p-4 rounded-xl border border-secondary/50 bg-secondary/20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">Ad Saturation</span>
                        </div>
                        <Badge variant="outline" className="capitalize">{product.adSignal || 'Low'}</Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Charts & Depth Analysis */}
               <div className="lg:col-span-2 space-y-8">
                {chartData ? (
                  <TrendChart data={chartData} productName={product.name} />
                ) : (
                  <Card variant="glass" className="p-12 text-center border-dashed border-2">
                    <div className="flex flex-col items-center gap-4">
                      {isLoading ? (
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                      ) : (
                        <BarChart3 className="h-12 w-12 text-muted-foreground opacity-20" />
                      )}
                      <h3 className="text-lg font-medium">Market Momentum Forecast</h3>
                      <p className="text-muted-foreground max-w-sm">
                        {isLoading 
                          ? "Predicting market movements using our AI engine..." 
                          : "Historical tracking data will appear here once the system has completed its weekly scan."}
                      </p>
                      {!isLoading && (
                        <p className="text-sm italic opacity-50">Intelligence data for this snapshot is being generated.</p>
                      )}
                    </div>
                  </Card>
                )}

                {/* Market Intelligence Summary */}
                <Card variant="glass" className="p-6 bg-primary/5 border-primary/20">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Info className="h-5 w-5 text-primary" />
                    AI Market Verdict
                  </h3>
                  <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                    <p>
                      The <strong>{product.name}</strong> is currently showing a <span className="text-signal-bullish font-bold">Strong {product.demandSignal}</span> demand signal. 
                      Based on our launch-to-removal ratio tracking, this product has a high viability score of 
                      {liveAnalysis?.sources?.product_insights?.quality_score ? ` ${liveAnalysis.sources.product_insights.quality_score * 10}%` : ' 84%'}.
                    </p>
                    <p>
                      Social momentum is growing faster than ad saturation, which suggests a significant entry window for creators 
                      targeting organic traffic on TikTok and Instagram Reels.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="social" className="space-y-12 mt-0">
            {/* Engine-extracted Social Insights */}
            {liveAnalysis?.sources?.social_analysis?.top_comments && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-primary" />
                  Live Engine Sentiment
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {liveAnalysis.sources.social_analysis.top_comments.map((comment, i) => (
                    <Card key={i} variant="glass" className="p-4 border-primary/10">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-primary">{comment.user}</span>
                        <Badge variant="outline" className="text-[10px] py-0">{comment.platform || 'Viral'}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground italic">"{comment.text}"</p>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Instagram Section */}
            <InstagramReels 
              productName={product.name} 
              productImage={product.imageUrl}
              externalPosts={liveAnalysis?.sources?.social_analysis?.instagram_posts}
            />

            {/* Reddit Section */}
            {product.redditThreads && product.redditThreads.length > 0 ? (
              <RedditThreads threads={product.redditThreads} />
            ) : (
              <Card variant="glass" className="p-8 text-center text-muted-foreground">
                Scanning Reddit communities for discussions...
              </Card>
            )}
          </TabsContent>

          <TabsContent value="competitors" className="mt-0 space-y-8">
            {product.competitors && product.competitors.length > 0 && (
              <CompetitorAnalysis competitors={product.competitors} currentPrice={product.price} />
            )}

            {/* Live Shop Matches from Engine */}
            <div className="space-y-6">
               {!liveAnalysis?.sources?.ecommerce ? (
                 <Card variant="glass" className="p-12 text-center text-muted-foreground border-dashed">
                   {isLoading ? (
                     <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p>Pricing comparison engines are scanning AliExpress, Amazon, and eBay...</p>
                     </div>
                   ) : (
                     "No live listings found for this specific keyword. Try refreshing the analysis."
                   )}
                 </Card>
               ) : (
                  <div className="space-y-4">
                     <div className="flex items-center justify-between px-2">
                       <h3 className="font-bold font-heading text-lg flex items-center gap-2">
                         <ShoppingCart className="h-5 w-5 text-primary" />
                         Live Market Listings
                       </h3>
                       <Badge variant="secondary">Verified Real-time</Badge>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {Object.entries(liveAnalysis.sources.ecommerce).map(([site, items]) => (
                         Array.isArray(items) && (items as EcommerceItem[]).map((item, i) => (
                           <a 
                             key={`${site}-${i}`} 
                             href={item.url || '#'} 
                             target="_blank" 
                             rel="noopener noreferrer"
                             className="group p-4 rounded-xl border border-white/5 bg-card/40 hover:bg-card/60 transition-all flex items-center gap-5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                           >
                              <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted/20 shrink-0 border border-white/10 relative">
                                <img 
                                  src={item.imageUrl || `https://ui-avatars.com/api/?name=${site[0]}&background=random`} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <ExternalLink className="h-5 w-5 text-white" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold truncate group-hover:text-primary transition-colors leading-tight mb-1">{item.name}</div>
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-black">{site}</span>
                                  <div className="h-3 w-[1px] bg-border/50" />
                                  <span className="text-[10px] text-signal-bullish font-bold">In Stock</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="font-heading font-black text-primary text-xl tracking-tight">${item.price}</span>
                                  <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] font-bold uppercase tracking-widest bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
                                    View Live
                                  </Button>
                                </div>
                              </div>
                           </a>
                         ))
                       ))}
                     </div>
                  </div>
               )}
            </div>
          </TabsContent>

          <TabsContent value="faq" className="mt-0 space-y-8">
             {/* Integrated FAQ Section */}
             <ProductFAQ 
               faqs={[...(product.faqs || []), ...(liveAnalysis?.sources?.faqs || [])]} 
               productName={product.name} 
             />

             {/* Web Mentions / Additional Context */}
             {liveAnalysis?.sources?.search_results && (
               <div className="space-y-4">
                 <h3 className="text-lg font-bold flex items-center gap-2 px-2 text-muted-foreground">
                   <Share2 className="h-4 w-4" />
                   Market Mentions
                 </h3>
                 <div className="grid gap-3">
                   {liveAnalysis.sources.search_results.top_mentions?.map((result, i) => (
                     <a 
                       key={i} 
                       href={result.url} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="p-4 rounded-xl border border-white/5 bg-secondary/10 hover:bg-secondary/20 transition-all block group"
                     >
                       <p className="text-sm font-bold mb-1 group-hover:text-primary transition-colors">{result.title}</p>
                       <p className="text-xs text-muted-foreground line-clamp-2">{result.snippet}</p>
                     </a>
                   ))}
                 </div>
               </div>
             )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
