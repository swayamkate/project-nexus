import { createClient } from '@supabase/supabase-js';

const DEFAULT_URL = 'https://api.avishkark.in';
const DEFAULT_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI0NjgwMDAwLCJleHAiOjIwMzk5OTk5OTl9.uqQrYqxJACG1bl52DQ54opgfhDQwm4ZwJ-l3kuUOl7E';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL.trim().length > 0)
  ? process.env.NEXT_PUBLIC_SUPABASE_URL.trim()
  : DEFAULT_URL;

const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || '';
const supabaseAnonKey = (rawKey.length > 0 && !rawKey.includes('SFMyNTYi'))
  ? rawKey
  : DEFAULT_ANON_KEY;

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || '';

// Browser / Public Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  }
});

// Server Admin Client with bypass RLS for automated Webhooks & Backend processing
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey || supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
