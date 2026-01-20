import { useNavigate } from 'react-router-dom';
import { Product } from '@/types/product';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { X, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CompareBarProps {
  products: Product[];
  onRemove: (productId: string) => void;
  onClear: () => void;
}

export const CompareBar = ({ products, onRemove, onClear }: CompareBarProps) => {
  const navigate = useNavigate();

  if (products.length === 0) return null;

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 z-50",
      "bg-card/95 backdrop-blur-xl border-t border-border/50",
      "animate-slide-up"
    )}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <span className="font-medium hidden sm:inline">Compare</span>
              <Badge variant="outline" className="text-xs">
                {products.length}/4
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/80 text-sm"
                >
                  <span className="truncate max-w-[100px] sm:max-w-[150px]">{product.name}</span>
                  <button
                    onClick={() => onRemove(product.id)}
                    className="hover:text-signal-bearish transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={onClear}
            >
              Clear
            </Button>
            <Button 
              variant="hero" 
              size="sm"
              onClick={() => navigate(`/compare?ids=${products.map(p => p.id).join(',')}`)}
              disabled={products.length < 2}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Compare {products.length >= 2 ? `(${products.length})` : ''}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
