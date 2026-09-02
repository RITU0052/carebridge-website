import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const userId = (formData.get('userId') as string) || 'anonymous';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No report file provided' }, { status: 400 });
    }

    // Validate size (15MB limit)
    const MAX_SIZE = 15 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ success: false, error: 'File size exceeds 15MB limit' }, { status: 400 });
    }

    // Validate type
    const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { success: false, error: 'Unsupported file format. Please upload PDF, JPG, PNG, or WEBP files.' },
        { status: 400 }
      );
    }

    const reportId = 'rep_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const uploadedAt = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    });

    const report = {
      id: reportId,
      userId,
      fileName: file.name,
      fileType: ext.toUpperCase(),
      fileSize: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
      uploadedAt,
      summaryStatus: 'Not generated yet',
      summary: null,
    };

    return NextResponse.json({
      success: true,
      report,
      message: 'Report uploaded successfully.',
    });
  } catch (error) {
    console.error('Error handling report upload:', error);
    return NextResponse.json({ success: false, error: 'Internal server error processing upload' }, { status: 500 });
  }
}
