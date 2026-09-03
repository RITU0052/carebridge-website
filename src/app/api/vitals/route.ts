import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, VitalRecord } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'usr_demo_1';

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
    const body = await req.json();
    const { userId = 'usr_demo_1', sysBP, diaBP, heartRate, bloodSugar, weight, oxygenLevel, notes } = body;

    if (!sysBP || !diaBP || !heartRate) {
      return NextResponse.json({ success: false, error: 'Blood Pressure and Heart Rate are required.' }, { status: 400 });
    }

    const db = readDB();
    const newVital: VitalRecord = {
      id: 'vit_' + Math.random().toString(36).substring(2, 9),
      userId,
      sysBP: Number(sysBP),
      diaBP: Number(diaBP),
      heartRate: Number(heartRate),
      bloodSugar: bloodSugar ? Number(bloodSugar) : undefined,
      weight: weight ? Number(weight) : undefined,
      oxygenLevel: oxygenLevel ? Number(oxygenLevel) : undefined,
      notes,
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
