import { Logo } from './Logo';
import { Twitter, Linkedin, Instagram, Link as LinkIcon, MessageCircle, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl pt-20 pb-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col gap-6">
            <Logo size="lg" />
            <p className="text-muted-foreground leading-relaxed">
              The premier marketplace connecting visionary founders with elite growth partners to build, launch, and scale the future.
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
              <li><a href="#" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Integrations</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Resources</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Company</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Legal</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© 2026 PickSpy Inc. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
