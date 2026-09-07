import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { getAuthenticatedAdmin, recordSecurityLog } from '@/lib/auth';

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await context.params;
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    const db = readDB();
    const rep = db.reports.find((r) => r.id === id);

    if (!rep) {
      return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
    }

    // Simulate AI processing retry
    const aiLog = {
      id: `ai_req_${Date.now()}`,
      feature: 'Report Analysis' as const,
      userId: rep.userId,
      status: 'Completed' as const,
      durationMs: 1250,
      timestamp: new Date().toISOString(),
    };

    db.aiRequests = [aiLog, ...(db.aiRequests || [])];
    writeDB(db);

    recordSecurityLog(
      admin.id,
      admin.email,
      'RETRY_REPORT_AI_ANALYSIS',
      `/admin/reports/${id}`,
      `Triggered AI re-analysis for report ${rep.fileName}`,
      clientIp,
      'Success'
    );

    return NextResponse.json({
      success: true,
      message: `Report ${rep.fileName} queued for AI re-processing successfully.`,
    });
  } catch (err) {
    console.error('Report retry error:', err);
    return NextResponse.json({ success: false, error: 'Failed to retry report processing' }, { status: 500 });
  }
}
