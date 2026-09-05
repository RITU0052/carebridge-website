import { NextRequest, NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { verifyPassword, hashPassword } from '@/lib/passwords';
import { checkRateLimit } from '@/lib/rateLimit';

export async function POST(req: NextRequest) {
  try {
    const rateCheck = checkRateLimit(req, 'login', 10, 60 * 1000);
    if (!rateCheck.allowed && rateCheck.response) return rateCheck.response;

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Please provide both email and password.' }, { status: 400 });
    }

    const db = readDB();
    const cleanEmail = email.trim().toLowerCase();
    let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          code: 'USER_NOT_FOUND',
          message: 'No account found with this email. Please create an account first.',
        },
        { status: 401 }
      );
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Incorrect email or password.' }, { status: 401 });
    }

    // Omit sensitive hashes and tokens
    const { passwordHash: _ph, otpCode: _oc, resetToken: _rt, ...safeUser } = user;

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
