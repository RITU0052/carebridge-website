import nodemailer from 'nodemailer';
import { readDB, writeDB, EmailLogRecord } from './db';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SYSTEM_NOTIFICATION_ADDRESS =
  process.env.CAREBRIDGE_NOTIFICATION_EMAIL ||
  process.env.FEEDBACK_NOTIFICATION_EMAIL ||
  'bridge.notifications@gmail.com';
const SMTP_FROM = process.env.SMTP_FROM || `CareBridge System <${SYSTEM_NOTIFICATION_ADDRESS}>`;

export interface MailDeliveryResult {
  success: boolean;
  error?: string;
  simulated?: boolean;
}

function createTransporter() {
  if (SMTP_USER && SMTP_PASS) {
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }
  return null;
}

function logEmailDispatch(
  type: EmailLogRecord['type'],
  recipient: string,
  subject: string,
  body: string,
  wasSent: boolean,
  failureReason?: string
) {
  try {
    const db = readDB();
    const log: EmailLogRecord = {
      id: 'eml_' + Math.random().toString(36).substring(2, 9),
      type,
      recipient,
      subject,
      body,
      status: wasSent ? 'SENT' : failureReason ? 'FAILED' : 'SIMULATED',
      sentAt: new Date().toISOString(),
    };
    db.emailLogs.unshift(log);

    // Also add to notificationLogs audit trail
    if (db.notificationLogs) {
      db.notificationLogs.unshift({
        id: 'ntf_' + Math.random().toString(36).substring(2, 9),
        type: type.toLowerCase() as any,
        recipient,
        channel: 'email',
        status: wasSent ? 'SENT' : failureReason ? 'FAILED' : 'NOT_CONFIGURED',
        failureReason,
        sentAt: new Date().toISOString(),
      });
    }

    writeDB(db);
  } catch (err) {
    console.error('Error logging email dispatch:', err);
  }
}

