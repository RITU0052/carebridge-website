import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, MedicineRecord } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    const sessionUserId = user?.id || 'usr_demo_1'; // Safe fallback for unauthenticated demo state

    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get('userId');

    // IDOR Prevention: If a user specifies a target userId parameter, it MUST match their authenticated session ID
    if (requestedUserId && user && requestedUserId !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized access to user medicine records.' }, { status: 403 });
    }

    const userId = user ? user.id : sessionUserId;
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
    const rateCheck = checkRateLimit(req, 'add-medicine', 20);
    if (!rateCheck.allowed && rateCheck.response) return rateCheck.response;

    const user = getAuthenticatedUser(req);
    const sessionUserId = user?.id || 'usr_demo_1';

    const body = await req.json();
    const { name, dosage, frequency, times, startDate, endDate, notes, remindersEnabled = true } = body;

    if (!name || !dosage) {
      return NextResponse.json({ success: false, error: 'Medicine name and dosage are required.' }, { status: 400 });
    }

    // Sanitize string inputs
    const cleanName = String(name).replace(/<[^>]*>?/gm, '').trim();
    const cleanDosage = String(dosage).replace(/<[^>]*>?/gm, '').trim();
    const cleanNotes = notes ? String(notes).replace(/<[^>]*>?/gm, '').trim() : undefined;

    const db = readDB();
    const newMedicine: MedicineRecord = {
      id: 'med_' + Math.random().toString(36).substring(2, 9),
      userId: sessionUserId, // Derived strictly from authenticated session
      name: cleanName,
      dosage: cleanDosage,
      frequency: frequency || 'Once Daily',
      times: times && times.length > 0 ? times : ['09:00'],
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate,
      notes: cleanNotes,
      remindersEnabled: Boolean(remindersEnabled),
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
    const user = getAuthenticatedUser(req);
    const sessionUserId = user?.id || 'usr_demo_1';

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Medicine ID required.' }, { status: 400 });
    }

    const db = readDB();
    const existing = db.medicines.find((m) => m.id === id);

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Medicine record not found.' }, { status: 404 });
    }

    // Server-side ownership validation
    if (existing.userId !== sessionUserId) {
      return NextResponse.json({ success: false, error: 'Unauthorized to delete this medicine record.' }, { status: 403 });
    }

    db.medicines = db.medicines.filter((m) => m.id !== id);
    writeDB(db);

    return NextResponse.json({ success: true, message: 'Medicine removed successfully.' });
  } catch (err) {
    console.error('Delete medicine error:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete medicine.' }, { status: 500 });
  }
}
