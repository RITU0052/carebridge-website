import fs from 'fs';
import path from 'path';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'Patient' | 'Caregiver' | 'Doctor' | 'Family Member' | 'Admin';
  isVerified: boolean;
  otpCode?: string | null;
  otpExpiresAt?: string | null;
  resetToken?: string | null;
  resetExpiresAt?: string | null;
  createdAt: string;
}

export interface MedicineRecord {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  notes?: string;
  remindersEnabled: boolean;
  createdAt: string;
}

export interface VitalRecord {
  id: string;
  userId: string;
  sysBP: number;
  diaBP: number;
  heartRate: number;
  bloodSugar?: number;
  weight?: number;
  oxygenLevel?: number;
  notes?: string;
  recordedAt: string;
}

export interface ReportRecord {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  reportSummary: string;
  reportUrl?: string;
  createdAt: string;
}

export interface EmergencyContactRecord {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
  createdAt: string;
}

export interface FeedbackRecord {
  id: string;
  userId?: string;
  name: string;
  email: string;
  rating: number;
  category: string;
  message: string;
  notificationPreference?: 'whatsapp' | 'email' | 'both' | 'unsure';
  whatsappNumber?: string;
  status: 'New' | 'In Progress' | 'Resolved';
  createdAt: string;
}

export interface EmailLogRecord {
  id: string;
  type: 'OTP' | 'PASSWORD_RESET' | 'MEDICINE_REMINDER' | 'DAILY_SUMMARY' | 'FEEDBACK_ALERT' | 'FEEDBACK_CONFIRM';
  recipient: string;
  subject: string;
  body: string;
  status: 'SENT' | 'FAILED' | 'SIMULATED';
  sentAt: string;
}

export interface CaregiverRelationshipRecord {
  id: string;
  patientUserId: string;
  caregiverUserId?: string;
  caregiverName: string;
  caregiverPhone: string; // E.164 format (+91...)
  caregiverEmail?: string;
  relationship: string;
  accessLevel: 'Full Access' | 'Adherence Only' | 'Reports & Vitals Only';
  whatsappAlertsEnabled: boolean;
  emailAlertsEnabled: boolean;
  createdAt: string;
}

export interface UserNotificationPreferences {
  userId: string;
  medicineReminders: boolean;
  caregiverStatusAlerts: boolean;
  dailySummary: boolean;
  emailNotifications: boolean;
  whatsappNotifications: boolean;
  includeMedicineNameInAlerts: boolean;
  timezone: string; // Default 'Asia/Kolkata'
}

export interface NotificationLogRecord {
  id: string;
  userId?: string;
  type:
    | 'otp'
    | 'password_reset'
    | 'feedback_admin_notification'
    | 'feedback_confirmation'
    | 'medicine_taken'
    | 'medicine_skipped'
    | 'medicine_overdue'
    | 'daily_summary';
  recipient: string;
  channel: 'email' | 'whatsapp' | 'in_app' | 'browser_push';
  status: 'SENT' | 'FAILED' | 'NOT_CONFIGURED' | 'SIMULATED';
  failureReason?: string;
  sentAt: string;
}

export interface MedicineAdherenceLogRecord {
  id: string;
  userId: string;
  medicineId: string;
  medicineName: string;
  scheduledTime: string;
  status: 'Taken' | 'Skipped' | 'Missed';
  recordedAt: string;
}

export interface OverdueReminderLogRecord {
  id: string;
  userId: string;
  medicineId: string;
  scheduledDate: string;
  scheduledTime: string;
  sentAt: string;
}

export interface DatabaseSchema {
  users: UserRecord[];
  medicines: MedicineRecord[];
  vitals: VitalRecord[];
  reports: ReportRecord[];
  emergencyContacts: EmergencyContactRecord[];
  feedback: FeedbackRecord[];
  emailLogs: EmailLogRecord[];
  caregiverRelationships: CaregiverRelationshipRecord[];
  notificationPreferences: UserNotificationPreferences[];
  notificationLogs: NotificationLogRecord[];
  adherenceLogs: MedicineAdherenceLogRecord[];
  overdueReminderLogs: OverdueReminderLogRecord[];
}

export function normalizePhoneNumber(phone: string): string {
  if (!phone) return '';
  const digits = phone.replace(/[^\d+]/g, '');
  if (digits.startsWith('+')) {
    return digits;
  }
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.startsWith('91') && digits.length === 12) {
    return `+${digits}`;
  }
  return `+${digits}`;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'carebridge_db.json');

