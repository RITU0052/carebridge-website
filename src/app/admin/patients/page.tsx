'use client';

import React, { useState, useEffect } from 'react';
import { UserCheck, Search, ShieldCheck, Heart, Users, RefreshCw } from 'lucide-react';

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const loadPatients = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/patients');
      const data = await res.json();
      if (data.success) {
        setPatients(data.patients);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Patient &amp; Family Profile Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Privacy-checked oversight of patient care relationships, linked caregivers, and compliance metadata.
          </p>
        </div>
        <button
          onClick={loadPatients}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 w-fit"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient name or email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPatients.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs bg-slate-900/80 rounded-3xl border border-slate-800">
            No patient profiles found.
          </div>
        ) : (
          filteredPatients.map((p) => (
            <div key={p.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{p.name}</h3>
                    <p className="text-xs text-slate-400">{p.email}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase bg-emerald-950/80 text-emerald-400 border border-emerald-800">
                  {p.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <p className="text-slate-400 font-bold">Active Medicines</p>
                  <p className="text-lg font-black text-white mt-0.5">{p.activeMedicinesCount}</p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <p className="text-slate-400 font-bold">Caregivers Linked</p>
                  <p className="text-lg font-black text-white mt-0.5">{p.linkedCaregiversCount}</p>
                </div>
              </div>

              {p.caregivers && p.caregivers.length > 0 && (
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Associated Caregiver Relationships</p>
                  {p.caregivers.map((cg: any, idx: number) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
                      <span className="font-bold text-slate-200">{cg.name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-teal-300 font-semibold">{cg.accessLevel}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
