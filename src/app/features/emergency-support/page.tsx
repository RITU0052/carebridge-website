import React from 'react';
import Link from 'next/link';
import { PhoneCall, ShieldAlert, Heart, User, ArrowRight } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { EmergencySupportPreview } from '@/components/previews/EmergencySupportPreview';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'CareBridge Emergency Support | One-Tap Family Alert Circle',
  description: 'CareBridge emergency support provides a one-tap family alert circle and digital ICE health profile for emergency situations.',
  path: '/features/emergency-support',
});

export default function EmergencySupportPage() {
  return (
    <div className="space-y-16 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { label: 'Features', href: '/features' },
            { label: 'Emergency Support', href: '/features/emergency-support' },
          ]}
        />
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-xs">
              <PhoneCall className="w-4 h-4" />
              <span>Emergency Circle Module</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              One-Tap Family Alert Circle &amp; Emergency Health Cards
            </h1>

            <p className="text-slate-600 text-lg leading-relaxed">
              When sudden medical situations arise, seconds matter. CareBridge allows elderly users to trigger an immediate broadcast alert to designated family members while making key medical details accessible to paramedics.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <span>Simultaneous SMS and call alerts to designated contacts</span>
              </div>
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <User className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <span>Digital Emergency Card (Allergies, pacemakers, blood type)</span>
              </div>
              <div className="flex items-start gap-3 text-slate-800 font-medium">
                <Heart className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <span>Pre-authorized power-of-attorney &amp; advance directive links</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/waitlist"
                className="px-6 py-3.5 rounded-full font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/20 inline-flex items-center gap-2"
              >
                <span>Join Emergency Module Waitlist</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <EmergencySupportPreview />
          </div>
        </div>
      </section>

      {/* Notice */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 rounded-2xl bg-rose-900 text-white space-y-2 text-center sm:text-left">
          <p className="font-bold text-base text-rose-200">Notice Regarding Emergency Medical Services</p>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            CareBridge is a family communication support system. CareBridge is not a substitute for municipal emergency dispatch. If you or a loved one are experiencing a life-threatening medical emergency, call 911 or your local emergency services immediately.
          </p>
        </div>
      </section>
    </div>
  );
}
