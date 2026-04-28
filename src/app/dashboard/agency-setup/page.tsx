'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loading } from '@/components/ui';
import { AgencyDetailsForm } from '@/components/forms/agency';
import {
    useAppDispatch,
    useCreateAgencyMutation,
    useListMyAgenciesQuery,
    setSelectedAgencyId,
} from '@/hooks';
import { extractRtkErrorMessage } from '@/utils/rtkErrorHandler';

export default function AgencySetupPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    // `mode=add` lets enterprise users intentionally land on the setup page
    // to create their second agency without being bounced back to the dashboard.
    const isAddMode = searchParams.get('mode') === 'add';

    const { data: list, isLoading: isListLoading } = useListMyAgenciesQuery();
    const [createAgency, { isLoading: isSubmitting, error: submitError }] =
        useCreateAgencyMutation();
    const [success, setSuccess] = useState('');

    const agencies = list?.data?.agencies ?? [];
    const capacity = list?.data?.capacity;

    // If the user already has at least one agency and they did not explicitly
    // ask to add another, route them onward to the dashboard.
    useEffect(() => {
        if (isListLoading) return;
        if (!isAddMode && agencies.length > 0) {
            const first = agencies[0];
            if (first?._id) dispatch(setSelectedAgencyId(first._id));
            router.replace('/dashboard');
        }
    }, [isListLoading, isAddMode, agencies, dispatch, router]);

    // Block enterprise add-mode if the user is at the limit.
    useEffect(() => {
        if (isAddMode && capacity && !capacity.canCreateMore) {
            router.replace('/dashboard/agencies');
        }
    }, [isAddMode, capacity, router]);

    const handleSubmit = async (payload: any) => {
        setSuccess('');
        try {
            const res = await createAgency(payload).unwrap();
            const newAgencyId = res?.data?._id;
            if (newAgencyId) {
                dispatch(setSelectedAgencyId(newAgencyId));
            }
            setSuccess('Agency saved successfully.');
            setTimeout(() => router.replace('/dashboard'), 800);
        } catch {
            // submitError below will surface the message
        }
    };

    if (isListLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <AgencyDetailsForm
            title={isAddMode ? 'Add Another Agency' : 'Complete Your Agency Details'}
            subtitle={
                isAddMode
                    ? 'Enterprise plans support up to 2 agencies. Fill in the details for the new agency.'
                    : "We need a few details about your agency before you can use the dashboard. You can edit these later from the Agencies page."
            }
            submitLabel={isAddMode ? 'Add Agency' : 'Save and Continue'}
            submittingLabel="Saving..."
            isSubmitting={isSubmitting}
            submitError={extractRtkErrorMessage(submitError)}
            successMessage={success}
            onSubmit={handleSubmit}
            onCancel={
                isAddMode ? () => router.replace('/dashboard/agencies') : undefined
            }
        />
    );
}
