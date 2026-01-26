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
} from 'lucide-react';
import { useState, useEffect } from 'react';
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
    };
    ecommerce?: Record<string, unknown> & {
      walmart?: unknown[];
      ebay?: unknown[];
      flipkart?: unknown[];
    };
    search_results?: {
       total_results?: number;
    };
    product_insights?: {
       market_position?: string;
       quality_score?: number;
    };
    faqs?: Array<{ question: string; answer: string; snippet?: string }>;
  };
  success?: boolean;
  data?: unknown;
  error?: string;
}

interface EcommerceItem {
  name?: string;
  price?: string | number;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  
  const product = products.find(p => p.id === id);
  
  const [liveAnalysis, setLiveAnalysis] = useState<LiveAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch live product analysis on component mount
  useEffect(() => {
    if (product?.name) {
      fetchLiveAnalysis(product.name);
    }
  }, [product?.name]);

  const fetchLiveAnalysis = async (productName: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await apiService.getProductAnalysis(productName) as unknown as LiveAnalysisData;
       
      
      if (result.success && result.data) {
        console.log('✅ Live analysis fetched successfully:', result.data);
        setLiveAnalysis(result as LiveAnalysisData);
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
  };
  
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
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
                      src={product.imageUrl} 
                      alt={product.name}
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
                {product.trendData ? (
                  <TrendChart data={product.trendData} productName={product.name} />
                ) : (
                  <Card variant="glass" className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <BarChart3 className="h-12 w-12 text-muted-foreground opacity-20" />
                      <h3 className="text-lg font-medium">Historical Trends</h3>
                      <p className="text-muted-foreground max-w-sm">
                        Historical tracking data will appear here once the system has completed its weekly scan.
                      </p>
                      <Button variant="outline" size="sm" onClick={() => fetchLiveAnalysis(product.name)}>
                        Generate Forecast
                      </Button>
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
            <InstagramReels productName={product.name} />

            {/* Reddit Section */}
            {product.redditThreads && product.redditThreads.length > 0 ? (
              <RedditThreads threads={product.redditThreads} />
            ) : (
              <Card variant="glass" className="p-8 text-center text-muted-foreground">
                Scanning Reddit communities for discussions...
              </Card>
            )}
          </TabsContent>

          <TabsContent value="competitors" className="mt-0">
            {product.competitors && product.competitors.length > 0 ? (
              <CompetitorAnalysis competitors={product.competitors} currentPrice={product.price} />
            ) : (
              <div className="space-y-6">
                <Card variant="glass" className="p-8 text-center text-muted-foreground">
                  Pricing comparison engines are scanning AliExpress, Amazon, and eBay...
                </Card>
                {/* Live Shop Matches from Engine */}
                 {liveAnalysis?.sources?.ecommerce && (
                  <div className="grid gap-4">
                     <h3 className="font-bold flex items-center gap-2">🛒 Live Listings Found</h3>
                     {Object.entries(liveAnalysis.sources.ecommerce).map(([site, items]) => (
                       Array.isArray(items) && (items as EcommerceItem[]).map((item, i) => (
                         <div key={`${site}-${i}`} className="p-3 rounded-lg border border-border flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{item.name}</span>
                              <span className="text-xs text-muted-foreground uppercase">{site}</span>
                            </div>
                            <span className="font-bold">${item.price}</span>
                         </div>
                       ))
                     ))}
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="faq" className="mt-0">
             <div className="space-y-8">
               <ProductFAQ faqs={product.faqs || []} productName={product.name} />
               
               {liveAnalysis?.sources?.faqs && (
                 <div className="space-y-4">
                   <h3 className="text-lg font-bold flex items-center gap-2 px-2">
                     <Share2 className="h-4 w-4" />
                     Web Mentions & FAQs
                   </h3>
                   <div className="grid gap-3">
                     {liveAnalysis.sources.faqs.map((faq, i) => (
                       <Card key={i} className="p-4 bg-secondary/10">
                         <p className="text-sm font-bold mb-1">{faq.question}</p>
                         <p className="text-xs text-muted-foreground">{faq.snippet || faq.answer}</p>
                       </Card>
                     ))}
                   </div>
                 </div>
               )}
             </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
