import React from 'react';
import Link from 'next/link';
import { Activity, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Health Monitoring for Elderly & Seniors | CareBridge Vitals Hub',
  description: 'Track blood pressure, blood glucose, heart rate, weight, and SpO2 for aging parents with simple trend logs and caregiver updates.',
  path: '/health-monitoring-for-elderly',
});

export default function HealthMonitoringForElderlyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <Breadcrumbs items={[{ label: 'Health Monitoring for Elderly', href: '/health-monitoring-for-elderly' }]} />

        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold w-fit">
            <Activity className="w-4 h-4" />
            <span>Senior Vitals Management</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Vitals &amp; Health Monitoring for Elderly Parents
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Record blood pressure readings, glucose levels, heart rate, and daily activity in one simple, clear dashboard.
          </p>

          <div className="pt-4 flex gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg min-h-[52px]"
            >
              <span>Start Vitals Log Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200/80 space-y-6 text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">Comprehensive Wellness Tracking</h2>
          <p>
            Keeping a consistent record of vital signs helps families identify concerning trends early and share reliable historical records with attending physicians.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
            {[
              { title: 'Blood Pressure', desc: 'Log Systolic/Diastolic readings with time & activity notes.' },
              { title: 'Blood Glucose', desc: 'Track fasting and post-meal blood sugar levels.' },
              { title: 'Heart Rate & SpO2', desc: 'Monitor resting pulse rate and blood oxygen percentages.' },
            ].map((item, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                <p className="text-xs text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <MedicalDisclaimerBanner />
      </div>
    </main>
  );
}
