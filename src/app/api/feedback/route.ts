import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, FeedbackRecord } from '@/lib/db';
import { sendFeedbackAlertToAdmin, sendFeedbackUserConfirmation } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, email, rating = 5, category = 'General', message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Name, email, and feedback message are required.' }, { status: 400 });
    }

    const db = readDB();
    const newFeedback: FeedbackRecord = {
      id: 'fb_' + Math.random().toString(36).substring(2, 9),
      userId,
      name,
      email: email.trim().toLowerCase(),
      rating: Number(rating) || 5,
      category: category || 'General',
      message: message.trim(),
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    db.feedback.unshift(newFeedback);
    writeDB(db);

    // Send emails in background
    sendFeedbackAlertToAdmin({
      name,
      email,
      category: newFeedback.category,
      rating: newFeedback.rating,
      message: newFeedback.message,
    }).catch((err) => console.error('Admin feedback email error:', err));

    sendFeedbackUserConfirmation(newFeedback.email, name).catch((err) => console.error('User feedback confirm error:', err));

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your feedback has been received and confirmed via email.',
      feedback: newFeedback,
    });
  } catch (err) {
    console.error('Feedback submit error:', err);
    return NextResponse.json({ success: false, error: 'Unable to submit feedback.' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const db = readDB();
    return NextResponse.json({ success: true, feedback: db.feedback });
  } catch (err) {
    console.error('Fetch feedback error:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch feedback.' }, { status: 500 });
  }
}
