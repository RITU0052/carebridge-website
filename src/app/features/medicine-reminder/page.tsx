import React from 'react';
import Link from 'next/link';
import { Pill, CheckCircle2, Clock, Bell, ShieldCheck, ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicineReminderPreview } from '@/components/previews/MedicineReminderPreview';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'CareBridge Medicine Reminders | Medication Schedules for Seniors',
  description: 'Never miss a dose again. CareBridge medicine reminders provide large readable pill schedules, audio alerts, and real-time caregiver status updates.',
  path: '/features/medicine-reminder',
});

export default function MedicineReminderPage() {
  return (
    <div className="space-y-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Features', href: '/features' },
            { label: 'Medicine Reminders', href: '/features/medicine-reminder' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
              <Pill className="w-4 h-4" />
              <span>Medication Schedule Module</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Medication Reminders Designed for Senior Simplicity
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed">
              Managing complex daily prescriptions should never cause anxiety. CareBridge delivers large-text prompts, audio alerts, and instant dose status confirmation to keep family members reassured.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>Large readable typography &amp; high-contrast tap targets</span>
              </div>
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>Custom dosing instructions (e.g. &ldquo;Take with morning breakfast&rdquo;)</span>
              </div>
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>Instant status sync to long-distance caregiver smartphones</span>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              <Link
                href="/waitlist"
                className="px-6 py-3.5 rounded-full font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 flex items-center gap-2"
              >
                <span>Get Early Access</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <MedicineReminderPreview />
          </div>
        </div>
      </section>

      {/* Feature Breakdown */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <SectionHeader
            badge="Detailed Capabilities"
            title="How CareBridge Solves Pill Confusion"
            subtitle="Built to eliminate double-dosing and missed prescriptions."
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Custom Time Windows</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Configure precise morning, afternoon, evening, and bedtime pill schedules aligned with meal routines.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Caregiver Missed-Dose Alerts</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                If a pill schedule passes 30 minutes without confirmation, CareBridge sends a non-intrusive alert to family members.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Refill Tracking</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Track remaining pill counts and receive timely prompts before prescriptions run out.
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
