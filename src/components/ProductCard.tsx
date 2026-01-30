import * as React from 'react';
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
  const [imageError, setImageError] = React.useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
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
      <div className="aspect-square w-full overflow-hidden bg-secondary/20 relative flex items-center justify-center">
        {!imageError && product.imageUrl && product.imageUrl !== '/placeholder.svg' ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full bg-gradient-to-br from-secondary/50 to-background/50">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-2 shadow-sm">
              <span className="text-2xl font-bold text-primary tracking-tighter">
                {getInitials(product.name)}
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold opacity-50">
              PickSpy Intel
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.socialSignals?.slice(0, 2).map((signal) => (
            <Badge key={signal} variant="glass" className="text-[9px] py-0 px-1.5 border-primary/20 bg-background/60 backdrop-blur-md">
              ✨ {signal}
            </Badge>
          ))}
        </div>
        <div className="absolute bottom-2 left-2 z-10">
          {getAdBadge()}
        </div>
      </div>

      <CardHeader className="pb-3 pt-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base leading-tight truncate group-hover:text-primary transition-colors pr-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xl font-bold text-foreground">${product.price}</span>
              <div className="flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded-md border border-border/50">
                <Star className="h-2.5 w-2.5 fill-primary text-primary" />
                <span className="text-[10px] font-bold">{product.rating}</span>
                <span className="text-[9px] text-muted-foreground">({product.reviewCount})</span>
              </div>
            </div>
          </div>
          <div className="shrink-0">
            {getSignalBadge()}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Velocity & Saturation bars */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Velocity</span>
              <span className={`text-xs font-bold ${getVelocityColor()}`}>
                {product.velocityScore}
              </span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-700"
                style={{ width: `${product.velocityScore}%` }}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground">Saturation</span>
              <span className={`text-xs font-bold ${getSaturationColor()}`}>
                {product.saturationScore}%
              </span>
            </div>
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ${
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
        <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-secondary/30 border border-border/40">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-tighter">Weekly Growth</span>
          <div className="flex items-center gap-1.5">
            {getGrowthIcon()}
            <span className={`text-sm font-bold ${
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
            <div className="flex items-center gap-1.5 text-muted-foreground font-medium">
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="text-[11px]">{product.redditMentions} mentions</span>
            </div>
            <span className={`text-[11px] font-bold ${
              product.sentimentScore > 50 ? 'text-signal-bullish' :
              product.sentimentScore < 0 ? 'text-signal-bearish' : 'text-signal-caution'
            }`}>
              +{product.sentimentScore} sentiment
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {product.topRedditThemes.slice(0, 2).map((theme) => (
              <span 
                key={theme}
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-secondary-foreground border border-border/30"
              >
                {theme}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-bullish opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-signal-bullish"></span>
            </div>
            <span className="text-signal-bullish uppercase tracking-widest">LIVE</span>
            <span className="opacity-40">•</span>
            <span>{Math.floor(Math.random() * 5 + 1)} views</span>
            <Badge variant="outline" className="h-4 px-1.5 bg-secondary/50 text-[8px] uppercase border-border/50 font-bold ml-1">
              {product.source || 'Intel'}
            </Badge>
          </div>
          <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 text-[10px] font-bold"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              Details
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 text-[10px] font-bold text-primary"
              onClick={() => onAnalyze?.(product)}
            >
              Analyze
              <ArrowUpRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
