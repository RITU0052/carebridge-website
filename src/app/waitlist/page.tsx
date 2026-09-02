import React from 'react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { WaitlistForm } from '@/components/ui/WaitlistForm';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Join CareBridge Waitlist | Early Access for Families & Caregivers',
  description: 'Be among the first caregivers and families to access CareBridge medication reminders, health monitoring, and digital report tools.',
  path: '/waitlist',
});

export default function WaitlistPage() {
  return (
    <div className="space-y-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Join Waitlist', href: '/waitlist' }]} />
      </div>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <SectionHeader
          badge="Free Early Access"
          title="Get Early Access to CareBridge"
          subtitle="Join thousands of family caregivers and seniors reserving early platform access."
        />

        <WaitlistForm />
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <MedicalDisclaimerBanner variant="card" />
      </section>
    </div>
  );
}
