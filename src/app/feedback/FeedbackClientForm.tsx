'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Star, Send, CheckCircle2, MessageSquare, ShieldCheck, Bell, Smartphone, Mail, HelpCircle } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export function FeedbackClientForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [category, setCategory] = useState<'General' | 'Feature Request' | 'Bug Report' | 'Medical Reminder' | 'App Feedback'>('General');
  const [notificationPreference, setNotificationPreference] = useState<'whatsapp' | 'email' | 'both' | 'unsure'>('email');
  const [whatsappNumber, setWhatsappNumber] = useState('');
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
        body: JSON.stringify({
          name,
          email,
          rating,
          category,
          message,
          notificationPreference,
          whatsappNumber: (notificationPreference === 'whatsapp' || notificationPreference === 'both') ? whatsappNumber : '',
        }),
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
      setError('An unexpected error occurred. Please try again later.');
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
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Help Us Improve CareBridge</h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Your feedback directly shapes our medicine reminders, AI health summaries, and caregiver coordination tools. Share your thoughts, report issues, or suggest new features below!
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
                <h2 className="text-2xl font-black text-slate-900">Thank You for Your Feedback!</h2>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your response has been saved and forwarded to our notifications team (<strong>carebridge.notifications@gmail.com</strong>). A confirmation email has been dispatched to <strong>{email}</strong>.
                </p>
              </div>

              <div className="pt-4 flex justify-center gap-4 flex-wrap">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors"
                >
                  Submit Another Feedback
                </button>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow transition-colors"
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
                    placeholder="e.g. Ramesh Kumar"
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
                    placeholder="e.g. ramesh@example.com"
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

              {/* Dedicated Notification Preference Section */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-1 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-teal-600" />
                    <span>Notification Preference</span>
                  </label>
                  <p className="text-xs text-slate-600">
                    How would you prefer to receive medicine reminders and caregiver alert updates from CareBridge?
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      notificationPreference === 'email'
                        ? 'border-teal-600 bg-teal-50/70 ring-1 ring-teal-600'
                        : 'border-slate-200 bg-white hover:bg-slate-100/80'
                    }`}
                  >
                    <input
                      type="radio"
                      name="notificationPreference"
                      value="email"
                      checked={notificationPreference === 'email'}
                      onChange={() => setNotificationPreference('email')}
                      className="mt-1 text-teal-600 focus:ring-teal-600"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-teal-600" />
                        <span>Email Notifications</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">Reliable daily health summaries &amp; alerts</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      notificationPreference === 'whatsapp'
                        ? 'border-teal-600 bg-teal-50/70 ring-1 ring-teal-600'
                        : 'border-slate-200 bg-white hover:bg-slate-100/80'
                    }`}
                  >
                    <input
                      type="radio"
                      name="notificationPreference"
                      value="whatsapp"
                      checked={notificationPreference === 'whatsapp'}
                      onChange={() => setNotificationPreference('whatsapp')}
                      className="mt-1 text-teal-600 focus:ring-teal-600"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp Notifications</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">Direct instant messaging alerts</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      notificationPreference === 'both'
                        ? 'border-teal-600 bg-teal-50/70 ring-1 ring-teal-600'
                        : 'border-slate-200 bg-white hover:bg-slate-100/80'
                    }`}
                  >
                    <input
                      type="radio"
                      name="notificationPreference"
                      value="both"
                      checked={notificationPreference === 'both'}
                      onChange={() => setNotificationPreference('both')}
                      className="mt-1 text-teal-600 focus:ring-teal-600"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-amber-600" />
                        <span>Both Email &amp; WhatsApp</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">Maximum redundancy for critical reminders</p>
                    </div>
                  </label>

                  <label
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                      notificationPreference === 'unsure'
                        ? 'border-teal-600 bg-teal-50/70 ring-1 ring-teal-600'
                        : 'border-slate-200 bg-white hover:bg-slate-100/80'
                    }`}
                  >
                    <input
                      type="radio"
                      name="notificationPreference"
                      value="unsure"
                      checked={notificationPreference === 'unsure'}
                      onChange={() => setNotificationPreference('unsure')}
                      className="mt-1 text-teal-600 focus:ring-teal-600"
                    />
                    <div className="text-xs">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                        <span>Unsure / Ask Me Later</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">Default email setup will be used</p>
                    </div>
                  </label>
                </div>

                {/* Conditional WhatsApp Phone Number Field */}
                {(notificationPreference === 'whatsapp' || notificationPreference === 'both') && (
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                      WhatsApp Mobile Phone Number <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      placeholder="e.g. +91 9953920052"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 text-sm bg-white"
                    />
                    <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                      ⚠️ <strong>Note:</strong> Direct WhatsApp notification delivery is currently under evaluation and not yet active. We are collecting user preferences to prioritize official WhatsApp integration.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Detailed Feedback / Comments <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="Share your experience, medicine reminder feature requests, or suggestions to make CareBridge better..."
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
