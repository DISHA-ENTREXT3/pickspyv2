import { useState, useEffect } from 'react';
import { Zap, Target, AlertTriangle, Lightbulb, ArrowRight, X, Loader2, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Product, ProductAnalysis } from '@/types/product';
import { analyzeProductWithAI } from '@/lib/ai';

interface AIAnalyzerProps {
  selectedProduct?: Product | null;
  onClose?: () => void;
}

export const AIAnalyzer = ({ selectedProduct, onClose }: AIAnalyzerProps) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [productIdea, setProductIdea] = useState(selectedProduct?.name || '');
  const [targetPrice, setTargetPrice] = useState(selectedProduct?.price.toString() || '');
  const [region, setRegion] = useState('us');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);

  const isFreeTier = profile?.subscription_tier === 'Free' || !profile;

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeProductWithAI(productIdea, targetPrice, region);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getRecommendationBadge = () => {
    switch (analysis?.recommendation) {
      case 'dropship':
        return <Badge variant="bullish" className="text-sm px-3 py-1">✓ Go: Dropship</Badge>;
      case 'white-label':
        return <Badge variant="caution" className="text-sm px-3 py-1">→ Consider: White-label</Badge>;
      case 'skip':
        return <Badge variant="bearish" className="text-sm px-3 py-1">✕ Skip</Badge>;
    }
  };

  const getViabilityColor = (score: number) => {
    if (score >= 70) return 'text-signal-bullish';
    if (score >= 50) return 'text-signal-caution';
    return 'text-signal-bearish';
  };

  return (
    <Card variant="elevated" className="relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
      
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-10"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-signal-bullish flex items-center justify-center shadow-glow animate-pulse-glow">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              AI Product Analyzer
              <Badge variant="premium">PRO</Badge>
            </CardTitle>
            <CardDescription>Get data-driven go/no-go decisions in seconds</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative space-y-6">
        {isFreeTier && (
          <div className="absolute inset-0 z-20 bg-background/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-fade-in">
             <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-6">
                <Lock className="h-8 w-8 text-primary shadow-glow" />
             </div>
             <h3 className="text-2xl font-bold mb-3">AI Analyzer PRO</h3>
             <p className="text-muted-foreground mb-8 max-w-sm">
               Get specialized market viability scores and risk analysis. 
               AI insights are available exclusively on Pro and Business plans.
             </p>
             <div className="flex flex-col sm:flex-row gap-4">
               <Button variant="hero" onClick={() => navigate('/pricing')}>
                 Upgrade to Unlock
               </Button>
               <Button variant="outline" onClick={onClose} className="border-white/10">
                 Maybe Later
               </Button>
             </div>
          </div>
        )}
        {/* Input form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="product-idea">Product Idea</Label>
            <Input
              id="product-idea"
              variant="glass"
              inputSize="lg"
              placeholder="e.g., Posture Corrector Belt, LED Pet Collar..."
              value={productIdea}
              onChange={(e) => setProductIdea(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="target-price">Target Price ($)</Label>
            <Input
              id="target-price"
              variant="glass"
              type="number"
              placeholder="29.99"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
            />
          </div>
          <div>
            <Label>Target Region</Label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger className="bg-card/60 border-border/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">🇺🇸 United States</SelectItem>
                <SelectItem value="eu">🇪🇺 Europe</SelectItem>
                <SelectItem value="uk">🇬🇧 United Kingdom</SelectItem>
                <SelectItem value="ca">🇨🇦 Canada</SelectItem>
                <SelectItem value="au">🇦🇺 Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button 
          variant="hero" 
          size="lg" 
          className="w-full"
          disabled={!productIdea || isAnalyzing}
          onClick={handleAnalyze}
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Target className="h-5 w-5" />
              Analyze Product
              <ArrowRight className="h-5 w-5" />
            </>
          )}
        </Button>

        {/* Analysis results */}
        {analysis && (
          <div className="space-y-6 pt-6 border-t border-border/50 animate-slide-up">
            {/* Score and recommendation */}
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Market Viability</div>
                <div className={`text-5xl font-bold ${getViabilityColor(analysis.viabilityScore)}`}>
                  {analysis.viabilityScore}
                  <span className="text-2xl text-muted-foreground">/100</span>
                </div>
              </div>
              {getRecommendationBadge()}
            </div>

            {/* Risks */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-signal-caution" />
                <span className="font-semibold">Top Risks</span>
              </div>
              <div className="space-y-2">
                {analysis.topRisks.map((risk, i) => (
                  <div 
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50"
                  >
                    <Badge 
                      variant={
                        risk.severity === 'high' ? 'bearish' : 
                        risk.severity === 'medium' ? 'caution' : 'neutral'
                      }
                      className="shrink-0 mt-0.5"
                    >
                      {risk.severity}
                    </Badge>
                    <span className="text-sm">{risk.risk}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-primary" />
                <span className="font-semibold">What to Change</span>
              </div>
              <div className="space-y-2">
                {analysis.suggestions.map((suggestion, i) => (
                  <div 
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
                  >
                    <Badge variant="premium" className="shrink-0 mt-0.5 capitalize">
                      {suggestion.type}
                    </Badge>
                    <span className="text-sm">{suggestion.suggestion}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reasoning */}
            <div className="p-4 rounded-lg bg-card/60 border border-border/30">
              <div className="text-sm text-muted-foreground mb-2">Analysis Reasoning</div>
              <p className="text-sm leading-relaxed">{analysis.reasoning}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
