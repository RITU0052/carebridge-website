'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/dashboard');
  }, [router]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center text-slate-400 text-sm font-semibold">
      Redirecting to CareBridge Admin Operations...
    </div>
  );
}
