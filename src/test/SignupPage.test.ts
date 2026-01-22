import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SignupPage from '../pages/SignupPage';
import { AuthProvider } from '../contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import * as sonner from 'sonner';

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
      getUser: vi.fn(),
      getSession: vi.fn(),
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(),
    },
  },
}));

const queryClient = new QueryClient();

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

describe('SignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders signup form', () => {
    render(<SignupPage />, { wrapper: Wrapper });
    
    expect(screen.getByText('Start for free today')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('John Doe')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument();
  });

  it('renders login form on /login route', () => {
    // Mock the location
    window.history.pushState({}, '', '/login');
    
    render(<SignupPage />, { wrapper: Wrapper });
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  });

  it('validates required fields on signup', async () => {
    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: Wrapper });

    const submitButton = screen.getByText('Create Account');
    await user.click(submitButton);

    expect(sonner.toast.error).toHaveBeenCalledWith('Please fill in all fields');
  });

  it('validates password length', async () => {
    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: Wrapper });

    const fullNameInput = screen.getByPlaceholderText('John Doe');
    const emailInput = screen.getByPlaceholderText('john@example.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(fullNameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(passwordInput, '123');

    const submitButton = screen.getByText('Create Account');
    await user.click(submitButton);

    expect(sonner.toast.error).toHaveBeenCalledWith('Password must be at least 6 characters');
  });

  it('has link to sign in page', () => {
    render(<SignupPage />, { wrapper: Wrapper });
    
    const signInLink = screen.getByText('Sign In');
    expect(signInLink).toBeInTheDocument();
  });

  it('has link to privacy and terms', () => {
    render(<SignupPage />, { wrapper: Wrapper });
    
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms of Service')).toBeInTheDocument();
  });

  it('shows Google sign up button', () => {
    render(<SignupPage />, { wrapper: Wrapper });
    
    expect(screen.getByText(/Sign up with Google|Sign in with Google/)).toBeInTheDocument();
  });

  it('has back button to homepage', async () => {
    const user = userEvent.setup();
    render(<SignupPage />, { wrapper: Wrapper });
    
    const backButton = screen.getByText('Back');
    expect(backButton).toBeInTheDocument();
  });
});
