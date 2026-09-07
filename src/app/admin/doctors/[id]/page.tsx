'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { safeFetchJson } from '@/lib/fetchHelper';
import {
  Stethoscope,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Mail,
  ShieldCheck,
  Award,
  Phone,
  DollarSign,
  AlertCircle,
  Send,
  RefreshCw,
  UserCheck,
} from 'lucide-react';

interface DoctorDetail {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  experienceYears: number;
  consultationFee: number;
  verificationStatus: string;
  emailVerified: boolean;
  emailVerifiedAt?: string;
  adminVerificationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  adminVerifiedAt?: string;
  adminVerifiedBy?: string;
  rejectionReason?: string;
  accountStatus: 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'REJECTED' | 'SUSPENDED';
  createdAt: string;
}

export default function AdminDoctorDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [doctor, setDoctor] = useState<DoctorDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Rejection modal
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const loadDoctor = async () => {
    if (!id) return;
    setLoading(true);
    setError('');

    const res = await safeFetchJson<{
      success: boolean;
      doctor?: DoctorDetail;
      message?: string;
    }>(`/api/admin/doctors`);

    setLoading(false);

    if (res.ok && res.data?.success && Array.isArray((res.data as any).doctors)) {
      const found = (res.data as any).doctors.find(
        (d: DoctorDetail) => d.id === id || d.userId === id
      );
      if (found) {
        setDoctor(found);
      } else {
        setError('Doctor application record not found.');
      }
    } else {
      setError(res.data?.message || res.error || 'Failed to load doctor record.');
    }
  };

  useEffect(() => {
    loadDoctor();
  }, [id]);

  const handleApprove = async () => {
    if (!doctor) return;
    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await safeFetchJson<{
      success: boolean;
      message: string;
      doctor?: DoctorDetail;
    }>(`/api/admin/doctors/${doctor.id}/approve`, {
      method: 'POST',
    });

    setActionLoading(false);

    if (res.ok && res.data?.success) {
      setSuccessMsg(res.data.message);
      loadDoctor();
    } else {
      setError(res.data?.message || res.error || 'Failed to approve doctor.');
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!doctor) return;
    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await safeFetchJson<{
      success: boolean;
      message: string;
      doctor?: DoctorDetail;
    }>(`/api/admin/doctors/${doctor.id}/reject`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rejectionReason }),
    });

    setActionLoading(false);
    setRejectModalOpen(false);

    if (res.ok && res.data?.success) {
      setSuccessMsg(res.data.message);
      setRejectionReason('');
      loadDoctor();
    } else {
      setError(res.data?.message || res.error || 'Failed to reject doctor.');
    }
  };

  const handleResendEmail = async () => {
    if (!doctor) return;
    setActionLoading(true);
    setError('');
    setSuccessMsg('');

    const res = await safeFetchJson<{
      success: boolean;
      message: string;
    }>(`/api/admin/doctors/${doctor.id}/resend-email`, {
      method: 'POST',
    });

    setActionLoading(false);

    if (res.ok && res.data?.success) {
      setSuccessMsg(res.data.message);
    } else {
      setError(res.data?.message || res.error || 'Failed to resend email.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin text-teal-400 mr-2" />
        <span>Loading Doctor Details...</span>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="space-y-6">
        <Link
          href="/admin/doctors"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Doctor Directory
        </Link>
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-6 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-rose-400 shrink-0" />
          <div>{error || 'Doctor record not found.'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/doctors"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Doctor List
        </Link>

        <button
          onClick={loadDoctor}
          disabled={actionLoading}
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
        >
          <RefreshCw className={`w-4 h-4 ${actionLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Global Alerts */}
      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-4 rounded-2xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg('')}
            className="text-xs text-slate-400 hover:text-white font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 text-rose-300 p-4 rounded-2xl flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError('')}
            className="text-xs text-slate-400 hover:text-white font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-2xl">
            <Stethoscope className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-extrabold text-white">{doctor.name}</h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  doctor.adminVerificationStatus === 'APPROVED'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : doctor.adminVerificationStatus === 'REJECTED'
                    ? 'bg-rose-950 text-rose-400 border border-rose-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}
              >
                {doctor.adminVerificationStatus}
              </span>
            </div>
            <p className="text-sm text-teal-400 font-medium mt-1">
              {doctor.specialization} • License: {doctor.licenseNumber}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Registered on {new Date(doctor.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {doctor.adminVerificationStatus !== 'APPROVED' && (
            <button
              onClick={handleApprove}
              disabled={actionLoading}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" /> Approve Doctor
            </button>
          )}

          {doctor.adminVerificationStatus !== 'REJECTED' && (
            <button
              onClick={() => setRejectModalOpen(true)}
              disabled={actionLoading}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <XCircle className="w-4 h-4" /> Reject Application
            </button>
          )}

          {doctor.adminVerificationStatus !== 'PENDING' && (
            <button
              onClick={handleResendEmail}
              disabled={actionLoading}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-teal-400" /> Resend Status Email
            </button>
          )}
        </div>
      </div>

      {/* Verification Flow Pipeline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Step 1: Doctor Email</span>
            <Mail className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-center gap-2">
            {doctor.emailVerified ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <Clock className="w-5 h-5 text-amber-400" />
            )}
            <span className="text-base font-bold text-white">
              {doctor.emailVerified ? 'Email Verified' : 'Email Unverified'}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {doctor.emailVerifiedAt
              ? `Verified on ${new Date(doctor.emailVerifiedAt).toLocaleString()}`
              : 'Doctor has not clicked verification link.'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Step 2: Admin Review</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-center gap-2">
            {doctor.adminVerificationStatus === 'APPROVED' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : doctor.adminVerificationStatus === 'REJECTED' ? (
              <XCircle className="w-5 h-5 text-rose-400" />
            ) : (
              <Clock className="w-5 h-5 text-amber-400" />
            )}
            <span className="text-base font-bold text-white">
              {doctor.adminVerificationStatus}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {doctor.adminVerifiedAt
              ? `Reviewed by ${doctor.adminVerifiedBy || 'Admin'} on ${new Date(doctor.adminVerifiedAt).toLocaleDateString()}`
              : 'Pending CareBridge Admin approval.'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-bold uppercase tracking-wider">Step 3: Account Status</span>
            <Award className="w-4 h-4 text-teal-400" />
          </div>
          <div className="flex items-center gap-2">
            {doctor.accountStatus === 'ACTIVE' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400" />
            )}
            <span className="text-base font-bold text-white">
              {doctor.accountStatus}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {doctor.accountStatus === 'ACTIVE'
              ? 'Doctor dashboard login enabled.'
              : 'Login blocked until active.'}
          </p>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credentials Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldCheck className="w-5 h-5 text-teal-400" /> Medical License &amp; Contact Info
          </h2>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-500 font-medium">Doctor ID:</span>
              <span className="font-mono text-white">{doctor.id}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-500 font-medium">Full Name:</span>
              <span className="text-white font-bold">Dr. {doctor.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-500 font-medium">Email Address:</span>
              <span className="text-teal-300 font-semibold">{doctor.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-500 font-medium">Phone Number:</span>
              <span className="text-white">{doctor.phone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-500 font-medium">Medical License Number:</span>
              <span className="font-mono text-teal-400 font-bold text-xs">{doctor.licenseNumber}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-500 font-medium">Specialization:</span>
              <span className="text-white font-medium">{doctor.specialization}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-800/60">
              <span className="text-slate-500 font-medium">Years of Experience:</span>
              <span className="text-white font-bold">{doctor.experienceYears} Years</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500 font-medium">Consultation Fee:</span>
              <span className="text-teal-400 font-bold">${doctor.consultationFee}</span>
            </div>
          </div>
        </div>

        {/* Audit & Rejection History */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Clock className="w-5 h-5 text-teal-400" /> Admin Audit &amp; Verification Notes
          </h2>

          <div className="space-y-4 text-xs">
            {doctor.rejectionReason && (
              <div className="bg-rose-950/40 border border-rose-800/60 p-4 rounded-2xl space-y-1">
                <div className="font-bold text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" /> Rejection Feedback
                </div>
                <p className="text-rose-200 text-xs leading-relaxed">{doctor.rejectionReason}</p>
              </div>
            )}

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Created At:</span>
                <span>{new Date(doctor.createdAt).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Reviewed By:</span>
                <span>{doctor.adminVerifiedBy || 'Pending Review'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Last Reviewed At:</span>
                <span>
                  {doctor.adminVerifiedAt
                    ? new Date(doctor.adminVerifiedAt).toLocaleString()
                    : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <XCircle className="w-5 h-5 text-rose-400" /> Reject Doctor Application
              </h3>
              <button
                onClick={() => setRejectModalOpen(false)}
                className="text-slate-500 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReject} className="space-y-4">
              <p className="text-xs text-slate-300">
                Specify the reason for rejecting Dr. {doctor.name}&apos;s application. This explanation will be included in the email sent to the doctor.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Rejection Reason *
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Medical license number could not be verified in state database."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 text-white rounded-xl p-3 text-xs transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-rose-950/40 disabled:opacity-50"
                >
                  {actionLoading ? 'Rejecting...' : 'Confirm Rejection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
