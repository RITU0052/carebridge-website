import { NextRequest } from 'next/server';
import { readDB, UserRecord } from './db';

/**
 * Server-side authentication check.
 * Resolves the authenticated user exclusively from the HTTP-only carebridge_session cookie.
 * Never trusts user IDs passed in query strings or request bodies.
 */
export function getAuthenticatedUser(req: NextRequest): UserRecord | null {
  try {
    const sessionUserId = req.cookies.get('carebridge_session')?.value;
    if (!sessionUserId) {
      return null;
    }

    const db = readDB();
    const user = db.users.find((u) => u.id === sessionUserId);
    if (!user) {
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
 * Resolves the user from session cookie and verifies role === 'Admin'.
 */
export function getAuthenticatedAdmin(req: NextRequest): UserRecord | null {
  const user = getAuthenticatedUser(req);
  if (!user || user.role !== 'Admin') {
    return null;
  }
  return user;
}
