'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserCheck,
  Mail,
  Calendar,
  Clock,
  ShieldCheck,
  Pill,
  FileText,
  Heart,
  PhoneCall,
  Activity,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { safeFetchJson } from '@/lib/fetchHelper';

export default function AdminUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserDetail() {
      setLoading(true);
      const resolvedParams = await params;
      const { ok, data } = await safeFetchJson(`/api/admin/users/${resolvedParams.id}`);
      if (ok && data?.success) {
        setUserData(data.user);
      }
      setLoading(false);
    }
    fetchUserDetail();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-teal-400 animate-spin" />
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-400 text-sm">User record not found.</p>
        <Link href="/admin/users" className="text-teal-400 font-bold text-xs hover:underline">
          ← Return to Users List
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Users Overview', href: '/admin/users' },
          { label: userData.name, href: `/admin/users/${userData.id}` },
        ]}
      />

      {/* Header Profile Card */}
      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-300 font-extrabold flex items-center justify-center text-2xl border border-teal-500/30">
            {userData.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-white">{userData.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                {userData.role}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                  userData.status === 'Active'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                }`}
              >
                {userData.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              <span>{userData.email}</span>
              <span>•</span>
              <Calendar className="w-3.5 h-3.5" />
              <span>Registered: {new Date(userData.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        <Link
          href="/admin/users"
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Users</span>
        </Link>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Medicines</p>
          <p className="text-xl font-black text-white mt-1">{userData.stats.medicinesCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Reports</p>
          <p className="text-xl font-black text-white mt-1">{userData.stats.reportsCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Vitals Logged</p>
          <p className="text-xl font-black text-white mt-1">{userData.stats.vitalsCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Emergency Contacts</p>
          <p className="text-xl font-black text-white mt-1">{userData.stats.emergencyContactsCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Family Profiles</p>
          <p className="text-xl font-black text-white mt-1">{userData.stats.familyProfilesCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">AI Analyses</p>
          <p className="text-xl font-black text-white mt-1">{userData.stats.aiAnalysesCount}</p>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-lg font-extrabold text-white">Recent Account Activity Timeline</h3>
        <div className="space-y-3">
          {userData.recentActivity.map((act: any, idx: number) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-teal-500/20 text-teal-300">
                  {act.type}
                </span>
                <p className="font-bold text-white text-sm mt-1">{act.description}</p>
              </div>
              <span className="text-xs text-slate-500">{new Date(act.timestamp).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
