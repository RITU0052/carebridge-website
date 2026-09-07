import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { getAuthenticatedAdmin, recordSecurityLog } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const { verificationStatus, accountStatus, consultationFee } = body;
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    const db = readDB();
    const docIdx = (db.doctors || []).findIndex((d) => d.id === id);

    if (docIdx === -1) {
      return NextResponse.json({ success: false, error: 'Doctor not found' }, { status: 404 });
    }

    const doc = db.doctors![docIdx];

    if (verificationStatus) doc.verificationStatus = verificationStatus;
    if (accountStatus) doc.accountStatus = accountStatus;
    if (consultationFee !== undefined) doc.consultationFee = Number(consultationFee);

    db.doctors![docIdx] = doc;
    writeDB(db);

    recordSecurityLog(
      admin.id,
      admin.email,
      'DOCTOR_STATUS_UPDATE',
      `/admin/doctors/${id}`,
      `Updated ${doc.name} (Verification: ${doc.verificationStatus}, Account: ${doc.accountStatus}, Fee: $${doc.consultationFee})`,
      clientIp,
      'Success'
    );

    return NextResponse.json({
      success: true,
      message: 'Doctor profile updated successfully.',
      doctor: doc,
    });
  } catch (err) {
    console.error('Update doctor status error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update doctor profile' }, { status: 500 });
  }
}
