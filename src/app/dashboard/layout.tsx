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

const ALWAYS_ACCESSIBLE = ['/dashboard/agency-setup'];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname() ?? '';
    const dispatch = useAppDispatch();

    const accessToken = useAppSelector((s) => s.user.accessToken);
    const hasToken = !!accessToken;

    const { data: userRes, isLoading: isUserLoading } = useGetCurrentUserAuthQuery(
        undefined,
        { skip: !hasToken }
    );
    const { data: agencyRes, isLoading: isAgenciesLoading } = useListMyAgenciesQuery(
        undefined,
        { skip: !hasToken || !userRes?.data?.email }
    );

    const selectedAgencyId = useAppSelector((s) => s.agency.selectedAgencyId);
    const agencies = agencyRes?.data?.agencies ?? [];
    const isAdmin = userRes?.data?.role === 'manager';

    // Redirect unauthenticated users out of the dashboard. Two conditions:
    //   1. No token at all → user logged out / never signed in.
    //   2. Token present but /auth/me returned no email → token is bad.
    useEffect(() => {
        if (!hasToken) {
            router.replace('/auth/signin');
            return;
        }
        if (!isUserLoading && !userRes?.data?.email) {
            dispatch(signOutLocally());
            router.replace('/auth/signin');
        }
    }, [hasToken, userRes, dispatch, isUserLoading, router]);

    // Mandatory onboarding: Account Holders without an agency are forced to
    // /agency-setup. Admins inherit the Account Holder's agency context, so
    // they're never funnelled through agency setup — even if their inviter
    // hasn't created one yet, they just see the dashboard.
    useEffect(() => {
        if (isUserLoading || isAgenciesLoading) return;
        if (!userRes?.data?.email) return;
        if (isAdmin) return;

        const onAllowedPath = ALWAYS_ACCESSIBLE.some(
            (p) => pathname === p || pathname.startsWith(`${p}/`)
        );

        if (agencies.length === 0 && !onAllowedPath) {
            router.replace('/dashboard/agency-setup');
        }
    }, [agencies, isAgenciesLoading, isUserLoading, isAdmin, pathname, router, userRes]);

    // Keep the selected agency id valid: if the persisted id is missing or stale,
    // fall back to the first agency we know about.
    useEffect(() => {
        if (agencies.length === 0) return;
        const stillExists = agencies.some((a) => a._id === selectedAgencyId);
        if (!stillExists) {
            dispatch(setSelectedAgencyId(agencies[0]._id));
        }
    }, [agencies, selectedAgencyId, dispatch]);

    // No token: redirect is in flight from the effect above. Render nothing
    // so we don't flash the dashboard chrome (Tabs, children) while leaving.
    if (!hasToken) {
        return null;
    }

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
