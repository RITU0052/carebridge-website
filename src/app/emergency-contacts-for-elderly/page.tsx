import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmergencySupportPreview } from '@/components/previews/EmergencySupportPreview';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Emergency Contacts & Alert Dispatch for Elderly Seniors | CareBridge',
  description: 'One-tap emergency circle dispatch system for elderly parents. Alert designated primary caregivers and family contacts immediately.',
  path: '/emergency-contacts-for-elderly',
});

export default function EmergencyContactsForElderlyPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <Breadcrumbs items={[{ label: 'Emergency Contacts for Elderly', href: '/emergency-contacts-for-elderly' }]} />

        <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-rose-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold w-fit">
            <ShieldAlert className="w-4 h-4" />
            <span>Emergency Alert System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            One-Tap Emergency Alert System for Elderly Parents
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Configure primary emergency family contacts, caregivers, and doctors. Instant notification dispatch with location pin and vitals context.
          </p>

          <div className="pt-4 flex gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-lg min-h-[52px]"
            >
              <span>Setup Emergency Support Circle</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <EmergencySupportPreview />

        <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200/80 space-y-4 text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">Immediate Family Dispatch &amp; Notification</h2>
          <p>
            When an urgent situation occurs, seniors need a foolproof, single-tap way to alert their children or caregiver without navigating confusing phone menus.
          </p>
        </div>

        <MedicalDisclaimerBanner />
      </div>
    </main>
  );
}
