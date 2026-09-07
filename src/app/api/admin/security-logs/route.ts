import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const db = readDB();
    const securityLogs = db.securityLogs || [];
    const loginAttempts = db.loginAttempts || [];

    return NextResponse.json({
      success: true,
      securityLogs,
      loginAttempts,
    });
  } catch (err) {
    console.error('Admin security logs error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch security logs' }, { status: 500 });
  }
}
