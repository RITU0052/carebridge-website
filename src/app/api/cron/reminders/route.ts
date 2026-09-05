import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { sendMedicineReminderEmail, sendDailySummaryEmail } from '@/lib/mailer';

export async function GET(req: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = req.headers.get('authorization');
    const urlSecret = new URL(req.url).searchParams.get('secret');

    // Fail-Closed Production Rule: Enforce CRON_SECRET verification strictly
    if (!cronSecret && process.env.NODE_ENV === 'production') {
      console.error('CRON_SECRET is not configured in production environment.');
      return NextResponse.json({ success: false, error: 'Cron service configuration error.' }, { status: 503 });
    }

    if (cronSecret && authHeader !== `Bearer ${cronSecret}` && urlSecret !== cronSecret) {
      return NextResponse.json({ success: false, error: 'Unauthorized cron invocation.' }, { status: 401 });
    }

    const db = readDB();
    const users = db.users;
    let overdueRemindersSent = 0;
    let dailySummariesSent = 0;

    const now = new Date();
    const kolkataDateStr = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
    const kolkataTimeStr = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Kolkata', hour12: false });
    const [currHours, currMins] = kolkataTimeStr.split(':').map(Number);
    const currentTotalMins = currHours * 60 + currMins;

    for (const user of users) {
      const medicines = db.medicines.filter((m) => m.userId === user.id && m.remindersEnabled);
      const userAdherenceToday = (db.adherenceLogs || []).filter((log) => {
        const logDateStr = new Date(log.recordedAt).toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
        return log.userId === user.id && logDateStr === kolkataDateStr;
      });

      for (const med of medicines) {
        const scheduledTimeStr = (med.times && med.times[0]) || '08:00 AM';
        let schedHours = 8;
        let schedMins = 0;

        const timeMatch = scheduledTimeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (timeMatch) {
          schedHours = parseInt(timeMatch[1], 10);
          schedMins = parseInt(timeMatch[2], 10);
          const ampm = timeMatch[3];
          if (ampm) {
            if (ampm.toUpperCase() === 'PM' && schedHours < 12) schedHours += 12;
            if (ampm.toUpperCase() === 'AM' && schedHours === 12) schedHours = 0;
          }
        }

        const scheduledTotalMins = schedHours * 60 + schedMins;
        const overdueThresholdMins = scheduledTotalMins + 15;

        if (currentTotalMins >= overdueThresholdMins) {
          const markedToday = userAdherenceToday.find((log) => log.medicineId === med.id);
          if (markedToday && (markedToday.status === 'Taken' || markedToday.status === 'Skipped')) {
            continue;
          }

          const alreadyRemindedToday = (db.overdueReminderLogs || []).find((rem) => {
            return rem.userId === user.id && rem.medicineId === med.id && rem.scheduledDate === kolkataDateStr;
          });

          if (alreadyRemindedToday) {
            continue;
          }

          await sendMedicineReminderEmail(user.email, med.name, med.dosage, scheduledTimeStr, user.name);

          if (!db.overdueReminderLogs) {
            db.overdueReminderLogs = [];
          }
          db.overdueReminderLogs.unshift({
            id: 'ovd_' + Math.random().toString(36).substring(2, 9),
            userId: user.id,
            medicineId: med.id,
            scheduledDate: kolkataDateStr,
            scheduledTime: scheduledTimeStr,
            sentAt: now.toISOString(),
          });

          overdueRemindersSent++;
        }
      }

      if (currHours === 20 && currMins < 15) {
        const todayStr = now.toLocaleDateString('en-US', { timeZone: 'Asia/Kolkata', weekday: 'long', month: 'short', day: 'numeric' });
        const summaryHtml = `
          <h3 style="color: #0f766e;">CareBridge Daily Health Summary - ${todayStr}</h3>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p style="color: #334155;">Here is your automated daily medication and adherence report:</p>
          <ul style="color: #334155; line-height: 1.8;">
            <li><strong>Active Schedules:</strong> ${medicines.length} prescription(s)</li>
            <li><strong>Recorded Adherence Logged Today:</strong> ${userAdherenceToday.length} item(s)</li>
            <li><strong>CareBridge Security & Alert Status:</strong> Active</li>
          </ul>
        `;
        await sendDailySummaryEmail(user.email, summaryHtml, user.name);
        dailySummariesSent++;
      }
    }

    writeDB(db);

    return NextResponse.json({
      success: true,
      message: `Cron execution complete. Sent ${overdueRemindersSent} 15-minute overdue reminder(s) and ${dailySummariesSent} daily summary email(s).`,
      overdueRemindersSent,
      dailySummariesSent,
      timestamp: now.toISOString(),
    });
  } catch (err) {
    console.error('Automated reminder cron error:', err);
    return NextResponse.json({ success: false, error: 'Failed to run automated reminder engine.' }, { status: 500 });
  }
}
