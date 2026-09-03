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
  Calendar
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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

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
                      Email Support
                    </a>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span>WhatsApp Support</span>
                    <a
                      href="https://wa.me/917042363267?text=Hello%20CareBridge%2C%20I%20have%20a%20query%20regarding%20your%20platform."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-600 hover:underline"
                    >
                      +91 7042363267
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
    </div>
  );
}
