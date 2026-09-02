import React from 'react';
import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  badge?: string;
}

export function FeatureCard({ icon: Icon, title, description, href, badge }: FeatureCardProps) {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between group">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12 rounded-2xl bg-teal-100/80 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors shadow-sm">
            <Icon className="w-6 h-6" />
          </div>
          {badge && (
            <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
              {badge}
            </span>
          )}
        </div>

        <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
          {title}
        </h3>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {description}
        </p>
      </div>

      {href && (
        <div className="pt-6 mt-4 border-t border-slate-100">
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:text-teal-800 transition-colors group-hover:translate-x-1 duration-200"
          >
            <span>Learn More</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}
