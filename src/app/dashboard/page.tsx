'use client';

import Link from 'next/link';
import { EmptyState } from '@/components/ui';
import { BarChart3, CalendarCheck, ArrowRight } from 'lucide-react';
import { useAppSelector, useListMyAgenciesQuery, useGetAnnualCheckInStatusQuery } from '@/hooks';
import { useGetCurrentUserQuery } from '@/redux/api/authApi';

function AnnualCheckinNudge() {
  const { data: userResp } = useGetCurrentUserQuery();
  const isAdmin = userResp?.data?.role === 'manager';
  const { data: statusResp } = useGetAnnualCheckInStatusQuery(undefined, { skip: isAdmin });
  const status = statusResp?.data;

  if (isAdmin || !status?.canSubmit) return null;

  return (
    <div className="mb-8 rounded-lg border border-amber-500/30 bg-amber-500/5 px-5 py-4 flex items-start justify-between gap-4 flex-wrap">
      <div className="flex items-start gap-3">
        <CalendarCheck className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-amber-300">
            Complete your {new Date().getUTCFullYear()} Annual Check-In
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            The Annual Baseline drives your AI reports and analytics. It takes about 5 minutes and
            is required once per year.
          </p>
        </div>
      </div>
      <Link
        href="/dashboard/annual-checkin"
        className="shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 transition-colors border border-amber-500/30"
      >
        Start now
        <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

export default function DashboardPage() {
  const selectedAgencyId = useAppSelector((s) => s.agency.selectedAgencyId);
  const { data } = useListMyAgenciesQuery();
  const agencies = data?.data?.agencies ?? [];
  const selectedAgency = agencies.find((a) => a._id === selectedAgencyId) ?? agencies[0];

  return (
    <div className="px-7 py-8 max-w-6xl mx-auto">
      <AnnualCheckinNudge />

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <BarChart3 className="w-8 h-8" />
          Analytics
        </h1>
        <p className="text-sm text-slate-400">
          {selectedAgency
            ? `Active agency: ${selectedAgency.name}`
            : 'Comprehensive analytics and metrics'}
        </p>
      </div>

      <EmptyState
        title="No Analytics Data Available"
        description="Start by submitting monthly check-ins to see analytics and trends"
        icon="📊"
        layout="centered"
      />
    </div>
  );
}
