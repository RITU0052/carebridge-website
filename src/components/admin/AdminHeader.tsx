'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Bell, ShieldCheck, Menu, User, ChevronDown, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface AdminHeaderProps {
  onOpenMobileMenu?: () => void;
}

export function AdminHeader({ onOpenMobileMenu }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/admin/users?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch (err) {
      console.error(err);
    }
    logout();
    router.push('/admin/login');
  };

  return (
    <header className="sticky top-0 z-20 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-slate-800"
          aria-label="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden sm:block w-64 md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Global search users, patients, IDs..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50"
          />
        </form>
      </div>

      <div className="flex items-center gap-3">
        {/* Role Badge */}
        <span className="hidden lg:inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/30">
          {user?.role || 'SUPER_ADMIN'}
        </span>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 relative transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-400 ring-2 ring-slate-950 animate-pulse" />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-4 z-50 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">System Alerts</h4>
                <span className="text-[10px] text-teal-400 font-semibold">2 New</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-slate-200">New Doctor Verification Request</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Dr. Ananya Sharma submitted credentials</p>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="font-bold text-slate-200">System Report Ready</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Monthly analytics compliance report generated</p>
                </div>
              </div>
              <Link
                href="/admin/notifications"
                onClick={() => setNotifOpen(false)}
                className="block text-center text-xs font-bold text-teal-400 hover:underline pt-1"
              >
                View Notification Center →
              </Link>
            </div>
          )}
        </div>

        {/* User Account Menu */}
        <div className="relative">
          <button
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-white leading-tight">{user?.name || 'Administrator'}</p>
              <p className="text-[10px] text-slate-400 leading-tight">{user?.email || 'admin@carebridge.com'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {userDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50 space-y-1 text-xs font-semibold text-slate-300">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="font-bold text-white">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-slate-400">{user?.email}</p>
              </div>
              <Link
                href="/admin/settings"
                onClick={() => setUserDropdownOpen(false)}
                className="block px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white"
              >
                Admin Settings
              </Link>
              <Link
                href="/admin/security"
                onClick={() => setUserDropdownOpen(false)}
                className="block px-3 py-2 rounded-xl hover:bg-slate-800 hover:text-white"
              >
                Security Audit Logs
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full text-left px-3 py-2 rounded-xl text-rose-400 hover:bg-rose-950/50 hover:text-rose-300 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
