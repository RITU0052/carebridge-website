'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Lock, Clock, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function AdminSecurityPage() {
  const [securityLogs, setSecurityLogs] = useState<any[]>([]);
  const [loginAttempts, setLoginAttempts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/security-logs');
      const data = await res.json();
      if (data.success) {
        setSecurityLogs(data.securityLogs);
        setLoginAttempts(data.loginAttempts);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Security &amp; Activity Audit Logs</h1>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-resistant audit trail recording admin logins, rate-limiting triggers, user status edits, and system actions.
          </p>
        </div>
        <button
          onClick={loadLogs}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 w-fit"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      <div className="space-y-3">
        {securityLogs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs bg-slate-900/80 rounded-3xl border border-slate-800">
            No security logs recorded.
          </div>
        ) : (
          securityLogs.map((log) => (
            <div key={log.id} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-1 shadow-lg text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                      log.status === 'Success'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : log.status === 'Warning'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}
                  >
                    {log.action}
                  </span>
                  <span className="font-bold text-white">{log.targetResource}</span>
                </div>
                <span className="text-[11px] text-slate-500">{new Date(log.timestamp).toLocaleString()}</span>
              </div>
              <p className="text-slate-300 pt-1">{log.details || 'Admin action executed'}</p>
              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-800/60">
                <span>Admin: <strong>{log.adminEmail}</strong></span>
                <span>IP Address: <strong className="font-mono">{log.ipAddress}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
