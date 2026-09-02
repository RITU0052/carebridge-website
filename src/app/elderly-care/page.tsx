import React from 'react';
import Link from 'next/link';
import { Heart, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Elderly Care Platform & Senior Health Management | CareBridge',
  description: 'Integrated digital elderly care platform uniting medication management, health vitals monitoring, report vault, and family notifications.',
  path: '/elderly-care',
});

export default function ElderlyCarePage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <Breadcrumbs items={[{ label: 'Elderly Care Platform', href: '/elderly-care' }]} />

        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold w-fit">
            <Heart className="w-4 h-4" />
            <span>Senior Care Ecosystem</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight max-w-3xl">
            Complete Digital Elderly Care &amp; Health Platform
          </h1>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
            CareBridge connects aging seniors, adult children, and family caregivers in one secure, easy-to-use healthcare management ecosystem.
          </p>

          <div className="pt-4 flex gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-base font-bold text-white bg-teal-600 hover:bg-teal-500 shadow-lg min-h-[52px]"
            >
              <span>Join CareBridge Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-md border border-slate-200/80 space-y-6 text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-900">Modern Technology Built for Senior Independence</h2>
          <p>
            Elderly care requires a balance between preserving senior dignity and providing family caregivers with the visibility needed to step in when help is required.
          </p>
        </div>

        <MedicalDisclaimerBanner />
      </div>
    </main>
  );
}
