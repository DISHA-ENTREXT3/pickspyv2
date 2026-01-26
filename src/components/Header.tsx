import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Zap, BarChart3, Menu, X, ExternalLink, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ThemeToggle } from './ThemeToggle';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
      console.error('Sign out error:', error);
    }
  };

  const navLinks = [
    { 
      name: 'Trending', 
      id: 'trending-products',
      onClick: () => {
        if (location.pathname === '/') {
          document.getElementById('trending-products')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/', { state: { scrollTo: 'trending-products' } });
        }
        setIsMobileMenuOpen(false);
      }
    },
    { 
      name: 'Features', 
      id: 'features',
      onClick: () => {
        if (location.pathname === '/') {
          document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/', { state: { scrollTo: 'features' } });
        }
        setIsMobileMenuOpen(false);
      }
    },
    { 
      name: 'How it Works', 
      id: 'how-it-works',
      onClick: () => {
        if (location.pathname === '/') {
          document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
        } else {
          navigate('/', { state: { scrollTo: 'how-it-works' } });
        }
        setIsMobileMenuOpen(false);
      }
    },
    { 
      name: 'Blog', 
      path: '/blog',
      onClick: () => {
        navigate('/blog');
        setIsMobileMenuOpen(false);
      }
    },
    { 
      name: 'Compare', 
      path: '/compare',
      icon: BarChart3,
      onClick: () => {
        navigate('/compare');
        setIsMobileMenuOpen(false);
      }
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <div onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/');
              }
              setIsMobileMenuOpen(false);
            }} className="cursor-pointer">
              <Logo />
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Button 
                  key={link.name}
                  onClick={link.onClick} 
                  variant="ghost" 
                  size="sm" 
                  className="hover:bg-secondary/50"
                >
                  {link.icon && <link.icon className="h-4 w-4 mr-1.5" />}
                  {link.name}
                </Button>
              ))}
              <Button variant="ghost" size="sm" className="hidden lg:flex items-center gap-1.5">
                AI Analyzer
                <Badge variant="premium" className="text-[10px] px-1.5 py-0">PRO</Badge>
              </Button>
            </nav>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/pricing')}
              className="hidden sm:flex hover:bg-secondary/50"
            >
              Pricing
            </Button>
            
            {/* Authentication Buttons (Desktop) */}
            <div className="hidden sm:flex items-center gap-3">
              {user ? (
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
                    className="flex items-center gap-2"
                    onClick={() => navigate('/signup')}
                  >
                    Get Started
                    <Zap className="h-3.5 w-3.5" />
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-background border-l border-border/50 p-0">
                <SheetHeader className="p-6 border-b border-border/50 text-left">
                  <SheetTitle>
                    <Logo size="sm" />
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-6 gap-2">
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Navigation</div>
                  {navLinks.map((link) => (
                    <Button 
                      key={link.name}
                      onClick={link.onClick} 
                      variant="ghost" 
                      className="justify-start h-12 text-base px-3"
                    >
                      {link.icon && <link.icon className="h-5 w-5 mr-3 text-primary" />}
                      {link.name}
                    </Button>
                  ))}
                  <Button variant="ghost" className="justify-start h-12 text-base px-3 gap-3">
                    AI Analyzer
                    <Badge variant="premium">PRO</Badge>
                  </Button>
                  
                  <div className="h-px bg-border/50 my-4" />
                  
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-2">Account</div>
                  <Button 
                    variant="ghost" 
                    onClick={() => { navigate('/pricing'); setIsMobileMenuOpen(false); }}
                    className="justify-start h-12 text-base px-3"
                  >
                    Pricing
                  </Button>
                  
                  {user ? (
                    <>
                      <Button 
                        variant="ghost" 
                        onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
                        className="justify-start h-12 text-base px-3"
                      >
                        Dashboard
                      </Button>
                      <Button 
                        variant="ghost" 
                        onClick={() => { handleSignOut(); setIsMobileMenuOpen(false); }}
                        className="justify-start h-12 text-base px-3 text-destructive"
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <Button 
                        variant="glass" 
                        onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
                      >
                        Sign In
                      </Button>
                      <Button 
                        variant="hero" 
                        onClick={() => { navigate('/signup'); setIsMobileMenuOpen(false); }}
                        className="gap-2"
                      >
                        Start <Zap className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};
