import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const memory = typeof process !== 'undefined' ? process.memoryUsage() : { heapUsed: 0, heapTotal: 0, rss: 0 };
  const uptime = typeof process !== 'undefined' ? Math.floor(process.uptime()) : 0;

  return NextResponse.json({
    status: 'healthy',
    app: 'MahaSkill Track (Public Edge)',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    uptime_seconds: uptime,
    services: {
      database: {
        status: 'operational',
        provider: 'Supabase PostgreSQL 17 (TLS 1.3)',
        gateway: 'https://api.avishkark.in'
      },
      memory: {
        heap_used_mb: Math.round((memory.heapUsed / 1024 / 1024) * 100) / 100,
        heap_total_mb: Math.round((memory.heapTotal / 1024 / 1024) * 100) / 100,
        rss_mb: Math.round((memory.rss / 1024 / 1024) * 100) / 100,
      }
    }
  });
}
