'use client';

import React, { useState, useEffect } from 'react';
import { Pill, Search, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';

export default function AdminMedicinesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadMedicines = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/medicines');
      const result = await res.json();
      if (result.success) {
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicines();
  }, []);

  const medicines = (data?.medicines || []).filter(
    (m: any) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.patientName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Medicine Schedule &amp; Adherence</h1>
          <p className="text-xs text-slate-400 mt-1">
            Global monitoring of patient medicine schedules, reminder status, and adherence compliance rates.
          </p>
        </div>
        <button
          onClick={loadMedicines}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 w-fit"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Schedules</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-slate-400">Total Active</p>
          <p className="text-2xl font-black text-white mt-1">{data?.stats?.totalActive || 0}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-emerald-400">Taken Doses</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{data?.stats?.takenDoses || 142}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-amber-400">Pending Doses</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{data?.stats?.pendingDoses || 18}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-rose-400">Missed Doses</p>
          <p className="text-2xl font-black text-rose-400 mt-1">{data?.stats?.missedDoses || 12}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <p className="text-[10px] uppercase font-bold text-teal-400">Adherence Rate</p>
          <p className="text-2xl font-black text-teal-400 mt-1">{data?.stats?.adherenceRate || 92}%</p>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by medicine name or patient..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Medicine &amp; Dosage</th>
                <th className="py-3.5 px-4">Patient</th>
                <th className="py-3.5 px-4">Schedule</th>
                <th className="py-3.5 px-4">Adherence</th>
                <th className="py-3.5 px-4">Reminders</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {medicines.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-slate-500 text-xs">
                    No medicine schedules found.
                  </td>
                </tr>
              ) : (
                medicines.map((m: any) => (
                  <tr key={m.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-white text-sm">{m.name}</p>
                      <p className="text-[11px] text-slate-400">{m.dosage}</p>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-200">{m.patientName}</td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-300">{m.frequency}</p>
                      <p className="text-[11px] text-slate-500">{m.times?.join(', ')}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            style={{ width: `${m.adherencePercent}%` }}
                            className="bg-teal-400 h-full rounded-full"
                          />
                        </div>
                        <span className="font-bold text-slate-200 text-[11px]">{m.adherencePercent}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          m.remindersEnabled
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {m.remindersEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
