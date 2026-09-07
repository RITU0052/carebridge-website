'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { safeFetchJson } from '@/lib/fetchHelper';

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

    if (!email || !password) {
      setError('Please fill in both admin email and password.');
      return;
    }

    setLoading(true);

    const { ok, data, error: fetchErr } = await safeFetchJson('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    setLoading(false);

    if (ok && data?.success) {
      await login(email, password);
      router.push('/admin/dashboard');
    } else {
      setError(data?.error || fetchErr || 'Admin login failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 text-center">
        <Breadcrumbs items={[{ label: 'Admin Portal', href: '/admin/login' }]} />

        <div className="flex justify-center mb-6">
          <Link href="/" className="bg-slate-900 p-3 rounded-2xl shadow-2xl border border-slate-800 inline-block">
            <Image src="/logo.png" alt="CareBridge AI Logo" width={180} height={50} className="object-contain max-h-12 w-auto" />
          </Link>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-teal-500/20 text-teal-400 border border-teal-500/30 mx-auto flex items-center justify-center mb-3">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">CareBridge Admin Operations</h1>
        <p className="mt-2 text-xs text-slate-400 max-w-sm mx-auto">
          Secure, token-authenticated administration panel for user management, system audit logs, and medical workflow oversight.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-slate-900/90 py-8 px-6 shadow-2xl rounded-3xl border border-slate-800 sm:px-10 backdrop-blur-md space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-start gap-3 text-rose-200 text-xs font-semibold">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Email / Username
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@carebridge.com"
                  className="block w-full pl-10 pr-4 py-3 border border-slate-800 rounded-xl leading-5 bg-slate-950 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Admin Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-4 py-3 border border-slate-800 rounded-xl leading-5 bg-slate-950 text-white placeholder-slate-500 focus:ring-2 focus:ring-teal-500 text-xs font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-lg text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 focus:ring-2 focus:ring-teal-400 disabled:opacity-60 transition-colors"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Authenticating Admin...</span>
                </>
              ) : (
                <>
                  <span>Sign In as Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center text-[11px] text-slate-400 space-y-1">
            <p>Protected by rate-limiting &amp; audit logging</p>
          </div>
        </div>
      </div>
    </div>
  );
}
