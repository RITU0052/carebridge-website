import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, VitalRecord } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    const sessionUserId = user?.id || 'usr_demo_1';

    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get('userId');

    // IDOR Prevention: If a target userId is requested, it MUST match the authenticated user's ID
    if (requestedUserId && user && requestedUserId !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized access to user health vitals.' }, { status: 403 });
    }

    const userId = user ? user.id : sessionUserId;
    const db = readDB();
    const vitals = db.vitals.filter((v) => v.userId === userId);

    return NextResponse.json({ success: true, vitals });
  } catch (err) {
    console.error('Fetch vitals error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch health vitals.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'add-vitals', 20);
    if (!rateCheck.allowed && rateCheck.response) return rateCheck.response;

    const user = getAuthenticatedUser(req);
    const sessionUserId = user?.id || 'usr_demo_1';

    const body = await req.json();
    const { sysBP, diaBP, heartRate, bloodSugar, weight, oxygenLevel, notes } = body;

    if (!sysBP || !diaBP || !heartRate) {
      return NextResponse.json({ success: false, error: 'Blood Pressure and Heart Rate are required.' }, { status: 400 });
    }

    // Input bounds validation
    const numSys = Number(sysBP);
    const numDia = Number(diaBP);
    const numHR = Number(heartRate);

    if (isNaN(numSys) || isNaN(numDia) || isNaN(numHR) || numSys < 40 || numSys > 300 || numDia < 30 || numDia > 200) {
      return NextResponse.json({ success: false, error: 'Please enter realistic blood pressure and heart rate values.' }, { status: 400 });
    }

    const cleanNotes = notes ? String(notes).replace(/<[^>]*>?/gm, '').trim() : undefined;

    const db = readDB();
    const newVital: VitalRecord = {
      id: 'vit_' + Math.random().toString(36).substring(2, 9),
      userId: sessionUserId, // Derived strictly from server session
      sysBP: numSys,
      diaBP: numDia,
      heartRate: numHR,
      bloodSugar: bloodSugar && !isNaN(Number(bloodSugar)) ? Number(bloodSugar) : undefined,
      weight: weight && !isNaN(Number(weight)) ? Number(weight) : undefined,
      oxygenLevel: oxygenLevel && !isNaN(Number(oxygenLevel)) ? Number(oxygenLevel) : undefined,
      notes: cleanNotes,
      recordedAt: new Date().toISOString(),
    };

    db.vitals.unshift(newVital);
    writeDB(db);

    return NextResponse.json({ success: true, vital: newVital });
  } catch (err) {
    console.error('Create vital reading error:', err);
    return NextResponse.json({ success: false, error: 'Failed to record health vitals.' }, { status: 500 });
  }
}
