import * as React from 'react';
import { MessageSquare, Send, X, Bug, Lightbulb, HelpCircle, MessageCircle, Loader2 } from 'lucide-react';
import { supportClient } from '@/lib/support/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type Category = "feedback" | "bug" | "feature" | "support";

export const SupportWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [email, setEmail] = React.useState(user?.email || '');
  const [message, setMessage] = React.useState('');
  const [category, setCategory] = React.useState<Category>('support');

  // Sync email if user logs in
  React.useEffect(() => {
    if (user?.email) setEmail(user.email);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await supportClient.submitTicket({
        product: "Pickspy",
        category: category,
        user_email: email,
        message: message,
        metadata: {
          page: window.location.pathname,
          userAgent: navigator.userAgent
        }
      });

      setSuccess(true);
      setMessage('');
      toast.success('Support ticket submitted successfully!');
      
      // Close after 2 seconds on success
      setTimeout(() => {
        setSuccess(false);
        setIsOpen(false);
      }, 2000);

    } catch (err) {
      console.error('Support error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories: { value: Category; label: string; icon: React.ElementType }[] = [
    { value: 'support', label: 'Support', icon: HelpCircle },
    { value: 'bug', label: 'Report Bug', icon: Bug },
    { value: 'feature', label: 'Request Feature', icon: Lightbulb },
    { value: 'feedback', label: 'Feedback', icon: MessageCircle },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-[100] sm:bottom-8 sm:right-8">
      {/* Floating Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-14 w-14 rounded-full shadow-glow transform transition-all duration-300 ${
          isOpen ? 'rotate-90 bg-destructive hover:bg-destructive/90' : 'bg-primary hover:bg-primary/90 text-black'
        }`}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>

      {/* Support Panel */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] glass-card-elevated overflow-hidden animate-slide-up origin-bottom-right shadow-2xl border border-primary/20">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/20 to-transparent p-6 border-b border-border/50">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <h3 className="font-bold text-lg">Pickspy Concierge</h3>
            </div>
            <p className="text-xs text-muted-foreground italic">
              Our intelligence team typically responds within 24 hours.
            </p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Category Selector */}
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all ${
                      category === cat.value 
                        ? 'bg-primary/20 border-primary text-primary' 
                        : 'bg-secondary/30 border-border/50 text-muted-foreground hover:bg-secondary/50'
                    }`}
                  >
                    <cat.icon className="h-3.5 w-3.5" />
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Your Email</label>
                <input
                  type="email"
                  required
                  placeholder="founders@example.com"
                  className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* Message Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">How can we help?</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your issue or suggestion..."
                  className="w-full bg-secondary/50 border border-border/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-primary text-black font-bold hover:bg-primary/90 h-11 rounded-xl"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                Submit Ticket
              </Button>
            </form>
          ) : (
            <div className="p-12 text-center animate-fade-in">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Send className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
              <p className="text-sm text-muted-foreground">
                We've received your request and will get back to you shortly.
              </p>
            </div>
          )}

          {/* Footer Branding */}
          <div className="px-6 py-4 bg-secondary/20 border-t border-border/30 flex justify-between items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-muted-foreground">Powered by</span>
              <span className="text-[10px] font-bold text-primary tracking-tighter uppercase">Entrext Support</span>
            </div>
            <Badge variant="outline" className="text-[9px] h-4 border-primary/20 text-primary px-1.5">v2.0</Badge>
          </div>
        </div>
      )}
    </div>
  );
};
