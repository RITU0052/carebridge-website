import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';
import { sendDoctorApprovalEmail, sendDoctorRejectionEmail } from '@/lib/mailer';

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

    let emailResult;
    if (doctor.adminVerificationStatus === 'APPROVED') {
      emailResult = await sendDoctorApprovalEmail({
        toEmail: doctor.email,
        doctorName: doctor.name,
      });
    } else if (doctor.adminVerificationStatus === 'REJECTED') {
      emailResult = await sendDoctorRejectionEmail({
        toEmail: doctor.email,
        doctorName: doctor.name,
        rejectionReason: doctor.rejectionReason,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Doctor application is still PENDING review. Please Approve or Reject first before sending status decision emails.',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status notification email resent to ${doctor.email}.`,
      emailDelivery: emailResult,
    });
  } catch (err: any) {
    console.error('Resend admin doctor email error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to resend doctor email.' },
      { status: 500 }
    );
  }
}
