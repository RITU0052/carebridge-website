import React from 'react';
import Link from 'next/link';
import { Sparkles, Bot } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'AI Health Report Summary Generator | CareBridge AI Assistant',
  description: 'Convert complex medical report jargon, bloodwork numbers, and pathology findings into plain language health summaries.',
  path: '/ai-health-report-summary',
});

export default function AiHealthReportSummaryPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <Breadcrumbs items={[{ label: 'AI Health Summary Generator', href: '/ai-health-report-summary' }]} />

        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold w-fit">
            <Sparkles className="w-4 h-4" />
            <span>AI Educational Assistant</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Understand Your Medical Reports in Simple Language
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Translate complex medical terminology, lab reference ranges, and doctor notes into clear, easy-to-understand explanations.
          </p>

          <div className="pt-4 flex gap-4">
            <Link
              href="/ai-health-summary"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg min-h-[52px]"
            >
              <span>Try AI Summary Assistant</span>
              <Bot className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200/80 space-y-4 text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">How CareBridge AI Health Assistant Helps</h2>
          <p>
            Lab reports and discharge summaries are frequently filled with dense medical abbreviations. CareBridge AI breaks down these reports into structured bullet points so families know what questions to ask their doctor.
          </p>
        </div>

        <MedicalDisclaimerBanner />
      </div>
    </main>
  );
}
