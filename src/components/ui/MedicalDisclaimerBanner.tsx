import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

interface MedicalDisclaimerBannerProps {
  variant?: 'banner' | 'card' | 'footer';
}

export function MedicalDisclaimerBanner({ variant = 'banner' }: MedicalDisclaimerBannerProps) {
  if (variant === 'card') {
    return (
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-slate-800 text-sm flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-1">
          <p className="font-medium text-amber-900">Important Healthcare Notice</p>
          <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">
            CareBridge is a support tool designed for medication scheduling, family communication, and wellness tracking. CareBridge does not provide medical diagnosis, treatment advice, or emergency medical services. Always consult a qualified physician or healthcare provider for medical concerns.
          </p>
          <Link href="/disclaimer" className="inline-block text-xs font-semibold text-teal-700 hover:text-teal-800 underline mt-1">
            Read Full Medical Disclaimer &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-200 py-3 px-4 text-xs sm:text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" aria-hidden="true" />
          <span>
            <strong>Educational &amp; Organizational Support:</strong> CareBridge is not a medical device and does not offer medical advice or diagnosis.
          </span>
        </div>
        <Link
          href="/disclaimer"
          className="text-teal-300 hover:text-teal-200 font-medium underline shrink-0 transition-colors"
        >
          Medical &amp; Safety Disclaimer
        </Link>
      </div>
    </div>
  );
}
