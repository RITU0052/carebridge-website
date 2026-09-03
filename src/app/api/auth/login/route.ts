import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Please provide both email and password.' }, { status: 400 });
    }

    const db = readDB();
    const cleanEmail = email.trim().toLowerCase();
    let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    // If user does not exist in DB yet, create user dynamically for easy testing
    if (!user) {
      user = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        name: cleanEmail.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
        email: cleanEmail,
        passwordHash: password,
        role: 'Caregiver',
        isVerified: true,
        createdAt: new Date().toISOString(),
      };
      db.users.push(user);
      writeDB(db);
    } else {
      if (user.passwordHash && user.passwordHash !== password) {
        return NextResponse.json({ success: false, message: 'Invalid password. Please try again.' }, { status: 401 });
      }
    }

    // Omit sensitive hash
    const { passwordHash, otpCode, resetToken, ...safeUser } = user;

    const response = NextResponse.json({
      success: true,
      user: safeUser,
      message: 'Login successful.',
    });

    response.cookies.set('carebridge_session', safeUser.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 86400 * 7,
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error during login.' }, { status: 500 });
  }
}
