import { Link, useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { Twitter, Linkedin, Instagram, Link as LinkIcon, MessageCircle, Mail } from 'lucide-react';

export const Footer = () => {
  const navigate = useNavigate();

  const handleNavigation = (path: string, scrollId?: string) => {
    if (scrollId && window.location.pathname === '/') {
      document.getElementById(scrollId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(path);
    }
  };

  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <Logo size="lg" />
            <p className="text-muted-foreground leading-relaxed">
              Empowering dropshippers with real-time market intelligence. Discover winning products, analyze trends, and scale your e-commerce business with AI-driven insights.
            </p>
            
            <div className="flex items-center gap-4">
              <a 
                href="https://discord.com/invite/ZZx3cBrx2" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#5865F2]/20 hover:text-[#5865F2] transition-all cursor-pointer"
                title="Join Discord"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/entrext/posts/?feedView=all" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0077b5]/20 hover:text-[#0077b5] transition-all cursor-pointer"
                title="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/entrext.labs" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#E4405F]/20 hover:text-[#E4405F] transition-all cursor-pointer"
                title="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://substack.com/@entrextlabs?utm_campaign=profile&utm_medium=profile-page" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#FF6719]/20 hover:text-[#FF6719] transition-all cursor-pointer"
                title="Substack"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
                  <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
                </svg>
              </a>
              <a 
                href="https://linktr.ee/entrext.pro" 
                target="_blank" 
                rel="noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#43E01C]/20 hover:text-[#43E01C] transition-all cursor-pointer"
                title="Linktree"
              >
                <LinkIcon className="h-5 w-5" />
              </a>
            </div>

            <a 
              href="https://substack.com/@entrextlabs?utm_campaign=profile&utm_medium=profile-page"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary hover:text-primary-foreground border border-primary/20 transition-all duration-300 font-medium w-fit"
            >
              <Mail className="h-4 w-4" />
              <span>Subscribe & Join Community</span>
            </a>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Product</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><button onClick={() => handleNavigation('/', 'features')} className="hover:text-primary transition-colors text-left">Features</button></li>
              <li><button onClick={() => navigate('/pricing')} className="hover:text-primary transition-colors text-left">Pricing</button></li>
              <li><button onClick={() => handleNavigation('/', 'how-it-works')} className="hover:text-primary transition-colors text-left">How It Works</button></li>
              <li><button onClick={() => navigate('/compare')} className="hover:text-primary transition-colors text-left">Compare</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Resources</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog & Intelligence</Link></li>
              <li><a href="https://www.entrext.in" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="https://discord.com/invite/ZZx3cBrx2" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Community</a></li>
              <li><a href="https://www.entrext.in" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Case Studies</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><a href="https://www.entrext.in" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="https://www.entrext.in" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="https://www.entrext.in" target="_blank" rel="noreferrer" className="hover:text-primary transition-colors">Legal</a></li>
              <li><a href="mailto:business@entrext.in" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 PickSpy Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
