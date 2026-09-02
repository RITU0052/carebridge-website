'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Bot, Upload, FileText, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { useAuth } from '@/context/AuthContext';
import { UserReportItem } from '@/app/reports/page';

export default function AIHealthSummaryPage() {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const storageKey = `carebridge_user_${userId}_reports`;

  const [reports, setReports] = useState<UserReportItem[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>('');
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed: UserReportItem[] = JSON.parse(stored);
          setReports(parsed);
          if (parsed.length > 0) {
            setSelectedReportId(parsed[0].id);
            if (parsed[0].summary) {
              setSummary(parsed[0].summary);
            }
          }
        } else {
          setReports([]);
        }
      } catch (e) {
        console.error('Error loading reports:', e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [storageKey]);

  const handleSummarizeReport = async () => {
    const report = reports.find((r) => r.id === selectedReportId);
    if (!report) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/reports/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: report.id,
          userId,
          fileName: report.fileName,
          fileType: report.fileType,
          base64Data: report.base64Data,
        }),
      });

      const data = await res.json();

      if (data.success && data.summary) {
        setSummary(data.summary);

        // Save back to storage
        const updated = reports.map((r) => {
          if (r.id === report.id) {
            return {
              ...r,
              summaryStatus: 'Generated' as const,
              summary: data.summary,
            };
          }
          return r;
        });
        setReports(updated);
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } else {
        setErrorMsg(data.error || 'Unable to generate report summary.');
      }
    } catch (err) {
      console.error('Summarize error:', err);
      setErrorMsg('Network error generating summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'AI Health Summary Assistant', href: '/ai-health-summary' }]} />

        <MedicalDisclaimerBanner variant="card" />

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-teal-950 rounded-3xl p-8 sm:p-12 text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
              <Sparkles className="w-4 h-4" />
              <span>CareBridge AI Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Medical Report AI Summarizer
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Transform complex bloodwork, discharge summaries, and lab findings into clear, plain-language explanations structured for patients and caregivers.
            </p>
          </div>
        </div>

        {/* Interactive Analyzer Hub */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-slate-200/80 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <Bot className="w-7 h-7 text-teal-600" />
            <div>
              <h2 className="text-xl font-bold text-slate-900">Select Report for AI Analysis</h2>
              <p className="text-xs text-slate-500">Analyze uploaded lab records from your private vault</p>
            </div>
          </div>

          {reports.length === 0 ? (
            <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-3">
              <FileText className="w-10 h-10 text-slate-400 mx-auto" />
              <div>
                <p className="text-base font-bold text-slate-800">No medical reports uploaded yet.</p>
                <p className="text-xs text-slate-500 mt-1">Upload a PDF or lab result in your Reports Vault to generate an AI summary.</p>
              </div>
              <Link
                href="/reports"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold shadow hover:bg-teal-700"
              >
                <Upload className="w-4 h-4" />
                <span>Go to Reports Vault</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <select
                  value={selectedReportId}
                  onChange={(e) => {
                    setSelectedReportId(e.target.value);
                    const selected = reports.find((r) => r.id === e.target.value);
                    setSummary(selected?.summary || null);
                  }}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-600 focus:outline-none bg-white text-sm font-semibold"
                >
                  {reports.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.fileName} ({r.uploadedAt} • {r.fileType})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleSummarizeReport}
                  disabled={isLoading || !selectedReportId}
                  className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 active:scale-95 transition-all shrink-0"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing report...</span>
                    </>
                  ) : (
                    <>
                      <Bot className="w-5 h-5" />
                      <span>Generate AI Summary</span>
                    </>
                  )}
                </button>
              </div>

              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                  <button
                    onClick={handleSummarizeReport}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-[11px] flex items-center gap-1 shrink-0"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry</span>
                  </button>
                </div>
              )}

              {/* Output Display */}
              {summary && (
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-teal-200/80 space-y-4 mt-6">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2 text-teal-900 font-extrabold text-base">
                      <Sparkles className="w-5 h-5 text-teal-600" />
                      <span>Structured AI Summary</span>
                    </div>
                    <button
                      onClick={handleSummarizeReport}
                      disabled={isLoading}
                      className="text-xs text-teal-700 hover:text-teal-900 font-semibold underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Regenerate</span>
                    </button>
                  </div>

                  <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-3 whitespace-pre-wrap text-slate-800">
                    {summary}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
