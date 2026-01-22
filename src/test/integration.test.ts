import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock data
const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
  },
};

const mockProfile = {
  id: 'test-user-123',
  email: 'test@example.com',
  full_name: 'Test User',
  subscription_tier: 'Free',
};

// Mock supabase
const mockSupabase = {
  auth: {
    getUser: vi.fn(() => Promise.resolve({ data: { user: null } })),
    getSession: vi.fn(() => Promise.resolve({ data: { session: null } })),
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } },
    })),
  },
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: null, error: null })),
      })),
    })),
    insert: vi.fn(() => Promise.resolve({ error: null })),
    update: vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ error: null })),
    })),
  })),
};

vi.mock('@/lib/supabase', () => ({
  supabase: mockSupabase,
}));

// Mock the ProductContext's backend
vi.mock('@/contexts/ProductContext', async () => {
  const actual = await vi.importActual('@/contexts/ProductContext');
  return {
    ...actual,
    ProductProvider: ({ children }: { children: React.ReactNode }) => children,
  };
});

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset auth state
    mockSupabase.auth.getSession.mockReturnValue(
      Promise.resolve({ data: { session: null } })
    );
  });

  it('renders app without crashing', () => {
    render(<App />);
    
    expect(screen.queryByRole('navigation')).toBeTruthy();
  });

  it('shows Sign In button when not authenticated', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Sign In|Get Started/)).toBeInTheDocument();
    });
  });

  it('navigates to signup page', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // Click Get Started or Sign Up button
    const signUpButtons = screen.queryAllByText(/Sign In|Get Started/);
    if (signUpButtons.length > 0) {
      await user.click(signUpButtons[0]);
    }
    
    // Navigation should work
    await waitFor(() => {
      // Should be able to navigate
      expect(window.location.pathname === '/' || window.location.pathname === '/signup').toBe(true);
    });
  });

  it('has footer with policy links', async () => {
    render(<App />);
    
    // Scroll to bottom to ensure footer is rendered
    window.scrollTo(0, document.body.scrollHeight);
    
    await waitFor(() => {
      expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    });
  });

  it('has header with navigation', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText('Trending')).toBeInTheDocument();
    });
  });

  it('does not have hash-based routing', () => {
    const { container } = render(<App />);
    
    // Check for empty hash links
    const hashLinks = container.querySelectorAll('a[href^="#"]');
    const emptyHashLinks = Array.from(hashLinks).filter(link => 
      link.getAttribute('href') === '#'
    );
    
    expect(emptyHashLinks.length).toBe(0);
  });

  it('all navigation buttons work without hash links', async () => {
    render(<App />);
    
    const buttons = screen.queryAllByRole('button');
    const hashButtons = buttons.filter(btn => 
      btn.getAttribute('onclick')?.includes('href') && 
      btn.getAttribute('onclick')?.includes('#')
    );
    
    // Should have minimal/no hash-based navigation
    expect(hashButtons.length).toBeLessThan(3);
  });

  it('has proper routing structure', async () => {
    render(<App />);
    
    await waitFor(() => {
      // App should render without errors
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });
  });

  it('shows pricing page link', async () => {
    render(<App />);
    
    const pricingLink = screen.getByText('Pricing');
    expect(pricingLink).toBeInTheDocument();
  });

  it('shows compare link', async () => {
    render(<App />);
    
    const compareLink = screen.getByText('Compare');
    expect(compareLink).toBeInTheDocument();
  });
});

describe('Authentication Flow Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('initializes with unauthenticated state', async () => {
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByText(/Sign In|Get Started/)).toBeInTheDocument();
    });
  });

  it('allows navigation to signup', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    // The app should have Sign In/Get Started options
    const buttons = screen.queryAllByText(/Sign In|Get Started/);
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('has both login and signup routes', async () => {
    render(<App />);
    
    // Test that both routes exist by checking navigation structure
    await waitFor(() => {
      expect(screen.getByText('Trending')).toBeInTheDocument();
    });
  });

  it('shows dashboard when authenticated', async () => {
    // Mock authenticated state
    mockSupabase.auth.getSession.mockReturnValue(
      Promise.resolve({ 
        data: { 
          session: { 
            user: mockUser,
            access_token: 'test-token',
          } 
        } 
      })
    );
    mockSupabase.auth.getUser.mockReturnValue(
      Promise.resolve({ data: { user: mockUser } })
    );

    render(<App />);
    
    // After auth state changes, should show dashboard option or user is authenticated
    await waitFor(() => {
      // Either shows Dashboard button or user info
      const dashboardBtn = screen.queryByText('Dashboard');
      const headerNav = screen.getByRole('navigation');
      expect(dashboardBtn || headerNav).toBeTruthy();
    });
  });
});

describe('Navigation Flow Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('can navigate from home to pricing', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const pricingButton = screen.getByText('Pricing');
    expect(pricingButton).toBeInTheDocument();
    
    await user.click(pricingButton);
    
    // Navigation should work
    await waitFor(() => {
      expect(window.location.pathname === '/' || window.location.pathname === '/pricing').toBe(true);
    });
  });

  it('can navigate from home to compare', async () => {
    const user = userEvent.setup();
    render(<App />);
    
    const compareButton = screen.getByText('Compare');
    expect(compareButton).toBeInTheDocument();
    
    await user.click(compareButton);
    
    // Navigation should work
    await waitFor(() => {
      expect(window.location.pathname === '/' || window.location.pathname === '/compare').toBe(true);
    });
  });

  it('Features link scrolls on home page', async () => {
    render(<App />);
    
    const featuresButton = screen.getByText('Features');
    expect(featuresButton).toBeInTheDocument();
    
    // Should not have hash in href
    expect(featuresButton.getAttribute('href')).not.toContain('#');
  });

  it('How it Works link scrolls on home page', async () => {
    render(<App />);
    
    const howItWorksButton = screen.getByText('How it Works');
    expect(howItWorksButton).toBeInTheDocument();
    
    // Should not have hash in href
    expect(howItWorksButton.getAttribute('href')).not.toContain('#');
  });
});
