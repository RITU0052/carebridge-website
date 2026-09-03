import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { sendDailySummaryEmail } from '@/lib/mailer';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || 'usr_demo_1';

    const db = readDB();
    const user = db.users.find((u) => u.id === userId) || db.users[0];
    const medicines = db.medicines.filter((m) => m.userId === userId);
    const vitals = db.vitals.filter((v) => v.userId === userId);
    const reports = db.reports.filter((r) => r.userId === userId);
    const latestVital = vitals[0];

    const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

    let vitalsSummaryHtml = '<p>No vitals recorded today yet.</p>';
    if (latestVital) {
      vitalsSummaryHtml = `
        <div style="background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p style="margin: 0; font-weight: bold; color: #0f172a;">Blood Pressure: <span style="color: #0d9488;">${latestVital.sysBP}/${latestVital.diaBP} mmHg</span></p>
          <p style="margin: 4px 0 0 0; color: #334155;">Heart Rate: ${latestVital.heartRate} bpm | SpO2: ${latestVital.oxygenLevel || 98}%</p>
          ${latestVital.bloodSugar ? `<p style="margin: 4px 0 0 0; color: #334155;">Fasting Blood Sugar: ${latestVital.bloodSugar} mg/dL</p>` : ''}
        </div>
      `;
    }

    let medicineListHtml = '<p style="color: #64748b;">No active medicines configured.</p>';
    if (medicines.length > 0) {
      medicineListHtml = `
        <ul style="padding-left: 20px; color: #334155; margin: 8px 0;">
          ${medicines.map((m) => `<li><strong>${m.name}</strong> (${m.dosage}) - ${m.frequency} [${m.times.join(', ')}]</li>`).join('')}
        </ul>
      `;
    }

    const summaryContent = `
      <h3 style="color: #0f766e; margin-top: 0;">CareBridge Daily Health Brief - ${todayStr}</h3>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p style="color: #334155;">Here is your automated daily health status summary:</p>

      <h4 style="color: #0f172a; margin-bottom: 6px;">1. Health Vitals Overview</h4>
      ${vitalsSummaryHtml}

      <h4 style="color: #0f172a; margin-bottom: 6px; margin-top: 16px;">2. Today's Medicine Schedule (${medicines.length} Prescriptions)</h4>
      ${medicineListHtml}

      <h4 style="color: #0f172a; margin-bottom: 6px; margin-top: 16px;">3. Recent Medical Reports</h4>
      <p style="color: #334155; font-size: 13px;">${reports.length} report(s) vaulted. Latest: ${reports[0]?.fileName || 'None uploaded recently'}.</p>

      <div style="margin-top: 20px; padding: 12px; background: #ccfbf1; border-radius: 8px; color: #0f766e; font-size: 13px;">
        💡 <strong>CareBridge AI Tip:</strong> Keep accurate daily vital readings to help your primary caregiver and physician identify early trends!
      </div>
    `;

    return NextResponse.json({
      success: true,
      summary: {
        date: todayStr,
        user: user.name,
        email: user.email,
        medicinesCount: medicines.length,
        vitalsCount: vitals.length,
        reportsCount: reports.length,
        latestVital,
        summaryContent,
      },
    });
  } catch (err) {
    console.error('Daily summary generation error:', err);
    return NextResponse.json({ success: false, error: 'Failed to generate daily summary.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId = 'usr_demo_1', sendEmail = true } = body;

    const db = readDB();
    const user = db.users.find((u) => u.id === userId) || db.users[0];
    const medicines = db.medicines.filter((m) => m.userId === userId);
    const vitals = db.vitals.filter((v) => v.userId === userId);
    const reports = db.reports.filter((r) => r.userId === userId);
    const latestVital = vitals[0];

    const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

    let vitalsSummaryHtml = '<p>No vitals recorded today yet.</p>';
    if (latestVital) {
      vitalsSummaryHtml = `
        <div style="background: #f8fafc; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0;">
          <p style="margin: 0; font-weight: bold; color: #0f172a;">Blood Pressure: <span style="color: #0d9488;">${latestVital.sysBP}/${latestVital.diaBP} mmHg</span></p>
          <p style="margin: 4px 0 0 0; color: #334155;">Heart Rate: ${latestVital.heartRate} bpm | SpO2: ${latestVital.oxygenLevel || 98}%</p>
        </div>
      `;
    }

    let medicineListHtml = '<p style="color: #64748b;">No active medicines configured.</p>';
    if (medicines.length > 0) {
      medicineListHtml = `
        <ul style="padding-left: 20px; color: #334155; margin: 8px 0;">
          ${medicines.map((m) => `<li><strong>${m.name}</strong> (${m.dosage}) - ${m.frequency}</li>`).join('')}
        </ul>
      `;
    }

    const summaryContent = `
      <h3 style="color: #0f766e; margin-top: 0;">CareBridge Daily Health Brief - ${todayStr}</h3>
      <p>Hello <strong>${user.name}</strong>,</p>
      <p style="color: #334155;">Here is your automated daily health status summary:</p>

      <h4 style="color: #0f172a; margin-bottom: 6px;">1. Health Vitals Overview</h4>
      ${vitalsSummaryHtml}

      <h4 style="color: #0f172a; margin-bottom: 6px; margin-top: 16px;">2. Today's Medicine Schedule</h4>
      ${medicineListHtml}

      <h4 style="color: #0f172a; margin-bottom: 6px; margin-top: 16px;">3. Medical Reports</h4>
      <p style="color: #334155; font-size: 13px;">${reports.length} report(s) stored in Vault.</p>
    `;

    if (sendEmail) {
      await sendDailySummaryEmail(user.email, summaryContent, user.name);
    }

    return NextResponse.json({
      success: true,
      message: sendEmail ? `Daily health summary dispatched to ${user.email}!` : 'Daily summary generated.',
      summaryContent,
    });
  } catch (err) {
    console.error('Dispatch daily summary error:', err);
    return NextResponse.json({ success: false, error: 'Failed to process daily summary.' }, { status: 500 });
  }
}
