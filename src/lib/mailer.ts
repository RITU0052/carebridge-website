import nodemailer from 'nodemailer';
import { readDB, writeDB, EmailLogRecord } from './db';

export interface MailDeliveryResult {
  success: boolean;
  error?: string;
  simulated?: boolean;
}

function getSmtpConfig() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim();
  const recipient = (
    process.env.CAREBRIDGE_NOTIFICATION_EMAIL ||
    process.env.FEEDBACK_NOTIFICATION_EMAIL ||
    'CareBridge.notifications@gmail.com'
  ).trim();
  const from = (process.env.SMTP_FROM || `CareBridge System <${user || recipient}>`).trim();

  return { host, port, user, pass, recipient, from };
}

export function validateEmailConfiguration(): {
  isConfigured: boolean;
  missingVars: string[];
  recipient: string;
  host: string;
  port: number;
} {
  const config = getSmtpConfig();
  const missingVars: string[] = [];
  if (!config.user) missingVars.push('SMTP_USER');
  if (!config.pass) missingVars.push('SMTP_PASS');

  return {
    isConfigured: missingVars.length === 0,
    missingVars,
    recipient: config.recipient,
    host: config.host,
    port: config.port,
  };
}

function createTransporter() {
  const config = getSmtpConfig();
  if (config.user && config.pass) {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      requireTLS: config.port === 587,
      auth: {
        user: config.user,
        pass: config.pass,
      },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
    });
    return { transporter, config };
  }
  return { transporter: null, config };
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
  console.log('[OTP] Sending email');
  const { transporter, config } = createTransporter();

  const subject = 'Your CareBridge Verification Code';
  const text = `Hello ${name || 'CareBridge User'},\n\nYour CareBridge verification code is: ${otpCode}\n\nThis code will expire in 10 minutes.\nIf you did not request this code, you can ignore this email.`;
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

  if (!transporter) {
    const errorMsg = 'SMTP credentials not configured (SMTP_USER/SMTP_PASS missing in Production).';
    console.warn(`[OTP] Email send failed: ${errorMsg}`);
    logEmailDispatch('OTP', recipientEmail, subject, 'OTP Verification Code', false, errorMsg);
    return { success: false, simulated: true, error: errorMsg };
  }

  try {
    await transporter.sendMail({ from: config.from, to: recipientEmail, subject, text, html });
    console.log('[OTP] Email sent successfully');
    logEmailDispatch('OTP', recipientEmail, subject, 'OTP Verification Code', true);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'Failed to dispatch email via SMTP transporter.';
    console.error('[OTP] Email send failed:', errorMsg);
    logEmailDispatch('OTP', recipientEmail, subject, 'OTP Verification Code', false, errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function sendPasswordResetEmail(
  recipientEmail: string,
  resetToken: string,
  name?: string
): Promise<MailDeliveryResult> {
  console.log(`[Password Reset Email] Starting dispatch to: ${recipientEmail}`);
  const { transporter, config } = createTransporter();

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

  if (!transporter) {
    const errorMsg = 'SMTP credentials not configured (SMTP_USER/SMTP_PASS missing).';
    console.warn(`[Password Reset Email] Failed: ${errorMsg}`);
    logEmailDispatch('PASSWORD_RESET', recipientEmail, subject, `Reset Token: ${resetToken}`, false, errorMsg);
    return { success: false, simulated: true, error: errorMsg };
  }

  try {
    await transporter.sendMail({ from: config.from, to: recipientEmail, subject, html });
    console.log(`[Password Reset Email] Sent successfully to ${recipientEmail}`);
    logEmailDispatch('PASSWORD_RESET', recipientEmail, subject, `Reset Token: ${resetToken}`, true);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'Failed to dispatch email via SMTP.';
    console.error('[Password Reset Email] Send failure:', errorMsg);
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
  console.log(`[Medicine Reminder Email] Starting dispatch to: ${recipientEmail}`);
  const { transporter, config } = createTransporter();

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

  if (!transporter) {
    const errorMsg = 'SMTP credentials not configured.';
    console.warn(`[Medicine Reminder Email] Failed: ${errorMsg}`);
    logEmailDispatch('MEDICINE_REMINDER', recipientEmail, subject, `Medicine: ${medicineName} @ ${time}`, false, errorMsg);
    return { success: false, simulated: true, error: errorMsg };
  }

  try {
    await transporter.sendMail({ from: config.from, to: recipientEmail, subject, html });
    console.log(`[Medicine Reminder Email] Sent successfully to ${recipientEmail}`);
    logEmailDispatch('MEDICINE_REMINDER', recipientEmail, subject, `Medicine: ${medicineName} @ ${time}`, true);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'SMTP send failed.';
    console.error('[Medicine Reminder Email] Send failure:', errorMsg);
    logEmailDispatch('MEDICINE_REMINDER', recipientEmail, subject, `Medicine: ${medicineName} @ ${time}`, false, errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function sendDailySummaryEmail(
  recipientEmail: string,
  summaryContent: string,
  name?: string
): Promise<MailDeliveryResult> {
  console.log(`[Daily Summary Email] Starting dispatch to: ${recipientEmail}`);
  const { transporter, config } = createTransporter();

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

  if (!transporter) {
    const errorMsg = 'SMTP credentials not configured.';
    console.warn(`[Daily Summary Email] Failed: ${errorMsg}`);
    logEmailDispatch('DAILY_SUMMARY', recipientEmail, subject, `Daily Summary Dispatch`, false, errorMsg);
    return { success: false, simulated: true, error: errorMsg };
  }

  try {
    await transporter.sendMail({ from: config.from, to: recipientEmail, subject, html });
    console.log(`[Daily Summary Email] Sent successfully to ${recipientEmail}`);
    logEmailDispatch('DAILY_SUMMARY', recipientEmail, subject, `Daily Summary Dispatch`, true);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'SMTP send failed.';
    console.error('[Daily Summary Email] Send failure:', errorMsg);
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
  console.log('[Feedback Email] Starting admin feedback notification dispatch');
  const { transporter, config } = createTransporter();
  const targetEmail = config.recipient;

  console.log(`[Feedback Email] Configured recipient: ${targetEmail}`);
  console.log(`[Feedback Email] Mail transport configured: ${Boolean(transporter)}`);

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

  if (!transporter) {
    const errorMsg = 'SMTP credentials not configured in environment variables (SMTP_USER and/or SMTP_PASS missing).';
    console.warn(`[Feedback Email] Failed: ${errorMsg}`);
    logEmailDispatch('FEEDBACK_ALERT', targetEmail, subject, `Feedback ID: ${feedbackId}`, false, errorMsg);
    return { success: false, simulated: true, error: errorMsg };
  }

  try {
    console.log(`[Feedback Email] Sending email via SMTP (${config.host}:${config.port}) to ${targetEmail}...`);
    await transporter.sendMail({ from: config.from, to: targetEmail, subject, html });
    console.log('[Feedback Email] Sent successfully');
    logEmailDispatch('FEEDBACK_ALERT', targetEmail, subject, `Feedback ID: ${feedbackId}`, true);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'SMTP send failed.';
    console.error('[Feedback Email] Failed:', errorMsg);
    logEmailDispatch('FEEDBACK_ALERT', targetEmail, subject, `Feedback ID: ${feedbackId}`, false, errorMsg);
    return { success: false, error: errorMsg };
  }
}

export async function sendFeedbackUserConfirmation(recipientEmail: string, name: string): Promise<MailDeliveryResult> {
  console.log(`[Feedback Confirmation] Starting dispatch to user: ${recipientEmail}`);
  const { transporter, config } = createTransporter();

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

  if (!transporter) {
    const errorMsg = 'SMTP credentials not configured.';
    console.warn(`[Feedback Confirmation] Failed: ${errorMsg}`);
    logEmailDispatch('FEEDBACK_CONFIRM', recipientEmail, subject, `User Confirmation for ${recipientEmail}`, false, errorMsg);
    return { success: false, simulated: true, error: errorMsg };
  }

  try {
    await transporter.sendMail({ from: config.from, to: recipientEmail, subject, html });
    console.log(`[Feedback Confirmation] Sent successfully to ${recipientEmail}`);
    logEmailDispatch('FEEDBACK_CONFIRM', recipientEmail, subject, `User Confirmation for ${recipientEmail}`, true);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'SMTP send failed.';
    console.error('[Feedback Confirmation] Failed:', errorMsg);
    logEmailDispatch('FEEDBACK_CONFIRM', recipientEmail, subject, `User Confirmation for ${recipientEmail}`, false, errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * 1. Send Doctor Email Verification Link
 */
export async function sendDoctorVerificationEmail(params: {
  toEmail: string;
  doctorName: string;
  verificationToken?: string;
  rawToken?: string;
}): Promise<MailDeliveryResult> {
  const { toEmail, doctorName } = params;
  const token = params.verificationToken || params.rawToken || '';
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  const verifyUrl = `${baseUrl}/doctor/verify-email?token=${encodeURIComponent(token)}`;

  const subject = 'Verify your CareBridge doctor account';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; background: #0f172a; border-radius: 16px; color: #f8fafc; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #14b8a6; margin: 0; font-size: 24px;">CareBridge Healthcare</h2>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">Doctor Verification System</p>
      </div>

      <h3 style="color: #ffffff; font-size: 18px;">Hello Dr. ${doctorName},</h3>

      <p style="color: #cbd5e1; line-height: 1.6; font-size: 14px;">
        Thank you for registering your medical practice with CareBridge. Please click the button below to verify your email address and submit your account for administrator review.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${verifyUrl}" style="background-color: #0d9488; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block;">
          Verify My Email
        </a>
      </div>

      <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
        Or copy and paste this link into your browser:<br/>
        <a href="${verifyUrl}" style="color: #2dd4bf; word-break: break-all;">${verifyUrl}</a>
      </p>

      <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px; text-align: center;">
        <p>This single-use verification link will expire in 30 minutes.</p>
        <p>© CareBridge Healthcare Platform. If you did not create this account, please ignore this message.</p>
      </div>
    </div>
  `;

  const { transporter, config } = createTransporter();

  if (process.env.EMAIL_MODE === 'development' || !transporter) {
    console.log(`[Doctor Verify Email SIMULATED] Link for Dr. ${doctorName}: ${verifyUrl}`);
    logEmailDispatch('OTP', toEmail, subject, `Simulated Doctor Verify Link: ${verifyUrl}`, true);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({ from: config.from, to: toEmail, subject, html });
    logEmailDispatch('OTP', toEmail, subject, `Verification sent to Dr. ${doctorName}`, true);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'Failed to send doctor verification email.';
    console.error('[Doctor Verify Email Error]:', errorMsg);
    logEmailDispatch('OTP', toEmail, subject, `Verification failed for Dr. ${doctorName}`, false, errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * 2. Send Admin Notification for New Verified Doctor Request
 */
export async function sendAdminNewDoctorNotificationEmail(params: {
  doctorName: string;
  doctorEmail: string;
  specialization: string;
  registeredAt: string;
  licenseNumber?: string;
  doctorId?: string;
}): Promise<MailDeliveryResult> {
  const { doctorName, doctorEmail, specialization, registeredAt, licenseNumber, doctorId } = params;
  const adminEmail = (process.env.ADMIN_EMAIL || process.env.CAREBRIDGE_NOTIFICATION_EMAIL || 'admin@carebridge.com').trim();
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  const adminUrl = doctorId ? `${baseUrl}/admin/doctors/${doctorId}` : `${baseUrl}/admin/doctors`;

  const subject = 'New Doctor Verification Request — CareBridge';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; background: #0f172a; border-radius: 16px; color: #f8fafc; border: 1px solid #1e293b;">
      <h3 style="color: #38bdf8; margin-top: 0;">New Doctor Verification Request</h3>
      <p style="color: #cbd5e1; font-size: 14px;">
        A new doctor has completed email verification and is waiting for administrator review.
      </p>

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; color: #cbd5e1;">
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 8px 0; font-weight: bold; color: #94a3b8;">Doctor Name:</td>
          <td style="padding: 8px 0; font-weight: bold; color: #ffffff;">Dr. ${doctorName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 8px 0; font-weight: bold; color: #94a3b8;">Email Address:</td>
          <td style="padding: 8px 0; color: #2dd4bf;">${doctorEmail}</td>
        </tr>
        <tr style="border-bottom: 1px solid #1e293b;">
          <td style="padding: 8px 0; font-weight: bold; color: #94a3b8;">Specialization:</td>
          <td style="padding: 8px 0; color: #ffffff;">${specialization}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #94a3b8;">Registered At:</td>
          <td style="padding: 8px 0; color: #94a3b8;">${new Date(registeredAt).toLocaleString()}</td>
        </tr>
      </table>

      <div style="text-align: center; margin-top: 24px;">
        <a href="${adminUrl}" style="background-color: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 13px; display: inline-block;">
          Review Doctor in Admin Panel
        </a>
      </div>
    </div>
  `;

  const { transporter, config } = createTransporter();

  if (process.env.EMAIL_MODE === 'development' || !transporter) {
    console.log(`[Admin Doctor Request SIMULATED] Alert for Dr. ${doctorName} sent to ${adminEmail}`);
    logEmailDispatch('FEEDBACK_ALERT', adminEmail, subject, `New doctor verification: Dr. ${doctorName}`, true);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({ from: config.from, to: adminEmail, subject, html });
    logEmailDispatch('FEEDBACK_ALERT', adminEmail, subject, `New doctor verification: Dr. ${doctorName}`, true);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'Failed to send admin doctor notification.';
    console.error('[Admin Doctor Email Error]:', errorMsg);
    logEmailDispatch('FEEDBACK_ALERT', adminEmail, subject, `New doctor verification: Dr. ${doctorName}`, false, errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * 3. Send Doctor Account Approval Email
 */
export async function sendDoctorApprovalEmail(params: {
  toEmail: string;
  doctorName: string;
}): Promise<MailDeliveryResult> {
  const { toEmail, doctorName } = params;
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
  const dashboardUrl = `${baseUrl}/doctor/dashboard`;

  const subject = 'Your CareBridge Doctor Account Has Been Approved';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; background: #0f172a; border-radius: 16px; color: #f8fafc; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #10b981; margin: 0; font-size: 24px;">Account Approved!</h2>
        <p style="color: #94a3b8; font-size: 13px; margin-top: 4px;">CareBridge Medical Platform</p>
      </div>

      <h3 style="color: #ffffff; font-size: 18px;">Congratulations, Dr. ${doctorName}!</h3>

      <p style="color: #cbd5e1; line-height: 1.6; font-size: 14px;">
        Your CareBridge doctor account application has been reviewed and official approval has been granted. You now have full access to your clinician portal and patient care tools.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${dashboardUrl}" style="background-color: #059669; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 14px; display: inline-block;">
          Go to Doctor Dashboard
        </a>
      </div>

      <p style="color: #64748b; font-size: 12px; line-height: 1.5; border-top: 1px solid #1e293b; padding-top: 16px;">
        If you did not request this account, please contact CareBridge support immediately.
      </p>
    </div>
  `;

  const { transporter, config } = createTransporter();

  if (process.env.EMAIL_MODE === 'development' || !transporter) {
    console.log(`[Doctor Approved SIMULATED] Email to Dr. ${doctorName} (${toEmail})`);
    logEmailDispatch('FEEDBACK_CONFIRM', toEmail, subject, `Approval email for Dr. ${doctorName}`, true);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({ from: config.from, to: toEmail, subject, html });
    logEmailDispatch('FEEDBACK_CONFIRM', toEmail, subject, `Approval email for Dr. ${doctorName}`, true);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'Failed to send approval email.';
    console.error('[Doctor Approval Email Error]:', errorMsg);
    logEmailDispatch('FEEDBACK_CONFIRM', toEmail, subject, `Approval email for Dr. ${doctorName}`, false, errorMsg);
    return { success: false, error: errorMsg };
  }
}

/**
 * 4. Send Doctor Account Rejection Email
 */
export async function sendDoctorRejectionEmail(params: {
  toEmail: string;
  doctorName: string;
  rejectionReason?: string;
}): Promise<MailDeliveryResult> {
  const { toEmail, doctorName, rejectionReason } = params;
  const subject = 'Update Regarding Your CareBridge Doctor Application';

  const reasonHtml = rejectionReason
    ? `<div style="background: #1e1b4b; border: 1px solid #3730a3; padding: 14px; border-radius: 10px; margin: 16px 0; font-size: 13px; color: #c7d2fe;">
        <strong>Reason specified:</strong> ${rejectionReason}
       </div>`
    : '';

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 28px; background: #0f172a; border-radius: 16px; color: #f8fafc; border: 1px solid #1e293b;">
      <h3 style="color: #f43f5e; margin-top: 0;">CareBridge Application Review Update</h3>
      <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">
        Hello Dr. ${doctorName},<br/><br/>
        We have completed the review of your CareBridge doctor application. Unfortunately, your application has not been approved at this time.
      </p>

      ${reasonHtml}

      <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
        If you believe this decision was made in error or if you wish to submit additional credentials, please contact CareBridge support.
      </p>
    </div>
  `;

  const { transporter, config } = createTransporter();

  if (process.env.EMAIL_MODE === 'development' || !transporter) {
    console.log(`[Doctor Rejection SIMULATED] Email to Dr. ${doctorName} (${toEmail})`);
    logEmailDispatch('FEEDBACK_CONFIRM', toEmail, subject, `Rejection email for Dr. ${doctorName}`, true);
    return { success: true, simulated: true };
  }

  try {
    await transporter.sendMail({ from: config.from, to: toEmail, subject, html });
    logEmailDispatch('FEEDBACK_CONFIRM', toEmail, subject, `Rejection email for Dr. ${doctorName}`, true);
    return { success: true };
  } catch (err: any) {
    const errorMsg = err?.message || 'Failed to send rejection email.';
    console.error('[Doctor Rejection Email Error]:', errorMsg);
    logEmailDispatch('FEEDBACK_CONFIRM', toEmail, subject, `Rejection email for Dr. ${doctorName}`, false, errorMsg);
    return { success: false, error: errorMsg };
  }
}

