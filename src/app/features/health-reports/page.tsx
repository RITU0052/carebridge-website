import React from 'react';
import Link from 'next/link';
import { FileText, Sparkles, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { HealthReportPreview } from '@/components/previews/HealthReportPreview';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'CareBridge Health Reports | Digital Vault & AI Summaries',
  description: 'Organize lab reports, discharge papers, and medical records in a secure encrypted vault with plain-language AI explanations.',
  path: '/features/health-reports',
});

export default function HealthReportsPage() {
  return (
    <div className="space-y-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Features', href: '/features' },
            { label: 'Health Reports', href: '/features/health-reports' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
              <FileText className="w-4 h-4" />
              <span>Digital Health Vault Module</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Organize Medical Reports Digitally &amp; Understand Lab Results
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed">
              No more searching for misplaced paper lab tests. Upload medical reports into CareBridge’s encrypted vault and receive clear, plain-language AI summaries to prepare for doctor visits.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <Lock className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>256-bit AES encryption with strict user access control</span>
              </div>
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <Sparkles className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>AI-assisted plain-language summaries of medical terminology</span>
              </div>
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <ShieldCheck className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span>Instant PDF exports for consulting physicians</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/waitlist"
                className="px-6 py-3.5 rounded-full font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 inline-flex items-center gap-2"
              >
                <span>Join Waitlist for Health Vault</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <HealthReportPreview />
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
