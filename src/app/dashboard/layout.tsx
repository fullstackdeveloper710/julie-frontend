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
    logout,
} from '@/hooks';

const ALWAYS_ACCESSIBLE = ['/dashboard/agency-setup'];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname() ?? '';
    const dispatch = useAppDispatch();

    const { data: userRes, isLoading: isUserLoading } = useGetCurrentUserAuthQuery();
    const { data: agencyRes, isLoading: isAgenciesLoading } = useListMyAgenciesQuery(
        undefined,
        { skip: !userRes?.data?.email }
    );

    const selectedAgencyId = useAppSelector((s) => s.agency.selectedAgencyId);
    const agencies = agencyRes?.data?.agencies ?? [];

    // Redirect unauthenticated users out of the dashboard.
    useEffect(() => {
        if (!isUserLoading && !userRes?.data?.email) {
            dispatch(logout());
            router.replace('/auth/signin');
        }
    }, [userRes, dispatch, isUserLoading, router]);

    // Mandatory onboarding: any dashboard route except /agency-setup is blocked
    // until the user has at least one agency.
    useEffect(() => {
        if (isUserLoading || isAgenciesLoading) return;
        if (!userRes?.data?.email) return;

        const onAllowedPath = ALWAYS_ACCESSIBLE.some(
            (p) => pathname === p || pathname.startsWith(`${p}/`)
        );

        if (agencies.length === 0 && !onAllowedPath) {
            router.replace('/dashboard/agency-setup');
        }
    }, [agencies, isAgenciesLoading, isUserLoading, pathname, router, userRes]);

    // Keep the selected agency id valid: if the persisted id is missing or stale,
    // fall back to the first agency we know about.
    useEffect(() => {
        if (agencies.length === 0) return;
        const stillExists = agencies.some((a) => a._id === selectedAgencyId);
        if (!stillExists) {
            dispatch(setSelectedAgencyId(agencies[0]._id));
        }
    }, [agencies, selectedAgencyId, dispatch]);

    if (isUserLoading || (userRes?.data?.email && isAgenciesLoading)) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    const hideTabs = ALWAYS_ACCESSIBLE.some(
        (p) => pathname === p || pathname.startsWith(`${p}/`)
    );

    return (
        <div className="min-h-screen bg-slate-950">
            {!hideTabs && <Tabs />}
            {children}
        </div>
    );
}
