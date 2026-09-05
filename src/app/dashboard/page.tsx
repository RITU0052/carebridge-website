'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LogOut,
  Sparkles,
  FileText,
  Pill,
  Smartphone,
  ShieldCheck,
  Activity,
  PhoneCall,
  HeartHandshake,
  LayoutDashboard,
  Calendar,
  X,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  Users,
  PlusCircle,
  ArrowRight,
  Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicineManager } from '@/components/app/MedicineManager';
import { HealthVitalsManager } from '@/components/app/HealthVitalsManager';
import { EmergencyContactsManager } from '@/components/app/EmergencyContactsManager';
import { CaregiverPermissionsManager } from '@/components/app/CaregiverPermissionsManager';
import { DailySummaryWidget } from '@/components/app/DailySummaryWidget';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'summary' | 'medicine' | 'vitals' | 'emergency' | 'caregivers' | 'reports'>('overview');
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (isAuthenticated) {
      const onboardingDone = localStorage.getItem('carebridge_onboarding_completed');
      if (!onboardingDone) {
        setShowOnboarding(true);
      }
    }
  }, [isAuthenticated, isLoading, router]);

  const completeOnboarding = () => {
    localStorage.setItem('carebridge_onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-slate-600">Loading secure CareBridge dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Breadcrumbs items={[{ label: 'Secure Dashboard', href: '/dashboard' }]} />

        {/* Dashboard Welcome Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-teal-900/50">
                {user.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Welcome back, {user.name}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {user.role}
                  </span>
                </div>
                <p className="text-slate-300 text-sm mt-1">
                  Connected: <span className="text-teal-400 font-medium">{user.email}</span> • Status: Encrypted &amp; Verified
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={() => setShowOnboarding(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 font-semibold text-sm border border-teal-500/40 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                <span>Quick Setup Guide</span>
              </button>
              <Link
                href="/ai-health-summary"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-sm shadow-md transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>AI Health Assistant</span>
              </Link>
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile App Banner */}
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-900 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 shrink-0">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-bold text-base text-amber-950 flex items-center gap-2">
                <span>CareBridge Mobile Application</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 bg-amber-200 text-amber-900 rounded-md">
                  Coming Soon
                </span>
              </h2>
              <p className="text-xs text-amber-800 mt-0.5 leading-relaxed max-w-2xl">
                The CareBridge iOS &amp; Android app will connect seamlessly to your same account so you can manage medicines, vitals, and emergency alerts from anywhere.
              </p>
            </div>
          </div>
          <div className="shrink-0 w-full sm:w-auto text-right">
            <span className="inline-block text-xs font-semibold text-amber-900 bg-amber-200/70 px-3 py-1.5 rounded-xl border border-amber-300">
              App Store &amp; Google Play Ready
            </span>
          </div>
        </div>

        {/* Main Dashboard Workspace Navigation Bar */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'summary', label: 'Daily Summary', icon: Calendar },
            { id: 'medicine', label: 'Medicine Schedule', icon: Pill },
            { id: 'vitals', label: 'Health Vitals', icon: Activity },
            { id: 'emergency', label: 'Emergency Support', icon: PhoneCall },
            { id: 'caregivers', label: 'Caregivers & Family', icon: HeartHandshake },
            { id: 'reports', label: 'Reports Vault', icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content Workspace */}
        {activeTab === 'summary' && <DailySummaryWidget />}

        {activeTab === 'medicine' && <MedicineManager />}

        {activeTab === 'vitals' && <HealthVitalsManager />}

        {activeTab === 'emergency' && <EmergencyContactsManager />}

        {activeTab === 'caregivers' && <CaregiverPermissionsManager />}

        {activeTab === 'reports' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-teal-100 text-teal-700">
                  <FileText className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Medical Reports Vault</h2>
                  <p className="text-xs text-slate-500">Upload and manage pathology, lab, and discharge summaries</p>
                </div>
              </div>
              <Link
                href="/reports"
                className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow"
              >
                Open Reports Hub &amp; File Picker
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick-Start Action Cards */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-teal-600" />
                    <span>Quick Healthcare Actions</span>
                  </h3>
                  <Link href="/how-to-use" className="text-xs font-bold text-teal-700 hover:underline flex items-center gap-1">
                    <span>9-Step Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setActiveTab('medicine')}
                    className="p-4 rounded-2xl bg-teal-50/70 hover:bg-teal-100 border border-teal-200/80 text-left transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Pill className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-900">Schedule Medicine</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Add dosages &amp; times</p>
                  </button>

                  <Link
                    href="/caregiver-support"
                    className="p-4 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100 border border-indigo-200/80 text-left transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-900">Link Family Member</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Parent-child profile</p>
                  </Link>

                  <button
                    onClick={() => setActiveTab('vitals')}
                    className="p-4 rounded-2xl bg-rose-50/70 hover:bg-rose-100 border border-rose-200/80 text-left transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <Activity className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-900">Log Health Vitals</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">BP, sugar, pulse</p>
                  </button>

                  <Link
                    href="/reports"
                    className="p-4 rounded-2xl bg-blue-50/70 hover:bg-blue-100 border border-blue-200/80 text-left transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-900">Upload Lab Report</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Digital storage</p>
                  </Link>

                  <Link
                    href="/how-to-use"
                    className="p-4 rounded-2xl bg-amber-50/70 hover:bg-amber-100 border border-amber-200/80 text-left transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-900">How to Use Guide</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">Step-by-step help</p>
                  </Link>

                  <Link
                    href="/contact"
                    className="p-4 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100 border border-emerald-200/80 text-left transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <p className="text-xs font-bold text-slate-900">Contact Support</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">+91 7042363267</p>
                  </Link>
                </div>
              </div>

              {/* Prominent Give Feedback Card */}
              <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-teal-500/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/30 shrink-0">
                    <MessageSquare className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-lg font-extrabold text-white">Help Us Improve CareBridge</h4>
                      <div className="flex text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 max-w-lg">
                      Share your experience, medicine reminder feature requests, or select notification preferences.
                    </p>
                  </div>
                </div>
                <Link
                  href="/feedback"
                  className="px-5 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-extrabold text-xs shadow-md transition-colors shrink-0 whitespace-nowrap"
                >
                  Give Feedback
                </Link>
              </div>

              <DailySummaryWidget />
              <MedicineManager />
              <HealthVitalsManager />
            </div>

            {/* Right 1 Column */}
            <div className="space-y-8">
              <EmergencyContactsManager />
              <CaregiverPermissionsManager />

              {/* Support & Security */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <span>Security &amp; Support Info</span>
                </h3>
                <div className="space-y-3 text-xs text-slate-600">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span>Official Support Email</span>
                    <a href="mailto:support.carebridge@gmail.com" className="font-semibold text-teal-700 hover:underline">
                      support.carebridge@gmail.com
                    </a>
                  </div>
                  <div className="flex items-start justify-between py-1 border-b border-slate-100">
                    <span>Support Phone Lines</span>
                    <div className="text-right space-y-0.5">
                      <a href="tel:+917042363267" className="block font-semibold text-teal-700 hover:underline">
                        +91 7042363267
                      </a>
                      <a href="tel:+919953920052" className="block font-semibold text-teal-700 hover:underline">
                        +91 9953920052
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span>WhatsApp Instant Support</span>
                    <a
                      href="https://wa.me/917042363267?text=Hello%20CareBridge%20Support%2C%20I%20need%20help%20with%20CareBridge."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-600 hover:underline"
                    >
                      Chat on WhatsApp (+91 7042363267)
                    </a>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span>Account Security</span>
                    <span className="text-emerald-700 font-bold">256-bit Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* First-Time User Onboarding Modal ("Welcome to CareBridge 👋") */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto space-y-6">
            <button
              onClick={completeOnboarding}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close guide"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 text-center sm:text-left pr-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>First-Time Setup Guide</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Welcome to CareBridge 👋
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                CareBridge helps aging parents and family caregivers manage medication schedules, vitals, lab reports, and emergency alerts. Here are 6 quick ways to get started:
              </p>
            </div>

            {/* 6 Quick Action Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => {
                  completeOnboarding();
                  setActiveTab('medicine');
                }}
                className="p-4 rounded-2xl bg-teal-50 hover:bg-teal-100/80 border border-teal-200/80 text-left transition-all flex items-start gap-3 group"
              >
                <div className="p-2.5 rounded-xl bg-teal-600 text-white shrink-0 group-hover:scale-105 transition-transform">
                  <Pill className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-teal-800">1. Schedule Medicines</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Set daily dosages &amp; scheduled reminder times.</p>
                </div>
              </button>

              <Link
                href="/caregiver-support"
                onClick={completeOnboarding}
                className="p-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-200/80 text-left transition-all flex items-start gap-3 group"
              >
                <div className="p-2.5 rounded-xl bg-indigo-600 text-white shrink-0 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-800">2. Link Family Members</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Parent-child accounts with permission controls.</p>
                </div>
              </Link>

              <button
                onClick={() => {
                  completeOnboarding();
                  setActiveTab('vitals');
                }}
                className="p-4 rounded-2xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200/80 text-left transition-all flex items-start gap-3 group"
              >
                <div className="p-2.5 rounded-xl bg-rose-600 text-white shrink-0 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-rose-800">3. Log Health Vitals</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Record Blood Pressure, Sugar, &amp; Pulse.</p>
                </div>
              </button>

              <Link
                href="/reports"
                onClick={completeOnboarding}
                className="p-4 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200/80 text-left transition-all flex items-start gap-3 group"
              >
                <div className="p-2.5 rounded-xl bg-blue-600 text-white shrink-0 group-hover:scale-105 transition-transform">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-800">4. Upload Medical Reports</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Store lab test PDFs &amp; prescriptions securely.</p>
                </div>
              </Link>

              <Link
                href="/how-to-use"
                onClick={completeOnboarding}
                className="p-4 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200/80 text-left transition-all flex items-start gap-3 group"
              >
                <div className="p-2.5 rounded-xl bg-amber-600 text-white shrink-0 group-hover:scale-105 transition-transform">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-amber-800">5. View 9-Step Guide</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Read our full platform walk-through &amp; tips.</p>
                </div>
              </Link>

              <Link
                href="/contact"
                onClick={completeOnboarding}
                className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 text-left transition-all flex items-start gap-3 group"
              >
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0 group-hover:scale-105 transition-transform">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-800">6. Platform Support</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Call +91 7042363267 or chat on WhatsApp.</p>
                </div>
              </Link>
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">You can re-open this guide anytime from your dashboard header.</span>
              <button
                onClick={completeOnboarding}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-extrabold text-sm shadow-md transition-colors"
              >
                Got It! Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
