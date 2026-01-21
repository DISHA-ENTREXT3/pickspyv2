import { CompetitorData } from '@/types/product';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Star, 
  Truck,
  ExternalLink,
  ShoppingCart,
} from 'lucide-react';

interface CompetitorAnalysisProps {
  competitors: CompetitorData[];
  currentPrice: number;
}

export const CompetitorAnalysis = ({ competitors, currentPrice }: CompetitorAnalysisProps) => {
  const getTrendIcon = (trend: CompetitorData['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-signal-bullish" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-signal-bearish" />;
      default:
        return <Minus className="h-4 w-4 text-signal-neutral" />;
    }
  };

  const getMarketplaceBadge = (marketplace: CompetitorData['marketplace']) => {
    const colors: Record<string, string> = {
      'Amazon': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'AliExpress': 'bg-red-500/20 text-red-400 border-red-500/30',
      'eBay': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Shopify Store': 'bg-green-500/20 text-green-400 border-green-500/30',
    };
    return (
      <Badge variant="outline" className={colors[marketplace]}>
        {marketplace}
      </Badge>
    );
  };

  const getPriceComparison = (price: number) => {
    const diff = ((price - currentPrice) / currentPrice) * 100;
    if (Math.abs(diff) < 5) return null;
    
    return (
      <span className={`text-xs ${diff > 0 ? 'text-signal-bullish' : 'text-signal-bearish'}`}>
        {diff > 0 ? '+' : ''}{diff.toFixed(0)}%
      </span>
    );
  };

  const averagePrice = competitors.reduce((sum, c) => sum + c.price, 0) / competitors.length;
  const lowestPrice = Math.min(...competitors.map(c => c.price));
  const highestPrice = Math.max(...competitors.map(c => c.price));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span className="text-primary">🎯</span>
          Competitor Analysis
        </h3>
        <Badge variant="outline" className="text-xs">
          {competitors.length} competitors tracked
        </Badge>
      </div>

      {/* Price Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card variant="glass" className="p-4">
          <div className="text-xs text-muted-foreground mb-1">Lowest Price</div>
          <div className="text-2xl font-bold text-signal-bullish">${lowestPrice.toFixed(2)}</div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="text-xs text-muted-foreground mb-1">Average Price</div>
          <div className="text-2xl font-bold">${averagePrice.toFixed(2)}</div>
        </Card>
        <Card variant="glass" className="p-4">
          <div className="text-xs text-muted-foreground mb-1">Highest Price</div>
          <div className="text-2xl font-bold text-signal-bearish">${highestPrice.toFixed(2)}</div>
        </Card>
      </div>

      {/* Competitor Table */}
      <Card variant="glass">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Product</TableHead>
                <TableHead className="text-muted-foreground">Marketplace</TableHead>
                <TableHead className="text-muted-foreground text-right">Price</TableHead>
                <TableHead className="text-muted-foreground text-center">Rating</TableHead>
                <TableHead className="text-muted-foreground text-center">Shipping</TableHead>
                <TableHead className="text-muted-foreground text-right">Est. Sales</TableHead>
                <TableHead className="text-muted-foreground text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitors.map((competitor) => (
                <TableRow key={competitor.id} className="border-border/50 hover:bg-secondary/30">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium truncate max-w-[200px]">{competitor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getMarketplaceBadge(competitor.marketplace)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-semibold">${competitor.price.toFixed(2)}</span>
                      {getPriceComparison(competitor.price)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span>{competitor.rating}</span>
                      <span className="text-xs text-muted-foreground">({competitor.reviews.toLocaleString()})</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Truck className="h-3.5 w-3.5" />
                      <span>{competitor.shippingDays}d</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {competitor.estimatedSales}
                  </TableCell>
                  <TableCell className="text-center">
                    {getTrendIcon(competitor.trend)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card variant="glass">
        <CardHeader>
          <CardTitle className="text-lg">💡 Key Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-signal-bullish/10 border border-signal-bullish/20">
            <TrendingUp className="h-5 w-5 text-signal-bullish mt-0.5" />
            <div>
              <div className="font-medium text-sm">Price Positioning Opportunity</div>
              <div className="text-sm text-muted-foreground">
                Current target price (${currentPrice}) is {currentPrice < averagePrice ? 'below' : 'above'} market average. 
                {currentPrice < averagePrice 
                  ? ' Good margin potential while staying competitive.' 
                  : ' Consider value-add features to justify premium.'}
              </div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50">
            <Truck className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <div className="font-medium text-sm">Shipping Advantage</div>
              <div className="text-sm text-muted-foreground">
                AliExpress competitors have 12-15 day shipping. US-based fulfillment could be a key differentiator.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
