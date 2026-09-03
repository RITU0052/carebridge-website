'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, AlertCircle, Shield, KeyRound, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function LoginPage() {
  const [loginType, setLoginType] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpNotice, setOtpNotice] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, sendOtp, verifyOtp } = useAuth();
  const router = useRouter();

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setOtpNotice('');

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address to receive OTP code.');
      return;
    }

    setLoading(true);
    const result = await sendOtp(email);
    setLoading(false);

    if (result.success) {
      setOtpSent(true);
      setOtpNotice(result.message || 'OTP sent successfully!');
    } else {
      setError(result.message || 'Failed to send OTP email.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!otpCode || otpCode.trim().length < 6) {
      setError('Please enter the 6-digit OTP code sent to your email.');
      return;
    }

    setLoading(true);
    const result = await verifyOtp(email, otpCode);
    setLoading(false);

    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.message || 'Invalid or expired OTP code.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4">
        <Breadcrumbs items={[{ label: 'Login', href: '/login' }]} />

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

        <h1 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome Back to CareBridge
        </h1>
        <p className="mt-2 text-center text-sm text-slate-600 max-w-sm mx-auto">
          Sign in to your secure account to manage medicine reminders, view health reports, and access AI health summaries.
        </p>

        {/* Tab Selection */}
        <div className="mt-6 p-1 bg-slate-200/80 rounded-2xl flex items-center max-w-sm mx-auto">
          <button
            onClick={() => {
              setLoginType('password');
              setError('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              loginType === 'password' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Password Login
          </button>
          <button
            onClick={() => {
              setLoginType('otp');
              setError('');
            }}
            className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 ${
              loginType === 'otp' ? 'bg-teal-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Email OTP Login</span>
          </button>
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

          {/* Password Login Form */}
          {loginType === 'password' && (
            <form className="space-y-6" onSubmit={handlePasswordSubmit} noValidate>
              <div>
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah@example.com"
                    className="block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <Link href="/forgot-password" className="text-xs font-semibold text-teal-700 hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-600 sm:text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-60"
              >
                {loading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Email OTP Login Form */}
          {loginType === 'otp' && (
            <div className="space-y-6">
              {otpNotice && (
                <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 flex items-start gap-3 text-teal-900 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Verification Email Sent</p>
                    <p className="text-xs mt-0.5 text-teal-800">{otpNotice}</p>
                  </div>
                </div>
              )}

              {!otpSent ? (
                <form className="space-y-5" onSubmit={handleSendOtp} noValidate>
                  <div>
                    <label htmlFor="otp-email" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Your Email Address <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative rounded-xl shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        id="otp-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. sarah@example.com"
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
                      <span>Sending Code...</span>
                    ) : (
                      <>
                        <span>Send 6-Digit OTP Code</span>
                        <KeyRound className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form className="space-y-5" onSubmit={handleVerifyOtp} noValidate>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label htmlFor="otp-code" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                        6-Digit OTP Code <span className="text-rose-500">*</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="text-xs font-semibold text-teal-700 hover:underline"
                      >
                        Resend Code
                      </button>
                    </div>
                    <input
                      id="otp-code"
                      type="text"
                      maxLength={6}
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="123456"
                      className="block w-full text-center tracking-[8px] text-2xl font-bold py-3 border border-slate-300 rounded-xl bg-white text-slate-900 focus:ring-2 focus:ring-teal-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-teal-600 hover:bg-teal-700 focus:ring-2 focus:ring-teal-500 disabled:opacity-60"
                  >
                    {loading ? (
                      <span>Verifying OTP...</span>
                    ) : (
                      <>
                        <span>Verify &amp; Enter Dashboard</span>
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-600">
              Don&apos;t have a CareBridge account yet?{' '}
              <Link href="/signup" className="font-bold text-teal-700 hover:text-teal-900 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center space-y-2 text-xs text-slate-500">
          <div className="flex items-center justify-center gap-1.5 text-slate-600">
            <Shield className="w-4 h-4 text-teal-600" />
            <span>256-bit Encrypted Health Portal</span>
          </div>
          <p>
            Need login assistance? Email support:{' '}
            <a href="mailto:support.carebridge@gmail.com" className="text-teal-700 font-semibold hover:underline">
              support.carebridge@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
