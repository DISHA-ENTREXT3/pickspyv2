import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/contexts/ProductContext';
import { getThreadsForProduct } from '@/data/mockRedditThreads';
import { getTrendDataForProduct, getCompetitorsForProduct } from '@/data/mockTrendData';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { TrendChart } from '@/components/product/TrendChart';
import { RedditThreads } from '@/components/product/RedditThreads';
import { CompetitorAnalysis } from '@/components/product/CompetitorAnalysis';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  MessageCircle,
  Clock,
  Zap,
  Target,
  BarChart3,
  Users,
} from 'lucide-react';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products } = useProducts();
  
  const product = products.find(p => p.id === id);
  
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

  const threads = getThreadsForProduct(product.id);
  const trendData = getTrendDataForProduct(product.id);
  const competitors = getCompetitorsForProduct(product.id);

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
        <Button 
          variant="ghost" 
          className="mb-6 -ml-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

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
              <Button variant="hero">
                <Zap className="h-4 w-4 mr-2" />
                Analyze with AI
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

        {/* Reddit Themes */}
        <Card variant="glass" className="mb-8 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Top Reddit Themes</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.topRedditThemes.map((theme) => (
              <Badge key={theme} variant="outline" className="text-sm">
                {theme}
              </Badge>
            ))}
          </div>
        </Card>

        {/* Tabbed Content */}
        <Tabs defaultValue="trends" className="space-y-6">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger value="trends" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <BarChart3 className="h-4 w-4 mr-2" />
              Trend Analysis
            </TabsTrigger>
            <TabsTrigger value="reddit" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MessageCircle className="h-4 w-4 mr-2" />
              Reddit Threads ({threads.length})
            </TabsTrigger>
            <TabsTrigger value="competitors" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Target className="h-4 w-4 mr-2" />
              Competitors ({competitors.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6 animate-fade-in">
            <TrendChart data={trendData} productName={product.name} />
          </TabsContent>

          <TabsContent value="reddit" className="animate-fade-in">
            <RedditThreads threads={threads} />
          </TabsContent>

          <TabsContent value="competitors" className="animate-fade-in">
            <CompetitorAnalysis competitors={competitors} currentPrice={product.price} />
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
