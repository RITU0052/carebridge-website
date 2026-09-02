'use client';

import React, { useState, useEffect } from 'react';
import { HeartHandshake, ShieldCheck, Plus, Trash2, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface CaregiverAccessRecord {
  id: string;
  name: string;
  email: string;
  role: 'Primary Caregiver' | 'Family Member' | 'Home Nurse' | 'Physician';
  accessLevel: 'Full Access' | 'Adherence Only' | 'Reports & Vitals Only';
  addedAt: string;
}

export function CaregiverPermissionsManager() {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const storageKey = `carebridge_user_${userId}_caregivers`;

  const [caregivers, setCaregivers] = useState<CaregiverAccessRecord[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<CaregiverAccessRecord['role']>('Primary Caregiver');
  const [accessLevel, setAccessLevel] = useState<CaregiverAccessRecord['accessLevel']>('Full Access');

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          setCaregivers(JSON.parse(stored));
        } else {
          setCaregivers([]);
        }
      } catch (e) {
        console.error('Error loading caregivers:', e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [storageKey]);

  const saveCaregivers = (updated: CaregiverAccessRecord[]) => {
    setCaregivers(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving caregivers:', e);
    }
  };

  const handleAddCaregiver = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newRecord: CaregiverAccessRecord = {
      id: 'cg_' + Date.now(),
      name,
      email,
      role,
      accessLevel,
      addedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    };

    saveCaregivers([...caregivers, newRecord]);
    setIsAddModalOpen(false);
    setName('');
    setEmail('');
  };

  const handleRemoveCaregiver = (id: string) => {
    const updated = caregivers.filter((c) => c.id !== id);
    saveCaregivers(updated);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-teal-100 text-teal-700">
            <HeartHandshake className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Caregiver &amp; Family Access Permissions</h2>
            <p className="text-xs text-slate-500">Grant or revoke access to medication status, vitals, and report logs</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 active:scale-95 transition-all min-h-[48px]"
        >
          <Plus className="w-5 h-5" />
          <span>Add Caregiver Access</span>
        </button>
      </div>

      {/* Caregivers List */}
      <div className="space-y-4">
        {caregivers.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <Users className="w-10 h-10 text-slate-400 mx-auto" />
            <div>
              <p className="text-base font-bold text-slate-800">No caregiver permissions granted yet.</p>
              <p className="text-xs text-slate-500 mt-1">You hold sole private access to this account. Grant read-only or full access to a family member.</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow hover:bg-teal-700"
            >
              Add Caregiver Access
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {caregivers.map((cg) => (
              <div
                key={cg.id}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-bold flex items-center justify-center text-lg shrink-0">
                    {cg.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-base">{cg.name}</h3>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                        {cg.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{cg.email} • Granted on {cg.addedAt}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-3 py-1 rounded-xl bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-teal-600" />
                    <span>{cg.accessLevel}</span>
                  </span>

                  <button
                    onClick={() => handleRemoveCaregiver(cg.id)}
                    className="p-2.5 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-rose-50 transition-colors"
                    title="Revoke Access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Caregiver Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <HeartHandshake className="w-5 h-5 text-teal-600" />
                <span>Grant Caregiver Access</span>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCaregiver} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Caregiver Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Caregiver Email *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role / Relationship *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as CaregiverAccessRecord['role'])}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
                >
                  <option value="Primary Caregiver">Primary Caregiver</option>
                  <option value="Family Member">Family Member</option>
                  <option value="Home Nurse">Home Nurse</option>
                  <option value="Physician">Physician</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Permission Level *</label>
                <select
                  value={accessLevel}
                  onChange={(e) => setAccessLevel(e.target.value as CaregiverAccessRecord['accessLevel'])}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white"
                >
                  <option value="Full Access">Full Access (Medicines, Vitals, Reports)</option>
                  <option value="Adherence Only">Adherence Only (Medication Status)</option>
                  <option value="Reports & Vitals Only">Reports &amp; Vitals Only</option>
                </select>
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
                  Grant Access
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
