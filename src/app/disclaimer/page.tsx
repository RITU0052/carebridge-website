import React from 'react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { AlertTriangle, PhoneCall } from 'lucide-react';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Medical Disclaimer | CareBridge Platform',
  description: 'CareBridge full medical, safety, and non-diagnostic legal disclaimer statement.',
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <div className="space-y-12 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Medical Disclaimer', href: '/disclaimer' }]} />
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-700" />
            <span>Healthcare Notice</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Medical &amp; Safety Disclaimer</h1>
          <p className="text-sm text-slate-500">Last Reviewed: August 31, 2026</p>
        </div>

        {/* Emergency Box */}
        <div className="bg-rose-900 text-white rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-rose-200 font-bold text-base">
            <PhoneCall className="w-5 h-5" />
            <span>IN CASE OF A MEDICAL EMERGENCY</span>
          </div>
          <p className="text-sm sm:text-base text-slate-100 leading-relaxed">
            CareBridge is NOT an emergency medical service. If you, an elderly parent, or anyone else is experiencing a life-threatening medical emergency, chest pain, difficulty breathing, stroke symptoms, or severe allergic reaction, <strong>CALL 911 OR YOUR LOCAL EMERGENCY RESPONSE NUMBER IMMEDIATELY.</strong>
          </p>
        </div>

        <section className="space-y-6 text-slate-800 text-base leading-relaxed">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">1. Educational &amp; Organizational Purpose Only</h2>
            <p>
              The content provided on the CareBridge website, including text, graphics, images, AI summaries, medication reminders, and blog guides, is designed solely for educational, organizational, and family communication purposes.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">2. No Doctor-Patient Relationship</h2>
            <p>
              Using CareBridge or interacting with our website content does not establish a doctor-patient, nursing, or clinical relationship. No information on this website should be interpreted as medical diagnosis, prescription advice, or a treatment plan.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">3. Consultation With Qualified Healthcare Professionals</h2>
            <p>
              Always seek the advice of your physician, pharmacist, or other qualified healthcare provider regarding any questions about a medical condition, prescription dosage, or health symptom. Never disregard professional medical advice or delay seeking treatment because of something you have read on CareBridge.
            </p>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900">4. Medication &amp; Dosage Accuracy</h2>
            <p>
              While CareBridge reminder tools assist caregivers in organizing daily routines, users remain responsible for verifying prescription instructions provided by licensed pharmacists and doctors.
            </p>
          </div>
        </section>
      </article>
    </div>
  );
}
