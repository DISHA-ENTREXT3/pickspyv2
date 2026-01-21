import { Search, Filter, X } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { categories, priceBands, trendVelocities, saturationLevels } from '@/lib/constants';
import { FilterState } from '@/types/product';

interface SearchFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export const SearchFilters = ({ filters, onFiltersChange }: SearchFiltersProps) => {
  const activeFiltersCount = [
    filters.category !== 'all',
    filters.priceBand !== 'all',
    filters.trendVelocity !== 'all',
    filters.saturation !== 'all',
  ].filter(Boolean).length;

  const clearFilters = () => {
    onFiltersChange({
      ...filters,
      category: 'all',
      priceBand: 'all',
      trendVelocity: 'all',
      saturation: 'all',
    });
  };

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          variant="search"
          inputSize="lg"
          placeholder="Search products, categories, or trends..."
          value={filters.searchQuery}
          onChange={(e) => onFiltersChange({ ...filters, searchQuery: e.target.value })}
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filters</span>
        </div>

        <Select
          value={filters.category}
          onValueChange={(value) => onFiltersChange({ ...filters, category: value as FilterState['category'] })}
        >
          <SelectTrigger className="w-[160px] bg-card/60 border-border/50">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.priceBand}
          onValueChange={(value) => onFiltersChange({ ...filters, priceBand: value as FilterState['priceBand'] })}
        >
          <SelectTrigger className="w-[140px] bg-card/60 border-border/50">
            <SelectValue placeholder="Price" />
          </SelectTrigger>
          <SelectContent>
            {priceBands.map((band) => (
              <SelectItem key={band.value} value={band.value}>
                {band.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.trendVelocity}
          onValueChange={(value) => onFiltersChange({ ...filters, trendVelocity: value as FilterState['trendVelocity'] })}
        >
          <SelectTrigger className="w-[150px] bg-card/60 border-border/50">
            <SelectValue placeholder="Trend" />
          </SelectTrigger>
          <SelectContent>
            {trendVelocities.map((trend) => (
              <SelectItem key={trend.value} value={trend.value}>
                {trend.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.saturation}
          onValueChange={(value) => onFiltersChange({ ...filters, saturation: value as FilterState['saturation'] })}
        >
          <SelectTrigger className="w-[160px] bg-card/60 border-border/50">
            <SelectValue placeholder="Saturation" />
          </SelectTrigger>
          <SelectContent>
            {saturationLevels.map((level) => (
              <SelectItem key={level.value} value={level.value}>
                {level.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4 mr-1" />
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>
    </div>
  );
};
