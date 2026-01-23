import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

import { User, AuthError, PostgrestError } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  subscription_tier: 'Free' | 'Pro' | 'Business';
  created_at?: string;
  updated_at?: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  createProfile: (profileData: Partial<UserProfile>) => Promise<{ error: PostgrestError | null }>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<{ error: PostgrestError | null }>;
  refreshUserSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserProfile = useCallback(async (userId: string, currentUser?: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is fine for new users
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        setProfile(data);
      } else {
        // Fallback or No rows (PGRST116)
        const defaultProfile: UserProfile = {
          id: userId,
          email: currentUser?.email || '',
          full_name: currentUser?.user_metadata?.full_name || 'User',
          subscription_tier: 'Free',
        };
        setProfile(defaultProfile);
      }
    } catch (error) {
      console.warn('Using fallback profile due to error:', error);
      const fallbackProfile: UserProfile = {
        id: userId,
        email: currentUser?.email || '',
        full_name: currentUser?.user_metadata?.full_name || 'User',
        subscription_tier: 'Free',
      };
      setProfile(fallbackProfile);
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      let timedOut = false;
      
      // Safety timeout: forced loading finish after 4 seconds
      const timeoutId = setTimeout(() => {
        if (!mounted) return;
        timedOut = true;
        console.warn("Auth initialization timed out - forcing app load");
        setIsLoading(false);
      }, 4000);

      try {
        // Check if user is already logged in
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mounted && session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id, session.user);
        }
      } catch (error) {
        if (mounted) console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          clearTimeout(timeoutId);
          if (!timedOut) {
            setIsLoading(false);
          }
        }
      }
    };

    initializeAuth();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.user.id, session.user);
      } else {
        setUser(null);
        setProfile(null);
      }
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchUserProfile]);



  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        setUser(data.user);
        // Create profile for new user
        await createProfile({
          id: data.user.id,
          email,
          full_name: fullName,
          subscription_tier: 'Free',
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        setUser(data.user);
        await fetchUserProfile(data.user.id, data.user);
      }

      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase sign out error:', error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      // Force clear state regardless of server response
      setUser(null);
      setProfile(null);
    }
  };

  const createProfile = async (profileData: Partial<UserProfile>) => {
    try {
      const { error } = await supabase.from('profiles').insert([profileData]);

      if (error) {
        return { error };
      }

      setProfile(profileData as UserProfile);
      return { error: null };
    } catch (error) {
      console.error('Create profile error:', error);
      return { error };
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      if (!user?.id) {
        return { error: { message: 'No user logged in', code: 'NO_USER' } as PostgrestError };
      }

      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);

      if (error) {
        return { error };
      }

      setProfile((prev) => (prev ? { ...prev, ...profileData } : null));
      return { error: null };
    } catch (error) {
      console.error('Update profile error:', error);
      return { error };
    }
  };

  const refreshUserSession = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile(session.user.id, session.user);
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    createProfile,
    updateProfile,
    refreshUserSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
