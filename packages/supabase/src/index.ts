/**
 * @siggistore/supabase
 *
 * Shared Supabase client and services for both storefront and admin.
 * Using a singleton pattern ensures the same auth session is shared
 * across both applications when served from the same domain.
 */
export {
  getSupabase,
  supabase,
  createSupabaseClient,
  createSupabaseAdminClient,
  resetSupabaseClient,
} from './client';

export type { SupabaseConfig, SupabaseAdminConfig } from './client';
