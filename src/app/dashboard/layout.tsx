'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Tabs } from '@/components/common/Tabs';
import { Loading } from '@/components/ui';
import {
  useAppDispatch,
  useAppSelector,
  useGetCurrentUserAuthQuery,
  useListMyAgenciesQuery,
  setSelectedAgencyId,
  signOutLocally,
} from '@/hooks';
import { useGetSubscriptionQuery } from '@/redux/api/subscriptionApi';
import { SubscriptionGate } from '@/components/common/SubscriptionGate';

// Routes that are always accessible regardless of subscription or agency state
const BILLING_PATH = '/dashboard/billing';
const ALWAYS_ACCESSIBLE = ['/dashboard/agency-setup', BILLING_PATH];

// Subscription statuses that grant full platform access
const ACTIVE_STATUSES = new Set(['active', 'trialing', 'past_due']);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.user.accessToken);
  const hasToken = !!accessToken;

  const { data: userRes, isLoading: isUserLoading } = useGetCurrentUserAuthQuery(undefined, {
    skip: !hasToken,
  });

  const user = userRes?.data;
  const isAdmin = user?.role === 'manager';

  const { data: agencyRes, isLoading: isAgenciesLoading } = useListMyAgenciesQuery(undefined, {
    skip: !hasToken || !user?.email,
  });

  // Admins inherit their Account Holder's subscription — they are never gated.
  const { data: subResp, isLoading: isSubLoading } = useGetSubscriptionQuery(undefined, {
    skip: !hasToken || !user?.email || isAdmin,
  });

  const selectedAgencyId = useAppSelector((s) => s.agency.selectedAgencyId);
  const agencies = agencyRes?.data?.agencies ?? [];

  // ── Auth guard ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!hasToken) {
      router.replace('/auth/signin');
      return;
    }
    if (!isUserLoading && !user?.email) {
      dispatch(signOutLocally());
      router.replace('/auth/signin');
    }
  }, [hasToken, user, dispatch, isUserLoading, router]);

  // ── Agency setup guard (non-admins) ────────────────────────────────────────
  useEffect(() => {
    if (isUserLoading || isAgenciesLoading) return;
    if (!user?.email) return;
    if (isAdmin) return;

    const onAllowedPath = ALWAYS_ACCESSIBLE.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`),
    );

    if (agencies.length === 0 && !onAllowedPath) {
      router.replace('/dashboard/agency-setup');
    }
  }, [agencies, isAgenciesLoading, isUserLoading, isAdmin, pathname, router, user]);

  // ── Agency selector sync ───────────────────────────────────────────────────
  useEffect(() => {
    if (agencies.length === 0) return;
    const stillExists = agencies.some((a) => a._id === selectedAgencyId);
    if (!stillExists) {
      dispatch(setSelectedAgencyId(agencies[0]._id));
    }
  }, [agencies, selectedAgencyId, dispatch]);

  // ── Loading states ─────────────────────────────────────────────────────────
  if (!hasToken) return null;

  const isLoading =
    isUserLoading ||
    (user?.email && isAgenciesLoading) ||
    (!isAdmin && user?.email && isSubLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  // ── Subscription gate (account owners only) ────────────────────────────────
  const onAlwaysAccessible = ALWAYS_ACCESSIBLE.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (!isAdmin && !onAlwaysAccessible) {
    const subscription = subResp?.data ?? null;
    const hasActiveSub = subscription !== null && ACTIVE_STATUSES.has(subscription.status);

    if (!hasActiveSub) {
      return (
        <div className="min-h-screen bg-slate-950">
          <SubscriptionGate userPlan={user?.plan} />
        </div>
      );
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const hideTabs = onAlwaysAccessible;

  return (
    <div className="min-h-screen bg-slate-950">
      {!hideTabs && <Tabs />}
      {children}
    </div>
  );
}
