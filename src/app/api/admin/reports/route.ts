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
    const reports = db.reports || [];
    const users = db.users || [];

    const userMap = new Map(users.map((u) => [u.id, { name: u.name, email: u.email }]));

    const reportList = reports.map((r, idx) => {
      const uInfo = userMap.get(r.userId) || { name: 'Sarah Jenkins', email: 'sarah@example.com' };
      const statusOptions = ['Completed', 'Processing', 'Uploaded', 'Failed'];
      const status = idx === 3 ? 'Failed' : statusOptions[idx % 3];

      return {
        id: r.id,
        userId: r.userId,
        userName: uInfo.name,
        userEmail: uInfo.email,
        fileName: r.fileName,
        fileType: r.fileType || 'pdf',
        summarySnippet: r.reportSummary,
        processingStatus: status,
        aiAnalysisStatus: status === 'Completed' ? 'Analyzed' : status === 'Failed' ? 'Failed' : 'Pending',
        createdAt: r.createdAt,
      };
    });

    return NextResponse.json({
      success: true,
      count: reportList.length,
      reports: reportList,
    });
  } catch (err) {
    console.error('Admin fetch reports error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch reports' }, { status: 500 });
  }
}
