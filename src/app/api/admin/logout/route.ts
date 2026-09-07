import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedAdmin, recordSecurityLog } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    if (admin) {
      recordSecurityLog(
        admin.id,
        admin.email,
        'ADMIN_LOGOUT',
        '/api/admin/logout',
        'Admin signed out',
        clientIp,
        'Success'
      );
    }

    const response = NextResponse.json({ success: true, message: 'Signed out successfully.' });

    // Clear session cookies
    response.cookies.delete('carebridge_admin_session');
    response.cookies.delete('carebridge_session');

    return response;
  } catch (err) {
    console.error('Admin logout error:', err);
    return NextResponse.json({ success: false, error: 'Logout failed' }, { status: 500 });
  }
}
