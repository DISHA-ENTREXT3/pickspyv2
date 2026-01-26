import { TrendingUp, ArrowUpRight, Activity, Zap, Slack, MessageCircle, Linkedin, Instagram, Link as LinkIcon, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

export const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background grid pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(hsl(var(--border) / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border) / 0.4) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-signal-bullish/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/60 backdrop-blur-xl border border-border/50 mb-8 animate-fade-in">
            <Activity className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              <span className="text-signal-bullish font-semibold">2,847</span> products tracked today
            </span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-up">
            Spy the Trends,
            <br />
            <span className="bg-gradient-to-r from-primary via-signal-bullish to-primary bg-clip-text text-transparent">
              Pick the Winner.
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            The ultimate Market Intelligence platform for the Dropshipping community. 
            Analyze real-time demand signals and social sentiment across the web with 
            AI-powered conviction. Start winning the e-commerce game.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button 
              variant="hero" 
              size="xl" 
              className="w-full sm:w-auto"
              onClick={() => document.getElementById('trending-products')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <TrendingUp className="h-5 w-5" />
              Explore Trending Products
              <ArrowUpRight className="h-5 w-5" />
            </Button>
            <Button variant="glass" size="xl" className="w-full sm:w-auto">
              <Zap className="h-5 w-5" />
              Try AI Analyzer
              <Badge variant="premium" className="ml-1">PRO</Badge>
            </Button>
          </div>

          {/* Compact Community Section */}
          <div className="max-w-md mx-auto mb-16 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            <div className="flex gap-2 mb-6">
              <Input 
                placeholder="Enter email to join community" 
                className="bg-secondary/30 border-border/50 text-foreground placeholder:text-muted-foreground/50 h-11 rounded-xl"
              />
              <Button 
                variant="hero"
                className="h-11 shadow-lg shadow-primary/20"
                onClick={() => window.open('https://substack.com/@entrextlabs?utm_campaign=profile&utm_medium=profile-page', '_blank')}
              >
                <Mail className="h-4 w-4 mr-2" />
                Subscribe
              </Button>
            </div>
            
            <div className="flex items-center justify-center gap-6">
              <a href="https://discord.com/invite/ZZx3cBrx2" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#5865F2] transition-colors"><MessageCircle className="h-5 w-5" /></a>
              <a href="https://substack.com/@entrextlabs" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#FF6719] transition-colors">
                <svg role="img" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/entrext/posts/?feedView=all" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#0077b5] transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href="https://www.instagram.com/entrext.labs" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-[#E4405F] transition-colors"><Instagram className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            {[
              { label: 'Products Tracked', value: '12,500+', signal: 'neutral' },
              { label: 'Reddit Mentions', value: '2.4M+', signal: 'bullish' },
              { label: 'Trend Accuracy', value: '94%', signal: 'bullish' },
              { label: 'Data Sources', value: '15+', signal: 'neutral' },
            ].map((stat) => (
              <div 
                key={stat.label}
                className="p-4 rounded-xl bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm"
              >
                <div className={`text-2xl md:text-3xl font-bold mb-1 ${stat.signal === 'bullish' ? 'text-signal-bullish' : 'text-foreground'}`}>
                  {stat.value}
                </div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
