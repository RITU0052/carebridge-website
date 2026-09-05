import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    console.log('[OTP] Verification request received');
    const rateCheck = checkRateLimit(req, 'verify-otp', 10, 60 * 1000);
    if (!rateCheck.allowed && rateCheck.response) return rateCheck.response;

    const body = await req.json();
    const { email, otpCode, purpose = 'login' } = body;

    if (!email || !otpCode) {
      return NextResponse.json({ success: false, message: 'Email and OTP code are required.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = String(otpCode).trim();
    const db = readDB();

    if (purpose === 'signup') {
      if (!db.pendingSignups) db.pendingSignups = [];
      const pendingIndex = db.pendingSignups.findIndex((p) => p.email.toLowerCase() === cleanEmail);

      if (pendingIndex === -1) {
        console.warn(`[OTP] Signup verification failed: No pending signup found for ${cleanEmail}`);
        return NextResponse.json(
          { success: false, message: 'No pending signup registration found or OTP expired. Please try signing up again.' },
          { status: 400 }
        );
      }

      const pending = db.pendingSignups[pendingIndex];

      if (pending.otpExpiresAt && new Date(pending.otpExpiresAt) < new Date()) {
        console.warn('[OTP] Signup verification failed: OTP expired');
        return NextResponse.json({ success: false, message: 'OTP code has expired. Please request a new code.' }, { status: 400 });
      }

      if (pending.otpCode !== cleanCode) {
        console.warn('[OTP] Signup verification failed: Incorrect code matching attempt');
        return NextResponse.json({ success: false, message: 'Invalid OTP code. Please check and try again.' }, { status: 400 });
      }

      // Check if user account was created in the meantime
      let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (user) {
        user.isVerified = true;
      } else {
        // CREATE THE USER ACCOUNT EXACTLY ONCE AFTER OTP IS VERIFIED
        user = {
          id: 'usr_' + Math.random().toString(36).substring(2, 9),
          name: pending.name,
          email: pending.email,
          passwordHash: pending.passwordHash,
          role: pending.role,
          isVerified: true,
          createdAt: new Date().toISOString(),
        };
        db.users.push(user);
      }

      // Single-use OTP: consume pending record
      db.pendingSignups.splice(pendingIndex, 1);
      writeDB(db);
      console.log(`[OTP] Signup verification successful: User account ${user.id} created & verified`);

      const { passwordHash: _ph, otpCode: _code, resetToken: _tok, ...safeUser } = user;

      const response = NextResponse.json({
        success: true,
        user: safeUser,
        message: 'Account created and verified successfully.',
      });

      response.cookies.set('carebridge_session', safeUser.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 86400 * 7,
        path: '/',
      });

      return response;
    }

    // Default or purpose === 'login'
    const user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user || !user.otpCode) {
      console.warn('[OTP] Login verification failed: User or OTP record not found');
      return NextResponse.json({ success: false, message: 'Invalid or expired OTP verification code.' }, { status: 400 });
    }

    if (user.otpExpiresAt && new Date(user.otpExpiresAt) < new Date()) {
      console.warn('[OTP] Login verification failed: OTP expired');
      return NextResponse.json({ success: false, message: 'OTP code has expired. Please request a new code.' }, { status: 400 });
    }

    if (user.otpCode !== cleanCode) {
      console.warn('[OTP] Login verification failed: Incorrect code matching attempt');
      return NextResponse.json({ success: false, message: 'Invalid OTP code. Please check and try again.' }, { status: 400 });
    }

    // Clear OTP & mark email verified
    user.otpCode = null;
    user.otpExpiresAt = null;
    user.isVerified = true;
    writeDB(db);
    console.log('[OTP] Login verification successful: user verified');

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
