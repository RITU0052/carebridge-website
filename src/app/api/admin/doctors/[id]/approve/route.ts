import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, SecurityLogRecord } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { sendDoctorApprovalEmail } from '@/lib/mailer';

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

    // Update doctor record
    doctor.adminVerificationStatus = 'APPROVED';
    doctor.accountStatus = 'ACTIVE';
    doctor.verificationStatus = 'APPROVED';
    doctor.adminVerifiedAt = now;
    doctor.adminVerifiedBy = admin.email || 'Admin';
    doctor.rejectionReason = undefined;

    // Update corresponding user record if exists
    if (doctor.userId) {
      const user = db.users.find((u) => u.id === doctor.userId);
      if (user) {
        user.status = 'Active';
        user.isVerified = true;
      }
    }

    // Add security audit log
    if (!db.securityLogs) db.securityLogs = [];
    const securityLog: SecurityLogRecord = {
      id: 'log_' + Math.random().toString(36).substring(2, 9),
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'DOCTOR_APPROVAL',
      targetResource: `/admin/doctors/${doctor.id}`,
      details: `Approved doctor application for Dr. ${doctor.name} (${doctor.email})`,
      ipAddress: req.headers.get('x-forwarded-for') || '127.0.0.1',
      status: 'Success',
      timestamp: now,
    };
    db.securityLogs.unshift(securityLog);

    writeDB(db);

    // Dispatch approval email
    const emailResult = await sendDoctorApprovalEmail({
      toEmail: doctor.email,
      doctorName: doctor.name,
    });

    return NextResponse.json({
      success: true,
      message: `Dr. ${doctor.name} has been approved successfully.`,
      doctor: {
        id: doctor.id,
        name: doctor.name,
        adminVerificationStatus: doctor.adminVerificationStatus,
        accountStatus: doctor.accountStatus,
      },
      emailDelivery: emailResult,
    });
  } catch (err: any) {
    console.error('Admin approve doctor error:', err);
    return NextResponse.json(
      { success: false, message: 'Internal server error while approving doctor.' },
      { status: 500 }
    );
  }
}
