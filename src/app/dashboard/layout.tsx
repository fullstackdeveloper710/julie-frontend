'use client';

import { Tabs } from '@/components/common/Tabs';
import { Loading } from '@/components/ui';
import { useGetCurrentUserAuthQuery } from '@/hooks';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading } = useGetCurrentUserAuthQuery();

  // Temporary auth bypass: allow dashboard access without redirecting to sign-in.
  // Restore the redirect logic below after testing is complete.
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
