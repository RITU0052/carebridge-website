'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Star, SlidersHorizontal, Send, RefreshCw, AlertCircle, FileText } from 'lucide-react';

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [selectedNotesItem, setSelectedNotesItem] = useState<any>(null);
  const [internalNotesText, setInternalNotesText] = useState('');

  const loadFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/feedback');
      const data = await res.json();
      if (data.success) {
        setFeedback(data.feedback);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  const handleUpdate = async (id: string, updates: any) => {
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });
      const data = await res.json();
      if (data.success) {
        loadFeedback();
        if (selectedNotesItem?.id === id) {
          setSelectedNotesItem(null);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = feedback.filter((f) => {
    if (statusFilter !== 'ALL' && f.status !== statusFilter) return false;
    if (categoryFilter !== 'ALL' && f.category !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Feedback &amp; Bug Report Triage Board</h1>
          <p className="text-xs text-slate-400 mt-1">
            Categorize user submissions, assign priorities (Critical, High, Medium), write internal notes, and reply via email.
          </p>
        </div>
        <button
          onClick={loadFeedback}
          disabled={loading}
          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 border border-slate-700 w-fit"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Inbox</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
          <span className="text-xs text-slate-400 font-bold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Statuses ({feedback.length})</option>
            <option value="New">New</option>
            <option value="In Review">In Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 px-3 py-1.5 focus:outline-none"
          >
            <option value="ALL">All Categories</option>
            <option value="General">General</option>
            <option value="Bug">Bug Report</option>
            <option value="Feature Request">Feature Request</option>
            <option value="UI/UX">UI / UX</option>
            <option value="Performance">Performance</option>
            <option value="Security">Security</option>
          </select>
        </div>
      </div>

      {/* Inbox Items */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs bg-slate-900/80 rounded-3xl border border-slate-800">
            No feedback items match the selected filter criteria.
          </div>
        ) : (
          filtered.map((fb) => (
            <div key={fb.id} className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center">
                    {fb.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-white text-base">{fb.name}</h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-slate-800 text-slate-300">
                        {fb.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{fb.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Priority Badge */}
                  <select
                    value={fb.priority || 'Medium'}
                    onChange={(e) => handleUpdate(fb.id, { priority: e.target.value })}
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border focus:outline-none ${
                      fb.priority === 'Critical'
                        ? 'bg-rose-950 text-rose-300 border-rose-800'
                        : fb.priority === 'High'
                        ? 'bg-amber-950 text-amber-300 border-amber-800'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                    <option value="Critical">Critical</option>
                  </select>

                  {/* Status Picker */}
                  <select
                    value={fb.status}
                    onChange={(e) => handleUpdate(fb.id, { status: e.target.value })}
                    className="text-[10px] font-black uppercase px-2.5 py-1 rounded-lg bg-slate-950 text-teal-300 border border-slate-800 focus:outline-none"
                  >
                    <option value="New">New</option>
                    <option value="In Review">In Review</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>
              </div>

              <p className="text-xs text-slate-200 italic bg-slate-950 p-3.5 rounded-2xl border border-slate-800/80 leading-relaxed">
                &quot;{fb.message}&quot;
              </p>

              {fb.internalNotes && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <span className="font-bold text-amber-400">Internal Admin Note: </span>
                  <span className="text-slate-300">{fb.internalNotes}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Submitted: {new Date(fb.createdAt).toLocaleString()}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedNotesItem(fb);
                      setInternalNotesText(fb.internalNotes || '');
                    }}
                    className="text-slate-400 font-bold hover:text-white flex items-center gap-1"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Internal Note</span>
                  </button>
                  <a
                    href={`mailto:${fb.email}?subject=Re:%20CareBridge%20Feedback%20[${fb.category}]`}
                    className="text-teal-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Email Reply</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Internal Notes Modal */}
      {selectedNotesItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-extrabold text-white">Add Internal Admin Note</h3>
            <textarea
              rows={3}
              value={internalNotesText}
              onChange={(e) => setInternalNotesText(e.target.value)}
              placeholder="Write internal note..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            />
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedNotesItem(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdate(selectedNotesItem.id, { internalNotes: internalNotesText })}
                className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold shadow-lg"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
