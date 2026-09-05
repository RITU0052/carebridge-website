import React from 'react';
import Link from 'next/link';
import { Phone, MessageCircle, Mail, HelpCircle, ShieldCheck, Heart, Pill, Activity, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'CareBridge Help & Support Guide | Simple Healthcare Assistance',
  description: 'Elderly-friendly and caregiver help page for CareBridge. Get quick help with medicine reminders, phone numbers +91 7042363267 & +91 9953920052, and WhatsApp support.',
  path: '/help',
});

export default function HelpPage() {
  const faqs = [
    {
      q: 'How do I add a daily medicine reminder?',
      a: 'Log into your account, go to Dashboard or Medicine Reminders, and click "+ Add Medicine". Enter the medicine name, dosage (e.g., 1 tablet), frequency, and set your scheduled reminder times. CareBridge will automatically send reminders according to your timezone.',
    },
    {
      q: 'Can my son or daughter monitor my medicine schedule?',
      a: 'Yes! Under Caregiver Support, click "Link Family Profile". Enter your caregiver or family member\'s details. You can choose whether they see your full dashboard or receive alerts only when a medication is missed.',
    },
    {
      q: 'What happens if I miss a scheduled medicine dose?',
      a: 'If a medicine is not marked as "Taken" within 15 minutes of the scheduled time, CareBridge marks the dose as overdue and sends an automated email notification to your linked caregiver.',
    },
    {
      q: 'Is my health data and medical report private?',
      a: 'Yes, absolutely. CareBridge uses strict privacy controls. Your health records, vitals, and medicine data are encrypted and accessible only to you and authorized family members.',
    },
    {
      q: 'Are WhatsApp notifications active?',
      a: 'Direct WhatsApp automated notifications are currently under evaluation. However, you can chat with our support team directly on WhatsApp anytime at +91 7042363267 for instant assistance.',
    },
    {
      q: 'Who should I contact if I need help using CareBridge?',
      a: 'You can call our dedicated support lines at +91 7042363267 or +91 9953920052, send an email to support.carebridge@gmail.com, or submit a feedback form.',
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        <Breadcrumbs items={[{ label: 'Help & Getting Started', href: '/help' }]} />

        {/* High Contrast Header for Large Readable Fonts */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-10 text-white shadow-xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-sm font-bold">
            <Heart className="w-4 h-4 text-rose-400" />
            <span>Caregiver &amp; Senior Friendly Support</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            How Can We Help You Today?
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            CareBridge is designed to be simple and easy for senior citizens and family caregivers. Get immediate help or reach our dedicated support team directly.
          </p>
        </div>

        {/* Big Tap Phone & WhatsApp Direct Contact Buttons (Min height 48px, high contrast) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Phone className="w-6 h-6 text-teal-600" />
            <span>Direct Phone &amp; WhatsApp Support</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Need urgent assistance setting up medicine reminders or linking a family profile? Tap any button below to call or chat directly with our team.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone 1 */}
            <a
              href="tel:+917042363267"
              className="flex items-center justify-center gap-3 p-4 sm:p-5 rounded-2xl bg-teal-700 hover:bg-teal-800 text-white font-extrabold text-base sm:text-lg shadow-lg transition-all min-h-[56px]"
              aria-label="Call CareBridge Support Line 1: +91 7042363267"
            >
              <Phone className="w-6 h-6 text-teal-200" />
              <span>Call +91 7042363267</span>
            </a>

            {/* Phone 2 */}
            <a
              href="tel:+919953920052"
              className="flex items-center justify-center gap-3 p-4 sm:p-5 rounded-2xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-base sm:text-lg shadow-lg transition-all min-h-[56px]"
              aria-label="Call CareBridge Support Line 2: +91 9953920052"
            >
              <Phone className="w-6 h-6 text-slate-300" />
              <span>Call +91 9953920052</span>
            </a>

            {/* WhatsApp Chat Button */}
            <a
              href="https://wa.me/917042363267?text=Hello%20CareBridge%20Support%2C%20I%20need%20help%20with%20CareBridge."
              target="_blank"
              rel="noopener noreferrer"
              className="sm:col-span-2 flex items-center justify-center gap-3 p-4 sm:p-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base sm:text-lg shadow-lg transition-all min-h-[56px]"
              aria-label="Chat with CareBridge Support on WhatsApp (+91 7042363267)"
            >
              <MessageCircle className="w-7 h-7 text-emerald-100" />
              <span>Chat on WhatsApp (+91 7042363267)</span>
            </a>
          </div>
        </div>

        {/* Quick Help Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            href="/how-to-use"
            className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 hover:border-teal-500 hover:shadow-xl transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700">9-Step Platform Guide</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Step-by-step instructions for reminders, family profiles, vitals, and report summaries.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-teal-700 gap-1">
              <span>Read Full Guide</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/feedback"
            className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 hover:border-teal-500 hover:shadow-xl transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700">Give Feedback</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Tell us about your experience or select notification preferences.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-teal-700 gap-1">
              <span>Open Feedback Form</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/contact"
            className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 hover:border-teal-500 hover:shadow-xl transition-all group flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-slate-900 group-hover:text-teal-700">Contact Support</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                View email addresses, phone contacts, and operating hours.
              </p>
            </div>
            <div className="pt-4 flex items-center text-xs font-bold text-teal-700 gap-1">
              <span>View Contact Page</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Step-by-Step FAQ Accordions */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 space-y-6">
          <h2 className="text-2xl font-black text-slate-900">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <MedicalDisclaimerBanner variant="card" />
      </div>
    </main>
  );
}
