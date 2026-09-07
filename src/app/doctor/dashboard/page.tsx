'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { safeFetchJson } from '@/lib/fetchHelper';
import { Stethoscope, CheckCircle2, User, Calendar, FileText, Activity, LogOut, ShieldCheck, Award, Clock, DollarSign, AlertCircle } from 'lucide-react';

interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  specialization: string;
  licenseNumber: string;
  emailVerified: boolean;
  adminVerificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  accountStatus: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED' | 'SUSPENDED';
  rejectionReason?: string;
}

export default function DoctorDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [doctor, setDoctor] = useState<DoctorProfile | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDoctorStatus() {
      setLoading(true);
      const res = await safeFetchJson<{
        success: boolean;
        doctor?: DoctorProfile;
        message?: string;
      }>('/api/doctor/status');

      setLoading(false);

      if (res.ok && res.data?.success && res.data.doctor) {
        setDoctor(res.data.doctor);
        // Guard check: If account is not APPROVED and ACTIVE, redirect or block
        if (
          !res.data.doctor.emailVerified ||
          res.data.doctor.adminVerificationStatus !== 'APPROVED' ||
          res.data.doctor.accountStatus !== 'ACTIVE'
        ) {
          setError(
            res.data.doctor.rejectionReason
              ? `Account Notice: ${res.data.doctor.rejectionReason}`
              : 'Your doctor account has not been fully verified and activated by CareBridge Admin.'
          );
        }
      } else {
        setError('Could not verify active doctor session. Please log in.');
      }
    }

    fetchDoctorStatus();
  }, []);

  const handleLogout = async () => {
    // Clear session by calling logout or clearing cookie
    await safeFetchJson('/api/auth/logout', { method: 'POST' });
    router.push('/doctor/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-3">
          <Stethoscope className="w-10 h-10 text-teal-400 animate-pulse mx-auto" />
          <p className="text-sm text-slate-400">Loading Clinician Workspace...</p>
        </div>
      </div>
    );
  }

  if (error || !doctor || doctor.adminVerificationStatus !== 'APPROVED' || doctor.accountStatus !== 'ACTIVE') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
            <AlertCircle className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Access Restricted</h2>
            <p className="text-sm text-slate-300">
              {error || 'Full doctor dashboard access requires an approved and active doctor profile.'}
            </p>
          </div>

          {doctor && (
            <div className="bg-slate-950 p-4 rounded-xl text-left border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500">Email Verified:</span>
                <span className={doctor.emailVerified ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {doctor.emailVerified ? 'VERIFIED' : 'UNVERIFIED'}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500">Admin Review:</span>
                <span className={doctor.adminVerificationStatus === 'APPROVED' ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {doctor.adminVerificationStatus}
                </span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span className="text-slate-500">Account Status:</span>
                <span className={doctor.accountStatus === 'ACTIVE' ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                  {doctor.accountStatus}
                </span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <Link
              href="/doctor/login"
              className="block w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl text-sm transition"
            >
              Return to Doctor Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 text-teal-400 border border-teal-500/30 rounded-xl">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-white text-lg">CareBridge Clinician</span>
              <span className="ml-2 text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-medium">
                Verified Doctor
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-300 font-medium hidden sm:inline">
              Dr. {doctor.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-teal-900/40 via-slate-900 to-slate-900 border border-teal-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" /> Official Verified Practitioner
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Welcome back, Dr. {doctor.name}
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Specialization: <strong className="text-white">{doctor.specialization}</strong> | License:{' '}
              <strong className="text-white">{doctor.licenseNumber}</strong>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-slate-950/80 border border-slate-800 p-3 rounded-xl text-center">
              <div className="text-xs text-slate-400">Account Status</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-4 h-4" /> Active
              </div>
            </div>
          </div>
        </div>

        {/* Clinician Overview Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Today's Appointments</span>
              <Calendar className="w-5 h-5 text-teal-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">8</div>
            <div className="text-xs text-slate-400">3 consultations completed</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Active Patients</span>
              <User className="w-5 h-5 text-teal-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">42</div>
            <div className="text-xs text-slate-400">Across 5 health categories</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Reports Pending Review</span>
              <FileText className="w-5 h-5 text-teal-400" />
            </div>
            <div className="text-2xl font-extrabold text-white">5</div>
            <div className="text-xs text-amber-400">Requires diagnostic review</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold uppercase">Care Metrics</span>
              <Activity className="w-5 h-5 text-teal-400" />
            </div>
            <div className="text-2xl font-extrabold text-emerald-400">98%</div>
            <div className="text-xs text-slate-400">Patient satisfaction rate</div>
          </div>
        </div>

        {/* Recent Schedule & Tools Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-teal-400" /> Upcoming Patient Consultations
            </h2>
            <div className="divide-y divide-slate-800">
              {[
                { name: 'Arthur Pendelton', time: '10:30 AM', reason: 'Hypertension Medication Review', status: 'Confirmed' },
                { name: 'Sarah Miller', time: '11:15 AM', reason: 'Diabetes Blood Glucose Analysis', status: 'Confirmed' },
                { name: 'Robert Chen', time: '02:00 PM', reason: 'Post-Surgery Recovery Checkup', status: 'Scheduled' },
                { name: 'Elena Rostova', time: '03:30 PM', reason: 'Routine Vital Signs Assessment', status: 'Scheduled' },
              ].map((patient, idx) => (
                <div key={idx} className="py-3.5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-white text-sm">{patient.name}</div>
                    <div className="text-xs text-slate-400">{patient.reason}</div>
                  </div>
                  <div className="text-right space-y-0.5">
                    <div className="text-xs font-bold text-teal-300">{patient.time}</div>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                      {patient.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-400" /> Clinician Details
            </h2>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-500">Doctor ID:</span>
                <span className="font-mono text-white">{doctor.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-500">Email:</span>
                <span className="text-white">{doctor.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-500">License:</span>
                <span className="text-teal-300 font-semibold">{doctor.licenseNumber}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-800">
                <span className="text-slate-500">Specialization:</span>
                <span className="text-white font-medium">{doctor.specialization}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Admin Review:</span>
                <span className="text-emerald-400 font-bold">APPROVED</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
