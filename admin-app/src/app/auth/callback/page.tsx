'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseBrowser';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      const supabase = createClient();
      
      // Supabase JS automatically handles the hash/query parameters and sets the session
      // in the browser's localStorage. We just need to wait a moment and redirect.
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (session) {
        router.push('/');
      } else {
        // If not immediately available, listen for the auth event
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN') {
            router.push('/');
          }
        });
        
        return () => subscription.unsubscribe();
      }
    };
    
    handleAuth();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col items-center justify-center text-white">
      <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-4" />
      <h2 className="text-xl font-bold">Verifying Authentication...</h2>
      <p className="text-slate-400 mt-2">Please wait while we log you into CareerLoop.</p>
    </div>
  );
}
