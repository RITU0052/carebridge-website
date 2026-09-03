import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, EmergencyContactRecord } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'usr_demo_1';

    const db = readDB();
    const contacts = db.emergencyContacts.filter((c) => c.userId === userId);

    return NextResponse.json({ success: true, contacts });
  } catch (err) {
    console.error('Fetch emergency contacts error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch emergency contacts.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = 'usr_demo_1', name, relationship, phone, email, isPrimary = false } = body;

    if (!name || !phone) {
      return NextResponse.json({ success: false, error: 'Contact name and phone number are required.' }, { status: 400 });
    }

    const db = readDB();

    if (isPrimary) {
      db.emergencyContacts.forEach((c) => {
        if (c.userId === userId) c.isPrimary = false;
      });
    }

    const newContact: EmergencyContactRecord = {
      id: 'emg_' + Math.random().toString(36).substring(2, 9),
      userId,
      name,
      relationship: relationship || 'Family',
      phone,
      email,
      isPrimary,
      createdAt: new Date().toISOString(),
    };

    db.emergencyContacts.unshift(newContact);
    writeDB(db);

    return NextResponse.json({ success: true, contact: newContact });
  } catch (err) {
    console.error('Create emergency contact error:', err);
    return NextResponse.json({ success: false, error: 'Failed to add emergency contact.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Contact ID required.' }, { status: 400 });
    }

    const db = readDB();
    db.emergencyContacts = db.emergencyContacts.filter((c) => c.id !== id);
    writeDB(db);

    return NextResponse.json({ success: true, message: 'Emergency contact deleted.' });
  } catch (err) {
    console.error('Delete emergency contact error:', err);
    return NextResponse.json({ success: false, error: 'Failed to remove contact.' }, { status: 500 });
  }
}
