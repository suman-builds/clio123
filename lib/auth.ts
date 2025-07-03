import { supabase } from './supabase';
import { Database } from './database.types';

export type UserRole = 'admin' | 'doctor' | 'support';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  try {
    const result = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return result;
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
}

/**
 * Sign up with email and password
 */
export async function signUp(
  email: string, 
  password: string, 
  fullName: string, 
  role: UserRole = 'support'
) {
  try {
    // First, create the auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    });

    if (authError) {
      return { data: null, error: authError };
    }

    // The profile will be created automatically via a trigger in Supabase
    // when a new user is created in auth.users

    return { data: authData, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error };
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  try {
    return await supabase.auth.signOut();
  } catch (error) {
    console.error('Sign out error:', error);
    return { error };
  }
}

/**
 * Reset password
 */
export async function resetPassword(email: string) {
  try {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return { data: null, error };
  }
}

/**
 * Update password
 */
export async function updatePassword(password: string) {
  try {
    return await supabase.auth.updateUser({
      password,
    });
  } catch (error) {
    console.error('Update password error:', error);
    return { data: null, error };
  }
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      return null;
    }
    return data.user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * Get the current user's profile
 */
export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return null;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !data) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data as UserProfile;
  } catch (error) {
    console.error('Get current user profile error:', error);
    return null;
  }
}

/**
 * Update the current user's profile
 */
export async function updateUserProfile(profile: Partial<UserProfile>) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { data: null, error: new Error('Not authenticated') };
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(profile)
      .eq('id', user.id)
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Update user profile error:', error);
    return { data: null, error };
  }
}