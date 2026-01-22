import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, CreditCard, Shield, Zap, Check, AlertCircle, LogOut } from 'lucide-react';
import { PLANS } from '@/lib/plans';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, isLoading, isAuthenticated, signOut } = useAuth();
  const [greeting, setGreeting] = useState('');

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Set greeting based on time of day
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const currentPlan = PLANS.find(p => p.name === profile?.subscription_tier) || PLANS[0];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {greeting}, {user?.user_metadata?.full_name || 'User'}! 👋
          </h1>
          <p className="text-muted-foreground">Welcome back to PickSpy. Continue exploring market opportunities.</p>
        </div>

        <div className="flex flex-col md:flex-row items-start gap-8">
          
          {/* Sidebar */}
          <Card className="w-full md:w-64 shrink-0 bg-card/40 backdrop-blur-xl border-white/10 sticky top-24">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-3">
                <User className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="truncate text-lg">{user?.user_metadata?.full_name || 'User'}</CardTitle>
              <CardDescription className="truncate text-xs">{user?.email}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start text-primary bg-primary/10">
                  <User className="mr-2 h-4 w-4" /> Profile
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => navigate('/pricing')}
                >
                  <CreditCard className="mr-2 h-4 w-4" /> Subscription
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground"
                  disabled
                >
                  <Shield className="mr-2 h-4 w-4" /> Security
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10 mt-4"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" /> Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            
            {/* Current Plan Overview */}
            <Card className="bg-card/40 backdrop-blur-xl border-white/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-1">Current Plan: {currentPlan.name}</CardTitle>
                    <CardDescription>You are currently on the {currentPlan.name} tier.</CardDescription>
                  </div>
                  <Badge variant={currentPlan.name === 'Free' ? 'outline' : 'premium'} className="text-sm px-3 py-1">
                    {currentPlan.name.toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 mb-6">
                  {currentPlan.name === 'Free' ? (
                    <div className="flex items-center text-yellow-500 bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/20">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      <span>Upgrade to unlock full potential</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-signal-bullish bg-signal-bullish/10 px-4 py-2 rounded-lg border border-signal-bullish/20">
                      <Zap className="h-4 w-4 mr-2" />
                      <span>All {currentPlan.name} features active</span>
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {currentPlan.features.map((feature, idx) => (
                    <div key={idx} className={`flex items-start gap-2 p-2 rounded-md ${feature.included ? 'bg-white/5' : 'opacity-50'}`}>
                      {feature.included ? (
                        <Check className="h-4 w-4 text-signal-bullish mt-0.5 shrink-0" />
                      ) : (
                        <div className="h-4 w-4 rounded-full bg-secondary mt-0.5 shrink-0" />
                      )}
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>

                {currentPlan.name !== 'Business' && (
                  <div className="mt-8">
                    <Button 
                      onClick={() => navigate('/pricing')} 
                      className="bg-primary hover:bg-primary/90"
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Usage Stats */}
            <Card className="bg-card/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-muted-foreground text-xs uppercase mb-1">Product Views</div>
                    <div className="text-2xl font-bold">12 <span className="text-sm text-muted-foreground font-normal">/ {currentPlan.name === 'Free' ? '5 per day' : 'Unlimited'}</span></div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-muted-foreground text-xs uppercase mb-1">AI Analyses</div>
                    <div className="text-2xl font-bold">8 <span className="text-sm text-muted-foreground font-normal">/ {currentPlan.name === 'Free' ? '2 per day' : 'Unlimited'}</span></div>
                  </div>
                  <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                    <div className="text-muted-foreground text-xs uppercase mb-1">Data Exports</div>
                    <div className="text-2xl font-bold">3 <span className="text-sm text-muted-foreground font-normal">/ {currentPlan.name === 'Free' ? '0' : 'Unlimited'}</span></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-card/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/5">
                    <div>
                      <p className="font-medium text-white">Last Login</p>
                      <p className="text-sm text-muted-foreground">Today at 10:30 AM</p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-card/40 backdrop-blur-xl border-white/10">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    variant="outline"
                    className="justify-start"
                    onClick={() => navigate('/')}
                  >
                    <Zap className="mr-2 h-4 w-4" /> Explore Products
                  </Button>
                  <Button 
                    variant="outline"
                    className="justify-start"
                    onClick={() => navigate('/compare')}
                  >
                    <Zap className="mr-2 h-4 w-4" /> Compare Products
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
                            <div className="text-2xl font-bold">0 <span className="text-sm text-muted-foreground font-normal">/ {currentPlan.name === 'Free' ? '0' : (currentPlan.name === 'Pro' ? '50' : 'Unlimited')}</span></div>
                        </div>
                         <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                            <div className="text-muted-foreground text-xs uppercase mb-1">Tracked Products</div>
                            <div className="text-2xl font-bold">3 <span className="text-sm text-muted-foreground font-normal">/ Unlimited</span></div>
                        </div>
                    </div>
                </CardContent>
             </Card>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
