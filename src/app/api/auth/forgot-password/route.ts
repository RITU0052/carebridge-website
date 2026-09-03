import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Please provide a valid email address.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDB();
    const user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      // Return positive message for security privacy
      return NextResponse.json({
        success: true,
        message: `Password reset instructions sent to ${cleanEmail} if an account exists.`,
      });
    }

    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    writeDB(db);

    await sendPasswordResetEmail(cleanEmail, resetToken, user.name);

    return NextResponse.json({
      success: true,
      message: `Password reset instructions sent to ${cleanEmail}. Please check your inbox.`,
      resetTokenDemo: resetToken, // For dev testing convenience
    });
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ success: false, message: 'Unable to process forgot password request.' }, { status: 500 });
  }
}
