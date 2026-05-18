import { useState, useEffect, useCallback } from 'react';
import { supabaseAuth, supabaseUser } from '@siggistore/services/storefront/initialized-services';
import type { AuthUser } from '@siggistore/shared-types';
import type { SupabaseOrder } from '@siggistore/shared-types';

/**
 * Hook for Supabase authentication using the new service infrastructure
 */
export const useSupabaseAuthService = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const accountRegister = useCallback(
    async (email: string, password: string, firstName?: string, lastName?: string) => {
      try {
        setLoading(true);
        setError(null);
        const result = await supabaseAuth.accountRegister({
          email,
          password,
          firstName,
          lastName,
        });

        if (!result.success) {
          setError(result.errors?.[0]?.message || 'Registration failed');
          return result;
        }

        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Registration failed';
        setError(errorMsg);
        return { success: false, errors: [{ code: 'UNKNOWN_ERROR', message: errorMsg }] };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const tokenRefresh = useCallback(
    async (refreshToken: string) => {
      try {
        setLoading(true);
        setError(null);
        const result = await supabaseAuth.tokenRefresh({ refreshToken });

        if (!result.success) {
          setError(result.errors?.[0]?.message || 'Token refresh failed');
          return result;
        }

        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Token refresh failed';
        setError(errorMsg);
        return { success: false, errors: [{ code: 'UNKNOWN_ERROR', message: errorMsg }] };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const confirmAccount = useCallback(
    async (token: string) => {
      try {
        setLoading(true);
        setError(null);
        const result = await supabaseAuth.confirmAccount({ token });

        if (!result.success) {
          setError(result.errors?.[0]?.message || 'Account confirmation failed');
          return result;
        }

        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Account confirmation failed';
        setError(errorMsg);
        return { success: false, errors: [{ code: 'UNKNOWN_ERROR', message: errorMsg }] };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const requestPasswordReset = useCallback(
    async (email: string) => {
      try {
        setLoading(true);
        setError(null);
        const result = await supabaseAuth.requestPasswordReset({ email });

        if (!result.success) {
          setError(result.errors?.[0]?.message || 'Password reset request failed');
          return result;
        }

        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Password reset request failed';
        setError(errorMsg);
        return { success: false, errors: [{ code: 'UNKNOWN_ERROR', message: errorMsg }] };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const passwordSet = useCallback(
    async (token: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        const result = await supabaseAuth.passwordSet({ token, password });

        if (!result.success) {
          setError(result.errors?.[0]?.message || 'Password set failed');
          return result;
        }

        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Password set failed';
        setError(errorMsg);
        return { success: false, errors: [{ code: 'UNKNOWN_ERROR', message: errorMsg }] };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    user,
    loading,
    error,
    accountRegister,
    tokenRefresh,
    confirmAccount,
    requestPasswordReset,
    passwordSet,
  };
};

/**
 * Hook for Supabase user management
 */
export const useSupabaseUserService = (accessToken?: string) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [orders, setOrders] = useState<SupabaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!accessToken) {
      setUser(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await supabaseUser.userGet({ accessToken });

      if (!result.success) {
        setError(result.errors?.[0]?.message || 'Failed to fetch user');
        return;
      }

      setUser(result.data || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const fetchOrders = useCallback(async () => {
    if (!accessToken) {
      setOrders([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await supabaseUser.ordersGet({ accessToken });

      if (!result.success) {
        setError(result.errors?.[0]?.message || 'Failed to fetch orders');
        return;
      }

      setOrders(result.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const updateAccount = useCallback(
    async (accountInput: { firstName?: string; lastName?: string }) => {
      if (!accessToken) {
        return { success: false, errors: [{ code: 'NO_ACCESS_TOKEN' }] };
      }

      try {
        setLoading(true);
        setError(null);
        const result = await supabaseUser.accountUpdate({
          accessToken,
          accountInput,
        });

        if (!result.success) {
          setError(result.errors?.[0]?.message || 'Account update failed');
          return result;
        }

        setUser(result.data || null);
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Account update failed';
        setError(errorMsg);
        return { success: false, errors: [{ code: 'UNKNOWN_ERROR', message: errorMsg }] };
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  const changePassword = useCallback(
    async (newPassword: string) => {
      if (!accessToken) {
        return { success: false, errors: [{ code: 'NO_ACCESS_TOKEN' }] };
      }

      try {
        setLoading(true);
        setError(null);
        const result = await supabaseUser.passwordChange({
          accessToken,
          newPassword,
        });

        if (!result.success) {
          setError(result.errors?.[0]?.message || 'Password change failed');
          return result;
        }

        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Password change failed';
        setError(errorMsg);
        return { success: false, errors: [{ code: 'UNKNOWN_ERROR', message: errorMsg }] };
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  useEffect(() => {
    fetchUser();
    fetchOrders();
  }, [fetchUser, fetchOrders]);

  return {
    user,
    orders,
    loading,
    error,
    fetchUser,
    fetchOrders,
    updateAccount,
    changePassword,
  };
};
