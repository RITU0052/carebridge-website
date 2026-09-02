import React from 'react';
import Link from 'next/link';
import { Activity, Heart, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CaregiverDashboardPreview } from '@/components/previews/CaregiverDashboardPreview';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'CareBridge Health Monitoring | Daily Vitals & Wellness Tracking',
  description: 'Log and track daily blood pressure, blood glucose, steps, and wellness trends with CareBridge family health monitoring.',
  path: '/features/health-monitoring',
});

export default function HealthMonitoringPage() {
  return (
    <div className="space-y-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Features', href: '/features' },
            { label: 'Health Monitoring', href: '/features/health-monitoring' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-bold text-xs">
              <Activity className="w-4 h-4" />
              <span>Vitals &amp; Wellness Module</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Track Daily Vitals &amp; Detect Health Shifts Early
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed">
              CareBridge helps seniors and caregivers log blood pressure, glucose readings, daily steps, and general mood—creating clear visual trends for clinical checkups.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <span>Simple entry form for blood pressure, pulse, and blood sugar</span>
              </div>
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <span>Weekly &amp; monthly visual trend charts</span>
              </div>
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                <span>Exportable summaries for doctor appointments</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/waitlist"
                className="px-6 py-3.5 rounded-full font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 inline-flex items-center gap-2"
              >
                <span>Join Waitlist for Health Monitoring</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <CaregiverDashboardPreview />
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeader
            badge="Key Metrics"
            title="What You Can Track With CareBridge"
            subtitle="Essential daily wellness indicators."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Blood Pressure &amp; Heart Rate</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Log morning and evening systolic/diastolic readings with automatic color-coded reference indicators.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Blood Glucose Trends</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Record fasting and post-meal blood sugar levels for diabetic care coordination.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Mobility &amp; Mood Check-Ins</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Track daily physical steps and log subjective energy levels to monitor general well-being.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Notice */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <MedicalDisclaimerBanner variant="card" />
      </section>
    </div>
  );
}
