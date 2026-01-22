import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { AuthProvider } from '../contexts/AuthContext';
import { ProductProvider } from '../contexts/ProductContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import * as sonner from 'sonner';

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

// Mock the toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(() => Promise.resolve({ data: { user: mockUser } })),
      getSession: vi.fn(() => Promise.resolve({ data: { session: { user: mockUser } } })),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
    },
    from: vi.fn(),
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

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    render(<Dashboard />, { wrapper: Wrapper });
    
    // Should show either loading or user info
    expect(screen.getByText(/loading dashboard|welcome back/i)).toBeInTheDocument();
  });

  it('displays user greeting', async () => {
    render(<Dashboard />, { wrapper: Wrapper });
    
    await waitFor(() => {
      expect(screen.getByText(/Good morning|Good afternoon|Good evening/)).toBeInTheDocument();
    });
  });

  it('displays user name and email', async () => {
    render(<Dashboard />, { wrapper: Wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('displays subscription tier', async () => {
    render(<Dashboard />, { wrapper: Wrapper });
    
    await waitFor(() => {
      expect(screen.getByText(/Current Plan: Free|Free/)).toBeInTheDocument();
    });
  });

  it('has profile, subscription, and security buttons', async () => {
    render(<Dashboard />, { wrapper: Wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Profile')).toBeInTheDocument();
      expect(screen.getByText('Subscription')).toBeInTheDocument();
      expect(screen.getByText('Security')).toBeInTheDocument();
    });
  });

  it('displays usage statistics', async () => {
    render(<Dashboard />, { wrapper: Wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Usage Statistics')).toBeInTheDocument();
      expect(screen.getByText('Product Views')).toBeInTheDocument();
      expect(screen.getByText('AI Analyses')).toBeInTheDocument();
      expect(screen.getByText('Data Exports')).toBeInTheDocument();
    });
  });

  it('displays quick actions', async () => {
    render(<Dashboard />, { wrapper: Wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Quick Actions')).toBeInTheDocument();
      expect(screen.getByText('Explore Products')).toBeInTheDocument();
      expect(screen.getByText('Compare Products')).toBeInTheDocument();
    });
  });

  it('has sign out button', async () => {
    render(<Dashboard />, { wrapper: Wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Sign Out')).toBeInTheDocument();
    });
  });

  it('shows upgrade button for free tier', async () => {
    render(<Dashboard />, { wrapper: Wrapper });
    
    await waitFor(() => {
      expect(screen.getByText('Upgrade Plan')).toBeInTheDocument();
    });
  });

  it('displays feature checklist', async () => {
    render(<Dashboard />, { wrapper: Wrapper });
    
    await waitFor(() => {
      const features = screen.getAllByText(/✓|✗/);
      expect(features.length).toBeGreaterThan(0);
    });
  });
});
