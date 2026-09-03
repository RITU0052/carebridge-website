import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

export async function GET() {
  try {
    const db = readDB();
    const safeUsers = db.users.map(({ passwordHash: _ph, otpCode: _oc, resetToken: _rt, ...user }) => user);
    return NextResponse.json({ success: true, users: safeUsers });
  } catch (err) {
    console.error('Admin fetch users error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch users.' }, { status: 500 });
  }
}
