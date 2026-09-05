import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, EmergencyContactRecord } from '@/lib/db';
import { getAuthenticatedUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  try {
    const user = getAuthenticatedUser(req);
    const sessionUserId = user?.id || 'usr_demo_1';

    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get('userId');

    // IDOR Prevention: Ensure requested userId matches authenticated session user
    if (requestedUserId && user && requestedUserId !== user.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized access to emergency contacts.' }, { status: 403 });
    }

    const userId = user ? user.id : sessionUserId;
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
    const rateCheck = checkRateLimit(req, 'add-emergency-contact', 15);
    if (!rateCheck.allowed && rateCheck.response) return rateCheck.response;

    const user = getAuthenticatedUser(req);
    const sessionUserId = user?.id || 'usr_demo_1';

    const body = await req.json();
    const { name, relationship, phone, email, isPrimary = false } = body;

    if (!name || !phone) {
      return NextResponse.json({ success: false, error: 'Contact name and phone number are required.' }, { status: 400 });
    }

    const cleanName = String(name).replace(/<[^>]*>?/gm, '').trim();
    const cleanPhone = String(phone).replace(/<[^>]*>?/gm, '').trim();
    const cleanEmail = email ? String(email).replace(/<[^>]*>?/gm, '').trim().toLowerCase() : undefined;

    const db = readDB();

    if (isPrimary) {
      db.emergencyContacts.forEach((c) => {
        if (c.userId === sessionUserId) c.isPrimary = false;
      });
    }

    const newContact: EmergencyContactRecord = {
      id: 'emg_' + Math.random().toString(36).substring(2, 9),
      userId: sessionUserId, // Derived strictly from server session
      name: cleanName,
      relationship: relationship ? String(relationship).replace(/<[^>]*>?/gm, '').trim() : 'Family',
      phone: cleanPhone,
      email: cleanEmail,
      isPrimary: Boolean(isPrimary),
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
    const user = getAuthenticatedUser(req);
    const sessionUserId = user?.id || 'usr_demo_1';

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Contact ID required.' }, { status: 400 });
    }

    const db = readDB();
    const existing = db.emergencyContacts.find((c) => c.id === id);

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Contact record not found.' }, { status: 404 });
    }

    if (existing.userId !== sessionUserId) {
      return NextResponse.json({ success: false, error: 'Unauthorized to delete this emergency contact.' }, { status: 403 });
    }

    db.emergencyContacts = db.emergencyContacts.filter((c) => c.id !== id);
    writeDB(db);

    return NextResponse.json({ success: true, message: 'Emergency contact deleted.' });
  } catch (err) {
    console.error('Delete emergency contact error:', err);
    return NextResponse.json({ success: false, error: 'Failed to remove contact.' }, { status: 500 });
  }
}
