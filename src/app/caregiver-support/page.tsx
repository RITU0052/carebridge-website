import React from 'react';
import Link from 'next/link';
import { HeartHandshake, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CaregiverDashboardPreview } from '@/components/previews/CaregiverDashboardPreview';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Caregiver Support Tools & Family Coordination | CareBridge',
  description: 'Digital tools for family caregivers. Track medication adherence, monitor vitals, store medical reports, and share caregiving responsibilities.',
  path: '/caregiver-support',
});

export default function CaregiverSupportPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <Breadcrumbs items={[{ label: 'Caregiver Support', href: '/caregiver-support' }]} />

        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold w-fit">
            <HeartHandshake className="w-4 h-4" />
            <span>Caregiver Empowerment</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Empowering Family Caregivers with Smart Health Tools
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Reduce caregiver burnout. CareBridge organizes medication logs, vitals history, and medical records into one collaborative family dashboard.
          </p>

          <div className="pt-4 flex gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg min-h-[52px]"
            >
              <span>Setup Caregiver Workspace</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <CaregiverDashboardPreview />

        <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200/80 space-y-4 text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">Preventing Caregiver Burnout</h2>
          <p>
            Juggling doctor appointments, daily medication doses, and medical history across multiple family members is stressful. CareBridge brings organization and clarity to caregiving.
          </p>
        </div>

        <MedicalDisclaimerBanner />
      </div>
    </main>
  );
}
