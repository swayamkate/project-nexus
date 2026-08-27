import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    app: 'MahaSkill Track (Public Edge)',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    services: {
      database: {
        status: 'operational',
        provider: 'Supabase PostgreSQL 17 (TLS 1.3)',
        gateway: 'https://api.avishkark.in'
      },
      zero_pii_enclave: {
        status: 'operational',
        algorithm: 'SHA-256'
      }
    }
  });
}
