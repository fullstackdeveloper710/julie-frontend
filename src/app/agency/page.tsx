'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useListMyAgenciesQuery } from '@/redux';

export default function AgencyPage() {
  const router = useRouter();
  const user = useAppSelector((state) => state.user.user);
  const { data: agenciesData, isLoading } = useListMyAgenciesQuery();
  const agencies = agenciesData?.data?.agencies ?? [];

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!user) {
      router.replace('/auth/signin');
      return;
    }

    // Wait for agencies data to load
    if (isLoading) {
      return;
    }

    // If user has agencies, redirect to dashboard
    if (agencies && agencies.length > 0) {
      router.replace('/dashboard');
      return;
    }

    // If no agencies, user needs to create one
    // You can either show a creation form here or redirect to an agency creation page
    // For now, we'll redirect to dashboard which has the create agency modal
    router.replace('/dashboard');
  }, [user, agencies, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <div className="mb-4 w-16 h-16 mx-auto rounded-full border-4 border-slate-700 border-t-orange-500 animate-spin"></div>
        <h1 className="text-white text-2xl font-bold mb-2">Setting Up Your Account</h1>
        <p className="text-slate-400">Preparing your agency dashboard...</p>
      </div>
    </div>
  );
}
