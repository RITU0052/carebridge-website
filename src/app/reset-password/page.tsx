'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Lock, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const emailParam = searchParams.get('email') || '';

  const [inputToken, setInputToken] = useState(token);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const activeToken = inputToken.trim();
    if (!activeToken) {
      setError('Please provide a valid password reset token.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: activeToken, newPassword }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Failed to reset password. Token may be invalid or expired.');
      }
    } catch (err) {
      console.error('Reset error:', err);
      setLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200/80 sm:px-10">
      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {success ? (
        <div className="space-y-6 text-center">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-900 text-sm text-left">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Password Reset Complete!</p>
              <p className="mt-1">Your password has been updated. You can now log into your CareBridge account.</p>
            </div>
          </div>
          <button
            onClick={() => router.push('/login')}
            className="w-full inline-flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl text-base font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md"
          >
            <span>Proceed to Login</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          {emailParam && (
            <p className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              Resetting password for: <span className="font-semibold text-slate-800">{emailParam}</span>
            </p>
          )}

          {!token && (
            <div>
              <label htmlFor="token" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Reset Token / Security Key <span className="text-rose-500">*</span>
              </label>
              <input
                id="token"
                type="text"
                required
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="Paste reset token from email"
                className="block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-600 sm:text-sm"
              />
            </div>
          )}

          <div>
            <label htmlFor="new-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="new-password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Confirm New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-5 w-5" />
              </div>
              <input
                id="confirm-password"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-teal-600 sm:text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-teal-600 hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 disabled:opacity-60"
          >
            {loading ? (
              <span>Updating Password...</span>
            ) : (
              <>
                <span>Save New Password</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      )}

      <div className="mt-6 text-center text-sm text-slate-600 border-t border-slate-100 pt-4">
        Back to{' '}
        <Link href="/login" className="font-bold text-teal-700 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Breadcrumbs items={[{ label: 'Login', href: '/login' }, { label: 'Reset Password', href: '/reset-password' }]} />

        <div className="flex justify-center mb-6">
          <Link href="/" className="bg-white p-2.5 rounded-2xl shadow-sm border border-slate-200 inline-block">
            <Image src="/logo.png" alt="CareBridge AI Logo" width={180} height={50} className="object-contain max-h-12 w-auto" />
          </Link>
        </div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 mx-auto flex items-center justify-center mb-3">
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Set New Password</h1>
          <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
            Choose a strong password to secure your CareBridge Health portal account.
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Suspense fallback={<div className="text-center p-8 bg-white rounded-3xl shadow">Loading password reset form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
