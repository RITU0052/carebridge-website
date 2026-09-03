'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Send, CheckCircle2, MessageSquare, HeartHandshake, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function FeedbackPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<'General' | 'Feature Request' | 'Bug Report' | 'Medical Reminder' | 'App Feedback'>('General');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !message) {
      setError('Please fill in your name, email, and feedback message.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, rating, category, message }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      console.error('Feedback submit error:', err);
      setLoading(false);
      setError('An unexpected error occurred.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <Breadcrumbs items={[{ label: 'Feedback & Support', href: '/feedback' }]} />

        {/* Hero Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 text-white shadow-xl text-center space-y-3 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-teal-600/30 text-teal-300 border border-teal-500/30 flex items-center justify-center mx-auto mb-2">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">CareBridge Feedback Portal</h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Your feedback directly shapes our medicine reminders, AI health summaries, and elderly care platform. Tell us about your experience or request new features!
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200/80">
          {submitted ? (
            <div className="text-center py-10 space-y-6">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-slate-900">Feedback Submitted Successfully!</h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Thank you for helping us improve CareBridge. A confirmation email has been sent to <strong>{email}</strong>, and our team has been notified.
                </p>
              </div>

              <div className="pt-4 flex justify-center gap-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm"
                >
                  Submit Another Feedback
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow"
                >
                  Return to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Feedback Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as typeof category)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 text-sm bg-white"
                  >
                    <option value="General">General Feedback</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug Report">Bug / Issue Report</option>
                    <option value="Medical Reminder">Medicine &amp; Reminders</option>
                    <option value="App Feedback">Caregiver App Feedback</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Overall Satisfaction Rating
                  </label>
                  <div className="flex items-center gap-2 pt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform focus:outline-none"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-bold text-slate-600 ml-2">{rating}/5 Stars</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Detailed Feedback / Comments <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Share your thoughts, suggested features, or issues..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-base shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
              >
                {loading ? (
                  <span>Submitting Feedback...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Feedback &amp; Notify Support</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer Support Notice */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2 px-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Encrypted Feedback Channel</span>
          </div>
          <p>
            Questions? Email support directly:{' '}
            <a href="mailto:support.carebridge@gmail.com" className="text-teal-700 font-bold hover:underline">
              support.carebridge@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
