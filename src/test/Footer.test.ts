import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { AuthProvider } from '../contexts/AuthContext';
import { ProductProvider } from '../contexts/ProductContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';

// Mock supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: null } })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

const queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ProductProvider>
        <TooltipProvider>
          <BrowserRouter>
            {children}
          </BrowserRouter>
        </TooltipProvider>
      </ProductProvider>
    </AuthProvider>
  </QueryClientProvider>
);

describe('Footer - Hash Links Removal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders footer', () => {
    render(<Footer />, { wrapper: Wrapper });
    
    expect(screen.getByText(/© 2026 PickSpy Inc/)).toBeInTheDocument();
  });

  it('renders footer sections', () => {
    render(<Footer />, { wrapper: Wrapper });
    
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Company')).toBeInTheDocument();
  });

  it('does not have empty hash links', () => {
    const { container } = render(<Footer />, { wrapper: Wrapper });
    
    const emptyHashLinks = container.querySelectorAll('a[href="#"], button[href="#"]');
    expect(emptyHashLinks.length).toBe(0);
  });

  it('has proper navigation links to policy pages', () => {
    render(<Footer />, { wrapper: Wrapper });
    
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument();
  });

  it('has social media links', () => {
    render(<Footer />, { wrapper: Wrapper });
    
    const discordLink = screen.getByTitle('Join Discord');
    const linkedinLink = screen.getByTitle('LinkedIn');
    const instagramLink = screen.getByTitle('Instagram');
    const linktreeLink = screen.getByTitle('Linktree');
    
    expect(discordLink).toBeInTheDocument();
    expect(linkedinLink).toBeInTheDocument();
    expect(instagramLink).toBeInTheDocument();
    expect(linktreeLink).toBeInTheDocument();
  });

  it('has subscribe button with external link', () => {
    render(<Footer />, { wrapper: Wrapper });
    
    const subscribeButton = screen.getByText('Subscribe & Join Community');
    expect(subscribeButton).toBeInTheDocument();
    expect(subscribeButton.closest('a')).toHaveAttribute('target', '_blank');
  });

  it('has About link to external site', () => {
    render(<Footer />, { wrapper: Wrapper });
    
    const aboutLink = screen.getByText('About');
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink.closest('a')).toHaveAttribute('target', '_blank');
  });

  it('has Contact link with mailto', () => {
    render(<Footer />, { wrapper: Wrapper });
    
    const contactLink = screen.getByText('Contact');
    expect(contactLink).toBeInTheDocument();
    expect(contactLink.closest('a')).toHaveAttribute('href', 'mailto:business@entrext.in');
  });

  it('description is displayed', () => {
    render(<Footer />, { wrapper: Wrapper });
    
    expect(screen.getByText(/Empowering dropshippers/)).toBeInTheDocument();
  });

  it('no hash-based navigation buttons exist', () => {
    const { container } = render(<Footer />, { wrapper: Wrapper });
    
    const hashButtons = container.querySelectorAll('button[onclick*="#"]');
    const hashLinks = container.querySelectorAll('a[href^="#"]');
    
    expect(hashLinks.length).toBe(0);
    // Buttons with scroll functionality should not use # in onclick
    const hashOnClickButtons = Array.from(hashButtons).filter(btn => 
      btn.getAttribute('onclick')?.includes('#')
    );
    expect(hashOnClickButtons.length).toBe(0);
  });

  it('has proper footer structure', () => {
    const { container } = render(<Footer />, { wrapper: Wrapper });
    
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('border-t', 'border-white/10', 'bg-black/40');
  });
});
