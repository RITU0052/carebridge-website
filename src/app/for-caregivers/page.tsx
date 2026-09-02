import React from 'react';
import Link from 'next/link';
import { UserCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { CaregiverDashboardPreview } from '@/components/previews/CaregiverDashboardPreview';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'CareBridge for Caregivers | Reduce Stress & Simplify Daily Care',
  description: 'Built specifically for family caregivers. CareBridge provides real-time dose status updates, vitals logs, and shared family activity feeds.',
  path: '/for-caregivers',
});

export default function ForCaregiversPage() {
  return (
    <div className="space-y-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'For Caregivers', href: '/for-caregivers' }]} />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
              <UserCheck className="w-4 h-4" />
              <span>Caregiver Support Solution</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Reduce Caregiver Stress &amp; Never Worry About Missed Dose Schedules
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed">
              Family caregiving is an act of love, but managing daily medications, doctor visits, and vitals shouldn’t cause burnout. CareBridge gives you a central dashboard for total clarity.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>Real-time medication confirmation feed</span>
              </div>
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>Shared task lists between siblings and home aides</span>
              </div>
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>Encrypted medical document vault for appointments</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/waitlist"
                className="px-6 py-3.5 rounded-full font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 inline-flex items-center gap-2"
              >
                <span>Join Caregiver Waitlist</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <CaregiverDashboardPreview />
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
