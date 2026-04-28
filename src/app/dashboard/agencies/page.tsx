'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Plus, Pencil } from 'lucide-react';
import { Loading } from '@/components/ui';
import {
    useAppDispatch,
    useAppSelector,
    useListMyAgenciesQuery,
    setSelectedAgencyId,
} from '@/hooks';
import { useGetCurrentUserQuery } from '@/redux/api/authApi';
import { extractRtkErrorMessage } from '@/utils/rtkErrorHandler';

export default function AgenciesPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const selectedAgencyId = useAppSelector((s) => s.agency.selectedAgencyId);
    const { data, isLoading, error } = useListMyAgenciesQuery();
    const { data: userResp } = useGetCurrentUserQuery();

    const agencies = data?.data?.agencies ?? [];
    const capacity = data?.data?.capacity;
    const errorMessage = extractRtkErrorMessage(error);
    const isEnterprise = userResp?.data?.plan === 'Enterprise';
    const isAdmin = userResp?.data?.role === 'manager';
    const canAddAgency = !isAdmin && isEnterprise && !!capacity?.canCreateMore;
    const canEditAgency = !isAdmin;

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <div className="px-7 py-8 max-w-5xl mx-auto">
            <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
                <div>
                    <h1
                        className="text-3xl font-bold text-white mb-1 flex items-center gap-3"
                        style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
                    >
                        <Building2 className="w-7 h-7" />
                        Your Agencies
                    </h1>
                    <p className="text-sm text-slate-400">
                        {isAdmin
                            ? "Read-only view of your Account Holder's agencies."
                            : capacity
                              ? `Plan: ${capacity.plan ?? 'Standard'} • ${capacity.used} of ${capacity.maxAllowed} agencies used`
                              : 'Manage agencies you administer.'}
                    </p>
                </div>

                {canAddAgency && (
                    <Link
                        href="/dashboard/agency-setup?mode=add"
                        className="inline-flex items-center gap-2 px-5 py-3 font-bold text-xs uppercase tracking-widest text-slate-950 bg-(--accent) hover:bg-orange-600 rounded-lg transition-colors"
                        style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
                    >
                        <Plus className="w-4 h-4" />
                        Add Agency
                    </Link>
                )}
            </div>

            {errorMessage && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 text-xs px-3 py-2 rounded">
                    {errorMessage}
                </div>
            )}

            {agencies.length === 0 ? (
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center text-slate-400">
                    No agencies yet. Set up your first agency to get started.
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {agencies.map((agency) => {
                        const isActive = agency._id === selectedAgencyId;
                        return (
                            <div
                                key={agency._id}
                                className={`bg-slate-800 border rounded-lg p-5 transition-colors ${
                                    isActive
                                        ? 'border-(--accent)'
                                        : 'border-slate-700 hover:border-slate-600'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div>
                                        <h3 className="text-white font-bold text-lg">
                                            {agency.name}
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            {agency.type} • {agency.sizeCategory}
                                        </p>
                                    </div>
                                    {isActive && (
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-(--accent) border border-(--accent)/40 px-2 py-1 rounded">
                                            Active
                                        </span>
                                    )}
                                </div>
                                <dl className="space-y-1 text-xs text-slate-400 mb-5">
                                    <div className="flex justify-between gap-3">
                                        <dt>Jurisdiction</dt>
                                        <dd className="text-slate-200">
                                            {agency.primaryServiceJurisdiction}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between gap-3">
                                        <dt>Coverage</dt>
                                        <dd className="text-slate-200">{agency.coverageArea}</dd>
                                    </div>
                                </dl>
                                <div className="flex gap-2">
                                    {!isActive && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                dispatch(setSelectedAgencyId(agency._id));
                                                router.push('/dashboard');
                                            }}
                                            className="flex-1 px-3 py-2 text-xs font-bold uppercase tracking-widest text-gray-300 border border-slate-600 rounded-lg hover:border-slate-500 hover:text-white transition-colors"
                                            style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
                                        >
                                            Switch To
                                        </button>
                                    )}
                                    {canEditAgency && (
                                        <Link
                                            href={`/dashboard/agencies/${agency._id}`}
                                            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-widest text-slate-950 bg-(--accent) hover:bg-orange-600 rounded-lg transition-colors"
                                            style={{ fontFamily: '"Barlow Condensed", sans-serif' }}
                                        >
                                            <Pencil className="w-3.5 h-3.5" />
                                            Edit
                                        </Link>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
