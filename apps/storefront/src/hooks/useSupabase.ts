// React hooks for Supabase integration
import { useEffect, useState, useCallback } from 'react';
import supabaseService from '@siggistore/services/storefront/supabase-service';
import type { SupabaseUser, SupabaseProfile, SupabaseOrder } from '@siggistore/shared-types';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getInitialUser = async () => {
      try {
        const currentUser = await supabaseService.auth.getCurrentUser();
        setUser(currentUser);
        setError(null);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    getInitialUser();

    // Subscribe to auth changes
    const { data } = supabaseService.auth.onAuthStateChange((authUser) => {
      setUser(authUser);
    });

    return () => {
      data?.subscription?.unsubscribe();
    };
  }, []);

  const signUp = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const response = await supabaseService.auth.signUp(email, password);
        if (response.success) {
          setUser(response.data || null);
        }
        setError(response.error || null);
        return response;
      } catch (err) {
        const errorMsg = String(err);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const response = await supabaseService.auth.signIn(email, password);
        if (response.success) {
          setUser(response.data || null);
        }
        setError(response.error || null);
        return response;
      } catch (err) {
        const errorMsg = String(err);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    try {
      setLoading(true);
      const response = await supabaseService.auth.signOut();
      if (response.success) {
        setUser(null);
      }
      setError(response.error || null);
      return response;
    } catch (err) {
      const errorMsg = String(err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, []);

  return { user, loading, error, signUp, signIn, signOut };
};

export const useSupabaseProfile = (userId: string | null) => {
  const [profile, setProfile] = useState<SupabaseProfile | null>(null);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await supabaseService.profile.getProfile(userId);
        if (response.success) {
          setProfile(response.data || null);
        }
        setError(response.error || null);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const updateProfile = useCallback(
    async (updates: Partial<SupabaseProfile>) => {
      if (!userId) return { success: false, error: 'No user ID' };

      try {
        setLoading(true);
        const response = await supabaseService.profile.upsertProfile(userId, updates);
        if (response.success) {
          setProfile(response.data || null);
        }
        setError(response.error || null);
        return response;
      } catch (err) {
        const errorMsg = String(err);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return { profile, loading, error, updateProfile };
};

export const useSupabaseOrders = (userId: string | null) => {
  const [orders, setOrders] = useState<SupabaseOrder[]>([]);
  const [loading, setLoading] = useState(!!userId);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await supabaseService.order.getOrders(userId);
        if (response.success) {
          setOrders(response.data || []);
        }
        setError(response.error || null);
      } catch (err) {
        setError(String(err));
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return { orders, loading, error };
};

export const useSupabaseCart = (userId: string | null) => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCart = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await supabaseService.cart.getCart(userId);
      if (response.success) {
        setCart(response.data);
      }
      setError(response.error || null);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const saveCart = useCallback(
    async (items: any[]) => {
      if (!userId) return { success: false, error: 'No user ID' };

      try {
        setLoading(true);
        const response = await supabaseService.cart.saveCart(userId, items);
        if (response.success) {
          setCart({ items });
        }
        setError(response.error || null);
        return response;
      } catch (err) {
        const errorMsg = String(err);
        setError(errorMsg);
        return { success: false, error: errorMsg };
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const clearCart = useCallback(async () => {
    if (!userId) return { success: false, error: 'No user ID' };

    try {
      setLoading(true);
      const response = await supabaseService.cart.clearCart(userId);
      if (response.success) {
        setCart(null);
      }
      setError(response.error || null);
      return response;
    } catch (err) {
      const errorMsg = String(err);
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      getCart();
    }
  }, [userId, getCart]);

  return { cart, loading, error, saveCart, clearCart, getCart };
};
