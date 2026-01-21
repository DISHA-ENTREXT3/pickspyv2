import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProducts } from '@/contexts/ProductContext';
import { generateTrendData } from '@/lib/dataGenerators';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { 
  ArrowLeft, 
  Plus, 
  X, 
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  MessageCircle,
  Target,
  Zap,
  Trophy,
  AlertTriangle,
} from 'lucide-react';
import { Product } from '@/types/product';

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--signal-bullish))',
  'hsl(var(--signal-caution))',
  'hsl(var(--signal-bearish))',
];

const Compare = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products: allProducts } = useProducts();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];
    const products = ids
      .map(id => allProducts.find(p => p.id === id))
      .filter((p): p is Product => p !== undefined);
    setSelectedProducts(products);
  }, [searchParams, allProducts]);

  const addProduct = (productId: string) => {
    if (selectedProducts.length >= 4) return;
    const product = allProducts.find(p => p.id === productId);
    if (product && !selectedProducts.find(p => p.id === productId)) {
      const newProducts = [...selectedProducts, product];
      setSearchParams({ ids: newProducts.map(p => p.id).join(',') });
    }
  };

  const removeProduct = (productId: string) => {
    const newProducts = selectedProducts.filter(p => p.id !== productId);
    if (newProducts.length > 0) {
      setSearchParams({ ids: newProducts.map(p => p.id).join(',') });
    } else {
      setSearchParams({});
    }
  };

  const availableProducts = allProducts.filter(
    p => !selectedProducts.find(sp => sp.id === p.id)
  );

  const getSignalBadge = (signal: Product['demandSignal']) => {
    switch (signal) {
      case 'bullish':
        return <Badge variant="bullish">🟢 Bullish</Badge>;
      case 'caution':
        return <Badge variant="caution">🟡 Caution</Badge>;
      case 'bearish':
        return <Badge variant="bearish">🔴 Bearish</Badge>;
      default:
        return <Badge variant="neutral">⚪ Neutral</Badge>;
    }
  };

  // Prepare radar chart data
  const radarData = [
    { metric: 'Velocity', fullMark: 100 },
    { metric: 'Sentiment', fullMark: 100 },
    { metric: 'Mentions', fullMark: 100 },
    { metric: 'Growth', fullMark: 100 },
    { metric: 'Low Saturation', fullMark: 100 },
  ].map(item => {
    const data: Record<string, string | number> = { metric: item.metric };
    selectedProducts.forEach(product => {
      switch (item.metric) {
        case 'Velocity':
          data[product.name] = product.velocityScore;
          break;
        case 'Sentiment':
          data[product.name] = Math.max(0, product.sentimentScore);
          break;
        case 'Mentions':
          data[product.name] = Math.min(100, (product.redditMentions / 15));
          break;
        case 'Growth':
          data[product.name] = Math.max(0, Math.min(100, 50 + product.weeklyGrowth * 2));
          break;
        case 'Low Saturation':
          data[product.name] = 100 - product.saturationScore;
          break;
      }
    });
    return data;
  });

  // Prepare trend comparison data
  const trendComparisonData = selectedProducts.length > 0
    ? generateTrendData(selectedProducts[0].id, selectedProducts[0].velocityScore, selectedProducts[0].weeklyGrowth).map((point, index) => {
        const data: Record<string, string | number> = { date: point.date };
        selectedProducts.forEach(product => {
          const productTrend = generateTrendData(product.id, product.velocityScore, product.weeklyGrowth);
          data[`${product.name} Velocity`] = productTrend[index]?.velocity || 0;
        });
        return data;
      })
    : [];

  // Calculate winner in each category
  const getWinner = (metric: keyof Product | 'sentiment') => {
    if (selectedProducts.length === 0) return null;
    let winner = selectedProducts[0];
    selectedProducts.forEach(p => {
      switch (metric) {
        case 'velocityScore':
          if (p.velocityScore > winner.velocityScore) winner = p;
          break;
        case 'saturationScore':
          if (p.saturationScore < winner.saturationScore) winner = p;
          break;
        case 'weeklyGrowth':
          if (p.weeklyGrowth > winner.weeklyGrowth) winner = p;
          break;
        case 'redditMentions':
          if (p.redditMentions > winner.redditMentions) winner = p;
          break;
        case 'sentiment':
          if (p.sentimentScore > winner.sentimentScore) winner = p;
          break;
      }
    });
    return winner.id;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pt-24">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          className="mb-6 -ml-2"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              Product Comparison
            </h1>
            <p className="text-muted-foreground mt-1">
              Compare up to 4 products side-by-side
            </p>
          </div>
          
          {selectedProducts.length < 4 && availableProducts.length > 0 && (
            <Select onValueChange={addProduct}>
              <SelectTrigger className="w-[250px] bg-secondary/50">
                <Plus className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Add product to compare" />
              </SelectTrigger>
              <SelectContent>
                {availableProducts.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {selectedProducts.length === 0 ? (
          <Card variant="glass" className="p-12 text-center">
            <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No products selected</h2>
            <p className="text-muted-foreground mb-6">
              Add products to start comparing their metrics and trends
            </p>
            <Select onValueChange={addProduct}>
              <SelectTrigger className="w-[250px] mx-auto bg-secondary/50">
                <Plus className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Add first product" />
              </SelectTrigger>
              <SelectContent>
                {allProducts.map(product => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Product Cards Row */}
            <div className={`grid gap-4 ${
              selectedProducts.length === 1 ? 'grid-cols-1 max-w-md' :
              selectedProducts.length === 2 ? 'grid-cols-2' :
              selectedProducts.length === 3 ? 'grid-cols-3' :
              'grid-cols-4'
            }`}>
              {selectedProducts.map((product, index) => (
                <Card key={product.id} variant="glass" className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 h-6 w-6 p-0"
                    onClick={() => removeProduct(product.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <CardHeader className="pb-2">
                    <div 
                      className="h-1 rounded-full mb-3" 
                      style={{ backgroundColor: CHART_COLORS[index] }}
                    />
                    <CardTitle className="text-lg leading-tight pr-6">{product.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl font-bold">${product.price}</span>
                      {getSignalBadge(product.demandSignal)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Metrics Comparison Table */}
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Key Metrics Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">Metric</th>
                        {selectedProducts.map((product, index) => (
                          <th key={product.id} className="text-center py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <div 
                                className="h-3 w-3 rounded-full" 
                                style={{ backgroundColor: CHART_COLORS[index] }}
                              />
                              <span className="font-medium truncate max-w-[100px]">{product.name}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/30">
                        <td className="py-4 px-4 text-muted-foreground">Velocity Score</td>
                        {selectedProducts.map(product => (
                          <td key={product.id} className="text-center py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <span className={`text-lg font-bold ${
                                product.velocityScore >= 75 ? 'text-signal-bullish' :
                                product.velocityScore >= 50 ? 'text-signal-caution' : 'text-signal-bearish'
                              }`}>
                                {product.velocityScore}
                              </span>
                              {getWinner('velocityScore') === product.id && (
                                <Trophy className="h-4 w-4 text-amber-400" />
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/30">
                        <td className="py-4 px-4 text-muted-foreground">Saturation</td>
                        {selectedProducts.map(product => (
                          <td key={product.id} className="text-center py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <span className={`text-lg font-bold ${
                                product.saturationScore <= 40 ? 'text-signal-bullish' :
                                product.saturationScore <= 70 ? 'text-signal-caution' : 'text-signal-bearish'
                              }`}>
                                {product.saturationScore}%
                              </span>
                              {getWinner('saturationScore') === product.id && (
                                <Trophy className="h-4 w-4 text-amber-400" />
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/30">
                        <td className="py-4 px-4 text-muted-foreground">Weekly Growth</td>
                        {selectedProducts.map(product => (
                          <td key={product.id} className="text-center py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              {product.weeklyGrowth > 5 ? (
                                <TrendingUp className="h-4 w-4 text-signal-bullish" />
                              ) : product.weeklyGrowth < -5 ? (
                                <TrendingDown className="h-4 w-4 text-signal-bearish" />
                              ) : (
                                <Minus className="h-4 w-4 text-signal-neutral" />
                              )}
                              <span className={`text-lg font-bold ${
                                product.weeklyGrowth > 0 ? 'text-signal-bullish' :
                                product.weeklyGrowth < 0 ? 'text-signal-bearish' : ''
                              }`}>
                                {product.weeklyGrowth > 0 ? '+' : ''}{product.weeklyGrowth}%
                              </span>
                              {getWinner('weeklyGrowth') === product.id && (
                                <Trophy className="h-4 w-4 text-amber-400" />
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr className="border-b border-border/30">
                        <td className="py-4 px-4 text-muted-foreground">Reddit Mentions</td>
                        {selectedProducts.map(product => (
                          <td key={product.id} className="text-center py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <MessageCircle className="h-4 w-4 text-muted-foreground" />
                              <span className="text-lg font-bold">{product.redditMentions}</span>
                              {getWinner('redditMentions') === product.id && (
                                <Trophy className="h-4 w-4 text-amber-400" />
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td className="py-4 px-4 text-muted-foreground">Sentiment Score</td>
                        {selectedProducts.map(product => (
                          <td key={product.id} className="text-center py-4 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <span className={`text-lg font-bold ${
                                product.sentimentScore > 50 ? 'text-signal-bullish' :
                                product.sentimentScore < 0 ? 'text-signal-bearish' : 'text-signal-caution'
                              }`}>
                                {product.sentimentScore > 0 ? '+' : ''}{product.sentimentScore}
                              </span>
                              {getWinner('sentiment') === product.id && (
                                <Trophy className="h-4 w-4 text-amber-400" />
                              )}
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Radar Chart */}
            {selectedProducts.length >= 2 && (
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Performance Radar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis 
                          dataKey="metric" 
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                        />
                        <PolarRadiusAxis 
                          angle={90} 
                          domain={[0, 100]} 
                          tick={{ fill: 'hsl(var(--muted-foreground))' }}
                        />
                        {selectedProducts.map((product, index) => (
                          <Radar
                            key={product.id}
                            name={product.name}
                            dataKey={product.name}
                            stroke={CHART_COLORS[index]}
                            fill={CHART_COLORS[index]}
                            fillOpacity={0.2}
                            strokeWidth={2}
                          />
                        ))}
                        <Legend />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Velocity Trend Comparison */}
            {selectedProducts.length >= 2 && (
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Velocity Trend Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trendComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                        <XAxis 
                          dataKey="date" 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                        />
                        <YAxis 
                          stroke="hsl(var(--muted-foreground))" 
                          fontSize={12}
                          domain={[0, 100]}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'hsl(var(--card))',
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                          }}
                        />
                        <Legend />
                        {selectedProducts.map((product, index) => (
                          <Line
                            key={product.id}
                            type="monotone"
                            dataKey={`${product.name} Velocity`}
                            stroke={CHART_COLORS[index]}
                            strokeWidth={2}
                            dot={{ fill: CHART_COLORS[index], strokeWidth: 0, r: 4 }}
                          />
                        ))}
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Summary */}
            {selectedProducts.length >= 2 && (
              <Card variant="glass">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-signal-caution" />
                    Quick Verdict
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {selectedProducts.map((product, index) => {
                      const score = (
                        product.velocityScore * 0.3 +
                        (100 - product.saturationScore) * 0.25 +
                        Math.min(100, Math.max(0, product.sentimentScore)) * 0.2 +
                        Math.min(100, Math.max(0, 50 + product.weeklyGrowth * 2)) * 0.25
                      );
                      
                      return (
                        <div 
                          key={product.id}
                          className="p-4 rounded-lg border border-border/50 bg-secondary/30"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <div 
                              className="h-3 w-3 rounded-full" 
                              style={{ backgroundColor: CHART_COLORS[index] }}
                            />
                            <span className="font-semibold">{product.name}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">Overall Score</span>
                            <span className={`text-2xl font-bold ${
                              score >= 70 ? 'text-signal-bullish' :
                              score >= 50 ? 'text-signal-caution' : 'text-signal-bearish'
                            }`}>
                              {score.toFixed(0)}/100
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            {score >= 70 ? '✅ Strong candidate for dropshipping' :
                             score >= 50 ? '⚠️ Proceed with caution' :
                             '❌ Consider alternatives'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Compare;
