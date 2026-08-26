'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseBrowser';
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createClient();
      
      try {
        // 1. Check if PKCE code is in the query params
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const errorParam = urlParams.get('error_description') || urlParams.get('error');

        if (errorParam) {
          throw new Error(errorParam);
        }

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
        }

        // 2. Verify active session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session) {
          setStatus('success');
          setTimeout(() => {
            router.push('/dashboard');
            router.refresh();
          }, 1200);
        } else {
          // Listen for onAuthStateChange if token parsing from hash is in-flight
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
            if (event === 'SIGNED_IN' || newSession) {
              setStatus('success');
              setTimeout(() => {
                router.push('/dashboard');
                router.refresh();
              }, 1200);
            }
          });

          // Timeout fallback
          setTimeout(async () => {
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) {
              setStatus('success');
              router.push('/dashboard');
            } else {
              setStatus('error');
              setErrorMessage('Session verification timed out. Please try logging in directly.');
            }
          }, 4000);

          return () => subscription.unsubscribe();
        }
      } catch (err: any) {
        setStatus('error');
        setErrorMessage(err.message || 'Authentication verification failed.');
      }
    };
    
    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#040812] flex flex-col items-center justify-center text-white px-4">
      <div className="max-w-md w-full bg-[#0a1020] border border-slate-800 rounded-3xl p-8 text-center shadow-2xl">
        {status === 'verifying' && (
          <>
            <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white">Verifying Email Authentication...</h2>
            <p className="text-sm text-slate-400 mt-2">Connecting your account to the secure Nexus enclave.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white">Email Verified Successfully!</h2>
            <p className="text-sm text-slate-400 mt-2">Redirecting to your Trainee Dashboard...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white">Verification Error</h2>
            <p className="text-sm text-rose-400 mt-2 mb-6">{errorMessage}</p>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition"
            >
              Back to Login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
