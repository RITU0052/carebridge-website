import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { sendPasswordResetEmail } from '@/lib/mailer';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'forgot-password', 5, 60 * 1000);
    if (!rateCheck.allowed && rateCheck.response) return rateCheck.response;

    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Please provide a valid email address.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDB();
    const user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    // Generic response to prevent account enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: `If an account associated with ${cleanEmail} exists, password reset instructions have been dispatched.`,
      });
    }

    const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    user.resetToken = resetToken;
    user.resetExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    writeDB(db);

    const emailResult = await sendPasswordResetEmail(cleanEmail, resetToken, user.name);

    const responsePayload: any = {
      success: true,
      emailSent: emailResult.success,
      message: emailResult.success
        ? `Password reset instructions sent to ${cleanEmail}. Please check your inbox.`
        : emailResult.error || `Reset link generated for ${cleanEmail}.`,
    };

    // Secret leakage remediation: expose resetTokenDemo ONLY in development environments
    if (process.env.NODE_ENV === 'development') {
      responsePayload.resetTokenDemo = resetToken;
    }

    return NextResponse.json(responsePayload);
  } catch (err) {
    console.error('Forgot password error:', err);
    return NextResponse.json({ success: false, message: 'Unable to process forgot password request.' }, { status: 500 });
  }
}
