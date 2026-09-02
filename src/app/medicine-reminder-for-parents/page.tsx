import React from 'react';
import Link from 'next/link';
import { HeartHandshake, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicineReminderPreview } from '@/components/previews/MedicineReminderPreview';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Medicine Reminder for Aging Parents | Remote Caregiver Platform',
  description: 'Help your aging parents manage daily pills and prescriptions remotely. Real-time adherence logs and caregiver peace of mind.',
  path: '/medicine-reminder-for-parents',
});

export default function MedicineReminderForParentsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <Breadcrumbs items={[{ label: 'Medicine Reminder for Parents', href: '/medicine-reminder-for-parents' }]} />

        {/* Hero */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold w-fit">
            <HeartHandshake className="w-4 h-4" />
            <span>Family Caregiver Solution</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Remotely Manage Medicine Schedules for Aging Parents
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Eliminate long-distance worry. Set up pill schedules, track daily adherence, and receive updates when parents take their doses.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-600/30 min-h-[52px]"
            >
              <span>Setup Schedule for Parents</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <MedicineReminderPreview />

        <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200/80 space-y-4 text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">Peace of Mind for Long-Distance Families</h2>
          <p>
            When adult children live in a different city or state, constantly calling to ask &quot;Did you take your pills?&quot; creates unnecessary tension. CareBridge provides a shared family hub where daily adherence is logged transparently.
          </p>
        </div>

        <MedicalDisclaimerBanner />
      </div>
    </main>
  );
}
