import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword || newPassword.length < 6) {
      return NextResponse.json({ success: false, message: 'Valid token and a password of at least 6 characters are required.' }, { status: 400 });
    }

    const db = readDB();
    const user = db.users.find((u) => u.resetToken === token);

    if (!user) {
      return NextResponse.json({ success: false, message: 'Invalid or expired reset token.' }, { status: 400 });
    }

    if (user.resetExpiresAt && new Date(user.resetExpiresAt) < new Date()) {
      return NextResponse.json({ success: false, message: 'Reset token has expired. Please request a new password reset.' }, { status: 400 });
    }

    user.passwordHash = newPassword;
    user.resetToken = null;
    user.resetExpiresAt = null;
    writeDB(db);

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully! You can now log in with your new password.',
    });
  } catch (err) {
    console.error('Reset password error:', err);
    return NextResponse.json({ success: false, message: 'Failed to reset password.' }, { status: 500 });
  }
}
