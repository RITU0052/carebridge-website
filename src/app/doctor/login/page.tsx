'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { safeFetchJson } from '@/lib/fetchHelper';
import { Stethoscope, Mail, Lock, AlertCircle, CheckCircle2, Clock, XCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export default function DoctorLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | undefined>();
  const [resending, setResending] = useState(false);
  const [resendSuccessMsg, setResendSuccessMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setErrorCode(null);
    setRejectionReason(undefined);
    setResendSuccessMsg('');

    const res = await safeFetchJson<{
      success: boolean;
      message: string;
      code?: string;
      rejectionReason?: string;
      email?: string;
    }>('/api/doctor/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (res.ok && res.data?.success) {
      router.push('/doctor/dashboard');
    } else {
      setErrorMsg(res.data?.message || res.error || 'Login failed.');
      if (res.data?.code) setErrorCode(res.data.code);
      if (res.data?.rejectionReason) setRejectionReason(res.data.rejectionReason);
    }
  };

  const handleResendVerification = async () => {
    if (!email) return;
    setResending(true);
    setResendSuccessMsg('');

    const res = await safeFetchJson<{ success: boolean; message: string }>(
      '/api/doctor/resend-verification',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }
    );

    setResending(false);
    if (res.ok && res.data?.success) {
      setResendSuccessMsg('A new verification email link has been sent to your inbox.');
    } else {
      setErrorMsg(res.data?.message || 'Failed to resend verification link.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 bg-teal-500/10 border border-teal-500/30 rounded-2xl text-teal-400 mb-2">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Doctor Portal Sign In
        </h1>
        <p className="text-slate-400 text-sm">
          Access your CareBridge clinician workspace & patient management.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-8 rounded-2xl shadow-2xl space-y-6">

          {/* Status Specific Alerts */}
          {errorCode === 'EMAIL_NOT_VERIFIED' && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-3 text-amber-200 text-sm">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold mb-1">Email Verification Required</strong>
                  {errorMsg}
                </div>
              </div>
              {resendSuccessMsg ? (
                <div className="text-xs p-2.5 rounded-lg bg-amber-950/60 text-amber-300 border border-amber-800/50">
                  {resendSuccessMsg}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resending}
                  className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs rounded-lg transition disabled:opacity-50"
                >
                  {resending ? 'Resending Link...' : 'Resend Email Verification Link'}
                </button>
              )}
            </div>
          )}

          {errorCode === 'ADMIN_VERIFICATION_PENDING' && (
            <div className="bg-sky-500/10 border border-sky-500/30 rounded-xl p-4 space-y-2 text-sky-200 text-sm">
              <div className="flex items-start gap-2.5">
                <Clock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold mb-1">Admin Verification Pending</strong>
                  {errorMsg}
                </div>
              </div>
            </div>
          )}

          {errorCode === 'APPLICATION_REJECTED' && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 space-y-2 text-rose-200 text-sm">
              <div className="flex items-start gap-2.5">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold mb-1">Application Not Approved</strong>
                  {errorMsg}
                  {rejectionReason && (
                    <div className="mt-2 text-xs p-2.5 rounded-lg bg-rose-950/60 border border-rose-800/50 text-rose-300">
                      <strong>Feedback from Admin:</strong> {rejectionReason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {errorCode === 'ACCOUNT_SUSPENDED' && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 space-y-2 text-rose-200 text-sm">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-white font-semibold mb-1">Account Suspended</strong>
                  {errorMsg}
                </div>
              </div>
            </div>
          )}

          {!errorCode && errorMsg && (
            <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-3.5 rounded-xl text-sm">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Doctor Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="doctor@hospital.org"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm transition placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm transition placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2 transition disabled:opacity-50 text-sm"
            >
              {loading ? (
                'Authenticating...'
              ) : (
                <>
                  Sign In to Dashboard <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 text-center border-t border-slate-800 space-y-2">
            <p className="text-xs text-slate-400">
              New Doctor?{' '}
              <Link href="/doctor/register" className="text-teal-400 hover:underline font-semibold">
                Apply for Doctor Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
