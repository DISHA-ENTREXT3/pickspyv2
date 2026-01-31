import { useState, useMemo, memo } from 'react';
import { RefreshCw, TrendingUp } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { SearchFilters } from './SearchFilters';
import { CompareBar } from './CompareBar';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { useProducts } from '@/contexts/ProductContext';
import { FilterState, Product } from '@/types/product';

interface ProductGridProps {
  onAnalyze?: (product: Product) => void;
}

// Memoize the ProductCard to prevent unnecessary re-renders in a large grid
const MemoizedProductCard = memo(ProductCard);

export const ProductGrid = ({ onAnalyze }: ProductGridProps) => {
  const { toast } = useToast();
  const { products, isLoading, refreshDates, selectedDate, setSelectedDate } = useProducts();
  const [filters, setFilters] = useState<FilterState>({
    category: 'all',
    priceBand: 'all',
    trendVelocity: 'all',
    saturation: 'all',
    searchQuery: '',
  });

  const [compareProducts, setCompareProducts] = useState<Product[]>([]);

  const toggleCompare = (product: Product) => {
    setCompareProducts(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) {
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 4) return prev;
      return [...prev, product];
    });
  };

  const removeFromCompare = (productId: string) => {
    setCompareProducts(prev => prev.filter(p => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareProducts([]);
  };

  const handleRefresh = async () => {
    try {
      await refreshProducts();
      toast({
        title: "Data Refreshed",
        description: "Successfully updated product list.",
      });
    } catch (error) {
      toast({
        title: "Refresh Failed",
        description: "Could not connect to the automation service.",
        variant: "destructive",
      });
    }
  };

  // Memoize filtered products to prevent heavy calculation on every render
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filter by selected snapshot date
      if (selectedDate && product.created_at && !product.created_at.startsWith(selectedDate)) {
        return false;
      }

      // Search query
      if (filters.searchQuery && !product.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false;
      }

      // Category
      if (filters.category !== 'all' && product.category !== filters.category) {
        return false;
      }

      // Price band
      if (filters.priceBand !== 'all') {
        switch (filters.priceBand) {
          case 'under-25':
            if (product.price >= 25) return false;
            break;
          case '25-50':
            if (product.price < 25 || product.price > 50) return false;
            break;
          case '50-100':
            if (product.price < 50 || product.price > 100) return false;
            break;
          case 'over-100':
            if (product.price <= 100) return false;
            break;
        }
      }

      // Trend velocity
      if (filters.trendVelocity !== 'all') {
        switch (filters.trendVelocity) {
          case 'explosive':
            if (product.velocityScore < 80) return false;
            break;
          case 'rising':
            if (product.velocityScore < 60 || product.velocityScore >= 80) return false;
            break;
          case 'stable':
            if (product.velocityScore < 40 || product.velocityScore >= 60) return false;
            break;
          case 'declining':
            if (product.velocityScore >= 40) return false;
            break;
        }
      }

      // Saturation
      if (filters.saturation !== 'all') {
        switch (filters.saturation) {
          case 'low':
            if (product.saturationScore > 40) return false;
            break;
          case 'medium':
            if (product.saturationScore <= 40 || product.saturationScore > 70) return false;
            break;
          case 'high':
            if (product.saturationScore <= 70) return false;
            break;
        }
      }

      return true;
    });
  }, [products, filters, selectedDate]);

  return (
    <>
      <section id="trending-products" className="py-12 pb-24">
        <div className="container mx-auto px-4">
          {/* Section header */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-signal-bullish flex items-center justify-center shadow-glow">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Trending Products</h2>
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground font-medium mr-2">Intel snapshots from the last 7 days:</p>
                  <div className="flex gap-1 overflow-x-auto pb-1 max-w-[400px]">
                    {refreshDates.map(date => (
                      <Badge 
                        key={date}
                        variant={selectedDate === date ? 'bullish' : 'outline'}
                        className="cursor-pointer whitespace-nowrap"
                        onClick={() => setSelectedDate(date)}
                      >
                        {new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and filters */}
          <div className="mb-8">
            <SearchFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Results count */}
          <div className="text-sm text-muted-foreground mb-6">
            Showing <span className="text-foreground font-bold">{filteredProducts.length}</span> products
            {compareProducts.length > 0 && (
              <span className="ml-2 font-medium">
                • <span className="text-primary font-bold">{compareProducts.length}</span> selected for comparison
              </span>
            )}
          </div>

          {/* Product grid */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <RefreshCw className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground animate-pulse">Scanning market intelligence...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <MemoizedProductCard 
                  key={product.id} 
                  product={product} 
                  onAnalyze={onAnalyze}
                  isSelected={!!compareProducts.find(p => p.id === product.id)}
                  onToggleCompare={toggleCompare}
                  compareDisabled={compareProducts.length >= 4}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-muted-foreground font-medium">
                No products match your filters.
              </div>
            </div>
          )}
        </div>
      </section>

      <CompareBar 
        products={compareProducts}
        onRemove={removeFromCompare}
        onClear={clearCompare}
      />
    </>
  );
};
