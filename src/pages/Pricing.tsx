import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PLANS } from '@/lib/plans';
import { toast } from 'sonner';
import { 
  Check, 
  Sparkles,
  BarChart3,
  Users,
  Shield,
  MessageCircle,
  TrendingUp,
  Zap,
  ArrowLeft,
} from 'lucide-react';

const comparisonFeatures = [
  {
    category: 'Discovery',
    icon: TrendingUp,
    features: [
      { name: 'Trending products feed', free: true, pro: true, business: true },
      { name: 'Product views per day', free: '5', pro: 'Unlimited', business: 'Unlimited' },
      { name: 'Advanced filters', free: false, pro: true, business: true },
      { name: 'Saved searches', free: false, pro: '10', business: 'Unlimited' },
    ],
  },
  {
    category: 'Analysis',
    icon: BarChart3,
    features: [
      { name: 'Velocity & saturation scores', free: true, pro: true, business: true },
      { name: 'AI Product Analyzer', free: false, pro: '50/mo', business: 'Unlimited' },
      { name: 'Historical trend charts', free: false, pro: true, business: true },
      { name: 'Competitor tracking', free: false, pro: true, business: true },
    ],
  },
  {
    category: 'Reddit Intelligence',
    icon: MessageCircle,
    features: [
      { name: 'Sentiment preview', free: true, pro: true, business: true },
      { name: 'Full thread access', free: false, pro: true, business: true },
      { name: 'Comment analysis', free: false, pro: true, business: true },
      { name: 'Subreddit tracking', free: false, pro: '5', business: 'Unlimited' },
    ],
  },
  {
    category: 'Collaboration',
    icon: Users,
    features: [
      { name: 'Product comparison', free: false, pro: '4 products', business: '10 products' },
      { name: 'Export reports', free: false, pro: true, business: true },
      { name: 'Team seats', free: '1', pro: '1', business: '5' },
      { name: 'API access', free: false, pro: false, business: true },
    ],
  },
];

const Pricing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [currentTier, setCurrentTier] = useState<string>('Free');

  // SEO and Meta Management
  useEffect(() => {
    document.title = "PickSpy Pricing | Affordable AI Product Research Plans";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Choose the right PickSpy plan for your dropshipping business. From free product browsing to pro-level AI analysis and competitor tracking.');
    }
  }, []);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        // Fetch current tier
        supabase.from('profiles').select('subscription_tier').eq('id', user.id).single()
          .then(({ data }) => {
             if (data) setCurrentTier(data.subscription_tier);
          });
      }
    });
  }, []);

  const handlePlanSelect = async (planName: string) => {
    if (!user) {
      navigate('/signup');
      return;
    }

    if (planName === currentTier) {
      return;
    }

    // Mock Upgrade Logic - In reality this would go to Stripe
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_tier: planName })
        .eq('id', user.id);

      if (error) throw error;
      
      setCurrentTier(planName);
      toast.success(`Plan updated to ${planName}`);
      navigate('/dashboard');
    } catch (e) {
      toast.error('Failed to update plan. Please try again.');
      console.warn('Subscription upgrade failed:', e);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-16 relative">
          <div className="absolute left-4 top-0 hidden md:block">
             <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
               <ArrowLeft className="h-4 w-4" /> Back
             </Button>
          </div>
          <Badge variant="premium" className="mb-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Launch Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient-primary">Pick the plan</span> that picks winners
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From casual browsing to serious product intelligence. Start free, upgrade when you're ready to dominate.
          </p>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 mb-24">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS.map((plan) => (
              <Card 
                key={plan.name}
                variant={plan.name === 'Pro' ? 'signal' : 'glass'}
                className={`relative overflow-hidden ${plan.name === 'Pro' ? 'border-primary md:scale-105 md:-my-4 shadow-glow' : ''}`}
              >
                {plan.name === 'Pro' && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${plan.name === 'Pro' ? 'bg-primary/20' : 'bg-secondary'}`}>
                      <plan.icon className={`h-5 w-5 ${plan.name === 'Pro' ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{plan.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    variant={plan.name === 'Pro' ? 'hero' : 'glass'} 
                    className="w-full"
                    size="lg"
                    onClick={() => handlePlanSelect(plan.name)}
                    disabled={user && currentTier === plan.name}
                  >
                     {user ? (currentTier === plan.name ? 'Current Plan' : `Switch to ${plan.name}`) : 'Get Started'}
                  </Button>
                  <div className="space-y-3 pt-4 border-t border-border/50">
                    {plan.features.map((feature) => (
                      <div key={feature.text} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className="h-4 w-4 text-signal-bullish mt-0.5 shrink-0" />
                        ) : (
                          <div className="h-4 w-4 rounded-full bg-secondary mt-0.5 shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? '' : 'text-muted-foreground'}`}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Feature Comparison */}
        <section className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Compare all features</h2>
            <p className="text-muted-foreground">See exactly what's included in each plan</p>
          </div>

          <div className="max-w-5xl mx-auto space-y-8">
            {comparisonFeatures.map((category) => (
              <Card key={category.category} variant="glass">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2">
                    <category.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{category.category}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="font-medium text-muted-foreground">Feature</div>
                    <div className="text-center font-medium">Free</div>
                    <div className="text-center font-medium text-primary">Pro</div>
                    <div className="text-center font-medium">Business</div>
                    
                    {category.features.map((feature) => (
                      <>
                        <div key={feature.name} className="py-2 border-t border-border/50">
                          {feature.name}
                        </div>
                        <div className="py-2 border-t border-border/50 text-center">
                          {typeof feature.free === 'boolean' ? (
                            feature.free ? (
                              <Check className="h-4 w-4 text-signal-bullish mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )
                          ) : (
                            <span>{feature.free}</span>
                          )}
                        </div>
                        <div className="py-2 border-t border-border/50 text-center">
                          {typeof feature.pro === 'boolean' ? (
                            feature.pro ? (
                              <Check className="h-4 w-4 text-signal-bullish mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )
                          ) : (
                            <span className="text-primary font-medium">{feature.pro}</span>
                          )}
                        </div>
                        <div className="py-2 border-t border-border/50 text-center">
                          {typeof feature.business === 'boolean' ? (
                            feature.business ? (
                              <Check className="h-4 w-4 text-signal-bullish mx-auto" />
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )
                          ) : (
                            <span>{feature.business}</span>
                          )}
                        </div>
                      </>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 mt-24">
          <Card variant="glass" className="p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-signal-bullish/10" />
            <div className="relative">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">14-day money-back guarantee</h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Try any paid plan risk-free. If you're not finding winning products within 14 days, we'll refund you—no questions asked.
              </p>
              <Button variant="hero" size="lg" onClick={() => navigate('/signup')}>
                Start Your Free Trial
                <Zap className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
