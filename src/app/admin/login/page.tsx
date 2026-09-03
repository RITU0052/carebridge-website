'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@carebridge.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.message || 'Admin login failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-[85vh] bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center">
        <Breadcrumbs items={[{ label: 'Admin Portal', href: '/admin/login' }]} />

        <div className="flex justify-center mb-6">
          <Link href="/" className="bg-slate-800 p-3 rounded-2xl shadow-xl border border-slate-700 inline-block">
            <Image src="/logo.png" alt="CareBridge AI Logo" width={180} height={50} className="object-contain max-h-12 w-auto" />
          </Link>
        </div>

        <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 mx-auto flex items-center justify-center mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">CareBridge Admin Portal</h1>
        <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto">
          Administrative sign in for monitoring feedback, user management, and automated email audit dispatches.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-800/90 py-8 px-6 shadow-2xl rounded-3xl border border-slate-700/80 sm:px-10 backdrop-blur-md">
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-start gap-3 text-rose-200 text-sm">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@carebridge.com"
                  className="block w-full pl-10 pr-4 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-900 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-900 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 sm:text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-base font-bold text-white bg-teal-600 hover:bg-teal-500 focus:ring-2 focus:ring-teal-400 disabled:opacity-60"
            >
              {loading ? (
                <span>Authenticating Admin...</span>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-700/60 text-center text-xs text-slate-400 space-y-1">
            <p>Demo Admin Credentials: <strong className="text-teal-400">admin@carebridge.com</strong> / <strong className="text-teal-400">admin123</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
}
