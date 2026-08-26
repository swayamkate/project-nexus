import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const isSuperadmin = 
      cookieStore.get('nexus_superadmin')?.value === 'true' || 
      cookieStore.get('superadmin_token')?.value === 'true' ||
      request.cookies.get('nexus_superadmin')?.value === 'true' ||
      request.cookies.get('superadmin_token')?.value === 'true';

    if (isSuperadmin) {
      return NextResponse.json({ 
        isSuperadmin: true, 
        user: { email: 'admin@nexus.com', role: 'superadmin' } 
      });
    }

    return NextResponse.json({ isSuperadmin: false }, { status: 401 });
  } catch (err: any) {
    return NextResponse.json({ isSuperadmin: false, error: err.message }, { status: 401 });
  }
}
