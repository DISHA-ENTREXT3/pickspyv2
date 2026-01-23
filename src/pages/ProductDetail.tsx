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
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface LiveAnalysisData {
  sources?: {
    market_trends?: Record<string, unknown> & {
      trend_direction?: string;
      trend_velocity_percent?: number;
    };
    social_analysis?: Record<string, unknown> & {
       sentiment_percentage?: { positive: number; negative: number };
    };
    ecommerce?: Record<string, unknown> & {
      walmart?: unknown[];
      ebay?: unknown[];
      flipkart?: unknown[];
    };
    search_results?: Record<string, unknown> & {
       total_results?: number;
    };
    product_insights?: Record<string, unknown> & {
       market_position?: string;
       quality_score?: number;
       category?: string;
    };
  };
  success?: boolean;
  data?: unknown;
  error?: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  
  const product = products.find(p => p.id === id);
  
  const [liveAnalysis, setLiveAnalysis] = useState<LiveAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

        {/* Product Header */}
        <div className="mb-8 animate-slide-up">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
                {getSignalBadge()}
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <span className="capitalize">{product.category.replace('-', ' ')}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Updated {product.lastUpdated}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-primary">${product.price}</span>
              <Button variant="hero" disabled={isLoading} onClick={() => fetchLiveAnalysis(product.name)}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading Analysis...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Refresh Analysis
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card variant="glass" className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Velocity Score</div>
                  <div className="text-2xl font-bold">{product.velocityScore}</div>
                </div>
              </div>
            </Card>
            <Card variant="glass" className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-signal-caution/20">
                  <Target className="h-5 w-5 text-signal-caution" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Saturation</div>
                  <div className="text-2xl font-bold">{product.saturationScore}%</div>
                </div>
              </div>
            </Card>
            <Card variant="glass" className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-signal-bullish/20">
                  {getGrowthIcon()}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Weekly Growth</div>
                  <div className={`text-2xl font-bold ${
                    product.weeklyGrowth > 0 ? 'text-signal-bullish' : 
                    product.weeklyGrowth < 0 ? 'text-signal-bearish' : ''
                  }`}>
                    {product.weeklyGrowth > 0 ? '+' : ''}{product.weeklyGrowth}%
                  </div>
                </div>
              </div>
            </Card>
            <Card variant="glass" className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Reddit Mentions</div>
                  <div className="text-2xl font-bold">{product.redditMentions}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Live Analysis Status */}
        {error && (
          <Card variant="glass" className="mb-8 p-4 border-signal-bearish/50">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-signal-bearish mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-signal-bearish">Analysis Status</p>
                <p className="text-sm text-muted-foreground mt-1">{error}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Live Analysis Data */}
        {liveAnalysis && liveAnalysis.sources && (
          <Card variant="glass" className="mb-8 p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center gap-2 mb-4">
              <Loader2 className="h-4 w-4 text-primary animate-spin" />
              <span className="text-sm font-medium">Live Market Intelligence</span>
              <span className="text-xs text-muted-foreground ml-auto">Real-time data from scrapers</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Market Trends */}
              {liveAnalysis.sources.market_trends && (
                <Card variant="default" className="p-3">
                  <div className="text-xs font-medium text-primary mb-2">📈 Market Trends</div>
                  <div className="space-y-1 text-xs">
                    <div>Direction: <span className="font-semibold">{liveAnalysis.sources.market_trends.trend_direction || 'Analyzing...'}</span></div>
                    <div>Velocity: <span className="font-semibold text-signal-bullish">{liveAnalysis.sources.market_trends.trend_velocity_percent?.toFixed(1)}%</span></div>
                  </div>
                </Card>
              )}

              {/* Social Analysis */}
              {liveAnalysis.sources.social_analysis && (
                <Card variant="default" className="p-3">
                  <div className="text-xs font-medium text-primary mb-2">📱 Social Sentiment</div>
                  <div className="space-y-1 text-xs">
                    <div>Positive: <span className="font-semibold text-signal-bullish">{liveAnalysis.sources.social_analysis.sentiment_percentage?.positive || 0}%</span></div>
                    <div>Negative: <span className="font-semibold text-signal-bearish">{liveAnalysis.sources.social_analysis.sentiment_percentage?.negative || 0}%</span></div>
                  </div>
                </Card>
              )}

              {/* Ecommerce Data */}
              {liveAnalysis.sources.ecommerce && (
                <Card variant="default" className="p-3">
                  <div className="text-xs font-medium text-primary mb-2">🛒 Ecommerce</div>
                  <div className="space-y-1 text-xs">
                    <div>Walmart: <span className="font-semibold">{liveAnalysis.sources.ecommerce.walmart?.length || 0} listings</span></div>
                    <div>eBay: <span className="font-semibold">{liveAnalysis.sources.ecommerce.ebay?.length || 0} listings</span></div>
                    <div>Flipkart: <span className="font-semibold">{liveAnalysis.sources.ecommerce.flipkart?.length || 0} listings</span></div>
                  </div>
                </Card>
              )}

              {/* Search Results */}
              {liveAnalysis.sources.search_results && (
                <Card variant="default" className="p-3">
                  <div className="text-xs font-medium text-primary mb-2">🔎 Web Search</div>
                  <div className="space-y-1 text-xs">
                    <div>Results: <span className="font-semibold">{liveAnalysis.sources.search_results.total_results || 0}</span></div>
                    <div className="text-muted-foreground">Real-time web mentions tracked</div>
                  </div>
                </Card>
              )}

              {/* Product Insights */}
              {liveAnalysis.sources.product_insights && (
                <Card variant="default" className="p-3 md:col-span-2">
                  <div className="text-xs font-medium text-primary mb-2">💡 Product Insights</div>
                  <div className="space-y-1 text-xs">
                    <div>Market Position: <span className="font-semibold capitalize">{liveAnalysis.sources.product_insights.market_position || 'Analyzing...'}</span></div>
                    <div>Quality Score: <span className="font-semibold">{liveAnalysis.sources.product_insights.quality_score?.toFixed(1) || 'N/A'}/10</span></div>
                    <div>Category: <span className="font-semibold capitalize">{liveAnalysis.sources.product_insights.category || 'N/A'}</span></div>
                  </div>
                </Card>
              )}
            </div>
          </Card>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
