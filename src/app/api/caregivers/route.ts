import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, CaregiverRelationshipRecord, normalizePhoneNumber } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionUserId = req.cookies.get('carebridge_session')?.value;
    const patientUserId = sessionUserId || searchParams.get('userId') || 'usr_demo_1';

    const db = readDB();
    const relationships = (db.caregiverRelationships || []).filter(
      (rel) => rel.patientUserId === patientUserId
    );

    return NextResponse.json({ success: true, caregivers: relationships });
  } catch (err) {
    console.error('Fetch caregivers error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch caregiver permissions.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const sessionUserId = req.cookies.get('carebridge_session')?.value;
    const patientUserId = sessionUserId || body.userId || 'usr_demo_1';

    const {
      caregiverName,
      caregiverPhone,
      caregiverEmail,
      relationship = 'Caregiver',
      accessLevel = 'Full Access',
      whatsappAlertsEnabled = true,
      emailAlertsEnabled = true,
    } = body;

    if (!caregiverName || !caregiverPhone) {
      return NextResponse.json(
        { success: false, error: 'Caregiver name and valid phone number are required.' },
        { status: 400 }
      );
    }

    const normalizedPhone = normalizePhoneNumber(caregiverPhone);
    const db = readDB();

    const newRecord: CaregiverRelationshipRecord = {
      id: 'rel_' + Math.random().toString(36).substring(2, 9),
      patientUserId,
      caregiverName: caregiverName.trim(),
      caregiverPhone: normalizedPhone,
      caregiverEmail: caregiverEmail ? caregiverEmail.trim().toLowerCase() : undefined,
      relationship: relationship.trim(),
      accessLevel: accessLevel || 'Full Access',
      whatsappAlertsEnabled: Boolean(whatsappAlertsEnabled),
      emailAlertsEnabled: Boolean(emailAlertsEnabled),
      createdAt: new Date().toISOString(),
    };

    if (!db.caregiverRelationships) {
      db.caregiverRelationships = [];
    }

    db.caregiverRelationships.unshift(newRecord);
    writeDB(db);

    return NextResponse.json({ success: true, caregiver: newRecord });
  } catch (err) {
    console.error('Add caregiver error:', err);
    return NextResponse.json({ success: false, error: 'Failed to add caregiver permission.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const sessionUserId = req.cookies.get('carebridge_session')?.value;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Caregiver relationship ID required.' }, { status: 400 });
    }

    const db = readDB();
    db.caregiverRelationships = (db.caregiverRelationships || []).filter((rel) => {
      if (rel.id === id) {
        // Scoped check if session is active
        if (sessionUserId && rel.patientUserId !== sessionUserId) {
          return true; // Don't delete if unauthorized
        }
        return false;
      }
      return true;
    });

    writeDB(db);
    return NextResponse.json({ success: true, message: 'Caregiver permission revoked successfully.' });
  } catch (err) {
    console.error('Delete caregiver error:', err);
    return NextResponse.json({ success: false, error: 'Failed to revoke caregiver permission.' }, { status: 500 });
  }
}
