import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { sendOtpEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Please enter a valid email address.' }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDB();
    let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

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

    await sendOtpEmail(cleanEmail, otpCode, user.name);

    return NextResponse.json({
      success: true,
      message: `OTP code sent to ${cleanEmail}. (Code: ${otpCode})`,
      otpDemoCode: otpCode, // Provided for convenience in UI/dev testing
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    return NextResponse.json({ success: false, message: 'Failed to send OTP email.' }, { status: 500 });
  }
}
