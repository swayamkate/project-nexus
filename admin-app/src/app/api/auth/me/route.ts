import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminSession } from '@/lib/serverAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const verifiedUser = await verifyAdminSession(request);

    if (verifiedUser) {
      return NextResponse.json({
        isSuperadmin: verifiedUser.role === 'superadmin',
        isAdmin: true,
        role: verifiedUser.role,
        user: {
          id: verifiedUser.userId,
          email: verifiedUser.email,
          username: verifiedUser.username,
          role: verifiedUser.role
        }
      });
    }

    return NextResponse.json({ isSuperadmin: false, isAdmin: false, user: null }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ isSuperadmin: false, isAdmin: false, error: err.message, user: null }, { status: 200 });
  }
}
