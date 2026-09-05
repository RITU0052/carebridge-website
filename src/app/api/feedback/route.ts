import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB, FeedbackRecord } from '@/lib/db';
import { sendFeedbackAlertToAdmin, sendFeedbackUserConfirmation } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { userId, name, email, rating = 5, category = 'General', message, notificationPreference, whatsappNumber } = body;

    // Associate with authenticated session cookie if available
    const sessionUserId = req.cookies.get('carebridge_session')?.value;
    if (sessionUserId) {
      userId = sessionUserId;
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and feedback message are required.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDB();
    const newFeedback: FeedbackRecord = {
      id: 'fb_' + Math.random().toString(36).substring(2, 9),
      userId,
      name: name.trim(),
      email: cleanEmail,
      rating: Number(rating) || 5,
      category: category || 'General',
      message: message.trim(),
      notificationPreference: notificationPreference || 'email',
      whatsappNumber: whatsappNumber ? whatsappNumber.trim() : undefined,
      status: 'New',
      createdAt: new Date().toISOString(),
    };

    db.feedback.unshift(newFeedback);
    writeDB(db);

    // Await email delivery to get real status
    const adminEmailResult = await sendFeedbackAlertToAdmin({
      id: newFeedback.id,
      name: newFeedback.name,
      email: newFeedback.email,
      category: newFeedback.category,
      rating: newFeedback.rating,
      message: newFeedback.message,
      notificationPreference: newFeedback.notificationPreference,
      whatsappNumber: newFeedback.whatsappNumber,
      createdAt: newFeedback.createdAt,
    });

    const userEmailResult = await sendFeedbackUserConfirmation(newFeedback.email, newFeedback.name);

    return NextResponse.json({
      success: true,
      feedbackSaved: true,
      emailNotificationSent: adminEmailResult.success,
      userConfirmationSent: userEmailResult.success,
      emailMessage: adminEmailResult.success
        ? 'Feedback saved & email notification delivered to CareBridge.notifications@gmail.com'
        : adminEmailResult.error || 'Feedback saved successfully. (SMTP notification delivery unconfigured or failed)',
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
