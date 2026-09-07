import fs from 'fs';
import path from 'path';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'Patient' | 'Caregiver' | 'Doctor' | 'Family Member' | 'Admin' | 'SUPER_ADMIN' | 'SUPPORT_ADMIN' | 'DOCTOR_ADMIN' | 'CONTENT_ADMIN' | 'ANALYST';
  isVerified: boolean;
  status?: 'Active' | 'Inactive' | 'Suspended' | 'Deleted';
  isDeleted?: boolean;
  lastLoginAt?: string;
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
  caregiverPhone: string;
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
  timezone: string;
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

export interface PendingSignupRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'Patient' | 'Caregiver' | 'Doctor' | 'Family Member' | 'Admin';
  otpCode: string;
  otpExpiresAt: string;
  attempts?: number;
  createdAt: string;
}

export interface DoctorRecord {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  experienceYears: number;
  consultationFee: number;
  verificationStatus: 'Pending' | 'Verified' | 'Rejected' | 'PENDING' | 'APPROVED';
  emailVerified: boolean;
  emailVerifiedAt?: string;
  emailVerificationTokenHash?: string;
  emailVerificationTokenExpiresAt?: string;
  emailVerificationTokenUsedAt?: string;
  adminVerificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  adminVerifiedAt?: string;
  adminVerifiedBy?: string;
  rejectionReason?: string;
  accountStatus: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED' | 'SUSPENDED';
  createdAt: string;
}

export interface BroadcastNotificationRecord {
  id: string;
  title: string;
  message: string;
  targetAudience: 'All Users' | 'Patients' | 'Caregivers' | 'Doctors' | 'Specific';
  targetUserIds?: string[];
  status: 'Draft' | 'Scheduled' | 'Sent' | 'Failed';
  scheduledAt?: string;
  sentAt?: string;
  createdBy: string;
  createdAt: string;
}

export interface SecurityLogRecord {
  id: string;
  adminId: string;
  adminEmail: string;
  action: string;
  targetResource: string;
  details?: string;
  ipAddress: string;
  status: 'Success' | 'Warning' | 'Failed';
  timestamp: string;
}

export interface LoginAttemptRecord {
  id: string;
  identifier: string;
  ipAddress: string;
  success: boolean;
  failureReason?: string;
  timestamp: string;
}

