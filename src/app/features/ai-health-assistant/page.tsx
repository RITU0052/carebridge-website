import React from 'react';
import Link from 'next/link';
import { Sparkles, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'CareBridge AI Health Assistant | Educational Health Info Hub',
  description: 'Ask non-diagnostic health questions, explore prescription terminology, and prepare questions for physician appointments with CareBridge AI.',
  path: '/features/ai-health-assistant',
});

export default function AiHealthAssistantPage() {
  return (
    <div className="space-y-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Features', href: '/features' },
            { label: 'AI Health Assistant', href: '/features/ai-health-assistant' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>Educational AI Module</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            AI-Assisted Health Information &amp; Appointment Preparation
          </h1>

          <p className="text-slate-600 text-lg leading-relaxed">
            CareBridge AI helps family caregivers and patients understand general health terminology, research medication side effects from credible sources, and craft questions for clinical consultations.
          </p>

          <div className="pt-4 flex justify-center">
            <Link
              href="/waitlist"
              className="px-8 py-4 rounded-full font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-600/20 inline-flex items-center gap-2"
            >
              <span>Join AI Assistant Waitlist</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Medication Terminology</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Understand why a medication is typically prescribed, food interactions to avoid, and common side effects.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Doctor Consultation Prep</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Generate structured question checklists to bring to specialist appointments so no concerns are forgotten.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Grounded &amp; Responsible</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Strict guardrails ensure the assistant provides educational information only and always directs medical questions to qualified doctors.
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
