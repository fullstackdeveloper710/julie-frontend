'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs } from '@/components/common/Tabs';
import { Loading } from '@/components/ui';
import { useAppDispatch, useGetCurrentUserAuthQuery, logout } from '@/hooks';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetCurrentUserAuthQuery();

  useEffect(() => {
    if (!isLoading && !data?.data.email) {
      dispatch(logout());
      router.replace('/auth/signin');
    }
  }, [data, dispatch, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <Tabs />
      {children}
    </div>
  );
}
