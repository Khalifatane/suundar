import { createClient } from '@supabase/supabase-js';

// Supabase client initialization with proper error handling and configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'X-Client-Info': 'storefront-ecommerce',
      'X-App-Version': '1.0.0',
    },
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Re-export types
export type { Session, User, AuthError } from '@supabase/supabase-js';
