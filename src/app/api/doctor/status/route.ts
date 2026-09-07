import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const sessionCookie = req.cookies.get('carebridge_session')?.value;
    const { searchParams } = new URL(req.url);
    const emailParam = searchParams.get('email');

    const db = readDB();
    if (!db.doctors) db.doctors = [];

    let doctor = null;
    if (sessionCookie) {
      doctor = db.doctors.find((d) => d.userId === sessionCookie);
    }

    if (!doctor && emailParam) {
      doctor = db.doctors.find((d) => d.email.toLowerCase() === emailParam.toLowerCase());
    }

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: 'Doctor record not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        licenseNumber: doctor.licenseNumber,
        emailVerified: doctor.emailVerified,
        adminVerificationStatus: doctor.adminVerificationStatus,
        accountStatus: doctor.accountStatus,
        rejectionReason: doctor.rejectionReason,
      },
    });
  } catch (err: any) {
    console.error('Doctor status error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal error checking doctor status.' },
      { status: 500 }
    );
  }
}
