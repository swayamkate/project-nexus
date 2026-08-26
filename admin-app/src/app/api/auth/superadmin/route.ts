import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const inputUser = (body.email || body.username || '').trim().toLowerCase();
    const inputPass = body.password || '';

    const validCredentials = [
      { user: 'admin@nexus.com', pass: 'adminpassword2026' },
      { user: 'admin@nexus.com', pass: 'hackathon2026' },
      { user: 'superadmin', pass: 'adminpassword2026' },
      { user: 'superadmin', pass: 'hackathon2026' },
      { user: 'superadmin@nexus.com', pass: 'adminpassword2026' },
      { user: 'superadmin@nexus.com', pass: 'hackathon2026' },
      { user: 'avishkar', pass: 'Avishkar@443322' },
      { user: 'avishkar', pass: 'Avishkar_443322' },
      { user: 'admin', pass: 'adminpassword2026' }
    ];

    const isMatch = validCredentials.some(
      c => c.user.toLowerCase() === inputUser && c.pass === inputPass
    );

    if (isMatch) {
      const response = NextResponse.json({ 
        success: true, 
        user: { email: 'admin@nexus.com', role: 'superadmin' } 
      });

      // Set cookie in response
      response.cookies.set({
        name: 'nexus_superadmin',
        value: 'true',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      });

      response.cookies.set({
        name: 'superadmin_token',
        value: 'true',
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
      });

      return response;
    }

    return NextResponse.json({ error: 'Invalid executive credentials' }, { status: 401 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Authentication error' }, { status: 500 });
  }
}
