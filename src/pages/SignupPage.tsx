import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-background">
      {/* Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md relative z-10 p-8 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl shadow-2xl">
        <div className="flex justify-center mb-8">
          <Link to="/">
            <Logo size="lg" />
          </Link>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Start for free today</h1>
          <p className="text-muted-foreground">Access unlimited product trends and scale your business.</p>
        </div>

        <div className="space-y-4">
          <Button 
            onClick={async () => {
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  redirectTo: `${window.location.origin}/`,
                },
              });
              if (error) console.error('Error logging in:', error);
            }}
            variant="outline" 
            className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10 hover:text-white h-11 relative"
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Sign up with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground bg-black/40 backdrop-blur-xl">Or continue with</span>
            </div>
          </div>

          <form className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Full Name</label>
            <Input placeholder="John Doe" className="bg-white/5 border-white/10 text-white placeholder:text-white/20" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Email Address</label>
            <Input type="email" placeholder="john@example.com" className="bg-white/5 border-white/10 text-white placeholder:text-white/20" />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/80">Password</label>
            <Input type="password" placeholder="••••••••" className="bg-white/5 border-white/10 text-white placeholder:text-white/20" />
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-white h-11 text-base font-semibold shadow-[0_0_20px_rgba(99,102,241,0.5)]">
            Create Account
          </Button>
        </form>
        </div>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </p>
        </div>
        
        <div className="mt-8 text-center text-xs text-muted-foreground">
          By signing up, you agree to our{' '}
          <a href="#" className="underline hover:text-white">Terms of Service</a> and{' '}
          <a href="#" className="underline hover:text-white">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}
