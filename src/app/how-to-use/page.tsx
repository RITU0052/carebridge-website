import React from 'react';
import Link from 'next/link';
import {
  UserPlus,
  Users,
  Pill,
  Activity,
  FileText,
  Sparkles,
  Bell,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'How to Use CareBridge | Step-by-Step Healthcare & Caregiver Guide',
  description: 'Complete 9-step guide to using CareBridge for medicine reminders, family member linking, vitals logging, AI health report summaries, and emergency alerts.',
  path: '/how-to-use',
});

export default function HowToUsePage() {
  const steps = [
    {
      num: 1,
      title: 'Creating Your Account & Profile Setup',
      icon: UserPlus,
      color: 'from-teal-500 to-emerald-600',
      description:
        'Get started by creating a free account. Select your role as a Patient, Family Caregiver, Doctor, or Family Member. Set your preferred timezone and profile details to customize your care dashboard.',
      tips: ['Use an active email address to receive real-time verification OTPs and medicine reminders.'],
      action: { label: 'Create Account', href: '/signup' },
    },
    {
      num: 2,
      title: 'Managing Family Profiles (Parent-Child Linking)',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      description:
        'Connect aging parents with adult children or caregivers. Grant tailored access levels: Full Access, Medication Adherence Only, or Reports & Vitals Only to ensure privacy while staying updated.',
      tips: ['Caregivers can oversee medication compliance without needing full account control.'],
      action: { label: 'Link Family Profile', href: '/caregiver-support' },
    },
    {
      num: 3,
      title: 'Setting Up Medicine Reminders',
      icon: Pill,
      color: 'from-purple-500 to-pink-600',
      description:
        'Add prescriptions with name, dosage, frequency, and exact notification times. CareBridge schedules reminders according to your timezone and sends overdue alerts if doses are missed.',
      tips: ['Enable email notifications to ensure missed dose alerts are delivered instantly.'],
      action: { label: 'Manage Reminders', href: '/features/medicine-reminder' },
    },
    {
      num: 4,
      title: 'Logging Daily Health Metrics & Vitals',
      icon: Activity,
      color: 'from-rose-500 to-orange-500',
      description:
        'Track vital signs including Systolic/Diastolic Blood Pressure, Heart Rate (BPM), Blood Sugar, Oxygen Saturation (SpO2), and Weight over time to share with doctors.',
      tips: ['Log vitals daily after medication to track health trends accurately.'],
      action: { label: 'Health Monitoring', href: '/features/health-monitoring' },
    },
    {
      num: 5,
      title: 'Uploading & Managing Medical Records',
      icon: FileText,
      color: 'from-cyan-500 to-blue-600',
      description:
        'Store digital lab reports, prescriptions, diagnostic scans, and doctor notes in your encrypted Reports Vault for instant access whenever you visit a clinic.',
      tips: ['Supported file formats include PDF, JPG, PNG, and scanned medical documents.'],
      action: { label: 'Reports Vault', href: '/reports' },
    },
    {
      num: 6,
      title: 'Using AI Health Assistance & Lab Summaries',
      icon: Sparkles,
      color: 'from-amber-500 to-yellow-600',
      description:
        'Generate clear, plain-language summaries of medical test results and doctor notes using AI. Get structured breakdowns of key findings, reference ranges, and questions to ask your physician.',
      tips: ['AI summaries help demystify complex medical terminology for patients and family caregivers.'],
      action: { label: 'AI Health Summary', href: '/ai-health-summary' },
    },
    {
      num: 7,
      title: 'Receiving Caregiver Alerts & Email Notifications',
      icon: Bell,
      color: 'from-emerald-500 to-teal-700',
      description:
        'CareBridge monitors scheduled dose times. If a medication is not marked as taken within 15 minutes of the scheduled time, automated email alerts are dispatched to linked caregivers.',
      tips: ['Check your Notification Preferences in settings to ensure email delivery is active.'],
      action: { label: 'View Dashboard', href: '/dashboard' },
    },
    {
      num: 8,
      title: 'Accessing Emergency Assistance & Official Support',
      icon: PhoneCall,
      color: 'from-red-600 to-rose-700',
      description:
        'For urgent platform help or caregiver coordination, call our official helpline numbers: +91 7042363267 or +91 9953920052, or chat directly via WhatsApp.',
      tips: ['CareBridge helpline operates for platform guidance and caregiver coordination.'],
      action: { label: 'Contact Support', href: '/contact' },
    },
    {
      num: 9,
      title: 'Providing Product Feedback & Feature Requests',
      icon: MessageSquare,
      color: 'from-indigo-600 to-purple-700',
      description:
        'We continuously improve CareBridge based on user feedback. Submit feature ideas, report bugs, or share your caregiving experience directly through our feedback portal.',
      tips: ['Select your notification preference when submitting feedback to help us prioritize WhatsApp alerts.'],
      action: { label: 'Give Feedback', href: '/feedback' },
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        <Breadcrumbs items={[{ label: 'How to Use CareBridge', href: '/how-to-use' }]} />

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold">
            <HelpCircle className="w-4 h-4" />
            <span>Platform User Guide</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">How to Use CareBridge</h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Follow this 9-step guide to set up medicine reminders, link family members, track health vitals, upload lab reports, and stay connected with your caregivers.
          </p>
        </div>

        {/* Mandatory AI Medical Disclaimer */}
        <div className="bg-amber-50 rounded-2xl p-6 border-2 border-amber-300/80 text-amber-900 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-amber-200/80 rounded-xl text-amber-900 shrink-0 mt-0.5">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-extrabold text-base text-amber-950">Important Medical Disclaimer</h3>
            <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
              AI summaries and insights on CareBridge are for informational purposes only and do not constitute medical diagnosis, treatment recommendations, or medical advice. Always consult a qualified physician or healthcare provider for clinical advice and emergency medical care.
            </p>
          </div>
        </div>

        {/* 9 Step Cards Grid */}
        <div className="space-y-8">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 hover:shadow-xl transition-all flex flex-col md:flex-row items-start gap-6"
              >
                {/* Step Number & Icon */}
                <div className="flex items-center md:flex-col gap-4 shrink-0">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} text-white flex items-center justify-center font-black text-xl shadow-lg shrink-0`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Step 0{step.num}</span>
                </div>

                {/* Content */}
                <div className="space-y-3 flex-1">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900">{step.title}</h2>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.description}</p>

                  {/* Tips Box */}
                  {step.tips && step.tips.length > 0 && (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1">
                      {step.tips.map((tip, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                          <CheckCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Link */}
                <div className="self-end md:self-center shrink-0 w-full md:w-auto pt-2 md:pt-0">
                  <Link
                    href={step.action.href}
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 font-extrabold text-xs transition-colors border border-teal-200"
                  >
                    <span>{step.action.label}</span>
                    <ArrowRight className="w-4 h-4 text-teal-700" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact / Support Callout */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-teal-300">Need Personalized Guidance?</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-md">
              Our support team is available to assist caregivers and family members with setting up reminders and parent-child profiles.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <Link
              href="/help"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700"
            >
              Elderly Help Page
            </Link>
            <Link
              href="/contact"
              className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md shadow-teal-600/20"
            >
              Contact Support
            </Link>
          </div>
        </div>

        <MedicalDisclaimerBanner variant="card" />
      </div>
    </main>
  );
}
