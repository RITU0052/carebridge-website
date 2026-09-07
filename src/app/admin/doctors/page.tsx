'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { safeFetchJson } from '@/lib/fetchHelper';
import {
  Stethoscope,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  Plus,
  RefreshCw,
  Eye,
  Search,
  Filter,
  UserCheck,
} from 'lucide-react';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const [newDoctor, setNewDoctor] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: 'General Medicine',
    licenseNumber: '',
    consultationFee: 500,
  });

  const loadDoctors = async () => {
    setLoading(true);
    const res = await safeFetchJson<{ success: boolean; doctors: any[] }>('/api/admin/doctors');
    setLoading(false);
    if (res.ok && res.data?.success) {
      setDoctors(res.data.doctors || []);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleApprove = async (id: string) => {
    setActionLoading(true);
    const res = await safeFetchJson(`/api/admin/doctors/${id}/approve`, { method: 'POST' });
    setActionLoading(false);
    if (res.ok) loadDoctors();
  };

  const handleCreateDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    const res = await safeFetchJson('/api/admin/doctors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newDoctor),
    });
    setActionLoading(false);
    if (res.ok && res.data?.success) {
      setModalOpen(false);
      setNewDoctor({
        name: '',
        email: '',
        phone: '',
        specialization: 'General Medicine',
        licenseNumber: '',
        consultationFee: 500,
      });
      loadDoctors();
    }
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesFilter =
      statusFilter === 'ALL'
        ? true
        : (doc.adminVerificationStatus || 'PENDING') === statusFilter;

    const matchesSearch =
      doc.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.licenseNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const pendingCount = doctors.filter(
    (d) => (d.adminVerificationStatus || 'PENDING') === 'PENDING'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-white tracking-tight">
              Clinician &amp; Doctor Verification
            </h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {pendingCount} Pending Review
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Verify medical licenses, approve or reject clinician applications, and manage active doctor profiles.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Doctor</span>
          </button>
          <button
            onClick={loadDoctors}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl w-full sm:w-auto">
          {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                statusFilter === filter
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {filter === 'ALL'
                ? 'All Doctors'
                : filter === 'PENDING'
                ? 'Pending Review'
                : filter === 'APPROVED'
                ? 'Approved'
                : 'Rejected'}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search doctor name, email, license..."
            className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl pl-9 pr-4 py-2 text-xs focus:border-teal-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Doctors Grid */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center text-slate-400 space-y-3">
          <Stethoscope className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold">No doctor records matching your current filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDoctors.map((doc) => {
            const adminStatus = doc.adminVerificationStatus || 'PENDING';
            return (
              <div
                key={doc.id}
                className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-bold text-lg">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-white text-base">Dr. {doc.name}</h3>
                        <p className="text-xs text-teal-400 font-semibold">{doc.specialization}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {doc.email} • {doc.phone}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                        adminStatus === 'APPROVED'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : adminStatus === 'REJECTED'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {adminStatus}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Email Status</p>
                      <p
                        className={`font-bold mt-0.5 text-[11px] ${
                          doc.emailVerified ? 'text-emerald-400' : 'text-amber-400'
                        }`}
                      >
                        {doc.emailVerified ? 'VERIFIED' : 'UNVERIFIED'}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-500">License No</p>
                      <p className="font-mono text-slate-200 text-[11px] mt-0.5 truncate">
                        {doc.licenseNumber}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                      <p className="text-[10px] uppercase font-bold text-slate-500">Consult Fee</p>
                      <p className="font-bold text-teal-400 mt-0.5">${doc.consultationFee}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 mt-2">
                  <Link
                    href={`/admin/doctors/${doc.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition"
                  >
                    <Eye className="w-3.5 h-3.5 text-teal-400" />
                    <span>Review Details</span>
                  </Link>

                  {adminStatus !== 'APPROVED' && (
                    <button
                      onClick={() => handleApprove(doc.id)}
                      disabled={actionLoading}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md transition disabled:opacity-50"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Doctor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-teal-400" /> Add Doctor Manually
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-500 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDoctor} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newDoctor.name}
                  onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
                  placeholder="Dr. John Doe"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={newDoctor.email}
                  onChange={(e) => setNewDoctor({ ...newDoctor, email: e.target.value })}
                  placeholder="doctor@hospital.org"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">Phone</label>
                <input
                  type="text"
                  required
                  value={newDoctor.phone}
                  onChange={(e) => setNewDoctor({ ...newDoctor, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">Specialization</label>
                <input
                  type="text"
                  required
                  value={newDoctor.specialization}
                  onChange={(e) => setNewDoctor({ ...newDoctor, specialization: e.target.value })}
                  placeholder="Cardiology"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 uppercase mb-1">License Number</label>
                <input
                  type="text"
                  required
                  value={newDoctor.licenseNumber}
                  onChange={(e) => setNewDoctor({ ...newDoctor, licenseNumber: e.target.value })}
                  placeholder="MD-12345"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl p-2.5"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-xl shadow-lg shadow-teal-950/40"
                >
                  {actionLoading ? 'Creating...' : 'Create Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
