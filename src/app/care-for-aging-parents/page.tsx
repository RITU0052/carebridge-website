import React from 'react';
import Link from 'next/link';
import { Users, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Care for Aging Parents | Health & Medication Coordination',
  description: 'Comprehensive guide and platform for adult children caring for aging parents. Simplify daily pills, lab reports, and emergency contacts.',
  path: '/care-for-aging-parents',
});

export default function CareForAgingParentsPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <Breadcrumbs items={[{ label: 'Care for Aging Parents', href: '/care-for-aging-parents' }]} />

        <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-teal-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold w-fit">
            <Users className="w-4 h-4" />
            <span>Family Coordination Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Caring for Aging Parents Made Simple &amp; Connected
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Ensure your parents receive proper medication adherence, vitals tracking, and immediate emergency contact support.
          </p>

          <div className="pt-4 flex gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg min-h-[52px]"
            >
              <span>Get Started with CareBridge</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200/80 space-y-4 text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">A Compassionate Digital Safety Net</h2>
          <p>
            Caring for aging parents requires empathy, reliable information, and modern technology that respects senior dignity while providing family oversight.
          </p>
        </div>

        <MedicalDisclaimerBanner />
      </div>
    </main>
  );
}
