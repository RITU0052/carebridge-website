'use client';

import React, { useState } from 'react';
import { PhoneCall, ShieldAlert, Heart, User, CheckCircle2 } from 'lucide-react';

export function EmergencySupportPreview() {
  const [alertSent, setAlertSent] = useState(false);

  const contacts = [
    { name: 'Sarah (Daughter)', phone: '(555) 234-5678', role: 'Primary Care Contact' },
    { name: 'Marcus (Son)', phone: '(555) 876-5432', role: 'Secondary Contact' },
    { name: 'Dr. Aris Vance', phone: '(555) 345-6789', role: 'Primary Physician' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-xl mx-auto">
      {/* Header */}
      <div className="bg-rose-600 text-white p-5 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold">
            <PhoneCall className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-base text-white">Emergency Support Circle</h4>
            <p className="text-xs text-rose-100">One-Tap Family Alert System</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold">
          3 Connected Contacts
        </span>
      </div>

      <div className="p-5 sm:p-6 space-y-4">
        {/* Panic Button Simulator */}
        <div className="text-center p-6 rounded-2xl bg-rose-50 border border-rose-200/80 space-y-3">
          <p className="text-xs font-bold text-rose-800 uppercase tracking-wider">Simulated Emergency Trigger</p>
          <button
            type="button"
            onClick={() => setAlertSent(!alertSent)}
            className={`w-20 h-20 rounded-full mx-auto flex flex-col items-center justify-center font-extrabold text-xs transition-all shadow-lg focus:outline-none focus:ring-4 focus:ring-rose-400 ${
              alertSent
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30 active:scale-95'
            }`}
          >
            {alertSent ? (
              <>
                <CheckCircle2 className="w-8 h-8" />
                <span>Alerted</span>
              </>
            ) : (
              <>
                <ShieldAlert className="w-7 h-7 mb-0.5" />
                <span>TAP ALERT</span>
              </>
            )}
          </button>
          <p className="text-xs text-slate-600 max-w-xs mx-auto">
            {alertSent
              ? 'Alert broadcasted to all 3 emergency contacts with GPS location!'
              : 'Tap button above to simulate sending instant SMS & call notifications to family circle.'}
          </p>
        </div>

        {/* Emergency Contacts List */}
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">Designated Emergency Contacts</p>
          {contacts.map((c, i) => (
            <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-semibold text-xs">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">{c.name}</p>
                  <p className="text-[11px] text-slate-500">{c.role}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
                {c.phone}
              </span>
            </div>
          ))}
        </div>

        <div className="p-3 rounded-xl bg-slate-100 text-slate-600 text-xs flex items-center gap-2">
          <Heart className="w-4 h-4 text-rose-500 shrink-0" />
          <span>CareBridge displays allergies, blood type, and emergency contacts on lock screen.</span>
        </div>
      </div>
    </div>
  );
}
