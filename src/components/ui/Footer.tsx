import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Mail, Phone } from 'lucide-react';
import { MedicalDisclaimerBanner } from './MedicalDisclaimerBanner';

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block focus:outline-none rounded-lg">
              <div className="relative h-12 w-48 flex items-center bg-white/90 p-1.5 rounded-xl">
                <Image
                  src="/logo.png"
                  alt="CareBridge AI Logo"
                  width={180}
                  height={48}
                  className="object-contain max-h-10 w-auto"
                />
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              CareBridge helps families monitor medicines, health reports, reminders, and AI-powered health summaries in one secure platform.
            </p>

            <div className="pt-2 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0" />
                <span>Privacy-First Architecture &amp; Data Protection</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <a href="mailto:support.carebridge@gmail.com" className="hover:text-teal-300 transition-colors">
                  support.carebridge@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <a href="tel:+917042363267" className="hover:text-teal-300 transition-colors font-medium">
                      +91 7042363267
                    </a>
                    <span>•</span>
                    <a href="tel:+919953920052" className="hover:text-teal-300 transition-colors font-medium">
                      +91 9953920052
                    </a>
                  </div>
                  <div>
                    <a
                      href="https://wa.me/917042363267?text=Hello%20CareBridge%20Support%2C%20I%20need%20help%20with%20CareBridge."
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Chat with CareBridge Support on WhatsApp"
                      className="font-bold text-emerald-400 hover:text-emerald-300 transition-colors text-xs"
                    >
                      WhatsApp Support (+91 7042363267)
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <p className="text-white font-semibold text-sm uppercase tracking-wider">Platform Features</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/ai-health-summary" className="hover:text-teal-400 transition-colors">
                  AI Health Summary
                </Link>
              </li>
              <li>
                <Link href="/reports" className="hover:text-teal-400 transition-colors">
                  Reports Vault
                </Link>
              </li>
              <li>
                <Link href="/features/medicine-reminder" className="hover:text-teal-400 transition-colors">
                  Medicine Reminders
                </Link>
              </li>
              <li>
                <Link href="/features/health-monitoring" className="hover:text-teal-400 transition-colors">
                  Health Monitoring
                </Link>
              </li>
              <li>
                <Link href="/features/emergency-support" className="hover:text-teal-400 transition-colors">
                  Emergency Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Account & Navigation */}
          <div className="space-y-3">
            <p className="text-white font-semibold text-sm uppercase tracking-wider">Account & Access</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/login" className="hover:text-teal-400 transition-colors">
                  User Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-teal-400 transition-colors">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/forgot-password" className="hover:text-teal-400 transition-colors">
                  Forgot Password
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-teal-400 transition-colors">
                  Secure Dashboard
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-teal-400 transition-colors">
                  About CareBridge
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div className="space-y-3">
            <p className="text-white font-semibold text-sm uppercase tracking-wider">Support & Legal</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link href="/feedback" className="hover:text-teal-400 transition-colors text-teal-300 font-medium">
                  Give Feedback
                </Link>
              </li>
              <li>
                <Link href="/how-to-use" className="hover:text-teal-400 transition-colors">
                  How to Use CareBridge
                </Link>
              </li>
              <li>
                <Link href="/help" className="hover:text-teal-400 transition-colors">
                  Help & Getting Started
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-teal-400 transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-teal-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-teal-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-teal-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-teal-400 transition-colors text-amber-300">
                  Medical Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Emergency Notice & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center md:text-left">
          <p>&copy; 2026 CareBridge AI Healthcare Platform. All rights reserved.</p>
          <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 max-w-xl text-left">
            <span className="font-bold text-rose-400">Medical Emergency Notice: </span>
            CareBridge is not an emergency medical response service. If you are experiencing a life-threatening medical emergency, call 911 or your local emergency team immediately.
          </div>
        </div>
      </div>
      <div className="mt-8">
        <MedicalDisclaimerBanner variant="banner" />
      </div>
    </footer>
  );
}
