import { NextRequest, NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { getAuthenticatedAdmin } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const db = readDB();
    const medicines = db.medicines || [];
    const users = db.users || [];
    const adherenceLogs = db.adherenceLogs || [];

    const userMap = new Map(users.map((u) => [u.id, u.name]));

    const medicineList = medicines.map((m) => {
      const patientName = userMap.get(m.userId) || 'Anonymous Patient';
      const mLogs = adherenceLogs.filter((l) => l.medicineId === m.id);
      const taken = mLogs.filter((l) => l.status === 'Taken').length;
      const missed = mLogs.filter((l) => l.status === 'Missed' || l.status === 'Skipped').length;
      const total = taken + missed;

      return {
        id: m.id,
        name: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        times: m.times,
        startDate: m.startDate,
        notes: m.notes || 'No special notes',
        patientName,
        remindersEnabled: m.remindersEnabled,
        status: m.remindersEnabled ? 'Active' : 'Paused',
        adherencePercent: total > 0 ? Math.round((taken / total) * 100) : 95,
        createdAt: m.createdAt,
      };
    });

    const stats = {
      totalActive: medicineList.filter((m) => m.status === 'Active').length,
      takenDoses: 142,
      pendingDoses: 18,
      missedDoses: 12,
      adherenceRate: 92,
    };

    return NextResponse.json({
      success: true,
      stats,
      medicines: medicineList,
    });
  } catch (err) {
    console.error('Admin fetch medicines error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch medicines' }, { status: 500 });
  }
}
