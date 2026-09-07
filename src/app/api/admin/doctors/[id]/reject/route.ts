import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, SecurityLogRecord } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { sendDoctorRejectionEmail } from '@/lib/mailer';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Admin access required.' },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    let rejectionReason = '';
    try {
      const body = await req.json();
      rejectionReason = body?.rejectionReason || '';
    } catch {
      // Body optional
    }

    const db = readDB();
    if (!db.doctors) db.doctors = [];
    const doctor = db.doctors.find((d) => d.id === id || d.userId === id);

    if (!doctor) {
      return NextResponse.json(
        { success: false, message: 'Doctor record not found.' },
        { status: 404 }
      );
    }

    const now = new Date().toISOString();
    const finalReason = rejectionReason.trim() || 'Credentials could not be verified.';

    // Update doctor record
    doctor.adminVerificationStatus = 'REJECTED';
    doctor.accountStatus = 'REJECTED';
    doctor.verificationStatus = 'Rejected';
    doctor.rejectionReason = finalReason;
    doctor.adminVerifiedAt = now;
    doctor.adminVerifiedBy = admin.email || 'Admin';

    // Update corresponding user record
    if (doctor.userId) {
      const user = db.users.find((u) => u.id === doctor.userId);
      if (user) {
        user.status = 'Inactive';
      }
    }

    // Security Audit Log
    if (!db.securityLogs) db.securityLogs = [];
    const securityLog: SecurityLogRecord = {
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'DOCTOR_REJECTION',
      targetResource: `/admin/doctors/${doctor.id}`,
      details: `Rejected doctor application for Dr. ${doctor.name} (${doctor.email}). Reason: ${finalReason}`,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      status: 'Warning',
      timestamp: now,
    };
    db.securityLogs.unshift(securityLog);

    writeDB(db);

    // Send Rejection Email
    const emailResult = await sendDoctorRejectionEmail({
      toEmail: doctor.email,
      doctorName: doctor.name,
      rejectionReason: finalReason,
    });

    return NextResponse.json({
      success: true,
      message: `Dr. ${doctor.name}'s application has been rejected.`,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        adminVerificationStatus: doctor.adminVerificationStatus,
        accountStatus: doctor.accountStatus,
        rejectionReason: doctor.rejectionReason,
      },
      emailDelivery: emailResult,
    });
  } catch (err: any) {
    console.error('Admin reject doctor error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error while rejecting doctor application.' },
      { status: 500 }
    );
  }
}
