import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { Link } from 'react-router-dom';

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
