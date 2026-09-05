'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  Pill,
  Activity,
  FileText,
  PhoneCall,
  Sparkles,
  User,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
    setFeaturesOpen(false);
  };

  const featureLinks = [
    { name: 'AI Health Summary', href: '/ai-health-summary', icon: Sparkles, desc: 'Intelligent health info & record summaries' },
    { name: 'Health Reports', href: '/reports', icon: FileText, desc: 'Digital lab & report storage' },
    { name: 'Medicine Reminders', href: '/features/medicine-reminder', icon: Pill, desc: 'Schedules & dosage tracking' },
    { name: 'Health Monitoring', href: '/features/health-monitoring', icon: Activity, desc: 'Daily vitals & wellness trends' },
    { name: 'Emergency Support', href: '/features/emergency-support', icon: PhoneCall, desc: 'One-tap family alert circle' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5' : 'bg-white py-3.5 border-b border-slate-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo with CareBridge AI Logo image */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 rounded-lg p-1"
          >
            <div className="relative h-11 w-36 sm:w-44 flex items-center">
              <Image
                src="/logo.png"
                alt="CareBridge AI Logo"
                width={176}
                height={48}
                priority
                className="object-contain max-h-12 w-auto"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-medium text-slate-700">
            <Link
              href="/"
              className={`px-3 py-2 rounded-lg text-sm hover:text-teal-700 hover:bg-slate-50 transition-colors ${
                pathname === '/' ? 'text-teal-700 font-semibold bg-teal-50/60' : ''
              }`}
            >
              Home
            </Link>

            {/* Features Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setFeaturesOpen(true)}
              onMouseLeave={() => setFeaturesOpen(false)}
            >
              <Link
                href="/features"
                className={`px-3 py-2 rounded-lg text-sm hover:text-teal-700 hover:bg-slate-50 transition-colors inline-flex items-center gap-1 ${
                  pathname.startsWith('/features') ? 'text-teal-700 font-semibold bg-teal-50/60' : ''
                }`}
                aria-expanded={featuresOpen}
              >
                <span>Features</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${featuresOpen ? 'rotate-180' : ''}`} />
              </Link>

              {featuresOpen && (
                <div className="absolute left-0 top-full pt-2 w-72 z-50">
                  <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 p-2 space-y-1">
                    {featureLinks.map((feat) => {
                      const Icon = feat.icon;
                      return (
                        <Link
                          key={feat.href}
                          href={feat.href}
                          className={`flex items-start gap-3 p-2.5 rounded-xl hover:bg-teal-50/60 transition-colors group ${
                            pathname === feat.href ? 'bg-teal-50' : ''
                          }`}
                        >
                          <div className="p-2 rounded-lg bg-teal-100/70 text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-slate-900 group-hover:text-teal-800">{feat.name}</p>
                            <p className="text-[11px] text-slate-500">{feat.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/ai-health-summary"
              className={`px-3 py-2 rounded-lg text-sm hover:text-teal-700 hover:bg-slate-50 transition-colors ${
                pathname === '/ai-health-summary' ? 'text-teal-700 font-semibold bg-teal-50/60' : ''
              }`}
            >
              AI Health Summary
            </Link>

            <Link
              href="/reports"
              className={`px-3 py-2 rounded-lg text-sm hover:text-teal-700 hover:bg-slate-50 transition-colors ${
                pathname === '/reports' ? 'text-teal-700 font-semibold bg-teal-50/60' : ''
              }`}
            >
              Reports
            </Link>

            <Link
              href="/about"
              className={`px-3 py-2 rounded-lg text-sm hover:text-teal-700 hover:bg-slate-50 transition-colors ${
                pathname === '/about' ? 'text-teal-700 font-semibold bg-teal-50/60' : ''
              }`}
            >
              About
            </Link>

            <Link
              href="/how-to-use"
              className={`px-3 py-2 rounded-lg text-sm hover:text-teal-700 hover:bg-slate-50 transition-colors ${
                pathname === '/how-to-use' ? 'text-teal-700 font-semibold bg-teal-50/60' : ''
              }`}
            >
              How to Use
            </Link>

            <Link
              href="/help"
              className={`px-3 py-2 rounded-lg text-sm hover:text-teal-700 hover:bg-slate-50 transition-colors ${
                pathname === '/help' ? 'text-teal-700 font-semibold bg-teal-50/60' : ''
              }`}
            >
              Help
            </Link>

            <Link
              href="/feedback"
              className={`px-3 py-2 rounded-lg text-sm hover:text-teal-700 hover:bg-slate-50 transition-colors ${
                pathname === '/feedback' ? 'text-teal-700 font-semibold bg-teal-50/60' : ''
              }`}
            >
              Feedback
            </Link>

            <Link
              href="/contact"
              className={`px-3 py-2 rounded-lg text-sm hover:text-teal-700 hover:bg-slate-50 transition-colors ${
                pathname === '/contact' ? 'text-teal-700 font-semibold bg-teal-50/60' : ''
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Auth Call to Action */}
          <div className="hidden lg:flex items-center gap-3">
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-16 h-9 bg-slate-100 rounded-full animate-pulse" />
                <div className="w-20 h-9 bg-slate-100 rounded-full animate-pulse" />
              </div>
            ) : isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200/80 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4 text-teal-600" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 text-slate-500" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-full text-sm font-medium text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20 active:scale-95 transition-all focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 min-h-[42px]"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Trigger & Quick Action */}
          <div className="flex lg:hidden items-center gap-2">
            {isLoading ? (
              <div className="w-16 h-7 bg-slate-100 rounded-full animate-pulse" />
            ) : !isAuthenticated ? (
              <Link
                href="/login"
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-teal-700 bg-teal-50 border border-teal-200"
              >
                Login
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="px-3 py-1.5 rounded-full text-xs font-semibold text-white bg-teal-600"
              >
                Dashboard
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-600 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm top-[65px]" onClick={() => setIsOpen(false)}>
          <nav
            className="bg-white border-b border-slate-200 p-6 space-y-4 max-h-[calc(100vh-70px)] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 px-3 pb-1">Navigation</p>
              <Link href="/" onClick={closeMenu} className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-900 hover:bg-teal-50">
                Home
              </Link>
              <Link href="/features" onClick={closeMenu} className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-900 hover:bg-teal-50">
                Features
              </Link>
              <Link href="/ai-health-summary" onClick={closeMenu} className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-900 hover:bg-teal-50">
                AI Health Summary
              </Link>
              <Link href="/reports" onClick={closeMenu} className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-900 hover:bg-teal-50">
                Reports
              </Link>
              <Link href="/about" onClick={closeMenu} className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-900 hover:bg-teal-50">
                About
              </Link>
              <Link href="/how-to-use" onClick={closeMenu} className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-900 hover:bg-teal-50">
                How to Use
              </Link>
              <Link href="/help" onClick={closeMenu} className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-900 hover:bg-teal-50">
                Help & Guide
              </Link>
              <Link href="/feedback" onClick={closeMenu} className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-900 hover:bg-teal-50">
                Give Feedback
              </Link>
              <Link href="/contact" onClick={closeMenu} className="block px-3 py-2 rounded-xl text-base font-semibold text-slate-900 hover:bg-teal-50">
                Contact
              </Link>
            </div>

            <hr className="border-slate-100" />

            <div className="pt-2 space-y-2">
              {isLoading ? (
                <div className="w-full h-12 bg-slate-100 rounded-xl animate-pulse" />
              ) : isAuthenticated && user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-teal-50 border border-teal-100">
                    <User className="w-5 h-5 text-teal-600" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={closeMenu}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-base font-bold text-white bg-teal-600 hover:bg-teal-700"
                  >
                    <LayoutDashboard className="w-5 h-5" />
                    <span>Go to Dashboard</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200"
                  >
                    <LogOut className="w-4 h-4 text-slate-500" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/login"
                    onClick={closeMenu}
                    className="flex items-center justify-center py-3 px-4 rounded-xl text-base font-bold text-slate-800 bg-slate-100 hover:bg-slate-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={closeMenu}
                    className="flex items-center justify-center py-3 px-4 rounded-xl text-base font-bold text-white bg-teal-600 hover:bg-teal-700 shadow-md shadow-teal-600/20"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
