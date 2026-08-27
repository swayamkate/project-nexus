import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.avishkark.in';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI0NjgwMDAwLCJleHAiOjIwMzk5OTk5OTl9.uqQrYqxJACG1bl52DQ54opgfhDQwm4ZwJ-l3kuUOl7E';

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false, autoRefreshToken: false }
  });

  let dbStatus = 'healthy';
  let dbLatencyMs = 0;
  let dbError: string | null = null;

  try {
    const dbStart = Date.now();
    const { error } = await supabase.from('government_schemes').select('id', { count: 'exact', head: true });
    dbLatencyMs = Date.now() - dbStart;

    if (error) {
      dbStatus = 'degraded';
      dbError = error.message;
    }
  } catch (err: any) {
    dbStatus = 'unreachable';
    dbError = err.message || 'Database connection error';
  }

  const memory = process.memoryUsage();
  const totalResponseTimeMs = Date.now() - startTime;
  const isHealthy = dbStatus !== 'unreachable';

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'unhealthy',
      app: 'Nexus Admin Control Center (Executive Console)',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      uptime_seconds: Math.floor(process.uptime()),
      latency_ms: totalResponseTimeMs,
      services: {
        database: {
          status: dbStatus,
          latency_ms: dbLatencyMs,
          error: dbError,
        },
        memory: {
          heap_used_mb: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100,
          heap_total_mb: Math.round((memory.heapTotal / 1024 / 1024) * 100) / 100,
          rss_mb: Math.round((memory.rss / 1024 / 1024) * 100) / 100,
        },
      },
    },
    { status: isHealthy ? 200 : 503 }
  );
}
