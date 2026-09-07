import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { getAuthenticatedAdmin, recordSecurityLog, hashPassword } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const db = readDB();
    const settings = db.platformSettings || {
      maintenanceMode: false,
      sessionTimeoutMinutes: 60,
      maxLoginAttempts: 5,
      twoFactorRequired: false,
      dataRetentionDays: 365,
      emailAlertsEnabled: true,
      whatsappAlertsEnabled: true,
      updatedAt: new Date().toISOString(),
      updatedBy: admin.email,
    };

    return NextResponse.json({
      success: true,
      settings,
      adminUser: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.error('Fetch settings error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch platform settings' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { maintenanceMode, sessionTimeoutMinutes, maxLoginAttempts, twoFactorRequired, newPassword } = body;
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    const db = readDB();
    const settings = db.platformSettings || {
      maintenanceMode: false,
      sessionTimeoutMinutes: 60,
      maxLoginAttempts: 5,
      twoFactorRequired: false,
      dataRetentionDays: 365,
      emailAlertsEnabled: true,
      whatsappAlertsEnabled: true,
      updatedAt: new Date().toISOString(),
      updatedBy: admin.email,
    };

    if (maintenanceMode !== undefined) settings.maintenanceMode = Boolean(maintenanceMode);
    if (sessionTimeoutMinutes) settings.sessionTimeoutMinutes = Number(sessionTimeoutMinutes);
    if (maxLoginAttempts) settings.maxLoginAttempts = Number(maxLoginAttempts);
    if (twoFactorRequired !== undefined) settings.twoFactorRequired = Boolean(twoFactorRequired);
    settings.updatedAt = new Date().toISOString();
    settings.updatedBy = admin.email;

    db.platformSettings = settings;

    // Password change support
    if (newPassword) {
      const uIdx = db.users.findIndex((u) => u.id === admin.id);
      if (uIdx !== -1) {
        db.users[uIdx].passwordHash = hashPassword(newPassword);
      }
    }

    writeDB(db);

    recordSecurityLog(
      admin.id,
      admin.email,
      'UPDATE_PLATFORM_SETTINGS',
      '/admin/settings',
      `Updated settings (Maintenance Mode: ${settings.maintenanceMode}, Timeout: ${settings.sessionTimeoutMinutes}m)`,
      clientIp,
      'Warning'
    );

    return NextResponse.json({
      success: true,
      message: 'Platform settings updated successfully.',
      settings,
    });
  } catch (err) {
    console.error('Update settings error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update platform settings' }, { status: 500 });
  }
}
