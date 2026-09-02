'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HeartHandshake, UserCheck, Users, Stethoscope, CheckCircle2, ArrowRight } from 'lucide-react';

export function AudienceTabs() {
  const [activeTab, setActiveTab] = useState<'caregivers' | 'patients' | 'families' | 'doctors'>('caregivers');

  const audiences = [
    {
      id: 'caregivers' as const,
      label: 'For Caregivers',
      icon: UserCheck,
      badge: 'Primary Support',
      title: 'Reduce Stress & Keep Daily Care Organised',
      description: 'CareBridge gives family caregivers a central hub for managing complex prescription schedules, tracking daily vitals, and keeping everyone updated without endless phone calls.',
      benefits: [
        'Automated medicine reminders with confirmation alerts',
        'Real-time vitals and daily wellness check-ins',
        'Centralized medical report storage & AI summaries',
        'One-tap emergency contact activation',
      ],
      quote: '"CareBridge transformed how I manage my mother’s daily medications. I no longer worry whether she took her morning pills."',
      quoteAuthor: 'Elena M., Family Caregiver',
      linkHref: '/for-caregivers',
    },
    {
      id: 'patients' as const,
      label: 'For Patients & Seniors',
      icon: HeartHandshake,
      badge: 'Senior Friendly',
      title: 'Simple, Readable Health Companion',
      description: 'Designed specifically with large readable typography, high-contrast buttons, and zero confusing menus so seniors can manage their health routines independently.',
      benefits: [
        'Clear, extra-large pill schedules with audible alerts',
        'Single-tap "Taken" medication confirmation button',
        'Easy access to emergency support contacts',
        'Friendly health information assistant for questions',
      ],
      quote: '"The screen is clear and easy to read. I press one button when I take my pills and my daughter instantly knows I am okay."',
      quoteAuthor: 'Robert K., 74 years old',
      linkHref: '/for-patients',
    },
    {
      id: 'families' as const,
      label: 'For Families',
      icon: Users,
      badge: 'Remote Connection',
      title: 'Stay Connected Across Any Distance',
      description: 'Whether you live down the street or across the country, CareBridge keeps siblings and extended family members synchronized on aging parents’ well-being.',
      benefits: [
        'Shared family care activity feed',
        'Transparent medication completion status',
        'Shared digital vault for medical test reports',
        'Collaborative task assignment for appointments',
      ],
      quote: '"Living three states away used to mean constant anxiety. Now my brother and I share care updates in real time."',
      quoteAuthor: 'David & Susan L., Long-Distance Children',
      linkHref: '/for-families',
    },
    {
      id: 'doctors' as const,
      label: 'For Doctors & Clinicians',
      icon: Stethoscope,
      badge: 'Clinical Insights',
      title: 'Actionable Health Data Between Visits',
      description: 'CareBridge helps patients and caregivers maintain clean, exportable medication logs and vitals trends so clinical consultations are more efficient and accurate.',
      benefits: [
        'Structured adherence history exports',
        'Longitudinal blood pressure and vitals trends',
        'Accurate updated master medication lists',
        'Clear emergency contact and directive logs',
      ],
      quote: '"When patients bring CareBridge log summaries to appointments, we save 15 minutes of reconciliation time."',
      quoteAuthor: 'Dr. Aris Vance, Primary Care Physician',
      linkHref: '/for-doctors',
    },
  ];

  const current = audiences.find((a) => a.id === activeTab)!;
  const Icon = current.icon;

  return (
    <div className="space-y-8">
      {/* Tabs selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-slate-200/80 border border-slate-300/60 max-w-3xl mx-auto">
        {audiences.map((aud) => {
          const TabIcon = aud.icon;
          const isActive = activeTab === aud.id;
          return (
            <button
              key={aud.id}
              onClick={() => setActiveTab(aud.id)}
              className={`flex items-center gap-2 py-3 px-4 sm:px-5 rounded-xl font-bold text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-600 ${
                isActive
                  ? 'bg-white text-teal-800 shadow-md border border-slate-200/80'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/50'
              }`}
            >
              <TabIcon className={`w-4 h-4 ${isActive ? 'text-teal-600' : 'text-slate-500'}`} />
              <span>{aud.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panel Content */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-semibold text-xs">
            <Icon className="w-3.5 h-3.5" />
            <span>{current.badge}</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-snug">
            {current.title}
          </h3>

          <p className="text-slate-600 text-base leading-relaxed">
            {current.description}
          </p>

          <div className="space-y-2.5 pt-2">
            {current.benefits.map((benefit, i) => (
              <div key={i} className="flex items-start gap-3 text-slate-800 text-sm sm:text-base font-medium">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Link
              href={current.linkHref}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 transition-all"
            >
              <span>Explore Solution Page</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/waitlist"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-bold text-sm text-teal-800 bg-teal-50 hover:bg-teal-100 transition-colors"
            >
              Join Waitlist
            </Link>
          </div>
        </div>

        {/* Right testimonial quote card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg border border-slate-700">
          <p className="text-xs uppercase tracking-wider font-bold text-teal-400">Caregiver Experience</p>
          <p className="text-base sm:text-lg italic leading-relaxed text-slate-200">
            {current.quote}
          </p>
          <div className="pt-2 border-t border-slate-700">
            <p className="font-bold text-sm text-white">{current.quoteAuthor}</p>
            <p className="text-xs text-slate-400 mt-0.5">Verified CareBridge Community Feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
}
