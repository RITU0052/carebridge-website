import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { sendMedicineReminderEmail, sendDailySummaryEmail } from '@/lib/mailer';

export async function GET() {
  try {
    const db = readDB();
    const users = db.users;
    let dispatchedReminders = 0;
    let dispatchedSummaries = 0;

    for (const user of users) {
      const medicines = db.medicines.filter((m) => m.userId === user.id && m.remindersEnabled);

      for (const med of medicines) {
        const time = med.times[0] || '09:00 AM';
        await sendMedicineReminderEmail(user.email, med.name, med.dosage, time, user.name);
        dispatchedReminders++;
      }

      // Generate daily summary for user
      const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      const summaryHtml = `
        <h3 style="color: #0f766e;">CareBridge Daily Health Brief - ${todayStr}</h3>
        <p>Hello <strong>${user.name}</strong>,</p>
        <p style="color: #334155;">Your daily automated health summary report has been compiled.</p>
        <ul style="color: #334155;">
          <li>Active Prescription Medicines: ${medicines.length}</li>
          <li>System Status: All CareBridge Reminders Active</li>
        </ul>
      `;
      await sendDailySummaryEmail(user.email, summaryHtml, user.name);
      dispatchedSummaries++;
    }

    return NextResponse.json({
      success: true,
      message: `Automated email engine run complete. Dispatched ${dispatchedReminders} medicine reminder(s) and ${dispatchedSummaries} daily summary email(s).`,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Automated reminder cron error:', err);
    return NextResponse.json({ success: false, error: 'Failed to run automated reminder engine.' }, { status: 500 });
  }
}