export interface ContentPostRecord {
  id: string;
  type: 'Blog' | 'Announcement' | 'StaticPage';
  title: string;
  slug: string;
  summary: string;
  content: string;
  category?: string;
  author: string;
  status: 'Published' | 'Draft' | 'Archived';
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FAQRecord {
  id: string;
  question: string;
  answer: string;
  category: string;
  orderIndex: number;
  isPublished: boolean;
  createdAt: string;
}

export interface AIRequestRecord {
  id: string;
  feature: 'Health Summary' | 'Report Analysis' | 'Medicine Helper' | 'Symptom Assistant';
  userId?: string;
  status: 'Completed' | 'Failed' | 'Processing';
  durationMs: number;
  errorDetails?: string;
  timestamp: string;
}

export interface PlatformSettingsRecord {
  maintenanceMode: boolean;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  twoFactorRequired: boolean;
  dataRetentionDays: number;
  emailAlertsEnabled: boolean;
  whatsappAlertsEnabled: boolean;
  updatedAt: string;
  updatedBy: string;
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
  status: 'New' | 'In Progress' | 'Resolved' | 'Closed';
  priority?: 'Low' | 'Medium' | 'High' | 'Critical';
  internalNotes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface DatabaseSchema {
  users: UserRecord[];
  pendingSignups?: PendingSignupRecord[];
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
  doctors?: DoctorRecord[];
  notifications?: BroadcastNotificationRecord[];
  securityLogs?: SecurityLogRecord[];
  loginAttempts?: LoginAttemptRecord[];
  contentPosts?: ContentPostRecord[];
  faqs?: FAQRecord[];
  aiRequests?: AIRequestRecord[];
  platformSettings?: PlatformSettingsRecord;
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

const PRIMARY_DATA_DIR = path.join(process.cwd(), 'data');
const PRIMARY_DB_FILE = path.join(PRIMARY_DATA_DIR, 'carebridge_db.json');
const TMP_DB_FILE = path.join('/tmp', 'carebridge_db.json');
const IS_SERVERLESS = Boolean(process.env.VERCEL || process.env.NEXT_RUNTIME || process.env.AWS_LAMBDA_FUNCTION_NAME);

let cachedDbMemory: DatabaseSchema | null = null;

function getDbFilePath(): string {
  if (IS_SERVERLESS) {
    return TMP_DB_FILE;
  }
  return PRIMARY_DB_FILE;
}

function ensureDBFileExists(): string {
  const targetFile = getDbFilePath();
  try {
    if (fs.existsSync(targetFile)) {
      return targetFile;
    }

    let seedData: DatabaseSchema = INITIAL_DB;
    if (fs.existsSync(PRIMARY_DB_FILE)) {
      try {
        const raw = fs.readFileSync(PRIMARY_DB_FILE, 'utf-8');
        seedData = JSON.parse(raw);
      } catch {
        seedData = INITIAL_DB;
      }
    }

    const dir = path.dirname(targetFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(targetFile, JSON.stringify(seedData, null, 2), 'utf-8');
    return targetFile;
  } catch (err) {
    console.warn(`[DB] Warning initializing DB file at ${targetFile}:`, err);
    if (targetFile !== TMP_DB_FILE) {
      try {
        if (!fs.existsSync(TMP_DB_FILE)) {
          fs.writeFileSync(TMP_DB_FILE, JSON.stringify(INITIAL_DB, null, 2), 'utf-8');
        }
        return TMP_DB_FILE;
      } catch (fallbackErr) {
        console.error('[DB] Error initializing fallback /tmp DB file:', fallbackErr);
      }
    }
    return targetFile;
  }
}

export function readDB(): DatabaseSchema {
  if (cachedDbMemory) {
    return cachedDbMemory;
  }

  const dbFile = ensureDBFileExists();
  try {
    let fileContent = '';
    if (fs.existsSync(dbFile)) {
      fileContent = fs.readFileSync(dbFile, 'utf-8');
    } else if (fs.existsSync(PRIMARY_DB_FILE)) {
      fileContent = fs.readFileSync(PRIMARY_DB_FILE, 'utf-8');
    }

    if (fileContent) {
      const parsed = JSON.parse(fileContent) as Partial<DatabaseSchema>;
      cachedDbMemory = {
        users: parsed.users || [],
        pendingSignups: parsed.pendingSignups || [],
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
        doctors: (parsed.doctors || [
          {
            id: 'doc_1',
            name: 'Dr. Robert Vance',
            email: 'dr.vance@carebridge.org',
            phone: '+15552345678',
            specialization: 'Geriatric Cardiology',
            licenseNumber: 'MD-98421-NY',
            experienceYears: 18,
            consultationFee: 150,
            verificationStatus: 'Verified',
            emailVerified: true,
            emailVerifiedAt: new Date(Date.now() - 3600000 * 24 * 60).toISOString(),
            adminVerificationStatus: 'APPROVED',
            accountStatus: 'ACTIVE',
            createdAt: new Date(Date.now() - 3600000 * 24 * 60).toISOString(),
          },
          {
            id: 'doc_2',
            name: 'Dr. Ananya Sharma',
            email: 'dr.ananya@carebridge.org',
            phone: '+919876500112',
            specialization: 'General Medicine & Neurology',
            licenseNumber: 'MCI-2018-7721',
            experienceYears: 9,
            consultationFee: 80,
            verificationStatus: 'Pending',
            emailVerified: true,
            emailVerifiedAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
            adminVerificationStatus: 'PENDING',
            accountStatus: 'PENDING',
            createdAt: new Date(Date.now() - 3600000 * 24 * 5).toISOString(),
          },
        ]).map((d: any) => ({
          ...d,
          emailVerified: d.emailVerified ?? (d.verificationStatus === 'Verified' || d.adminVerificationStatus === 'APPROVED'),
          adminVerificationStatus: d.adminVerificationStatus || (d.verificationStatus === 'Verified' ? 'APPROVED' : 'PENDING'),
          accountStatus: d.accountStatus || (d.verificationStatus === 'Verified' ? 'ACTIVE' : 'PENDING'),
        })),
        notifications: parsed.notifications || [
          {
            id: 'notif_1',
            title: 'System Maintenance Notice',
            message: 'Scheduled database optimization will occur on Sunday at 2:00 AM UTC.',
            targetAudience: 'All Users',
            status: 'Sent',
            sentAt: new Date(Date.now() - 3600000 * 12).toISOString(),
            createdBy: 'admin@carebridge.com',
            createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          },
        ],
        securityLogs: parsed.securityLogs || [
          {
            id: 'sec_log_1',
            adminId: 'usr_admin_1',
            adminEmail: 'admin@carebridge.com',
            action: 'ADMIN_LOGIN_SUCCESS',
            targetResource: '/admin/login',
            details: 'Admin authenticated successfully via session cookie',
            ipAddress: '127.0.0.1',
            status: 'Success',
            timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
          },
        ],
        loginAttempts: parsed.loginAttempts || [],
        contentPosts: parsed.contentPosts || [
          {
            id: 'post_1',
            type: 'Blog',
            title: '5 Crucial Tips for Caregivers Managing Elder Diabetes',
            slug: '5-tips-caregivers-elder-diabetes',
            summary: 'Learn practical daily strategies to streamline blood sugar monitoring and diet compliance.',
            content: 'Managing diabetes for elderly family members requires routine, empathy, and early symptom detection...',
            category: 'Caregiver Tips',
            author: 'CareBridge Medical Team',
            status: 'Published',
            publishedAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
            createdAt: new Date(Date.now() - 3600000 * 24 * 12).toISOString(),
            updatedAt: new Date(Date.now() - 3600000 * 24 * 10).toISOString(),
          },
        ],
        faqs: parsed.faqs || [
          {
            id: 'faq_1',
            question: 'How do medicine reminders reach caregivers?',
            answer: 'CareBridge dispatches instant alerts via Email, WhatsApp, and browser push notifications whenever a dose is marked as missed or overdue.',
            category: 'Reminders & Notifications',
            orderIndex: 1,
            isPublished: true,
            createdAt: new Date().toISOString(),
          },
          {
            id: 'faq_2',
            question: 'Is my medical report data secure?',
            answer: 'Yes! All medical records uploaded to CareBridge are encrypted in transit and at rest with strict role-based access rules.',
            category: 'Security & Privacy',
            orderIndex: 2,
            isPublished: true,
            createdAt: new Date().toISOString(),
          },
        ],
        aiRequests: parsed.aiRequests || [
          {
            id: 'ai_req_1',
            feature: 'Report Analysis',
            userId: 'usr_demo_1',
            status: 'Completed',
            durationMs: 1420,
            timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          },
          {
            id: 'ai_req_2',
            feature: 'Health Summary',
            userId: 'usr_demo_1',
            status: 'Completed',
            durationMs: 980,
            timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          },
        ],
        platformSettings: parsed.platformSettings || {
          maintenanceMode: false,
          sessionTimeoutMinutes: 60,
          maxLoginAttempts: 5,
          twoFactorRequired: false,
          dataRetentionDays: 365,
          emailAlertsEnabled: true,
          whatsappAlertsEnabled: true,
          updatedAt: new Date().toISOString(),
          updatedBy: 'admin@carebridge.com',
        },
      };
      return cachedDbMemory;
    }
  } catch (err) {
    console.error('[DB] Error reading database file, returning initial database:', err);
  }

  cachedDbMemory = { ...INITIAL_DB };
  return cachedDbMemory;
}

export function writeDB(dbData: DatabaseSchema): boolean {
  cachedDbMemory = dbData;
  const dbFile = ensureDBFileExists();
  try {
    fs.writeFileSync(dbFile, JSON.stringify(dbData, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.warn(`[DB] Could not write to ${dbFile}, trying /tmp fallback:`, err);
    try {
      fs.writeFileSync(TMP_DB_FILE, JSON.stringify(dbData, null, 2), 'utf-8');
      return true;
    } catch (tmpErr) {
      console.error('[DB] Error writing DB to /tmp:', tmpErr);
      return false;
    }
  }
}
