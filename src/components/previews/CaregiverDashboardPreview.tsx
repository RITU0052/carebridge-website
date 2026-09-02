'use client';

import React from 'react';
import { Activity, CheckCircle2, Heart, ShieldAlert, Clock, UserCheck } from 'lucide-react';

export function CaregiverDashboardPreview() {
  const events = [
    {
      id: 1,
      type: 'medication',
      title: 'Morning Lisinopril 10mg Confirmed',
      time: '8:05 AM',
      author: 'Arthur (Father)',
      status: 'On Time',
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-100',
    },
    {
      id: 2,
      type: 'vitals',
      title: 'Blood Pressure Logged: 122/78 mmHg',
      time: '9:30 AM',
      author: 'Logged via Omron Monitor',
      status: 'Normal Range',
      icon: Heart,
      color: 'text-sky-600 bg-sky-100',
    },
    {
      id: 3,
      type: 'activity',
      title: 'Daily Steps Goal 60% Completed (3,200 steps)',
      time: '2:15 PM',
      author: 'Wellness Tracker Sync',
      status: 'Active',
      icon: Activity,
      color: 'text-teal-600 bg-teal-100',
    },
  ];

  return (
    <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl overflow-hidden max-w-xl mx-auto">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-base text-white">Caregiver Real-Time Feed</h4>
            <p className="text-xs text-slate-400">Connected to: Arthur (Parent Profile)</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
          All Quiet • Safe
        </span>
      </div>

      {/* Feed Items */}
      <div className="p-5 sm:p-6 space-y-4">
        {events.map((evt) => {
          const EvtIcon = evt.icon;
          return (
            <div
              key={evt.id}
              className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-start gap-4 hover:border-slate-600 transition-colors"
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${evt.color}`}>
                <EvtIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm text-slate-100 truncate">{evt.title}</p>
                  <span className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {evt.time}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <span className="text-xs text-slate-400">{evt.author}</span>
                  <span className="text-[11px] font-medium text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded-md border border-teal-800/50">
                    {evt.status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-2 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-teal-400" />
            <span>Instant push alerts sent to family smartphones on any missed schedule</span>
          </p>
        </div>
      </div>
    </div>
  );
}
