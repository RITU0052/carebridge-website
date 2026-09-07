import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { getAuthenticatedAdmin, recordSecurityLog } from '@/lib/auth';

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const { id } = await context.params;
    const body = await req.json();
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    const db = readDB();

    if (id.startsWith('faq_')) {
      const idx = (db.faqs || []).findIndex((f) => f.id === id);
      if (idx !== -1) {
        db.faqs![idx] = { ...db.faqs![idx], ...body };
        writeDB(db);
        recordSecurityLog(admin.id, admin.email, 'UPDATE_FAQ_ITEM', `/admin/content/${id}`, '', clientIp, 'Success');
        return NextResponse.json({ success: true, message: 'FAQ updated successfully.' });
      }
    } else {
      const idx = (db.contentPosts || []).findIndex((p) => p.id === id);
      if (idx !== -1) {
        db.contentPosts![idx] = { ...db.contentPosts![idx], ...body, updatedAt: new Date().toISOString() };
        writeDB(db);
        recordSecurityLog(admin.id, admin.email, 'UPDATE_CMS_POST', `/admin/content/${id}`, '', clientIp, 'Success');
        return NextResponse.json({ success: true, message: 'Content post updated successfully.' });
      }
    }

    return NextResponse.json({ success: false, error: 'Content item not found' }, { status: 404 });
  } catch (err) {
    console.error('Update content error:', err);
    return NextResponse.json({ success: false, error: 'Failed to update content' }, { status: 500 });
  }
}

export async function DELETE(
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

    if (id.startsWith('faq_')) {
      db.faqs = (db.faqs || []).filter((f) => f.id !== id);
    } else {
      db.contentPosts = (db.contentPosts || []).filter((p) => p.id !== id);
    }

    writeDB(db);

    recordSecurityLog(
      admin.id,
      admin.email,
      'DELETE_CMS_ITEM',
      `/admin/content/${id}`,
      `Deleted item ${id}`,
      clientIp,
      'Warning'
    );

    return NextResponse.json({ success: true, message: 'Content item deleted successfully.' });
  } catch (err) {
    console.error('Delete content error:', err);
    return NextResponse.json({ success: false, error: 'Failed to delete content' }, { status: 500 });
  }
}
