import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDB, writeDB } from '@/lib/db';
import { sendDoctorVerificationEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDB();

    if (!db.doctors) db.doctors = [];
    const doctor = db.doctors.find((d) => d.email.toLowerCase() === cleanEmail);

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: 'No doctor application found with this email.' },
        { status: 404 }
      );
    }

    if (doctor.emailVerified) {
      return NextResponse.json(
        { success: false, message: 'Your email address is already verified.' },
        { status: 400 }
      );
    }

    // Generate fresh verification token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();

    doctor.emailVerificationTokenHash = tokenHash;
    doctor.emailVerificationTokenExpiresAt = expiresAt;
    writeDB(db);

    const emailResult = await sendDoctorVerificationEmail({
      toEmail: cleanEmail,
      doctorName: doctor.name,
      rawToken,
    });

    return NextResponse.json({
      success: true,
      message: 'A fresh email verification link has been dispatched.',
      emailDelivery: emailResult,
    });
  } catch (err: any) {
    console.error('Resend verification error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error while resending verification email.' },
      { status: 500 }
    );
  }
}
