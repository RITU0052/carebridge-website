'use client';

import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Lock, ToggleLeft, ToggleRight, Save, RefreshCw } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const loadSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          newPassword: newPassword || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Platform settings updated successfully.');
        setNewPassword('');
        loadSettings();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-slate-400 text-xs">
        <RefreshCw className="w-6 h-6 animate-spin text-teal-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Admin &amp; System Platform Settings</h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure platform maintenance mode, session timeouts, rate limits, and update admin credentials.
          </p>
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-2xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-bold">
          {message}
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="space-y-6">
        {/* Platform Operations */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-base font-extrabold text-white">Platform System Controls</h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <p className="font-bold text-white text-sm">System Maintenance Mode</p>
              <p className="text-xs text-slate-400">Temporarily restrict public user access for scheduled updates.</p>
            </div>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
                settings.maintenanceMode
                  ? 'bg-rose-950 text-rose-300 border-rose-800'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
            >
              {settings.maintenanceMode ? <ToggleRight className="w-5 h-5 text-rose-400" /> : <ToggleLeft className="w-5 h-5" />}
              <span>{settings.maintenanceMode ? 'ENABLED' : 'DISABLED'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">Session Timeout (Minutes)</label>
              <input
                type="number"
                value={settings.sessionTimeoutMinutes}
                onChange={(e) => setSettings({ ...settings, sessionTimeoutMinutes: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-bold mb-1">Max Login Attempts (Rate Limit)</label>
              <input
                type="number"
                value={settings.maxLoginAttempts}
                onChange={(e) => setSettings({ ...settings, maxLoginAttempts: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Change Admin Password */}
        <div className="bg-slate-900/90 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-base font-extrabold text-white">Security &amp; Password Update</h3>
          <div className="text-xs">
            <label className="block text-slate-400 font-bold mb-1">New Admin Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Leave blank to keep current password"
              className="w-full max-w-md bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </form>
    </div>
  );
}
