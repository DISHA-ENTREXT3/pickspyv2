import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  Zap, 
  Crown, 
  Building2,
  TrendingUp,
  MessageCircle,
  Target,
  Sparkles,
  BarChart3,
  Users,
  Shield,
} from 'lucide-react';

const plans = [
  {
    name: 'Free',
    description: 'Discover trending products',
    price: '$0',
    period: '/forever',
    icon: TrendingUp,
    popular: false,
    features: [
      { text: 'Browse trending products', included: true },
      { text: 'Basic filters & search', included: true },
      { text: 'View velocity scores', included: true },
      { text: '5 product views/day', included: true },
      { text: 'Reddit sentiment preview', included: true },
      { text: 'AI Product Analyzer', included: false },
      { text: 'Historical trend charts', included: false },
      { text: 'Competitor analysis', included: false },
      { text: 'Product comparison', included: false },
    ],
    cta: 'Get Started',
    variant: 'glass' as const,
  },
  {
    name: 'Pro',
    description: 'For serious dropshippers',
    price: '$29',
    period: '/month',
    icon: Zap,
    popular: true,
    features: [
      { text: 'Everything in Free', included: true },
      { text: 'Unlimited product views', included: true },
      { text: '50 AI analyses/month', included: true },
      { text: 'Full Reddit thread access', included: true },
      { text: 'Historical trend charts', included: true },
      { text: 'Competitor analysis', included: true },
      { text: 'Product comparison (up to 4)', included: true },
      { text: 'Export reports as PDF', included: true },
      { text: 'Email alerts for trends', included: false },
    ],
    cta: 'Start Pro Trial',
    variant: 'hero' as const,
  },
  {
    name: 'Business',
    description: 'For teams & agencies',
    price: '$99',
    period: '/month',
    icon: Crown,
    popular: false,
    features: [
      { text: 'Everything in Pro', included: true },
      { text: 'Unlimited AI analyses', included: true },
      { text: 'Compare up to 10 products', included: true },
      { text: 'API access', included: true },
      { text: 'White-label reports', included: true },
      { text: 'Real-time email alerts', included: true },
      { text: 'Priority support', included: true },
      { text: 'Team collaboration (5 seats)', included: true },
      { text: 'Custom integrations', included: true },
    ],
    cta: 'Contact Sales',
    variant: 'glass' as const,
  },
];

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
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-16">
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
            {plans.map((plan) => (
              <Card 
                key={plan.name}
                variant={plan.popular ? 'signal' : 'glass'}
                className={`relative overflow-hidden ${plan.popular ? 'border-primary md:scale-105 md:-my-4 shadow-glow' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${plan.popular ? 'bg-primary/20' : 'bg-secondary'}`}>
                      <plan.icon className={`h-5 w-5 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
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
                    variant={plan.variant} 
                    className="w-full"
                    size="lg"
                  >
                    {plan.cta}
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
              <Button variant="hero" size="lg">
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
