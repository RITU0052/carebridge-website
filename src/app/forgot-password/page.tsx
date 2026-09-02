'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, ArrowRight, AlertCircle, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    const result = await forgotPassword(email);
    setLoading(false);

    if (result.success) {
      setSuccessMsg(result.message);
    } else {
      setError(result.message || 'Failed to send reset link. Please try again.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Breadcrumbs items={[{ label: 'Login', href: '/login' }, { label: 'Forgot Password', href: '/forgot-password' }]} />

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
            <KeyRound className="w-6 h-6" />
          </div>
          <h1 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
            Reset Your Password
          </h1>
          <p className="mt-2 text-center text-sm text-slate-600 max-w-sm mx-auto">
            Enter the email address associated with your CareBridge account and we will send you password reset instructions.
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200/80 sm:px-10">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-800 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg ? (
            <div className="space-y-6 text-center">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-900 text-sm text-left">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Reset Email Dispatched</p>
                  <p className="mt-1">{successMsg}</p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Didn&apos;t receive an email? Check your spam folder or contact support at{' '}
                <a href="mailto:support.carebridge@gmail.com" className="text-teal-700 font-semibold hover:underline">
                  support.carebridge@gmail.com
                </a>.
              </p>
              <Link
                href="/login"
                className="w-full inline-flex justify-center items-center py-3 px-4 rounded-xl text-base font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Account Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah@example.com"
                    className="block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600 sm:text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all disabled:opacity-60"
                >
                  {loading ? (
                    <span>Sending Reset Link...</span>
                  ) : (
                    <>
                      <span>Send Reset Link</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Remembered your password?{' '}
              <Link href="/login" className="font-bold text-teal-700 hover:text-teal-900 hover:underline">
                Back to Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-slate-500">
          Need support? Email us directly at{' '}
          <a href="mailto:support.carebridge@gmail.com" className="text-teal-700 font-semibold hover:underline">
            support.carebridge@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
