'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { safeFetchJson } from '@/lib/fetchHelper';
import { CheckCircle2, Clock, XCircle, RefreshCw, ArrowRight, ShieldCheck, Mail } from 'lucide-react';

function DoctorVerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'SUCCESS' | 'ALREADY_VERIFIED' | 'EXPIRED' | 'ERROR'>('LOADING' as any);
  const [message, setMessage] = useState('');
  const [doctorInfo, setDoctorInfo] = useState<{ name?: string; email?: string } | null>(null);
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setStatus('ERROR');
      setMessage('No verification token provided in URL link.');
      return;
    }

    async function verifyToken() {
      if (!token) return;
      setLoading(true);
      const res = await safeFetchJson<{
        success: boolean;
        message: string;
        alreadyVerified?: boolean;
        expired?: boolean;
        doctor?: { name?: string; email?: string };
      }>(`/api/doctor/verify-email?token=${encodeURIComponent(token)}`);

      setLoading(false);

      if (res.ok && res.data?.success) {
        if (res.data.alreadyVerified) {
          setStatus('ALREADY_VERIFIED');
        } else {
          setStatus('SUCCESS');
        }
        setMessage(res.data.message);
        if (res.data.doctor) setDoctorInfo(res.data.doctor);
      } else {
        if (res.data?.expired) {
          setStatus('EXPIRED');
        } else {
          setStatus('ERROR');
        }
        setMessage(res.data?.message || res.error || 'Email verification failed.');
        if (res.data?.doctor) setDoctorInfo(res.data.doctor);
      }
    }

    verifyToken();
  }, [token]);

  const handleResend = async () => {
    if (!doctorInfo?.email) return;
    setResending(true);
    setResendMsg('');

    const res = await safeFetchJson<{ success: boolean; message: string }>(
      '/api/doctor/resend-verification',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: doctorInfo.email }),
      }
    );

    setResending(false);
    if (res.ok && res.data?.success) {
      setResendMsg('A new verification email has been dispatched to your inbox.');
    } else {
      setResendMsg(res.data?.message || 'Failed to resend verification email.');
    }
  };

  if (loading) {
    return (
      <div className="text-center space-y-4 py-8">
        <RefreshCw className="w-12 h-12 text-teal-400 animate-spin mx-auto" />
        <h2 className="text-xl font-semibold text-white">Verifying your email...</h2>
        <p className="text-sm text-slate-400">Please wait while we validate your security token.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
      {status === 'SUCCESS' && (
        <>
          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Email Verified!</h2>
            <p className="text-sm text-slate-300">{message}</p>
          </div>
          <div className="bg-slate-800/60 p-4 rounded-xl text-left border border-slate-700/50 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-teal-400 font-semibold">
              <Clock className="w-4 h-4" /> Admin Verification Pending
            </div>
            <p className="text-slate-400">
              CareBridge administrators have been notified. Once your medical license and credentials are reviewed, you will receive an approval email allowing full access to your doctor dashboard.
            </p>
          </div>
        </>
      )}

      {status === 'ALREADY_VERIFIED' && (
        <>
          <div className="w-16 h-16 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center mx-auto border border-teal-500/30">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Already Verified</h2>
            <p className="text-sm text-slate-300">{message}</p>
          </div>
        </>
      )}

      {status === 'EXPIRED' && (
        <>
          <div className="w-16 h-16 bg-amber-500/20 text-amber-400 rounded-full flex items-center justify-center mx-auto border border-amber-500/30">
            <Clock className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Link Expired</h2>
            <p className="text-sm text-slate-300">{message}</p>
          </div>

          {resendMsg && (
            <div className="text-xs p-3 rounded-lg bg-teal-900/30 text-teal-300 border border-teal-700/50">
              {resendMsg}
            </div>
          )}

          {doctorInfo?.email && (
            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm rounded-xl transition disabled:opacity-50"
            >
              {resending ? 'Sending New Link...' : 'Resend Verification Email'}
            </button>
          )}
        </>
      )}

      {status === 'ERROR' && (
        <>
          <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-500/30">
            <XCircle className="w-9 h-9" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Verification Failed</h2>
            <p className="text-sm text-rose-300">{message}</p>
          </div>
        </>
      )}

      <div className="pt-4 border-t border-slate-800 space-y-2">
        <Link
          href="/doctor/login"
          className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm transition"
        >
          Proceed to Doctor Login <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export default function DoctorVerifyEmailPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <Suspense
        fallback={
          <div className="text-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-teal-400" />
            Loading verification page...
          </div>
        }
      >
        <DoctorVerifyEmailContent />
      </Suspense>
    </div>
  );
}
