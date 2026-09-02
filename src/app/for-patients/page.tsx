import React from 'react';
import Link from 'next/link';
import { HeartHandshake, CheckCircle2, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicineReminderPreview } from '@/components/previews/MedicineReminderPreview';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'CareBridge for Patients & Seniors | Simple Readable Health Companion',
  description: 'Easy-to-use medicine reminders and daily health check-in companion for senior parents and independent patients.',
  path: '/for-patients',
});

export default function ForPatientsPage() {
  return (
    <div className="space-y-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'For Patients', href: '/for-patients' }]} />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
              <HeartHandshake className="w-4 h-4" />
              <span>Senior &amp; Patient Companion</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Easy, Clear Health Companion Built for Senior Independence
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed">
              No small print or confusing buttons. CareBridge provides large readable typography and a single-tap &ldquo;Taken&rdquo; button so you can take your medications confidently and let your family know you are okay.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>Extra-large readable fonts and high-contrast buttons</span>
              </div>
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>One-tap confirmation updates your children automatically</span>
              </div>
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>Easy access to emergency support contacts</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/waitlist"
                className="px-6 py-3.5 rounded-full font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 inline-flex items-center gap-2"
              >
                <span>Join Patient Waitlist</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <MedicineReminderPreview />
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
