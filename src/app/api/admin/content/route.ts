import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, ContentPostRecord, FAQRecord } from '@/lib/db';
import { getAuthenticatedAdmin, recordSecurityLog } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const db = readDB();
    return NextResponse.json({
      success: true,
      contentPosts: db.contentPosts || [],
      faqs: db.faqs || [],
    });
  } catch (err) {
    console.error('Admin fetch content error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = getAuthenticatedAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
    }

    const body = await req.json();
    const { contentType } = body; // 'post' | 'faq'
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';
    const db = readDB();

    if (contentType === 'faq') {
      const { question, answer, category } = body;
      if (!question || !answer) {
        return NextResponse.json({ success: false, error: 'Question and answer required.' }, { status: 400 });
      }

      const newFaq: FAQRecord = {
        id: `faq_${Date.now()}`,
        question,
        answer,
        category: category || 'General',
        orderIndex: (db.faqs || []).length + 1,
        isPublished: true,
        createdAt: new Date().toISOString(),
      };

      db.faqs = [newFaq, ...(db.faqs || [])];
      writeDB(db);

      recordSecurityLog(
        admin.id,
        admin.email,
        'CREATE_FAQ_ITEM',
        '/admin/content',
        `Added FAQ: "${question}"`,
        clientIp,
        'Success'
      );

      return NextResponse.json({ success: true, message: 'FAQ created successfully.', item: newFaq });
    }

    // Default: Content Post (Blog/Announcement)
    const { type, title, summary, content, category, status } = body;
    if (!title || !content) {
      return NextResponse.json({ success: false, error: 'Title and content required.' }, { status: 400 });
    }

    const newPost: ContentPostRecord = {
      id: `post_${Date.now()}`,
      type: type || 'Blog',
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      summary: summary || title,
      content,
      category: category || 'General',
      author: admin.name || 'CareBridge Admin',
      status: status || 'Published',
      publishedAt: status === 'Published' ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.contentPosts = [newPost, ...(db.contentPosts || [])];
    writeDB(db);

    recordSecurityLog(
      admin.id,
      admin.email,
      'CREATE_CMS_POST',
      '/admin/content',
      `Created ${newPost.type}: "${title}"`,
      clientIp,
      'Success'
    );

    return NextResponse.json({ success: true, message: 'Content item created successfully.', item: newPost });
  } catch (err) {
    console.error('Create content error:', err);
    return NextResponse.json({ success: false, error: 'Failed to create content' }, { status: 500 });
  }
}
