import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { getAuthenticatedAdmin, recordSecurityLog } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const db = readDB();
    const patients = (db.users || []).filter((u) => u.role === 'Patient' || u.role === 'Caregiver');
    const relationships = db.caregiverRelationships || [];
    const medicines = db.medicines || [];

    const patientProfiles = patients.map((p) => {
      const pMeds = medicines.filter((m) => m.userId === p.id);
      const rels = relationships.filter((r) => r.patientUserId === p.id);
      return {
        id: p.id,
        name: p.name,
        email: p.email,
        role: p.role,
        status: p.status || 'Active',
        isVerified: p.isVerified,
        createdAt: p.createdAt,
        activeMedicinesCount: pMeds.length,
        linkedCaregiversCount: rels.length,
        caregivers: rels.map((r) => ({
          name: r.caregiverName,
          phone: r.caregiverPhone,
          accessLevel: r.accessLevel,
        })),
      };
    });

    return NextResponse.json({
      success: true,
      count: patientProfiles.length,
      patients: patientProfiles,
    });
  } catch (err) {
    console.error('Admin fetch patients error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch patient profiles' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { id, status } = body; // 'Active' | 'Inactive' | 'Suspended'
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    const db = readDB();
    const uIdx = db.users.findIndex((u) => u.id === id);
    if (uIdx === -1) {
      return NextResponse.json({ success: false, error: 'Patient profile not found' }, { status: 404 });
    }

    db.users[uIdx].status = status;
    writeDB(db);

    recordSecurityLog(
      admin.id,
      admin.email,
      'PATIENT_PROFILE_STATUS_UPDATE',
      `/admin/patients`,
      `Updated patient ${db.users[uIdx].email} status to ${status}`,
      clientIp,
      'Success'
    );

    return NextResponse.json({ success: true, message: `Patient status updated to ${status}` });
  } catch (err) {
    console.error('Patient update error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update patient profile' }, { status: 500 });
  }
}
