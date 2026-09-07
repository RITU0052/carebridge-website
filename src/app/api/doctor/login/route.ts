import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { verifyPassword } from '@/lib/passwords';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please enter both email and password.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDB();

    const user = db.users.find(
      (u) => u.email.toLowerCase() === cleanEmail && u.role === 'Doctor'
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid doctor credentials or account does not exist.' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid doctor credentials or password.' },
        { status: 401 }
      );
    }

    if (!db.doctors) db.doctors = [];
    const doctor = db.doctors.find((d) => d.email.toLowerCase() === cleanEmail);

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: 'Doctor profile record not found.' },
        { status: 404 }
      );
    }

    // 1. Email Verification Check
    if (!doctor.emailVerified) {
      return NextResponse.json(
        {
          success: false,
          code: 'EMAIL_NOT_VERIFIED',
          message: 'Please verify your email address before logging in. Check your inbox for the verification link.',
          email: cleanEmail,
        },
        { status: 403 }
      );
    }

    // 2. Admin Verification Pending Check
    if (doctor.adminVerificationStatus === 'PENDING') {
      return NextResponse.json(
        {
          success: false,
          code: 'ADMIN_VERIFICATION_PENDING',
          message: 'Your email is verified! Your application is currently under review by CareBridge Admin. You will receive an email once approved.',
          email: cleanEmail,
        },
        { status: 403 }
      );
    }

    // 3. Admin Rejected Check
    if (doctor.adminVerificationStatus === 'REJECTED' || doctor.accountStatus === 'REJECTED') {
      const reasonStr = doctor.rejectionReason ? ` Reason: ${doctor.rejectionReason}` : '';
      return NextResponse.json(
        {
          success: false,
          code: 'APPLICATION_REJECTED',
          message: `Your doctor application was not approved.${reasonStr}`,
          rejectionReason: doctor.rejectionReason,
        },
        { status: 403 }
      );
    }

    // 4. Account Suspended Check
    if (doctor.accountStatus === 'SUSPENDED' || doctor.accountStatus === 'INACTIVE') {
      return NextResponse.json(
        {
          success: false,
          code: 'ACCOUNT_SUSPENDED',
          message: 'Your doctor account is currently suspended or inactive. Please contact support.',
        },
        { status: 403 }
      );
    }

    // 5. Approved & Active Doctor
    const response = NextResponse.json({
      success: true,
      message: 'Login successful.',
      doctor: {
        id: doctor.id,
        userId: user.id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        accountStatus: doctor.accountStatus,
      },
    });

    response.cookies.set('carebridge_session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 * 7,
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('Doctor login error:', err);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred during doctor login.' },
      { status: 500 }
    );
  }
}
