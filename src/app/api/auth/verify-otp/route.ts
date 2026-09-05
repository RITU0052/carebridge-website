import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    console.log('[OTP] Verification request received');
    const rateCheck = checkRateLimit(req, 'verify-otp', 10, 60 * 1000);
    if (!rateCheck.allowed && rateCheck.response) return rateCheck.response;

    const { email, otpCode } = await req.json();

    if (!email || !otpCode) {
      return NextResponse.json({ success: false, message: 'Email and OTP code are required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDB();
    const user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user || !user.otpCode) {
      console.warn('[OTP] Verification failed: User or OTP record not found');
      return NextResponse.json({ success: false, message: 'Invalid or expired OTP verification code.' }, { status: 400 });
    }

    if (user.otpExpiresAt && new Date(user.otpExpiresAt) < new Date()) {
      console.warn('[OTP] Verification failed: OTP expired');
      return NextResponse.json({ success: false, message: 'OTP code has expired. Please request a new code.' }, { status: 400 });
    }

    if (user.otpCode !== String(otpCode).trim()) {
      console.warn('[OTP] Verification failed: Incorrect code matching attempt');
      return NextResponse.json({ success: false, message: 'Invalid OTP code. Please check and try again.' }, { status: 400 });
    }

    // Clear OTP & mark email verified
    user.otpCode = null;
    user.otpExpiresAt = null;
    user.isVerified = true;
    writeDB(db);
    console.log('[OTP] Verification successful: user verified');

    const { passwordHash: _ph, otpCode: _code, resetToken: _tok, ...safeUser } = user;

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      message: 'OTP verified successfully.',
    });

    response.cookies.set('carebridge_session', safeUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 * 7,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[OTP] Internal error during verification:', err);
    return NextResponse.json({ success: false, message: 'Failed to verify OTP.' }, { status: 500 });
  }
}
