import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, PendingSignupRecord } from '@/lib/db';
import { sendOtpEmail } from '@/lib/mailer';
import { checkRateLimit } from '@/lib/rateLimit';
import { hashPassword } from '@/lib/passwords';

export async function POST(req: NextRequest) {
  try {
    console.log('[OTP] Request received');

    const rateCheck = checkRateLimit(req, 'send-otp', 5, 60 * 1000);
    if (!rateCheck.allowed && rateCheck.response) return rateCheck.response;

    const body = await req.json();
    const { email, purpose = 'login', name, password, role = 'Caregiver' } = body;

    if (!email || !email.includes('@')) {
      console.log('[OTP] Email validated: false');
      return NextResponse.json({ success: false, message: 'Please enter a valid email address.' }, { status: 400 });
    }

    console.log(`[OTP] Email validated: true, Purpose: ${purpose}`);
    const cleanEmail = email.trim().toLowerCase();
    const db = readDB();
    const existingUser = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (purpose === 'login') {
      // 1. LOGIN MUST ONLY WORK FOR EXISTING ACCOUNTS
      if (!existingUser) {
        console.warn(`[OTP] Login request rejected: No account found for ${cleanEmail}`);
        return NextResponse.json(
          {
            success: false,
            code: 'USER_NOT_FOUND',
            message: 'No account found with this email. Please create an account first.',
          },
          { status: 404 }
        );
      }

      // Check per-user rate limit: 60s cooldown
      if (existingUser.otpExpiresAt) {
        const remainingMs = new Date(existingUser.otpExpiresAt).getTime() - Date.now();
        const elapsedSinceCreation = 10 * 60 * 1000 - remainingMs;
        if (elapsedSinceCreation < 60 * 1000 && remainingMs > 0) {
          console.warn('[OTP] Login OTP rate-limited (< 60s since last request)');
          return NextResponse.json(
            {
              success: false,
              message: 'An OTP code was recently requested. Please wait 60 seconds before requesting a new code.',
            },
            { status: 429 }
          );
        }
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      console.log('[OTP] Login OTP generated');

      existingUser.otpCode = otpCode;
      existingUser.otpExpiresAt = otpExpiresAt;

      const dbSaved = writeDB(db);
      if (!dbSaved) {
        console.error('[OTP] OTP storage failed');
        return NextResponse.json(
          { success: false, message: 'Unable to process OTP request at this time. Please try again.' },
          { status: 500 }
        );
      }
      console.log('[OTP] Login OTP stored: true');

      console.log('[OTP] Sending login email');
      const emailResult = await sendOtpEmail(cleanEmail, otpCode, existingUser.name);

      if (!emailResult.success) {
        console.error('[OTP] Email send failed:', emailResult.error || 'SMTP delivery failure');
        return NextResponse.json(
          {
            success: false,
            message: 'Unable to send OTP email right now. Please try again.',
          },
          { status: 500 }
        );
      }

      console.log('[OTP] Login email sent successfully');
      return NextResponse.json({
        success: true,
        emailSent: true,
        message: `Verification code emailed to ${cleanEmail}. Please check your inbox.`,
      });
    }

    if (purpose === 'signup') {
      // 2. SIGNUP CHECK: Account must NOT exist
      if (existingUser) {
        console.warn(`[OTP] Signup request rejected: Account already exists for ${cleanEmail}`);
        return NextResponse.json(
          {
            success: false,
            code: 'USER_EXISTS',
            message: 'An account with this email already exists. Please log in instead.',
          },
          { status: 400 }
        );
      }

      if (!name || !name.trim()) {
        return NextResponse.json({ success: false, message: 'Please enter your full name.' }, { status: 400 });
      }

      if (!password || password.length < 6) {
        return NextResponse.json({ success: false, message: 'Password must be at least 6 characters long.' }, { status: 400 });
      }

      if (!db.pendingSignups) {
        db.pendingSignups = [];
      }

      // Check rate limit for pending signup requests
      const existingPending = db.pendingSignups.find((p) => p.email.toLowerCase() === cleanEmail);
      if (existingPending && existingPending.otpExpiresAt) {
        const remainingMs = new Date(existingPending.otpExpiresAt).getTime() - Date.now();
        const elapsedSinceCreation = 10 * 60 * 1000 - remainingMs;
        if (elapsedSinceCreation < 60 * 1000 && remainingMs > 0) {
          console.warn('[OTP] Signup OTP rate-limited (< 60s since last request)');
          return NextResponse.json(
            {
              success: false,
              message: 'An OTP code was recently requested. Please wait 60 seconds before requesting a new code.',
            },
            { status: 429 }
          );
        }
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();
      const passwordHash = await hashPassword(password);
      console.log('[OTP] Signup OTP generated and password hashed');

      // Remove previous pending signups for this email
      db.pendingSignups = db.pendingSignups.filter((p) => p.email.toLowerCase() !== cleanEmail);

      const newPendingRecord: PendingSignupRecord = {
        id: 'png_' + Math.random().toString(36).substring(2, 9),
        name: name.trim(),
        email: cleanEmail,
        passwordHash,
        role: role || 'Caregiver',
        otpCode,
        otpExpiresAt,
        createdAt: new Date().toISOString(),
      };

      db.pendingSignups.push(newPendingRecord);

      const dbSaved = writeDB(db);
      if (!dbSaved) {
        console.error('[OTP] Pending signup DB write failed');
        return NextResponse.json(
          { success: false, message: 'Unable to process signup request. Please try again.' },
          { status: 500 }
        );
      }
      console.log('[OTP] Pending signup stored securely in server DB');

      console.log('[OTP] Sending signup verification email');
      const emailResult = await sendOtpEmail(cleanEmail, otpCode, newPendingRecord.name);

      if (!emailResult.success) {
        console.error('[OTP] Email send failed:', emailResult.error || 'SMTP delivery failure');
        return NextResponse.json(
          {
            success: false,
            message: 'Unable to send verification email. Please check your email address and try again.',
          },
          { status: 500 }
        );
      }

      console.log('[OTP] Signup verification email sent successfully');
      return NextResponse.json({
        success: true,
        emailSent: true,
        message: `Verification code emailed to ${cleanEmail}. Please check your inbox to complete signup.`,
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid OTP request purpose.' }, { status: 400 });
  } catch (err) {
    console.error('[OTP] Internal error during request:', err);
    return NextResponse.json({ success: false, message: 'Failed to send OTP email.' }, { status: 500 });
  }
}
