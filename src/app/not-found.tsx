import React from 'react';
import Link from 'next/link';
import { Home, ArrowRight, HeartHandshake } from 'lucide-react';
import { constructMetadata } from '@/lib/seo';

export const metadata = constructMetadata({
  title: 'Page Not Found (404)',
  description: 'The page you are looking for does not exist or has been moved.',
  path: '/404',
  noindex: true,
});

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center space-y-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xl">
        <div className="w-20 h-20 rounded-3xl bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-sm">
          <HeartHandshake className="w-10 h-10" />
        </div>

        <div className="space-y-3">
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
            Error 404
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Page Not Found
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            Sorry, we couldn’t find the page you were looking for. It might have been moved or the URL may be incorrect.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            href="/features"
            className="w-full sm:w-auto px-6 py-3.5 rounded-full font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Features</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
          Need help? <Link href="/contact" className="text-teal-700 font-semibold underline">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}
