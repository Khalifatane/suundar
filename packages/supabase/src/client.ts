/**
 * Shared Supabase Client
 *
 * Both storefront and admin use this single client instance.
 * With persistSession: true, the same auth session is shared
 * across both apps when served from the same domain.
 */
import { createClient } from '@supabase/supabase-js';

function requireEnv(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

const supabaseUrl =
  import.meta.env?.VITE_SUPABASE_URL ||
  import.meta.env?.NEXT_PUBLIC_SUPABASE_URL ||
  (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL : undefined);

const supabaseAnonKey =
  import.meta.env?.VITE_SUPABASE_ANON_KEY ||
  import.meta.env?.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  (typeof process !== 'undefined' ? process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined);

let sharedClient: ReturnType<typeof createClient> | null = null;

export type SupabaseConfig = {
  anonKey: string;
  url: string;
};

export type SupabaseAdminConfig = {
  serviceRoleKey: string;
  url: string;
};

/**
 * Get the shared singleton Supabase client.
 * Both storefront and admin use this same instance so that
 * auth cookies/session storage are shared across the domain.
 */
export function getSupabase() {
  if (!sharedClient) {
    const url = requireEnv(supabaseUrl, 'VITE_SUPABASE_URL');
    const key = requireEnv(supabaseAnonKey, 'VITE_SUPABASE_ANON_KEY');

    sharedClient = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'siggistore-auth-token',
      },
      global: {
        headers: {
          'X-Client-Info': 'siggistore-shared',
        },
      },
    });
  }

  return sharedClient;
}

/**
 * Create a fresh Supabase client with an optional access token.
 * Used for server-side operations where you need to pass a specific token.
 */
export const createSupabaseClient = (
  config: SupabaseConfig,
  accessToken?: string,
) =>
  createClient(config.url, config.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: accessToken
      ? {
          headers: {
            apikey: config.anonKey,
            Authorization: `Bearer ${accessToken}`,
          },
        }
      : undefined,
  });

/**
 * Create a Supabase admin client with service role key.
 * Use with caution - bypasses RLS policies.
 */
export const createSupabaseAdminClient = (config: SupabaseAdminConfig) =>
  createClient(config.url, config.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

/**
 * Proxy to access the shared Supabase client directly.
 * Equivalent to getSupabase() but can be used as a drop-in replacement
 * for existing `supabase` imports.
 */
export const supabase = new Proxy(
  {} as ReturnType<typeof createClient>,
  {
    get(_target, prop) {
      return getSupabase()[prop as keyof typeof sharedClient];
    },
  }
);

/**
 * Reset the singleton client (useful for testing).
 */
export function resetSupabaseClient() {
  sharedClient = null;
}
