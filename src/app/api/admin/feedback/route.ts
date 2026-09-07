import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { getAuthenticatedAdmin, recordSecurityLog } from '@/lib/auth';

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
    const feedbackList = (db.feedback || []).map((f) => ({
      ...f,
      priority: f.priority || (f.category === 'Bug' || f.category === 'Security' ? 'High' : 'Medium'),
      internalNotes: f.internalNotes || '',
    }));

    return NextResponse.json({ success: true, feedback: feedbackList });
  } catch (err) {
    console.error('Admin fetch feedback error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch feedback.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return handleUpdateFeedback(req);
}

export async function PATCH(req: NextRequest) {
  return handleUpdateFeedback(req);
}

async function handleUpdateFeedback(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { id, status, priority, internalNotes } = body;
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    if (!id) {
      return NextResponse.json({ success: false, error: 'Feedback ID is required.' }, { status: 400 });
    }

    const db = readDB();
    const itemIdx = db.feedback.findIndex((f) => f.id === id);

    if (itemIdx === -1) {
      return NextResponse.json({ success: false, error: 'Feedback record not found.' }, { status: 404 });
    }

    const item = db.feedback[itemIdx];

    if (status) item.status = status;
    if (priority) item.priority = priority;
    if (internalNotes !== undefined) item.internalNotes = internalNotes;
    item.updatedAt = new Date().toISOString();

    db.feedback[itemIdx] = item;
    writeDB(db);

    recordSecurityLog(
      admin.id,
      admin.email,
      'UPDATE_FEEDBACK_ITEM',
      `/admin/feedback/${id}`,
      `Updated feedback ${id} - Status: ${item.status}, Priority: ${item.priority}`,
      clientIp,
      'Success'
    );

    return NextResponse.json({
      success: true,
      feedback: item,
      message: `Feedback updated successfully.`,
    });
  } catch (err) {
    console.error('Update feedback error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update feedback status.' }, { status: 500 });
  }
}
