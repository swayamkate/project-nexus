import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    app: 'Nexus Candidate Portal',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: 'operational',
        provider: 'Self-Hosted Supabase PostgreSQL 17',
        endpoint: 'https://api.avishkark.in'
      },
      zero_pii_enclave: {
        status: 'operational',
        algorithm: 'SHA-256'
      },
      rate_limiter: {
        status: 'active',
        window_ms: 60000,
        max_requests: 60
      }
    }
  });
}
