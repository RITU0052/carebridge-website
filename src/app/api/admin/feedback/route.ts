import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin privileges required.' },
        { status: 403 }
      );
    }

    const db = readDB();
    return NextResponse.json({ success: true, feedback: db.feedback });
  } catch (err) {
    console.error('Admin fetch feedback error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch feedback.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin privileges required.' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !['New', 'In Progress', 'Resolved'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Valid feedback ID and status are required.' }, { status: 400 });
    }

    const db = readDB();
    const item = db.feedback.find((f) => f.id === id);

    if (!item) {
      return NextResponse.json({ success: false, error: 'Feedback record not found.' }, { status: 404 });
    }

    item.status = status;
    writeDB(db);

    return NextResponse.json({ success: true, feedback: item, message: `Feedback status updated to ${status}.` });
  } catch (err) {
    console.error('Update feedback error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update feedback status.' }, { status: 500 });
  }
}
