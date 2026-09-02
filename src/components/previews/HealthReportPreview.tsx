'use client';

import React, { useState } from 'react';
import { FileText, Sparkles, Download, Lock, CheckCircle } from 'lucide-react';

export function HealthReportPreview() {
  const [showSummary, setShowSummary] = useState(true);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden max-w-xl mx-auto">
      {/* Header */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-base text-white">Digital Medical Report Vault</h4>
            <p className="text-xs text-slate-400">Encrypted Document Storage</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
          <Lock className="w-3.5 h-3.5" />
          <span>256-Bit Encrypted</span>
        </div>
      </div>

      {/* Report Card */}
      <div className="p-5 sm:p-6 space-y-4">
        <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-100 px-2 py-0.5 rounded-md">
              Pathology &amp; Bloodwork
            </span>
            <h5 className="font-bold text-slate-900 text-base">Comprehensive Metabolic Panel (CMP)</h5>
            <p className="text-xs text-slate-500">Uploaded Aug 24, 2026 • Issued by City Health Labs</p>
          </div>
          <button
            type="button"
            onClick={() => setShowSummary(!showSummary)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors shrink-0 flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>{showSummary ? 'Hide AI Summary' : 'View AI Summary'}</span>
          </button>
        </div>

        {/* AI Summary Drawer */}
        {showSummary && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-sky-50 border border-teal-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-teal-900 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>CareBridge AI Plain-Language Summary</span>
              </div>
              <span className="text-[10px] text-teal-700 font-medium bg-white/80 px-2 py-0.5 rounded-md border border-teal-200">
                Educational Tool
              </span>
            </div>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Kidney Function (eGFR &amp; BUN):</strong> Results are stable within healthy reference ranges.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Glucose Level:</strong> Slightly elevated at 108 mg/dL (fasting). Recommended to review diet during next checkup.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Electrolytes:</strong> Sodium and Potassium levels remain optimal.</span>
              </li>
            </ul>

            <div className="pt-2 border-t border-teal-200/60 flex items-center justify-between text-[11px] text-slate-500">
              <span>* AI summaries provide educational assistance and do not replace doctor consultation.</span>
              <button type="button" className="text-teal-700 font-bold hover:underline flex items-center gap-1">
                <Download className="w-3 h-3" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
