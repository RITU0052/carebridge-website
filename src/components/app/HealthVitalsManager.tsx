'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Footprints, Plus, AlertCircle, TrendingUp, Watch } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface VitalsRecord {
  id: string;
  type: 'Blood Pressure' | 'Heart Rate' | 'Blood Glucose' | 'Weight' | 'SpO2' | 'Temperature';
  value: string;
  unit: string;
  status: 'Normal' | 'Elevated' | 'Check-in Needed';
  recordedAt: string;
  notes?: string;
}

export function HealthVitalsManager() {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const vitalsStorageKey = `carebridge_user_${userId}_vitals`;
  const stepsStorageKey = `carebridge_user_${userId}_steps`;

  const [vitals, setVitals] = useState<VitalsRecord[]>([]);
  const [steps, setSteps] = useState(0);
  const stepGoal = 6000;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [metricType, setMetricType] = useState<VitalsRecord['type']>('Blood Pressure');
  const [value, setValue] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedVitals = localStorage.getItem(vitalsStorageKey);
        if (storedVitals) {
          setVitals(JSON.parse(storedVitals));
        } else {
          setVitals([]);
        }
        const storedSteps = localStorage.getItem(stepsStorageKey);
        if (storedSteps) {
          setSteps(Number(storedSteps));
        } else {
          setSteps(0);
        }
      } catch (e) {
        console.error('Error loading vitals storage:', e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [vitalsStorageKey, stepsStorageKey]);

  const saveVitals = (updated: VitalsRecord[]) => {
    setVitals(updated);
    try {
      localStorage.setItem(vitalsStorageKey, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving vitals:', e);
    }
  };

  const handleAddVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value) return;

    let unit = 'mmHg';
    if (metricType === 'Heart Rate') unit = 'bpm';
    if (metricType === 'Blood Glucose') unit = 'mg/dL';
    if (metricType === 'Weight') unit = 'kg';
    if (metricType === 'SpO2') unit = '%';
    if (metricType === 'Temperature') unit = '°F';

    const newRecord: VitalsRecord = {
      id: 'vit_' + Date.now(),
      type: metricType,
      value,
      unit,
      status: 'Normal',
      recordedAt: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      notes,
    };

    saveVitals([newRecord, ...vitals]);
    setIsAddModalOpen(false);
    setValue('');
    setNotes('');
  };

  const handleUpdateSteps = (added: number) => {
    const newSteps = Math.max(0, steps + added);
    setSteps(newSteps);
    try {
      localStorage.setItem(stepsStorageKey, newSteps.toString());
    } catch (e) {
      console.error('Error saving steps:', e);
    }
  };

  const stepPercentage = Math.min(100, Math.round((steps / stepGoal) * 100));

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-100 text-teal-700">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Health Vitals &amp; Activity Tracker</h2>
            <p className="text-xs text-slate-500">Log blood pressure, glucose, vitals, and daily steps</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 active:scale-95 transition-all min-h-[48px]"
        >
          <Plus className="w-5 h-5" />
          <span>Record Vitals</span>
        </button>
      </div>

      {/* Steps & Activity Goal Card */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 text-white space-y-4 shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Footprints className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold">Daily Step Activity</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-500/20 text-teal-300 border border-teal-500/30 uppercase">
                  Manual Tracker
                </span>
              </div>
              <p className="text-xs text-slate-300">Goal: {stepGoal.toLocaleString()} steps / day</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleUpdateSteps(500)}
              className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow"
            >
              +500 Steps
            </button>
            <button
              onClick={() => handleUpdateSteps(1000)}
              className="px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow"
            >
              +1,000 Steps
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 relative z-10">
          <div className="flex justify-between text-xs font-semibold">
            <span>{steps.toLocaleString()} steps logged today</span>
            <span>{stepPercentage}% of Goal</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
            <div
              className="bg-gradient-to-r from-teal-400 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${stepPercentage}%` }}
            />
          </div>
        </div>

        {/* Smartwatch Integration Banner */}
        <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-300 flex items-center justify-between gap-2 relative z-10">
          <span className="flex items-center gap-1.5">
            <Watch className="w-4 h-4 text-teal-400" />
            <span>Future Smartwatch &amp; Wearable Direct Sync coming soon to CareBridge Mobile App</span>
          </span>
          <span className="text-teal-300 font-medium shrink-0">App Integration</span>
        </div>
      </div>

      {/* Recent Vitals Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-600" />
          <span>Latest Recorded Vitals</span>
        </h3>

        {vitals.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <Activity className="w-10 h-10 text-slate-400 mx-auto" />
            <div>
              <p className="text-base font-bold text-slate-800">No health records recorded yet.</p>
              <p className="text-xs text-slate-500 mt-1">Record blood pressure, glucose, pulse, or weight to track your wellness history.</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow hover:bg-teal-700"
            >
              Record Vitals
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {vitals.map((rec) => (
              <div key={rec.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>{rec.type}</span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px]">
                    {rec.status}
                  </span>
                </div>
                <p className="text-2xl font-black text-slate-900">
                  {rec.value} <span className="text-xs font-normal text-slate-500">{rec.unit}</span>
                </p>
                <p className="text-[11px] text-slate-400">{rec.recordedAt}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Medical Safety Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-600 text-xs flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <p>
          <strong>Health Disclaimer:</strong> Health vitals information is recorded by the user for wellness management purposes and does not constitute a medical diagnosis. Always discuss concerning readings or symptoms with a qualified physician or healthcare provider.
        </p>
      </div>

      {/* Record Vitals Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Activity className="w-5 h-5 text-teal-600" />
                <span>Record Health Vitals</span>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddVitals} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Metric Type *</label>
                <select
                  value={metricType}
                  onChange={(e) => setMetricType(e.target.value as VitalsRecord['type'])}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
                >
                  <option value="Blood Pressure">Blood Pressure (mmHg)</option>
                  <option value="Heart Rate">Heart Rate (bpm)</option>
                  <option value="Blood Glucose">Blood Glucose (mg/dL)</option>
                  <option value="Weight">Weight (kg)</option>
                  <option value="SpO2">SpO2 Blood Oxygen (%)</option>
                  <option value="Temperature">Body Temperature (°F)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Recorded Value *</label>
                <input
                  type="text"
                  required
                  placeholder={metricType === 'Blood Pressure' ? 'e.g. 120/80' : 'e.g. 72'}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notes / Context</label>
                <input
                  type="text"
                  placeholder="e.g. Fasting morning, rested 5 mins"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-3 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md shadow-teal-600/20"
                >
                  Save Measurement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
