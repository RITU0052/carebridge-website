'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { safeFetchJson } from '@/lib/fetchHelper';
import { Stethoscope, Mail, Lock, User, Phone, Award, ShieldCheck, DollarSign, Clock, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DoctorRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    specialization: 'General Medicine',
    licenseNumber: '',
    experienceYears: '5',
    consultationFee: '500',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMsg, setResendMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await safeFetchJson<{
      success: boolean;
      message: string;
      doctorId?: string;
    }>('/api/doctor/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    setLoading(false);

    if (res.ok && res.data?.success) {
      setSubmitted(true);
      setRegisteredEmail(formData.email);
    } else {
      setError(res.data?.message || res.error || 'Registration failed. Please try again.');
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    setResendMsg('');

    const res = await safeFetchJson<{ success: boolean; message: string }>(
      '/api/doctor/resend-verification',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: registeredEmail }),
      }
    );

    setResending(false);
    if (res.ok && res.data?.success) {
      setResendMsg('A new verification email link has been sent to your inbox.');
    } else {
      setResendMsg(res.data?.message || 'Failed to resend verification email.');
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center mx-auto border border-teal-500/30">
            <Mail className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Check Your Email</h2>
            <p className="text-sm text-slate-400">
              We sent a verification link to <strong className="text-teal-300">{registeredEmail}</strong>.
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl text-left border border-slate-700/50 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-teal-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Next Steps:
            </div>
            <ol className="list-decimal list-inside space-y-1 pl-1 text-slate-400">
              <li>Click the verification link in your email.</li>
              <li>Your account will be submitted for CareBridge Admin verification.</li>
              <li>You will receive an approval email once reviewed.</li>
            </ol>
          </div>

          {resendMsg && (
            <div className="text-xs p-3 rounded-lg bg-teal-900/30 text-teal-300 border border-teal-700/50">
              {resendMsg}
            </div>
          )}

          <div className="space-y-3 pt-2">
            <button
              onClick={handleResendVerification}
              disabled={resending}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-xl border border-slate-700 transition disabled:opacity-50"
            >
              {resending ? 'Resending Link...' : 'Resend Verification Email'}
            </button>

            <Link
              href="/doctor/login"
              className="block w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-500 text-white text-sm font-semibold rounded-xl text-center transition"
            >
              Go to Doctor Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-3">
        <div className="inline-flex items-center justify-center p-3 bg-teal-500/10 border border-teal-500/30 rounded-2xl text-teal-400 mb-2">
          <Stethoscope className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          CareBridge Doctor Portal
        </h1>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Register your medical credentials to provide expert care on the CareBridge healthcare network.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-slate-900 border border-slate-800 py-8 px-6 sm:px-10 rounded-2xl shadow-2xl space-y-6">
          {error && (
            <div className="flex items-start gap-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-xl text-sm">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Dr. Jane Smith"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm transition placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="doctor@hospital.org"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm transition placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    name="password"
                    required
                    minLength={6}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm transition placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 234-5678"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm transition placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Medical Specialization *
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm transition"
                  >
                    <option value="General Medicine">General Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Endocrinology">Endocrinology</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Psychiatry">Psychiatry</option>
                    <option value="Geriatrics">Geriatrics</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Medical License Number *
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    name="licenseNumber"
                    required
                    value={formData.licenseNumber}
                    onChange={handleChange}
                    placeholder="MD-88749-NY"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm transition placeholder:text-slate-600"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Years of Experience
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    name="experienceYears"
                    min="0"
                    max="60"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Consultation Fee (₹ / $)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="number"
                    name="consultationFee"
                    min="0"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm transition"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 px-6 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg shadow-teal-900/30 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {loading ? (
                'Submitting Application...'
              ) : (
                <>
                  Register as Doctor <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 text-center border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Already have a registered doctor account?{' '}
              <Link href="/doctor/login" className="text-teal-400 hover:underline font-semibold">
                Doctor Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
