import React from 'react';
import { HeartHandshake, ShieldCheck, Users } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'About CareBridge | Healthcare & Caregiver Support Platform',
  description: 'Learn about CareBridge’s mission to support family caregivers, elderly seniors, and healthcare teams with simple, clear digital tools.',
  path: '/about',
});

export default function AboutPage() {
  return (
    <div className="space-y-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'About CareBridge', href: '/about' }]} />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
        <SectionHeader
          badge="Our Mission"
          title="Bringing Clarity &amp; Peace of Mind to Family Health Care"
          subtitle="CareBridge was created to bridge the gap between elderly parents, busy family caregivers, and primary healthcare professionals."
        />
      </section>

      {/* Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Senior Dignity First</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We build interfaces that empower seniors to maintain their independence without feeling monitored or micromanaged.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Family Synchronization</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We eliminate long-distance care anxiety by keeping siblings informed in real time about medication adherence and wellness logs.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Privacy &amp; Responsibility</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We never sell user health data or make diagnostic medical claims. CareBridge acts purely as an organizational and communication assistant.
            </p>
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
