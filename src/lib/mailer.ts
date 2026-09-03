import nodemailer from 'nodemailer';
import { readDB, writeDB, EmailLogRecord } from './db';

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const SMTP_FROM = process.env.SMTP_FROM || 'CareBridge Health <no-reply@carebridge.org>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'support.carebridge@gmail.com';

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
  wasSent: boolean
) {
  try {
    const db = readDB();
    const log: EmailLogRecord = {
      id: 'eml_' + Math.random().toString(36).substring(2, 9),
      type,
      recipient,
      subject,
      body,
      status: wasSent ? 'SENT' : 'SIMULATED',
      sentAt: new Date().toISOString(),
    };
    db.emailLogs.unshift(log);
    writeDB(db);
  } catch (err) {
    console.error('Error logging email dispatch:', err);
  }
}

export async function sendOtpEmail(recipientEmail: string, otpCode: string, name?: string): Promise<boolean> {
  const subject = `Your CareBridge Verification Code: ${otpCode}`;
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0f766e; margin: 0; font-size: 24px; font-weight: 800;">CareBridge AI Health</h2>
        <p style="color: #64748b; font-size: 13px; margin-top: 4px;">Secure Patient & Caregiver Portal</p>
      </div>
      <div style="background-color: #ffffff; padding: 28px; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <h3 style="color: #0f172a; margin-top: 0;">Hello ${name || 'CareBridge User'},</h3>
        <p style="color: #334155; font-size: 14px; line-height: 1.6;">
          Your 6-digit email login / verification OTP code for CareBridge is:
        </p>
        <div style="text-align: center; margin: 24px 0;">
          <span style="display: inline-block; background-color: #ccfbf1; color: #0f766e; font-size: 32px; font-weight: 900; letter-spacing: 8px; padding: 12px 28px; border-radius: 10px; border: 2px dashed #0d9488;">
            ${otpCode}
          </span>
        </div>
        <p style="color: #64748b; font-size: 13px; line-height: 1.5;">
          This code is valid for <strong>10 minutes</strong>. If you did not request this login code, please ignore this message.
        </p>
      </div>
      <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #94a3b8;">
        © ${new Date().getFullYear()} CareBridge AI Health Portal. Encrypted & HIPAA-compliant design.
      </div>
    </div>
  `;

  const transporter = createTransporter();
  let sentReal = false;
  if (transporter) {
    try {
      await transporter.sendMail({
        from: SMTP_FROM,
        to: recipientEmail,
        subject,
        html,
      });
      sentReal = true;
    } catch (err) {
      console.error('SMTP send failure, falling back to simulated log:', err);
    }
  }
  logEmailDispatch('OTP', recipientEmail, subject, `OTP Code: ${otpCode}`, sentReal);
  return true;
}

export async function sendPasswordResetEmail(recipientEmail: string, resetToken: string, name?: string): Promise<boolean> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(recipientEmail)}`;
  const subject = 'Reset Your CareBridge Password';
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h2 style="color: #0f766e; margin: 0; font-size: 24px; font-weight: 800;">CareBridge AI Health</h2>
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
  let sentReal = false;
  if (transporter) {
    try {
      await transporter.sendMail({ from: SMTP_FROM, to: recipientEmail, subject, html });
      sentReal = true;
    } catch (err) {
      console.error('SMTP send failure:', err);
    }
  }
  logEmailDispatch('PASSWORD_RESET', recipientEmail, subject, `Reset Token: ${resetToken}`, sentReal);
  return true;
}

