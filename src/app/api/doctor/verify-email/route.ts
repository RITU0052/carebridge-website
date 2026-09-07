import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDB, writeDB } from '@/lib/db';
import { sendAdminNewDoctorNotificationEmail } from '@/lib/mailer';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Missing verification token.' },
        { status: 400 }
      );
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const db = readDB();

    if (!db.doctors) db.doctors = [];
    const doctor = db.doctors.find(
      (d) => d.emailVerificationTokenHash === tokenHash
    );

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired verification link.' },
        { status: 400 }
      );
    }

    if (doctor.emailVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: 'Your email is already verified. Account is pending admin approval.',
        doctor: {
          id: doctor.id,
          name: doctor.name,
          email: doctor.email,
          adminVerificationStatus: doctor.adminVerificationStatus,
        },
      });
    }

    if (
      doctor.emailVerificationTokenExpiresAt &&
      new Date(doctor.emailVerificationTokenExpiresAt) < new Date()
    ) {
      return NextResponse.json(
        {
          success: false,
          expired: true,
          message: 'Verification link has expired. Please request a new link.',
          email: doctor.email,
        },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    doctor.emailVerified = true;
    doctor.emailVerifiedAt = now;
    doctor.emailVerificationTokenUsedAt = now;
    doctor.adminVerificationStatus = 'PENDING';
    doctor.accountStatus = 'PENDING';
    doctor.verificationStatus = 'Pending';

    // Update corresponding user record
    if (doctor.userId) {
      const user = db.users.find((u) => u.id === doctor.userId);
      if (user) {
        user.isVerified = true;
      }
    }

    writeDB(db);

    // Dispatch notification to CareBridge Admin
    const adminEmailNotification = await sendAdminNewDoctorNotificationEmail({
      doctorName: doctor.name,
      doctorEmail: doctor.email,
      licenseNumber: doctor.licenseNumber,
      specialization: doctor.specialization,
      registeredAt: doctor.createdAt,
      doctorId: doctor.id,
    });

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully! Your profile is now under admin review.',
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        adminVerificationStatus: 'PENDING',
      },
      adminNotified: adminEmailNotification.success,
    });
  } catch (err: any) {
    console.error('Email verification error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error during email verification.' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required.' },
        { status: 400 }
      );
    }
    const fakeReq = new NextRequest(new URL(`/api/doctor/verify-email?token=${token}`, req.url));
    return GET(fakeReq);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: 'Invalid payload.' },
      { status: 400 }
    );
  }
}
