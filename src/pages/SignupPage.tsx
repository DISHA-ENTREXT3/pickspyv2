import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signUp, signIn, user } = useAuth();

  const isLoginPage = location.pathname === '/login';
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  if (user) return null;

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      // Use the imported supabase client for OAuth
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          skipBrowserRedirect: false,
        },
      });
      
      if (error) {
        console.error('Google OAuth error:', error);
        toast.error(`Authentication error: ${error.message}`);
      }
    } catch (err) {
      console.error('OAuth error:', err);
      toast.error('Failed to authenticate with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLoginPage) {
        // Login
        if (!email || !password) {
          toast.error('Please fill in all fields');
          setIsLoading(false);
          return;
        }

        const { error } = await signIn(email, password);
        if (error) {
          toast.error(`Login failed: ${error.message}`);
        } else {
          toast.success('Logged in successfully!');
          navigate('/dashboard');
        }
      } else {
        // Sign up
        if (!fullName || !email || !password) {
          toast.error('Please fill in all fields');
          setIsLoading(false);
          return;
        }

        if (password.length < 6) {
          toast.error('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(email, password, fullName);
        if (error) {
          toast.error(`Sign up failed: ${error.message}`);
        } else {
          toast.success('Account created! Please check your email to verify your account.');
          // Redirect to login after signup
          setTimeout(() => navigate('/login'), 2000);
        }
      }
    } catch (err) {
      console.error('Auth error:', err);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

      <Button 
        variant="ghost" 
        className="absolute top-4 left-4 z-50 text-muted-foreground hover:text-primary"
        onClick={() => navigate('/')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      
      <div className="w-full max-w-md relative z-10 p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="flex justify-center mb-8">
          <Link to="/">
            <Logo size="lg" />
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">
            {isLoginPage ? 'Welcome Back' : 'Start for free today'}
          </h1>
          <p className="text-muted-foreground">
            {isLoginPage 
              ? 'Sign in to your account and continue where you left off'
              : 'Access unlimited product trends and scale your business.'}
          </p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={handleGoogleAuth}
            disabled={isLoading}
            variant="outline" 
            className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white h-11 relative"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
            )}
            {isLoginPage ? 'Sign in with Google' : 'Sign up with Google'}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground bg-black/40 backdrop-blur-xl">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginPage && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Full Name</label>
                <Input 
                  placeholder="John Doe" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/20" 
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Email Address</label>
              <Input 
                type="email" 
                placeholder="john@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-white/80">Password</label>
              <Input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/20" 
              />
            </div>

            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white h-11 text-base font-semibold shadow-[0_0_20px_rgba(99,102,241,0.5)]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : isLoginPage ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-muted-foreground">
            {isLoginPage ? (
              <>
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary hover:underline font-medium">
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline font-medium">
                  Sign In
                </Link>
              </>
            )}
          </p>
        </div>
        
        <div className="mt-8 text-center text-xs text-muted-foreground">
          By {isLoginPage ? 'signing in' : 'signing up'}, you agree to our{' '}
          <Link to="/privacy" className="underline hover:text-white">Privacy Policy</Link> and{' '}
          <Link to="/terms" className="underline hover:text-white">Terms of Service</Link>.
        </div>
      </div>
    </div>
  );
}
