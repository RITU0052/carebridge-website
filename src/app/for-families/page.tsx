import React from 'react';
import Link from 'next/link';
import { Users, CheckCircle2, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmergencySupportPreview } from '@/components/previews/EmergencySupportPreview';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'CareBridge for Families | Remote Connection Across Any Distance',
  description: 'CareBridge keeps siblings and long-distance family members synchronized on aging parents’ medication adherence and health status.',
  path: '/for-families',
});

export default function ForFamiliesPage() {
  return (
    <div className="space-y-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'For Families', href: '/for-families' }]} />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
              <Users className="w-4 h-4" />
              <span>Family Circle Solution</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Stay Connected to Your Parents’ Health Across Any Distance
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed">
              Living in different cities shouldn’t mean feeling disconnected from your aging parents’ daily health routine. CareBridge brings siblings together with a transparent shared status feed.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>Shared activity feed for medication confirmations</span>
              </div>
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>Divide responsibilities (prescriptions, doctor visits, labs)</span>
              </div>
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>One-tap emergency broadcast notifications</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/waitlist"
                className="px-6 py-3.5 rounded-full font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 inline-flex items-center gap-2"
              >
                <span>Join Family Waitlist</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <EmergencySupportPreview />
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