export async function sendOtpEmail(recipientEmail: string, otpCode: string, name?: string): Promise<MailDeliveryResult> {
  const subject = `Your CareBridge Login OTP: ${otpCode}`;
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0f766e; margin: 0; font-size: 24px; font-weight: 800;">CareBridge</h2>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Secure Verification</p>
      </div>
      <div style="background-color: #ffffff; padding: 28px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <h3 style="color: #0f172a; margin-top: 0;">Hello ${name || 'CareBridge User'},</h3>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">
          Your CareBridge verification code is:
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; background-color: #ccfbf1; color: #0f766e; font-size: 32px; font-weight: 900; letter-spacing: 8px; padding: 12px 28px; border-radius: 10px; border: 2px dashed #0d9488;">
            ${otpCode}
          </span>
        </div>
        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
          This code will expire in <strong>10 minutes</strong>.
        </p>
        <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">
          If you did not request this code, you can ignore this email.
        </p>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #94a3b8;">
        © ${new Date().getFullYear()} CareBridge. Automated System Notification.
      </div>
    </div>
  `;

  const transporter = createTransporter();
  if (!transporter) {
    const errorMsg = 'SMTP credentials not configured (SMTP_USER/SMTP_PASS missing).';
    logEmailDispatch('OTP', recipientEmail, subject, `OTP Code: ${otpCode}`, false, errorMsg);
    return { success: false, simulated: true, error: errorMsg };
  }

  try {
    await transporter.sendMail({ from: SMTP_FROM, to: recipientEmail, subject, html });
    logEmailDispatch('OTP', recipientEmail, subject, `OTP Code: ${otpCode}`, true);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'Failed to dispatch email via SMTP transporter.';
    console.error('SMTP send failure for OTP:', err);
    logEmailDispatch('OTP', recipientEmail, subject, `OTP Code: ${otpCode}`, false, errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function sendPasswordResetEmail(
  recipientEmail: string,
  resetToken: string,
  name?: string
): Promise<MailDeliveryResult> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(recipientEmail)}`;
  const subject = 'Reset Your CareBridge Password';
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0f766e; margin: 0; font-size: 24px; font-weight: 800;">CareBridge</h2>
      </div>
      <div style="background-color: #ffffff; padding: 28px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <h3 style="color: #0f172a; margin-top: 0;">Password Reset Requested</h3>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">
          Hello ${name || 'CareBridge User'}, we received a request to reset the password for your account associated with <strong>${recipientEmail}</strong>.
        </p>
        <div style="text-align: center; margin: 28px 0;">
          <a href="${resetUrl}" style="background-color: #0d9488; color: #ffffff; padding: 14px 28px; text-decoration: none; font-weight: 700; border-radius: 10px; font-size: 15px; display: inline-block;">
            Reset CareBridge Password
          </a>
        </div>
        <p style="color: #64748b; font-size: 12px; word-break: break-all;">
          Or copy & paste this link into your browser:<br/>
          <a href="${resetUrl}" style="color: #0f766e;">${resetUrl}</a>
        </p>
      </div>
    </div>
  `;

  const transporter = createTransporter();
  if (!transporter) {
    const errorMsg = 'SMTP credentials not configured (SMTP_USER/SMTP_PASS missing).';
    logEmailDispatch('PASSWORD_RESET', recipientEmail, subject, `Reset Token: ${resetToken}`, false, errorMsg);
    return { success: false, simulated: true, error: errorMsg };
  }

  try {
    await transporter.sendMail({ from: SMTP_FROM, to: recipientEmail, subject, html });
    logEmailDispatch('PASSWORD_RESET', recipientEmail, subject, `Reset Token: ${resetToken}`, true);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'Failed to dispatch email via SMTP.';
    console.error('SMTP send failure for password reset:', err);
    logEmailDispatch('PASSWORD_RESET', recipientEmail, subject, `Reset Token: ${resetToken}`, false, errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function sendMedicineReminderEmail(
  recipientEmail: string,
  medicineName: string,
  dosage: string,
  time: string,
  name?: string
): Promise<MailDeliveryResult> {
  const subject = `💊 CareBridge Medicine Reminder: ${medicineName} (${dosage})`;
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
      <div style="background-color: #0f766e; color: #ffffff; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <h2 style="margin: 0; font-size: 20px;">CareBridge Scheduled Medicine Reminder</h2>
      </div>
      <div style="background-color: #ffffff; padding: 28px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
        <p style="color: #334155; font-size: 15px;">Hello ${name || 'Caregiver / Patient'},</p>
        <p style="color: #334155;">Your medicine scheduled for <strong>${time}</strong> has not been marked as taken yet.</p>
        <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #15803d; font-size: 16px;">${medicineName}</h4>
          <p style="margin: 0; color: #166534; font-size: 14px;">Dosage: <strong>${dosage}</strong></p>
          <p style="margin: 4px 0 0 0; color: #166534; font-size: 14px;">Scheduled Time: <strong>${time}</strong></p>
        </div>
        <p style="color: #64748b; font-size: 13px;">Please verify that this medication was taken and update your CareBridge schedule.</p>
      </div>
    </div>
  `;

  const transporter = createTransporter();
  if (!transporter) {
    const errorMsg = 'SMTP credentials not configured.';
    logEmailDispatch('MEDICINE_REMINDER', recipientEmail, subject, `Medicine: ${medicineName} @ ${time}`, false, errorMsg);
    return { success: false, simulated: true, error: errorMsg };
  }

  try {
    await transporter.sendMail({ from: SMTP_FROM, to: recipientEmail, subject, html });
    logEmailDispatch('MEDICINE_REMINDER', recipientEmail, subject, `Medicine: ${medicineName} @ ${time}`, true);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'SMTP send failed.';
    console.error('SMTP send failure for medicine reminder:', err);
    logEmailDispatch('MEDICINE_REMINDER', recipientEmail, subject, `Medicine: ${medicineName} @ ${time}`, false, errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function sendDailySummaryEmail(
  recipientEmail: string,
  summaryContent: string,
  name?: string
): Promise<MailDeliveryResult> {
  const subject = `☀️ CareBridge Daily Health Summary - ${new Date().toLocaleDateString()}`;
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
      <div style="background-color: #0f172a; color: #ffffff; padding: 24px; border-radius: 12px; text-align: center; margin-bottom: 20px;">
        <h2 style="margin: 0; font-size: 22px; color: #2dd4bf;">CareBridge Daily Health Brief</h2>
        <p style="margin: 6px 0 0 0; color: #94a3b8; font-size: 13px;">Automated Caregiver Summary for ${name || recipientEmail}</p>
      </div>
      <div style="background-color: #ffffff; padding: 28px; border-radius: 12px; border: 1px solid #e2e8f0; color: #334155; line-height: 1.6;">
        ${summaryContent}
      </div>
    </div>
  `;

  const transporter = createTransporter();
  if (!transporter) {
    const errorMsg = 'SMTP credentials not configured.';
    logEmailDispatch('DAILY_SUMMARY', recipientEmail, subject, `Daily Summary Dispatch`, false, errorMsg);
    return { success: false, simulated: true, error: errorMsg };
  }

  try {
    await transporter.sendMail({ from: SMTP_FROM, to: recipientEmail, subject, html });
    logEmailDispatch('DAILY_SUMMARY', recipientEmail, subject, `Daily Summary Dispatch`, true);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'SMTP send failed.';
    console.error('SMTP send failure for daily summary:', err);
    logEmailDispatch('DAILY_SUMMARY', recipientEmail, subject, `Daily Summary Dispatch`, false, errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function sendFeedbackAlertToAdmin(feedback: {
  id?: string;
  name: string;
  email: string;
  category: string;
  rating: number;
  message: string;
  notificationPreference?: string;
  whatsappNumber?: string;
  createdAt?: string;
}): Promise<MailDeliveryResult> {
  const targetEmail = SYSTEM_NOTIFICATION_ADDRESS;
  const subject = `📬 New CareBridge Feedback [${feedback.category}] - ${feedback.rating} Stars`;
  const feedbackDate = feedback.createdAt ? new Date(feedback.createdAt).toLocaleString() : new Date().toLocaleString();
  const feedbackId = feedback.id || 'fb_' + Date.now();

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cbd5e1; border-radius: 12px; background: #ffffff;">
      <h3 style="color: #0f766e; margin-top: 0;">New CareBridge Platform Feedback</h3>
      <table style="width: 100%; font-size: 14px; color: #334155; border-collapse: collapse;">
        <tr><td style="padding: 4px 0; font-weight: bold;">Feedback ID:</td><td style="padding: 4px 0;">${feedbackId}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">User Name:</td><td style="padding: 4px 0;">${feedback.name}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">User Email:</td><td style="padding: 4px 0;">${feedback.email}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">Category:</td><td style="padding: 4px 0;">${feedback.category}</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">Rating:</td><td style="padding: 4px 0;">${'★'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)} (${feedback.rating}/5)</td></tr>
        <tr><td style="padding: 4px 0; font-weight: bold;">Notification Pref:</td><td style="padding: 4px 0;">${feedback.notificationPreference || 'Not specified'}</td></tr>
        ${feedback.whatsappNumber ? `<tr><td style="padding: 4px 0; font-weight: bold;">WhatsApp Number:</td><td style="padding: 4px 0;">${feedback.whatsappNumber}</td></tr>` : ''}
        <tr><td style="padding: 4px 0; font-weight: bold;">Submitted Date/Time:</td><td style="padding: 4px 0;">${feedbackDate}</td></tr>
      </table>
      <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin-top: 16px; color: #1e293b;">
        <p style="margin: 0; font-weight: bold; font-size: 13px; color: #64748b;">Feedback Message:</p>
        <p style="margin: 8px 0 0 0; line-height: 1.5;">"${feedback.message}"</p>
      </div>
    </div>
  `;

  const transporter = createTransporter();
  if (!transporter) {
    const errorMsg = 'SMTP credentials not configured (SMTP_USER/SMTP_PASS missing).';
    logEmailDispatch('FEEDBACK_ALERT', targetEmail, subject, `Feedback ID: ${feedbackId}`, false, errorMsg);
    return { success: false, simulated: true, error: errorMsg };
  }

  try {
    await transporter.sendMail({ from: SMTP_FROM, to: targetEmail, subject, html });
    logEmailDispatch('FEEDBACK_ALERT', targetEmail, subject, `Feedback ID: ${feedbackId}`, true);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'SMTP send failed.';
    console.error('SMTP send failure for admin feedback alert:', err);
    logEmailDispatch('FEEDBACK_ALERT', targetEmail, subject, `Feedback ID: ${feedbackId}`, false, errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function sendFeedbackUserConfirmation(recipientEmail: string, name: string): Promise<MailDeliveryResult> {
  const subject = 'Thank you for sharing your feedback with CareBridge';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h3 style="color: #0f766e; margin-top: 0;">Thank you for sharing your feedback with CareBridge!</h3>
      <p style="color: #334155; line-height: 1.6;">
        Hello <strong>${name}</strong>,<br/><br/>
        Thank you for sharing your feedback with CareBridge. Your feedback has been received. Our team reviews every submission to continuously improve CareBridge for all caregivers and patients.
      </p>
      <p style="color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0; pt-12; margin-top: 20px;">
        Need urgent assistance? Reach us on WhatsApp at <strong>+91 7042363267</strong> or <strong>+91 9953920052</strong>.
      </p>
    </div>
  `;

  const transporter = createTransporter();
  if (!transporter) {
    const errorMsg = 'SMTP credentials not configured.';
    logEmailDispatch('FEEDBACK_CONFIRM', recipientEmail, subject, `User Confirmation for ${recipientEmail}`, false, errorMsg);
    return { success: false, simulated: true, error: errorMsg };
  }

  try {
    await transporter.sendMail({ from: SMTP_FROM, to: recipientEmail, subject, html });
    logEmailDispatch('FEEDBACK_CONFIRM', recipientEmail, subject, `User Confirmation for ${recipientEmail}`, true);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'SMTP send failed.';
    console.error('SMTP send failure for user feedback confirmation:', err);
    logEmailDispatch('FEEDBACK_CONFIRM', recipientEmail, subject, `User Confirmation for ${recipientEmail}`, false, errorMsg);
    return { success: false, error: errorMsg };
  }
}
