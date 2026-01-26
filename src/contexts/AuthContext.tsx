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

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (error.code !== 'PGRST116') {
          console.warn('[Auth] Profile fetch failed:', error.message);
        }
        setProfile(null);
        return;
      }
      setProfile(data);
    } catch (err) {
      console.error('[Auth] Unexpected profile error:', err);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        setUser(session.user);
        fetchProfile(session.user.id);
      }
      setIsLoading(false);
    });

    // Unified Auth Listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      console.log(`[Auth] Event: ${event}`);

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || (event === 'INITIAL_SESSION' && session)) {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchProfile(session.user.id);
        }
      } else if (event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
        setUser(null);
        setProfile(null);
      }

      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (!error && data.user) {
      await createProfile({
        id: data.user.id,
        email,
        full_name: fullName,
        subscription_tier: 'Free',
      });
    }
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const response = await supabase.auth.signInWithPassword({ email, password });
    return { error: response.error };
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      // 1. Tell Supabase to sign out
      await supabase.auth.signOut();
      
      // 2. Force local state cleanup in case event doesn't fire fast enough
      setUser(null);
      setProfile(null);
      
      // 3. Clear any supabase-related storage items just to be absolutely sure
      localStorage.removeItem('supabase.auth.token');
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.includes('sb-') || key.includes('supabase'))) {
          localStorage.removeItem(key);
        }
      }
    } catch (err) {
      console.error('[Auth] Sign out failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createProfile = async (profileData: Partial<UserProfile>) => {
    const { error } = await supabase.from('profiles').insert([profileData]);
    if (!error && profileData.id) await fetchProfile(profileData.id);
    return { error };
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) return { error: { message: 'No user logged in' } as PostgrestError };
    const { error } = await supabase.from('profiles').update(profileData).eq('id', user.id);
    if (!error) await fetchProfile(user.id);
    return { error };
  };

  const refreshUserSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
      await fetchProfile(session.user.id);
    }
  };

  const value = {
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
