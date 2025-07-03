'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { useAuth } from '@/components/auth/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, profile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profile) {
      router.push('/login');
    }
  }, [loading, profile, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-pink-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gradient-to-r from-blue-600 to-pink-600 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-slate-200 rounded mb-2"></div>
          <div className="h-3 w-24 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null; // Will redirect in the useEffect
  }

  return <MainLayout>{children}</MainLayout>;
}