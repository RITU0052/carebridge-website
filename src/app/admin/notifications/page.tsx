'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Send, Clock, CheckCircle2, AlertCircle, Plus, RefreshCw } from 'lucide-react';

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newNotif, setNewNotif] = useState({
    title: '',
    message: '',
    targetAudience: 'All Users',
    scheduledAt: '',
  });

  const loadNotifs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/notifications');
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifs();
  }, []);

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotif),
      });
      const data = await res.json();
      if (data.success) {
        setModalOpen(false);
        setNewNotif({ title: '', message: '', targetAudience: 'All Users', scheduledAt: '' });
        loadNotifs();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Notification Center &amp; Broadcast Dispatcher</h1>
          <p className="text-xs text-slate-400 mt-1">
            Dispatch announcements or schedule targeted push notifications for patients, caregivers, and doctors.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>Create Announcement</span>
          </button>
          <button
            onClick={loadNotifs}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* History Log */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs bg-slate-900/80 rounded-3xl border border-slate-800">
            No system notifications sent yet.
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-black uppercase bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {n.targetAudience}
                  </span>
                  <h4 className="font-bold text-white text-sm">{n.title}</h4>
                </div>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    n.status === 'Sent'
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
                      : 'bg-amber-950/80 text-amber-400 border border-amber-800'
                  }`}
                >
                  {n.status}
                </span>
              </div>
              <p className="text-xs text-slate-300">{n.message}</p>
              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>By: {n.createdBy}</span>
                <span>{new Date(n.sentAt || n.createdAt).toLocaleString()}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateNotification} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white">Create Broadcast Announcement</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newNotif.title}
                  onChange={(e) => setNewNotif({ ...newNotif, title: e.target.value })}
                  placeholder="System Maintenance or Health Tip"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Target Audience</label>
                <select
                  value={newNotif.targetAudience}
                  onChange={(e) => setNewNotif({ ...newNotif, targetAudience: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                >
                  <option value="All Users">All Registered Users</option>
                  <option value="Patients">Patients Only</option>
                  <option value="Caregivers">Caregivers Only</option>
                  <option value="Doctors">Doctors Only</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 font-bold mb-1">Message Content</label>
                <textarea
                  required
                  rows={3}
                  value={newNotif.message}
                  onChange={(e) => setNewNotif({ ...newNotif, message: e.target.value })}
                  placeholder="Write message..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Now</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
