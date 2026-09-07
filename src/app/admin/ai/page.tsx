'use client';

import React, { useState, useEffect } from 'react';
import { Cpu, RefreshCw, CheckCircle, AlertTriangle, Play, ShieldAlert } from 'lucide-react';

export default function AdminAIPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadAIMetrics = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/ai');
      const result = await res.json();
      if (result.success) {
        setData(result.aiMetrics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAIMetrics();
  }, []);

  const handleRetryFailed = async () => {
    try {
      const res = await fetch('/api/admin/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'retry_failed' }),
      });
      const result = await res.json();
      if (result.success) {
        loadAIMetrics();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">AI Management &amp; Inference Health</h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor Gemini API latency, success rates, processing times, and re-queue failed inferences securely.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRetryFailed}
            className="px-4 py-2.5 rounded-xl bg-amber-950/80 hover:bg-amber-900 text-amber-200 text-xs font-bold flex items-center gap-2 border border-amber-800 shadow-lg"
          >
            <Play className="w-4 h-4 fill-amber-200" />
            <span>Retry Failed Tasks</span>
          </button>
          <button
            onClick={loadAIMetrics}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* AI Metrics Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <p className="text-[10px] font-bold uppercase text-slate-400">Total Inferences</p>
          <p className="text-3xl font-black text-white">{data?.totalRequests || 0}</p>
        </div>
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <p className="text-[10px] font-bold uppercase text-emerald-400">Success Rate</p>
          <p className="text-3xl font-black text-emerald-400">{data?.successRate || '100%'}</p>
        </div>
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <p className="text-[10px] font-bold uppercase text-slate-400">Avg Duration</p>
          <p className="text-3xl font-black text-teal-400">{data?.avgDurationMs || 1100}ms</p>
        </div>
        <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
          <p className="text-[10px] font-bold uppercase text-rose-400">Failed Tasks</p>
          <p className="text-3xl font-black text-rose-400">{data?.failedRequests || 0}</p>
        </div>
      </div>

      {/* Request Log Feed */}
      <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-base font-extrabold text-white">Recent AI Request Audit Trail</h3>
        <div className="space-y-3">
          {(data?.requests || []).map((r: any) => (
            <div key={r.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
              <div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300">
                  {r.feature}
                </span>
                <p className="font-mono text-slate-400 text-[11px] mt-1">ID: {r.id}</p>
              </div>
              <div className="text-right">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    r.status === 'Completed' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
                  }`}
                >
                  {r.status}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">{r.durationMs}ms • {new Date(r.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
