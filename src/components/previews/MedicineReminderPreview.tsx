'use client';

import React, { useState } from 'react';
import { Pill, CheckCircle2, Clock, Bell, Sparkles, User } from 'lucide-react';

export function MedicineReminderPreview() {
  const [meds, setMeds] = useState([
    { id: 1, name: 'Lisinopril', dose: '10 mg', time: '8:00 AM', taken: true, instructions: 'Take with morning meal' },
    { id: 2, name: 'Metformin', dose: '500 mg', time: '1:00 PM', taken: false, instructions: 'Take with afternoon lunch' },
    { id: 3, name: 'Atorvastatin', dose: '20 mg', time: '8:00 PM', taken: false, instructions: 'Take at bedtime' },
  ]);

  const toggleTaken = (id: number) => {
    setMeds(meds.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  };

  const takenCount = meds.filter(m => m.taken).length;

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-xl mx-auto">
      {/* Mock Header */}
      <div className="bg-gradient-to-r from-teal-700 to-sky-700 text-white p-5 sm:p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-bold text-lg leading-tight">Arthur’s Medicine Schedule</h4>
            <p className="text-xs text-teal-100 mt-0.5">Today • {takenCount} of {meds.length} doses confirmed</p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-white/20 text-xs font-semibold flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-teal-200 animate-pulse" />
          <span>Active Sync</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-slate-100 h-2 w-full">
        <div
          className="bg-teal-500 h-2 transition-all duration-500"
          style={{ width: `${(takenCount / meds.length) * 100}%` }}
        />
      </div>

      {/* List of Medications */}
      <div className="p-5 sm:p-6 space-y-3 bg-slate-50/50">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          <span>Scheduled Dose</span>
          <span>Caregiver Status</span>
        </div>

        {meds.map((med) => (
          <div
            key={med.id}
            onClick={() => toggleTaken(med.id)}
            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${
              med.taken
                ? 'bg-emerald-50/80 border-emerald-200'
                : 'bg-white border-slate-200 hover:border-teal-300 shadow-sm'
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                  med.taken ? 'bg-emerald-500 text-white' : 'bg-teal-100 text-teal-700'
                }`}
              >
                <Pill className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-base">{med.name}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {med.dose}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{med.time}</span>
                  <span className="text-slate-300">•</span>
                  <span>{med.instructions}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 min-h-[40px] ${
                med.taken
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-teal-600 text-white hover:bg-teal-700 shadow-sm'
              }`}
            >
              {med.taken ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Taken</span>
                </>
              ) : (
                <span>Confirm Dose</span>
              )}
            </button>
          </div>
        ))}

        <div className="p-3 rounded-xl bg-teal-50 border border-teal-200/60 text-xs text-teal-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Click any item above to simulate caregiver dose status update</span>
          </div>
          <span className="font-semibold text-teal-700">Live Interactive Mockup</span>
        </div>
      </div>
    </div>
  );
}
