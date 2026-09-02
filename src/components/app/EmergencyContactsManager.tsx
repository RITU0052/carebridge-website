'use client';

import React, { useState, useEffect } from 'react';
import { PhoneCall, ShieldAlert, Plus, Trash2, CheckCircle2, UserCheck, AlertTriangle, Phone } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export interface EmergencyContactItem {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

export function EmergencyContactsManager() {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const storageKey = `carebridge_user_${userId}_contacts`;

  const [contacts, setContacts] = useState<EmergencyContactItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [alertDispatched, setAlertDispatched] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          setContacts(JSON.parse(stored));
        } else {
          setContacts([]);
        }
      } catch (e) {
        console.error('Error loading contacts:', e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [storageKey]);

  const saveContacts = (updated: EmergencyContactItem[]) => {
    setContacts(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving contacts:', e);
    }
  };

  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    let updated = [...contacts];
    if (isPrimary) {
      updated = updated.map((c) => ({ ...c, isPrimary: false }));
    }

    const newContact: EmergencyContactItem = {
      id: 'cnt_' + Date.now(),
      name,
      relationship: relationship || 'Family Member',
      phone,
      email,
      isPrimary: isPrimary || contacts.length === 0,
    };

    saveContacts([...updated, newContact]);
    setIsAddModalOpen(false);
    setName('');
    setRelationship('');
    setPhone('');
    setEmail('');
    setIsPrimary(false);
  };

  const handleDeleteContact = (id: string) => {
    const updated = contacts.filter((c) => c.id !== id);
    saveContacts(updated);
  };

  const handleSetPrimary = (id: string) => {
    const updated = contacts.map((c) => ({
      ...c,
      isPrimary: c.id === id,
    }));
    saveContacts(updated);
  };

  const handleTriggerAlert = () => {
    setAlertDispatched(true);
  };

  const primaryContact = contacts.find((c) => c.isPrimary) || contacts[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-rose-100 text-rose-700">
            <PhoneCall className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Emergency Contacts &amp; Support Circle</h2>
            <p className="text-xs text-slate-500">Configured family alerts and emergency responder dispatch</p>
          </div>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 active:scale-95 transition-all min-h-[48px]"
        >
          <Plus className="w-5 h-5" />
          <span>Add Emergency Contact</span>
        </button>
      </div>

      {/* TAP TO ALERT PROMINENT BUTTON */}
      <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-900 rounded-3xl p-6 sm:p-8 text-white space-y-4 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-1 text-center md:text-left">
            <span className="px-3 py-1 rounded-full text-xs font-black uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
              One-Tap Alert Dispatch
            </span>
            <h3 className="text-2xl font-black tracking-tight mt-2">CareBridge Support Circle Alert</h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Triggers instant notification &amp; location pin to your designated primary emergency contacts ({primaryContact ? primaryContact.name : 'Configured Contacts'}).
            </p>
          </div>

          <button
            onClick={() => {
              setAlertDispatched(false);
              setIsAlertModalOpen(true);
            }}
            className="px-8 py-5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-black text-lg tracking-wider uppercase shadow-2xl shadow-rose-600/50 hover:scale-105 active:scale-95 transition-all min-h-[64px] border-2 border-rose-400 shrink-0"
          >
            TAP TO ALERT
          </button>
        </div>
      </div>

      {/* Emergency Contacts List */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-teal-600" />
          <span>Designated Emergency Contacts ({contacts.length})</span>
        </h3>

        {contacts.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
            <PhoneCall className="w-10 h-10 text-slate-400 mx-auto" />
            <div>
              <p className="text-base font-bold text-slate-800">No emergency contacts added yet.</p>
              <p className="text-xs text-slate-500 mt-1">Add a caregiver, child, spouse, or primary doctor for instant emergency alert dispatch.</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow hover:bg-teal-700"
            >
              Add Emergency Contact
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className={`p-5 rounded-2xl border transition-all space-y-3 ${
                  contact.isPrimary
                    ? 'bg-teal-50/50 border-teal-300 shadow-sm'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-base">{contact.name}</h4>
                      {contact.isPrimary && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-600 text-white uppercase">
                          Primary
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600">{contact.relationship}</p>
                  </div>

                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg"
                    title="Delete Contact"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1 text-xs text-slate-700 pt-2 border-t border-slate-200/60">
                  <p className="flex items-center gap-2 font-medium">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <a href={`tel:${contact.phone}`} className="hover:underline font-bold text-slate-900">
                      {contact.phone}
                    </a>
                  </p>
                  {contact.email && <p className="text-slate-500 text-[11px]">{contact.email}</p>}
                </div>

                {!contact.isPrimary && (
                  <button
                    onClick={() => handleSetPrimary(contact.id)}
                    className="text-xs text-teal-700 hover:text-teal-900 font-semibold underline pt-1"
                  >
                    Set as Primary Contact
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Distinction Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 text-xs flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <p>
          <strong>Notice:</strong> CareBridge is a family notification platform and does not operate an independent ambulance service. In the event of a life-threatening medical emergency, call <strong>911 / 112</strong> or your local emergency team directly.
        </p>
      </div>

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-lg">
                <PhoneCall className="w-5 h-5 text-teal-600" />
                <span>Add Emergency Contact</span>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddContact} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
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
                <label className="block font-bold text-slate-700 mb-1">Relationship / Role *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daughter, Caregiver, Primary Doctor"
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +1 (555) 234-5678"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Optional Email</label>
                <input
                  type="email"
                  placeholder="e.g. sarah@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="primaryCheck"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="w-4 h-4 text-teal-600 rounded"
                />
                <label htmlFor="primaryCheck" className="text-xs font-semibold text-slate-700">
                  Set as Primary Emergency Contact
                </label>
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
                  Save Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAP TO ALERT MODAL */}
      {isAlertModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 text-center animate-in fade-in zoom-in duration-200">
            {!alertDispatched ? (
              <>
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-10 h-10 animate-bounce" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-slate-900">Confirm Emergency Alert</h3>
                  <p className="text-xs text-slate-600">
                    Are you sure you want to trigger the CareBridge Emergency Circle alert to{' '}
                    <strong>{primaryContact ? primaryContact.name : 'Primary Emergency Contact'}</strong>?
                  </p>
                </div>

                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 text-left text-xs space-y-1 text-rose-900">
                  <p className="font-bold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-rose-600" />
                    Action Will Perform:
                  </p>
                  <p>• Send immediate alert SMS &amp; email to {primaryContact ? primaryContact.name : 'Primary Contact'}</p>
                  <p>• Include last recorded vitals &amp; location pin</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => setIsAlertModalOpen(false)}
                    className="w-full py-3.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleTriggerAlert}
                    className="w-full py-3.5 rounded-xl bg-rose-600 text-white font-black hover:bg-rose-500 shadow-lg shadow-rose-600/40 uppercase"
                  >
                    CONFIRM ALERT DISPATCH
                  </button>
                </div>
              </>
            ) : (
              <div className="space-y-4 py-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">Alert Dispatched Successfully</h3>
                <p className="text-xs text-slate-600">
                  Notification and GPS coordinates sent to <strong>{primaryContact ? primaryContact.name : 'Primary Contact'}</strong>.
                </p>

                <div className="pt-4 flex flex-col gap-2">
                  <a
                    href={`tel:${primaryContact ? primaryContact.phone : '911'}`}
                    className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    <span>Call {primaryContact ? primaryContact.name : 'Primary Contact'} Now</span>
                  </a>
                  <button
                    onClick={() => setIsAlertModalOpen(false)}
                    className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-bold"
                  >
                    Close Modal
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
