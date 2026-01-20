import { Logo } from './Logo';

export const Footer = () => {
  return (
    <footer className="border-t border-border/50 py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Spy the trends. Pick the winner.
            </p>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#" className="hover:text-foreground transition-colors">API</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
          </div>

          <div className="text-sm text-muted-foreground">
            © 2026 PickSpy. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
