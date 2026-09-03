'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Mail, CheckCircle2, RefreshCw, Calendar, Pill, Activity, FileText } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SummaryData {
  date: string;
  user: string;
  email: string;
  medicinesCount: number;
  vitalsCount: number;
  reportsCount: number;
  latestVital?: {
    sysBP: number;
    diaBP: number;
    heartRate: number;
  };
  summaryContent: string;
}

export function DailySummaryWidget() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [emailing, setEmailing] = useState(false);
  const [notice, setNotice] = useState('');

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/daily-summary?userId=${user?.id || 'usr_demo_1'}`);
      const data = await res.json();
      if (data.success) {
        setSummary(data.summary);
      }
    } catch (err) {
      console.error('Error fetching summary:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  const handleSendDailyEmail = async () => {
    setEmailing(true);
    setNotice('');
    try {
      const res = await fetch('/api/daily-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id || 'usr_demo_1', sendEmail: true }),
      });
      const data = await res.json();
      if (data.success) {
        setNotice(data.message);
      } else {
        setNotice('Failed to dispatch daily email summary.');
      }
    } catch (err) {
      console.error('Email summary error:', err);
      setNotice('Server error dispatching daily email.');
    } finally {
      setEmailing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-200/80 space-y-5 relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-100 text-teal-700">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">CareBridge Daily Health Summary</h2>
            <p className="text-xs text-slate-500">Automated daily vitals, medicine adherence, and health overview</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchSummary}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Refresh summary data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleSendDailyEmail}
            disabled={emailing}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all disabled:opacity-60"
          >
            <Mail className="w-4 h-4" />
            <span>{emailing ? 'Dispatching...' : 'Email Daily Summary'}</span>
          </button>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2.5 text-emerald-900 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-xs text-slate-500 space-y-2">
          <div className="w-6 h-6 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p>Compiling daily health brief...</p>
        </div>
      ) : summary ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-100 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Active Prescriptions</p>
                <p className="text-lg font-black text-slate-900">{summary.medicinesCount} Medicines</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-sky-100 text-sky-700">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Latest BP Vitals</p>
                <p className="text-lg font-black text-slate-900">
                  {summary.latestVital ? `${summary.latestVital.sysBP}/${summary.latestVital.diaBP}` : 'No Readings'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center gap-3">
              <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Reports Vault</p>
                <p className="text-lg font-black text-slate-900">{summary.reportsCount} Documents</p>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs text-slate-700 leading-relaxed">
            <p className="font-bold text-slate-900 text-sm">Brief Status for {summary.date}</p>
            <p>
              All configured medicines and health vital metrics are actively monitored under your CareBridge profile ({summary.email}).
              Press <strong>Email Daily Summary</strong> above to immediately dispatch an updated PDF/HTML report digest to your primary email inbox or caregiver.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
