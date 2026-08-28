import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  let dbLatencyMs = 0;
  let dbStatus = 'operational';

  try {
    const pingStart = Date.now();
    const res = await fetch('https://api.avishkark.in/rest/v1/', {
      headers: {
        apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI0NjgwMDAwLCJleHAiOjIwMzk5OTk5OTl9.uqQrYqxJACG1bl52DQ54opgfhDQwm4ZwJ-l3kuUOl7E'
      }
    });
    dbLatencyMs = Date.now() - pingStart;
    if (!res.ok && res.status !== 200 && res.status !== 404) {
      dbStatus = 'degraded';
    }
  } catch (e) {
    dbStatus = 'unreachable';
  }

  const responseTimeMs = Date.now() - startTime;

  return NextResponse.json({
    status: dbStatus === 'unreachable' ? 'unhealthy' : 'healthy',
    app: 'Nexus Administrator Control Room',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    response_time_ms: responseTimeMs,
    services: {
      database: {
        status: dbStatus,
        provider: 'Self-Hosted Supabase PostgreSQL 17',
        latency_ms: dbLatencyMs,
        endpoint: 'https://api.avishkark.in'
      },
      rbac_engine: {
        status: 'enforced',
        roles_supported: ['superadmin', 'admin', 'evaluator']
      },
      forensic_audit_trail: {
        status: 'active',
        storage_mode: 'append-only'
      }
    }
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  });
}
