import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json({ success: true, emailLogs: db.emailLogs });
  } catch (err) {
    console.error('Admin fetch email logs error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch email logs.' }, { status: 500 });
  }
}
