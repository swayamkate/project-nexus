import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://api.avishkark.in';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI0NjgwMDAwLCJleHAiOjIwMzk5OTk5OTl9.uqQrYqxJACG1bl52DQ54opgfhDQwm4ZwJ-l3kuUOl7E';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.trim().length > 0)
  ? process.env.NEXT_PUBLIC_SUPABASE_URL.trim()
  : DEFAULT_URL;

const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';
// This project has one canonical self-hosted Supabase instance. A stale
// Cloudflare build variable previously injected a different JWT and caused
// every browser request to receive 401. Only accept the configured key when
// it is the known key for api.avishkark.in; otherwise fail safe to the public
// canonical key (never a service-role key).
const SUPABASE_ANON_KEY = rawKey === DEFAULT_ANON_KEY ? rawKey : DEFAULT_ANON_KEY;
const BROWSER_STORAGE_KEY = 'nexus_candidate_auth_token_v2';

let browserClient: SupabaseClient | null = null;
let publicClient: SupabaseClient | null = null;

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
    // This was the storage key used by the legacy client. Keeping any value
    // under it lets an older client send a stale bearer token and turn public
    // anon requests into 401 responses. The current client uses the isolated
    // key below, so it is always safe to remove the legacy value.
    try {
      localStorage.removeItem('sb-api-auth-token');
      // Rotate the candidate key after the legacy client migration so a
      // browser cannot reuse a session created by an older bundle.
      localStorage.removeItem('nexus_candidate_auth_token');
    } catch {}

    browserClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storageKey: BROWSER_STORAGE_KEY,
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      }
    });
  }

  return browserClient;
}

/**
 * Stateless anon client for public lookups. It deliberately has no session
 * persistence, so a stale candidate bearer token cannot turn an anon RPC into
 * a 401. Keep authenticated reads/writes on createClient().
 */
export function createPublicClient(): SupabaseClient {
  if (typeof window === 'undefined') {
    return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
    });
  }

  if (!publicClient) {
    publicClient = createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storageKey: 'nexus_public_anon_client_v1',
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      }
    });
  }
  return publicClient;
}

/** Call a public RPC without Supabase Auth's session/header machinery. */
export async function callPublicRpc<T>(functionName: string, args: Record<string, unknown>): Promise<T> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  });
  if (!response.ok) {
    throw new Error(`Public lookup failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}
