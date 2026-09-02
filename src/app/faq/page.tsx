import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { JsonLd } from '@/components/ui/JsonLd';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { faqs } from '@/data/faqs';
import { constructMetadata, generateFaqSchema } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'CareBridge FAQ | Frequently Asked Questions',
  description: 'Find answers to common questions about CareBridge medicine reminders, caregiver monitoring, data security, and medical disclaimers.',
  path: '/faq',
});

export default function FaqPage() {
  return (
    <>
      <JsonLd data={generateFaqSchema(faqs)} />
      <div className="space-y-16 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: 'FAQ', href: '/faq' }]} />
        </div>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <SectionHeader
            badge="Help Center"
            title="Frequently Asked Questions"
            subtitle="Have questions about how CareBridge works? Here are answers to common caregiver and patient questions."
          />
          <FAQAccordion items={faqs} />
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <MedicalDisclaimerBanner variant="card" />
        </section>
      </div>
    </>
  );
}
