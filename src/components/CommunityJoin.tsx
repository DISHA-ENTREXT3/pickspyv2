import { Input } from './ui/input';
import { Button } from './ui/button';
import { Mail, MessageCircle, Linkedin, Instagram, Link as LinkIcon } from 'lucide-react';

export const CommunityJoin = () => {
  return (
    <section className="py-20 relative overflow-hidden border-y border-white/5 bg-black/20">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Stay in the loop & Join our Community
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get the latest viral trend alerts, expert dropshipping strategies, and exclusive market insights delivered directly to your inbox.
            </p>
          </div>

          {/* Email Subscription Form */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="email" 
                placeholder="Enter your email address" 
                className="pl-10 h-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/70 focus-visible:ring-primary/50"
              />
            </div>
            <Button className="h-10 px-6 bg-primary hover:bg-primary/90 text-white font-medium shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              Subscribe
            </Button>
          </div>

          {/* Social Links */}
          <div className="pt-8">
            <p className="text-sm font-medium text-white/60 mb-6 uppercase tracking-wider">Connect with us</p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <a 
                href="https://discord.com/invite/ZZx3cBrx2" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#5865F2]/10 text-[#5865F2] hover:bg-[#5865F2]/20 transition-all border border-[#5865F2]/20"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="font-medium">Discord</span>
              </a>
              <a 
                href="https://www.linkedin.com/company/entrext/posts/?feedView=all" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0077b5]/10 text-[#0077b5] hover:bg-[#0077b5]/20 transition-all border border-[#0077b5]/20"
              >
                <Linkedin className="h-4 w-4" />
                <span className="font-medium">LinkedIn</span>
              </a>
              <a 
                href="https://www.instagram.com/entrext.labs" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#E4405F]/10 text-[#E4405F] hover:bg-[#E4405F]/20 transition-all border border-[#E4405F]/20"
              >
                <Instagram className="h-4 w-4" />
                <span className="font-medium">Instagram</span>
              </a>
              <a 
                href="https://linktr.ee/entrext.pro" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#43E01C]/10 text-[#43E01C] hover:bg-[#43E01C]/20 transition-all border border-[#43E01C]/20"
              >
                <LinkIcon className="h-4 w-4" />
                <span className="font-medium">Linktree</span>
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
