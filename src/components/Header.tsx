import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Zap, BarChart3 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isLoading, signOut } = useAuth();
  // Auth buttons: Sign In, Sign Up, Dashboard, Sign Out

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <div onClick={() => {
              if (location.pathname === '/') {
                document.getElementById('trending-products')?.scrollIntoView({ behavior: 'smooth' });
              } else {
                navigate('/', { state: { scrollTo: 'trending-products' } });
              }
            }} className="cursor-pointer">
              <Logo />
            </div>
            <nav className="hidden md:flex items-center gap-1">
              <Button 
                onClick={() => {
                  if (location.pathname === '/') {
                    document.getElementById('trending-products')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/', { state: { scrollTo: 'trending-products' } });
                  }
                }} 
                variant="ghost" 
                size="sm" 
                className={location.pathname === '/' ? 'bg-secondary' : ''}
              >
                Trending
              </Button>
              <Button 
                onClick={() => {
                  if (location.pathname === '/') {
                    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/', { state: { scrollTo: 'features' } });
                  }
                }} 
                variant="ghost" 
                size="sm"
              >
                Features
              </Button>
              <Button 
                onClick={() => {
                  if (location.pathname === '/') {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/', { state: { scrollTo: 'how-it-works' } });
                  }
                }} 
                variant="ghost" 
                size="sm"
              >
                How it Works
              </Button>
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
            
            {/* Authentication Buttons */}
            {isLoading ? (
               <div className="flex gap-2">
                 <div className="h-9 w-20 bg-secondary/50 rounded-lg animate-pulse" />
                 <div className="hidden sm:block h-9 w-24 bg-primary/20 rounded-lg animate-pulse" />
               </div>
            ) : user ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </Button>
                <Button 
                  variant="glass" 
                  size="sm"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="glass" 
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>

                <Button 
                  variant="hero" 
                  size="sm" 
                  className="hidden sm:flex items-center gap-2"
                  onClick={() => navigate('/signup')}
                >
                  Get Started
                  <Zap className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
