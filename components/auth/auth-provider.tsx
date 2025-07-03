'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { UserProfile } from '@/lib/auth';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, getCurrentUserProfile } from '@/lib/auth';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: false,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { setUser: setStoreUser } = useStore();

  const refreshProfile = async () => {
    try {
      const userProfile = await getCurrentUserProfile();
      setProfile(userProfile);
      setStoreUser(userProfile);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Get current user
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        // Get user profile if user exists
        if (currentUser) {
          const userProfile = await getCurrentUserProfile();
          
          if (userProfile) {
            setProfile(userProfile);
            setStoreUser(userProfile);
          } else {
            // Profile might not exist yet if this is a new user
            console.warn('User authenticated but profile not found');
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast.error('Authentication error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);
        
        if (session?.user) {
          const userProfile = await getCurrentUserProfile();
          setProfile(userProfile);
          setStoreUser(userProfile);
        } else {
          setProfile(null);
          setStoreUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [setStoreUser]);

  const value = {
    user,
    profile,
    loading,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};