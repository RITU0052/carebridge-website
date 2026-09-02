import React from 'react';
import Link from 'next/link';
import { Pill, Activity, FileText, PhoneCall, Sparkles, UserCheck, ArrowRight } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'CareBridge Features | Medicine Reminders, Vitals & Emergency Alerts',
  description: 'Explore the complete CareBridge feature suite: medicine scheduling, daily health monitoring, digital report summaries, emergency contacts, and caregiver feeds.',
  path: '/features',
});

export default function FeaturesPage() {
  return (
    <div className="space-y-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Features', href: '/features' }]} />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <SectionHeader
          badge="Platform Architecture"
          title="Designed for Clarity, Built for Peace of Mind"
          subtitle="Explore the complete suite of features helping families, caregivers, and doctors stay connected."
        />
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Pill}
            badge="Medicine Schedule"
            title="Medicine Reminders & Dosage Tracking"
            description="Recurring pill notifications with large readable text, audio prompts, and single-tap confirmation for elderly users."
            href="/features/medicine-reminder"
          />

          <FeatureCard
            icon={Activity}
            badge="Wellness Vitals"
            title="Health & Daily Vitals Monitoring"
            description="Log blood pressure, glucose, heart rate, daily steps, and general wellness trends over time with readable charts."
            href="/features/health-monitoring"
          />

          <FeatureCard
            icon={FileText}
            badge="Digital Vault"
            title="Health Report Storage & AI Summaries"
            description="Upload pathology labs, ECG scans, and discharge notes into an encrypted vault with plain-language AI explanations."
            href="/features/health-reports"
          />

          <FeatureCard
            icon={PhoneCall}
            badge="Safety Circle"
            title="Emergency Support & Alert System"
            description="One-tap emergency alert triggers broadcasting location and critical medical profiles to family contacts instantly."
            href="/features/emergency-support"
          />

          <FeatureCard
            icon={Sparkles}
            badge="AI Assistant"
            title="AI Health Information Assistant"
            description="Ask educational health questions, look up medication facts, and prepare questions for upcoming physician visits."
            href="/features/ai-health-assistant"
          />

          <FeatureCard
            icon={UserCheck}
            badge="Care Circle"
            title="Remote Caregiver Activity Feed"
            description="Share caregiving tasks, view real-time dose status updates, and coordinate with family members from any distance."
            href="/for-caregivers"
          />
        </div>
      </section>

      {/* Security & Disclaimer Notice */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <MedicalDisclaimerBanner variant="card" />
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-teal-700 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <h2 className="text-3xl font-extrabold">Ready to Try CareBridge Features?</h2>
          <p className="text-teal-100 max-w-xl mx-auto text-base sm:text-lg">
            Join our early access list today to be notified as feature modules launch.
          </p>
          <Link
            href="/waitlist"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-teal-900 bg-white hover:bg-teal-50 shadow-md transition-all"
          >
            <span>Join Waitlist Now</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
