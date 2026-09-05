'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const { user, verifyEmail, sendOtp } = useAuth();
  const router = useRouter();

  const activeEmail = emailParam || user?.email || '';

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code || code.length < 6) {
      setError('Please enter your 6-digit verification code.');
      return;
    }

    if (!activeEmail) {
      setError('Missing email address context. Please register on the Sign Up page first.');
      return;
    }

    setLoading(true);
    const result = await verifyEmail(code, activeEmail);
    setLoading(false);

    if (result.success) {
      setVerifiedSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } else {
      setError(result.message || 'Verification failed. Please check your code and try again.');
    }
  };

  const handleResend = async () => {
    if (!activeEmail) {
      setError('No email address found to resend verification code.');
      return;
    }
    setError('');
    const res = await sendOtp(activeEmail, 'signup');
    if (res.success) {
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } else {
      setError(res.message || 'Unable to resend verification code.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Breadcrumbs items={[{ label: 'Sign Up', href: '/signup' }, { label: 'Verify Email', href: '/verify-email' }]} />

        <div className="flex justify-center mb-6">
          <Link href="/" className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200 inline-block">
            <Image
              src="/logo.png"
              alt="CareBridge AI Logo"
              width={180}
              height={50}
              className="object-contain max-h-12 w-auto"
            />
          </Link>
        </div>

        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 mx-auto flex items-center justify-center mb-3">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Verify Your Email Address
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600 max-w-sm mx-auto">
            We sent a security verification code to{' '}
            <span className="font-bold text-slate-900">{activeEmail || 'your email address'}</span>.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200/80 sm:px-10">
          {verifiedSuccess ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Email Verified!</h2>
              <p className="text-sm text-slate-600">Your CareBridge account is now active and secure. Redirecting to your dashboard...</p>
              <Link
                href="/dashboard"
                className="w-full inline-flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-base font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {resent && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 text-emerald-800 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Verification code resent! Please check your inbox.</span>
                </div>
              )}

              <form className="space-y-6" onSubmit={handleVerify} noValidate>
                <div>
                  <label htmlFor="code" className="block text-xs font-bold uppercase tracking-wider text-slate-700 text-center mb-2">
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="123456"
                    className="block w-full text-center text-2xl font-mono tracking-widest py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:bg-white focus:border-teal-600 transition-all"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all disabled:opacity-60"
                  >
                    {loading ? (
                      <span>Verifying Code...</span>
                    ) : (
                      <>
                        <span>Complete Verification</span>
                        <ShieldCheck className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center space-y-3">
                <button
                  onClick={handleResend}
                  type="button"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend Verification Code</span>
                </button>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-500">
                    Having trouble verifying? Contact support at{' '}
                    <a href="mailto:support.carebridge@gmail.com" className="text-teal-700 font-semibold hover:underline">
                      support.carebridge@gmail.com
                    </a>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-[85vh] flex items-center justify-center text-slate-600">Loading...</div>}>
      <VerifyEmailForm />
    </Suspense>
  );
}
