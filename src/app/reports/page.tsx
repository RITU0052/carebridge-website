'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  Sparkles,
  Bot,
  Trash2,
  AlertCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { MedicalDisclaimerBanner } from '@/components/ui/MedicalDisclaimerBanner';
import { useAuth } from '@/context/AuthContext';

export interface UserReportItem {
  id: string;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadedAt: string;
  summaryStatus: 'Not generated yet' | 'Generating' | 'Generated' | 'Error';
  summary?: string | null;
  base64Data?: string;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const userId = user?.id || 'guest';
  const storageKey = `carebridge_user_${userId}_reports`;

  const [reports, setReports] = useState<UserReportItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [summarizingId, setSummarizingId] = useState<string | null>(null);
  const [summaryErrorId, setSummaryErrorId] = useState<{ id: string; msg: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          setReports(JSON.parse(stored));
        } else {
          setReports([]);
        }
      } catch (e) {
        console.error('Error loading reports from storage:', e);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [storageKey]);

  const saveReports = (updated: UserReportItem[]) => {
    setReports(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error('Error saving reports:', e);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    // Validate size (15MB limit)
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File size exceeds 15MB limit. Please select a smaller document.');
      setIsUploading(false);
      return;
    }

    // Convert file to base64 for local text extraction
    const reader = new FileReader();
    reader.onload = async () => {
      const base64String = (reader.result as string).split(',')[1] || '';

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', userId);

        const res = await fetch('/api/reports/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();

        if (data.success && data.report) {
          const newReport: UserReportItem = {
            ...data.report,
            base64Data: base64String,
          };
          saveReports([newReport, ...reports]);
        } else {
          setUploadError(data.error || 'Failed to upload report.');
        }
      } catch (err) {
        console.error('Upload fetch error:', err);
        setUploadError('Network error uploading report. Please try again.');
      } finally {
        setIsUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleGenerateSummary = async (report: UserReportItem) => {
    setSummarizingId(report.id);
    setSummaryErrorId(null);

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
        saveReports(updated);
      } else {
        setSummaryErrorId({ id: report.id, msg: data.error || 'Unable to generate summary.' });
      }
    } catch (err) {
      console.error('Summary generation error:', err);
      setSummaryErrorId({ id: report.id, msg: 'Network error generating summary. Please try again.' });
    } finally {
      setSummarizingId(null);
    }
  };

  const handleDeleteReport = (id: string) => {
    const updated = reports.filter((r) => r.id !== id);
    saveReports(updated);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Breadcrumbs items={[{ label: 'Dashboard', href: '/dashboard' }, { label: 'Medical Reports Vault', href: '/reports' }]} />

        <MedicalDisclaimerBanner variant="card" />

        {/* Page Title & Action Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
              <FileText className="w-4 h-4" />
              <span>User Storage Vault</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Medical Reports &amp; Lab Records
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
              Securely store your bloodwork, clinical notes, and diagnostic records with plain-language AI summary generation.
            </p>
          </div>

          <div className="shrink-0">
            <label className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 active:scale-95 transition-all cursor-pointer min-h-[48px]">
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Uploading Report...</span>
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  <span>Upload New Report</span>
                </>
              )}
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {uploadError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Uploaded Reports List */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" />
            <span>Your Private Uploads ({reports.length})</span>
          </h2>

          {reports.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-4 shadow-sm">
              <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-lg font-bold text-slate-900">No medical reports uploaded yet.</h3>
                <p className="text-xs text-slate-500">
                  Upload your lab results (PDF, PNG, JPG up to 15MB) to get an automated AI health summary.
                </p>
              </div>
              <label className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 shadow cursor-pointer">
                <Upload className="w-4 h-4" />
                <span>Upload Report</span>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => {
                const isSummarizing = summarizingId === report.id;
                const hasError = summaryErrorId?.id === report.id;

                return (
                  <div
                    key={report.id}
                    className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-6 transition-all"
                  >
                    {/* Report Header Card */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm shrink-0">
                          {report.fileType}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-slate-900 text-base">{report.fileName}</h3>
                          <p className="text-xs text-slate-500">
                            Uploaded on {report.uploadedAt} • Size: {report.fileSize}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {report.summaryStatus === 'Generated' ? (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            <span>AI Summary Generated</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleGenerateSummary(report)}
                            disabled={isSummarizing}
                            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all"
                          >
                            {isSummarizing ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Analyzing report...</span>
                              </>
                            ) : (
                              <>
                                <Bot className="w-4 h-4" />
                                <span>Generate AI Summary</span>
                              </>
                            )}
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteReport(report.id)}
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Summary Error Alert */}
                    {hasError && (
                      <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                          <span>{summaryErrorId?.msg}</span>
                        </div>
                        <button
                          onClick={() => handleGenerateSummary(report)}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-[11px] flex items-center gap-1 shrink-0"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Retry</span>
                        </button>
                      </div>
                    )}

                    {/* Render AI Summary Content */}
                    {report.summary && (
                      <div className="p-6 rounded-2xl bg-slate-50 border border-teal-200/80 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                          <div className="flex items-center gap-2 text-teal-800 font-bold text-sm">
                            <Sparkles className="w-4 h-4 text-teal-600" />
                            <span>CareBridge AI Plain-Language Report Summary</span>
                          </div>
                          <button
                            onClick={() => handleGenerateSummary(report)}
                            disabled={isSummarizing}
                            className="text-xs text-teal-700 hover:text-teal-900 font-semibold underline flex items-center gap-1"
                          >
                            <RefreshCw className="w-3 h-3" />
                            <span>Regenerate Summary</span>
                          </button>
                        </div>

                        <div className="prose prose-slate max-w-none text-xs sm:text-sm leading-relaxed space-y-3 whitespace-pre-wrap text-slate-700">
                          {report.summary}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
