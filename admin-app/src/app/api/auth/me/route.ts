import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const isSuperadmin = cookieStore.get('nexus_superadmin')?.value === 'true';

  if (isSuperadmin) {
    return NextResponse.json({ isSuperadmin: true });
  }

  return NextResponse.json({ isSuperadmin: false }, { status: 401 });
}
