'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Pill,
  FileText,
  Stethoscope,
  Bell,
  MessageSquare,
  BarChart3,
  Cpu,
  FileEdit,
  ShieldAlert,
  Settings,
  LogOut,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const ADMIN_NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Patients', href: '/admin/patients', icon: UserCheck },
  { label: 'Medicines', href: '/admin/medicines', icon: Pill },
  { label: 'Health Reports', href: '/admin/reports', icon: FileText },
  { label: 'Doctors', href: '/admin/doctors', icon: Stethoscope },
  { label: 'Notifications', href: '/admin/notifications', icon: Bell },
  { label: 'Feedback & Support', href: '/admin/feedback', icon: MessageSquare },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'AI Management', href: '/admin/ai', icon: Cpu },
  { label: 'Content Management', href: '/admin/content', icon: FileEdit },
  { label: 'Security & Logs', href: '/admin/security', icon: ShieldAlert },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar({ mobileOpen, onCloseMobile }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    logout();
    router.push('/admin/login');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-800 text-slate-200">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-extrabold text-white text-base tracking-tight leading-tight">
              CareBridge
            </h2>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest block">
              Admin Ops
            </span>
          </div>
        </Link>
        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-teal-600/90 text-white shadow-md shadow-teal-900/30 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-teal-400'
                }`}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Sidebar Footer Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold border border-rose-800/80 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative w-64 max-w-[80vw] h-full z-10">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
