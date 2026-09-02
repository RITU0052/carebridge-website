import React from 'react';
import Link from 'next/link';
import { FileText, Upload } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { HealthReportPreview } from '@/components/previews/HealthReportPreview';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Digital Medical Report Organizer & Secure Vault | CareBridge',
  description: 'Upload, organize, and store bloodwork, pathology, ECG, and hospital discharge summaries securely in 256-bit encrypted storage.',
  path: '/medical-report-organizer',
});

export default function MedicalReportOrganizerPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <Breadcrumbs items={[{ label: 'Medical Report Organizer', href: '/medical-report-organizer' }]} />

        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold w-fit">
            <FileText className="w-4 h-4" />
            <span>Digital Health Vault</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Organize &amp; Store All Family Medical Reports Securely
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            Stop searching for misplaced paper lab results. Upload PDF, JPG, PNG, and WEBP medical records into an encrypted vault.
          </p>

          <div className="pt-4 flex gap-4">
            <Link
              href="/reports"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg min-h-[52px]"
            >
              <span>Upload Medical Report Now</span>
              <Upload className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <HealthReportPreview />

        <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200/80 space-y-4 text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">Encrypted Storage Built for Family Healthcare</h2>
          <p>
            CareBridge encrypts medical documents and provides seamless sharing when visiting specialists or emergency rooms.
          </p>
        </div>

        <MedicalDisclaimerBanner />
      </div>
    </main>
  );
}
