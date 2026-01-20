import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, MessageCircle, Clock, ArrowUpRight, Eye, Check, ShoppingCart, Info, Star } from 'lucide-react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Product } from '@/types/product';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  onAnalyze?: (product: Product) => void;
  isSelected?: boolean;
  onToggleCompare?: (product: Product) => void;
  compareDisabled?: boolean;
}

export const ProductCard = ({ 
  product, 
  onAnalyze, 
  isSelected = false, 
  onToggleCompare,
  compareDisabled = false,
}: ProductCardProps) => {
  const navigate = useNavigate();
  const getAdBadge = () => {
    switch (product.adSignal) {
      case 'high':
        return <Badge variant="premium">🔥 Hot Ads</Badge>;
      case 'medium':
        return <Badge variant="secondary">📢 Active Ads</Badge>;
      default:
        return <Badge variant="outline">🌑 Low Ads</Badge>;
    }
  };

  const getSignalBadge = () => {
    switch (product.demandSignal) {
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

  const getGrowthIcon = () => {
    if (product.weeklyGrowth > 5) {
      return <TrendingUp className="h-4 w-4 text-signal-bullish" />;
    } else if (product.weeklyGrowth < -5) {
      return <TrendingDown className="h-4 w-4 text-signal-bearish" />;
    }
    return <Minus className="h-4 w-4 text-signal-neutral" />;
  };

  const getVelocityColor = () => {
    if (product.velocityScore >= 75) return 'text-signal-bullish';
    if (product.velocityScore >= 50) return 'text-signal-caution';
    return 'text-signal-bearish';
  };

  const getSaturationColor = () => {
    if (product.saturationScore <= 40) return 'text-signal-bullish';
    if (product.saturationScore <= 70) return 'text-signal-caution';
    return 'text-signal-bearish';
  };

  return (
    <Card 
      variant="interactive" 
      className={cn(
        "group overflow-hidden relative",
        isSelected && "ring-2 ring-primary"
      )}
    >
      {/* Compare checkbox */}
      {onToggleCompare && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (!compareDisabled || isSelected) {
              onToggleCompare(product);
            }
          }}
          disabled={compareDisabled && !isSelected}
          className={cn(
            "absolute top-3 right-3 z-10 h-6 w-6 rounded-md border-2 flex items-center justify-center transition-all",
            isSelected 
              ? "bg-primary border-primary text-primary-foreground" 
              : "border-border bg-background/80 hover:border-primary",
            compareDisabled && !isSelected && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSelected && <Check className="h-4 w-4" />}
        </button>
      )}

      {/* Product Image Thumbnail */}
      <div className="aspect-square w-full overflow-hidden bg-muted/30 relative">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=400&h=400&auto=format&fit=crop';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-2 left-2 z-10 transition-transform group-hover:translate-x-1">
          {getAdBadge()}
        </div>
      </div>

      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0 pr-8">
            <h3 className="font-semibold text-lg leading-tight truncate group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-2xl font-bold">${product.price}</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-primary text-primary" />
                <span className="text-xs font-medium">{product.rating}</span>
                <span className="text-[10px] text-muted-foreground">({product.reviewCount})</span>
              </div>
              <span className="text-xs text-muted-foreground capitalize ml-auto">{product.category.replace('-', ' ')}</span>
            </div>
          </div>
          {getSignalBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Velocity & Saturation bars */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Velocity</span>
              <span className={`text-sm font-semibold ${getVelocityColor()}`}>
                {product.velocityScore}
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary to-signal-bullish rounded-full transition-all duration-500"
                style={{ width: `${product.velocityScore}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Saturation</span>
              <span className={`text-sm font-semibold ${getSaturationColor()}`}>
                {product.saturationScore}%
              </span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  product.saturationScore <= 40 
                    ? 'bg-signal-bullish' 
                    : product.saturationScore <= 70 
                      ? 'bg-signal-caution' 
                      : 'bg-signal-bearish'
                }`}
                style={{ width: `${product.saturationScore}%` }}
              />
            </div>
          </div>
        </div>

        {/* Growth indicator */}
        <div className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/50">
          <span className="text-sm text-muted-foreground">Weekly Growth</span>
          <div className="flex items-center gap-1.5">
            {getGrowthIcon()}
            <span className={`font-semibold ${
              product.weeklyGrowth > 0 ? 'text-signal-bullish' : 
              product.weeklyGrowth < 0 ? 'text-signal-bearish' : ''
            }`}>
              {product.weeklyGrowth > 0 ? '+' : ''}{product.weeklyGrowth}%
            </span>
          </div>
        </div>

        {/* Reddit sentiment */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span className="text-xs">{product.redditMentions} mentions</span>
            </div>
            <span className={`text-xs font-medium ${
              product.sentimentScore > 50 ? 'text-signal-bullish' :
              product.sentimentScore < 0 ? 'text-signal-bearish' : 'text-signal-caution'
            }`}>
              {product.sentimentScore > 0 ? '+' : ''}{product.sentimentScore} sentiment
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.topRedditThemes.slice(0, 3).map((theme) => (
              <span 
                key={theme}
                className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            {product.lastUpdated}
            {product.source && (
              <Badge variant="outline" className="ml-2 h-5 px-1.5 bg-secondary/30 text-[10px] uppercase border-border/50">
                {product.source}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <Eye className="h-3.5 w-3.5 mr-1" />
              Details
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onAnalyze?.(product)}
            >
              Analyze
              <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
