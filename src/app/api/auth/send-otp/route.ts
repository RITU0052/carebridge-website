import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { sendOtpEmail } from '@/lib/mailer';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    console.log('[OTP] Request received');

    const rateCheck = checkRateLimit(req, 'send-otp', 5, 60 * 1000);
    if (!rateCheck.allowed && rateCheck.response) return rateCheck.response;

    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      console.log('[OTP] Email validated: false');
      return NextResponse.json({ success: false, message: 'Please enter a valid email address.' }, { status: 400 });
    }

    console.log('[OTP] Email validated: true');
    const cleanEmail = email.trim().toLowerCase();
    const db = readDB();
    let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    console.log('[OTP] OTP generated: true');

    // Rate limit per user: prevent generating new OTP if generated less than 60s ago
    if (user && user.otpExpiresAt) {
      const remainingMs = new Date(user.otpExpiresAt).getTime() - Date.now();
      const elapsedSinceCreation = 10 * 60 * 1000 - remainingMs;
      if (elapsedSinceCreation < 60 * 1000 && remainingMs > 0) {
        console.warn('[OTP] Request rate-limited: code requested < 60s ago');
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

    const dbSaved = writeDB(db);
    if (!dbSaved) {
      console.error('[OTP] OTP storage failed');
      return NextResponse.json(
        { success: false, message: 'Unable to process OTP request at this time. Please try again.' },
        { status: 500 }
      );
    }
    console.log('[OTP] OTP stored: true');

    console.log('[OTP] Sending email');
    const emailResult = await sendOtpEmail(cleanEmail, otpCode, user.name);

    if (!emailResult.success) {
      console.error('[OTP] Email send failed:', emailResult.error || 'SMTP delivery failure');
      return NextResponse.json(
        {
          success: false,
          message: 'Unable to send OTP email. Please check your email address and try again.',
        },
        { status: 500 }
      );
    }

    console.log('[OTP] Email sent successfully');
    return NextResponse.json({
      success: true,
      emailSent: true,
      message: `Verification code emailed to ${cleanEmail}. Please check your inbox.`,
    });
  } catch (err) {
    console.error('[OTP] Internal error during request:', err);
    return NextResponse.json({ success: false, message: 'Failed to send OTP email.' }, { status: 500 });
  }
}
