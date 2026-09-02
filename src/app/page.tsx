import React from 'react';
import Link from 'next/link';
import {
  Pill,
  Activity,
  FileText,
  PhoneCall,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  CheckCircle2,
  Users,
  Lock,
  ArrowRight,
  UserCheck,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { AudienceTabs } from '@/components/ui/AudienceTabs';
import { FAQAccordion } from '@/components/ui/FAQAccordion';
import { WaitlistForm } from '@/components/ui/WaitlistForm';
import { MedicineReminderPreview } from '@/components/previews/MedicineReminderPreview';
import { CaregiverDashboardPreview } from '@/components/previews/CaregiverDashboardPreview';
import { HealthReportPreview } from '@/components/previews/HealthReportPreview';
import { EmergencySupportPreview } from '@/components/previews/EmergencySupportPreview';
import { faqs } from '@/data/faqs';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'CareBridge – AI Healthcare Monitoring Platform',
  description: 'CareBridge helps families monitor medicines, health reports, reminders, and AI-powered health summaries in one secure platform.',
  path: '/',
});

export default function HomePage() {
  const homeFaqs = faqs.slice(0, 5);

  return (
    <div className="space-y-20 sm:space-y-28 pb-16">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 sm:pt-20 pb-16 lg:pb-24 bg-gradient-to-b from-teal-50/70 via-slate-50 to-slate-50">
        {/* Soft background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-200/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-8">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-800 text-xs sm:text-sm font-bold border border-teal-200/80 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>AI Healthcare Monitoring Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              CareBridge – AI Healthcare{' '}
              <span className="text-gradient">Monitoring Platform</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
              <strong className="text-slate-900 font-bold block mb-1">Stay Connected to the Health of the People You Care About.</strong>
              Effortless medicine reminders, daily wellness check-ins, digital health report summaries, and instant emergency alert circles—bringing families, caregivers, and doctors together.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href="/waitlist"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-base sm:text-lg font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-xl shadow-teal-600/25 active:scale-95 transition-all flex items-center justify-center gap-2 min-h-[54px]"
              >
                <span>Join CareBridge Waitlist</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/features"
                className="w-full sm:w-auto px-8 py-4 rounded-full text-base sm:text-lg font-bold text-slate-800 bg-white hover:bg-slate-100 border border-slate-300 shadow-md transition-all flex items-center justify-center gap-2 min-h-[54px]"
              >
                <span>Explore Platform Features</span>
              </Link>
            </div>

            {/* Trust Stats Bar */}
            <div className="pt-8 border-t border-slate-200/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-center max-w-3xl mx-auto">
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">100%</p>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Free Early Access Waitlist</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-700">24/7</p>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Family Care Visibility</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">256-Bit</p>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Encrypted Health Vault</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-extrabold text-teal-700">0</p>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">Intrusive Ads or Selling Data</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST & SECURITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-400 shrink-0">
              <Lock className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Privacy-First Architecture</h3>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                Your medical notes, reports, and reminders are stored with strict encryption. Accessible only by you and your designated care team.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-sky-500/20 text-sky-400 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Medically Responsible</h3>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                CareBridge supports health routines without replacing doctors. Educational information is clearly distinguished from diagnostic advice.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 shrink-0">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Built for All Generations</h3>
              <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                High-contrast readable interfaces for seniors paired with real-time remote dashboards for busy adult children and caregivers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM & SOLUTION SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="The Caregiver Challenge"
          title="Caregiving Shouldn’t Mean Constant Anxiety"
          subtitle="Millions of adult children struggle to balance work, family, and caring for aging parents. Scattered pill bottles and communication gaps cause unnecessary stress."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Traditional Challenges */}
          <div className="bg-rose-50/60 rounded-3xl p-8 border border-rose-200/80 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-200 text-rose-800 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-rose-950">Traditional Family Care Struggles</h3>
            </div>

            <ul className="space-y-4 text-slate-700 text-base">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span><strong>Forgotten Medications:</strong> Seniors accidentally skipping doses or double-dosing out of confusion.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span><strong>Long-Distance Worry:</strong> Constant phone calls asking &ldquo;Did you take your pills?&rdquo; causing tension.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span><strong>Scattered Health Papers:</strong> Lost bloodwork and pathology reports when meeting specialists.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-2 shrink-0" />
                <span><strong>Emergency Delays:</strong> First responders lacking immediate allergy and medication records during critical events.</span>
              </li>
            </ul>
          </div>

          {/* CareBridge Solution */}
          <div className="bg-teal-50/70 rounded-3xl p-8 border border-teal-200/80 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold shadow-md">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-teal-950">The CareBridge Connected Solution</h3>
            </div>

            <ul className="space-y-4 text-slate-800 text-base">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Automated Pill Reminders:</strong> Large readable schedules with audio prompts and 1-tap confirmation.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Real-Time Family Activity Feed:</strong> Instant peace of mind showing doses taken and daily wellness logs.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Digital Health Report Vault:</strong> Encrypted file storage with plain-language AI summaries for doctor visits.</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>One-Tap Emergency Circle:</strong> Simultaneous family and contact broadcast alerts with critical medical profiles.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* MAIN FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Core Capabilities"
          title="Everything You Need to Manage Daily Family Health"
          subtitle="Designed with input from family caregivers, nurses, and geriatric specialists."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Pill}
            badge="Essential"
            title="Medicine Reminders & Schedules"
            description="Set recurring pill times with custom dosages, meal instructions, and clear single-tap confirmation for elderly users."
            href="/features/medicine-reminder"
          />

          <FeatureCard
            icon={Activity}
            badge="Daily Vitals"
            title="Health & Wellness Monitoring"
            description="Track blood pressure, glucose, daily steps, and general mood trends over time with visual chart summaries."
            href="/features/health-monitoring"
          />

          <FeatureCard
            icon={FileText}
            badge="Digital Vault"
            title="Health Reports & AI Summaries"
            description="Organize pathology reports, discharge papers, and prescriptions in a secure vault with plain-language AI explanations."
            href="/features/health-reports"
          />

          <FeatureCard
            icon={PhoneCall}
            badge="Safety First"
            title="Emergency Support Circle"
            description="Designate emergency contacts who receive immediate alerts and critical health profile access during urgent situations."
            href="/features/emergency-support"
          />

          <FeatureCard
            icon={Sparkles}
            badge="AI Health"
            title="AI Health Information Assistant"
            description="Ask non-diagnostic health questions, look up drug interaction summaries, and prepare questions for upcoming doctor visits."
            href="/features/ai-health-assistant"
          />

          <FeatureCard
            icon={UserCheck}
            badge="Collaboration"
            title="Caregiver & Family Sync"
            description="Share care responsibilities between siblings, assign appointment tasks, and maintain a transparent family status log."
            href="/for-caregivers"
          />
        </div>
      </section>

      {/* INTERACTIVE FEATURE PREVIEWS */}
      <section className="bg-slate-100/80 py-16 sm:py-24 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <SectionHeader
            badge="Interactive Demonstrations"
            title="Preview CareBridge in Action"
            subtitle="Explore how CareBridge simplifies daily routines for elderly parents and remote caregivers."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 font-bold text-xs">
                <Pill className="w-4 h-4" />
                <span>Feature Spotlight 1</span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 leading-snug">
                Senior-Friendly Medicine Reminder Schedule
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Large typography, high-contrast buttons, and simple instructions eliminate medication confusion. When a senior confirms a dose, family members get updated in real time.
              </p>
              <div className="pt-2">
                <Link
                  href="/features/medicine-reminder"
                  className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800"
                >
                  <span>Read Medicine Reminder Specs</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <MedicineReminderPreview />
          </div>

          <hr className="border-slate-200" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center lg:flex-row-reverse">
            <CaregiverDashboardPreview />
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-800 font-bold text-xs">
                <UserCheck className="w-4 h-4 text-teal-600" />
                <span>Feature Spotlight 2</span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 leading-snug">
                Real-Time Caregiver Status Dashboard
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Check on medication logs, blood pressure trends, and daily wellness from work or home. Stay reassured without needing to call every hour.
              </p>
              <div className="pt-2">
                <Link
                  href="/for-caregivers"
                  className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800"
                >
                  <span>Explore Caregiver Dashboard</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          <hr className="border-slate-200" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-bold text-xs">
                <FileText className="w-4 h-4 text-sky-600" />
                <span>Feature Spotlight 3</span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 leading-snug">
                Encrypted Medical Report Storage &amp; AI Summaries
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                Upload complex bloodwork PDFs and receive plain-language explanations of medical terminology, making specialist consultations more productive.
              </p>
              <div className="pt-2">
                <Link
                  href="/features/health-reports"
                  className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800"
                >
                  <span>Learn About Report Storage</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <HealthReportPreview />
          </div>

          <hr className="border-slate-200" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <EmergencySupportPreview />
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100 text-rose-800 font-bold text-xs">
                <PhoneCall className="w-4 h-4 text-rose-600" />
                <span>Feature Spotlight 4</span>
              </div>
              <h3 className="text-3xl font-extrabold text-slate-900 leading-snug">
                Instant Emergency Alert &amp; Contact Circle
              </h3>
              <p className="text-slate-600 text-base leading-relaxed">
                One-tap emergency broadcast alerts instantly contact designated family members and share key medical profiles with first responders.
              </p>
              <div className="pt-2">
                <Link
                  href="/features/emergency-support"
                  className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800"
                >
                  <span>See Emergency Features</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Simple 3-Step Setup"
          title="Getting Started with CareBridge is Easy"
          subtitle="Designed to take less than 5 minutes to set up for your entire family."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-3xl p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-800 font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-900">Create Family Profile</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Sign up for free, add your family profile, and set up your senior loved one’s basic health details.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-teal-600 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-900">Set Medication Schedules</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Input daily pill times, dosage instructions, and invite siblings or caregivers to the shared care feed.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 text-white font-extrabold text-2xl flex items-center justify-center mx-auto shadow-md">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-900">Enjoy Daily Peace of Mind</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Receive gentle confirmations when doses are taken, track vitals, and keep emergency contacts ready.
            </p>
          </div>
        </div>
      </section>

      {/* AUDIENCE SELECTOR SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <SectionHeader
          badge="Tailored Experience"
          title="Who CareBridge is Built For"
          subtitle="Explore benefits customized for every person involved in daily health care."
        />
        <AudienceTabs />
      </section>

      {/* FAQ SECTION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <SectionHeader
          badge="Frequently Asked Questions"
          title="Common Questions About CareBridge"
          subtitle="Everything you need to know about our caregiver platform, security, and medical disclaimers."
        />
        <FAQAccordion items={homeFaqs} />
        <div className="text-center pt-2">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 font-bold text-teal-700 hover:text-teal-800 text-base"
          >
            <span>View All Frequently Asked Questions</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* WAITLIST / NEWSLETTER CTA SECTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-teal-700 via-teal-800 to-slate-900 text-white rounded-3xl p-8 sm:p-14 shadow-2xl space-y-8 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
              Early Access Registration
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to Simplify Family Healthcare &amp; Caregiving?
            </h2>
            <p className="text-teal-100 text-base sm:text-lg leading-relaxed">
              Join thousands of family caregivers, patients, and doctors waiting for CareBridge platform access.
            </p>
          </div>

          <div className="relative z-10 max-w-xl">
            <WaitlistForm compact />
          </div>
        </div>
      </section>
    </div>
  );
}
