import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, MedicineRecord } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'usr_demo_1';

    const db = readDB();
    const medicines = db.medicines.filter((m) => m.userId === userId);

    return NextResponse.json({ success: true, medicines });
  } catch (err) {
    console.error('Fetch medicines error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch medicines.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = 'usr_demo_1', name, dosage, frequency, times, startDate, endDate, notes, remindersEnabled = true } = body;

    if (!name || !dosage) {
      return NextResponse.json({ success: false, error: 'Medicine name and dosage are required.' }, { status: 400 });
    }

    const db = readDB();
    const newMedicine: MedicineRecord = {
      id: 'med_' + Math.random().toString(36).substring(2, 9),
      userId,
      name,
      dosage,
      frequency: frequency || 'Once Daily',
      times: times && times.length > 0 ? times : ['09:00'],
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate,
      notes,
      remindersEnabled,
      createdAt: new Date().toISOString(),
    };

    db.medicines.unshift(newMedicine);
    writeDB(db);

    return NextResponse.json({ success: true, medicine: newMedicine });
  } catch (err) {
    console.error('Create medicine error:', err);
    return NextResponse.json({ success: false, error: 'Failed to save medicine.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Medicine ID required.' }, { status: 400 });
    }

    const db = readDB();
    db.medicines = db.medicines.filter((m) => m.id !== id);
    writeDB(db);

    return NextResponse.json({ success: true, message: 'Medicine removed successfully.' });
  } catch (err) {
    console.error('Delete medicine error:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete medicine.' }, { status: 500 });
  }
}
