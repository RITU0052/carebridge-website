import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { readDB, writeDB, UserRecord, SecurityLogRecord, LoginAttemptRecord } from './db';

const ADMIN_ROLES = [
  'Admin',
  'SUPER_ADMIN',
  'SUPPORT_ADMIN',
  'DOCTOR_ADMIN',
  'CONTENT_ADMIN',
  'ANALYST',
];

/**
 * Hash password securely using SHA-256 with optional salt.
 */
export function hashPassword(password: string, salt: string = 'carebridge_salt'): string {
  return crypto.createHmac('sha256', salt).update(password).digest('hex');
}

/**
 * Server-side authentication check.
 * Resolves the authenticated user from the carebridge_session or carebridge_admin_session cookie.
 */
export function getAuthenticatedUser(req: NextRequest): UserRecord | null {
  try {
    const sessionUserId =
      req.cookies.get('carebridge_admin_session')?.value ||
      req.cookies.get('carebridge_session')?.value;
    if (!sessionUserId) {
      return null;
    }

    const db = readDB();

    // Check if session ID matches an environment variable defined admin user or standard db user
    if (sessionUserId === 'usr_admin_1') {
      const dbAdmin = db.users.find((u) => u.id === 'usr_admin_1');
      if (dbAdmin) return dbAdmin;

      return {
        id: 'usr_admin_1',
        name: 'CareBridge Administrator',
        email: process.env.ADMIN_USERNAME || 'admin@carebridge.com',
        passwordHash: '',
        role: 'SUPER_ADMIN',
        isVerified: true,
        status: 'Active',
        createdAt: new Date().toISOString(),
      };
    }

    const user = db.users.find((u) => u.id === sessionUserId);
    if (!user || user.status === 'Suspended' || user.isDeleted) {
      return null;
    }

    return user;
  } catch (err) {
    console.error('Error resolving authenticated user from session cookie:', err);
    return null;
  }
}

/**
 * Server-side admin privilege verification.
 * Resolves the user from session cookie and verifies role is an Admin role.
 */
export function getAuthenticatedAdmin(req: NextRequest): UserRecord | null {
  const user = getAuthenticatedUser(req);
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return null;
  }
  return user;
}

/**
 * Check permission for specific admin roles.
 */
export function checkAdminPermission(
  user: UserRecord | null,
  requiredRole?: string
): boolean {
  if (!user || !ADMIN_ROLES.includes(user.role)) {
    return false;
  }
  if (user.role === 'SUPER_ADMIN' || user.role === 'Admin') {
    return true; // Super admins & generic Admins have full permissions
  }
  if (requiredRole && user.role !== requiredRole) {
    return false;
  }
  return true;
}

/**
 * Record an admin security audit log in the database.
 */
export function recordSecurityLog(
  adminId: string,
  adminEmail: string,
  action: string,
  targetResource: string,
  details: string = '',
  ipAddress: string = '127.0.0.1',
  status: 'Success' | 'Warning' | 'Failed' = 'Success'
): void {
  try {
    const db = readDB();
    const newLog: SecurityLogRecord = {
      id: `sec_log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      adminId,
      adminEmail,
      action,
      targetResource,
      details,
      ipAddress,
      status,
      timestamp: new Date().toISOString(),
    };

    const logs = db.securityLogs || [];
    db.securityLogs = [newLog, ...logs];
    writeDB(db);
  } catch (err) {
    console.error('Failed to record security log:', err);
  }
}

/**
 * Record a login attempt for rate-limiting and audit monitoring.
 */
export function recordLoginAttempt(
  identifier: string,
  ipAddress: string,
  success: boolean,
  failureReason?: string
): void {
  try {
    const db = readDB();
    const newAttempt: LoginAttemptRecord = {
      id: `attempt_${Date.now()}`,
      identifier,
      ipAddress,
      success,
      failureReason,
      timestamp: new Date().toISOString(),
    };

    const attempts = db.loginAttempts || [];
    db.loginAttempts = [newAttempt, ...attempts];
    writeDB(db);
  } catch (err) {
    console.error('Failed to record login attempt:', err);
  }
}

/**
 * Check if identifier/IP is temporarily rate-limited due to brute-force attempts.
 */
export function isRateLimited(identifier: string, ipAddress: string): boolean {
  try {
    const db = readDB();
    const maxAttempts = db.platformSettings?.maxLoginAttempts || 5;
    const windowMs = 15 * 60 * 1000; // 15 minutes window
    const now = Date.now();

    const recentFailed = (db.loginAttempts || []).filter(
      (a) =>
        !a.success &&
        (a.identifier.toLowerCase() === identifier.toLowerCase() || a.ipAddress === ipAddress) &&
        now - new Date(a.timestamp).getTime() < windowMs
    );

    return recentFailed.length >= maxAttempts;
  } catch {
    return false;
  }
}
