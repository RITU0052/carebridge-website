import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { sendOtpEmail } from '@/lib/mailer';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'send-otp', 5, 60 * 1000);
    if (!rateCheck.allowed && rateCheck.response) return rateCheck.response;

    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Please enter a valid email address.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDB();
    let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Check rate limit: prevent generating new OTP if generated less than 60s ago
    if (user && user.otpExpiresAt) {
      const remainingMs = new Date(user.otpExpiresAt).getTime() - Date.now();
      const elapsedSinceCreation = 10 * 60 * 1000 - remainingMs;
      if (elapsedSinceCreation < 60 * 1000 && remainingMs > 0) {
        return NextResponse.json(
          {
            success: false,
            message: 'An OTP code was recently requested. Please wait 60 seconds before requesting a new code.',
          },
          { status: 429 }
        );
      }
    }

    if (!user) {
      user = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        email: cleanEmail,
        passwordHash: '',
        role: 'Caregiver',
        isVerified: false,
        otpCode,
        otpExpiresAt,
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
    } else {
      user.otpCode = otpCode;
      user.otpExpiresAt = otpExpiresAt;
    }

    writeDB(db);

    const emailResult = await sendOtpEmail(cleanEmail, otpCode, user.name);

    const responsePayload: any = {
      success: true,
      emailSent: emailResult.success,
      message: emailResult.success
        ? `Verification code emailed to ${cleanEmail}. Please check your inbox.`
        : emailResult.error || `Verification code request processed for ${cleanEmail}.`,
    };

    // Secret leakage remediation: expose otpDemoCode ONLY in development environments
    if (process.env.NODE_ENV === 'development') {
      responsePayload.otpDemoCode = otpCode;
    }

    return NextResponse.json(responsePayload);
  } catch (err) {
    console.error('Send OTP error:', err);
    return NextResponse.json({ success: false, message: 'Failed to send OTP email.' }, { status: 500 });
  }
}
