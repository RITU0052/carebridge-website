import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, DoctorRecord } from '@/lib/db';
import { getAuthenticatedAdmin, recordSecurityLog } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const db = readDB();
    const doctors = db.doctors || [];

    return NextResponse.json({
      success: true,
      count: doctors.length,
      doctors,
    });
  } catch (err) {
    console.error('Admin fetch doctors error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch doctors' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { name, email, phone, specialization, licenseNumber, experienceYears, consultationFee } = body;
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    if (!name || !email || !specialization || !licenseNumber) {
      return NextResponse.json(
        { success: false, error: 'Name, email, specialization, and license number are required.' },
        { status: 400 }
      );
    }

    const db = readDB();
    const newDoctor: DoctorRecord = {
      id: `doc_${Date.now()}`,
      name,
      email,
      phone: phone || '',
      specialization,
      licenseNumber,
      experienceYears: Number(experienceYears) || 5,
      consultationFee: Number(consultationFee) || 100,
      verificationStatus: 'APPROVED',
      emailVerified: true,
      adminVerificationStatus: 'APPROVED',
      accountStatus: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    db.doctors = [newDoctor, ...(db.doctors || [])];
    writeDB(db);

    recordSecurityLog(
      admin.id,
      admin.email,
      'CREATE_DOCTOR_ACCOUNT',
      `/admin/doctors`,
      `Registered doctor ${name} (${specialization})`,
      clientIp,
      'Success'
    );

    return NextResponse.json({
      success: true,
      message: 'Doctor account created successfully.',
      doctor: newDoctor,
    });
  } catch (err) {
    console.error('Create doctor error:', err);
    return NextResponse.json({ success: false, error: 'Failed to register doctor' }, { status: 500 });
  }
}
