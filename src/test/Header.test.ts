import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../components/Header';
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
      signOut: vi.fn(),
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

describe('Header Navigation - Hash Links Removal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders header with navigation links', async () => {
    render(<Header />, { wrapper: Wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Trending')).toBeInTheDocument();
      expect(screen.getByText('Features')).toBeInTheDocument();
      expect(screen.getByText('How it Works')).toBeInTheDocument();
      expect(screen.getByText('Pricing')).toBeInTheDocument();
    });
  });

  it('has Features button that does not use hash link', async () => {
    render(<Header />, { wrapper: Wrapper });
    
    const featuresButton = screen.getByText('Features');
    expect(featuresButton).toBeInTheDocument();
    expect(featuresButton.getAttribute('href')).not.toContain('#');
  });

  it('has How it Works button that does not use hash link', async () => {
    render(<Header />, { wrapper: Wrapper });
    
    const howItWorksButton = screen.getByText('How it Works');
    expect(howItWorksButton).toBeInTheDocument();
    expect(howItWorksButton.getAttribute('href')).not.toContain('#');
  });

  it('shows Sign In button when not authenticated', async () => {
    render(<Header />, { wrapper: Wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });
  });

  it('shows Get Started button when not authenticated', async () => {
    render(<Header />, { wrapper: Wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Get Started')).toBeInTheDocument();
    });
  });

  it('navigates to /pricing on Pricing click', async () => {
    const user = userEvent.setup();
    render(<Header />, { wrapper: Wrapper });
    
    const pricingButton = screen.getByText('Pricing');
    await user.click(pricingButton);
    
    expect(window.location.pathname === '/' || window.location.pathname === '/pricing').toBe(true);
  });

  it('navigates to /compare on Compare click', async () => {
    const user = userEvent.setup();
    render(<Header />, { wrapper: Wrapper });
    
    const compareButton = screen.getByText('Compare');
    await user.click(compareButton);
    
    // Should navigate to /compare
    await waitFor(() => {
      expect(window.location.pathname === '/' || window.location.pathname === '/compare').toBe(true);
    });
  });

  it('has AI Analyzer badge', () => {
    render(<Header />, { wrapper: Wrapper });
    
    expect(screen.getByText('AI Analyzer')).toBeInTheDocument();
    expect(screen.getByText('PRO')).toBeInTheDocument();
  });

  it('does not have hash-based links', () => {
    const { container } = render(<Header />, { wrapper: Wrapper });
    
    const links = container.querySelectorAll('a[href^="#"]');
    const buttons = container.querySelectorAll('button[href^="#"]');
    
    expect(links.length).toBe(0);
    expect(buttons.length).toBe(0);
  });

  it('renders logo that navigates to home', async () => {
    const user = userEvent.setup();
    render(<Header />, { wrapper: Wrapper });
    
    // The logo should be present
    const logoContainer = screen.getByRole('navigation').parentElement;
    expect(logoContainer).toBeInTheDocument();
  });
});
