import React from 'react';
import Link from 'next/link';
import { Pill, Clock, CheckCircle2, ArrowRight, HeartHandshake } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicineReminderPreview } from '@/components/previews/MedicineReminderPreview';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { JsonLd } from '@/components/ui/JsonLd';
import { constructMetadata, generateFaqSchema } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'CareBridge Medicine Reminder System | Never Miss a Dose',
  description: 'Smart medication scheduling, daily dosage tracking, and adherence history for seniors, caregivers, and families.',
  path: '/medicine-reminder',
});

const FAQS = [
  {
    question: 'How does CareBridge Medicine Reminder work?',
    answer: 'CareBridge allows users and caregivers to set medication schedules, dosage amounts, time windows, and food instructions. Notifications and status tracking keep family members aligned.',
  },
  {
    question: 'Can caregivers set reminders for elderly parents remotely?',
    answer: 'Yes! Caregivers can configure medication schedules and monitor daily adherence status remotely from the CareBridge web platform.',
  },
  {
    question: 'Is CareBridge free to use?',
    answer: 'CareBridge offers core medication tracking and health monitoring features for patients and family caregivers.',
  },
];

export default function MedicineReminderSeoPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <JsonLd data={generateFaqSchema(FAQS)} />
      <div className="max-w-5xl mx-auto space-y-12">
        <Breadcrumbs items={[{ label: 'Medicine Reminder', href: '/medicine-reminder' }]} />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6 relative overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold w-fit">
            <Pill className="w-4 h-4" />
            <span>Medication Management System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Never Miss a Dose with CareBridge Medicine Reminder
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Simplify daily medication schedules for elderly parents and seniors with automated timing, food instructions, adherence tracking, and caregiver alerts.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg shadow-teal-600/30 active:scale-95 transition-all min-h-[52px]"
            >
              <span>Create Free Reminder Schedule</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors min-h-[52px]"
            >
              <span>Open Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Interactive Feature Preview */}
        <div className="space-y-4">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Interactive Medicine Schedule Preview</h2>
            <p className="text-slate-600 text-sm">See how CareBridge organizes doses for maximum clarity and ease of use.</p>
          </div>
          <MedicineReminderPreview />
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200/80 space-y-6 text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">Why Medication Schedule Consistency Matters</h2>
          <p>
            Managing multiple daily prescriptions—such as blood pressure medications, diabetes therapies, and vitamins—can quickly become overwhelming. For seniors and aging parents, confusion over dosage timing or whether a pill was already taken is a leading cause of accidental double-dosing or missed medication.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <Clock className="w-6 h-6 text-teal-600" />
              <h3 className="font-bold text-slate-900">Specific Dosage Windows</h3>
              <p className="text-xs text-slate-600">Set exact times for morning, afternoon, and bedtime doses with custom instructions.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <CheckCircle2 className="w-6 h-6 text-teal-600" />
              <h3 className="font-bold text-slate-900">Instant Status Logging</h3>
              <p className="text-xs text-slate-600">Mark medicines as Taken or Missed with a single tap to keep family members updated.</p>
            </div>
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <HeartHandshake className="w-6 h-6 text-teal-600" />
              <h3 className="font-bold text-slate-900">Remote Caregiver Oversight</h3>
              <p className="text-xs text-slate-600">Family members can view real-time adherence history from anywhere without intrusive phone calls.</p>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200/80 space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h3 className="font-bold text-slate-900 text-base">{faq.question}</h3>
                <p className="text-sm text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <MedicalDisclaimerBanner />
      </div>
    </main>
  );
}
