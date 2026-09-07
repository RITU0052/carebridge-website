'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Search, RefreshCw, AlertTriangle, CheckCircle, RotateCw } from 'lucide-react';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/reports');
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleRetryAI = async (id: string) => {
    setRetryingId(id);
    try {
      const res = await fetch(`/api/admin/reports/${id}/retry`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        loadReports();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRetryingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Health Reports Processing Hub</h1>
          <p className="text-xs text-slate-400 mt-1">
            Metadata inspection, AI analysis status tracking, and error retry controls.
          </p>
        </div>
        <button
          onClick={loadReports}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 w-fit"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Reports</span>
        </button>
      </div>

      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Report File</th>
                <th className="py-3.5 px-4">Patient / User</th>
                <th className="py-3.5 px-4">Processing Status</th>
                <th className="py-3.5 px-4">AI Analysis</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {reports.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="py-3.5 px-4">
                    <p className="font-bold text-white text-sm">{r.fileName}</p>
                    <p className="text-[11px] text-slate-500 font-mono">ID: {r.id}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <p className="font-semibold text-slate-200">{r.userName}</p>
                    <p className="text-[11px] text-slate-400">{r.userEmail}</p>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        r.processingStatus === 'Completed'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                          : r.processingStatus === 'Failed'
                          ? 'bg-rose-950/80 text-rose-400 border border-rose-800'
                          : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {r.processingStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-300 font-semibold">{r.aiAnalysisStatus}</td>
                  <td className="py-3.5 px-4 text-right">
                    {r.processingStatus === 'Failed' || r.aiAnalysisStatus === 'Failed' ? (
                      <button
                        onClick={() => handleRetryAI(r.id)}
                        disabled={retryingId === r.id}
                        className="px-3 py-1.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-200 text-xs font-bold flex items-center gap-1.5 ml-auto border border-amber-800"
                      >
                        <RotateCw className={`w-3.5 h-3.5 ${retryingId === r.id ? 'animate-spin' : ''}`} />
                        <span>Retry Processing</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-semibold">No action needed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
