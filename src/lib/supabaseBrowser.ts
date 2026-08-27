import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://api.avishkark.in';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI0NjgwMDAwLCJleHAiOjIwMzk5OTk5OTl9.uqQrYqxJACG1bl52DQ54opgfhDQwm4ZwJ-l3kuUOl7E';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.trim().length > 0)
  ? process.env.NEXT_PUBLIC_SUPABASE_URL.trim()
  : DEFAULT_URL;

const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';
const SUPABASE_ANON_KEY = (rawKey.length > 0 && !rawKey.includes('SFMyNTYi'))
  ? rawKey
  : DEFAULT_ANON_KEY;

let browserClient: SupabaseClient | null = null;

export function createClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      }
    });
  }

  if (!browserClient) {
    browserClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    });
  }

  return browserClient;
}
