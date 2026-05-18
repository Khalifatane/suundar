/**
 * React integration for @siggistore/auth
 *
 * Provides useAuth() hook and AuthProvider that work across
 * both storefront and admin applications.
 *
 * The "Dashboard and more" button logic:
 *   if (!user)          → show Login
 *   if (role === 'customer')  → show Account
 *   if (role === 'admin' || role === 'seller') → show Dashboard → routes to /admin
 */
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthUser, UnifiedAuthState, UserRole, ApiResponse } from '@siggistore/shared-types';
import {
  resolveAuthState,
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  resetPassword as authResetPassword,
  updatePassword as authUpdatePassword,
  onAuthStateChange,
  hasAdminAccess,
} from './index';

// ===== CONTEXT =====

interface AuthContextValue extends UnifiedAuthState {
  /** Whether the current user has admin/seller access */
  isAdmin: boolean;
  /** Sign in with email/password */
  signIn: (email: string, password: string) => Promise<ApiResponse<AuthUser>>;
  /** Sign up with email/password */
  signUp: (email: string, password: string, metadata?: Record<string, any>) => Promise<ApiResponse<AuthUser>>;
  /** Sign out globally (clears session for all tabs) */
  signOut: () => Promise<ApiResponse<void>>;
  /** Request password reset email */
  resetPassword: (email: string) => Promise<ApiResponse<void>>;
  /** Update user password */
  updatePassword: (newPassword: string) => Promise<ApiResponse<void>>;
  /** Manually refresh auth state */
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  session: null,
  status: 'loading',
  isAdmin: false,
  signIn: async () => ({ success: false, error: 'AuthProvider not mounted' }),
  signUp: async () => ({ success: false, error: 'AuthProvider not mounted' }),
  signOut: async () => ({ success: false, error: 'AuthProvider not mounted' }),
  resetPassword: async () => ({ success: false, error: 'AuthProvider not mounted' }),
  updatePassword: async () => ({ success: false, error: 'AuthProvider not mounted' }),
  refresh: async () => {},
});

// ===== PROVIDER =====

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UnifiedAuthState>({
    user: null,
    session: null,
    status: 'loading',
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const refresh = useCallback(async () => {
    const newState = await resolveAuthState();
    setState(newState);
    setIsAdmin(
      newState.status === 'authenticated' &&
        (newState.user?.role === 'admin' || newState.user?.role === 'seller'),
    );
  }, []);

  // Initial load + auth state change subscription
  useEffect(() => {
    let active = true;

    // Initial auth state resolution
    resolveAuthState().then((initialState) => {
      if (!active) return;
      setState(initialState);
      setIsAdmin(
        initialState.status === 'authenticated' &&
          (initialState.user?.role === 'admin' || initialState.user?.role === 'seller'),
      );
    });

    // Subscribe to auth changes
    const unsubscribe = onAuthStateChange((newState) => {
      if (!active) return;
      setState(newState);
      setIsAdmin(
        newState.status === 'authenticated' &&
          (newState.user?.role === 'admin' || newState.user?.role === 'seller'),
      );
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  // Auth operations
  const handleSignIn = useCallback(async (email: string, password: string) => {
    const result = await authSignIn(email, password);
    if (result.success && result.data) {
      await refresh();
    }
    return result;
  }, [refresh]);

  const handleSignUp = useCallback(async (email: string, password: string, metadata?: Record<string, any>) => {
    const result = await authSignUp(email, password, metadata);
    if (result.success && result.data) {
      await refresh();
    }
    return result;
  }, [refresh]);

  const handleSignOut = useCallback(async () => {
    const result = await authSignOut();
    setState({ user: null, session: null, status: 'signed_out' });
    setIsAdmin(false);
    return result;
  }, []);

  const handleResetPassword = useCallback(async (email: string) => {
    return authResetPassword(email);
  }, []);

  const handleUpdatePassword = useCallback(async (newPassword: string) => {
    return authUpdatePassword(newPassword);
  }, []);

  const value: AuthContextValue = {
    ...state,
    isAdmin,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    resetPassword: handleResetPassword,
    updatePassword: handleUpdatePassword,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ===== HOOK =====

export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

/**
 * Hook for the "Dashboard and more" button logic.
 *
 * Returns what the header auth button should display and where it should route:
 *   - 'login'     → not authenticated, show Login button → routes to /login
 *   - 'account'   → customer role, show Account button → routes to /personal-info
 *   - 'dashboard' → admin/seller role, show Dashboard → routes to /admin
 */
export function useAuthButton(): {
  type: 'login' | 'account' | 'dashboard';
  label: string;
  href: string;
  user: AuthUser | null;
  loading: boolean;
} {
  const { user, status, isAdmin } = useAuth();

  if (status === 'loading') {
    return { type: 'login', label: 'Loading...', href: '/login', user: null, loading: true };
  }

  if (!user) {
    return { type: 'login', label: 'Login', href: '/login', user: null, loading: false };
  }

  if (isAdmin) {
    return { type: 'dashboard', label: 'Dashboard', href: '/admin', user, loading: false };
  }

  return { type: 'account', label: 'Account', href: '/personal-info', user, loading: false };
}

/**
 * Guard hook for admin routes.
 * Returns forbidden if the user is not an admin/seller.
 */
export function useAdminGuard(): {
  allowed: boolean;
  status: UnifiedAuthState['status'];
  loading: boolean;
} {
  const { user, status, isAdmin } = useAuth();

  if (status === 'loading') {
    return { allowed: false, status: 'loading', loading: true };
  }

  if (status === 'signed_out') {
    return { allowed: false, status: 'signed_out', loading: false };
  }

  if (!isAdmin) {
    return { allowed: false, status: 'forbidden', loading: false };
  }

  return { allowed: true, status: 'authenticated', loading: false };
}
