import React from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Privacy Policy | CareBridge Platform',
  description: 'CareBridge privacy policy detailing our data protection standards, encryption protocols, and user privacy guarantees.',
  path: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="space-y-12 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Privacy Policy', href: '/privacy' }]} />
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 prose prose-slate">
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Privacy Policy</h1>
          <p className="text-sm text-slate-500">Effective Date: August 31, 2026</p>
        </div>

        <section className="space-y-4 text-slate-700 leading-relaxed text-sm sm:text-base">
          <h2 className="text-xl font-bold text-slate-900">1. Overview &amp; Privacy Commitment</h2>
          <p>
            CareBridge (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is dedicated to safeguarding the personal and health-related information of our users, caregivers, and families. This Privacy Policy explains how we collect, use, encrypt, and protect information when you visit our website or use our platform services.
          </p>

          <h2 className="text-xl font-bold text-slate-900">2. Information We Collect</h2>
          <p>
            We collect information you provide directly, such as when you sign up for early access waitlists, create a care profile, log medication schedules, or submit health reports. This includes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Basic Contact Details: Name, email address, and role (Caregiver, Patient, Doctor, Family Member).</li>
            <li>Schedule &amp; Health Log Data: Medication names, dosing times, blood pressure entries, and uploaded medical report files.</li>
            <li>Technical Data: IP addresses, browser types, and usage metrics to ensure security and performance.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900">3. How We Use Your Information</h2>
          <p>
            We use your information exclusively to provide, maintain, and improve platform functionality:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Delivering medication schedule notifications and emergency alert broadcasts.</li>
            <li>Generating plain-language AI summaries of uploaded medical reports for your educational use.</li>
            <li>Communicating early access updates and platform security notices.</li>
          </ul>
          <p className="font-semibold text-slate-900">
            We DO NOT sell, rent, or trade your personal health data to third-party advertisers or data brokers under any circumstances.
          </p>

          <h2 className="text-xl font-bold text-slate-900">4. Data Security &amp; Encryption</h2>
          <p>
            All health reports and personal information are transmitted using SSL/TLS protocols and stored with 256-bit AES encryption. Strict access controls ensure only authorized family members can access your profile.
          </p>

          <h2 className="text-xl font-bold text-slate-900">5. Contact Privacy Officer</h2>
          <p>
            If you have questions regarding data privacy, please contact our Privacy Team at <strong>support.carebridge@gmail.com</strong>.
          </p>
        </section>

        <MedicalDisclaimerBanner variant="card" />
      </article>
    </div>
  );
}
