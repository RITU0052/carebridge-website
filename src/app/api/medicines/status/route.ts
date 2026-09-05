import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, MedicineAdherenceLogRecord, NotificationLogRecord } from '@/lib/db';
import { sendCaregiverMedicineStatusAlert } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { medicineId, status, scheduledTime } = body;
    let userId = body.userId;

    // Server-side authentication check
    const sessionUserId = req.cookies.get('carebridge_session')?.value;
    if (sessionUserId) {
      userId = sessionUserId;
    }
    if (!userId) {
      userId = 'usr_demo_1';
    }

    if (!medicineId || !status || !['Taken', 'Skipped', 'Missed', 'Pending'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Valid medicineId and status (Taken/Skipped/Pending) are required.' },
        { status: 400 }
      );
    }

    const db = readDB();
    const medicine = db.medicines.find((m) => m.id === medicineId);

    if (!medicine) {
      return NextResponse.json({ success: false, error: 'Medicine schedule not found.' }, { status: 404 });
    }

    // Scoped security check: verify medicine belongs to user
    if (medicine.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Medicine does not belong to user.' },
        { status: 403 }
      );
    }

    const nowIso = new Date().toISOString();
    const timeDisplay = scheduledTime || (medicine.times && medicine.times[0]) || '08:00 AM';
    const actionLabel = status === 'Taken' ? 'TAKEN' : 'SKIPPED';

    // 1. Save adherence log
    const adherenceRecord: MedicineAdherenceLogRecord = {
      id: 'adh_' + Math.random().toString(36).substring(2, 9),
      userId,
      medicineId,
      medicineName: medicine.name,
      scheduledTime: timeDisplay,
      status: status === 'Taken' ? 'Taken' : 'Skipped',
      recordedAt: nowIso,
    };

    if (!db.adherenceLogs) {
      db.adherenceLogs = [];
    }
    db.adherenceLogs.unshift(adherenceRecord);

    // 2. Fetch user preferences
    const userPrefs = (db.notificationPreferences || []).find((p) => p.userId === userId) || {
      userId,
      medicineReminders: true,
      caregiverStatusAlerts: true,
      dailySummary: true,
      emailNotifications: true,
      whatsappNotifications: true,
      includeMedicineNameInAlerts: true,
      timezone: 'Asia/Kolkata',
    };

    // 3. Find authorized connected caregivers
    const patientUser = db.users.find((u) => u.id === userId);
    const patientName = patientUser ? patientUser.name : 'Your parent';

    const connectedCaregivers = (db.caregiverRelationships || []).filter(
      (rel) => rel.patientUserId === userId && rel.whatsappAlertsEnabled
    );

    // Also include emergency contacts with phone numbers if no explicit caregiver relationship exists
    const emergencyCaregivers =
      connectedCaregivers.length > 0
        ? []
        : (db.emergencyContacts || [])
            .filter((ec) => ec.userId === userId && ec.phone)
            .map((ec) => ({
              caregiverName: ec.name,
              caregiverPhone: ec.phone,
              whatsappAlertsEnabled: true,
            }));

    const targetCaregivers = [...connectedCaregivers, ...emergencyCaregivers];
    const whatsappResults: any[] = [];
    let whatsappSentCount = 0;

    // Send WhatsApp notification if status is Taken/Skipped and preferences permit
    if ((status === 'Taken' || status === 'Skipped' || status === 'Missed') && userPrefs.whatsappNotifications && userPrefs.caregiverStatusAlerts) {
      for (const cg of targetCaregivers) {
        if (!cg.caregiverPhone) continue;

        const whatsappResponse = await sendCaregiverMedicineStatusAlert({
          caregiverPhone: cg.caregiverPhone,
          patientName,
          scheduledTime: timeDisplay,
          action: actionLabel as 'TAKEN' | 'SKIPPED',
          medicineName: medicine.name,
          includeMedicineName: userPrefs.includeMedicineNameInAlerts,
        });

        // Audit log in notificationLogs
        const notifLog: NotificationLogRecord = {
          id: 'ntf_' + Math.random().toString(36).substring(2, 9),
          userId,
          type: status === 'Taken' ? 'medicine_taken' : 'medicine_skipped',
          recipient: cg.caregiverPhone,
          channel: 'whatsapp',
          status: whatsappResponse.success
            ? 'SENT'
            : whatsappResponse.error === 'WhatsApp provider is not configured.'
            ? 'NOT_CONFIGURED'
            : 'FAILED',
          failureReason: whatsappResponse.error,
          sentAt: nowIso,
        };

        if (!db.notificationLogs) {
          db.notificationLogs = [];
        }
        db.notificationLogs.unshift(notifLog);

        if (whatsappResponse.success) {
          whatsappSentCount++;
        }

        whatsappResults.push({
          caregiverName: cg.caregiverName,
          caregiverPhone: cg.caregiverPhone,
          sent: whatsappResponse.success,
          provider: whatsappResponse.provider,
          error: whatsappResponse.error,
        });
      }
    }

    writeDB(db);

    return NextResponse.json({
      success: true,
      medicineStatusUpdated: true,
      status,
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      whatsappNotificationsSent: whatsappSentCount,
      whatsappResults,
    });
  } catch (err) {
    console.error('Medicine status update error:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to record medicine status update.' },
      { status: 500 }
    );
  }
}