const INITIAL_DB: DatabaseSchema = {
  users: [
    {
      id: 'usr_demo_1',
      name: 'Sarah Jenkins',
      email: 'sarah@example.com',
      passwordHash: 'password123',
      role: 'Caregiver',
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'usr_admin_1',
      name: 'CareBridge Administrator',
      email: 'admin@carebridge.com',
      passwordHash: 'admin123',
      role: 'Admin',
      isVerified: true,
      createdAt: new Date().toISOString(),
    },
  ],
  medicines: [
    {
      id: 'med_1',
      userId: 'usr_demo_1',
      name: 'Metformin 500mg',
      dosage: '1 Tablet',
      frequency: 'Twice Daily',
      times: ['08:00', '20:00'],
      startDate: '2026-01-01',
      notes: 'Take after meals with water',
      remindersEnabled: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'med_2',
      userId: 'usr_demo_1',
      name: 'Lisinopril 10mg',
      dosage: '1 Tablet',
      frequency: 'Once Daily',
      times: ['09:00'],
      startDate: '2026-01-01',
      notes: 'Morning hypertension control',
      remindersEnabled: true,
      createdAt: new Date().toISOString(),
    },
  ],
  vitals: [
    {
      id: 'vit_1',
      userId: 'usr_demo_1',
      sysBP: 124,
      diaBP: 82,
      heartRate: 72,
      bloodSugar: 105,
      oxygenLevel: 98,
      notes: 'Morning routine check',
      recordedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'vit_2',
      userId: 'usr_demo_1',
      sysBP: 128,
      diaBP: 84,
      heartRate: 75,
      bloodSugar: 112,
      oxygenLevel: 97,
      notes: 'Post lunch resting check',
      recordedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    },
  ],
  reports: [
    {
      id: 'rep_1',
      userId: 'usr_demo_1',
      fileName: 'Blood_Panel_Jan_2026.pdf',
      fileType: 'pdf',
      reportSummary: 'Comprehensive Metabolic Panel: Normal HbA1c (5.8%), Lipid panel balanced. Recommended quarterly follow-up.',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    },
  ],
  emergencyContacts: [
    {
      id: 'emg_1',
      userId: 'usr_demo_1',
      name: 'Dr. Robert Vance',
      relationship: 'Primary Physician',
      phone: '+1 (555) 234-5678',
      email: 'dr.vance@carebridge.org',
      isPrimary: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'emg_2',
      userId: 'usr_demo_1',
      name: 'David Jenkins',
      relationship: 'Son / Secondary Caregiver',
      phone: '+919876543210',
      email: 'david.j@example.com',
      isPrimary: false,
      createdAt: new Date().toISOString(),
    },
  ],
  feedback: [
    {
      id: 'fb_1',
      userId: 'usr_demo_1',
      name: 'Sarah Jenkins',
      email: 'sarah@example.com',
      rating: 5,
      category: 'General',
      message: 'CareBridge medicine reminders have made caring for my elderly mother so much easier!',
      status: 'New',
      createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    },
  ],
  emailLogs: [],
  caregiverRelationships: [
    {
      id: 'rel_1',
      patientUserId: 'usr_demo_1',
      caregiverName: 'David Jenkins',
      caregiverPhone: '+919876543210',
      caregiverEmail: 'david.j@example.com',
      relationship: 'Son / Caregiver',
      accessLevel: 'Full Access',
      whatsappAlertsEnabled: true,
      emailAlertsEnabled: true,
      createdAt: new Date().toISOString(),
    },
  ],
  notificationPreferences: [
    {
      userId: 'usr_demo_1',
      medicineReminders: true,
      caregiverStatusAlerts: true,
      dailySummary: true,
      emailNotifications: true,
      whatsappNotifications: true,
      includeMedicineNameInAlerts: true,
      timezone: 'Asia/Kolkata',
    },
  ],
  notificationLogs: [],
  adherenceLogs: [],
  overdueReminderLogs: [],
};

function ensureDBFileExists(): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
    }
  } catch (err) {
    console.error('Error initializing database file:', err);
  }
}

export function readDB(): DatabaseSchema {
  ensureDBFileExists();
  try {
    const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(fileContent) as Partial<DatabaseSchema>;
    return {
      users: parsed.users || [],
      medicines: parsed.medicines || [],
      vitals: parsed.vitals || [],
      reports: parsed.reports || [],
      emergencyContacts: parsed.emergencyContacts || [],
      feedback: parsed.feedback || [],
      emailLogs: parsed.emailLogs || [],
      caregiverRelationships: parsed.caregiverRelationships || [],
      notificationPreferences: parsed.notificationPreferences || [],
      notificationLogs: parsed.notificationLogs || [],
      adherenceLogs: parsed.adherenceLogs || [],
      overdueReminderLogs: parsed.overdueReminderLogs || [],
    };
  } catch (err) {
    console.error('Error reading database file, returning initial database:', err);
    return INITIAL_DB;
  }
}

export function writeDB(dbData: DatabaseSchema): boolean {
  ensureDBFileExists();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}
