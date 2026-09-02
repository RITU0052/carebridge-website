'use client';

import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

interface WaitlistFormProps {
  compact?: boolean;
}

export function WaitlistForm({ compact = false }: WaitlistFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('Caregiver');
  const [featureInterest, setFeatureInterest] = useState('Medicine Reminders');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Please provide your name and email address.');
      return;
    }

    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, userType, featureInterest, notes }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 text-center space-y-4 shadow-sm animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">You’re on the CareBridge List!</h3>
        <p className="text-slate-700 text-base max-w-md mx-auto leading-relaxed">
          Thank you, <strong>{name}</strong>. We’ve received your waitlist application as a <strong>{userType}</strong>. We’ll notify you at <strong>{email}</strong> as early access spots open.
        </p>
        <div className="pt-2 text-xs text-slate-500 flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Your privacy is protected. No spam ever.</span>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="space-y-3">
        {error && (
          <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white flex-1"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white flex-1"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-all focus:ring-2 focus:ring-teal-600 flex items-center justify-center gap-2 min-h-[48px] shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join Waitlist'}
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-slate-900">Join the CareBridge Early Access List</h3>
        <p className="text-slate-600 text-sm">
          Be among the first caregivers and families to experience effortless medication scheduling and remote health peace of mind.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Full Name *
          </label>
          <input
            type="text"
            placeholder="e.g. Sarah Jenkins"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-teal-600 bg-slate-50/50"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            placeholder="e.g. sarah@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-teal-600 bg-slate-50/50"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          I am registering as a: *
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {['Caregiver', 'Patient', 'Family Member', 'Doctor', 'Other'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setUserType(type)}
              className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                userType === type
                  ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Feature You Care Most About:
        </label>
        <select
          value={featureInterest}
          onChange={(e) => setFeatureInterest(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-teal-600 bg-slate-50/50"
        >
          <option value="Medicine Reminders">Medicine Schedules &amp; Reminders</option>
          <option value="Health Monitoring">Daily Health &amp; Vitals Monitoring</option>
          <option value="Health Reports">Digital Health Report Storage</option>
          <option value="Emergency Support">Emergency Contact &amp; Alert Circle</option>
          <option value="AI Health Assistant">AI-Assisted Health Information</option>
          <option value="Full CareBridge Platform">All Platform Features</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
          Optional Notes / Caregiver Needs:
        </label>
        <textarea
          rows={2}
          placeholder="Tell us briefly about your caregiving routine or family health goals..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-slate-900 text-base focus:outline-none focus:ring-2 focus:ring-teal-600 bg-slate-50/50"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base shadow-lg shadow-teal-600/25 transition-all focus:outline-none focus:ring-2 focus:ring-teal-600 flex items-center justify-center gap-2 min-h-[52px]"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <span>Join CareBridge Waitlist</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>

      <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-2 pt-1">
        <ShieldCheck className="w-4 h-4 text-teal-600" />
        <span>100% Free &amp; Private. We will never share your personal health information.</span>
      </div>
    </form>
  );
}
