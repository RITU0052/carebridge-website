'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Users,
  MessageSquare,
  Mail,
  RefreshCw,
  LogOut,
  Star,
  Clock,
  Send,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  isVerified: boolean;
  createdAt: string;
}

interface FeedbackRecord {
  id: string;
  userId?: string;
  name: string;
  email: string;
  rating: number;
  category: string;
  message: string;
  status: 'New' | 'In Progress' | 'Resolved';
  createdAt: string;
}

interface EmailLogRecord {
  id: string;
  type: string;
  recipient: string;
  subject: string;
  body: string;
  status: string;
  sentAt: string;
}

export default function AdminDashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'feedback' | 'users' | 'emails'>('feedback');
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRecord[]>([]);
  const [emailLogs, setEmailLogs] = useState<EmailLogRecord[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const loadAdminData = useCallback(async () => {
    setLoadingData(true);
    try {
      const [uRes, fRes, eRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/feedback'),
        fetch('/api/admin/emails'),
      ]);
      const [uData, fData, eData] = await Promise.all([
        uRes.json(),
        fRes.json(),
        eRes.json(),
      ]);

      if (uData.success) setUsers(uData.users);
      if (fData.success) setFeedback(fData.feedback);
      if (eData.success) setEmailLogs(eData.emailLogs);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'Admin')) {
      // If not logged in as Admin, redirect to admin login
      if (user?.role !== 'Admin') {
        router.push('/admin/login');
      }
    } else {
      loadAdminData();
    }
  }, [isLoading, isAuthenticated, user, router, loadAdminData]);

  const handleUpdateFeedbackStatus = async (id: string, newStatus: 'New' | 'In Progress' | 'Resolved') => {
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setFeedback((prev) =>
          prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
        );
      }
    } catch (err) {
      console.error('Error updating feedback status:', err);
    }
  };

  const filteredFeedback = feedback.filter((item) => {
    if (statusFilter === 'ALL') return true;
    return item.status === statusFilter;
  });

  if (isLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-950 text-white">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-300">Loading CareBridge Admin System...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Breadcrumbs items={[{ label: 'Admin Dashboard', href: '/admin' }]} />

        {/* Admin Welcome Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center text-2xl font-bold">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-white tracking-tight">CareBridge Admin Operations</h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                  System Admin
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Connected: <span className="text-teal-400 font-semibold">{user.email}</span> • Real-time Monitoring &amp; Feedback Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              disabled={loadingData}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
              <span>Refresh Logs</span>
            </button>
            <button
              onClick={logout}
              className="px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-200 text-xs font-bold flex items-center gap-2 border border-rose-800/80 transition-colors"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registered Users</p>
              <p className="text-3xl font-black text-white mt-1">{users.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Feedback Submissions</p>
              <p className="text-3xl font-black text-white mt-1">{feedback.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
              <MessageSquare className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between shadow-lg">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Dispatched Email Logs</p>
              <p className="text-3xl font-black text-white mt-1">{emailLogs.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Mail className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-900 p-1.5 rounded-2xl border border-slate-800 flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'feedback', label: `Feedback Inbox (${feedback.length})`, icon: MessageSquare },
            { id: 'users', label: `User Overview (${users.length})`, icon: Users },
            { id: 'emails', label: `Email Audit Logs (${emailLogs.length})`, icon: Mail },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-5 py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Feedback Management */}
        {activeTab === 'feedback' && (
          <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-white">User Feedback Inbox</h2>
                <p className="text-xs text-slate-400">Review, categorize, and update user submission statuses</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-400 font-semibold">Filter:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-slate-800 text-slate-200 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 focus:outline-none"
                >
                  <option value="ALL">All Statuses ({feedback.length})</option>
                  <option value="New">New</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {filteredFeedback.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No feedback records match the selected filter.
                </div>
              ) : (
                filteredFeedback.map((fb) => (
                  <div
                    key={fb.id}
                    className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 hover:border-slate-700 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center">
                          {fb.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-base">{fb.name}</h4>
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-slate-800 text-slate-300">
                              {fb.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400">{fb.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-3.5 h-3.5 ${
                                s <= fb.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>

                        {/* Status Switcher */}
                        <select
                          value={fb.status}
                          onChange={(e) =>
                            handleUpdateFeedbackStatus(fb.id, e.target.value as FeedbackRecord['status'])
                          }
                          className={`text-xs font-black uppercase px-3 py-1.5 rounded-xl border focus:outline-none ${
                            fb.status === 'New'
                              ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                              : fb.status === 'In Progress'
                              ? 'bg-sky-950/80 text-sky-300 border-sky-800'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                        </select>
                      </div>
                    </div>

                    <p className="text-sm text-slate-200 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                      &quot;{fb.message}&quot;
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span>Submitted: {new Date(fb.createdAt).toLocaleString()}</span>
                      <a
                        href={`mailto:${fb.email}?subject=Re:%20CareBridge%20Feedback%20[${fb.category}]`}
                        className="text-teal-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Reply to User via Email</span>
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: User Overview */}
        {activeTab === 'users' && (
          <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
            <div>
              <h2 className="text-xl font-extrabold text-white">Registered Users Overview</h2>
              <p className="text-xs text-slate-400">Database list of active users, assigned roles, and verification status</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300 border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px] bg-slate-950/80">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-white">{u.name}</p>
                        <p className="text-slate-400 text-[11px]">{u.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-800 text-teal-300 border border-slate-700">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            u.isVerified
                              ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                              : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {u.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Email Audit Logs */}
        {activeTab === 'emails' && (
          <div className="bg-slate-900/90 rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6 shadow-xl">
            <div>
              <h2 className="text-xl font-extrabold text-white">Automated Email Audit Logs</h2>
              <p className="text-xs text-slate-400">Inspection log for OTPs, Password Resets, Medicine Reminders, and Summaries</p>
            </div>

            <div className="space-y-3">
              {emailLogs.length === 0 ? (
                <div className="text-center py-10 text-slate-500 text-xs">
                  No automated emails logged yet.
                </div>
              ) : (
                emailLogs.map((log) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                          {log.type}
                        </span>
                        <h4 className="font-bold text-white text-sm">{log.subject}</h4>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>{new Date(log.sentAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                      <p>Recipient: <strong className="text-slate-200">{log.recipient}</strong></p>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                        {log.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 font-mono bg-slate-900 p-2.5 rounded-xl border border-slate-800/80">
                      {log.body}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
