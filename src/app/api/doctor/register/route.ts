import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { readDB, writeDB, UserRecord, DoctorRecord } from '@/lib/db';
import { hashPassword } from '@/lib/passwords';
import { sendDoctorVerificationEmail } from '@/lib/mailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      password,
      phone,
      specialization,
      licenseNumber,
      experienceYears,
      consultationFee,
    } = body;

    if (!name || !email || !password || !phone || !specialization || !licenseNumber) {
      return NextResponse.json(
        { success: false, message: 'Please fill in all required fields.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const db = readDB();

    // Check if email is already registered
    const existingUser = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists.' },
        { status: 400 }
      );
    }

    if (!db.doctors) db.doctors = [];
    const existingDoc = db.doctors.find((d) => d.email.toLowerCase() === cleanEmail);
    if (existingDoc) {
      return NextResponse.json(
        { success: false, message: 'A doctor profile with this email already exists.' },
        { status: 400 }
      );
    }

    // Hash password & generate email verification token
    const passwordHash = await hashPassword(password);
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // 30 minutes

    const userId = 'usr_doc_' + Math.random().toString(36).substring(2, 9);
    const doctorId = 'doc_' + Math.random().toString(36).substring(2, 9);
    const now = new Date().toISOString();

    const newUser: UserRecord = {
      id: userId,
      name: name.trim(),
      email: cleanEmail,
      passwordHash,
      role: 'Doctor',
      isVerified: false,
      status: 'Inactive',
      createdAt: now,
    };

    const newDoctor: DoctorRecord = {
      id: doctorId,
      userId,
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      specialization: specialization.trim(),
      licenseNumber: licenseNumber.trim(),
      experienceYears: Number(experienceYears) || 0,
      consultationFee: Number(consultationFee) || 0,
      verificationStatus: 'Pending',
      emailVerified: false,
      emailVerificationTokenHash: tokenHash,
      emailVerificationTokenExpiresAt: expiresAt,
      adminVerificationStatus: 'PENDING',
      accountStatus: 'PENDING',
      createdAt: now,
    };

    db.users.push(newUser);
    db.doctors.push(newDoctor);
    writeDB(db);

    // Send verification email
    const emailResult = await sendDoctorVerificationEmail({
      toEmail: cleanEmail,
      doctorName: name.trim(),
      rawToken,
    });

    return NextResponse.json({
      success: true,
      message: 'Doctor registration submitted. Please check your email for the verification link.',
      doctorId,
      emailDelivery: emailResult,
    });
  } catch (err: any) {
    console.error('Doctor registration error:', err);
    return NextResponse.json(
      { success: false, message: 'An internal error occurred during doctor registration.' },
      { status: 500 }
    );
  }
}
