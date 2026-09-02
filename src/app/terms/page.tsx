import React from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Terms of Service | CareBridge Platform',
  description: 'CareBridge terms of service governing website access, platform usage guidelines, and service limitations.',
  path: '/terms',
});

export default function TermsPage() {
  return (
    <div className="space-y-12 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Terms of Service', href: '/terms' }]} />
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 prose prose-slate">
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Terms of Service</h1>
          <p className="text-sm text-slate-500">Effective Date: August 31, 2026</p>
        </div>

        <section className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
          <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or using CareBridge website and platform services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the website.
          </p>

          <h2 className="text-xl font-bold text-slate-900">2. Non-Medical &amp; Non-Diagnostic Platform Notice</h2>
          <p className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
            CareBridge is an organizational, educational, and communication tool. CareBridge does NOT provide medical diagnosis, medical advice, treatment plans, or emergency dispatch services. Always seek the advice of your physician or other qualified healthcare provider for medical conditions.
          </p>

          <h2 className="text-xl font-bold text-slate-900">3. User Responsibilities</h2>
          <p>
            Users are responsible for maintaining the accuracy of medication schedules entered into the platform and for keeping account credentials confidential.
          </p>

          <h2 className="text-xl font-bold text-slate-900">4. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, CareBridge and its affiliates shall not be liable for any indirect, incidental, or consequential damages resulting from reliance on reminder schedules or information presented on the platform.
          </p>
        </section>

        <MedicalDisclaimerBanner variant="card" />
      </article>
    </div>
  );
}
