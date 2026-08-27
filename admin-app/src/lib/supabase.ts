import { createClient as getBrowserClient } from './supabaseBrowser';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.avishkark.in';

// Browser / Public Client - Re-use the singleton instance
export const supabase = getBrowserClient();

// Server Admin Client (Security Definer - Requires Explicit Service Role Key)
export function getSupabaseAdmin(): SupabaseClient {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceKey) {
    throw new Error('FATAL SECURITY ERROR: SUPABASE_SERVICE_ROLE_KEY is required for privileged operations.');
  }
  return createClient(SUPABASE_URL, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
