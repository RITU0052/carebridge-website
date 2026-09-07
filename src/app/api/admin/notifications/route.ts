import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, BroadcastNotificationRecord } from '@/lib/db';
import { getAuthenticatedAdmin, recordSecurityLog } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const db = readDB();
    return NextResponse.json({
      success: true,
      notifications: db.notifications || [],
    });
  } catch (err) {
    console.error('Admin fetch notifications error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { title, message, targetAudience, scheduledAt } = body;
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    if (!title || !message) {
      return NextResponse.json({ success: false, error: 'Title and message are required.' }, { status: 400 });
    }

    const db = readDB();
    const isScheduled = Boolean(scheduledAt && new Date(scheduledAt).getTime() > Date.now());

    const newNotif: BroadcastNotificationRecord = {
      id: `notif_${Date.now()}`,
      title,
      message,
      targetAudience: targetAudience || 'All Users',
      status: isScheduled ? 'Scheduled' : 'Sent',
      scheduledAt: isScheduled ? scheduledAt : undefined,
      sentAt: isScheduled ? undefined : new Date().toISOString(),
      createdBy: admin.email,
      createdAt: new Date().toISOString(),
    };

    db.notifications = [newNotif, ...(db.notifications || [])];
    writeDB(db);

    recordSecurityLog(
      admin.id,
      admin.email,
      isScheduled ? 'SCHEDULE_BROADCAST_NOTIFICATION' : 'DISPATCH_BROADCAST_NOTIFICATION',
      `/admin/notifications`,
      `Broadcast: "${title}" to ${targetAudience}`,
      clientIp,
      'Success'
    );

    return NextResponse.json({
      success: true,
      message: isScheduled
        ? `Notification scheduled for ${new Date(scheduledAt).toLocaleString()}`
        : 'Notification dispatched to target users successfully.',
      notification: newNotif,
    });
  } catch (err) {
    console.error('Create notification error:', err);
    return NextResponse.json({ success: false, error: 'Failed to dispatch notification' }, { status: 500 });
  }
}
