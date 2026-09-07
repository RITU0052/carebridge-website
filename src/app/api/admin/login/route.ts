import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import {
  hashPassword,
  recordSecurityLog,
  recordLoginAttempt,
  isRateLimited,
} from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    const clientIp = req.headers.get('x-forwarded-for') || '127.0.0.1';

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email/Username and password are required.' },
        { status: 400 }
      );
    }

    // Rate-limiting check against brute-force attacks
    if (isRateLimited(email, clientIp)) {
      recordSecurityLog(
        'ANONYMOUS',
        email,
        'ADMIN_LOGIN_RATE_LIMITED',
        '/api/admin/login',
        `Too many failed attempts from IP: ${clientIp}`,
        clientIp,
        'Warning'
      );
      return NextResponse.json(
        {
          success: false,
          error: 'Too many failed login attempts. Please try again after 15 minutes.',
        },
        { status: 429 }
      );
    }

    // 1. Check environment variables if configured
    const envAdminUser = process.env.ADMIN_USERNAME || 'admin@carebridge.com';
    const envAdminPassHash = process.env.ADMIN_PASSWORD_HASH;
    const envAdminPassRaw = process.env.ADMIN_PASSWORD || 'admin123';

    let isAuthenticated = false;
    let authenticatedUser: any = null;

    if (
      email.toLowerCase() === envAdminUser.toLowerCase() ||
      email === 'admin@carebridge.com'
    ) {
      if (envAdminPassHash) {
        isAuthenticated = hashPassword(password) === envAdminPassHash;
      } else {
        isAuthenticated = password === envAdminPassRaw;
      }

      if (isAuthenticated) {
        authenticatedUser = {
          id: 'usr_admin_1',
          name: 'CareBridge Administrator',
          email: envAdminUser,
          role: 'SUPER_ADMIN',
          isVerified: true,
        };
      }
    }

    // 2. Fallback to database user check if env check didn't match
    if (!isAuthenticated) {
      const db = readDB();
      const user = db.users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          ['Admin', 'SUPER_ADMIN', 'SUPPORT_ADMIN', 'DOCTOR_ADMIN', 'CONTENT_ADMIN', 'ANALYST'].includes(u.role)
      );

      if (user) {
        const inputHash = hashPassword(password);
        if (user.passwordHash === password || user.passwordHash === inputHash) {
          isAuthenticated = true;
          authenticatedUser = user;
        }
      }
    }

    if (!isAuthenticated) {
      recordLoginAttempt(email, clientIp, false, 'Invalid credentials');
      recordSecurityLog(
        'ANONYMOUS',
        email,
        'ADMIN_LOGIN_FAILED',
        '/api/admin/login',
        'Invalid admin password attempt',
        clientIp,
        'Failed'
      );
      return NextResponse.json(
        { success: false, error: 'Invalid admin email or password.' },
        { status: 401 }
      );
    }

    // Log successful login
    recordLoginAttempt(email, clientIp, true);
    recordSecurityLog(
      authenticatedUser.id,
      authenticatedUser.email,
      'ADMIN_LOGIN_SUCCESS',
      '/api/admin/login',
      `Authenticated with role ${authenticatedUser.role}`,
      clientIp,
      'Success'
    );

    // Update user lastLoginAt in DB if exists
    const db = readDB();
    const dbUserIdx = db.users.findIndex((u) => u.id === authenticatedUser.id);
    if (dbUserIdx !== -1) {
      db.users[dbUserIdx].lastLoginAt = new Date().toISOString();
      writeDB(db);
    }

    const response = NextResponse.json({
      success: true,
      user: {
        id: authenticatedUser.id,
        name: authenticatedUser.name,
        email: authenticatedUser.email,
        role: authenticatedUser.role,
      },
    });

    // Set secure HTTP-only cookies
    response.cookies.set('carebridge_admin_session', authenticatedUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8, // 8 hours session
    });

    response.cookies.set('carebridge_session', authenticatedUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (err: any) {
    console.error('Admin login API error:', err);
    return NextResponse.json(
      { success: false, error: 'An unexpected server error occurred during login.' },
      { status: 500 }
    );
  }
}