export async function sendMedicineReminderEmail(
  recipientEmail: string,
  medicineName: string,
  dosage: string,
  time: string,
  name?: string
): Promise<boolean> {
  const subject = `💊 Medicine Alert: Time to take ${medicineName} (${dosage})`;
  const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;">
      <div style="background-color: #0f766e; color: #ffffff; padding: 20px; border-radius: 12px 12px 0 0; text-align: center;">
        <h2 style="margin: 0; font-size: 20px;">CareBridge Scheduled Medicine Alert</h2>
      </div>
      <div style="background-color: #ffffff; padding: 28px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
        <p style="color: #334155; font-size: 15px;">Hello ${name || 'Caregiver / Patient'},</p>
        <div style="background-color: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px; margin: 20px 0; border-radius: 6px;">
          <h4 style="margin: 0 0 8px 0; color: #15803d; font-size: 16px;">${medicineName}</h4>
          <p style="margin: 0; color: #166534; font-size: 14px;">Dosage: <strong>${dosage}</strong></p>
          <p style="margin: 4px 0 0 0; color: #166534; font-size: 14px;">Scheduled Time: <strong>${time}</strong></p>
        </div>
        <p style="color: #64748b; font-size: 13px;">Please verify that this medication was taken and marked in your CareBridge Dashboard.</p>
      </div>
    </div>
  `;

  const transporter = createTransporter();
  let sentReal = false;
  if (transporter) {
    try {
      await transporter.sendMail({ from: SMTP_FROM, to: recipientEmail, subject, html });
      sentReal = true;
    } catch (err) {
      console.error('SMTP send failure:', err);
    }
  }
  logEmailDispatch('MEDICINE_REMINDER', recipientEmail, subject, `Medicine: ${medicineName} @ ${time}`, sentReal);
  return true;
}

export async function sendDailySummaryEmail(
  recipientEmail: string,
  summaryContent: string,
  name?: string
): Promise<boolean> {
  const subject = `☀️ CareBridge Daily Health & Vitals Summary - ${new Date().toLocaleDateString()}`;
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
  let sentReal = false;
  if (transporter) {
    try {
      await transporter.sendMail({ from: SMTP_FROM, to: recipientEmail, subject, html });
      sentReal = true;
    } catch (err) {
      console.error('SMTP send failure:', err);
    }
  }
  logEmailDispatch('DAILY_SUMMARY', recipientEmail, subject, `Daily Summary Dispatch`, sentReal);
  return true;
}

export async function sendFeedbackAlertToAdmin(feedback: {
  name: string;
  email: string;
  category: string;
  rating: number;
  message: string;
}): Promise<boolean> {
  const subject = `📬 New CareBridge Feedback [${feedback.category}] - ${feedback.rating} Stars`;
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #cbd5e1; border-radius: 12px;">
      <h3 style="color: #0f766e; margin-top: 0;">New User Feedback Received</h3>
      <p><strong>From:</strong> ${feedback.name} (&lt;${feedback.email}&gt;)</p>
      <p><strong>Category:</strong> ${feedback.category}</p>
      <p><strong>Rating:</strong> ${'★'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)} (${feedback.rating}/5)</p>
      <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; margin-top: 12px; color: #1e293b;">
        <p style="margin: 0; font-style: italic;">"${feedback.message}"</p>
      </div>
    </div>
  `;

  const transporter = createTransporter();
  let sentReal = false;
  if (transporter) {
    try {
      await transporter.sendMail({ from: SMTP_FROM, to: ADMIN_EMAIL, subject, html });
      sentReal = true;
    } catch (err) {
      console.error('SMTP send failure:', err);
    }
  }
  logEmailDispatch('FEEDBACK_ALERT', ADMIN_EMAIL, subject, `Feedback from ${feedback.email}`, sentReal);
  return true;
}

export async function sendFeedbackUserConfirmation(recipientEmail: string, name: string): Promise<boolean> {
  const subject = 'Thank you for your CareBridge feedback!';
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h3 style="color: #0f766e;">Thank you for reaching out to CareBridge, ${name}!</h3>
      <p style="color: #334155; line-height: 1.6;">
        We have received your feedback. Our medical technology and support team reviews every submission to continuously improve our health platform for patients and caregivers.
      </p>
      <p style="color: #64748b; font-size: 13px;">If you have urgent questions, you can also reach us on WhatsApp at <strong>+91 7042363267</strong>.</p>
    </div>
  `;

  const transporter = createTransporter();
  let sentReal = false;
  if (transporter) {
    try {
      await transporter.sendMail({ from: SMTP_FROM, to: recipientEmail, subject, html });
      sentReal = true;
    } catch (err) {
      console.error('SMTP send failure:', err);
    }
  }
  logEmailDispatch('FEEDBACK_CONFIRM', recipientEmail, subject, `Confirmation to ${recipientEmail}`, sentReal);
  return true;
}
