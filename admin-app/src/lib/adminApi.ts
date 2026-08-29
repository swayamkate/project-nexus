import { createClient } from '@/lib/supabaseBrowser';

/**
 * Secure Admin Client Mutation Utility
 * Dispatches database writes through Next.js server-side API with Service Role authority.
 * Eliminates browser-side 401 Row-Level Security policy violations.
 */

export interface MutationOptions {
  action: 'insert' | 'upsert' | 'update' | 'delete';
  table: string;
  payload?: any;
  match?: Record<string, any>;
  onConflict?: string;
  select?: string;
}

export async function mutateAdminDb<T = any>(options: MutationOptions): Promise<{ data: T | null; error: Error | null }> {
  try {
    const supabase = createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const res = await fetch('/api/admin/mutate', {
      method: 'POST',
      headers,
      body: JSON.stringify(options)
    });

    const json = await res.json();
    if (!res.ok || json.error) {
      return { data: null, error: new Error(json.error || `Admin mutation failed with status ${res.status}`) };
    }

    return { data: json.data as T, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
}

