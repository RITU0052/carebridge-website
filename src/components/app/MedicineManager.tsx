'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Pill, Plus, CheckCircle2, XCircle, Clock, Trash2, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface MedicineItem {
  id: string;
  name: string;
  dose: string;
  condition: string;
  time: string;
  frequency: string;
  instruction: 'Before Food' | 'After Food' | 'With Water' | 'Anytime';
  startDate: string;
  endDate?: string;
  notes?: string;
  status: 'Pending' | 'Taken' | 'Missed';
  lastUpdated?: string;
}

export function MedicineManager() {
  const { user } = useAuth();
  const userId = user?.id || 'usr_demo_1';

  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [activeTab, setActiveTab] = useState<'today' | 'all' | 'history'>('today');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Medicine Form State
  const [name, setName] = useState('');
  const [dose, setDose] = useState('');
  const [condition, setCondition] = useState('');
  const [time, setTime] = useState('08:00 AM');
  const [instruction, setInstruction] = useState<'Before Food' | 'After Food' | 'With Water' | 'Anytime'>('After Food');
  const [notes, setNotes] = useState('');

  const fetchMedicines = useCallback(async () => {
    try {
      const res = await fetch(`/api/medicines?userId=${userId}`);
      const data = await res.json();
      if (data.success && data.medicines) {
        // Map backend record to component model
        const mapped: MedicineItem[] = data.medicines.map((m: { id: string; name: string; dosage: string; frequency: string; times: string[]; startDate: string; notes?: string }) => ({
          id: m.id,
          name: m.name,
          dose: m.dosage,
          condition: 'General Health',
          time: m.times && m.times.length > 0 ? m.times[0] : '09:00 AM',
          frequency: m.frequency || 'Daily',
          instruction: 'After Food',
          startDate: m.startDate,
          notes: m.notes,
          status: 'Pending',
        }));
        setMedicines(mapped);
      }
    } catch (err) {
      console.error('Error fetching medicines:', err);
    }
  }, [userId]);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dose) return;

    try {
      const res = await fetch('/api/medicines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name,
          dosage: dose,
          frequency: 'Daily',
          times: [time || '09:00 AM'],
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchMedicines();
      }
    } catch (err) {
      console.error('Error saving medicine to API:', err);
    }

    setIsAddModalOpen(false);
    setName('');
    setDose('');
    setCondition('');
    setNotes('');
  };

  const handleToggleStatus = (id: string, newStatus: 'Taken' | 'Missed' | 'Pending') => {
    setMedicines((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          return {
            ...m,
            status: newStatus,
            lastUpdated: newStatus === 'Taken' ? `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : m.lastUpdated,
          };
        }
        return m;
      })
    );
  };

  const handleDeleteMedicine = async (id: string) => {
    setMedicines((prev) => prev.filter((m) => m.id !== id));
    try {
      await fetch(`/api/medicines?id=${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Error deleting medicine from API:', err);
    }
  };

  const filteredMedicines = medicines.filter((m) => {
    if (activeTab === 'today') return true;
    if (activeTab === 'all') return true;
    if (activeTab === 'history') return m.status === 'Taken' || m.status === 'Missed';
    return true;
  });

  const takenCount = medicines.filter((m) => m.status === 'Taken').length;
  const pendingCount = medicines.filter((m) => m.status === 'Pending').length;
  const missedCount = medicines.filter((m) => m.status === 'Missed').length;

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-100 text-teal-700">
            <Pill className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Medicine &amp; Reminder Hub</h2>
            <p className="text-xs text-slate-500">Track doses, schedules, and daily adherence history</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 active:scale-95 transition-all min-h-[48px]"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Medicine</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">Taken</p>
            <p className="text-2xl font-extrabold mt-1">{takenCount}</p>
          </div>
          <CheckCircle2 className="w-8 h-8 text-emerald-600 opacity-80" />
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-700">Pending</p>
            <p className="text-2xl font-extrabold mt-1">{pendingCount}</p>
          </div>
          <Clock className="w-8 h-8 text-amber-600 opacity-80" />
        </div>

        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200/80 text-rose-900 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-rose-700">Missed</p>
            <p className="text-2xl font-extrabold mt-1">{missedCount}</p>
          </div>
          <XCircle className="w-8 h-8 text-rose-600 opacity-80" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('today')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'today'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Today&apos;s Schedule ({medicines.length})
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-colors ${
            activeTab === 'history'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Adherence Log
        </button>
      </div>

      {/* Medicine List */}
      <div className="space-y-4">
        {filteredMedicines.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <Pill className="w-10 h-10 text-slate-400 mx-auto" />
            <div>
              <p className="text-base font-bold text-slate-800">No medicines added yet.</p>
              <p className="text-xs text-slate-500 mt-1">Start tracking your daily medication schedule for full peace of mind.</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow hover:bg-teal-700"
            >
              Add Medicine
            </button>
          </div>
        ) : (
          filteredMedicines.map((med) => (
            <div
              key={med.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                med.status === 'Taken'
                  ? 'bg-emerald-50/40 border-emerald-200'
                  : med.status === 'Missed'
                  ? 'bg-rose-50/40 border-rose-200'
                  : 'bg-white border-slate-200 hover:border-teal-300 shadow-sm'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl text-white font-bold text-xs shrink-0 flex flex-col items-center justify-center min-w-[56px] min-h-[56px] ${
                    med.status === 'Taken'
                      ? 'bg-emerald-600'
                      : med.status === 'Missed'
                      ? 'bg-rose-600'
                      : 'bg-teal-600'
                  }`}
                >
                  <Clock className="w-4 h-4 mb-0.5" />
                  <span className="text-[11px] leading-none">{med.time}</span>
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-extrabold text-slate-900">{med.name}</h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                      {med.dose}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      {med.instruction}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mt-1">
                    Condition: <strong className="text-slate-800">{med.condition}</strong> • Frequency: {med.frequency}
                  </p>

                  {med.notes && (
                    <p className="text-xs text-slate-500 mt-1 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      &quot;{med.notes}&quot;
                    </p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0">
                {med.status === 'Pending' ? (
                  <>
                    <button
                      onClick={() => handleToggleStatus(med.id, 'Taken')}
                      className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all min-h-[44px]"
                    >
                      <Check className="w-4 h-4" />
                      <span>Mark Taken</span>
                    </button>
                    <button
                      onClick={() => handleToggleStatus(med.id, 'Missed')}
                      className="px-3 py-2.5 rounded-xl bg-rose-100 hover:bg-rose-200 text-rose-800 font-bold text-xs flex items-center gap-1 min-h-[44px]"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Missed</span>
                    </button>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 ${
                        med.status === 'Taken'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {med.status === 'Taken' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-rose-600" />}
                      <span>{med.status} {med.lastUpdated ? `(${med.lastUpdated})` : ''}</span>
                    </span>

                    <button
                      onClick={() => handleToggleStatus(med.id, 'Pending')}
                      className="text-xs text-slate-500 hover:text-slate-800 underline px-2 py-1"
                    >
                      Reset
                    </button>
                  </div>
                )}

                <button
                  onClick={() => handleDeleteMedicine(med.id)}
                  className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                  title="Delete Medicine"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Medicine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <Pill className="w-5 h-5 text-teal-600" />
                <span>Add Medicine Schedule</span>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddMedicine} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Medicine Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lisinopril, Metformin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Dose *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 500 mg, 1 tablet"
                    value={dose}
                    onChange={(e) => setDose(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Scheduled Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 08:00 AM"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Condition / Purpose</label>
                  <input
                    type="text"
                    placeholder="e.g. Blood Pressure, Diabetes"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Instruction</label>
                  <select
                    value={instruction}
                    onChange={(e) => setInstruction(e.target.value as MedicineItem['instruction'])}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
                  >
                    <option value="After Food">After Food</option>
                    <option value="Before Food">Before Food</option>
                    <option value="With Water">With Water</option>
                    <option value="Anytime">Anytime</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Special Notes / Instructions</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Take after full dinner with warm water."
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
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
