import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin privileges required.' },
        { status: 403 }
      );
    }

    const db = readDB();
    return NextResponse.json({ success: true, emailLogs: db.emailLogs });
  } catch (err) {
    console.error('Admin fetch email logs error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch email logs.' }, { status: 500 });
  }
}
