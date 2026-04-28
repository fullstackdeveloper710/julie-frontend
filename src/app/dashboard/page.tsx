'use client';

import { EmptyState } from '@/components/ui';
import { BarChart3 } from 'lucide-react';
import { useAppSelector, useListMyAgenciesQuery } from '@/hooks';

export default function DashboardPage() {
    const selectedAgencyId = useAppSelector((s) => s.agency.selectedAgencyId);
    const { data } = useListMyAgenciesQuery();
    const agencies = data?.data?.agencies ?? [];
    const selectedAgency =
        agencies.find((a) => a._id === selectedAgencyId) ?? agencies[0];

    return (
        <div className="px-7 py-8 max-w-6xl mx-auto">
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
