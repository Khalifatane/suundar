import { getSupabase } from "@siggistore/supabase";

export function getSupabaseClient() {
  return getSupabase();
}

export const supabase = getSupabaseClient();
