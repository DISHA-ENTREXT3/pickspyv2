import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Zap, BarChart3 } from 'lucide-react';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <div onClick={() => navigate('/')} className="cursor-pointer">
              <Logo />
            </div>
            <nav className="hidden md:flex items-center gap-1">
              <Button onClick={() => navigate('/')} variant="ghost" size="sm" className={location.pathname === '/' ? 'bg-secondary' : ''}>Trending</Button>
              <Button onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} variant="ghost" size="sm">Features</Button>
              <Button onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })} variant="ghost" size="sm">How it Works</Button>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/compare')}
                className={location.pathname === '/compare' ? 'bg-secondary' : ''}
              >
                <BarChart3 className="h-4 w-4 mr-1.5" />
                Compare
              </Button>
              <Button variant="ghost" size="sm" className="flex items-center gap-1.5">
                AI Analyzer
                <Badge variant="premium" className="text-[10px] px-1.5 py-0">PRO</Badge>
              </Button>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/pricing')}
              className={location.pathname === '/pricing' ? 'bg-secondary' : ''}
            >
              Pricing
            </Button>
            <Button 
              variant="glass" 
              size="sm"
              onClick={() => navigate('/signup')}
            >
              Sign In
            </Button>
            <Button 
              variant="hero" 
              size="sm" 
              className="hidden sm:flex items-center gap-2"
              onClick={() => navigate('/signup')}
            >
              <Zap className="h-4 w-4" />
              Upgrade
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
