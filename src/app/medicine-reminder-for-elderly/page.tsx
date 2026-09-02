import React from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicineReminderPreview } from '@/components/previews/MedicineReminderPreview';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { JsonLd } from '@/components/ui/JsonLd';
import { constructMetadata, generateFaqSchema } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Medicine Reminder for Elderly Parents & Seniors | CareBridge',
  description: 'Elder-friendly medication reminder app and web platform designed for seniors with large text, clear timing, and caregiver monitoring.',
  path: '/medicine-reminder-for-elderly',
});

const FAQS = [
  {
    question: 'Why is CareBridge ideal for elderly seniors?',
    answer: 'CareBridge features high-contrast typography, 48px+ large touch buttons, clear food instructions, and simple Taken/Missed status logging.',
  },
  {
    question: 'How do adult children monitor medication adherence for aging parents?',
    answer: 'Family caregivers can log into CareBridge or receive adherence updates to verify whether doses were taken on schedule.',
  },
];

export default function MedicineReminderForElderlyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <JsonLd data={generateFaqSchema(FAQS)} />
      <div className="max-w-5xl mx-auto space-y-12">
        <Breadcrumbs items={[{ label: 'Medicine Reminder for Elderly', href: '/medicine-reminder-for-elderly' }]} />

        {/* Hero */}
        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold w-fit">
            <Heart className="w-4 h-4" />
            <span>Elderly Care Solution</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Simple, Stress-Free Medicine Reminder for Elderly Parents
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Designed specifically for seniors and long-distance caregivers to ensure prescriptions are taken safely, on time, every day.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-600/30 active:scale-95 transition-all min-h-[52px]"
            >
              <span>Setup Senior Reminder Profile</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors min-h-[52px]"
            >
              <span>View Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Interactive Preview */}
        <MedicineReminderPreview />

        {/* Informational Content */}
        <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200/80 space-y-6 text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">Overcoming Medication Challenges in Aging Adults</h2>
          <p>
            As parents age, managing complex prescription regimens becomes more challenging. Memory loss, arthritis, or confusing dosing times often lead to missed medication or accidental double-dosing.
          </p>

          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Large Text &amp; High-Contrast Interface</h3>
                <p className="text-xs text-slate-600 mt-0.5">Optimized font sizes and readable colors ensure elderly users can view their daily schedule effortlessly.</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-100 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Clear Food &amp; Water Instructions</h3>
                <p className="text-xs text-slate-600 mt-0.5">Every dose clearly highlights whether it should be taken Before Food, After Food, or With Water.</p>
              </div>
            </div>
          </div>
        </div>

        <MedicalDisclaimerBanner />
      </div>
    </main>
  );
}
